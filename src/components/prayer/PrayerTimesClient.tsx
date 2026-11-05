"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Clock,
  Compass,
  MapPin,
  Settings2,
  Calendar,
  Printer,
  Bell,
  BellOff,
  Sun,
  Sunset,
  Moon,
  Sparkles,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import {
  ALL_LOCATIONS,
  BANGLADESH_DISTRICTS,
  CityLocation,
} from "@/src/data/locations";
import {
  calculatePrayerTimes,
  getCurrentWaqtInfo,
  getMonthlyPrayerTimes,
  DEFAULT_PRAYER_SETTINGS,
} from "@/src/lib/prayer-times/calculator";
import {
  formatBanglaTime,
  formatBanglaTimeShort,
  formatBanglaDate,
  formatHijriDate,
  formatGregorianDateBn,
  getBanglaDayName,
} from "@/src/lib/prayer-times/dates";
import {
  CalculationMethodType,
  CurrentWaqtInfo,
  DailyPrayerTimes,
  PrayerTimesSettings,
  WaqtKey,
} from "@/src/lib/prayer-times/types";
import {
  isNotificationSupported,
  requestNotificationPermission,
  showPrayerNotification,
} from "@/src/lib/prayer-times/notifications";
import { toBengaliNumber } from "@/src/lib/bengali";

const SETTINGS_STORAGE_KEY = "namajshikkha_prayer_settings_v1";

type ActiveTab = "today" | "monthly" | "ramadan";

const WAQT_CONFIG: {
  key: WaqtKey;
  labelBn: string;
  nameEn: string;
  icon: typeof Sun;
  color: string;
  rakatsBn: string;
}[] = [
  {
    key: "fajr",
    labelBn: "ফজর",
    nameEn: "Fajr",
    icon: Moon,
    color: "from-sky-500 to-indigo-600",
    rakatsBn: "২ রাকাত ফরজ (পূর্বে ২ রাকাত সুন্নত)",
  },
  {
    key: "sunrise",
    labelBn: "সূর্যোদয়",
    nameEn: "Sunrise",
    icon: Sun,
    color: "from-amber-400 to-orange-500",
    rakatsBn: "ওয়াক্ত সমাপ্তি ও ইশরাক",
  },
  {
    key: "dhuhr",
    labelBn: "যোহর",
    nameEn: "Dhuhr",
    icon: Sun,
    color: "from-amber-500 to-emerald-600",
    rakatsBn: "৪ রাকাত ফরজ (পূর্বে ৪ ও পরে ২ সুন্নত)",
  },
  {
    key: "asr",
    labelBn: "আসর",
    nameEn: "Asr",
    icon: Sunset,
    color: "from-orange-500 to-rose-600",
    rakatsBn: "৪ রাকাত ফরজ",
  },
  {
    key: "maghrib",
    labelBn: "মাগরিব",
    nameEn: "Maghrib",
    icon: Sunset,
    color: "from-rose-500 to-purple-600",
    rakatsBn: "৩ রাকাত ফরজ (পরে ২ রাকাত সুন্নত)",
  },
  {
    key: "isha",
    labelBn: "এশা",
    nameEn: "Isha",
    icon: Moon,
    color: "from-purple-600 to-indigo-900",
    rakatsBn: "৪ রাকাত ফরজ ও ৩ রাকাত বিতর",
  },
];

