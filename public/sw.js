const STATIC_CACHE = "namaj-shikkha-static-v2";
const CONTENT_CACHE = "namaj-shikkha-content-v2";
const FONT_CACHE = "namaj-shikkha-fonts-v2";
const AUDIO_CACHE = "namaj-shikkha-audio-v2";

const MAX_AUDIO_CACHE_ITEMS = 60;
const MAX_FONT_CACHE_ITEMS = 20;

const PRECACHE_URLS = [
  "/",
  "/offline",
  "/simulator",
  "/namaj",
  "/namaj-rules",
  "/taharat",
  "/surah-dua",
  "/prayer-times",
  "/qibla",
  "/tracker",
  "/masail",
  "/about",
];

async function enforceCacheSizeLimit(cacheName, maxItems) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    if (keys.length > maxItems) {
      const excessCount = keys.length - maxItems;
      for (let i = 0; i < excessCount; i++) {
        await cache.delete(keys[i]);
      }
    }
  } catch {
    // Ignore cache eviction errors
  }
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .catch(() => {
        // Ignore precache errors on partial offline install
      })
  );
});

self.addEventListener("activate", (event) => {
  const allowedCaches = new Set([
    STATIC_CACHE,
    CONTENT_CACHE,
    FONT_CACHE,
    AUDIO_CACHE,
  ]);
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => !allowedCaches.has(k))
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Listen for PRECACHE_AUDIO messages from the Namaj Simulator & Hifz Mode
self.addEventListener("message", (event) => {
  const data = event.data;
  if (data && data.type === "PRECACHE_AUDIO" && Array.isArray(data.urls)) {
    event.waitUntil(
      caches.open(AUDIO_CACHE).then(async (cache) => {
        for (const url of data.urls) {
          if (!url) continue;
          try {
            const existing = await cache.match(url);
            if (!existing) {
              const response = await fetch(url, { mode: "cors" }).catch(() =>
                fetch(url, { mode: "no-cors" })
              );
              if (response && (response.ok || response.type === "opaque")) {
                await cache.put(url, response);
              }
            }
          } catch {
            // Ignore individual network failures during background prefetch
          }
        }
        await enforceCacheSizeLimit(AUDIO_CACHE, MAX_AUDIO_CACHE_ITEMS);
      })
    );
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // 1. Fonts (/fonts/*.woff2): Cache-First with size limit
  const isFont =
    url.pathname.startsWith("/fonts/") ||
    url.pathname.endsWith(".woff2") ||
    url.pathname.endsWith(".woff");

  if (isFont) {
    event.respondWith(
      caches.open(FONT_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;

        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.ok) {
          await cache.put(request, networkResponse.clone());
          await enforceCacheSizeLimit(FONT_CACHE, MAX_FONT_CACHE_ITEMS);
        }
        return networkResponse;
      })
    );
    return;
  }

  // 2. Audio files (/audio/*.mp3, mp3quran.net, everyayah.com): Cache-First with size limit
  const isAudio =
    url.pathname.startsWith("/audio/") ||
    url.pathname.endsWith(".mp3") ||
    url.hostname.includes("mp3quran.net") ||
    url.hostname.includes("everyayah.com");

  if (isAudio) {
    event.respondWith(
      caches.open(AUDIO_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;

        const networkResponse = await fetch(request);
        if (
          networkResponse &&
          (networkResponse.ok || networkResponse.type === "opaque")
        ) {
          await cache.put(request, networkResponse.clone());
          await enforceCacheSizeLimit(AUDIO_CACHE, MAX_AUDIO_CACHE_ITEMS);
        }
        return networkResponse;
      })
    );
    return;
  }

  // 3. Same-origin Navigation & Content Pages: Stale-While-Revalidate + Offline Fallback
  if (url.origin === self.location.origin) {
    if (request.mode === "navigate") {
      event.respondWith(
        caches.open(CONTENT_CACHE).then(async (contentCache) => {
          const staticCache = await caches.open(STATIC_CACHE);
          const cached =
            (await contentCache.match(request)) ||
            (await staticCache.match(request));

          const networkPromise = fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.ok) {
                contentCache.put(request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(async () => {
              if (cached) return cached;
              return (
                (await staticCache.match("/offline")) ||
                (await staticCache.match("/"))
              );
            });

          return cached || networkPromise;
        })
      );
      return;
    }

    // Other same-origin assets (JS, CSS, images, RSC payloads): Stale-While-Revalidate
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.ok) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => cached);

        return cached || fetchPromise;
      })
    );
  }
});
