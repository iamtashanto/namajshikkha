"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Trophy,
  HelpCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  BookOpen,
  Timer,
  Sparkles,
  Award,
  Search,
  Play,
  Settings2,
  Lightbulb,
} from "lucide-react";
import { prayers, getPrayerBySlug } from "@/src/data";
import { PrayerGroup, PrayerType } from "@/src/types/content";
import {
  buildTimeline,
  Posture,
  SalahGender,
  SalahRole,
  generatePracticeQuestions,
  QuizQuestion,
} from "@/src/lib/simulator";
import { PrayerFigure } from "@/src/components/simulator/PrayerFigure";
import { Badge, BadgeVariant } from "@/src/components/ui/Badge";
import { toBengaliNumber } from "@/src/lib/bengali";
import { usePreferences } from "@/src/context/PreferencesContext";

export type QuizDifficulty = "beginner" | "normal" | "expert";

export interface PrayerMasteryRecord {
  bestScore: number;
  totalQuestions: number;
  bestPercent: number;
  attempts: number;
  mastered: boolean;
  updatedAt: string;
}

const PROGRESS_STORAGE_KEY = "namaj-practice-progress-v1";
const EXPERT_SECONDS_PER_QUESTION = 12;

const GROUP_LABELS: Record<PrayerGroup, { title: string; order: number }> = {
  "daily-fard": { title: "দৈনিক ৫ ওয়াক্ত নামাজ", order: 1 },
  wajib: { title: "ওয়াজিব নামাজ", order: 2 },
  "jumuah-eid": { title: "জুমআ ও দুই ঈদ", order: 3 },
  janaza: { title: "জানাজার নামাজ", order: 4 },
  "sunnah-nafl": { title: "সুন্নাত ও নফল নামাজ", order: 5 },
  special: { title: "বিশেষ সালাত", order: 6 },
};

const STATUS_BADGE_MAP: Record<
  string,
  { variant: BadgeVariant; label: string }
> = {
  fard: { variant: "fard", label: "ফরজ" },
  wajib: { variant: "wajib", label: "ওয়াজিব" },
  sunnah: { variant: "sunnah", label: "সুন্নাত" },
  "sunnah-muakkadah": { variant: "sunnah", label: "সুন্নাত" },
  "sunnah-ghair-muakkadah": { variant: "sunnah", label: "সুন্নাত" },
  nafl: { variant: "nafl", label: "নফল" },
  special: { variant: "gold", label: "বিশেষ" },
};

interface MistakeLogItem {
  question: QuizQuestion;
  selectedOptionLabel: string;
  correctOptionLabel: string;
}

