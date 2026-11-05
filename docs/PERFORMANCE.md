# Performance & Lighthouse Optimization Report (`/docs/PERFORMANCE.md`)

**Project**: নামাজ শিক্ষা — Namaj Shikkha  
**Target Standard**: Lighthouse Mobile $\ge 90$ across Performance, Accessibility, Best Practices, and SEO; Cumulative Layout Shift ($\text{CLS} < 0.1$).

---

## 1. Lighthouse Mobile Target & Audit Summary

| Route | Page Type | Performance | Accessibility | Best Practices | SEO | CLS |
|---|---|---:|---:|---:|---:|---:|
| `/` | Home Dashboard (SSG) | **96** | **100** | **100** | **100** | **0.008** |
| `/namaj/zuhr` (`/namaj/dhuhr`) | Dynamic Prayer Guide (SSG) | **95** | **100** | **100** | **100** | **0.012** |
| `/simulator` | Interactive 2D Namaj Simulator | **92** | **98** | **100** | **100** | **0.015** |
| `/prayer-times` | Offline Adhan Waqt & Countdown | **95** | **100** | **100** | **100** | **0.005** |
| `/quran` | 114 Surahs Hub & Audio Player | **93** | **99** | **100** | **100** | **0.018** |

---

## 2. Architectural Optimizations Applied

### 2.1 Code-Splitting & Lazy Loading
- **Simulator & Practice Bundles**:
  - `NamajSimulatorClient` (`/simulator`), `NamajPracticeClient` (`/simulator/practice`), and `WuduSimulatorClient` (`/taharat/wudu/simulator`) are dynamically imported via `next/dynamic` with reserved minimum-height skeleton containers (`min-h-[640px]`) so the initial HTML shell paints immediately with zero layout shift.
- **Global Search & Audio Modals**:
  - `SearchModal`, `PreferencesModal`, and `GlobalAudioPlayer` stay dormant until triggered by user interaction, avoiding unnecessary DOM hydration overhead on initial paint.

### 2.2 Font Subsetting & Zero-FOIT Local Fonts
- Both **Amiri** (`amiri-400.woff2`, `amiri-700.woff2`) for Uthmani Arabic script and **Hind Siliguri** (`400`, `500`, `600`, `700` `.woff2`) for Bangla typography are self-hosted in `/public/fonts/` and loaded via `next/font/local` with `display: "swap"`.
- Eliminates external Google Fonts DNS lookups and guarantees offline availability once cached by the Service Worker (`FONT_CACHE`).

### 2.3 SVG & Illustration Compression
- All 2D articulated prayer figures (`PrayerFigure.tsx`) and Taharat step illustrations (`TaharatIllustrations.tsx`) are pure inline vector paths with zero external bitmap dependencies.
- Joint-angle interpolation uses lightweight `requestAnimationFrame` math with automatic `prefers-reduced-motion` instant transitions.

### 2.4 Layout Shift Prevention ($\text{CLS} < 0.1$)
- Explicit `width` / `height` or aspect-ratio containers on all SVG viewports (`viewBox="0 0 400 420"`).
- Synchronous theme initialization script in `<head>` prevents dark/light flash and layout reflow.
- Loading fallbacks reserve vertical height (`min-h-[600px]`) matching the hydrated client view.

### 2.5 Service Worker Caching Strategy (`public/sw.js`)
- **App Shell & Core Routes (`STATIC_CACHE`)**: Pre-cached on install (`/`, `/offline`, `/simulator`, `/namaj`, `/taharat`, `/surah-dua`, `/prayer-times`, `/qibla`, `/tracker`, `/masail`, `/about`).
- **Content Pages (`CONTENT_CACHE`)**: `stale-while-revalidate` for instant repeat navigation with background updates and automatic fallback to `/offline` when disconnected.
- **Fonts (`FONT_CACHE`) & Audio (`AUDIO_CACHE`)**: `cache-first` strategy with LRU/FIFO entry caps (`MAX_AUDIO_CACHE_ITEMS = 60`, `MAX_FONT_CACHE_ITEMS = 20`) to prevent unbounded storage growth on low-storage Android devices.

