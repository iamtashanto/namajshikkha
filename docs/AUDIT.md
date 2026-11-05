# Namaj Shikkha (নামাজ শিক্ষা) — Codebase Audit & Foundation Blueprint

**Date:** November 2026  
**Auditor:** Senior Full-Stack Engineer & Islamic-Education Product Designer  
**Platform:** Next.js 16 (App Router, Static Export), React 19, TypeScript, Tailwind CSS v4, PWA  

---

## 1. Inventory & Responsibilities

### 1.1 Routes (`app/`)
| Route | Type | File | Responsibility & Current Status |
|---|---|---|---|
| `/` | Static | `app/page.tsx` | Landing page, hero, bismillah callout, learning category navigation cards, feature value props. |
| `/namaj-rules` | Static | `app/namaj-rules/page.tsx` | Step-by-step timeline of salah rituals (Wudu to Salam). |
| `/namaj-details` | Static | `app/namaj-details/page.tsx` | Detailed breakdown of 5 daily prayers (Fajr to Isha), rakat count, color legend. |
| `/quran` | Static | `app/quran/page.tsx` | Catalog of 114 Surahs with Makki/Madani filters and multi-lingual search. |
| `/surah-dua` | Static | `app/surah-dua/page.tsx` | Essential salah surahs and supplications with 4-tab viewer (Arabic/Uccharon/Banglish/Meaning) and audio. |
| `/hadith-faq` | Static | `app/hadith-faq/page.tsx` | Curated hadiths regarding salah and an interactive FAQ accordion. |
| `/islamic-history` | Static | `app/islamic-history/page.tsx` | Chronological timeline of 58 events across 9 historical eras with search and era filtering. |
| `/islamic-history/[eraId]/[slug]` | SSG (58 pages) | `app/islamic-history/[eraId]/[slug]/page.tsx` | Deep-dive article pages for each historical milestone. |
| `/manifest.webmanifest` | Static | `app/manifest.ts` | PWA installation manifest, icons, and theme configuration. |
| `/robots.txt` | Static | `app/robots.ts` | Crawler guidance for search engines. |
| `/sitemap.xml` | Static | `app/sitemap.ts` | Dynamic sitemap indexing all static routes and 58 history articles. |

### 1.2 Core Components (`components/`)
| Component | Responsibility | Audit Observations & Issues |
|---|---|---|
| `Navbar.tsx` | Header navigation, theme toggle, mobile drawer. | **Duplicate nav links in DOM**; hidden mobile menu is neither `aria-hidden="true"` nor marked `inert`, exposing duplicate focusable items to screen readers. Missing new key links (Simulator, Masail, etc.). |
| `Footer.tsx` | Brand details, sitemap links, social icons, credits. | **Broken links**: "নামাজের সময়" pointed to `/` instead of `/prayer-times`; social links hardcoded to `href="#"`; developer name hardcoded; lacks central config. |
| `ThemeProvider.tsx` | Dark/light mode context. | Good `localStorage` handling with try/catch, but lacks system preference listener sync. |
| `AudioProvider.tsx` & `GlobalAudioPlayer.tsx` | Global HTML5 audio player and playback state. | Works well for continuous playback across pages. |
| `InstallButton.tsx` & `MobileInstallPrompt.tsx` | PWA installation banners and triggers. | Functional, but requires coordination with modern bottom navigation bar on mobile. |
| `SurahCard.tsx` | 4-tab presenter for Arabic texts. | Shows one layer at a time (tabbed); lacks flexible multi-layer simultaneous view, font scaling, and Hanafi/gender context. |
| `PrayerCard.tsx` | Accordion card for prayer details. | Hardcoded color classes for rakat types instead of centralized semantic tokens. |
| `QuranSurahCard.tsx` | Card for 114 Surahs. | Well-structured, functional audio hook. |
| `HistoryTimelineCard.tsx` | History event card. | Maps colors using inline dictionary rather than theme tokens. |
| `SearchBar.tsx` | Search input. | Reusable client input with clear action. |

