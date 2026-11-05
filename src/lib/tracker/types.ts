export type FardPrayerKey = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha" | "witr";

export type SunnahPrayerKey =
  | "fajr_sunnah"
  | "dhuhr_sunnah_before"
  | "dhuhr_sunnah_after"
  | "asr_sunnah"
  | "maghrib_sunnah"
  | "isha_sunnah"
  | "tahajjud"
  | "ishraq"
  | "chasht";

export type PrayerStatus = "completed" | "jamaat" | "qaza" | "pending";

export interface DayPrayerLog {
  date: string; // ISO format: YYYY-MM-DD
  prayers: Record<FardPrayerKey, PrayerStatus>;
  sunnahs?: Partial<Record<SunnahPrayerKey, boolean>>;
  notes?: string;
  updatedAt: number;
}

export interface QazaRecord {
  fajr: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
  witr: number;
  initialCounts: Record<FardPrayerKey, number>;
  updatedAt: number;
}

export interface TrackerBackupData {
  version: 1;
  exportedAt: string;
  source: "namajshikkha-prayer-tracker";
  logs: DayPrayerLog[];
  qaza: QazaRecord;
}

export interface PrayerStreakStats {
  currentStreak: number;
  bestStreak: number;
  thisWeekCompleted: number;
  thisWeekTotal: number;
  thisWeekPercent: number;
  totalTrackedDays: number;
}

export const FARD_PRAYER_META: Record<
  FardPrayerKey,
  { nameBn: string; nameEn: string; rakats: string; isWajib?: boolean }
> = {
  fajr: { nameBn: "ফজর", nameEn: "Fajr", rakats: "২ রাকাত ফরজ" },
  dhuhr: { nameBn: "যোহর", nameEn: "Dhuhr", rakats: "৪ রাকাত ফরজ" },
  asr: { nameBn: "আসর", nameEn: "Asr", rakats: "৪ রাকাত ফরজ" },
  maghrib: { nameBn: "মাগরিব", nameEn: "Maghrib", rakats: "৩ রাকাত ফরজ" },
  isha: { nameBn: "এশা", nameEn: "Isha", rakats: "৪ রাকাত ফরজ" },
  witr: { nameBn: "বিতর", nameEn: "Witr", rakats: "৩ রাকাত ওয়াজিব", isWajib: true },
};

export const SUNNAH_PRAYER_META: Record<
  SunnahPrayerKey,
  { nameBn: string; rakats: string; categoryBn: string }
> = {
  fajr_sunnah: { nameBn: "ফজরের সুন্নত", rakats: "২ রাকাত", categoryBn: "সুন্নাতে মুয়াক্কাদাহ" },
  dhuhr_sunnah_before: { nameBn: "যোহরের পূর্বের সুন্নত", rakats: "৪ রাকাত", categoryBn: "সুন্নাতে মুয়াক্কাদাহ" },
  dhuhr_sunnah_after: { nameBn: "যোহরের পরের সুন্নত", rakats: "২ রাকাত", categoryBn: "সুন্নাতে মুয়াক্কাদাহ" },
  asr_sunnah: { nameBn: "আসরের পূর্বের সুন্নত", rakats: "৪ রাকাত", categoryBn: "সুন্নাতে গায়রে মুয়াক্কাদাহ" },
  maghrib_sunnah: { nameBn: "মাগরিবের পরের সুন্নত", rakats: "২ রাকাত", categoryBn: "সুন্নাতে মুয়াক্কাদাহ" },
  isha_sunnah: { nameBn: "এশার পরের সুন্নত", rakats: "২ রাকাত", categoryBn: "সুন্নাতে মুয়াক্কাদাহ" },
  tahajjud: { nameBn: "তাহাজ্জুদ সালাত", rakats: "২-১২ রাকাত", categoryBn: "নফল সালাত" },
  ishraq: { nameBn: "ইশরাক সালাত", rakats: "২-৪ রাকাত", categoryBn: "নফল সালাত" },
  chasht: { nameBn: "চাশত (দুহা) সালাত", rakats: "২-৮ রাকাত", categoryBn: "নফল সালাত" },
};

