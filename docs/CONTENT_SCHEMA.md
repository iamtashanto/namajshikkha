# Namaj Shikkha — Religious Content Schema Guide

**Location:** `/src/types/content.ts` & `/src/data/`  
**Purpose:** Single canonical, strictly-typed data layer powering all website pages and the interactive Namaj Simulator.

---

## 1. Architecture Overview

All religious knowledge is stored in versioned TypeScript datasets under `/src/data/` conforming to strict interfaces in `/src/types/content.ts`:

- **Prayers (`/src/data/prayers.ts`):** Complete specifications for every salah (Fard, Wajib, Sunnah, Nafl, Special), containing per-unit rakat counts, time windows, hadith references, and machine-readable `SalahConfig` objects for the upcoming 3D/animated simulator.
- **Surahs (`/src/data/surahs.ts`):** Prayer surahs stored with per-ayah `Recitation[]` objects enabling synchronized line-by-line memorization and audio playback.
- **Duas (`/src/data/duas.ts`):** All prayer supplications and daily adhkars with 4-format text (Arabic, Uccharon, Banglish, Meaning), categorization, and authentic citations.
- **Rulings (`/src/data/rulings.ts`):** Essential fiqh rules (Taharat, Ahkam, Arkan, Wajib, Sajda Sahu, Musafir, Gender differences).
- **Hadiths (`/src/data/hadiths.ts`):** Curated hadith collection with narrator, text, book, and number.

Every entry is validated at build-time using `npm run validate:content` (powered by Vitest).

---

## 2. Core TypeScript Schemas

### 2.1 Reference
Every ruling, dua, or prayer citation must carry an authentic reference:
```ts
export type ReferenceType = "quran" | "hadith" | "fiqh";
export type HadithGrade = "sahih" | "hasan" | "daif";

export interface Reference {
  type: ReferenceType;
  source: string;        // e.g. "সহীহ বুখারী", "সহীহ মুসলিম", "সূরা আল-মায়িদাহ"
  number: string | number; // e.g. 756, "5:6"
  grade?: HadithGrade;   // "sahih", "hasan", etc.
  url?: string;
}
```

### 2.2 Recitation (The 4-Format Standard)
Every Arabic ayah, dua, or tasbeeh is represented in 4 complementary formats:
```ts
export interface Recitation {
  id: string;            // Globally unique ID (e.g. "surah-1-line-1", "dua-sana")
  titleBn: string;       // e.g. "আয়াত ১", "সানা (ছানা)"
  titleEn: string;       // e.g. "Ayah 1", "Sana (Thana)"
  arabic: string;        // Uthmani Arabic script with harakat
  uccharonBn: string;    // Bangla pronunciation (উচ্চারণ)
  banglish: string;      // Latin phonetics
  meaningBn: string;     // Accurate Bengali translation
  meaningEn?: string;
  audioSrc?: string;     // URL or local audio asset path
  reference?: Reference;
  notes?: string;
}
```

### 2.3 SalahConfig (Simulator Specification)
Consumed by the interactive animated prayer simulator:
```ts
export interface SalahConfig {
  rakats: number;                         // Total rakats for this unit (e.g. 2, 3, 4)
  qiratRakats: number[];                  // Rakats where Surah Fatiha + extra Surah are recited
  firstSittingAfter: number | null;       // 2 for 3/4 rakat prayers, null for 2-rakat prayers
  hasQunut: {                             // Qunut configuration (e.g., Witr)
    enabled: boolean;
    rakat: number;
    position: "before-ruku" | "after-ruku";
  } | boolean;
  extraTakbirs?: {                        // Eid extra takbirs
    count: number;
    position: "before-ruku" | "after-qirat";
    rakat: number;
  }[];
  isJanaza: boolean;                      // Standing only: 4 takbirs, no ruku/sajda
  jahr: number[];                         // Loud recitation rakats for imam (e.g., [1, 2])
  sajdaCount: number;                     // 2 prostrations per rakat
  endsWithSalam: boolean;                 // true
}
```

---

## 3. How-To Guides

### 3.1 How to Add a New Prayer (e.g., Tahajjud or Salatul Janaza)

