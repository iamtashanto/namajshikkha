import {
  CalculationMethod,
  Coordinates,
  HighLatitudeRule,
  Madhab,
  PrayerTimes,
  Qibla,
  SunnahTimes,
} from "adhan";
import {
  CalculationMethodType,
  CurrentWaqtInfo,
  DailyPrayerTimes,
  HighLatitudeRuleType,
  MadhabType,
  PrayerTimesSettings,
  WaqtKey,
} from "./types";
import { DEFAULT_LOCATION } from "@/src/data/locations";
import { toBengaliNumber } from "@/src/lib/bengali";

export const DEFAULT_PRAYER_SETTINGS: PrayerTimesSettings = {
  location: DEFAULT_LOCATION,
  calculationMethod: "Karachi",
  madhab: "Hanafi",
  highLatitudeRule: "MiddleOfTheNight",
  hijriOffsetDays: 0,
  notificationsEnabled: false,
};

function getAdhanCalculationParameters(
  method: CalculationMethodType,
  madhab: MadhabType,
  highLatitude: HighLatitudeRuleType
) {
  let params = CalculationMethod.Karachi();

  switch (method) {
    case "MuslimWorldLeague":
      params = CalculationMethod.MuslimWorldLeague();
      break;
    case "Egyptian":
      params = CalculationMethod.Egyptian();
      break;
    case "UmmAlQura":
      params = CalculationMethod.UmmAlQura();
      break;
    case "Dubai":
      params = CalculationMethod.Dubai();
      break;
    case "MoonsightingCommittee":
      params = CalculationMethod.MoonsightingCommittee();
      break;
    case "NorthAmerica":
      params = CalculationMethod.NorthAmerica();
      break;
    case "Kuwait":
      params = CalculationMethod.Kuwait();
      break;
    case "Qatar":
      params = CalculationMethod.Qatar();
      break;
    case "Singapore":
      params = CalculationMethod.Singapore();
      break;
    case "Tehran":
      params = CalculationMethod.Tehran();
      break;
    case "Turkey":
      params = CalculationMethod.Turkey();
      break;
    case "Karachi":
    default:
      params = CalculationMethod.Karachi();
      break;
  }

  params.madhab = madhab === "Hanafi" ? Madhab.Hanafi : Madhab.Shafi;

  switch (highLatitude) {
    case "SeventhOfTheNight":
      params.highLatitudeRule = HighLatitudeRule.SeventhOfTheNight;
      break;
    case "TwilightAngle":
      params.highLatitudeRule = HighLatitudeRule.TwilightAngle;
      break;
    case "MiddleOfTheNight":
    default:
      params.highLatitudeRule = HighLatitudeRule.MiddleOfTheNight;
      break;
  }

  return params;
}

/**
 * Calculates complete daily prayer and Islamic schedule times
 * for a specific date and settings using adhan-js.
 */
export function calculatePrayerTimes(
  date: Date,
  settings: PrayerTimesSettings = DEFAULT_PRAYER_SETTINGS
): DailyPrayerTimes {
  const coords = new Coordinates(
    settings.location.lat,
    settings.location.lng
  );
  const params = getAdhanCalculationParameters(
    settings.calculationMethod,
    settings.madhab,
    settings.highLatitudeRule
  );

  const pt = new PrayerTimes(coords, date, params);
  const sunnah = new SunnahTimes(pt);

  // Formatting dateKey YYYY-MM-DD
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const dateKey = `${yyyy}-${mm}-${dd}`;

  // Extra Islamic Times
  const ishraq = new Date(pt.sunrise.getTime() + 15 * 60 * 1000);
  // Chasht (Duha) starts ~1.5h after sunrise or 1/3 between sunrise and dhuhr
  const chasht = new Date(
    pt.sunrise.getTime() + (pt.dhuhr.getTime() - pt.sunrise.getTime()) / 3
  );
  const zawalStart = new Date(pt.dhuhr.getTime() - 15 * 60 * 1000);
  const zawalEnd = new Date(pt.dhuhr.getTime());

  // Forbidden Times (৩টি মাকরুহ ওয়াক্ত)
  const forbiddenSunrise = {
    start: new Date(pt.sunrise.getTime()),
    end: new Date(pt.sunrise.getTime() + 15 * 60 * 1000),
    nameBn: "সূর্যোদয় কালীন নিষিদ্ধ সময়",
  };
  const forbiddenZawal = {
    start: zawalStart,
    end: zawalEnd,
    nameBn: "দ্বিপ্রহর (ইস্তিওয়া) নিষিদ্ধ সময়",
  };
  const forbiddenSunset = {
    start: new Date(pt.maghrib.getTime() - 15 * 60 * 1000),
    end: new Date(pt.maghrib.getTime()),
    nameBn: "সূর্যাস্ত কালীন নিষিদ্ধ সময়",
  };

  return {
    date,
    dateKey,
    fajr: pt.fajr,
    sunrise: pt.sunrise,
    dhuhr: pt.dhuhr,
    asr: pt.asr,
    maghrib: pt.maghrib,
    isha: pt.isha,
    tahajjudStart: sunnah.lastThirdOfTheNight,
    ishraq,
    chasht,
    zawalStart,
    zawalEnd,
    forbiddenSunrise,
    forbiddenZawal,
    forbiddenSunset,
    sehriEnd: pt.fajr,
    iftar: pt.maghrib,
  };
}

