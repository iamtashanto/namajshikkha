"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Circle,
  RotateCcw,
  Sparkles,
  ListOrdered,
  CheckSquare,
  Award,
} from "lucide-react";
import { TaharatStep } from "@/src/types/content";
import { Badge, Callout, ArabicBlock, ReferenceChip } from "@/src/components/ui";
import { TaharatIllustration } from "./TaharatIllustration";
import { prayerDuas } from "@/src/data";
import { toBengaliNumber } from "@/src/lib/bengali";

interface WuduChecklistGuideProps {
  steps: TaharatStep[];
}

export function WuduChecklistGuide({ steps }: WuduChecklistGuideProps) {
  const [isChecklistMode, setIsChecklistMode] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  const resetAll = () => {
    setCompletedSteps({});
  };

  const totalSteps = steps.length;
  const completedCount = steps.filter((s) => completedSteps[s.stepNumber]).length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);
  const isAllCompleted = completedCount === totalSteps && totalSteps > 0;

  return (
    <div className="space-y-6">
      {/* Mode Switcher & Progress Bar Header */}
      <div className="flex flex-col gap-4 rounded-3xl border border-emerald-200 bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-card sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h3 className="bangla-text text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            ধাপে ধাপে অজুর ধারাবাহিক আমল
          </h3>
          <p className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted mt-1">
            {isChecklistMode
              ? "অজু করার সময় প্রতিটি ধাপ সম্পন্ন করে টিক দিন"
              : "ধারাবাহিক নিয়ম দেখে শিখুন অথবা চেকলিস্ট মোড চালু করুন"}
          </p>
        </div>

        {/* Toggle Mode Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsChecklistMode(!isChecklistMode)}
            className={`bangla-text inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all ${
              isChecklistMode
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-950/40"
                : "border border-emerald-300 bg-emerald-50/70 text-emerald-800 hover:bg-emerald-100 dark:border-dark-border dark:bg-dark-card dark:text-emerald-300"
            }`}
          >
            {isChecklistMode ? (
              <>
                <ListOrdered className="h-4 w-4" />
                <span>সাধারণ নির্দেশিকা দেখুন</span>
              </>
            ) : (
              <>
                <CheckSquare className="h-4 w-4" />
                <span>চেকলিস্ট মোড চালু করুন</span>
              </>
            )}
          </button>

          {isChecklistMode && completedCount > 0 && (
            <button
              type="button"
              onClick={resetAll}
              title="পুনরায় শুরু করুন"
              className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-dark-border dark:text-dark-text-muted dark:hover:bg-dark-card-hover"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar (Always shown in Checklist Mode) */}
      {isChecklistMode && (
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 dark:border-dark-border dark:bg-dark-card/60">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="bangla-text text-emerald-800 dark:text-emerald-300">
              অজু সম্পন্নকরণ অগ্রগতি: {toBengaliNumber(completedCount)} / {toBengaliNumber(totalSteps)} ধাপ
            </span>
            <span className="bangla-text text-emerald-700 dark:text-emerald-400">
              {toBengaliNumber(progressPercent)}%
            </span>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-950/50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Completion Banner */}
          {isAllCompleted && (
            <div className="mt-4 rounded-xl border border-emerald-300 bg-emerald-100/90 p-3 text-center dark:border-emerald-800 dark:bg-emerald-950/60 animate-fade-in-up">
              <div className="flex items-center justify-center gap-2">
                <Award className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                <span className="bangla-text text-sm font-bold text-emerald-900 dark:text-emerald-100">
                  আলহামদুলিল্লাহ! আপনার অজু সফলভাবে সম্পন্ন হয়েছে।
                </span>
              </div>
              <p className="bangla-text text-xs text-emerald-800 dark:text-emerald-300 mt-1">
                এবার আপনি পবিত্র মনে সালাতে দাঁড়ানোর জন্য প্রস্তুত।
              </p>
            </div>
          )}
        </div>
      )}

      {/* Steps List */}
      <div className="space-y-6">
        {steps.map((step) => {
          const isDone = !!completedSteps[step.stepNumber];
          const duaRecitation = step.recitationId
            ? prayerDuas.find((d) => d.id === step.recitationId)
            : step.recitationCustom;

          return (
            <div
              key={step.stepNumber}
              className={`rounded-3xl border transition-all duration-300 ${
                isDone && isChecklistMode
                  ? "border-emerald-400 bg-emerald-50/40 shadow-sm dark:border-emerald-700/60 dark:bg-emerald-950/10"
                  : "border-emerald-100 bg-white shadow-sm hover:border-emerald-200 hover:shadow-md dark:border-dark-border dark:bg-dark-card"
              }`}
            >
              <div className="p-5 sm:p-7">
                {/* Step Top Bar: Number + Badges + Checklist Tap */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    {/* In checklist mode: interactive tap target */}
                    {isChecklistMode ? (
                      <button
                        type="button"
                        onClick={() => toggleStep(step.stepNumber)}
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                          isDone
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/40"
                            : "border-2 border-emerald-300 bg-emerald-50/70 text-emerald-700 hover:bg-emerald-100 dark:border-dark-border dark:bg-dark-card dark:text-emerald-400"
                        }`}
                        aria-label={`ধাপ ${toBengaliNumber(step.stepNumber)} সম্পন্ন চিহ্নিত করুন`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="h-6 w-6" />
                        ) : (
                          <Circle className="h-6 w-6 stroke-[2]" />
                        )}
                      </button>
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-sm font-bold text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/40">
                        {toBengaliNumber(step.stepNumber)}
                      </div>
                    )}

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="bangla-text text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                          ধাপ {toBengaliNumber(step.stepNumber)}
                        </span>
                        {step.isFard && (
                          <Badge variant="fard" dot>
                            ফরজ
                          </Badge>
                        )}
                        {step.isSunnah && (
                          <Badge variant="sunnah">সুন্নাত</Badge>
                        )}
                      </div>
                      <h4
                        className={`bangla-text text-lg font-bold sm:text-xl mt-0.5 ${
                          isDone && isChecklistMode
                            ? "text-emerald-900 line-through decoration-emerald-500/60 dark:text-emerald-200"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {step.titleBn}
                      </h4>
                      <p className="text-xs font-medium text-gray-400 dark:text-dark-text-muted">
                        {step.titleEn}
                      </p>
                    </div>
                  </div>

                  {step.reference && (
                    <div className="hidden sm:block">
                      <ReferenceChip reference={step.reference} />
                    </div>
                  )}
                </div>

                {/* Step Body Grid: Illustration + Text */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-center">
                  {/* Illustration Slot */}
                  <div className="md:col-span-1">
                    <TaharatIllustration
                      name={step.illustrationKey}
                      className="h-36 sm:h-40 w-full"
                      title={step.titleBn}
                    />
                  </div>

                  {/* Description & Details */}
                  <div className="md:col-span-2 space-y-4">
                    <p className="bangla-text text-sm leading-relaxed text-gray-700 dark:text-dark-text-secondary sm:text-base">
                      {step.descriptionBn}
                    </p>

                    {/* Step Tips / Fiqh Note */}
                    {step.tipsBn && (
                      <Callout type="tip" title="জরুরি টিপস ও সতর্কতা">
                        {step.tipsBn}
                      </Callout>
                    )}

                    {/* Mobile Reference Chip */}
                    {step.reference && (
                      <div className="sm:hidden pt-1">
                        <ReferenceChip reference={step.reference} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Dua Recitation Block if step has recitation */}
                {duaRecitation && (
                  <div className="mt-5 border-t border-emerald-100 pt-5 dark:border-dark-border">
                    <ArabicBlock
                      id={`wudu-step-${step.stepNumber}`}
                      title={duaRecitation.titleBn}
                      arabic={duaRecitation.arabic}
                      uccharon={duaRecitation.uccharonBn}
                      banglish={duaRecitation.banglish}
                      meaning={duaRecitation.meaningBn}
                      reference={duaRecitation.reference?.source}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
