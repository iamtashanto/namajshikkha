"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Clock,
  Compass,
  MapPin,
  ChevronRight,
  Sun,
  Sunset,
  Moon,
} from "lucide-react";
import {
  calculatePrayerTimes,
  getCurrentWaqtInfo,
  DEFAULT_PRAYER_SETTINGS,
} from "@/src/lib/prayer-times/calculator";
import {
  formatBanglaTime,
  formatBanglaTimeShort,
  formatBanglaDate,
  formatHijriDate,
} from "@/src/lib/prayer-times/dates";
import { PrayerTimesSettings } from "@/src/lib/prayer-times/types";
import { matchNearestDistrict } from "@/src/lib/prayer-times/geo-matcher";

const SETTINGS_STORAGE_KEY = "namajshikkha_prayer_settings_v1";

export function HomePrayerWidget() {
  const [settings, setSettings] = useState<PrayerTimesSettings>(() => {
    if (typeof window === "undefined") return DEFAULT_PRAYER_SETTINGS;
    try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PrayerTimesSettings>;
        return {
          ...DEFAULT_PRAYER_SETTINGS,
          ...parsed,
          location: parsed.location || DEFAULT_PRAYER_SETTINGS.location,
        };
      }
    } catch {
      // Ignore
    }
    return DEFAULT_PRAYER_SETTINGS;
  });
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Auto request / detect GPS location on home screen
  useEffect(() => {
    try {
      const hasStored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!hasStored && typeof navigator !== "undefined" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const matched = matchNearestDistrict(
              pos.coords.latitude,
              pos.coords.longitude
            );
            const updated = { ...settings, location: matched };
            setSettings(updated);
            localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
          },
          () => {
            // Silently maintain default
          },
          { timeout: 8000, maximumAge: 3600000 }
        );
      }
    } catch {
      // Ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayTimes = useMemo(
    () => calculatePrayerTimes(currentTime, settings),
    [currentTime, settings]
  );
  const tomorrowTimes = useMemo(() => {
    const tom = new Date(currentTime.getTime() + 86400000);
    return calculatePrayerTimes(tom, settings);
  }, [currentTime, settings]);

  const waqtInfo = useMemo(
    () => getCurrentWaqtInfo(currentTime, todayTimes, tomorrowTimes),
    [currentTime, todayTimes, tomorrowTimes]
  );

  const prayers = [
    { key: "fajr", nameBn: "ফজর", time: todayTimes.fajr, icon: Moon },
    { key: "sunrise", nameBn: "সূর্যোদয়", time: todayTimes.sunrise, icon: Sun },
    { key: "dhuhr", nameBn: "যোহর", time: todayTimes.dhuhr, icon: Sun },
    { key: "asr", nameBn: "আসর", time: todayTimes.asr, icon: Sunset },
    { key: "maghrib", nameBn: "মাগরিব", time: todayTimes.maghrib, icon: Sunset },
    { key: "isha", nameBn: "এশা", time: todayTimes.isha, icon: Moon },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mb-12">
      <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900 p-5 sm:p-7 text-white shadow-xl dark:border-emerald-800/60">
        {/* Background glow decorative circles */}
        <div className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-emerald-500/20 blur-2xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-white/10 pb-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-200 mb-1.5">
              <span className="flex items-center gap-1 font-semibold">
                <MapPin className="h-3.5 w-3.5" />
                <span>{settings.location.nameBn}</span>
              </span>
              <span>•</span>
              <span className="bangla-text">
                {formatHijriDate(currentTime, settings.hijriOffsetDays)}
              </span>
              <span>•</span>
              <span className="bangla-text">{formatBanglaDate(currentTime)}</span>
            </div>

            <div className="flex items-baseline gap-2">
              <h2 className="bangla-text text-xl sm:text-2xl font-black text-white">
                পরবর্তী সালাত: {waqtInfo.nextPrayerNameBn}
              </h2>
              <span className="bangla-text text-xs sm:text-sm text-emerald-300 font-semibold">
                (ওয়াক্ত শুরু: {formatBanglaTime(waqtInfo.nextPrayerTime)})
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Countdown Badge */}
            <div className="rounded-2xl bg-black/25 px-4 py-2 border border-white/15 backdrop-blur-md">
              <span className="bangla-text block text-[10px] uppercase tracking-wider text-emerald-200">
                বাকি সময়
              </span>
              <div className="bangla-text text-xl sm:text-2xl font-black font-mono text-white">
                {waqtInfo.timeRemainingShort}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/prayer-times"
                className="bangla-text inline-flex items-center gap-1.5 rounded-2xl bg-white px-4 py-2.5 text-xs font-bold text-emerald-900 shadow-md hover:bg-emerald-50 transition-all"
              >
                <Clock className="h-3.5 w-3.5" />
                <span>পূর্ণ সময়সূচী</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>

              <Link
                href="/qibla"
                className="bangla-text inline-flex items-center gap-1.5 rounded-2xl bg-emerald-600/60 border border-white/20 px-3.5 py-2.5 text-xs font-bold text-white hover:bg-emerald-600 transition-all backdrop-blur-md"
              >
                <Compass className="h-3.5 w-3.5" />
                <span>কিবলা</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 6 Times Horizontal Strip */}
        <div className="relative z-10 mt-4 grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
          {prayers.map((p) => {
            const isActive = waqtInfo.currentWaqt === p.key;
            const isNext = waqtInfo.nextPrayer === p.key;

            return (
              <div
                key={p.key}
                className={`rounded-2xl p-2.5 transition-all ${
                  isActive
                    ? "bg-white/25 ring-2 ring-emerald-300 shadow-md"
                    : isNext
                    ? "bg-emerald-500/20"
                    : "bg-black/15"
                }`}
              >
                <span className="bangla-text text-xs font-bold text-emerald-100 block">
                  {p.nameBn}
                </span>
                <span className="bangla-text text-sm sm:text-base font-extrabold text-white mt-0.5 block">
                  {formatBanglaTimeShort(p.time)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Quick Fasting (Sehri & Iftar) & Astronomical (Sunset) Strip */}
        <div className="relative z-10 mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5 text-gold-300 font-semibold">
              <span className="h-2 w-2 rounded-full bg-gold-400" />
              <span>আজকের সেহরি শেষ: <strong>{formatBanglaTime(todayTimes.sehriEnd)}</strong></span>
            </span>
            <span className="flex items-center gap-1.5 text-emerald-200 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>ইফতার ও সূর্যাস্ত: <strong>{formatBanglaTime(todayTimes.iftar)}</strong></span>
            </span>
          </div>

          <Link
            href="/prayer-times"
            className="text-[11px] text-emerald-300 hover:text-white underline font-semibold flex items-center gap-1"
          >
            <span>জেলা পরিবর্তন বা বিস্তারিত সময়সূচী</span>
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePrayerWidget;