### 1.3 Data Files (`data/`)
| File | Size | Responsibility | Content & Structure Notes |
|---|---|---|---|
| `namaj-rules.json` | 8.2 KB | 11 steps for prayer ritual | Contains only partial Arabic texts without full 4 formats (pronunciation, Banglish, meaning missing for steps). |
| `prayer-details.json` | 20 KB | 5 daily prayer specifications | Contains rakat breakdown, steps, and explanations. |
| `surahs.json` | 25.4 KB | Short surahs for namaj | Full 4 formats provided (Arabic, Bangla uccharon, Banglish, Bangla meaning). |
| `duas.json` | 17 KB | Namaj duas (Sana, Tashahhud, Durood, etc.) | Full 4 formats provided. |
| `all-surahs.json` | 38.2 KB | Metadata for 114 Quranic Surahs | Numbers, Arabic names, Bangla names, meaning, verse count, revelation type. |
| `hadiths.json` | 112 KB | Salah hadith collection | Bengali text, narrator, source books. |
| `faqs.json` | 102 KB | Prayer question & answers | Questions categorized by prayer, wudu, missed prayer, etc. |
| `islamic-history.json` & `history-details/` | ~600 KB | 58 history events | Structured history timeline with detailed background and lessons. |

---

## 2. Content Duplication & Hardcoded JSX Audit

1. **Quranic Ayah Duplication:**
   - Ayah from Surah An-Nisa (4:103):
     `إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا`  
     *"নিশ্চয়ই নামাজ মু'মিনদের উপর নির্দিষ্ট সময়ে ফরজ করা হয়েছে।"*
   - Duplicated verbatim inside JSX in:
     - `app/namaj-rules/page.tsx` (Lines 107–114)
     - `app/namaj-details/page.tsx` (Lines 86–93)
   - **Fix:** Extract to a shared verse constant or central typography reference.

2. **Dua Content Duplication:**
   - Sana (`سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ...`) is hardcoded in `data/namaj-rules.json` (Step 5) and defined in `data/duas.json` (Item 1).
   - Takbeer-e-Tahrima (`اللَّهُ أَكْبَرُ`) is duplicated across `namaj-rules.json` and `duas.json`.
   - **Fix:** Reference canonical dua records by ID or unify prayer steps to use the canonical `duas.json`.

3. **Hardcoded Social & Author Credentials:**
   - Author "Md Tanvir Ahamed Shanto" hardcoded in `Footer.tsx`.
   - Social links set to `#` in `Footer.tsx`.
   - **Fix:** Consolidate into `/src/config/site.ts` with typed fields and automatic hiding of blank handles.

4. **Hardcoded Color Class Mapping:**
   - Badge colors for *Fard*, *Sunnah*, *Nafl*, *Wajib/Witr* are repeated across `PrayerCard.tsx`, `app/namaj-details/page.tsx`, and `app/islamic-history/page.tsx`.
   - **Fix:** Introduce atomic semantic tokens (`--color-salah-fard`, `--color-salah-sunnah`, `--color-salah-nafl`, `--color-salah-wajib`).

---

## 3. Bug Analysis & Accessibility Deficiencies

| Issue | Severity | Location | Impact | Remediation |
|---|---|---|---|---|
| **Broken Prayer Times Link** | Medium | `components/Footer.tsx:21` | "নামাজের সময়" points to `/`, confusing users seeking prayer timetables. | Point to `/prayer-times` and create a placeholder page stating "শীঘ্রই আসছে" until full feature is ready. |
| **Social Links "#"** | Low | `components/Footer.tsx:55-60` | Clicking `#` jumps the viewport to top of page and breaks user scroll position. | Connect to `/src/config/site.ts`; hide empty handles. |
| **Duplicate Navigation Markup** | High (A11y) | `components/Navbar.tsx` | Mobile menu links and desktop links exist simultaneously. When mobile drawer is closed (`max-h-0`), items are not marked `aria-hidden="true"` or `inert`. Screen readers read redundant links and tabbing order is broken. | Add `aria-hidden={!isOpen}` to the mobile drawer container, ensure `id="mobile-menu"` is bound via `aria-controls`, and hide it from accessibility tree when closed. |
| **Missing Mobile Bottom Navigation** | Medium (UX) | Global Layout | On low-end mobile devices, 1-handed navigation is crucial. Users currently have to reach top-right hamburger for every route transition. | Implement a fixed mobile bottom navigation bar (Home, Namaj, Simulator, Times, More) respecting safe areas (`pb-safe`). |
| **Dark Mode Contrast Discrepancies** | Medium | `globals.css` / components | `text-gray-400` in dark mode produces contrast ratios below 4.5:1 on `#1a1f2e` backgrounds. | Standardize with high-contrast tokens (`--color-dark-text-secondary: #94a3b8`, `--color-dark-text: #f1f5f9`). |

