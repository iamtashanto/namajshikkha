import { describe, it, expect } from "vitest";
import { BANGLADESH_DISTRICTS } from "@/src/data/locations";
import {
  calculatePrayerTimes,
  getCurrentWaqtInfo,
  getQiblaBearing,
  getQiblaDirectionDescription,
  DEFAULT_PRAYER_SETTINGS,
} from "@/src/lib/prayer-times/calculator";
import {
  formatBanglaTime,
  formatBanglaDate,
  formatHijriDate,
} from "@/src/lib/prayer-times/dates";
import {
  calculateStreakStats,
  clearAllTrackerData,
  exportTrackerBackup,
  getAllLogs,
  getDayLog,
  getQazaRecord,
  hasStartedTracking,
  importTrackerBackup,
  saveDayLog,
  saveQazaRecord,
} from "@/src/lib/tracker/storage";
import { DayPrayerLog, QazaRecord, TrackerBackupData } from "@/src/lib/tracker/types";

describe("1. Prayer Times Engine & Acceptance Criteria", () => {
  it("matches Islamic Foundation Bangladesh / Karachi reference for Dhaka within ±2 minutes across fixed dates", () => {
    const dhakaSettings = {
      ...DEFAULT_PRAYER_SETTINGS,
      location: BANGLADESH_DISTRICTS.find((d) => d.id === "dhaka")!,
      calculationMethod: "Karachi" as const,
      madhab: "Hanafi" as const,
    };

    // Helper to get minutes from midnight in UTC+6 (Bangladesh Standard Time)
    const getBstMinutes = (date: Date): number => {
      // Local time in BST: UTC hours * 60 + UTC minutes + 360 mins (6h offset)
      const totalUtcMin = date.getUTCHours() * 60 + date.getUTCMinutes() + 360;
      return (totalUtcMin + 1440) % 1440;
    };

    // Fixed Test Date 1: 2026-01-01 (Winter)
    // Reference: Fajr 5:20 (320m), Sunrise 6:41 (401m), Dhuhr 12:03 (723m), Asr 15:47 (947m), Maghrib 17:23 (1043m), Isha 18:43 (1123m)
    const tJan1 = calculatePrayerTimes(
      new Date("2026-01-01T12:00:00Z"),
      dhakaSettings
    );
    expect(Math.abs(getBstMinutes(tJan1.fajr) - 320)).toBeLessThanOrEqual(2);
    expect(Math.abs(getBstMinutes(tJan1.sunrise) - 401)).toBeLessThanOrEqual(2);
    expect(Math.abs(getBstMinutes(tJan1.dhuhr) - 723)).toBeLessThanOrEqual(2);
    expect(Math.abs(getBstMinutes(tJan1.asr) - 947)).toBeLessThanOrEqual(2);
    expect(Math.abs(getBstMinutes(tJan1.maghrib) - 1043)).toBeLessThanOrEqual(2);
    expect(Math.abs(getBstMinutes(tJan1.isha) - 1123)).toBeLessThanOrEqual(2);

    // Fixed Test Date 2: 2026-04-14 (Spring / Pohela Boishakh)
    // Reference: Fajr 4:21 (261m), Sunrise 5:38 (338m), Dhuhr 12:00 (720m), Asr 16:31 (991m), Maghrib 18:19 (1099m), Isha 19:37 (1177m)
    const tApr14 = calculatePrayerTimes(
      new Date("2026-04-14T12:00:00Z"),
      dhakaSettings
    );
    expect(Math.abs(getBstMinutes(tApr14.fajr) - 261)).toBeLessThanOrEqual(2);
    expect(Math.abs(getBstMinutes(tApr14.sunrise) - 338)).toBeLessThanOrEqual(2);
    expect(Math.abs(getBstMinutes(tApr14.dhuhr) - 720)).toBeLessThanOrEqual(2);
    expect(Math.abs(getBstMinutes(tApr14.asr) - 991)).toBeLessThanOrEqual(2);
    expect(Math.abs(getBstMinutes(tApr14.maghrib) - 1099)).toBeLessThanOrEqual(2);
    expect(Math.abs(getBstMinutes(tApr14.isha) - 1177)).toBeLessThanOrEqual(2);

    // Fixed Test Date 3: 2026-11-06 (Autumn)
    // Reference: Fajr 4:50 (290m), Sunrise 6:07 (367m), Dhuhr 11:43 (703m), Asr 15:40 (940m), Maghrib 17:17 (1037m), Isha 18:34 (1114m)
    const tNov6 = calculatePrayerTimes(
      new Date("2026-11-06T12:00:00Z"),
      dhakaSettings
    );
    expect(Math.abs(getBstMinutes(tNov6.fajr) - 290)).toBeLessThanOrEqual(2);
    expect(Math.abs(getBstMinutes(tNov6.sunrise) - 367)).toBeLessThanOrEqual(2);
    expect(Math.abs(getBstMinutes(tNov6.dhuhr) - 703)).toBeLessThanOrEqual(2);
    expect(Math.abs(getBstMinutes(tNov6.asr) - 940)).toBeLessThanOrEqual(2);
    expect(Math.abs(getBstMinutes(tNov6.maghrib) - 1037)).toBeLessThanOrEqual(2);
    expect(Math.abs(getBstMinutes(tNov6.isha) - 1114)).toBeLessThanOrEqual(2);
  });

  it("calculates accurate Qibla bearing for Dhaka and describes direction in Bangla", () => {
    const bearing = getQiblaBearing(23.8103, 90.4125);
    // Dhaka Qibla bearing is approximately 277.57°
    expect(bearing).toBeGreaterThanOrEqual(277);
    expect(bearing).toBeLessThanOrEqual(278.5);

    const desc = getQiblaDirectionDescription(bearing);
    expect(desc).toContain("২৭৮°");
    expect(desc).toContain("উত্তর থেকে ঘড়ির কাঁটার দিকে");
    expect(desc).toContain("পশ্চিম");
  });

  it("verifies all 64 districts of Bangladesh have valid coordinates, division, and names", () => {
    expect(BANGLADESH_DISTRICTS).toHaveLength(64);
    for (const d of BANGLADESH_DISTRICTS) {
      expect(d.id.length).toBeGreaterThan(0);
      expect(d.nameBn.length).toBeGreaterThan(0);
      expect(d.nameEn.length).toBeGreaterThan(0);
      expect(d.divisionBn).toBeDefined();
      expect(d.lat).toBeGreaterThan(20);
      expect(d.lat).toBeLessThan(27);
      expect(d.lng).toBeGreaterThan(88);
      expect(d.lng).toBeLessThan(93);
    }
  });

  it("formats dates in Bangla 12h format, Bangla San, and Hijri with manual offset", () => {
    const date = new Date(2026, 10, 6, 15, 40); // 3:40 PM on Nov 6, 2026
    const formattedTime = formatBanglaTime(date);
    expect(formattedTime).toContain("বিকাল");
    expect(formattedTime).toContain("৩:৪০");

    const morningDate = new Date(2026, 10, 6, 5, 15);
    expect(formatBanglaTime(morningDate)).toContain("সকাল");

    const bnDate = formatBanglaDate(date);
    expect(bnDate).toContain("বঙ্গাব্দ");
    expect(bnDate).toContain("কার্তিক");

    const hijriDate = formatHijriDate(date, 0);
    expect(hijriDate).toContain("হিজরি");

    const adjustedHijri = formatHijriDate(date, 1);
    expect(adjustedHijri.length).toBeGreaterThan(0);
  });

  it("correctly identifies forbidden times and calculates waqt transitions", () => {
    const dhakaSettings = DEFAULT_PRAYER_SETTINGS;
    const pt = calculatePrayerTimes(new Date("2026-11-06T12:00:00Z"), dhakaSettings);

    // Exact Zawal period: 5 mins before Dhuhr
    const zawalMoment = new Date(pt.dhuhr.getTime() - 5 * 60 * 1000);
    const waqtDuringZawal = getCurrentWaqtInfo(zawalMoment, pt);
    expect(waqtDuringZawal.isForbiddenNow).toBe(true);
    expect(waqtDuringZawal.forbiddenReasonBn).toContain("দ্বিপ্রহর");

    // Normal Dhuhr time: 30 mins after Dhuhr starts
    const dhuhrMoment = new Date(pt.dhuhr.getTime() + 30 * 60 * 1000);
    const waqtDuringDhuhr = getCurrentWaqtInfo(dhuhrMoment, pt);
    expect(waqtDuringDhuhr.isForbiddenNow).toBe(false);
    expect(waqtDuringDhuhr.currentWaqt).toBe("dhuhr");
    expect(waqtDuringDhuhr.nextPrayer).toBe("asr");
  });
});

