const STATIC_CACHE = "namaj-shikkha-static-v1";
const AUDIO_CACHE = "namaj-shikkha-audio-v1";

const PRECACHE_URLS = [
  "/",
  "/simulator",
  "/namaj",
  "/namaj-rules",
  "/taharat",
];

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
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== STATIC_CACHE && k !== AUDIO_CACHE)
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Listen for PRECACHE_AUDIO messages from the Namaj Simulator
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
      })
    );
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // 1. Audio files (/audio/*.mp3 or mp3quran.net): Cache-First, then Network & Cache
  const isAudio =
    url.pathname.startsWith("/audio/") ||
    url.pathname.endsWith(".mp3") ||
    url.hostname.includes("mp3quran.net");

  if (isAudio) {
    event.respondWith(
      caches.open(AUDIO_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;

        try {
          const networkResponse = await fetch(request);
          if (
            networkResponse &&
            (networkResponse.ok || networkResponse.type === "opaque")
          ) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          throw err;
        }
      })
    );
    return;
  }

  // 2. Same-origin HTML/JS/CSS/Fonts: Stale-While-Revalidate for offline support
  if (url.origin === self.location.origin) {
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

