import { CityLocation } from "@/src/data/locations";

export type CalculationMethodType =
  | "Karachi"
  | "MuslimWorldLeague"
  | "Egyptian"
  | "UmmAlQura"
  | "Dubai"
  | "MoonsightingCommittee"
  | "NorthAmerica"
  | "Kuwait"
  | "Qatar"
  | "Singapore"
  | "Tehran"
  | "Turkey";

export type MadhabType = "Hanafi" | "Shafi";

export type HighLatitudeRuleType =
  | "MiddleOfTheNight"
  | "SeventhOfTheNight"
  | "TwilightAngle";

export interface PrayerTimesSettings {
  location: CityLocation;
  calculationMethod: CalculationMethodType;
  madhab: MadhabType;
  highLatitudeRule: HighLatitudeRuleType;
  hijriOffsetDays: number; // e.g. -2, -1, 0, 1, 2
  notificationsEnabled: boolean;
}

export interface DailyPrayerTimes {
  date: Date;
  dateKey: string; // YYYY-MM-DD
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;

  // Extra Islamic Times
  tahajjudStart: Date; // Last third of the night
  ishraq: Date; // ~15 mins after sunrise
  chasht: Date; // Mid-morning (approx midway between sunrise and zawal)
  zawalStart: Date; // 10-15 mins before Dhuhr
  zawalEnd: Date; // Dhuhr start

  // Forbidden Times (৩টি মাকরুহ ওয়াক্ত)
  forbiddenSunrise: { start: Date; end: Date; nameBn: string };
  forbiddenZawal: { start: Date; end: Date; nameBn: string };
  forbiddenSunset: { start: Date; end: Date; nameBn: string };

  // Ramadan Times
  sehriEnd: Date; // Fajr (or 3 mins prior for safety)
  iftar: Date; // Maghrib
}

export type WaqtKey =
  | "fajr"
  | "sunrise"
  | "dhuhr"
  | "asr"
  | "maghrib"
  | "isha"
  | "none";

export interface CurrentWaqtInfo {
  currentWaqt: WaqtKey;
  currentWaqtNameBn: string;
  isForbiddenNow: boolean;
  forbiddenReasonBn?: string;
  nextPrayer: WaqtKey;
  nextPrayerNameBn: string;
  nextPrayerTime: Date;
  timeRemainingMs: number;
  timeRemainingShort: string; // "০১:২৫:৩০"
  timeRemainingFormatted: string; // "১ ঘণ্টা ২৫ মিনিট ৩০ সেকেন্ড"
}