/**
 * Computes the current waqt, whether right now is in a forbidden time,
 * the next prayer, and milliseconds countdown.
 */
export function getCurrentWaqtInfo(
  now: Date,
  todayTimes: DailyPrayerTimes,
  tomorrowTimes?: DailyPrayerTimes
): CurrentWaqtInfo {
  const t = now.getTime();

  // Check forbidden times first
  let isForbiddenNow = false;
  let forbiddenReasonBn: string | undefined;

  if (
    t >= todayTimes.forbiddenSunrise.start.getTime() &&
    t < todayTimes.forbiddenSunrise.end.getTime()
  ) {
    isForbiddenNow = true;
    forbiddenReasonBn =
      "সূর্যোদয়ের সময় — সূর্য পুরোপুরি ওঠার আগ পর্যন্ত (প্রায় ১৫ মিনিট) যেকোনো সালাত আদায় মাকরূহে তাহরীমী।";
  } else if (
    t >= todayTimes.forbiddenZawal.start.getTime() &&
    t < todayTimes.forbiddenZawal.end.getTime()
  ) {
    isForbiddenNow = true;
    forbiddenReasonBn =
      "নিস্তব্ধ দ্বিপ্রহর (ইস্তিওয়া) — সূর্য মাথার উপর থাকা অবস্থায় যোহরের ওয়াক্ত শুরুর আগ পর্যন্ত সালাত পড়া নিষিদ্ধ।";
  } else if (
    t >= todayTimes.forbiddenSunset.start.getTime() &&
    t < todayTimes.forbiddenSunset.end.getTime()
  ) {
    isForbiddenNow = true;
    forbiddenReasonBn =
      "সূর্যাস্তের সময় — সূর্যাস্তের পূর্বের ১৫ মিনিটে সালাত আদায় নিষিদ্ধ (শুধুমাত্র সেদিনের আসর না পড়ে থাকলে তা দ্রুত পড়ে নেওয়া যায়)।";
  }

  // Determine current waqt and next prayer
  let currentWaqt: WaqtKey = "none";
  let currentWaqtNameBn = "ওয়াক্ত নির্ধারণ হচ্ছে";
  let nextPrayer: WaqtKey = "fajr";
  let nextPrayerNameBn = "ফজর";
  let nextPrayerTime = todayTimes.fajr;

  if (t < todayTimes.fajr.getTime()) {
    currentWaqt = "isha";
    currentWaqtNameBn = "তাহাজ্জুদ / শেষ রাত";
    nextPrayer = "fajr";
    nextPrayerNameBn = "ফজর";
    nextPrayerTime = todayTimes.fajr;
  } else if (t < todayTimes.sunrise.getTime()) {
    currentWaqt = "fajr";
    currentWaqtNameBn = "ফজর";
    nextPrayer = "sunrise";
    nextPrayerNameBn = "সূর্যোদয়";
    nextPrayerTime = todayTimes.sunrise;
  } else if (t < todayTimes.dhuhr.getTime()) {
    currentWaqt = "sunrise";
    currentWaqtNameBn = "ইশরাক ও চাশত (নফল)";
    nextPrayer = "dhuhr";
    nextPrayerNameBn = "যোহর";
    nextPrayerTime = todayTimes.dhuhr;
  } else if (t < todayTimes.asr.getTime()) {
    currentWaqt = "dhuhr";
    currentWaqtNameBn = "যোহর";
    nextPrayer = "asr";
    nextPrayerNameBn = "আসর";
    nextPrayerTime = todayTimes.asr;
  } else if (t < todayTimes.maghrib.getTime()) {
    currentWaqt = "asr";
    currentWaqtNameBn = "আসর";
    nextPrayer = "maghrib";
    nextPrayerNameBn = "মাগরিব";
    nextPrayerTime = todayTimes.maghrib;
  } else if (t < todayTimes.isha.getTime()) {
    currentWaqt = "maghrib";
    currentWaqtNameBn = "মাগরিব";
    nextPrayer = "isha";
    nextPrayerNameBn = "এশা";
    nextPrayerTime = todayTimes.isha;
  } else {
    currentWaqt = "isha";
    currentWaqtNameBn = "এশা";
    nextPrayer = "fajr";
    nextPrayerNameBn = "ফজর";
    if (tomorrowTimes) {
      nextPrayerTime = tomorrowTimes.fajr;
    } else {
      // 24 hours later estimated
      nextPrayerTime = new Date(todayTimes.fajr.getTime() + 86400000);
    }
  }

  const diffMs = Math.max(0, nextPrayerTime.getTime() - t);
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hh = hours < 10 ? `0${hours}` : `${hours}`;
  const mm = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const ss = seconds < 10 ? `0${seconds}` : `${seconds}`;

  const timeRemainingShort = `${toBengaliNumber(hh)}:${toBengaliNumber(mm)}:${toBengaliNumber(ss)}`;

  let timeRemainingFormatted = "";
  if (hours > 0) {
    timeRemainingFormatted += `${toBengaliNumber(hours)} ঘণ্টা `;
  }
  timeRemainingFormatted += `${toBengaliNumber(minutes)} মিনিট ${toBengaliNumber(seconds)} সেকেন্ড`;

  return {
    currentWaqt,
    currentWaqtNameBn,
    isForbiddenNow,
    forbiddenReasonBn,
    nextPrayer,
    nextPrayerNameBn,
    nextPrayerTime,
    timeRemainingMs: diffMs,
    timeRemainingShort,
    timeRemainingFormatted,
  };
}

