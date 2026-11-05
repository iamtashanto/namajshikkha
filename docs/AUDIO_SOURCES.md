# Audio Sources & Licensing (`/docs/AUDIO_SOURCES.md`)

This document records the sources, licenses, and fallback behavior for all audio recitations used in **Namaj Shikkha** (`https://namajshikkha.tashanto.com`) and the interactive **Namaj Simulator** (`/simulator`).

---

## 1. Quran Surah Recitations

| Surah Range | Reciter | Source URL Pattern | License / Terms |
| :--- | :--- | :--- | :--- |
| Surah 1 – 114 (Full Quran section & online stream) | Sheikh Mishary Rashid Alafasy | `https://server8.mp3quran.net/afs/{surah_3digit}.mp3` | **MP3Quran.net Public Islamic Educational Use**: Free for non-commercial Islamic education, da'wah, and open-source Quran applications with attribution. |
| Simulator Short Surahs (`/audio/surah-1.mp3`, `/audio/surah-103.mp3`, `/audio/surah-105.mp3` – `/audio/surah-114.mp3`) | Self-hosted Arabic recitation (`ar_001`) | `/audio/surah-{number}.mp3` | Generated in-house via Arabic phonetic synthesis (`ar_001`) + FFmpeg LAME MP3. Dedicated to the public domain (**CC0 1.0 Universal**) by Namaj Shikkha for instant offline & zero-CORS simulator playback. |

---

## 2. In-Salah Duas, Takbir, Tasbihat, Tashahhud, Durood, Qunut & Salam (`/public/audio/`)

All short in-salah recitations are self-hosted in `/public/audio/*.mp3` so they work reliably on low-bandwidth connections, preload instantaneously, and can be cached by the PWA Service Worker (`/sw.js`) for 100% offline playback.