1. Open `/src/data/prayers.ts`.
2. Add a new `PrayerType` object:
```ts
{
  slug: "tahajjud",
  nameBn: "তাহাজ্জুদ",
  nameAr: "التَّهَجُّد",
  nameEn: "Tahajjud",
  category: "nafl",
  timeDescriptionBn: "মধ্যরাতের পর থেকে সুবহে সাদিকের পূর্ব পর্যন্ত (রাতের শেষ তৃতীয়াংশে উত্তম)।",
  totalRakats: 8,
  simulatorConfigId: "tahajjud-main",
  fazilat: {
    textBn: "ফরজ নামাজের পর সর্বোত্তম নামাজ হলো রাতের তাহাজ্জুদ নামাজ।",
    reference: {
      type: "hadith",
      source: "সহীহ মুসলিম",
      number: "১১৬৩",
      grade: "sahih",
    },
  },
  references: [
    {
      type: "quran",
      source: "সূরা আল-ইসরা",
      number: "১৭:৭৯",
    },
  ],
  rakatUnits: [
    {
      label: "২ রাকাত নফল (১ম জোড়)",
      count: 2,
      status: "mustahab",
      config: {
        rakats: 2,
        qiratRakats: [1, 2],
        firstSittingAfter: null,
        hasQunut: false,
        isJanaza: false,
        jahr: [],
        sajdaCount: 2,
        endsWithSalam: true,
      },
    },
    // ... Additional 2-rakat pairs summing to totalRakats
  ],
}
```
3. Run `npm run validate:content` to verify rakat math and schema consistency.

---

### 3.2 How to Add a New Surah

1. Open `/src/data/surahs.ts`.
2. Append the new `Surah` entry with its per-ayah line breakdown:
```ts
{
  id: "surah-97",
  number: 97,
  nameBn: "আল-ক্বদর",
  nameAr: "القدر",
  nameEn: "Al-Qadr",
  ayahCount: 5,
  revelation: "makki",
  audioSrc: "https://server8.mp3quran.net/afs/097.mp3",
  fazilat: {
    textBn: "লাইলাতুল কদরের রজনী হাজার মাসের চেয়েও শ্রেষ্ঠ ও বরকতময়।",
    reference: {
      type: "quran",
      source: "সূরা আল-ক্বদর",
      number: "৯৭:১-৫",
    },
  },
  ayahs: [
    {
      id: "surah-97-line-1",
      titleBn: "আয়াত ১",
      titleEn: "Ayah 1",
      arabic: "إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ ﴿١﴾",
      uccharonBn: "ইন্না আনযালনাহু ফী লাইলাতিল কদর।",
      banglish: "Inna anzalnahu fee laylatil-qadr.",
      meaningBn: "নিশ্চয়ই আমি এটি কদরের রাতে নাযিল করেছি।",
    },
    // ... remaining ayahs
  ],
}
```
3. Run `npm run validate:content`.

---

### 3.3 How to Add a New Dua

1. Open `/src/data/duas.ts`.
2. Add the `Dua` entry:
```ts
{
  id: "dua-istikhara",
  titleBn: "ইস্তিখারার দোয়া",
  titleEn: "Dua for Istikharah",
  arabic: "اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ...",
  uccharonBn: "আল্লাহুম্মা ইন্নী আসতাখীরুকা বিইলমিকা...",
  banglish: "Allahumma innee astakheeruka bi-ilmika...",
  meaningBn: "হে আল্লাহ! আমি আপনার জ্ঞানের সাহায্যে আপনার কাছে কল্যাণ প্রার্থনা করছি...",
  category: "istikhara",
  reference: {
    type: "hadith",
    source: "সহীহ বুখারী",
    number: "১১৬২",
    grade: "sahih",
  },
  reviewStatus: "verified", // "verified" if authentic reference exists, else "needs-review"
}
```

---

## 4. Content Validation & CI Integration

The validation script runs on every `npm run build` and can be run independently:

```bash
npm run validate:content
```

### What the Validator Enforces:
- **Unique IDs:** No duplicate IDs across prayers, surahs, ayahs, duas, rulings, or hadiths.
- **Non-Empty Arabic:** Every recitation and ayah must have non-empty Arabic text.
- **Rakat Math Integrity:** The sum of `rakatUnits.map(u => u.count)` must equal `totalRakats`.
- **Valid SalahConfig:** `qiratRakats`, `firstSittingAfter`, and `sajdaCount` must be logically valid for the given rakat count.
- **Reference Integrity:** Every reference must specify both `source` and `number`.

