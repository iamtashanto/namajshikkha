"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Flame,
  Users,
  Clock,
  Circle,
} from "lucide-react";
import {
  DayPrayerLog,
  FardPrayerKey,
  FARD_PRAYER_META,
  PrayerStatus,
} from "@/src/lib/tracker/types";
import {
  calculateStreakStats,
  createDefaultDayLog,
  getAllLogs,
  getDayLog,
  hasStartedTracking,
  saveDayLog,
} from "@/src/lib/tracker/storage";
import { toBengaliNumber } from "@/src/lib/bengali";

const FARD_KEYS: FardPrayerKey[] = [
  "fajr",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
  "witr",
];

export function HomeTrackerWidget() {
  const [isTrackingActive, setIsTrackingActive] = useState<boolean>(false);
  const [dayLog, setDayLog] = useState<DayPrayerLog | null>(null);
  const [currentStreak, setCurrentStreak] = useState<number>(0);

  const todayKey = (() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  })();

  useEffect(() => {
    let cancelled = false;
    async function check() {
      try {
        const active = await hasStartedTracking();
        if (cancelled) return;
        setIsTrackingActive(active);

        if (active) {
          const log = await getDayLog(todayKey);
          if (cancelled) return;
          setDayLog(log || createDefaultDayLog(todayKey));

          const all = await getAllLogs();
          if (cancelled) return;
          const stats = calculateStreakStats(all);
          setCurrentStreak(stats.currentStreak);
        }
      } catch {
        // Ignore
      }
    }
    check();
    return () => {
      cancelled = true;
    };
  }, [todayKey]);

  if (!isTrackingActive || !dayLog) {
    return null; // Only appear on home page if the user has started tracking!
  }

  const handleQuickStatusChange = async (
    key: FardPrayerKey,
    status: PrayerStatus
  ) => {
    const nextStatus: PrayerStatus =
      dayLog.prayers[key] === status ? "pending" : status;

    const updated: DayPrayerLog = {
      ...dayLog,
      prayers: {
        ...dayLog.prayers,
        [key]: nextStatus,
      },
    };
    setDayLog(updated);
    await saveDayLog(updated);

    const all = await getAllLogs();
    const stats = calculateStreakStats(all);
    setCurrentStreak(stats.currentStreak);
  };

  const completedCount = FARD_KEYS.filter(
    (k) =>
      dayLog.prayers[k] === "completed" || dayLog.prayers[k] === "jamaat"
  ).length;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mb-12">
      <div className="rounded-3xl border border-emerald-200 bg-white p-5 sm:p-6 shadow-sm dark:border-dark-border dark:bg-dark-card">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              <Calendar className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="bangla-text text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  আজকের নামাজ চেকলিস্ট
                </h3>
                {currentStreak > 0 && (
                  <span className="bangla-text inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-bold text-orange-800 dark:bg-orange-950/70 dark:text-orange-300">
                    <Flame className="h-3.5 w-3.5 fill-current" />
                    <span>{toBengaliNumber(currentStreak)} দিন স্ট্রিক</span>
                  </span>
                )}
              </div>
              <p className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted">
                আজ ৬ ওয়াক্তের মধ্যে {toBengaliNumber(completedCount)} ওয়াক্ত
                আদায় হয়েছে
              </p>
            </div>
          </div>

          <Link
            href="/tracker"
            className="bangla-text inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
          >
            <span>পূর্ণ ট্র্যাকার ও কাযা হিসাব</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 6 Quick Toggle Buttons */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          {FARD_KEYS.map((key) => {
            const meta = FARD_PRAYER_META[key];
            const status = dayLog.prayers[key] || "pending";
            const isDone = status === "completed" || status === "jamaat";

            return (
              <div
                key={key}
                className={`flex flex-col justify-between rounded-2xl border p-3 transition-all ${
                  isDone
                    ? "border-emerald-500 bg-emerald-50/70 dark:border-emerald-600 dark:bg-emerald-950/50"
                    : status === "qaza"
                    ? "border-amber-400 bg-amber-50/50 dark:border-amber-700 dark:bg-amber-950/40"
                    : "border-gray-200 bg-gray-50/50 dark:border-dark-border dark:bg-dark-bg/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="bangla-text text-sm font-bold text-gray-900 dark:text-white">
                    {meta.nameBn}
                  </span>
                  {status === "jamaat" ? (
                    <Users className="h-4 w-4 text-blue-600" />
                  ) : isDone ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : status === "qaza" ? (
                    <Clock className="h-4 w-4 text-amber-600" />
                  ) : (
                    <Circle className="h-4 w-4 text-gray-300" />
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleQuickStatusChange(key, "completed")}
                    title="একাকী আদায়"
                    className={`bangla-text flex-1 rounded-lg py-1 text-[11px] font-bold transition-all ${
                      status === "completed"
                        ? "bg-emerald-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 dark:border-dark-border dark:bg-dark-card dark:text-dark-text-secondary"
                    }`}
                  >
                    আদায়
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickStatusChange(key, "jamaat")}
                    title="জামাতে আদায়"
                    className={`bangla-text flex-1 rounded-lg py-1 text-[11px] font-bold transition-all ${
                      status === "jamaat"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 dark:border-dark-border dark:bg-dark-card dark:text-dark-text-secondary"
                    }`}
                  >
                    জামাত
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default HomeTrackerWidget;

