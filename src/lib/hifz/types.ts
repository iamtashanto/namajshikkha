export type HifzHideMode =
  | "normal"
  | "hide-arabic"
  | "hide-every-other-word"
  | "first-letters"
  | "fully-hidden";

export interface HifzRecord {
  surahId: string;
  stage: number; // 0: new, 1: 1 day, 2: 3 days, 3: 7 days, 4: 14 days, 5: mastered
  intervalDays: number;
  lastReviewedAt: number;
  nextReviewDate: string; // YYYY-MM-DD
  isMastered: boolean;
  successStreak: number;
  totalReviews: number;
}

export interface HifzSettings {
  largeFont: boolean;
  highContrast: boolean;
  repeatCount: number; // 1, 2, 3, 5, 10, 99
  pauseGapSeconds: number; // 0, 1, 2, 3, 5
  hideMode: HifzHideMode;
}

export const SPACED_REPETITION_INTERVALS = [1, 3, 7, 14, 30]; // Days

export const DEFAULT_HIFZ_SETTINGS: HifzSettings = {
  largeFont: false,
  highContrast: false,
  repeatCount: 3,
  pauseGapSeconds: 2,
  hideMode: "normal",
};
