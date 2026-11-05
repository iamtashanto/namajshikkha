"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Users,
  Clock,
  Circle,
  Flame,
  Award,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
  Trash2,
  ShieldCheck,
  Plus,
  Minus,
  Sparkles,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import {
  DayPrayerLog,
  FardPrayerKey,
  FARD_PRAYER_META,
  PrayerStatus,
  PrayerStreakStats,
  QazaRecord,
  SUNNAH_PRAYER_META,
  SunnahPrayerKey,
  TrackerBackupData,
} from "@/src/lib/tracker/types";
import {
  calculateStreakStats,
  clearAllTrackerData,
  createDefaultDayLog,
  createDefaultQazaRecord,
  exportTrackerBackup,
  getAllLogs,
  getDayLog,
  getQazaRecord,
  importTrackerBackup,
  saveDayLog,
  saveQazaRecord,
} from "@/src/lib/tracker/storage";
import {
  getRandomMotivationalQuote,
  MotivationalQuote,
} from "@/src/lib/tracker/motivation";
import { toBengaliNumber } from "@/src/lib/bengali";
import {
  formatBanglaDate,
  formatGregorianDateBn,
} from "@/src/lib/prayer-times/dates";

const PRAYER_STATUS_CONFIG: Record<
  PrayerStatus,
  {
    labelBn: string;
    icon: typeof CheckCircle2;
    activeClass: string;
    badgeClass: string;
  }
> = {
  completed: {
    labelBn: "আদায়",
    icon: CheckCircle2,
    activeClass: "bg-emerald-600 text-white shadow-xs border-emerald-600",
    badgeClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300",
  },
  jamaat: {
    labelBn: "জামাতে",
    icon: Users,
    activeClass: "bg-blue-600 text-white shadow-xs border-blue-600",
    badgeClass: "bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300",
  },
  qaza: {
    labelBn: "কাযা",
    icon: Clock,
    activeClass: "bg-amber-600 text-white shadow-xs border-amber-600",
    badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300",
  },
  pending: {
    labelBn: "বাকি",
    icon: Circle,
    activeClass: "bg-gray-200 text-gray-800 dark:bg-dark-border dark:text-dark-text border-gray-300",
    badgeClass: "bg-gray-100 text-gray-600 dark:bg-dark-bg dark:text-dark-text-muted",
  },
};

const FARD_KEYS: FardPrayerKey[] = [
  "fajr",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
  "witr",
];

const SUNNAH_KEYS: SunnahPrayerKey[] = [
  "fajr_sunnah",
  "dhuhr_sunnah_before",
  "dhuhr_sunnah_after",
  "asr_sunnah",
  "maghrib_sunnah",
  "isha_sunnah",
  "tahajjud",
  "ishraq",
  "chasht",
];

