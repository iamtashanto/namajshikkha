"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  User,
} from "lucide-react";
import { PrayerStepDetail, Dua } from "@/src/types/content";
import { usePreferences } from "@/src/context/PreferencesContext";
import { ArabicBlock, Callout } from "@/src/components/ui";

interface PrayerInteractiveGuideProps {
  steps: PrayerStepDetail[];
  duas: Dua[];
  prayerNameBn?: string;
}

export function PrayerInteractiveGuide({
  steps,
  duas,
}: PrayerInteractiveGuideProps) {
  const { preferences, setGender } = usePreferences();

  // Local state for expanded step IDs (by default expand the first 2 steps or all if fewer)
  const [expandedSteps, setExpandedSteps] = useState<number[]>(() =>
    steps.length <= 4 ? steps.map((s) => s.stepNumber) : [1, 2]
  );

  // Active gender view mode: starts from user preferences
  const currentGender = preferences.gender; // "male" | "female"
  const [genderFilter, setGenderFilter] = useState<"user" | "both">("user");

  const toggleStep = (stepNumber: number) => {
    setExpandedSteps((prev) =>
      prev.includes(stepNumber)
        ? prev.filter((id) => id !== stepNumber)
        : [...prev, stepNumber]
    );
  };

  const expandAll = () => {
    setExpandedSteps(steps.map((s) => s.stepNumber));
  };

  const collapseAll = () => {
    setExpandedSteps([]);
  };

  const allExpanded = expandedSteps.length === steps.length;

  // Dua lookup map
  const duaMap = new Map<string, Dua>();
  for (const d of duas) {
    duaMap.set(d.id, d);
  }

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-100/90 bg-emerald-50/60 p-4 dark:border-dark-border dark:bg-dark-card">
        {/* Gender Toggle Pill */}
        <div className="flex items-center gap-1.5">
          <span className="bangla-text text-xs font-semibold text-gray-700 dark:text-dark-text-secondary flex items-center gap-1">
            <User className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            পদ্ধতি:
          </span>
          <div className="inline-flex rounded-xl bg-white p-0.5 shadow-xs border border-emerald-200/80 dark:border-dark-border dark:bg-dark-card-hover">
            <button
              type="button"
              onClick={() => {
                setGender("male");
                setGenderFilter("user");
              }}
              className={`bangla-text rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                currentGender === "male" && genderFilter === "user"
                  ? "bg-emerald-600 text-white shadow-xs font-semibold"
                  : "text-gray-600 hover:text-emerald-700 dark:text-dark-text-muted dark:hover:text-white"
              }`}
            >
              পুরুষ
            </button>
            <button
              type="button"
              onClick={() => {
                setGender("female");
                setGenderFilter("user");
              }}
              className={`bangla-text rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                currentGender === "female" && genderFilter === "user"
                  ? "bg-emerald-600 text-white shadow-xs font-semibold"
                  : "text-gray-600 hover:text-emerald-700 dark:text-dark-text-muted dark:hover:text-white"
              }`}
            >
              মহিলা
            </button>
            <button
              type="button"
              onClick={() => setGenderFilter("both")}
              className={`bangla-text rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                genderFilter === "both"
                  ? "bg-emerald-600 text-white shadow-xs font-semibold"
                  : "text-gray-600 hover:text-emerald-700 dark:text-dark-text-muted dark:hover:text-white"
              }`}
            >
              উভয়
            </button>
          </div>
        </div>

        {/* Expand / Collapse All Toggle */}
        <button
          type="button"
          onClick={allExpanded ? collapseAll : expandAll}
          className="bangla-text inline-flex items-center gap-1 rounded-xl border border-emerald-200 bg-white px-3 py-1.5 text-xs font-medium text-emerald-800 transition-colors hover:bg-emerald-50 dark:border-dark-border dark:bg-dark-card dark:text-emerald-300 dark:hover:bg-dark-card-hover"
        >
          {allExpanded ? (
            <>
              <ChevronUp className="h-3.5 w-3.5" />
              <span>সব ধাপ বন্ধ করুন</span>
            </>
          ) : (
            <>
              <ChevronDown className="h-3.5 w-3.5" />
              <span>সব ধাপ খুলুন</span>
            </>
          )}
        </button>
      </div>

      {/* Step by Step Timeline */}
      <div className="space-y-4">
        {steps.map((step) => {
          const isExpanded = expandedSteps.includes(step.stepNumber);
          const recitation = step.recitationId
            ? duaMap.get(step.recitationId)
            : step.recitationCustom;

          return (
            <div
              key={step.stepNumber}
              className="overflow-hidden rounded-2xl border border-emerald-100/90 bg-white shadow-xs transition-all dark:border-dark-border dark:bg-dark-card"
            >
              {/* Step Header Button */}
              <button
                type="button"
                onClick={() => toggleStep(step.stepNumber)}
                className="flex w-full items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-emerald-50/40 dark:hover:bg-dark-card-hover sm:p-5"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Step Number Circle */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 font-bold text-white shadow-xs shadow-emerald-200 dark:shadow-emerald-950 sm:h-10 sm:w-10 text-sm sm:text-base">
                    {step.stepNumber}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="bangla-text text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/40">
                        {step.rakatLabel}
                      </span>
                      {recitation && (
                        <span className="bangla-text text-[11px] font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-800/40">
                          তিলাওয়াত / দোয়া অন্তর্ভুক্ত
                        </span>
                      )}
                    </div>
                    <h3 className="bangla-text text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                      {step.titleBn}
                    </h3>
                  </div>
                </div>

                <div className="shrink-0 text-emerald-600 dark:text-emerald-400">
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
              </button>

              {/* Step Body (Collapsible) */}
              {isExpanded && (
                <div className="border-t border-emerald-100/70 p-4 sm:p-6 space-y-4 dark:border-dark-border dark:bg-dark-card/50">
                  {/* Detailed Description */}
                  <p className="bangla-text text-base leading-relaxed text-gray-700 dark:text-dark-text-secondary">
                    {step.descriptionBn}
                  </p>

                  {/* Recitation (ArabicBlock) */}
                  {recitation && (
                    <div className="pt-2">
                      <ArabicBlock
                        title={recitation.titleBn}
                        arabic={recitation.arabic}
                        uccharon={recitation.uccharonBn}
                        banglish={recitation.banglish}
                        meaning={recitation.meaningBn}
                        reference={
                          recitation.reference
                            ? `${recitation.reference.source}${
                                recitation.reference.number
                                  ? ` (${recitation.reference.number})`
                                  : ""
                              }`
                            : undefined
                        }
                      />
                    </div>
                  )}

                  {/* Gender Specific Rules */}
                  {(step.maleRule || step.femaleRule) && (
                    <div className="space-y-2 pt-2">
                      {(genderFilter === "both" ||
                        (genderFilter === "user" &&
                          currentGender === "male")) &&
                        step.maleRule && (
                          <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 dark:border-blue-900/40 dark:bg-blue-950/20">
                            <div className="flex items-start gap-2">
                              <span className="bangla-text font-bold text-xs text-blue-800 dark:text-blue-300 shrink-0 mt-0.5">
                                [পুরুষদের নিয়ম]:
                              </span>
                              <p className="bangla-text text-sm text-blue-900 dark:text-blue-200">
                                {step.maleRule}
                              </p>
                            </div>
                          </div>
                        )}

                      {(genderFilter === "both" ||
                        (genderFilter === "user" &&
                          currentGender === "female")) &&
                        step.femaleRule && (
                          <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3.5 dark:border-rose-900/40 dark:bg-rose-950/20">
                            <div className="flex items-start gap-2">
                              <span className="bangla-text font-bold text-xs text-rose-800 dark:text-rose-300 shrink-0 mt-0.5">
                                [মহিলাদের নিয়ম]:
                              </span>
                              <p className="bangla-text text-sm text-rose-900 dark:text-rose-200">
                                {step.femaleRule}
                              </p>
                            </div>
                          </div>
                        )}
                    </div>
                  )}

                  {/* Step Tips */}
                  {step.tips && (
                    <Callout type="tip" title="প্রয়োজনীয় পরামর্শ">
                      <span className="bangla-text text-sm">{step.tips}</span>
                    </Callout>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
