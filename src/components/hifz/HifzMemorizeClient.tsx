"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  CheckCircle2,
  RefreshCw,
  Eye,
  EyeOff,
  Sparkles,
  BookOpen,
  Volume2,
  VolumeX,
  Type,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Award,
} from "lucide-react";
import { Surah } from "@/src/types/content";
import { prayerSurahs } from "@/src/data/surahs";
import allSurahsData from "@/data/all-surahs.json";
import {
  DEFAULT_HIFZ_SETTINGS,
  HifzHideMode,
  HifzRecord,
  HifzSettings,
} from "@/src/lib/hifz/types";
import {
  getHifzRecord,
  getMaskedWords,
  recordHifzAttempt,
} from "@/src/lib/hifz/storage";
import { toBengaliNumber } from "@/src/lib/bengali";

const STORAGE_SETTINGS_KEY = "namajshikkha_hifz_settings_v1";

interface HifzMemorizeClientProps {
  initialSurahId: string;
}

export function HifzMemorizeClient({ initialSurahId }: HifzMemorizeClientProps) {
  const [selectedSurahId, setSelectedSurahId] = useState<string>(initialSurahId);
  const [settings, setSettings] = useState<HifzSettings>(() => {
    if (typeof window === "undefined") return DEFAULT_HIFZ_SETTINGS;
    try {
      const raw = localStorage.getItem(STORAGE_SETTINGS_KEY);
      if (raw) return JSON.parse(raw) as HifzSettings;
    } catch {
      // Ignore
    }
    return DEFAULT_HIFZ_SETTINGS;
  });

  const [activeAyahIndex, setActiveAyahIndex] = useState<number>(0);
  const [rangeStart, setRangeStart] = useState<number>(0);
  const [rangeEnd, setRangeEnd] = useState<number>(0);
  const [currentRepeat, setCurrentRepeat] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isGapPause, setIsGapPause] = useState<boolean>(false);
  const [revealedWordIndices, setRevealedWordIndices] = useState<Set<number>>(
    new Set()
  );
  const [revealedFullAyah, setRevealedFullAyah] = useState<boolean>(false);

  // Spaced repetition record
  const [hifzRecord, setHifzRecord] = useState<HifzRecord | null>(null);
  const [lastCheckResult, setLastCheckResult] = useState<"pass" | "again" | null>(
    null
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Find active surah from prayerSurahs or construct from allSurahs
  const currentSurah: Surah = useMemo(() => {
    const found = prayerSurahs.find((s) => s.id === selectedSurahId);
    if (found) return found;

    // Check if number passed (e.g. surah-112 or number)
    const num = parseInt(selectedSurahId.replace("surah-", ""), 10);
    const quranEntry = allSurahsData.find((s) => s.number === num);
    if (quranEntry) {
      return {
        id: `surah-${quranEntry.number}`,
        number: quranEntry.number,
        nameBn: quranEntry.name_bangla,
        nameAr: quranEntry.name_arabic,
        nameEn: quranEntry.name_english,
        ayahCount: quranEntry.total_ayah,
        ayahs: [
          {
            id: `surah-${quranEntry.number}-full`,
            titleBn: `সূরা ${quranEntry.name_bangla}`,
            titleEn: quranEntry.name_english,
            arabic: quranEntry.name_arabic,
            uccharonBn: quranEntry.name_bangla,
            banglish: quranEntry.name_banglish,
            meaningBn: `${quranEntry.name_bangla} — ${quranEntry.revelation_type} সূরা (${toBengaliNumber(quranEntry.total_ayah)} আয়াত)`,
          },
        ],
        audioSrc: quranEntry.audio_url,
        revelation: quranEntry.revelation_type === "মাক্কী" ? "makki" : "madani",
      };
    }

    return prayerSurahs[0]; // fallback to Al-Fatiha
  }, [selectedSurahId]);

  const totalAyahs = currentSurah.ayahs.length;

  // Initialize rangeEnd when surah changes
  useEffect(() => {
    setRangeStart(0);
    setRangeEnd(Math.max(0, currentSurah.ayahs.length - 1));
    setActiveAyahIndex(0);
    setCurrentRepeat(1);
    setRevealedWordIndices(new Set());
    setRevealedFullAyah(false);
  }, [currentSurah]);

  // Load Hifz Record
  useEffect(() => {
    let cancelled = false;
    async function loadRecord() {
      const rec = await getHifzRecord(currentSurah.id);
      if (!cancelled) setHifzRecord(rec);
    }
    loadRecord();
    return () => {
      cancelled = true;
    };
  }, [currentSurah.id]);

  const saveSettings = (newSettings: HifzSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(newSettings));
    } catch {
      // Ignore
    }
  };

  const activeAyah = currentSurah.ayahs[activeAyahIndex] || currentSurah.ayahs[0];

  // Masked words for current ayah
  const maskedWords = useMemo(() => {
    return getMaskedWords(
      activeAyah.arabic,
      settings.hideMode,
      revealedWordIndices
    );
  }, [activeAyah.arabic, settings.hideMode, revealedWordIndices]);

  // Reveal a single masked word on tap
  const handleToggleWordReveal = (index: number) => {
    setRevealedWordIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  // Audio Playback & Repetition Loop
  const playNextAyahOrLoop = useCallback(() => {
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);

    if (currentRepeat < settings.repeatCount) {
      // Repeat same ayah after pause gap
      setIsGapPause(true);
      pauseTimerRef.current = setTimeout(() => {
        setIsGapPause(false);
        setCurrentRepeat((r) => r + 1);
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
        }
      }, settings.pauseGapSeconds * 1000);
    } else {
      // Advance to next ayah in range
      setCurrentRepeat(1);
      if (activeAyahIndex < rangeEnd) {
        setIsGapPause(true);
        pauseTimerRef.current = setTimeout(() => {
          setIsGapPause(false);
          setActiveAyahIndex((i) => i + 1);
          setRevealedWordIndices(new Set());
          setRevealedFullAyah(false);
        }, settings.pauseGapSeconds * 1000);
      } else {
        // Completed range
        setIsPlaying(false);
        setIsGapPause(false);
      }
    }
  }, [
    currentRepeat,
    settings.repeatCount,
    settings.pauseGapSeconds,
    activeAyahIndex,
    rangeEnd,
  ]);

  // Audio event listener
  useEffect(() => {
    if (!isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      return;
    }

    if (isAudioMuted || !currentSurah.audioSrc) {
      // Visual only timer fallback
      const timer = setTimeout(() => {
        playNextAyahOrLoop();
      }, 4000);
      return () => clearTimeout(timer);
    }

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;
    audio.src = currentSurah.audioSrc;
    audio.muted = isAudioMuted;

    const onEnded = () => {
      playNextAyahOrLoop();
    };

    audio.addEventListener("ended", onEnded);
    audio.play().catch(() => {
      // If audio file not accessible, continue with visual timer
      setTimeout(playNextAyahOrLoop, 4000);
    });

    return () => {
      audio.removeEventListener("ended", onEnded);
      audio.pause();
    };
  }, [isPlaying, isAudioMuted, currentSurah.audioSrc, activeAyahIndex, playNextAyahOrLoop]);

  // Self-check mark: passed / again
  const handleMarkResult = async (passed: boolean) => {
    setLastCheckResult(passed ? "pass" : "again");
    const updated = await recordHifzAttempt(currentSurah.id, passed);
    setHifzRecord(updated);

    // If passed and not at end, move to next
    if (passed && activeAyahIndex < rangeEnd) {
      setActiveAyahIndex((i) => i + 1);
      setCurrentRepeat(1);
      setRevealedWordIndices(new Set());
      setRevealedFullAyah(false);
    }
  };

  const handleSurahChange = (id: string) => {
    setSelectedSurahId(id);
    window.history.replaceState(null, "", `/surah-dua/${id}/hifz`);
  };

  return (
    <div
      className={`min-h-screen transition-colors ${
        settings.highContrast
          ? "bg-black text-amber-100"
          : "bg-gray-50/50 text-gray-900 dark:bg-dark-bg dark:text-white"
      }`}
    >
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {/* Top Breadcrumb & Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-dark-text-muted">
            <Link href="/" className="hover:text-emerald-600">
              হোম
            </Link>
            <span>/</span>
            <Link href="/surah-dua" className="hover:text-emerald-600">
              সূরা ও দোয়া
            </Link>
            <span>/</span>
            <span className="font-semibold text-gray-800 dark:text-white">
              হিফজ ও মুখস্থ অনুশীলন
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Large Font Toggle */}
            <button
              type="button"
              onClick={() =>
                saveSettings({ ...settings, largeFont: !settings.largeFont })
              }
              title="বড় হরফ টগল"
              className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
                settings.largeFont
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-gray-700 border-gray-200 dark:bg-dark-card dark:border-dark-border dark:text-dark-text-secondary"
              }`}
            >
              <Type className="h-4 w-4" />
            </button>

            {/* High Contrast Mode Toggle */}
            <button
              type="button"
              onClick={() =>
                saveSettings({
                  ...settings,
                  highContrast: !settings.highContrast,
                })
              }
              title="হাই-কনট্রাস্ট মোড"
              className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
                settings.highContrast
                  ? "bg-amber-400 text-black border-amber-400"
                  : "bg-white text-gray-700 border-gray-200 dark:bg-dark-card dark:border-dark-border dark:text-dark-text-secondary"
              }`}
            >
              {settings.highContrast ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Surah Selector & Spaced-Repetition Stage Badge */}
        <div
          className={`mb-6 rounded-3xl border p-4 sm:p-5 shadow-xs transition-colors ${
            settings.highContrast
              ? "border-amber-400/40 bg-zinc-950"
              : "border-emerald-200 bg-white dark:border-dark-border dark:bg-dark-card"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <label
                htmlFor="hifz-surah-picker"
                className="bangla-text block text-xs font-bold text-gray-500 dark:text-dark-text-muted mb-1"
              >
                অনুশীলনের সূরা নির্বাচন করুন:
              </label>
              <select
                id="hifz-surah-picker"
                value={selectedSurahId}
                onChange={(e) => handleSurahChange(e.target.value)}
                className={`bangla-text w-full rounded-2xl border px-3.5 py-2.5 text-sm font-bold focus:outline-none ${
                  settings.highContrast
                    ? "border-amber-400/50 bg-black text-amber-200"
                    : "border-gray-200 bg-gray-50 text-gray-900 dark:border-dark-border dark:bg-dark-bg dark:text-white"
                }`}
              >
                <optgroup label="নামাজে বহুল পঠিত সূরা ও আয়াতসমূহ:">
                  {prayerSurahs.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.id === "ayatul-kursi"
                        ? "আয়াতুল কুরসী (সূরা আল-বাকারা ২৫৫)"
                        : `${toBengaliNumber(s.number)}. সূরা ${s.nameBn} (${s.nameAr})`}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="পবিত্র কুরআনের ১১৪টি সূরা:">
                  {allSurahsData.map((s) => (
                    <option key={s.number} value={`surah-${s.number}`}>
                      {toBengaliNumber(s.number)}. সূরা {s.name_bangla} (
                      {s.name_arabic})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Spaced-Repetition Badge */}
            <div className="flex items-center gap-2">
              {hifzRecord && hifzRecord.stage > 0 ? (
                <div
                  className={`rounded-2xl border px-4 py-2 text-center ${
                    hifzRecord.isMastered
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60"
                      : "border-sky-300 bg-sky-50 dark:bg-sky-950/40"
                  }`}
                >
                  <div className="flex items-center gap-1.5 justify-center">
                    <Award
                      className={`h-4 w-4 ${
                        hifzRecord.isMastered
                          ? "text-emerald-600"
                          : "text-sky-600"
                      }`}
                    />
                    <span className="bangla-text text-xs font-bold text-gray-900 dark:text-white">
                      {hifzRecord.isMastered
                        ? "সম্পূর্ণ মুখস্থ (Mastered)"
                        : `ধাপ ${toBengaliNumber(hifzRecord.stage)}/৫`}
                    </span>
                  </div>
                  <span className="bangla-text text-[11px] text-gray-500 dark:text-dark-text-muted">
                    পরবর্তী রিভিশন: {hifzRecord.nextReviewDate}
                  </span>
                </div>
              ) : (
                <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-center dark:border-dark-border dark:bg-dark-bg">
                  <span className="bangla-text text-xs font-bold text-gray-600 dark:text-dark-text-secondary">
                    নতুন অনুশীলন
                  </span>
                  <p className="bangla-text text-[10px] text-gray-400">
                    মুখস্থ শেষে নিচে &apos;পেরেছি&apos; চাপুন
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hide Mode Switcher Buttons */}
        <div className="mb-6 flex flex-wrap items-center gap-1.5">
          <span className="bangla-text text-xs font-bold text-gray-500 dark:text-dark-text-muted mr-1">
            টেক্সট মোড:
          </span>
          {(
            [
              { key: "normal", label: "স্বাভাবিক" },
              { key: "hide-every-other-word", label: "এক শব্দ পর পর গোপন" },
              { key: "first-letters", label: "শুধু প্রথম অক্ষর" },
              { key: "fully-hidden", label: "সম্পূর্ণ গোপন (Self-Test)" },
              { key: "hide-arabic", label: "আরবি লুকান" },
            ] as { key: HifzHideMode; label: string }[]
          ).map((m) => {
            const active = settings.hideMode === m.key;
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => saveSettings({ ...settings, hideMode: m.key })}
                className={`bangla-text rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  active
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 dark:border-dark-border dark:bg-dark-card dark:text-dark-text-secondary"
                }`}
              >
                {m.label}
              </button>
            );
          })}
        </div>

        {/* Ayah Card & Interactive Word Masking */}
        <div
          className={`relative rounded-3xl border p-6 sm:p-10 shadow-lg transition-all ${
            settings.highContrast
              ? "border-amber-400 bg-zinc-950 shadow-amber-950/20"
              : "border-emerald-200 bg-white dark:border-dark-border dark:bg-dark-card"
          }`}
        >
          {/* Ayah progress badge */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-6 dark:border-dark-border">
            <span className="bangla-text rounded-xl bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              আয়াত {toBengaliNumber(activeAyahIndex + 1)}/
              {toBengaliNumber(totalAyahs)}
            </span>

            <div className="flex items-center gap-2">
              <span className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted">
                পুনরাবৃত্তি: {toBengaliNumber(currentRepeat)}/
                {toBengaliNumber(settings.repeatCount)}
              </span>
              {isGapPause && (
                <span className="bangla-text rounded-lg bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800 animate-pulse">
                  আপনার বলার বিরতি...
                </span>
              )}
            </div>
          </div>

          {/* Interactive Arabic Words Area */}
          <div className="my-6 text-center">
            {settings.hideMode === "hide-arabic" && !revealedFullAyah ? (
              <div
                onClick={() => setRevealedFullAyah(true)}
                className="cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/60 p-8 text-center hover:border-emerald-500 dark:border-dark-border dark:bg-dark-bg"
              >
                <EyeOff className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                <p className="bangla-text text-sm font-semibold text-gray-500">
                  আরবি আয়াত লুকানো আছে। মনে করার চেষ্টা করুন এবং দেখতে এখানে ট্যাপ
                  করুন।
                </p>
              </div>
            ) : (
              <div
                className={`arabic-text flex flex-wrap items-center justify-center gap-2 sm:gap-3 leading-loose ${
                  settings.largeFont
                    ? "text-3xl sm:text-5xl"
                    : "text-2xl sm:text-4xl"
                } ${
                  settings.highContrast
                    ? "text-amber-300 font-bold"
                    : "text-gray-900 dark:text-white"
                }`}
                dir="rtl"
              >
                {maskedWords.map((item) => (
                  <span
                    key={item.wordIndex}
                    onClick={() => handleToggleWordReveal(item.wordIndex)}
                    className={`cursor-pointer rounded-xl px-2 py-0.5 transition-all select-none ${
                      item.isHidden
                        ? "bg-emerald-100/80 text-emerald-800 underline decoration-dashed hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300"
                        : "hover:text-emerald-600"
                    }`}
                    title={item.isHidden ? "শব্দটি দেখতে ট্যাপ করুন" : ""}
                  >
                    {item.word}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Bangla Pronunciation & Meaning */}
          <div className="mt-8 space-y-2 border-t border-gray-100 pt-4 text-center dark:border-dark-border">
            <p className="bangla-text text-sm sm:text-base font-semibold text-gray-700 dark:text-dark-text-secondary">
              {activeAyah.uccharonBn}
            </p>
            <p className="bangla-text text-xs sm:text-sm text-gray-500 dark:text-dark-text-muted">
              {activeAyah.meaningBn}
            </p>
          </div>

          {/* Self-Check Pass / Again Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 border-t border-gray-100 pt-5 dark:border-dark-border">
            <button
              type="button"
              onClick={() => handleMarkResult(false)}
              className="bangla-text inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-bold text-rose-700 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300"
            >
              <RefreshCw className="h-4 w-4" />
              <span>আবার চেষ্টা করব (Again)</span>
            </button>

            <button
              type="button"
              onClick={() => handleMarkResult(true)}
              className="bangla-text inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 dark:shadow-emerald-950/40"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>পেরেছি! (Passed)</span>
            </button>
          </div>

          {lastCheckResult && (
            <p className="bangla-text mt-3 text-center text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              {lastCheckResult === "pass"
                ? "মাশাআল্লাহ! পরবর্তী রিভিশনের জন্য স্পেসড রিপিটেশনে যুক্ত হয়েছে।"
                : "কোনো সমস্যা নেই, আগামীকাল আবার রিভিশন দেওয়া হবে ইনশাআল্লাহ।"}
            </p>
          )}
        </div>

        {/* Audio Player & Range / Repeat Settings Bar */}
        <div
          className={`mt-6 rounded-3xl border p-4 sm:p-5 shadow-xs transition-colors ${
            settings.highContrast
              ? "border-amber-400/40 bg-zinc-950"
              : "border-gray-200 bg-white dark:border-dark-border dark:bg-dark-card"
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Transport controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveAyahIndex((i) => Math.max(0, i - 1));
                  setCurrentRepeat(1);
                  setRevealedWordIndices(new Set());
                }}
                disabled={activeAyahIndex === 0}
                aria-label="পূর্ববর্তী আয়াত"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-100 disabled:opacity-40 dark:border-dark-border"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                className="bangla-text inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs hover:bg-emerald-700"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4" />
                    <span>বিরতি</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span>তিলাওয়াত ও হিফজ চালান</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveAyahIndex((i) => Math.min(totalAyahs - 1, i + 1));
                  setCurrentRepeat(1);
                  setRevealedWordIndices(new Set());
                }}
                disabled={activeAyahIndex >= totalAyahs - 1}
                aria-label="পরবর্তী আয়াত"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-100 disabled:opacity-40 dark:border-dark-border"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsAudioMuted((m) => !m)}
                title={isAudioMuted ? "আনমিউট" : "মিউট"}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-100 dark:border-dark-border"
              >
                {isAudioMuted ? (
                  <VolumeX className="h-4 w-4 text-rose-500" />
                ) : (
                  <Volume2 className="h-4 w-4 text-gray-700 dark:text-dark-text-secondary" />
                )}
              </button>
            </div>

            {/* Repeat count & pause gap options */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="bangla-text font-semibold text-gray-500">
                  প্রতি আয়াত:
                </span>
                <select
                  value={settings.repeatCount}
                  onChange={(e) =>
                    saveSettings({
                      ...settings,
                      repeatCount: parseInt(e.target.value, 10),
                    })
                  }
                  className="bangla-text rounded-xl border border-gray-200 bg-gray-50 px-2.5 py-1.5 font-bold dark:border-dark-border dark:bg-dark-bg"
                >
                  <option value={1}>১ বার</option>
                  <option value={2}>২ বার</option>
                  <option value={3}>৩ বার (প্রস্তাবিত)</option>
                  <option value={5}>৫ বার</option>
                  <option value={10}>১০ বার</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="bangla-text font-semibold text-gray-500">
                  বিরতি:
                </span>
                <select
                  value={settings.pauseGapSeconds}
                  onChange={(e) =>
                    saveSettings({
                      ...settings,
                      pauseGapSeconds: parseInt(e.target.value, 10),
                    })
                  }
                  className="bangla-text rounded-xl border border-gray-200 bg-gray-50 px-2.5 py-1.5 font-bold dark:border-dark-border dark:bg-dark-bg"
                >
                  <option value={0}>বিরতি নেই</option>
                  <option value={1}>১ সেকেন্ড</option>
                  <option value={2}>২ সেকেন্ড</option>
                  <option value={3}>৩ সেকেন্ড</option>
                  <option value={5}>৫ সেকেন্ড</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HifzMemorizeClient;
