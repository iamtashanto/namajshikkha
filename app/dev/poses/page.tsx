"use client";

import React, { useEffect, useState } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Sparkles,
  Eye,
  Users,
} from "lucide-react";
import {
  Posture,
  POSTURE_META,
  BodyPartHighlight,
} from "@/src/lib/simulator";
import { PrayerFigure } from "@/src/components/simulator/PrayerFigure";
import { Breadcrumbs, Badge } from "@/src/components/ui";

const ALL_POSTURES: Posture[] = [
  Posture.STANDING,
  Posture.TAKBIR_HANDS_RAISED,
  Posture.QIYAM_HANDS_FOLDED,
  Posture.RUKU,
  Posture.QAWMA,
  Posture.SAJDA,
  Posture.JALSA,
  Posture.QADA,
  Posture.TASHAHHUD_FINGER_RAISED,
  Posture.SALAM_RIGHT,
  Posture.SALAM_LEFT,
  Posture.QUNUT_TAKBIR_HANDS_RAISED,
  Posture.EID_TAKBIR_HANDS_RAISED,
  Posture.EID_TAKBIR_HANDS_DOWN,
  Posture.JANAZA_TAKBIR,
  Posture.MUNAJAT,
];

function getDefaultHighlightsForPosture(posture: Posture): BodyPartHighlight[] {
  if (posture === Posture.SAJDA) return ["sajda_7_parts"];
  if (posture === Posture.RUKU) return ["back"];
  if (posture === Posture.TASHAHHUD_FINGER_RAISED) return ["index_finger"];
  return [];
}

