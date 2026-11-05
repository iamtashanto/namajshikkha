# Pre-Launch Release Checklist (`/docs/RELEASE_CHECKLIST.md`)

**Project**: নামাজ শিক্ষা — Namaj Shikkha  
**Release Candidate**: `v1.0.0`

---

## 1. Automated Verification Gates

- [x] **Religious Content Schema & Fiqh Validator (`pnpm run validate:content`)**:
  - 23 prayers (`prayers.ts`), 12 prayer surahs + Ayatul Kursi (`surahs.ts`), 29 duas (`duas.ts`), 17 masail rulings (`rulings.ts`), 100 hadiths/quranic proofs (`hadiths.ts`), and 5 taharat guides (`taharat.ts`).
  - 0 validation errors; every `type: "hadith"` reference includes a verified `grade` (`"sahih"`, `"hasan"`, or `"daif"`).
  - 20 items flagged with `reviewStatus: "needs-review"` documented in `/docs/CONTENT_REVIEW.md` for final Darul Ifta scholar sign-off.
- [x] **Unit & Engine Test Suite (`pnpm test`)**:
  - Simulator timeline generator (`buildTimeline`) verified across daily Fard, Sunnah, Witr (Qunut), Eid (6 extra takbirs), Janaza (4 standing takbirs), and Salatut Tasbih (300 tasbih distribution).
  - PWA manifest, sitemap, service worker cache limits, and documentation integrity verified.
- [x] **Static Type & Lint Check (`pnpm exec tsc --noEmit` & `pnpm lint`)**:
  - Strict TypeScript compilation passes with zero errors.
- [x] **Production Static/Dynamic Build (`pnpm build`)**:
  - Next.js production build succeeds cleanly for all static and dynamic routes (`/namaj/[slug]`, `/masail/[slug]`, `/taharat/[slug]`, `/surah-dua/[id]/hifz`, `/shikhun/[slug]`).

---

## 2. Accessibility (WCAG 2.1 AA) Verification

- [x] **Skip Navigation Link**: `"মূল তথ্যে যান"` (`a[href="#main-content"]`) is the first focusable element inside `<body>` and jumps directly to `<main id="main-content">`.
- [x] **200% Zoom Support**: `viewport` configuration in `app/layout.tsx` sets `maximumScale: 5` (no zoom lock), allowing full 200%+ pinch and browser zoom without horizontal clipping.
- [x] **Screen Reader Announcements (`aria-live`)**:
  - Namaj Simulator announces step number, rakat, posture name, and Bangla instruction via `aria-live="polite"`.
  - Interactive dialogs (`SearchModal`, `PreferencesModal`, `ContentDisclaimer` feedback modal) include `role="dialog"`, `aria-modal="true"`, and accessible labels.
- [x] **Reduced Motion**: `PrayerFigure` and `WuduSimulatorClient` respect `prefers-reduced-motion: reduce` and switch postures instantaneously when enabled.
- [x] **Color Contrast**: High-contrast emerald (`#059669` / `#065f46`) and dark-mode slate/emerald palettes meet AA contrast ratios for both Bangla (`--font-bengali`) and Arabic (`--font-arabic`) scripts.

---

## 3. Cross-Browser & Device QA Matrix

| Platform / Browser | Viewport | Core Flows Verified | Status |
|---|---|---|---|
| **Chrome on Android** | `360x800` / `412x915` | PWA install prompt (after 2nd visit or simulation completion), offline `/sw.js`, audio playback, Qibla DeviceOrientation compass, bottom nav | ✅ Pass |
| **Samsung Internet (Android)** | `360x800` | Dark/light theme persistence, Bangla + Uthmani Arabic font rendering, prayer times geolocation & 64-district picker | ✅ Pass |
| **Safari on iOS (iPhone)** | `390x844` | `apple-icon.png`, iOS `requestPermission` compass prompt, Web Audio / HTML5 Audio unlock on tap, fullscreen CSS fallback | ✅ Pass |
| **Desktop Chrome / Edge** | `1440x900` | Keyboard shortcuts (`Cmd/Ctrl+K` search, `Space` play/pause, `ArrowLeft/Right` steps, `M` mute, `F` fullscreen), print stylesheets | ✅ Pass |
| **Desktop Firefox** | `1440x900` | SVG articulated joint interpolation, IndexedDB Hifz spaced-repetition storage, JSON backup export/import in `/tracker` | ✅ Pass |

---

## 4. Religious Editorial & Scholar Sign-Off Checklist

- [x] Uthmani Arabic script and ayah numbering verified against Tanzil (`src/data/surahs.ts`).
- [x] Transliteration and Bangla terminology standardized (`/docs/TRANSLITERATION.md`).
- [x] Global disclaimer and `"কোনো ভুল চোখে পড়লে জানান"` feedback modal visible on every page (`src/components/ui/ContentDisclaimer.tsx`).
- [x] `/about` ("আমাদের সম্পর্কে ও তথ্যসূত্র") page live with madhab policy, primary books, audio sources/licenses, and scholar sign-off slot.
- [ ] **Post-Launch Scholar Sign-Off**: Have a qualified Hanafi Mufti review the 20 flagged items in `/docs/CONTENT_REVIEW.md` and record their name on `/about`.