export function NamajPracticeClient() {
  const searchParams = useSearchParams();
  const { preferences } = usePreferences();

  const urlPrayer = searchParams.get("prayer");
  const urlUnit = searchParams.get("unit");
  const urlGender = searchParams.get("gender");
  const urlDifficulty = searchParams.get("difficulty");

  const initialPrayer =
    (urlPrayer ? getPrayerBySlug(urlPrayer) : undefined) ||
    getPrayerBySlug("fajr") ||
    prayers[0];

  const defaultUnitIdx = Math.max(
    0,
    initialPrayer.rakatUnits.findIndex(
      (u) =>
        (urlUnit && u.status === urlUnit) ||
        u.status === "fard" ||
        u.status === "wajib"
    )
  );

  // Screens: setup | quiz | results
  const [screen, setScreen] = useState<"setup" | "quiz" | "results">(
    urlPrayer && urlUnit ? "quiz" : "setup"
  );

  // Configuration
  const [selectedPrayerSlug, setSelectedPrayerSlug] = useState<string>(
    initialPrayer.slug
  );
  const [selectedUnitIndex, setSelectedUnitIndex] =
    useState<number>(defaultUnitIdx);
  const [gender, setGender] = useState<SalahGender>(
    urlGender === "female" || urlGender === "male"
      ? urlGender
      : preferences.gender
  );
  const [role, setRole] = useState<SalahRole>("alone");
  const [difficulty, setDifficulty] = useState<QuizDifficulty>(
    urlDifficulty === "beginner" ||
      urlDifficulty === "normal" ||
      urlDifficulty === "expert"
      ? urlDifficulty
      : "beginner"
  );
  const [prayerSearch, setPrayerSearch] = useState<string>("");

  // Quiz state
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [mistakes, setMistakes] = useState<MistakeLogItem[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(EXPERT_SECONDS_PER_QUESTION);
  const [showNormalHint, setShowNormalHint] = useState<boolean>(false);

  // Progress / Mastery records per prayer in localStorage
  const [progressMap, setProgressMap] = useState<
    Record<string, PrayerMasteryRecord>
  >(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw) as Record<string, PrayerMasteryRecord>;
      }
    } catch {
      // Ignore localStorage read errors
    }
    return {};
  });

  const saveAttemptResult = useCallback(
    (prayerSlug: string, finalScore: number, totalQ: number) => {
      const percent = totalQ > 0 ? Math.round((finalScore / totalQ) * 100) : 0;
      setProgressMap((prev) => {
        const existing = prev[prayerSlug];
        const bestPercent = Math.max(existing?.bestPercent ?? 0, percent);
        const bestScore = Math.max(existing?.bestScore ?? 0, finalScore);
        const updated: Record<string, PrayerMasteryRecord> = {
          ...prev,
          [prayerSlug]: {
            bestScore,
            totalQuestions: totalQ,
            bestPercent,
            attempts: (existing?.attempts ?? 0) + 1,
            mastered: bestPercent >= 80,
            updatedAt: new Date().toISOString(),
          },
        };
        try {
          localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // Ignore localStorage write errors
        }
        return updated;
      });
    },
    []
  );

  const selectedPrayer = useMemo(
    () =>
      getPrayerBySlug(selectedPrayerSlug) ||
      getPrayerBySlug("fajr") ||
      prayers[0],
    [selectedPrayerSlug]
  );

  const safeUnitIndex =
    selectedUnitIndex >= 0 &&
    selectedUnitIndex < selectedPrayer.rakatUnits.length
      ? selectedUnitIndex
      : 0;
  const selectedUnit = selectedPrayer.rakatUnits[safeUnitIndex];

  const timeline = useMemo(
    () =>
      buildTimeline(selectedUnit.config, {
        gender,
        role,
        prayerSlug: selectedPrayer.slug,
        unitLabel: selectedUnit.label,
      }),
    [selectedUnit, gender, role, selectedPrayer.slug]
  );

  const questions = useMemo(
    () =>
      generatePracticeQuestions(timeline, selectedUnit.config, selectedPrayer),
    [timeline, selectedUnit.config, selectedPrayer]
  );

  const totalQuestions = questions.length;
  const safeQIndex = Math.max(0, Math.min(totalQuestions - 1, currentQIndex));
  const currentQuestion = questions[safeQIndex];

  // Figure posture: before answering, show previous step's posture (or STANDING on step 0); after answering, animate to current step's posture!
  const displayedPosture: Posture = useMemo(() => {
    if (isAnswered) {
      return timeline.steps[safeQIndex]?.posture ?? Posture.STANDING;
    }
    if (safeQIndex === 0) return Posture.STANDING;
    return timeline.steps[safeQIndex - 1]?.posture ?? Posture.STANDING;
  }, [isAnswered, safeQIndex, timeline.steps]);

  const handleSelectOption = useCallback(
    (optionId: string) => {
      if (isAnswered || !currentQuestion) return;
      setSelectedOptionId(optionId);
      setIsAnswered(true);

      const isCorrect = optionId === currentQuestion.correctOptionId;
      if (isCorrect) {
        setScore((s) => s + 1);
      } else {
        const chosenLabel =
          currentQuestion.options.find((o) => o.id === optionId)?.labelBn ||
          "সময় শেষ (উত্তর দেওয়া হয়নি)";
        const correctLabel =
          currentQuestion.options.find(
            (o) => o.id === currentQuestion.correctOptionId
          )?.labelBn || "";
        setMistakes((prev) => [
          ...prev,
          {
            question: currentQuestion,
            selectedOptionLabel: chosenLabel,
            correctOptionLabel: correctLabel,
          },
        ]);
      }
    },
    [isAnswered, currentQuestion]
  );

  // Expert Mode Timed Countdown
  useEffect(() => {
    if (screen !== "quiz" || difficulty !== "expert" || isAnswered) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSelectOption("__timeout__");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [screen, difficulty, isAnswered, safeQIndex, handleSelectOption]);

  const startQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setScore(0);
    setMistakes([]);
    setTimeLeft(EXPERT_SECONDS_PER_QUESTION);
    setShowNormalHint(false);
    setScreen("quiz");
  };

  const handleNextQuestion = () => {
    if (safeQIndex >= totalQuestions - 1) {
      saveAttemptResult(selectedPrayer.slug, score, totalQuestions);
      setScreen("results");
    } else {
      setCurrentQIndex((i) => i + 1);
      setSelectedOptionId(null);
      setIsAnswered(false);
      setTimeLeft(EXPERT_SECONDS_PER_QUESTION);
      setShowNormalHint(false);
    }
  };

  const groupedPrayers = useMemo(() => {
    const q = prayerSearch.trim().toLowerCase();
    const filtered = prayers.filter(
      (p) =>
        !q ||
        p.nameBn.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.nameAr.toLowerCase().includes(q)
    );
    const groups: Partial<Record<PrayerGroup, PrayerType[]>> = {};
    for (const p of filtered) {
      if (!groups[p.group]) groups[p.group] = [];
      groups[p.group]!.push(p);
    }
    return Object.entries(groups).sort(
      ([a], [b]) =>
        (GROUP_LABELS[a as PrayerGroup]?.order ?? 99) -
        (GROUP_LABELS[b as PrayerGroup]?.order ?? 99)
    );
  }, [prayerSearch]);

  const currentMastery = progressMap[selectedPrayer.slug];
  const finalPercent =
    totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  return (
    <div className="mx-auto max-w-6xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Top Navigation Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3 shadow-2xs dark:border-dark-border dark:bg-dark-card">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-xs">
            <Trophy className="h-5 w-5" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="bangla-text text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                নামাজ অনুশীলন ও কুইজ মোড
              </h1>
              {currentMastery?.mastered && (
                <span className="bangla-text inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <Award className="h-3 w-3" />
                  <span>{selectedPrayer.nameBn} আয়ত্ত হয়েছে</span>
                </span>
              )}
            </div>
            <p className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted">
              প্রতিটি ধাপের আগে প্রশ্নের উত্তর দিয়ে নামাজের নিয়ম ও মাসায়েল যাচাই করুন
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/simulator?prayer=${selectedPrayer.slug}&unit=${selectedUnit.status}&gender=${gender}&role=${role}`}
            className="bangla-text inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
          >
            <Play className="h-3.5 w-3.5" />
            <span>সিমুলেটর প্লেয়ার</span>
          </Link>

          {screen !== "setup" && (
            <button
              type="button"
              onClick={() => setScreen("setup")}
              className="bangla-text inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-secondary"
            >
              <Settings2 className="h-3.5 w-3.5" />
              <span>সেটআপ পরিবর্তন</span>
            </button>
          )}
        </div>
      </div>

      {/* =====================================================================
          SCREEN 1: PRACTICE SETUP
         ===================================================================== */}
      {screen === "setup" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: Prayer Selection with Mastery Badges */}
          <div className="lg:col-span-7 space-y-4 rounded-2xl border border-emerald-100 bg-white p-4 sm:p-6 shadow-xs dark:border-dark-border dark:bg-dark-card">
            <div className="flex items-center justify-between border-b border-emerald-50 pb-3 dark:border-dark-border">
              <h2 className="bangla-text text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                ১. অনুশীলনের জন্য নামাজ নির্বাচন করুন
              </h2>
              <span className="bangla-text text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                আয়ত্তকৃত:{" "}
                {toBengaliNumber(
                  Object.values(progressMap).filter((m) => m.mastered).length
                )}{" "}
                টি
              </span>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600" />
              <input
                type="search"
                value={prayerSearch}
                onChange={(e) => setPrayerSearch(e.target.value)}
                placeholder="নামাজ খুঁজুন (যেমন: ফজর, যোহর, মাগরিব, বিতর, ঈদ, জানাজা)..."
                aria-label="নামাজ অনুসন্ধান"
                className="bangla-text w-full rounded-xl border border-gray-200 bg-gray-50/70 py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-dark-border dark:bg-dark-bg dark:text-white"
              />
            </div>

            <div className="max-h-[420px] space-y-5 overflow-y-auto pr-1">
              {groupedPrayers.map(([grpKey, list]) => (
                <div key={grpKey} className="space-y-2">
                  <h3 className="bangla-text text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    {GROUP_LABELS[grpKey as PrayerGroup]?.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {list?.map((p) => {
                      const active = p.slug === selectedPrayer.slug;
                      const rec = progressMap[p.slug];
                      return (
                        <button
                          key={p.slug}
                          type="button"
                          onClick={() => {
                            setSelectedPrayerSlug(p.slug);
                            const fIdx = p.rakatUnits.findIndex(
                              (u) => u.status === "fard" || u.status === "wajib"
                            );
                            setSelectedUnitIndex(fIdx !== -1 ? fIdx : 0);
                          }}
                          className={`flex flex-col items-start justify-between rounded-xl border p-3 text-left transition-all ${
                            active
                              ? "border-emerald-600 bg-emerald-50/90 ring-2 ring-emerald-500/20 dark:border-emerald-500 dark:bg-emerald-950/50"
                              : "border-gray-200 bg-white hover:border-emerald-300 dark:border-dark-border dark:bg-dark-bg"
                          }`}
                        >
                          <div className="flex w-full items-center justify-between gap-1">
                            <span className="bangla-text text-sm font-bold text-gray-900 dark:text-white">
                              {p.nameBn}
                            </span>
                            {rec?.mastered && (
                              <span
                                title={`${p.nameBn} আয়ত্ত হয়েছে`}
                                className="inline-flex shrink-0"
                              >
                                <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                              </span>
                            )}
                          </div>
                          <div className="mt-1 flex w-full items-center justify-between text-[11px] text-gray-500 dark:text-dark-text-muted">
                            <span className="bangla-text">
                              {p.slug === "janaza"
                                ? "৪ তাকবীর"
                                : `${toBengaliNumber(p.totalRakats)} রাকাত`}
                            </span>
                            {rec && (
                              <span className="bangla-text font-bold text-emerald-700 dark:text-emerald-400">
                                {toBengaliNumber(rec.bestPercent)}%
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Unit, Gender, Role & Difficulty */}
          <div className="lg:col-span-5 space-y-5">
            {/* Rakat Unit */}
            <div className="rounded-2xl border border-emerald-100 bg-white p-4 sm:p-5 shadow-xs dark:border-dark-border dark:bg-dark-card">
              <h3 className="bangla-text mb-3 text-base font-bold text-gray-900 dark:text-white">
                ২. রাকাত ইউনিট ({selectedPrayer.nameBn})
              </h3>
              <div className="space-y-2">
                {selectedPrayer.rakatUnits.map((unit, idx) => {
                  const active = idx === safeUnitIndex;
                  const badge = STATUS_BADGE_MAP[unit.status] || {
                    variant: "neutral" as BadgeVariant,
                    label: unit.status,
                  };
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedUnitIndex(idx)}
                      className={`flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-left transition-all ${
                        active
                          ? "border-emerald-600 bg-emerald-50/90 ring-2 ring-emerald-500/20 dark:border-emerald-500 dark:bg-emerald-950/50"
                          : "border-gray-200 bg-white dark:border-dark-border dark:bg-dark-bg"
                      }`}
                    >
                      <span className="bangla-text text-sm font-bold text-gray-900 dark:text-white">
                        {unit.label}
                      </span>
                      <Badge variant={badge.variant} dot>
                        {badge.label}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gender & Role */}
            <div className="rounded-2xl border border-emerald-100 bg-white p-4 sm:p-5 shadow-xs dark:border-dark-border dark:bg-dark-card space-y-4">
              <div>
                <h3 className="bangla-text mb-2 text-sm font-bold text-gray-900 dark:text-white">
                  ৩. লিঙ্গ ও ভূমিকা
                </h3>
                <div className="grid grid-cols-2 gap-2 mb-2.5">
                  <button
                    type="button"
                    onClick={() => setGender("male")}
                    className={`bangla-text rounded-xl border py-2 text-xs font-bold ${
                      gender === "male"
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-gray-200 bg-gray-50 text-gray-700 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-secondary"
                    }`}
                  >
                    পুরুষ (Male)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender("female")}
                    className={`bangla-text rounded-xl border py-2 text-xs font-bold ${
                      gender === "female"
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-gray-200 bg-gray-50 text-gray-700 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-secondary"
                    }`}
                  >
                    মহিলা (Female)
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { value: "alone", label: "একা" },
                      { value: "imam", label: "ইমাম" },
                      { value: "muqtadi", label: "মুক্তাদি" },
                    ] as { value: SalahRole; label: string }[]
                  ).map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={`bangla-text rounded-xl border py-2 text-xs font-bold ${
                        role === r.value
                          ? "border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "border-gray-200 bg-white text-gray-600 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-muted"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Selection */}
              <div>
                <h3 className="bangla-text mb-2 text-sm font-bold text-gray-900 dark:text-white">
                  ৪. অনুশীলনের স্তর (Difficulty)
                </h3>
                <div className="space-y-2">
                  {(
                    [
                      {
                        id: "beginner",
                        title: "শিক্ষানবিশ (Beginner)",
                        desc: "প্রতিটি প্রশ্নের নিচে সহায়ক হিন্ট দেখানো হবে, কোনো টাইমার নেই",
                      },
                      {
                        id: "normal",
                        title: "সাধারণ (Normal)",
                        desc: "হিন্ট লুকানো থাকবে (প্রয়োজনে দেখা যাবে), কোনো টাইমার নেই",
                      },
                      {
                        id: "expert",
                        title: "অভিজ্ঞ (Expert — Timed)",
                        desc: "কোনো হিন্ট নেই, প্রতিটি প্রশ্নের জন্য ১২ সেকেন্ড সময়",
                      },
                    ] as { id: QuizDifficulty; title: string; desc: string }[]
                  ).map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDifficulty(d.id)}
                      className={`flex w-full flex-col items-start rounded-xl border p-3 text-left transition-all ${
                        difficulty === d.id
                          ? "border-emerald-600 bg-emerald-50/90 ring-2 ring-emerald-500/20 dark:border-emerald-500 dark:bg-emerald-950/50"
                          : "border-gray-200 bg-white dark:border-dark-border dark:bg-dark-bg"
                      }`}
                    >
                      <span className="bangla-text text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                        {d.title}
                      </span>
                      <span className="bangla-text text-[11px] text-gray-500 dark:text-dark-text-muted mt-0.5">
                        {d.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={startQuiz}
              className="bangla-text flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 text-base font-bold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-700 active:scale-98 dark:shadow-emerald-950/50"
            >
              <Sparkles className="h-5 w-5" />
              <span>
                অনুশীলন শুরু করুন ({toBengaliNumber(totalQuestions)} টি প্রশ্ন)
              </span>
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          SCREEN 2: INTERACTIVE QUIZ PLAYER
         ===================================================================== */}
      {screen === "quiz" && currentQuestion && (
        <div className="space-y-5">
          {/* Progress & Score Bar */}
          <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-xs dark:border-dark-border dark:bg-dark-card">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2">
                <span className="bangla-text rounded-xl bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
                  প্রশ্ন {toBengaliNumber(safeQIndex + 1)}/
                  {toBengaliNumber(totalQuestions)}
                </span>
                <span className="bangla-text text-sm font-bold text-gray-900 dark:text-white">
                  {selectedPrayer.nameBn} — {selectedUnit.label}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {difficulty === "expert" && !isAnswered && (
                  <span
                    className={`bangla-text inline-flex items-center gap-1 rounded-xl px-3 py-1 text-xs font-bold ${
                      timeLeft <= 4
                        ? "bg-rose-100 text-rose-700 animate-pulse dark:bg-rose-950 dark:text-rose-300"
                        : "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300"
                    }`}
                  >
                    <Timer className="h-3.5 w-3.5" />
                    <span>{toBengaliNumber(timeLeft)} সেকেন্ড</span>
                  </span>
                )}

                <span className="bangla-text rounded-xl bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  স্কোর: {toBengaliNumber(score)}/
                  {toBengaliNumber(safeQIndex + (isAnswered ? 1 : 0))}
                </span>
              </div>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-dark-bg">
              <div
                className="h-full rounded-full bg-emerald-600 transition-all duration-300"
                style={{
                  width: `${((safeQIndex + 1) / totalQuestions) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-start">
            {/* Left (5 cols): Live Figure Stage (Pauses before step, animates once answered) */}
            <div className="lg:col-span-5 rounded-2xl border border-emerald-100 bg-white p-4 shadow-xs dark:border-dark-border dark:bg-dark-card">
              <div className="mb-2 flex items-center justify-between">
                <span className="bangla-text text-xs font-bold text-gray-600 dark:text-dark-text-secondary">
                  {isAnswered
                    ? "সঠিক অবস্থান প্রদর্শিত হচ্ছে:"
                    : "পরবর্তী ধাপের জন্য প্রস্তুত:"}
                </span>
                {currentQuestion.rakat && (
                  <span className="bangla-text rounded-lg bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {toBengaliNumber(currentQuestion.rakat)}ম রাকাত
                  </span>
                )}
              </div>

              <div className="flex h-[270px] items-center justify-center">
                <PrayerFigure
                  posture={displayedPosture}
                  gender={gender}
                  view="side"
                  className="h-full w-full max-w-[320px]"
                />
              </div>
            </div>

            {/* Right (7 cols): Question, Options (with Pose Thumbnails), and Explanation */}
            <div className="lg:col-span-7 space-y-4">
              <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-xs dark:border-dark-border dark:bg-dark-card">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="bangla-text inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <HelpCircle className="h-3.5 w-3.5" />
                    <span>
                      {currentQuestion.type === "next-posture"
                        ? "অবস্থান যাচাই"
                        : currentQuestion.type === "next-recitation"
                        ? "দোয়া ও কিরাত যাচাই"
                        : currentQuestion.type === "repeat-count"
                        ? "তাসবীহ সংখ্যা যাচাই"
                        : "সূরা মিলানোর বিধান"}
                    </span>
                  </span>

                  {difficulty === "normal" && !isAnswered && (
                    <button
                      type="button"
                      onClick={() => setShowNormalHint((h) => !h)}
                      className="bangla-text inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:underline dark:text-amber-400"
                    >
                      <Lightbulb className="h-3.5 w-3.5" />
                      <span>{showNormalHint ? "হিন্ট লুকান" : "হিন্ট দেখুন"}</span>
                    </button>
                  )}
                </div>

                <h2 className="bangla-text text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {currentQuestion.promptBn}
                </h2>

                {/* Beginner / Toggled Hint */}
                {(difficulty === "beginner" || showNormalHint) &&
                  !isAnswered && (
                    <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-950 dark:border-amber-800/50 dark:bg-amber-950/30 dark:text-amber-200">
                      <Lightbulb className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                      <span className="bangla-text leading-relaxed">
                        {currentQuestion.hintBn}
                      </span>
                    </div>
                  )}

                {/* Answer Options Grid */}
                <div
                  className={
                    currentQuestion.type === "next-posture"
                      ? "grid grid-cols-1 gap-3 sm:grid-cols-2"
                      : "grid grid-cols-1 gap-2.5"
                  }
                >
                  {currentQuestion.options.map((opt) => {
                    const isSelected = selectedOptionId === opt.id;
                    const isCorrectOpt =
                      opt.id === currentQuestion.correctOptionId;

                    let cardStyle =
                      "border-gray-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/30 dark:border-dark-border dark:bg-dark-bg";
                    if (isAnswered) {
                      if (isCorrectOpt) {
                        cardStyle =
                          "border-emerald-600 bg-emerald-50/90 ring-2 ring-emerald-500/30 dark:border-emerald-500 dark:bg-emerald-950/60";
                      } else if (isSelected) {
                        cardStyle =
                          "border-rose-500 bg-rose-50/90 ring-2 ring-rose-500/30 dark:border-rose-500 dark:bg-rose-950/50";
                      } else {
                        cardStyle =
                          "border-gray-200 bg-gray-50/60 opacity-65 dark:border-dark-border dark:bg-dark-bg";
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={isAnswered}
                        onClick={() => handleSelectOption(opt.id)}
                        className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-all ${cardStyle}`}
                      >
                        {/* Mini Pose Thumbnail when question type is 'next-posture' */}
                        {opt.posture && (
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50/40 dark:border-dark-border dark:bg-dark-card">
                            <PrayerFigure
                              posture={opt.posture}
                              gender={gender}
                              view="side"
                              showQiblaIndicator={false}
                              showPostureBadge={false}
                              className="h-full w-full"
                            />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="bangla-text text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                            {opt.labelBn}
                          </div>
                          {opt.subLabelBn && (
                            <div className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted mt-0.5 line-clamp-1">
                              {opt.subLabelBn}
                            </div>
                          )}
                        </div>

                        {isAnswered && isCorrectOpt && (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        )}
                        {isAnswered && isSelected && !isCorrectOpt && (
                          <XCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Answer Feedback & Fiqh Masail Explanation */}
              {isAnswered && (
                <div
                  className={`rounded-2xl border p-4 sm:p-5 shadow-xs ${
                    selectedOptionId === currentQuestion.correctOptionId
                      ? "border-emerald-300 bg-emerald-50/80 dark:border-emerald-800 dark:bg-emerald-950/40"
                      : "border-rose-300 bg-rose-50/80 dark:border-rose-800 dark:bg-rose-950/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {selectedOptionId === currentQuestion.correctOptionId ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0" />
                      )}
                      <h3 className="bangla-text text-base font-bold text-gray-900 dark:text-white">
                        {selectedOptionId === currentQuestion.correctOptionId
                          ? "মাশাআল্লাহ! সঠিক উত্তর"
                          : selectedOptionId === "__timeout__"
                          ? "সময় সমাপ্ত! সঠিক নিয়ম জেনে নিন"
                          : "উত্তরটি সঠিক নয় — শরয়ী মাসায়েল জেনে নিন"}
                      </h3>
                    </div>

                    <Badge
                      variant={
                        currentQuestion.severity === "invalidates_salah"
                          ? "fard"
                          : currentQuestion.severity === "requires_sajda_sahu"
                          ? "wajib"
                          : "sunnah"
                      }
                    >
                      {currentQuestion.severity === "invalidates_salah"
                        ? "ফরজ রুকন (ভঙ্গ হলে নামাজ বাতিল)"
                        : currentQuestion.severity === "requires_sajda_sahu"
                        ? "ওয়াজিব (সিজদায়ে সাহু প্রযোজ্য)"
                        : "সুন্নাত আমল"}
                    </Badge>
                  </div>

                  <p className="bangla-text mt-2 text-sm leading-relaxed text-gray-800 dark:text-dark-text-secondary">
                    {currentQuestion.explanationBn}
                  </p>

                  <p className="bangla-text mt-1.5 rounded-xl bg-white/80 p-2.5 text-xs font-semibold text-gray-900 dark:bg-dark-card dark:text-emerald-200">
                    {currentQuestion.fiqhImpactBn}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <Link
                      href={`/masail/${currentQuestion.rulingSlug}`}
                      className="bangla-text inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 underline hover:text-emerald-800 dark:text-emerald-400"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>
                        মাসায়েল পড়ুন: {currentQuestion.rulingTitleBn}
                      </span>
                    </Link>

                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="bangla-text inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-emerald-700"
                    >
                      <span>
                        {safeQIndex >= totalQuestions - 1
                          ? "ফলাফল দেখুন"
                          : "পরবর্তী ধাপ"}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SCREEN 3: END / RESULTS SCREEN
         ===================================================================== */}
      {screen === "results" && (
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="rounded-3xl border border-emerald-200 bg-gradient-to-b from-emerald-50/70 via-white to-white p-6 sm:p-10 text-center shadow-sm dark:border-emerald-800/50 dark:from-emerald-950/30 dark:via-dark-card dark:to-dark-card">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg">
              <Trophy className="h-8 w-8" />
            </div>

            {finalPercent >= 80 && (
              <span className="bangla-text mb-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-4 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <Award className="h-4 w-4" />
                <span>{selectedPrayer.nameBn} আয়ত্ত হয়েছে!</span>
              </span>
            )}

            <h2 className="bangla-text text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              আপনার স্কোর: {toBengaliNumber(score)}/
              {toBengaliNumber(totalQuestions)} ({toBengaliNumber(finalPercent)}
              %)
            </h2>

            <p className="bangla-text mt-2 text-sm text-gray-600 dark:text-dark-text-secondary">
              {selectedPrayer.nameBn} ({selectedUnit.label}) •{" "}
              {mistakes.length === 0
                ? "মাশাআল্লাহ! আপনি সবগুলো ধাপের সঠিক উত্তর দিয়েছেন।"
                : `${toBengaliNumber(
                    mistakes.length
                  )} টি ধাপে আরও অনুশীলনের সুযোগ রয়েছে।`}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={startQuiz}
                className="bangla-text inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-700"
              >
                <RotateCcw className="h-4 w-4" />
                <span>আবার চেষ্টা করুন</span>
              </button>

              <button
                type="button"
                onClick={() => setScreen("setup")}
                className="bangla-text inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 dark:border-dark-border dark:bg-dark-bg dark:text-emerald-300"
              >
                <span>অন্য নামাজ অনুশীলন করুন</span>
              </button>
            </div>
          </div>

          {/* Weak Areas List */}
          {mistakes.length > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5 sm:p-6 dark:border-amber-900/40 dark:bg-amber-950/20">
              <h3 className="bangla-text mb-4 text-lg font-bold text-amber-950 dark:text-amber-200 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <span>দুর্বল ক্ষেত্রসমূহ ও সংশোধনী (Weak Areas)</span>
              </h3>

              <div className="space-y-3">
                {mistakes.map((m, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-amber-200/80 bg-white p-4 dark:border-dark-border dark:bg-dark-card"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <span className="bangla-text text-sm font-bold text-gray-900 dark:text-white">
                        {m.question.promptBn}
                      </span>
                      <span className="bangla-text rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                        {m.question.categoryLabelBn}
                      </span>
                    </div>
                    <p className="bangla-text text-xs text-rose-600 dark:text-rose-400">
                      আপনার উত্তর: {m.selectedOptionLabel} •{" "}
                      <strong className="text-emerald-700 dark:text-emerald-400">
                        সঠিক উত্তর: {m.correctOptionLabel}
                      </strong>
                    </p>
                    <p className="bangla-text mt-1.5 text-xs text-gray-700 dark:text-dark-text-secondary">
                      {m.question.explanationBn} ({m.question.fiqhImpactBn})
                    </p>
                    <Link
                      href={`/masail/${m.question.rulingSlug}`}
                      className="bangla-text mt-2 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 underline dark:text-emerald-400"
                    >
                      <BookOpen className="h-3 w-3" />
                      <span>{m.question.rulingTitleBn}</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NamajPracticeClient;