| File Path | Recitation ID | Title (Bangla / English) | Source & License |
| :--- | :--- | :--- | :--- |
| `/audio/allahu-akbar.mp3` | `dua-8` | তাকবীরে তাহরীমা ও মধ্যবর্তী তাকবীর (`Allahu Akbar`) | Generated in-house via Arabic phonetic synthesis (`ar_001`) + FFmpeg LAME MP3. Dedicated to the public domain (**CC0 1.0 Universal**) by Namaj Shikkha. |
| `/audio/sana.mp3` | `dua-1` | সানা / ছানা (`Sana / Thana`) | Generated in-house (`ar_001`) + FFmpeg LAME MP3. **CC0 1.0 Universal**. |
| `/audio/taawwuz.mp3` | `dua-taawwuz` | তাআউয — আউযুবিল্লাহ (`Ta'awwuz`) | Generated in-house (`ar_001`) + FFmpeg LAME MP3. **CC0 1.0 Universal**. |
| `/audio/tasmiyah.mp3` | `dua-tasmiyah` | তাসমিয়াহ — বিসমিল্লাহ (`Tasmiyah`) | Generated in-house (`ar_001`) + FFmpeg LAME MP3. **CC0 1.0 Universal**. |
| `/audio/ruku-tasbih.mp3` | `dua-6` | রুকুর তাসবীহ (`Subhana Rabbiyal Azim`) | Generated in-house (`ar_001`) + FFmpeg LAME MP3. **CC0 1.0 Universal**. |
| `/audio/qawmah.mp3` | `dua-qawmah` | কওমার তাসমি ও তাহমীদ (`Sami'Allahu liman hamidah...`) | Generated in-house (`ar_001`) + FFmpeg LAME MP3. **CC0 1.0 Universal**. |
| `/audio/sajda-tasbih.mp3` | `dua-7` | সিজদার তাসবীহ (`Subhana Rabbiyal A'la`) | Generated in-house (`ar_001`) + FFmpeg LAME MP3. **CC0 1.0 Universal**. |
| `/audio/jalsah.mp3` | `dua-jalsah` | দুই সিজদার মাঝের দোয়া (`Rabbighfir li`) | Generated in-house (`ar_001`) + FFmpeg LAME MP3. **CC0 1.0 Universal**. |
| `/audio/tashahhud.mp3` | `dua-2` | আত্তাহিয়্যাতু / তাশাহহুদ (`Tashahhud`) | Generated in-house (`ar_001`) + FFmpeg LAME MP3. **CC0 1.0 Universal**. |
| `/audio/durood.mp3` | `dua-3` | দুরূদে ইব্রাহীম (`Durood Ibrahim`) | Generated in-house (`ar_001`) + FFmpeg LAME MP3. **CC0 1.0 Universal**. |
| `/audio/dua-masura.mp3` | `dua-4` | দোয়া মাসুরা (`Dua Masura`) | Generated in-house (`ar_001`) + FFmpeg LAME MP3. **CC0 1.0 Universal**. |
| `/audio/qunut.mp3` | `dua-5` | দোয়া কুনূত (`Dua Qunoot`) | Generated in-house (`ar_001`) + FFmpeg LAME MP3. **CC0 1.0 Universal**. |
| `/audio/salam.mp3` | `dua-salam` | সালাম (`Assalamu 'alaykum wa rahmatullah`) | Generated in-house (`ar_001`) + FFmpeg LAME MP3. **CC0 1.0 Universal**. |
| `/audio/eid-takbir.mp3` | `dua-eid-takbir` | ঈদের তাকবীর (`Eid Takbeer`) | Generated in-house (`ar_001`) + FFmpeg LAME MP3. **CC0 1.0 Universal**. |
| `/audio/janaza-sana.mp3` | `dua-sana-janaza` | জানাজার সানা (`Janazah Sana`) | Generated in-house (`ar_001`) + FFmpeg LAME MP3. **CC0 1.0 Universal**. |
| `/audio/janaza-dua.mp3` | `dua-janaza` | জানাজার দোয়া (`Janazah Dua for Adults`) | Generated in-house (`ar_001`) + FFmpeg LAME MP3. **CC0 1.0 Universal**. |
| `/audio/salatut-tasbih.mp3` | `dua-tasbih` | সালাতুত তাসবীহের তাসবীহ (`Salatut Tasbih Formula`) | Generated in-house (`ar_001`) + FFmpeg LAME MP3. **CC0 1.0 Universal**. |
| `/audio/after-salah-dhikr.mp3` | `dua-after-salah-astaghfirullah` | সালাম পর ইস্তিগফার ও জিকির (`After-Salah Dhikr`) | Generated in-house (`ar_001`) + FFmpeg LAME MP3. **CC0 1.0 Universal**. |
| `/audio/wudu-before.mp3` | `dua-wudu-before` | অযু শুরুর দোয়া (`Bismillah`) | Generated in-house (`ar_001`) + FFmpeg LAME MP3. **CC0 1.0 Universal**. |
| `/audio/wudu-after.mp3` | `dua-wudu-after` | অযু সমাপ্তির কালিমা শাহাদাত ও দোয়া (`Dua After Wudu`) | Generated in-house (`ar_001`) + FFmpeg LAME MP3. **CC0 1.0 Universal**. |

---

## 3. Preloading, Offline Caching & Missing-Audio Fallback

1. **Next-Step Preloading**:
   - While step $i$ is active in `/simulator`, the player preloads the audio URLs for step $i+1$ using `<link rel="preload" as="audio">` / `Audio()` prefetching and posts a `PRECACHE_AUDIO` message to the Service Worker.
2. **Offline Service Worker Caching (`/public/sw.js`)**:
   - All `/audio/*.mp3` files and played Quran surah `.mp3` streams are cached in `namaj-shikkha-audio-v1` using a Cache-First strategy so any prayer played once works completely offline afterward.
3. **Graceful Timer Fallback (`durationHintMs`)**:
   - If a step has no audio (e.g., silent `STANDING` niyyat, `EID_TAKBIR_HANDS_DOWN`, or `muqtadi` silent listening), or if the user is muted / offline before caching external surah audio, Auto mode smoothly progresses through the step over `step.durationHintMs / playbackRate`, advancing word/line highlights and repeat counters (`১/৩` → `২/৩` → `৩/৩`) before transitioning to the next step.