export function PrayerTimesClient() {
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
  const [activeTab, setActiveTab] = useState<ActiveTab>("today");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Modals
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Monthly / Ramadan view date navigation
  const [viewYear, setViewYear] = useState<number>(currentTime.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(currentTime.getMonth());

  const saveSettings = (newSettings: PrayerTimesSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(newSettings)
      );
    } catch {
      // Ignore
    }
  };

  // Live timer interval (every second)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate today's and tomorrow's prayer times
  const todayTimes: DailyPrayerTimes = useMemo(() => {
    return calculatePrayerTimes(currentTime, settings);
  }, [currentTime, settings]);

  const tomorrowTimes: DailyPrayerTimes = useMemo(() => {
    const tomorrow = new Date(currentTime.getTime() + 86400000);
    return calculatePrayerTimes(tomorrow, settings);
  }, [currentTime, settings]);

  const waqtInfo: CurrentWaqtInfo = useMemo(() => {
    return getCurrentWaqtInfo(currentTime, todayTimes, tomorrowTimes);
  }, [currentTime, todayTimes, tomorrowTimes]);

  // Screen reader polite countdown: changes once per minute so it doesn't spam screen readers every second
  const remainingMinutes = Math.max(
    1,
    Math.ceil(waqtInfo.timeRemainingMs / 60000)
  );
  const ariaAnnouncement = `এখন ${waqtInfo.currentWaqtNameBn} ওয়াক্ত। পরবর্তী সালাত ${waqtInfo.nextPrayerNameBn}, ওয়াক্ত শুরু হতে আর প্রায় ${toBengaliNumber(remainingMinutes)} মিনিট বাকি।`;

  // Monthly table times
  const monthlyTimes = useMemo(() => {
    return getMonthlyPrayerTimes(viewYear, viewMonth, settings);
  }, [viewYear, viewMonth, settings]);

  // Handle GPS location with friendly Bangla prompt
  const handleGetGPSLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("আপনার ব্রাউজারে জিপিএস সুবিধা পাওয়া যায়নি।");
      return;
    }
    setGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGeoLoading(false);
        const loc: CityLocation = {
          id: "gps-current",
          nameBn: "আপনার বর্তমান অবস্থান (GPS)",
          nameEn: "Current GPS Location",
          countryBn: "বাংলাদেশ",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timezone: "Asia/Dhaka",
        };
        saveSettings({ ...settings, location: loc });
        setIsLocationModalOpen(false);
      },
      () => {
        setGeoLoading(false);
        setGeoError(
          "জিপিএস লোকেশন পাওয়া যায়নি। আপনার ডিভাইস সেটিংসে লোকেশন অন করুন অথবা নিচে থেকে আপনার জেলা বা শহর বেছে নিন।"
        );
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Toggle notification permission
  const handleToggleNotification = async () => {
    if (!settings.notificationsEnabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        saveSettings({ ...settings, notificationsEnabled: true });
        showPrayerNotification(
          "নামাজ শিক্ষা — সময়সূচী নোটিফিকেশন",
          "আলহামদুলিল্লাহ! নামাজের ওয়াক্তের জন্য নোটিফিকেশন সক্রিয় হয়েছে।"
        );
      } else {
        alert(
          "ব্রাউজারে নোটিফিকেশনের অনুমতি প্রদান করা হয়নি। দয়া করে ব্রাউজার সেটিংসে অনুমতি দিন।"
        );
      }
    } else {
      saveSettings({ ...settings, notificationsEnabled: false });
    }
  };

  // Filtered districts for search
  const filteredDistricts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return BANGLADESH_DISTRICTS;
    return ALL_LOCATIONS.filter(
      (loc) =>
        loc.nameBn.toLowerCase().includes(q) ||
        loc.nameEn.toLowerCase().includes(q) ||
        loc.countryBn.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Screen reader polite announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {ariaAnnouncement}
      </div>

      {/* Top Location & Settings Toolbar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-emerald-100 bg-white p-3 sm:p-4 shadow-xs dark:border-dark-border dark:bg-dark-card">
        <div className="flex flex-wrap items-center gap-2">
          {/* Location button */}
          <button
            type="button"
            onClick={() => setIsLocationModalOpen(true)}
            className="bangla-text inline-flex items-center gap-1.5 rounded-2xl bg-emerald-50 px-3.5 py-2 text-xs sm:text-sm font-bold text-emerald-900 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-200"
          >
            <MapPin className="h-4 w-4 text-emerald-600" />
            <span>স্থান: {settings.location.nameBn}</span>
            <span className="rounded-md bg-emerald-200/80 px-1.5 py-0.5 text-[10px] text-emerald-900 dark:bg-emerald-800 dark:text-emerald-100">
              বদলান
            </span>
          </button>

          {/* Qibla button */}
          <Link
            href="/qibla"
            className="bangla-text inline-flex items-center gap-1.5 rounded-2xl border border-emerald-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-bold text-emerald-800 hover:bg-emerald-50 dark:border-dark-border dark:bg-dark-bg dark:text-emerald-300"
          >
            <Compass className="h-4 w-4 text-emerald-600" />
            <span>কিবলা কম্পাস</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Notification toggle */}
          {isNotificationSupported() && (
            <button
              type="button"
              onClick={handleToggleNotification}
              title={
                settings.notificationsEnabled
                  ? "নোটিফিকেশন বন্ধ করুন"
                  : "নোটিফিকেশন চালু করুন"
              }
              className={`inline-flex items-center gap-1.5 rounded-2xl px-3 py-2 text-xs font-semibold transition-colors ${
                settings.notificationsEnabled
                  ? "bg-emerald-600 text-white"
                  : "border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-secondary"
              }`}
            >
              {settings.notificationsEnabled ? (
                <>
                  <Bell className="h-3.5 w-3.5" />
                  <span className="bangla-text hidden sm:inline">অ্যালার্ট অন</span>
                </>
              ) : (
                <>
                  <BellOff className="h-3.5 w-3.5" />
                  <span className="bangla-text hidden sm:inline">অ্যালার্ট বন্ধ</span>
                </>
              )}
            </button>
          )}

          {/* Settings modal button */}
          <button
            type="button"
            onClick={() => setIsSettingsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs sm:text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-secondary"
          >
            <Settings2 className="h-4 w-4 text-gray-500" />
            <span className="bangla-text hidden sm:inline">পদ্ধতি ও ফিকহ</span>
          </button>
        </div>
      </div>

      {/* Date Bar: Hijri, Bangla, and Gregorian */}
      <div className="mb-6 rounded-2xl border border-emerald-100/70 bg-gradient-to-r from-emerald-50/50 via-white to-emerald-50/50 p-4 text-center dark:border-dark-border dark:from-dark-card dark:via-dark-bg dark:to-dark-card">
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">
              🌙 হিজরি:
            </span>
            <span className="bangla-text font-bold text-gray-900 dark:text-white">
              {formatHijriDate(currentTime, settings.hijriOffsetDays)}
            </span>
            {settings.hijriOffsetDays !== 0 && (
              <span className="text-[10px] text-gray-500 dark:text-dark-text-muted">
                ({settings.hijriOffsetDays > 0 ? "+" : ""}
                {toBengaliNumber(settings.hijriOffsetDays)} দিন সমন্বয়)
              </span>
            )}
          </div>

          <div className="hidden sm:block text-gray-300 dark:text-dark-border">
            •
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">
              🌾 বাংলা:
            </span>
            <span className="bangla-text font-semibold text-gray-800 dark:text-dark-text">
              {formatBanglaDate(currentTime)}
            </span>
          </div>

          <div className="hidden sm:block text-gray-300 dark:text-dark-border">
            •
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">
              📅 ইংরেজি:
            </span>
            <span className="bangla-text text-gray-700 dark:text-dark-text-secondary">
              {formatGregorianDateBn(currentTime)}
            </span>
          </div>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-100 pb-3 dark:border-dark-border">
        <button
          type="button"
          onClick={() => setActiveTab("today")}
          className={`bangla-text inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
            activeTab === "today"
              ? "bg-emerald-600 text-white shadow-xs"
              : "border border-gray-200 bg-white text-gray-700 hover:bg-emerald-50 dark:border-dark-border dark:bg-dark-card dark:text-dark-text-secondary"
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>আজকের সময়সূচী (Today)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("monthly")}
          className={`bangla-text inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
            activeTab === "monthly"
              ? "bg-emerald-600 text-white shadow-xs"
              : "border border-gray-200 bg-white text-gray-700 hover:bg-emerald-50 dark:border-dark-border dark:bg-dark-card dark:text-dark-text-secondary"
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>মাসিক ক্যালেন্ডার (Monthly Table)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ramadan")}
          className={`bangla-text inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
            activeTab === "ramadan"
              ? "bg-emerald-600 text-white shadow-xs"
              : "border border-emerald-200 bg-emerald-50/70 text-emerald-900 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
          }`}
        >
          <Sparkles className="h-4 w-4 text-emerald-600" />
          <span>মাহে রমজান (সেহরি ও ইফতার)</span>
        </button>
      </div>

      {/* =====================================================================
          TAB 1: TODAY'S PRAYER TIMES
         ===================================================================== */}
      {activeTab === "today" && (
        <div className="space-y-6">
          {/* Next Prayer Countdown Hero Card */}
          <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-6 sm:p-8 text-white shadow-xl dark:border-dark-border">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-300 animate-ping" />
                  <span className="bangla-text">
                    বর্তমান ওয়াক্ত: {waqtInfo.currentWaqtNameBn}
                  </span>
                </div>

                <h2 className="bangla-text mt-3 text-2xl sm:text-3xl font-extrabold tracking-tight">
                  পরবর্তী সালাত: {waqtInfo.nextPrayerNameBn}
                </h2>

                <p className="bangla-text mt-1 text-xs sm:text-sm text-emerald-100">
                  ওয়াক্ত শুরু:{" "}
                  <strong>
                    {formatBanglaTime(waqtInfo.nextPrayerTime)}
                  </strong>
                </p>
              </div>

              {/* Countdown timer display */}
              <div className="rounded-2xl bg-black/20 p-4 sm:p-5 backdrop-blur-md text-center border border-white/10 sm:min-w-[200px]">
                <span className="bangla-text text-[11px] uppercase tracking-wider text-emerald-200">
                  ওয়াক্ত শুরুর বাকি
                </span>
                <div className="bangla-text mt-1 text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
                  {waqtInfo.timeRemainingShort}
                </div>
                <p className="bangla-text mt-1 text-[11px] text-emerald-100">
                  {waqtInfo.timeRemainingFormatted}
                </p>
              </div>
            </div>

            {/* Forbidden time banner if current time falls in makruh times */}
            {waqtInfo.isForbiddenNow && (
              <div className="relative z-10 mt-5 flex items-start gap-2.5 rounded-2xl bg-rose-900/60 border border-rose-300/30 p-3.5 text-xs text-rose-100 backdrop-blur-md">
                <AlertTriangle className="h-5 w-5 text-rose-300 shrink-0 mt-0.5" />
                <div>
                  <strong className="bangla-text font-bold text-white">
                    সতর্কতা: এখন নামাজ আদায়ের নিষিদ্ধ সময় চলছে!{" "}
                  </strong>
                  <span className="bangla-text">
                    {waqtInfo.forbiddenReasonBn}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 5 Fard Prayers + Sunrise Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {WAQT_CONFIG.map((waqt) => {
              const Icon = waqt.icon;
              const time = todayTimes[waqt.key as keyof DailyPrayerTimes] as Date;
              const isActive = waqtInfo.currentWaqt === waqt.key;
              const isNext = waqtInfo.nextPrayer === waqt.key;

              return (
                <div
                  key={waqt.key}
                  className={`relative flex flex-col justify-between rounded-3xl border p-4 transition-all ${
                    isActive
                      ? "border-emerald-600 bg-emerald-50/70 shadow-md ring-2 ring-emerald-500/30 dark:border-emerald-500 dark:bg-emerald-950/60"
                      : isNext
                      ? "border-sky-300 bg-sky-50/40 dark:border-sky-800 dark:bg-sky-950/30"
                      : "border-gray-200 bg-white dark:border-dark-border dark:bg-dark-card"
                  }`}
                >
                  {isActive && (
                    <span className="bangla-text absolute -top-2.5 left-4 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                      চলমান
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="bangla-text text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                        {waqt.labelBn}
                      </span>
                      <Icon className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span className="text-[11px] text-gray-400 dark:text-dark-text-muted">
                      {waqt.nameEn}
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="bangla-text text-base sm:text-lg font-bold text-emerald-800 dark:text-emerald-300">
                      {formatBanglaTime(time)}
                    </div>
                    <p className="bangla-text mt-1 text-[10px] text-gray-500 dark:text-dark-text-muted line-clamp-2">
                      {waqt.rakatsBn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Islamic Times Card (Tahajjud, Ishraq, Chasht, Zawal) */}
          <div className="rounded-3xl border border-emerald-100 bg-white p-5 sm:p-6 shadow-xs dark:border-dark-border dark:bg-dark-card">
            <h3 className="bangla-text text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              <span>নফল সালাত ও বিশেষ ইসলামিক সময়সূচী</span>
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-sky-100 bg-sky-50/50 p-4 dark:border-sky-900/40 dark:bg-sky-950/20">
                <span className="bangla-text text-xs font-bold text-sky-900 dark:text-sky-300">
                  তাহাজ্জুদের সেরা সময়
                </span>
                <div className="bangla-text mt-1 text-base font-bold text-sky-800 dark:text-sky-400">
                  {formatBanglaTime(todayTimes.tahajjudStart)} থেকে ফজর
                </div>
                <p className="bangla-text mt-1 text-[11px] text-gray-600 dark:text-dark-text-muted">
                  রাতের শেষ তৃতীয়াংশ থেকে সুবহে সাদিক পর্যন্ত
                </p>
              </div>

              <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
                <span className="bangla-text text-xs font-bold text-amber-900 dark:text-amber-300">
                  ইশরাকের শুরু
                </span>
                <div className="bangla-text mt-1 text-base font-bold text-amber-800 dark:text-amber-400">
                  {formatBanglaTime(todayTimes.ishraq)}
                </div>
                <p className="bangla-text mt-1 text-[11px] text-gray-600 dark:text-dark-text-muted">
                  সূর্যোদয়ের প্রায় ১৫ মিনিট পর থেকে শুরু
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                <span className="bangla-text text-xs font-bold text-emerald-900 dark:text-emerald-300">
                  চাশত (দুহা) সালাত
                </span>
                <div className="bangla-text mt-1 text-base font-bold text-emerald-800 dark:text-emerald-400">
                  {formatBanglaTime(todayTimes.chasht)}
                </div>
                <p className="bangla-text mt-1 text-[11px] text-gray-600 dark:text-dark-text-muted">
                  মধ্য-সকাল থেকে দ্বিপ্রহরের পূর্ব পর্যন্ত
                </p>
              </div>
            </div>
          </div>

          {/* Forbidden / Makruh Prayer Times Warning Card */}
          <div className="rounded-3xl border border-rose-200 bg-rose-50/40 p-5 sm:p-6 dark:border-rose-900/40 dark:bg-rose-950/20">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="bangla-text text-base sm:text-lg font-bold text-rose-900 dark:text-rose-200 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-rose-600" />
                <span>নামাজ আদায়ের ৩টি নিষিদ্ধ (মাকরুহ) সময়</span>
              </h3>
              <Link
                href="/masail/forbidden-and-makruh-times"
                className="bangla-text text-xs font-bold text-rose-700 underline dark:text-rose-400"
              >
                মাসআলা বিস্তারিত
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-3.5 shadow-2xs dark:bg-dark-card border border-rose-100 dark:border-dark-border">
                <span className="bangla-text text-xs font-bold text-gray-900 dark:text-white">
                  ১. সূর্যোদয়ের সময়
                </span>
                <div className="bangla-text mt-1 text-sm font-bold text-rose-700 dark:text-rose-400">
                  {formatBanglaTime(todayTimes.forbiddenSunrise.start)} -{" "}
                  {formatBanglaTime(todayTimes.forbiddenSunrise.end)}
                </div>
                <p className="bangla-text mt-1 text-[11px] text-gray-500">
                  সূর্য ওঠার পর ১৫ মিনিট
                </p>
              </div>

              <div className="rounded-2xl bg-white p-3.5 shadow-2xs dark:bg-dark-card border border-rose-100 dark:border-dark-border">
                <span className="bangla-text text-xs font-bold text-gray-900 dark:text-white">
                  ২. নিস্তব্ধ দ্বিপ্রহর (ইস্তিওয়া)
                </span>
                <div className="bangla-text mt-1 text-sm font-bold text-rose-700 dark:text-rose-400">
                  {formatBanglaTime(todayTimes.forbiddenZawal.start)} -{" "}
                  {formatBanglaTime(todayTimes.forbiddenZawal.end)}
                </div>
                <p className="bangla-text mt-1 text-[11px] text-gray-500">
                  যোহরের ওয়াক্ত শুরুর পূর্বের ১৫ মিনিট
                </p>
              </div>

              <div className="rounded-2xl bg-white p-3.5 shadow-2xs dark:bg-dark-card border border-rose-100 dark:border-dark-border">
                <span className="bangla-text text-xs font-bold text-gray-900 dark:text-white">
                  ৩. সূর্যাস্তের সময়
                </span>
                <div className="bangla-text mt-1 text-sm font-bold text-rose-700 dark:text-rose-400">
                  {formatBanglaTime(todayTimes.forbiddenSunset.start)} -{" "}
                  {formatBanglaTime(todayTimes.forbiddenSunset.end)}
                </div>
                <p className="bangla-text mt-1 text-[11px] text-gray-500">
                  মাগরিবের ঠিক পূর্বের ১৫ মিনিট
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: MONTHLY CALENDAR TABLE (Print-friendly)
         ===================================================================== */}
      {activeTab === "monthly" && (
        <div className="space-y-4">
          {/* Monthly navigation bar & Print button */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-dark-border dark:bg-dark-card">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (viewMonth === 0) {
                    setViewMonth(11);
                    setViewYear((y) => y - 1);
                  } else {
                    setViewMonth((m) => m - 1);
                  }
                }}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-100 dark:border-dark-border"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <span className="bangla-text text-base font-bold text-gray-900 dark:text-white">
                {formatGregorianDateBn(new Date(viewYear, viewMonth, 1), false)}{" "}
                — {settings.location.nameBn}
              </span>

              <button
                type="button"
                onClick={() => {
                  if (viewMonth === 11) {
                    setViewMonth(0);
                    setViewYear((y) => y + 1);
                  } else {
                    setViewMonth((m) => m + 1);
                  }
                }}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-100 dark:border-dark-border"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="bangla-text inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
            >
              <Printer className="h-4 w-4" />
              <span>প্রিন্ট করুন (Print Table)</span>
            </button>
          </div>

          {/* Printable Table */}
          <div className="overflow-x-auto rounded-3xl border border-gray-200 bg-white shadow-xs dark:border-dark-border dark:bg-dark-card">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-gray-200 bg-gray-50/80 text-gray-600 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-muted">
                <tr>
                  <th className="p-3 text-center">তারিখ ও বার</th>
                  <th className="p-3">ফজর</th>
                  <th className="p-3">সূর্যোদয়</th>
                  <th className="p-3">যোহর</th>
                  <th className="p-3">আসর</th>
                  <th className="p-3">মাগরিব</th>
                  <th className="p-3">এশা</th>
                  <th className="p-3">তাহাজ্জুদ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                {monthlyTimes.map((item, idx) => {
                  const isToday =
                    item.date.getDate() === currentTime.getDate() &&
                    item.date.getMonth() === currentTime.getMonth() &&
                    item.date.getFullYear() === currentTime.getFullYear();

                  return (
                    <tr
                      key={item.dateKey}
                      className={`transition-colors ${
                        isToday
                          ? "bg-emerald-50/80 font-bold dark:bg-emerald-950/50"
                          : idx % 2 === 0
                          ? "bg-white dark:bg-dark-card"
                          : "bg-gray-50/40 dark:bg-dark-bg/40"
                      }`}
                    >
                      <td className="p-3 text-center whitespace-nowrap">
                        <span className="bangla-text">
                          {toBengaliNumber(item.date.getDate())} (
                          {getBanglaDayName(item.date)})
                        </span>
                      </td>
                      <td className="bangla-text p-3">
                        {formatBanglaTimeShort(item.fajr)}
                      </td>
                      <td className="bangla-text p-3 text-amber-700 dark:text-amber-400">
                        {formatBanglaTimeShort(item.sunrise)}
                      </td>
                      <td className="bangla-text p-3">
                        {formatBanglaTimeShort(item.dhuhr)}
                      </td>
                      <td className="bangla-text p-3">
                        {formatBanglaTimeShort(item.asr)}
                      </td>
                      <td className="bangla-text p-3 font-semibold text-rose-700 dark:text-rose-400">
                        {formatBanglaTimeShort(item.maghrib)}
                      </td>
                      <td className="bangla-text p-3">
                        {formatBanglaTimeShort(item.isha)}
                      </td>
                      <td className="bangla-text p-3 text-sky-700 dark:text-sky-400">
                        {formatBanglaTimeShort(item.tahajjudStart)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: RAMADAN SEHRI & IFTAR CALENDAR
         ===================================================================== */}
      {activeTab === "ramadan" && (
        <div className="space-y-6">
          {/* Ramadan Hero Banner */}
          <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-600 to-teal-800 p-6 sm:p-8 text-white shadow-lg">
            <h2 className="bangla-text text-2xl sm:text-3xl font-extrabold">
              মাহে রমজান — সেহরি ও ইফতারের সময়সূচী
            </h2>
            <p className="bangla-text mt-2 text-xs sm:text-sm text-emerald-100 max-w-2xl">
              {settings.location.nameBn} জেলার জন্য প্রতিদিনের সেহরি শেষ ও
              ইফতারের সময়। সতর্কতামূলকভাবে সেহরি ফজরের ৩ মিনিট পূর্বে শেষ করা
              উত্তম।
            </p>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
              <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-md border border-white/10">
                <span className="bangla-text text-xs text-emerald-200">
                  আজকের সেহরি শেষ
                </span>
                <div className="bangla-text text-2xl font-bold">
                  {formatBanglaTime(todayTimes.sehriEnd)}
                </div>
              </div>

              <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-md border border-white/10">
                <span className="bangla-text text-xs text-emerald-200">
                  আজকের ইফতারের সময়
                </span>
                <div className="bangla-text text-2xl font-bold">
                  {formatBanglaTime(todayTimes.iftar)}
                </div>
              </div>
            </div>
          </div>

          {/* Ramadan Duas: Sehri & Iftar */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-xs dark:border-dark-border dark:bg-dark-card">
              <span className="bangla-text rounded-xl bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                রোজার নিয়্যত (Sehri Niyyat)
              </span>
              <p className="arabic-text mt-3 text-lg font-bold text-gray-900 dark:text-white">
                نَوَيْتُ أَنْ أَصُومَ غَدًا مِنْ شَهْرِ رَمَضَانَ الْمُبَارَكِ
                فَرْضًا لَكَ يَا اللَّهُ
              </p>
              <p className="bangla-text mt-2 text-xs text-gray-600 dark:text-dark-text-secondary">
                <strong>বাংলা উচ্চারণ:</strong> নাওয়াইতু আন আসূমা গাদান মিন
                শাহরি রমাদানাল মুবারাকি ফারদাল্লাকা ইয়া আল্লাহ।
              </p>
              <p className="bangla-text mt-1 text-xs text-gray-500 dark:text-dark-text-muted">
                <strong>অর্থ:</strong> হে আল্লাহ! আমি আগামীকালের পবিত্র রমজান
                মাসের ফরজ রোজা রাখার সংকল্প করলাম।
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-xs dark:border-dark-border dark:bg-dark-card">
              <span className="bangla-text rounded-xl bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                ইফতারের দোয়া (Iftar Dua)
              </span>
              <p className="arabic-text mt-3 text-lg font-bold text-gray-900 dark:text-white">
                اللَّهُمَّ لَكَ صُمْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ
              </p>
              <p className="bangla-text mt-2 text-xs text-gray-600 dark:text-dark-text-secondary">
                <strong>বাংলা উচ্চারণ:</strong> আল্লাহুম্মা লাকা সুমতু ওয়া আলা
                রিযক্বিকা আফতারতু।
              </p>
              <p className="bangla-text mt-1 text-xs text-gray-500 dark:text-dark-text-muted">
                <strong>অর্থ:</strong> হে আল্লাহ! আপনার সন্তুষ্টির জন্যই আমি
                রোজা রেখেছিলাম এবং আপনার প্রদত্ত রিজিক দ্বারাই ইফতার করলাম।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          LOCATION SELECTION MODAL (64 Districts + GPS + World Cities)
         ===================================================================== */}
      {isLocationModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setIsLocationModalOpen(false)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-3xl bg-white p-5 shadow-2xl dark:bg-dark-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-dark-border">
              <h3 className="bangla-text text-lg font-bold text-gray-900 dark:text-white">
                জেলা বা শহর নির্বাচন
              </h3>
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(false)}
                className="rounded-lg p-1 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* GPS prompt */}
            <div className="mt-4">
              <button
                type="button"
                onClick={handleGetGPSLocation}
                disabled={geoLoading}
                className="bangla-text flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-60"
              >
                <MapPin className="h-4 w-4" />
                <span>
                  {geoLoading
                    ? "জিপিএস অবস্থান নেওয়া হচ্ছে..."
                    : "বর্তমান জিপিএস লোকেশন ব্যবহার করুন"}
                </span>
              </button>
              {geoError && (
                <p className="bangla-text mt-2 text-xs text-rose-600">
                  {geoError}
                </p>
              )}
            </div>

            {/* Search Box */}
            <div className="relative mt-4">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="জেলার নাম বা শহর লিখুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bangla-text w-full rounded-2xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-dark-border dark:bg-dark-bg dark:text-white"
              />
            </div>

            {/* District list */}
            <div className="mt-4 flex-1 space-y-1 overflow-y-auto">
              {filteredDistricts.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => {
                    saveSettings({ ...settings, location: loc });
                    setIsLocationModalOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs transition-colors ${
                    settings.location.id === loc.id
                      ? "bg-emerald-50 font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "text-gray-700 hover:bg-gray-100 dark:text-dark-text-secondary dark:hover:bg-dark-bg"
                  }`}
                >
                  <span className="bangla-text">
                    {loc.nameBn} ({loc.nameEn})
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {loc.divisionBn ? `${loc.divisionBn} বিভাগ` : loc.countryBn}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SETTINGS MODAL (Calculation Method, Madhab, Hijri Offset)
         ===================================================================== */}
      {isSettingsModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setIsSettingsModalOpen(false)}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-3xl bg-white p-6 shadow-2xl dark:bg-dark-card overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-dark-border">
              <h3 className="bangla-text text-lg font-bold text-gray-900 dark:text-white">
                হিসাব পদ্ধতি ও মাযহাব সেটিংস
              </h3>
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                className="rounded-lg p-1 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-5">
              {/* Asr Madhab Setting */}
              <div>
                <label className="bangla-text block text-xs font-bold text-gray-800 dark:text-white mb-2">
                  আসরের ওয়াক্ত পদ্ধতি (মাযহাব):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      saveSettings({ ...settings, madhab: "Hanafi" })
                    }
                    className={`bangla-text rounded-2xl border p-3 text-center text-xs font-bold ${
                      settings.madhab === "Hanafi"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/60 dark:text-emerald-200"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-dark-border dark:text-dark-text-secondary"
                    }`}
                  >
                    হানাফি (ডিফল্ট - দ্বিগুণ ছায়া)
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      saveSettings({ ...settings, madhab: "Shafi" })
                    }
                    className={`bangla-text rounded-2xl border p-3 text-center text-xs font-bold ${
                      settings.madhab === "Shafi"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/60 dark:text-emerald-200"
                        : "border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-dark-border dark:text-dark-text-secondary"
                    }`}
                  >
                    শাফেয়ী / মালেকী / হাম্বলী (একগুণ ছায়া)
                  </button>
                </div>
              </div>

              {/* Calculation Method */}
              <div>
                <label className="bangla-text block text-xs font-bold text-gray-800 dark:text-white mb-2">
                  হিসাব পদ্ধতি (Calculation Method):
                </label>
                <select
                  value={settings.calculationMethod}
                  onChange={(e) =>
                    saveSettings({
                      ...settings,
                      calculationMethod: e.target
                        .value as CalculationMethodType,
                    })
                  }
                  className="bangla-text w-full rounded-2xl border border-gray-200 bg-gray-50 p-3 text-xs sm:text-sm text-gray-900 focus:border-emerald-500 focus:outline-none dark:border-dark-border dark:bg-dark-bg dark:text-white"
                >
                  <option value="Karachi">
                    করাচি — ইউনিভার্সিটি অব ইসলামিক সায়েন্সেস (বাংলাদেশ ডিফল্ট)
                  </option>
                  <option value="MuslimWorldLeague">
                    মুসলিম ওয়ার্ল্ড লীগ (MWL)
                  </option>
                  <option value="UmmAlQura">উম্মুল কুরা (মক্কা মুকাররমা)</option>
                  <option value="Egyptian">
                    মিশরীয় জরিপ কর্তৃপক্ষ (Egyptian General Authority)
                  </option>
                  <option value="Dubai">দুবাই (UAE)</option>
                  <option value="MoonsightingCommittee">
                    মুনসাইটিং কমিটি (Moonsighting Committee)
                  </option>
                  <option value="NorthAmerica">
                    উত্তর আমেরিকা (ISNA)
                  </option>
                  <option value="Kuwait">কুয়েত</option>
                  <option value="Qatar">কাতার</option>
                  <option value="Singapore">সিঙ্গাপুর (MUIS)</option>
                  <option value="Turkey">তুরস্ক (Diyanet)</option>
                </select>
              </div>

              {/* Hijri Adjustment Setting */}
              <div>
                <label className="bangla-text block text-xs font-bold text-gray-800 dark:text-white mb-2">
                  হিজরি চাঁদ দেখা সমন্বয় (±দিন):
                </label>
                <div className="flex items-center gap-2">
                  {[-2, -1, 0, 1, 2].map((offset) => (
                    <button
                      key={offset}
                      type="button"
                      onClick={() =>
                        saveSettings({ ...settings, hijriOffsetDays: offset })
                      }
                      className={`bangla-text flex-1 rounded-xl border py-2 text-xs font-bold ${
                        settings.hijriOffsetDays === offset
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-gray-200 bg-gray-50 text-gray-700 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-secondary"
                      }`}
                    >
                      {offset > 0 ? `+${toBengaliNumber(offset)}` : toBengaliNumber(offset)}
                    </button>
                  ))}
                </div>
                <p className="bangla-text mt-1 text-[11px] text-gray-500">
                  স্থানীয় চাঁদ দেখার ওপর ভিত্তি করে হিজরি তারিখ ১ বা ২ দিন
                  এগিয়ে/পিছিয়ে সমন্বয় করতে পারেন।
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-4 dark:border-dark-border">
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                className="bangla-text w-full rounded-2xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
              >
                সংরক্ষণ করুন (Done)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PrayerTimesClient;