describe("2. Prayer Tracker Engine & Device Storage", () => {
  it("saves day logs, calculates streaks, and handles export -> clear -> import round-trip", async () => {
    // Clean initial state
    await clearAllTrackerData();
    expect(await hasStartedTracking()).toBe(false);

    // 1. Create and save day logs
    const log1: DayPrayerLog = {
      date: "2026-11-05",
      prayers: {
        fajr: "completed",
        dhuhr: "jamaat",
        asr: "completed",
        maghrib: "completed",
        isha: "completed",
        witr: "completed",
      },
      updatedAt: Date.now(),
    };

    const log2: DayPrayerLog = {
      date: "2026-11-06",
      prayers: {
        fajr: "completed",
        dhuhr: "completed",
        asr: "pending",
        maghrib: "pending",
        isha: "pending",
        witr: "pending",
      },
      updatedAt: Date.now(),
    };

    await saveDayLog(log1);
    await saveDayLog(log2);

    const qazaRec: QazaRecord = {
      fajr: 10,
      dhuhr: 5,
      asr: 8,
      maghrib: 3,
      isha: 12,
      witr: 4,
      initialCounts: {
        fajr: 10,
        dhuhr: 5,
        asr: 8,
        maghrib: 3,
        isha: 12,
        witr: 4,
      },
      updatedAt: Date.now(),
    };
    await saveQazaRecord(qazaRec);

    expect(await hasStartedTracking()).toBe(true);

    // Verify day retrieval
    const retrieved = await getDayLog("2026-11-05");
    expect(retrieved).not.toBeNull();
    expect(retrieved?.prayers.dhuhr).toBe("jamaat");

    // Check streak calculation
    const all = await getAllLogs();
    const stats = calculateStreakStats(all);
    expect(stats.totalTrackedDays).toBe(2);

    // 2. Export Backup
    const backup: TrackerBackupData = await exportTrackerBackup();
    expect(backup.logs).toHaveLength(2);
    expect(backup.qaza.fajr).toBe(10);
    expect(backup.source).toBe("namajshikkha-prayer-tracker");

    // 3. Clear All Data
    await clearAllTrackerData();
    expect(await hasStartedTracking()).toBe(false);
    expect(await getAllLogs()).toHaveLength(0);
    const emptyQaza = await getQazaRecord();
    expect(emptyQaza.fajr).toBe(0);

    // 4. Import Backup
    await importTrackerBackup(backup);
    expect(await hasStartedTracking()).toBe(true);
    const restoredLogs = await getAllLogs();
    expect(restoredLogs).toHaveLength(2);

    const restoredQaza = await getQazaRecord();
    expect(restoredQaza.fajr).toBe(10);
    expect(restoredQaza.witr).toBe(4);
  });
});
