import { toBengaliNumber } from "@/src/lib/bengali";

const BANGLA_DAYS = [
  "রবিবার",
  "সোমবার",
  "মঙ্গলবার",
  "বুধবার",
  "বৃহস্পতিবার",
  "শুক্রবার",
  "শনিবার",
];

const BANGLA_MONTHS_GREGORIAN = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

const BENGALI_MONTHS = [
  "বৈশাখ",
  "জ্যৈষ্ঠ",
  "আষাঢ়",
  "শ্রাবণ",
  "ভাদ্র",
  "আশ্বিন",
  "কার্তিক",
  "অগ্রহায়ণ",
  "পৌষ",
  "মাঘ",
  "ফাল্গুন",
  "চৈত্র",
];

/**
 * Formats a Date into standard 12-hour Bangla time string
 * with explicit periods: "সকাল/দুপুর/বিকাল/সন্ধ্যা/রাত".
 * Examples:
 *  - 04:50 -> "সকাল ৪:৫০"
 *  - 11:45 -> "সকাল ১১:৪৫"
 *  - 12:30 -> "দুপুর ১২:৩০"
 *  - 15:40 -> "বিকাল ৩:৪০"
 *  - 17:15 -> "সন্ধ্যা ৫:১৫"
 *  - 19:30 -> "সন্ধ্যা ৭:৩০"
 *  - 20:15 -> "রাত ৮:১৫"
 *  - 01:20 -> "রাত ১:২০"
 */
export function formatBanglaTime(date: Date, includeSeconds = false): string {
  const hours24 = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  let period = "রাত";
  if (hours24 >= 4 && hours24 < 12) {
    period = "সকাল";
  } else if (hours24 >= 12 && hours24 < 15) {
    period = "দুপুর";
  } else if (hours24 >= 15 && hours24 < 17) {
    period = "বিকাল";
  } else if (hours24 >= 17 && hours24 < 20) {
    period = "সন্ধ্যা";
  } else {
    period = "রাত";
  }

  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const mm = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const ss = seconds < 10 ? `0${seconds}` : `${seconds}`;

  const timeStr = includeSeconds
    ? `${toBengaliNumber(hours12)}:${toBengaliNumber(mm)}:${toBengaliNumber(ss)}`
    : `${toBengaliNumber(hours12)}:${toBengaliNumber(mm)}`;

  return `${period} ${timeStr}`;
}

/**
 * Short digital time: "০৪:৫০" (without period word)
 */
export function formatBanglaTimeShort(date: Date): string {
  const hours24 = date.getHours();
  const minutes = date.getMinutes();
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const mm = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${toBengaliNumber(hours12)}:${toBengaliNumber(mm)}`;
}

/**
 * Gregorian date in Bangla: "৬ নভেম্বর ২০২৬, শুক্রবার"
 */
export function formatGregorianDateBn(date: Date, includeDay = true): string {
  const day = toBengaliNumber(date.getDate());
  const month = BANGLA_MONTHS_GREGORIAN[date.getMonth()];
  const year = toBengaliNumber(date.getFullYear());
  const dayName = BANGLA_DAYS[date.getDay()];

  if (!includeDay) {
    return `${day} ${month} ${year}`;
  }
  return `${day} ${month} ${year}, ${dayName}`;
}

export function getBanglaDayName(date: Date): string {
  return BANGLA_DAYS[date.getDay()];
}

/**
 * Accurate Hijri date using Intl.DateTimeFormat (islamic-umalqura),
 * with support for manual ±1 or ±2 day adjustment.
 */
export function formatHijriDate(date: Date, offsetDays = 0): string {
  try {
    const adjustedDate = new Date(date.getTime() + offsetDays * 86400000);
    const formatter = new Intl.DateTimeFormat("bn-BD-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    let formatted = formatter.format(adjustedDate);
    // Remove trailing " যুগ" or " হিজরি" if repeated, and normalize
    formatted = formatted.replace(/\s*যুগ\s*/g, " ").trim();
    if (!formatted.includes("হিজরি")) {
      formatted += " হিজরি";
    }
    return formatted;
  } catch {
    // Fallback if Intl calendar fails
    return "হিজরি তারিখ";
  }
}

/**
 * Accurate Bangla San (বঙ্গাব্দ) calculation following the Bangladesh Academy calendar revision:
 * - Boishakh to Ashwin (first 6 months): 31 days
 * - Kartik to Magh (next 4 months): 30 days
 * - Falgun: 29 days (30 in Gregorian leap years)
 * - Chaitra: 30 days
 * Year offset: Gregorian year - 593 (after April 14), or Gregorian year - 594 (before April 14).
 */
export function formatBanglaDate(date: Date): string {
  const year = date.getFullYear();
  const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

  // Month day limits for revised calendar:
  // Boishakh starts on April 14
  // Days from April 14 to today:
  const epoch = new Date(year, 3, 14); // April 14
  let bengaliYear = year - 593;

  if (date < epoch) {
    bengaliYear = year - 594;
  }

  // Calculate day difference from last April 14
  const startOfYear = date >= epoch ? epoch : new Date(year - 1, 3, 14);
  const diffTime = date.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diffTime / 86400000); // 0-based day of Bengali year

  const monthLengths = [
    31, // Boishakh (starts Apr 14)
    31, // Jaistha (starts May 15)
    31, // Ashar (starts Jun 15)
    31, // Srabon (starts Jul 16)
    31, // Bhadro (starts Aug 16)
    31, // Ashwin (starts Sep 16)
    30, // Kartik (starts Oct 17)
    30, // Agrahayan (starts Nov 16)
    30, // Poush (starts Dec 16)
    30, // Magh (starts Jan 15)
    isLeapYear ? 30 : 29, // Falgun (starts Feb 14)
    30, // Chaitra (starts Mar 15)
  ];

  let accumulated = 0;
  let bnMonthIndex = 0;
  let bnDay = 1;

  for (let i = 0; i < monthLengths.length; i++) {
    if (dayOfYear < accumulated + monthLengths[i]) {
      bnMonthIndex = i;
      bnDay = dayOfYear - accumulated + 1;
      break;
    }
    accumulated += monthLengths[i];
  }

  // Ensure safe boundaries
  bnMonthIndex = Math.max(0, Math.min(11, bnMonthIndex));
  bnDay = Math.max(1, Math.min(31, bnDay));

  return `${toBengaliNumber(bnDay)} ${BENGALI_MONTHS[bnMonthIndex]} ${toBengaliNumber(bengaliYear)} বঙ্গাব্দ`;
}
