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
  | "nafl"
  | "mustahab"
  | "makruh"
  | "haram"
  | "mubah";

export type AppliesToGender = "male" | "female" | "both";

export interface RulingFAQ {
  question: string;
  answer: string;
}

export interface RulingExample {
  title: string;
  situation: string;
  ruling: string;
  action: string;
}

export interface DecisionResult {
  status: "valid" | "sajda_sahu" | "repeat" | "mustahab" | "prohibited";
  title: string;
  description: string;
  action: string;
}

export interface DecisionOption {
  label: string;
  description?: string;
  nextId?: string;
  result?: DecisionResult;
}

export interface DecisionNode {
  id: string;
  question: string;
  hint?: string;
  options: DecisionOption[];
}

export interface DecisionTree {
  id: string;
  title: string;
  description: string;
  rootNodeId: string;
  nodes: Record<string, DecisionNode>;
}

export interface TilawatAyah {
  serial: number;
  surahNumber: number;
  surahNameBn: string;
  surahNameAr: string;
  ayahNumber: number;
  ayahRef: string;
  textAr: string;
  meaningBn: string;
}

export type RulingCategory =
  | "fundamentals"
  | "mistakes-corrections"
  | "congregation"
  | "special-circumstances"
  | "lifestyle-etiquette";

export interface Ruling {
  id: string;
  slug: string;
  titleBn: string;
  titleEn: string;
  summaryBn: string;
  category: RulingCategory;
  status: RulingStatus;
  appliesTo: AppliesToGender;
  bodyBn: string; // Markdown formatted content
  genderDifferences?: {
    male: string[];
    female: string[];
    note?: string;
  };
  examples?: RulingExample[];
  decisionTree?: DecisionTree;
  tilawatAyahs?: TilawatAyah[];
  workedExamples?: RulingExample[];
  faqs?: RulingFAQ[];
  references: Reference[];
  relatedTopics?: string[];
  relatedPrayers?: string[];
  reviewStatus: ReviewStatus;
}

export interface ExtraTakbir {
  count: number;
  position: "before-ruku" | "after-qirat" | "after-sana";
  rakat: number;
}

export interface QunutConfig {
  enabled: boolean;
  rakat: number;
  position: "before-ruku" | "after-ruku";
}

export interface TasbihDistribution {
  position:
    | "after-sana"
    | "after-surah"
    | "ruku"
    | "qawmah"
    | "sajda-1"
    | "jalsah"
    | "sajda-2"
    | "sitting-before-standing";
  count: number;
  labelBn: string;
}

export interface SalahConfig {
  rakats: number;
  rakatRange?: [number, number]; // Allowed range for flexible prayers (e.g. [2, 12] for Tahajjud, [2, 8] for Chasht)
  qiratRakats: number[]; // Rakats where an extra surah is recited after Fatiha
  firstSittingAfter: number | null; // Rakat index after which first sitting occurs (e.g. 2), or null
  hasQunut: QunutConfig | boolean;
  extraTakbirs?: ExtraTakbir[]; // For Eid or special prayers
  tasbihDistribution?: TasbihDistribution[]; // For Salatut Tasbih per-position counting
  tasbihFormula?: string; // Arabic formula of tasbih
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
  | "sunnah"
  | "sunnah-muakkadah"
  | "sunnah-ghair-muakkadah"
  | "nafl"
  | "special";

export interface PrayerStepDetail {
  stepNumber: number;
  rakatLabel: string; // e.g. "১ম রাকাত", "২য় রাকাত", "৩য় ও ৪র্থ রাকাত"
  rakatsApplicable?: number[];
  titleBn: string;
  descriptionBn: string;
  recitationId?: string; // ID linking to Recitation in duas or surahs
  recitationCustom?: Recitation; // Or embedded Recitation
  maleRule?: string;
  femaleRule?: string;
  tips?: string;
}

export interface PrayerFAQ {
  question: string;
  answer: string;
}

export interface SpecialRule {
  title: string;
  description: string;
  reference?: Reference;
}

export type PrayerGroup =
  | "daily-fard"
  | "wajib"
  | "jumuah-eid"
  | "janaza"
  | "sunnah-nafl"
  | "special";

export interface PrayerType {
  slug: string; // "fajr", "dhuhr", "asr", "maghrib", "isha", "jumuah", "witr", "eid-ul-fitr", "eid-ul-adha", "janaza", "tahajjud", "tarawih", "chasht", "istikhara"
  nameBn: string;
  nameAr: string;
  nameEn: string;
  category: PrayerCategory;
  group: PrayerGroup;
  timeDescriptionBn: string;
  rakatUnits: RakatUnit[];
  totalRakats: number;
  niyyat: Recitation;
  fazilat?: {
    textBn: string;
    reference?: Reference;
  };
  steps: PrayerStepDetail[];
  genderDifferences?: {
    male: string[];
    female: string[];
    note?: string;
  };
  commonMistakes: string[];
  faqs: PrayerFAQ[];
  references: Reference[];
  relatedPrayers?: string[]; // Slugs of related prayers
  relatedRulings?: string[]; // IDs of related rulings
  simulatorConfigId: string;
  specialRules?: SpecialRule[];
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