/**
 * Generates an array of DailyPrayerTimes for every day of a calendar month.
 * Month is 0-indexed (0 = Jan, 11 = Dec).
 */
export function getMonthlyPrayerTimes(
  year: number,
  month: number,
  settings: PrayerTimesSettings = DEFAULT_PRAYER_SETTINGS
): DailyPrayerTimes[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const list: DailyPrayerTimes[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d, 12, 0, 0);
    list.push(calculatePrayerTimes(date, settings));
  }

  return list;
}

/**
 * Computes exact Qibla bearing in degrees (0-360) from North.
 */
export function getQiblaBearing(lat: number, lng: number): number {
  const coords = new Coordinates(lat, lng);
  return Qibla(coords);
}

/**
 * Generates human instruction for facing Qibla:
 * e.g. "উত্তর থেকে ঘড়ির কাঁটার দিকে ২৭৮° (পশ্চিম-উত্তর-পশ্চিম)"
 */
export function getQiblaDirectionDescription(bearing: number): string {
  const deg = Math.round(bearing);
  let cardinal = "";

  if (deg >= 337.5 || deg < 22.5) cardinal = "উত্তর";
  else if (deg >= 22.5 && deg < 67.5) cardinal = "উত্তর-পূর্ব";
  else if (deg >= 67.5 && deg < 112.5) cardinal = "পূর্ব";
  else if (deg >= 112.5 && deg < 157.5) cardinal = "দক্ষিণ-পূর্ব";
  else if (deg >= 157.5 && deg < 202.5) cardinal = "দক্ষিণ";
  else if (deg >= 202.5 && deg < 247.5) cardinal = "দক্ষিণ-পশ্চিম";
  else if (deg >= 247.5 && deg < 292.5) cardinal = "পশ্চিম";
  else cardinal = "উত্তর-পশ্চিম";

  return `উত্তর থেকে ঘড়ির কাঁটার দিকে ${toBengaliNumber(deg)}° (${cardinal})`;
}

