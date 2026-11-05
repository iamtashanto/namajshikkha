/**
 * Namaj Shikkha — Canonical Religious Content Schema
 * Defines strictly-typed schemas for Recitations, Surahs, Duas, Rulings, References, and Prayers.
 */

export type ReferenceType = "quran" | "hadith" | "fiqh";
export type HadithGrade = "sahih" | "hasan" | "daif";

export interface Reference {
  type: ReferenceType;
  source: string; // e.g. "সহীহ বুখারী", "সহীহ মুসলিম", "সূরা আল-ফাতিহা"
  number: string | number; // e.g. 756, "1:1-7"
  grade?: HadithGrade;
  url?: string;
}

export type ReviewStatus = "verified" | "needs-review";

export interface Recitation {
  id: string; // unique identifier e.g. "surah-1-ayah-1", "dua-sana"
  titleBn: string;
  titleEn: string;
  arabic: string;
  uccharonBn: string;
  banglish: string;
  meaningBn: string;
  meaningEn?: string;
  audioSrc?: string;
  reference?: Reference;
  notes?: string;
}

export type RevelationType = "makki" | "madani";

export interface Surah {
  id: string; // e.g. "surah-1", "surah-114"
  number: number; // 1 to 114
  nameBn: string;
  nameAr: string;
  nameEn: string;
  ayahCount: number;
  ayahs: Recitation[]; // Per-ayah recitation line by line for highlighting and memorization
  audioSrc: string;
  revelation: RevelationType;
  fazilat?: {
    textBn: string;
    reference?: Reference;
  };
}

export type DuaCategory =
  | "in-salah"
  | "after-salah"
  | "wudu"
  | "janaza"
  | "qunut"
  | "istikhara"
  | "daily"
  | "masjid"
  | "sleep"
  | "food";

export interface Dua extends Recitation {
  category: DuaCategory;
  reviewStatus: ReviewStatus;
}

export type RulingStatus =
  | "fard"
  | "wajib"
  | "sunnah"
  | "mustahab"
  | "makruh"
  | "haram"
  | "mubah";

export type AppliesToGender = "male" | "female" | "both";

export interface Ruling {
  id: string;
  titleBn: string;
  bodyBn: string; // Markdown formatted content
  status: RulingStatus;
  appliesTo: AppliesToGender;
  references: Reference[];
  reviewStatus: ReviewStatus;
}

export interface ExtraTakbir {
  count: number;
  position: "before-ruku" | "after-qirat";
  rakat: number;
}

export interface QunutConfig {
  enabled: boolean;
  rakat: number;
  position: "before-ruku" | "after-ruku";
}

export interface SalahConfig {
  rakats: number;
  qiratRakats: number[]; // Rakats where an extra surah is recited after Fatiha
  firstSittingAfter: number | null; // Rakat index after which first sitting occurs (e.g. 2), or null
  hasQunut: QunutConfig | boolean;
  extraTakbirs?: ExtraTakbir[]; // For Eid or special prayers
  isJanaza: boolean; // True for Janaza (standing only, 4 takbirs, no ruku/sajda)
  jahr: number[]; // Rakats recited loudly by Imam (e.g. [1, 2] for Fajr)
  sajdaCount: number; // Number of prostrations per rakat (standard 2)
  endsWithSalam: boolean;
}

export interface RakatUnit {
  label: string; // e.g. "২ রাকাত সুন্নাত", "৪ রাকাত ফরজ"
  count: number;
  status: RulingStatus;
  config: SalahConfig;
}

export type PrayerCategory =
  | "fard"
  | "wajib"
  | "sunnah-muakkadah"
  | "sunnah-ghair-muakkadah"
  | "nafl"
  | "special";

export interface PrayerType {
  slug: string; // "fajr", "dhuhr", "asr", "maghrib", "isha", "jumuah", "witr"
  nameBn: string;
  nameAr: string;
  nameEn: string;
  category: PrayerCategory;
  timeDescriptionBn: string;
  rakatUnits: RakatUnit[];
  totalRakats: number;
  fazilat?: {
    textBn: string;
    reference?: Reference;
  };
  references: Reference[];
  relatedRulings?: string[]; // IDs of related rulings
  simulatorConfigId: string;
}

export interface HadithItem {
  id: number | string;
  titleBn: string;
  titleEn: string;
  narratorBn: string;
  narratorEn?: string;
  textBn: string;
  textEn?: string;
  reference: Reference;
  category: string;
  reviewStatus: ReviewStatus;
}