export default function DevPosesPage() {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<"side" | "front">("side");
  const [gridViewFilter, setGridViewFilter] = useState<
    "both" | "side" | "front"
  >("both");
  const [transitionMs, setTransitionMs] = useState<number>(520);
  const [showHighlights, setShowHighlights] = useState<boolean>(true);

  const currentPosture = ALL_POSTURES[activeIdx];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % ALL_POSTURES.length);
    }, 1500);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const activeHighlights = showHighlights
    ? getDefaultHighlightsForPosture(currentPosture)
    : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "সিমুলেটর", href: "/simulator" },
          { label: "২ডি পুতুল ও অবস্থান পরীক্ষণ (/dev/poses)" },
        ]}
      />

      {/* Page Header */}
      <div className="mb-8 text-center">
        <div className="mb-3 flex justify-center gap-2">
          <Badge variant="fard" dot>
            Dev Showcase — ১৬টি অবস্থান
          </Badge>
          <Badge variant="neutral">60fps rAF Joint Interpolation</Badge>
        </div>
        <h1 className="bangla-text text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          নামাজ সিমুলেটরের ২ডি অ্যানিমেটেড ফিগার (`/dev/poses`)
        </h1>
        <p className="bangla-text mx-auto mt-2 max-w-2xl text-sm text-gray-600 dark:text-dark-text-secondary">
          হানাফি ফিকহ অনুযায়ী পুরুষ (পাঞ্জাবি ও টুপি) এবং মহিলা (পূর্ণ শালীন হিজাব ও পোশাক)-এর ১৬টি নামাজের অবস্থান — পাশ থেকে (Side View) ও সামনে থেকে (Front View)।
        </p>
      </div>

      {/* =================================================================== */}
      {/* INTERACTIVE LIVE TRANSITION STAGE                                   */}
      {/* =================================================================== */}
      <div className="mb-12 rounded-3xl border border-emerald-200 bg-white p-6 shadow-md dark:border-dark-border dark:bg-dark-card sm:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-emerald-100 pb-4 dark:border-dark-border">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Live Transition Stage ({activeIdx + 1} / {ALL_POSTURES.length})
            </span>
            <h2 className="bangla-text text-2xl font-bold text-gray-900 dark:text-white">
              {POSTURE_META[currentPosture].labelBn}{" "}
              <span className="text-sm font-normal text-gray-500">
                ({currentPosture})
              </span>
            </h2>
          </div>

          {/* Playback Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setActiveIdx(
                  (prev) => (prev - 1 + ALL_POSTURES.length) % ALL_POSTURES.length
                )
              }
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:border-dark-border dark:bg-dark-card dark:text-emerald-300"
              aria-label="পূর্ববর্তী অবস্থান"
            >
              <SkipBack className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              className="bangla-text inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 dark:shadow-none"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4" />
                  <span>বিরতি দিন</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  <span>সকল অবস্থান চালান (Play All)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveIdx((prev) => (prev + 1) % ALL_POSTURES.length)
              }
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:border-dark-border dark:bg-dark-card dark:text-emerald-300"
              aria-label="পরবর্তী অবস্থান"
            >
              <SkipForward className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* View & Highlight Toolbar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="bangla-text text-xs font-bold text-gray-600 dark:text-dark-text-secondary flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" /> দৃশ্য কোণ:
            </span>
            <button
              type="button"
              onClick={() => setActiveView("side")}
              className={`bangla-text rounded-xl px-3.5 py-1.5 text-xs font-bold transition-colors ${
                activeView === "side"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-dark-card-hover dark:text-gray-300"
              }`}
            >
              পাশ থেকে (Side View)
            </button>
            <button
              type="button"
              onClick={() => setActiveView("front")}
              className={`bangla-text rounded-xl px-3.5 py-1.5 text-xs font-bold transition-colors ${
                activeView === "front"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-dark-card-hover dark:text-gray-300"
              }`}
            >
              সামনে থেকে (Front View)
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <label className="bangla-text flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-dark-text-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={showHighlights}
                onChange={(e) => setShowHighlights(e.target.checked)}
                className="h-4 w-4 rounded accent-emerald-600"
              />
              <span>অঙ্গ হাইলাইট (৭ অঙ্গ সিজদা / রুকু / তাশাহহুদ)</span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">
                Transition: {transitionMs}ms
              </span>
              <input
                type="range"
                min={400}
                max={700}
                step={20}
                value={transitionMs}
                onChange={(e) => setTransitionMs(Number(e.target.value))}
                className="w-24 accent-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Side-by-Side Live Male & Female Figures */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex flex-col items-center">
            <PrayerFigure
              posture={currentPosture}
              gender="male"
              view={activeView}
              highlightParts={activeHighlights}
              transitionDurationMs={transitionMs}
              showPostureBadge
              className="w-full"
            />
          </div>

          <div className="flex flex-col items-center">
            <PrayerFigure
              posture={currentPosture}
              gender="female"
              view={activeView}
              highlightParts={activeHighlights}
              transitionDurationMs={transitionMs}
              showPostureBadge
              className="w-full"
            />
          </div>
        </div>

        {/* Quick Posture Selector Pills */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-emerald-100 pt-5 dark:border-dark-border">
          {ALL_POSTURES.map((posture, idx) => (
            <button
              key={posture}
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setActiveIdx(idx);
              }}
              className={`bangla-text rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                idx === activeIdx
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "border border-emerald-100 bg-emerald-50/50 text-gray-700 hover:bg-emerald-100/70 dark:border-dark-border dark:bg-dark-card dark:text-gray-300"
              }`}
            >
              {idx + 1}. {POSTURE_META[posture].labelBn}
            </button>
          ))}
        </div>
      </div>

      {/* =================================================================== */}
      {/* ALL 16 POSTURES GALLERY (MALE & FEMALE, SIDE & FRONT)               */}
      {/* =================================================================== */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="bangla-text text-2xl font-bold text-gray-900 dark:text-white">
            সকল ১৬টি অবস্থানের তালিকা (পুরুষ ও মহিলা)
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-500" />
          {(["both", "side", "front"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setGridViewFilter(mode)}
              className={`bangla-text rounded-xl px-3 py-1.5 text-xs font-bold ${
                gridViewFilter === mode
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700 dark:bg-dark-card dark:text-gray-300"
              }`}
            >
              {mode === "both"
                ? "পাশ ও সামনে উভয়"
                : mode === "side"
                ? "শুধু পাশ থেকে"
                : "শুধু সামনে থেকে"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {ALL_POSTURES.map((posture, idx) => {
          const highlights = getDefaultHighlightsForPosture(posture);
          return (
            <div
              key={posture}
              className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-card sm:p-6"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    #{idx + 1} — {posture}
                  </span>
                  <h3 className="bangla-text text-xl font-bold text-gray-900 dark:text-white">
                    {POSTURE_META[posture].labelBn}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveIdx(idx);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="bangla-text rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300"
                >
                  লাইভ স্টেজে দেখুন ↑
                </button>
              </div>

              <div
                className={`grid grid-cols-1 gap-4 ${
                  gridViewFilter === "both"
                    ? " sm:grid-cols-2 lg:grid-cols-4"
                    : "sm:grid-cols-2"
                }`}
              >
                {(gridViewFilter === "both" || gridViewFilter === "side") && (
                  <>
                    <div>
                      <p className="bangla-text mb-1.5 text-center text-xs font-bold text-gray-600 dark:text-gray-300">
                        পুরুষ — পাশ থেকে (Side)
                      </p>
                      <PrayerFigure
                        posture={posture}
                        gender="male"
                        view="side"
                        highlightParts={highlights}
                        showQiblaIndicator={false}
                      />
                    </div>
                    <div>
                      <p className="bangla-text mb-1.5 text-center text-xs font-bold text-gray-600 dark:text-gray-300">
                        মহিলা — পাশ থেকে (Side)
                      </p>
                      <PrayerFigure
                        posture={posture}
                        gender="female"
                        view="side"
                        highlightParts={highlights}
                        showQiblaIndicator={false}
                      />
                    </div>
                  </>
                )}

                {(gridViewFilter === "both" || gridViewFilter === "front") && (
                  <>
                    <div>
                      <p className="bangla-text mb-1.5 text-center text-xs font-bold text-gray-600 dark:text-gray-300">
                        পুরুষ — সামনে থেকে (Front)
                      </p>
                      <PrayerFigure
                        posture={posture}
                        gender="male"
                        view="front"
                        highlightParts={highlights}
                        showQiblaIndicator={false}
                      />
                    </div>
                    <div>
                      <p className="bangla-text mb-1.5 text-center text-xs font-bold text-gray-600 dark:text-gray-300">
                        মহিলা — সামনে থেকে (Front)
                      </p>
                      <PrayerFigure
                        posture={posture}
                        gender="female"
                        view="front"
                        highlightParts={highlights}
                        showQiblaIndicator={false}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