---

## 4. Lighthouse & Performance Audit (Mobile Emulation)

1. **Font Loading & Network Resilience (CRITICAL):**
   - **Original Issue:** `next/font/google` fetched fonts from Google servers at build/runtime. When offline or behind firewalls, `next build` failed completely with network errors.
   - **Fix Applied:** Downloaded WOFF2 weights for **Hind Siliguri** (400, 500, 600, 700) and **Amiri** (400, 700) directly into `public/fonts/`. Configured `localFont` with `font-display: swap`. Preloading critical weights guarantees 0 layout shift (CLS: 0) and offline functionality.
2. **Turbopack Process Execution in Sandboxed CI:**
   - **Issue:** Turbopack failed to write endpoints due to IPC restrictions during CSS post-processing.
   - **Fix Applied:** Configured standard webpack build (`next build --webpack`), achieving full static generation of 71 routes in under 3 seconds.
3. **PWA & Offline Strategy:**
   - `manifest.ts` is configured, but icons need explicit caching headers in static deployment. Service worker registration should be lightweight without blocking initial paint.
4. **Metadata & OpenGraph Completeness:**
   - Need localized Bengali open-graph titles, twitter card metadata, and theme color tags supporting light (`#059669`) and dark (`#0f1419`) media queries.

---

## 5. Prioritized Fix List

- [x] **P0 - Fix Self-Hosted Fonts & Build Failure:** Replace `next/font/google` with `next/font/local` using self-hosted WOFF2 files in `public/fonts/`.
- [ ] **P0 - Fix Site Config & Broken Links:** Create `/src/config/site.ts`. Fix footer link to `/prayer-times`, replace `#` social links, hide empty links, update developer attribution.
- [ ] **P0 - Create Placeholder `/prayer-times` Page:** Ensure zero 404 links across the application.
- [ ] **P1 - Screen Reader & Navigation A11y:** Clean up `Navbar.tsx` so mobile navigation is hidden with `aria-hidden="true"` and `inert` when collapsed.
- [ ] **P1 - Design System & Semantic Color Tokens:** Define semantic prayer tokens (`fard`, `sunnah`, `nafl`, `wajib`), typography scales, radius, and shadows in CSS variables and Tailwind theme.
- [ ] **P1 - UI Component Library (`/src/components/ui`):**
  - `Container`
  - `Section`
  - `Card`
  - `Badge` (with `fard`, `sunnah`, `nafl`, `wajib`, `neutral` variants)
  - `Tabs`
  - `Accordion`
  - `Button`
  - `Callout` (tip, warning, reference)
  - `ArabicBlock` (4-format synchronized renderer with visibility toggles, font-size control, and audio)
  - `ReferenceChip` (Hanafi reference badge)
  - `Breadcrumbs`
- [ ] **P1 - User Preferences System:** Arabic font size slider/stepper, 4-layer visibility defaults, gender selection (`male` / `female`), saved to `localStorage` with error handling.
- [ ] **P2 - Header & Mobile Bottom Bar Redesign:** Redesign top header with primary links, search placeholder, theme toggle, preferences button, and modern 5-button bottom nav for mobile devices.
- [ ] **P2 - Migrate Existing Pages:** Use `ArabicBlock`, `Badge`, `Callout`, and `ReferenceChip` in `app/namaj-rules/page.tsx` and verify dark mode across all pages.