export function TrackerClient() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dayLog, setDayLog] = useState<DayPrayerLog>(() =>
    createDefaultDayLog(toDateKey(new Date()))
  );
  const [allLogs, setAllLogs] = useState<DayPrayerLog[]>([]);
  const [qaza, setQaza] = useState<QazaRecord>(() =>
    createDefaultQazaRecord()
  );
  const [showSunnahs, setShowSunnahs] = useState<boolean>(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState<boolean>(false);
  const [importStatusMessage, setImportStatusMessage] = useState<string | null>(
    null
  );

  // Motivational quote for today
  const selectedDateKey = toDateKey(selectedDate);
  const quote: MotivationalQuote = useMemo(
    () => getRandomMotivationalQuote(selectedDateKey),
    [selectedDateKey]
  );

  // Load Day Log, All Logs, and Qaza record
  const refreshLogs = useCallback(async () => {
    try {
      const logs = await getAllLogs();
      setAllLogs(logs);
      const qazaRecord = await getQazaRecord();
      setQaza(qazaRecord);
    } catch {
      // Ignore
    }
  }, []);

  const reloadDateData = useCallback(async (dateKey: string) => {
    try {
      const log = await getDayLog(dateKey);
      setDayLog(log || createDefaultDayLog(dateKey));
      await refreshLogs();
    } catch {
      // Ignore
    }
  }, [refreshLogs]);

  useEffect(() => {
    let isCancelled = false;
    async function fetchData() {
      try {
        const log = await getDayLog(selectedDateKey);
        if (isCancelled) return;
        setDayLog(log || createDefaultDayLog(selectedDateKey));

        const logs = await getAllLogs();
        if (isCancelled) return;
        setAllLogs(logs);

        const qazaRecord = await getQazaRecord();
        if (isCancelled) return;
        setQaza(qazaRecord);
      } catch {
        // Ignore
      }
    }
    fetchData();
    return () => {
      isCancelled = true;
    };
  }, [selectedDateKey]);

  // Update a single prayer's status
  const handleSetPrayerStatus = async (
    key: FardPrayerKey,
    status: PrayerStatus
  ) => {
    const updated: DayPrayerLog = {
      ...dayLog,
      prayers: {
        ...dayLog.prayers,
        [key]: status,
      },
    };
    setDayLog(updated);
    await saveDayLog(updated);

    // Refresh allLogs for streak & heatmap
    const refreshed = await getAllLogs();
    setAllLogs(refreshed);
  };

  // Toggle Sunnah prayer
  const handleToggleSunnah = async (key: SunnahPrayerKey) => {
    const currentVal = !!dayLog.sunnahs?.[key];
    const updated: DayPrayerLog = {
      ...dayLog,
      sunnahs: {
        ...dayLog.sunnahs,
        [key]: !currentVal,
      },
    };
    setDayLog(updated);
    await saveDayLog(updated);

    const refreshed = await getAllLogs();
    setAllLogs(refreshed);
  };

  // Qaza count adjust (+1 or -1)
  const handleAdjustQaza = async (key: FardPrayerKey, delta: number) => {
    const newCount = Math.max(0, qaza[key] + delta);
    const updated: QazaRecord = {
      ...qaza,
      [key]: newCount,
    };
    setQaza(updated);
    await saveQazaRecord(updated);
  };

  // Streak Stats
  const streakStats: PrayerStreakStats = useMemo(
    () => calculateStreakStats(allLogs),
    [allLogs]
  );

  // Export JSON file
  const handleExportJSON = async () => {
    try {
      const backup = await exportTrackerBackup();
      const jsonStr = JSON.stringify(backup, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `namajshikkha-tracker-backup-${toDateKey(new Date())}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert("ব্যাকআপ এক্সপোর্ট করতে সমস্যা হয়েছে।");
    }
  };

  // Import JSON file
  const handleImportJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as TrackerBackupData;
      await importTrackerBackup(parsed);
      await reloadDateData(selectedDateKey);
      setImportStatusMessage("আলহামদুলিল্লাহ! ব্যাকআপ সফলভাবে রিস্টোর হয়েছে।");
      setTimeout(() => setImportStatusMessage(null), 4000);
    } catch {
      alert("অবৈধ ব্যাকআপ ফাইল। সঠিক JSON ফাইল নির্বাচন করুন।");
    }
  };

  // Clear all data
  const handleClearAll = async () => {
    await clearAllTrackerData();
    setIsClearModalOpen(false);
    await reloadDateData(selectedDateKey);
  };

  // Date Navigation Helpers
  const goToPreviousDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
  };

  const goToNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const isSelectedDateToday =
    toDateKey(selectedDate) === toDateKey(new Date());

  // Monthly Heatmap generation (current selected date's month)
  const heatmapDays = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun

    const logMap = new Map<string, DayPrayerLog>();
    for (const l of allLogs) {
      logMap.set(l.date, l);
    }

    const days: {
      dateKey: string;
      dayNumber: number;
      completionRate: number; // 0 to 1
      isToday: boolean;
      isSelected: boolean;
    }[] = [];

    const todayStr = toDateKey(new Date());

    for (let d = 1; d <= daysInMonth; d++) {
      const dKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        d
      ).padStart(2, "0")}`;
      const l = logMap.get(dKey);

      let completedCount = 0;
      if (l) {
        for (const pk of FARD_KEYS) {
          if (l.prayers[pk] === "completed" || l.prayers[pk] === "jamaat") {
            completedCount++;
          }
        }
      }

      days.push({
        dateKey: dKey,
        dayNumber: d,
        completionRate: completedCount / 6,
        isToday: dKey === todayStr,
        isSelected: dKey === selectedDateKey,
      });
    }

    return { days, firstDayOfWeek };
  }, [selectedDate, allLogs, selectedDateKey]);

  // Qaza total calculation
  const totalQazaRemaining =
    qaza.fajr + qaza.dhuhr + qaza.asr + qaza.maghrib + qaza.isha + qaza.witr;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Top Breadcrumb */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-dark-text-muted">
          <Link href="/" className="hover:text-emerald-600">
            হোম
          </Link>
          <span>/</span>
          <span className="font-semibold text-gray-800 dark:text-white">
            নামাজ ট্র্যাকার (Prayer Tracker)
          </span>
        </div>

        <Link
          href="/masail/qaza-rules"
          className="bangla-text inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-white px-3.5 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-50 dark:border-dark-border dark:bg-dark-card dark:text-emerald-300"
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>কাযা নামাজের শরয়ী বিধান</span>
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-950/40">
          <CalendarIcon className="h-7 w-7" />
        </div>

        <h1 className="bangla-text text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          দৈনিক নামাজ ট্র্যাকার ও কাযা হিসাব
        </h1>
        <p className="bangla-text mx-auto mt-2 max-w-lg text-sm text-gray-600 dark:text-dark-text-secondary sm:text-base">
          আপনার ৫ ওয়াক্ত ফরজ ও বিতর সালাতের ধারাবাহিক হিসাব রাখুন। ১০০% অফলাইন ও
          গোপনীয়।
        </p>

        {/* Device-Only Privacy Guarantee Badge */}
        <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-1.5 text-xs font-semibold text-emerald-900 dark:border-dark-border dark:bg-emerald-950/40 dark:text-emerald-200">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>
            তথ্য আপনার ফোনে ১০০% সংরক্ষিত — কোনো সার্ভারে যায় না
          </span>
        </div>
      </div>

      {/* Motivational Hadith Card (Gentle, encouraging, non-shaming) */}
      <div className="mb-8 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/60 via-white to-white p-5 sm:p-6 shadow-xs dark:border-dark-border dark:from-emerald-950/30 dark:via-dark-card dark:to-dark-card">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-emerald-600" />
          <span className="bangla-text text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
            আজকের অনুপ্রেরণামূলক হাদিস
          </span>
        </div>
        <p className="bangla-text text-sm sm:text-base leading-relaxed text-gray-800 dark:text-dark-text italic font-medium">
          &ldquo;{quote.hadithTextBn}&rdquo;
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 dark:text-dark-text-muted">
          <span className="bangla-text font-semibold text-emerald-700 dark:text-emerald-400">
            — {quote.sourceBn} ({toBengaliNumber(quote.referenceNumber)})
          </span>
          <span className="bangla-text text-[11px] text-gray-600 dark:text-dark-text-secondary">
            {quote.messageBn}
          </span>
        </div>
      </div>

      {/* Streak & Weekly Progress Summary */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-orange-100 bg-orange-50/50 p-4 dark:border-orange-950/40 dark:bg-orange-950/20">
          <div className="flex items-center justify-between">
            <span className="bangla-text text-xs font-bold text-orange-900 dark:text-orange-300">
              বর্তমান ধারাবাহিকতা
            </span>
            <Flame className="h-4 w-4 text-orange-600" />
          </div>
          <div className="bangla-text mt-2 text-2xl sm:text-3xl font-extrabold text-orange-700 dark:text-orange-400">
            {toBengaliNumber(streakStats.currentStreak)} দিন
          </div>
          <p className="bangla-text mt-1 text-[10px] text-gray-500">
            নিয়মিত সালাত আদায়
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-950/40 dark:bg-emerald-950/20">
          <div className="flex items-center justify-between">
            <span className="bangla-text text-xs font-bold text-emerald-900 dark:text-emerald-300">
              সর্বোচ্চ রেকর্ড
            </span>
            <Award className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="bangla-text mt-2 text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-400">
            {toBengaliNumber(streakStats.bestStreak)} দিন
          </div>
          <p className="bangla-text mt-1 text-[10px] text-gray-500">
            সর্বোত্তম স্ট্রিক
          </p>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-sky-50/50 p-4 dark:border-sky-950/40 dark:bg-sky-950/20 col-span-2">
          <div className="flex items-center justify-between">
            <span className="bangla-text text-xs font-bold text-sky-900 dark:text-sky-300">
              এই সপ্তাহের সারাংশ (গত ৭ দিন)
            </span>
            <span className="bangla-text text-xs font-bold text-sky-700 dark:text-sky-400">
              {toBengaliNumber(streakStats.thisWeekPercent)}%
            </span>
          </div>
          <div className="bangla-text mt-2 text-xl sm:text-2xl font-extrabold text-sky-800 dark:text-sky-300">
            ৩৫ এর মধ্যে {toBengaliNumber(streakStats.thisWeekCompleted)} ওয়াক্ত
            আদায়
          </div>
          {/* Progress bar */}
          <div className="mt-2 h-2 w-full rounded-full bg-sky-200/70 overflow-hidden dark:bg-sky-900/50">
            <div
              className="h-full bg-sky-600 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, streakStats.thisWeekPercent)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Date Navigation Bar */}
      <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-3.5 dark:border-dark-border dark:bg-dark-card shadow-xs">
        <button
          type="button"
          onClick={goToPreviousDay}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-100 dark:border-dark-border"
          aria-label="পূর্ববর্তী দিন"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="text-center">
          <div className="bangla-text text-sm sm:text-base font-bold text-gray-900 dark:text-white">
            {formatGregorianDateBn(selectedDate)}
          </div>
          <div className="bangla-text text-[11px] text-gray-500 dark:text-dark-text-muted">
            {formatBanglaDate(selectedDate)}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {!isSelectedDateToday && (
            <button
              type="button"
              onClick={goToToday}
              className="bangla-text rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300"
            >
              আজ
            </button>
          )}

          <button
            type="button"
            onClick={goToNextDay}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-100 dark:border-dark-border"
            aria-label="পরবর্তী দিন"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Daily Checklist Card (5 Fard + Witr) */}
      <div className="mb-8 rounded-3xl border border-emerald-200 bg-white p-5 sm:p-6 shadow-xs dark:border-dark-border dark:bg-dark-card">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="bangla-text text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              দৈনিক সালাত চেকলিস্ট (৫ ফরজ + বিতর)
            </h2>
            <p className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted">
              প্রতিটি ওয়াক্তে আপনার অবস্থা নির্বাচন করুন
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowSunnahs((v) => !v)}
            className="bangla-text text-xs font-bold text-emerald-700 underline dark:text-emerald-400"
          >
            {showSunnahs ? "সুন্নত লুকান" : "+ সুন্নত ও নফল সালাত"}
          </button>
        </div>

        <div className="space-y-3">
          {FARD_KEYS.map((key) => {
            const meta = FARD_PRAYER_META[key];
            const currentStatus = dayLog.prayers[key] || "pending";

            return (
              <div
                key={key}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50/50 p-3.5 dark:border-dark-border dark:bg-dark-bg/60"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bangla-text text-base font-bold text-gray-900 dark:text-white">
                      {meta.nameBn}
                    </span>
                    <span
                      className={`bangla-text rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                        meta.isWajib
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                          : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      }`}
                    >
                      {meta.rakats}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400">
                    {meta.nameEn}
                  </span>
                </div>

                {/* 4 State Pill Buttons */}
                <div className="grid grid-cols-4 gap-1.5 sm:flex sm:items-center">
                  {(
                    ["completed", "jamaat", "qaza", "pending"] as PrayerStatus[]
                  ).map((status) => {
                    const cfg = PRAYER_STATUS_CONFIG[status];
                    const isSelected = currentStatus === status;

                    return (
                      <button
                        key={status}
                        type="button"
                        onClick={() => handleSetPrayerStatus(key, status)}
                        className={`bangla-text flex items-center justify-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
                          isSelected
                            ? cfg.activeClass
                            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-100 dark:border-dark-border dark:bg-dark-card dark:text-dark-text-secondary"
                        }`}
                      >
                        <span>{cfg.labelBn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Optional Sunnahs Toggled Section */}
        {showSunnahs && (
          <div className="mt-5 border-t border-gray-100 pt-4 dark:border-dark-border">
            <h3 className="bangla-text text-sm font-bold text-emerald-900 dark:text-emerald-300 mb-3">
              সুন্নাত ও নফল সালাত ট্র্যাকিং (ঐচ্ছিক)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {SUNNAH_KEYS.map((key) => {
                const meta = SUNNAH_PRAYER_META[key];
                const isChecked = !!dayLog.sunnahs?.[key];

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleToggleSunnah(key)}
                    className={`flex items-center justify-between rounded-xl border p-3 text-left transition-colors ${
                      isChecked
                        ? "border-emerald-500 bg-emerald-50/80 dark:border-emerald-600 dark:bg-emerald-950/50"
                        : "border-gray-200 bg-white dark:border-dark-border dark:bg-dark-bg"
                    }`}
                  >
                    <div>
                      <div className="bangla-text text-xs font-bold text-gray-900 dark:text-white">
                        {meta.nameBn}
                      </div>
                      <div className="bangla-text text-[10px] text-gray-500">
                        {meta.rakats} • {meta.categoryBn}
                      </div>
                    </div>
                    {isChecked ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="h-4 w-4 text-gray-300 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Calendar Heatmap Card (Monthly adherence) */}
      <div className="mb-8 rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs dark:border-dark-border dark:bg-dark-card">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="bangla-text text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              চলতি মাসের সালাত হিটম্যাপ (Monthly Heatmap)
            </h3>
            <p className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted">
              সবুজ রং দিনে আদায়কৃত সালাতের হার নির্দেশ করে
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <span>কম</span>
            <span className="h-3 w-3 rounded-xs bg-gray-100 border border-gray-200 dark:bg-dark-bg dark:border-dark-border" />
            <span className="h-3 w-3 rounded-xs bg-emerald-200 dark:bg-emerald-900" />
            <span className="h-3 w-3 rounded-xs bg-emerald-400 dark:bg-emerald-700" />
            <span className="h-3 w-3 rounded-xs bg-emerald-600 dark:bg-emerald-500" />
            <span>বেশি</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"].map((d) => (
            <div
              key={d}
              className="bangla-text text-[11px] font-bold text-gray-400 mb-1"
            >
              {d}
            </div>
          ))}

          {/* Empty spacer cells before month start */}
          {Array.from({ length: heatmapDays.firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="h-10 rounded-xl" />
          ))}

          {/* Actual days */}
          {heatmapDays.days.map((d) => {
            let color =
              "bg-gray-100 text-gray-700 dark:bg-dark-bg dark:text-dark-text-muted";
            if (d.completionRate >= 0.8) {
              color = "bg-emerald-600 text-white font-bold";
            } else if (d.completionRate >= 0.5) {
              color = "bg-emerald-400 text-white font-bold";
            } else if (d.completionRate > 0) {
              color = "bg-emerald-200 text-emerald-950 font-bold dark:bg-emerald-900 dark:text-emerald-200";
            }

            return (
              <button
                key={d.dateKey}
                type="button"
                onClick={() => setSelectedDate(new Date(d.dateKey))}
                className={`relative flex h-10 items-center justify-center rounded-xl text-xs transition-all ${color} ${
                  d.isSelected
                    ? "ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-dark-card"
                    : ""
                }`}
              >
                <span className="bangla-text">{toBengaliNumber(d.dayNumber)}</span>
                {d.isToday && (
                  <span className="absolute bottom-1 h-1 w-1 rounded-full bg-rose-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Qaza Counter Card (কাযা সালাত হিসাব ও আদায়ের ট্র্যাকার) */}
      <div className="mb-8 rounded-3xl border border-amber-200 bg-amber-50/40 p-5 sm:p-6 shadow-xs dark:border-amber-900/40 dark:bg-amber-950/20">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="bangla-text text-base sm:text-lg font-bold text-amber-900 dark:text-amber-200">
              কাযা সালাত কাউন্টার (Qaza Tracker)
            </h3>
            <p className="bangla-text text-xs text-amber-800 dark:text-amber-300">
              অতীতে ছুটে যাওয়া নামাজের আনুমানিক সংখ্যা লিখুন এবং আদায় শেষে -১
              ট্যাপ করুন
            </p>
          </div>

          <span className="bangla-text rounded-xl bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 dark:bg-amber-900/60 dark:text-amber-200">
            মোট বাকি: {toBengaliNumber(totalQazaRemaining)} ওয়াক্ত
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {FARD_KEYS.map((key) => {
            const meta = FARD_PRAYER_META[key];
            const count = qaza[key] || 0;

            return (
              <div
                key={key}
                className="flex flex-col items-center justify-between rounded-2xl bg-white p-3.5 shadow-2xs dark:bg-dark-card border border-amber-100 dark:border-dark-border"
              >
                <span className="bangla-text text-xs font-bold text-gray-800 dark:text-white">
                  {meta.nameBn}
                </span>

                <div className="bangla-text my-2 text-2xl font-black text-amber-700 dark:text-amber-400">
                  {toBengaliNumber(count)}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleAdjustQaza(key, -1)}
                    disabled={count <= 0}
                    title="আদায় হয়েছে (-১)"
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-900 hover:bg-amber-200 disabled:opacity-40 dark:bg-amber-950 dark:text-amber-300"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAdjustQaza(key, 1)}
                    title="কাযা বৃদ্ধি (+১)"
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-dark-bg dark:text-dark-text"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Management: Export / Import / Clear All */}
      <div className="rounded-3xl border border-gray-200 bg-white p-5 sm:p-6 shadow-xs dark:border-dark-border dark:bg-dark-card">
        <h3 className="bangla-text text-base font-bold text-gray-900 dark:text-white mb-2">
          ডেটা ব্যাকআপ ও স্থানান্তর (Data Backup & Restore)
        </h3>
        <p className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted mb-4">
          ফোন পরিবর্তন বা ব্রাউজার ক্যাশে মুছে যাওয়ার ঝুঁকিমুক্ত থাকতে আপনার
          নামাজ ট্র্যাকার ডেটা সংরক্ষণ করে রাখতে পারেন।
        </p>

        {importStatusMessage && (
          <div className="mb-4 rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            {importStatusMessage}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleExportJSON}
            className="bangla-text inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
          >
            <Download className="h-4 w-4" />
            <span>ব্যাকআপ ডাউনলোড করুন (Export JSON)</span>
          </button>

          <label className="bangla-text inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-secondary">
            <Upload className="h-4 w-4 text-emerald-600" />
            <span>ব্যাকআপ লোড করুন (Import JSON)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="sr-only"
            />
          </label>

          <button
            type="button"
            onClick={() => setIsClearModalOpen(true)}
            className="bangla-text inline-flex items-center gap-1.5 rounded-2xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-400"
          >
            <Trash2 className="h-4 w-4" />
            <span>সকল ডেটা মুছুন</span>
          </button>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {isClearModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setIsClearModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-dark-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <AlertTriangle className="h-6 w-6" />
              <h4 className="bangla-text text-lg font-bold text-gray-900 dark:text-white">
                আপনি কি নিশ্চিত?
              </h4>
            </div>

            <p className="bangla-text text-xs sm:text-sm text-gray-600 dark:text-dark-text-secondary leading-relaxed mb-6">
              আপনার সমস্ত দৈনিক নামাজের লগ এবং কাযা সালাতের হিসাব এই ডিভাইস থেকে
              সম্পূর্ণ মুছে ফেলা হবে। এই কাজ পূর্বাবস্থায় ফেরানো যাবে না।
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsClearModalOpen(false)}
                className="bangla-text rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 dark:border-dark-border dark:text-dark-text-secondary"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="bangla-text rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700"
              >
                হ্যাঁ, সবকিছু মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function toDateKey(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default TrackerClient;
