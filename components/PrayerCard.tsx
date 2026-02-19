"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Clock, ExternalLink } from "lucide-react";

interface RakatBreakdown {
    type: string;
    type_en: string;
    count: number;
    color: string;
}

interface PrayerAction {
    action_bn: string;
    action_en?: string;
    arabic?: string;
    bangla_pronunciation?: string;
    note?: string;
    ref?: {
        type: "surah" | "dua";
        id: number;
    };
}

interface PrayerStep {
    rakat_label: string;
    actions: PrayerAction[];
}

interface PrayerData {
    id: number;
    name_bn: string;
    name_en: string;
    name_arabic: string;
    time_bn: string;
    total_rakat: number;
    rakat_breakdown: RakatBreakdown[];
    details_bn: string;
    steps: PrayerStep[];
}

const colorMap: Record<string, { bg: string; text: string; dot: string; border: string }> = {
    emerald: {
        bg: "bg-emerald-100 dark:bg-emerald-900/30",
        text: "text-emerald-700 dark:text-emerald-400",
        dot: "bg-emerald-500",
        border: "border-emerald-200 dark:border-emerald-800/40",
    },
    gold: {
        bg: "bg-amber-100 dark:bg-amber-900/30",
        text: "text-amber-700 dark:text-amber-400",
        dot: "bg-amber-500",
        border: "border-amber-200 dark:border-amber-800/40",
    },
    blue: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-400",
        dot: "bg-blue-500",
        border: "border-blue-200 dark:border-blue-800/40",
    },
    purple: {
        bg: "bg-purple-100 dark:bg-purple-900/30",
        text: "text-purple-700 dark:text-purple-400",
        dot: "bg-purple-500",
        border: "border-purple-200 dark:border-purple-800/40",
    },
};

export default function PrayerCard({ data }: { data: PrayerData }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <article className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-dark-border dark:bg-dark-card">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 sm:px-6"
            >
                {/* Prayer Icon */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-sm sm:h-14 sm:w-14">
                    <span className="text-xl text-white sm:text-2xl">🕌</span>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h2 className="bangla-text text-lg font-bold text-gray-800 dark:text-dark-text sm:text-xl">
                            {data.name_bn}
                        </h2>
                        <span className="arabic-text text-base text-emerald-500 dark:text-emerald-400">
                            {data.name_arabic}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-dark-text-muted">
                        <Clock className="h-3 w-3" />
                        <span className="bangla-text">{data.time_bn}</span>
                    </div>
                </div>

                {/* Rakat Count */}
                <div className="text-center shrink-0">
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {data.total_rakat}
                    </p>
                    <p className="bangla-text text-[10px] text-gray-400 dark:text-dark-text-muted">
                        রাকাত
                    </p>
                </div>

                <ChevronDown
                    className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-300 dark:text-dark-text-muted ${isExpanded ? "rotate-180" : ""}`}
                />
            </button>

            {/* Rakat Breakdown Badges */}
            <div className="flex flex-wrap gap-2 border-t border-emerald-50 px-5 py-3 dark:border-dark-border sm:px-6">
                {data.rakat_breakdown.map((rakat, i) => {
                    const colors = colorMap[rakat.color] || colorMap.emerald;
                    return (
                        <span
                            key={i}
                            className={`bangla-text inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${colors.bg} ${colors.text}`}
                        >
                            <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
                            {rakat.count} {rakat.type}
                        </span>
                    );
                })}
            </div>

            {/* Expanded Content */}
            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"}`}
            >
                {/* Description */}
                <div className="border-t border-emerald-50 bg-emerald-50/30 px-5 py-3 dark:border-dark-border dark:bg-emerald-950/10 sm:px-6">
                    <p className="bangla-text text-sm leading-7 text-gray-600 dark:text-dark-text-secondary">
                        {data.details_bn}
                    </p>
                </div>

                {/* Steps */}
                <div className="border-t border-emerald-50 px-5 py-4 dark:border-dark-border sm:px-6">
                    <h3 className="bangla-text mb-4 text-base font-bold text-gray-700 dark:text-dark-text">
                        📖 ধাপে ধাপে নামাজের নিয়ম
                    </h3>

                    <div className="space-y-5">
                        {data.steps.map((step, stepIndex) => (
                            <div key={stepIndex}>
                                <h4 className="bangla-text mb-3 flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-400">
                                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                                        {stepIndex + 1}
                                    </span>
                                    {step.rakat_label}
                                </h4>

                                <div className="ml-3 space-y-2.5 border-l-2 border-emerald-100 pl-5 dark:border-emerald-800/40">
                                    {step.actions.map((action, actionIndex) => (
                                        <div key={actionIndex} className="relative group/action">
                                            <div className="absolute -left-[25px] top-1.5 h-2 w-2 rounded-full bg-emerald-300 dark:bg-emerald-600" />

                                            <div className="flex flex-wrap items-start justify-between gap-2">
                                                <p className="bangla-text text-sm leading-7 text-gray-600 dark:text-dark-text-secondary">
                                                    {action.action_bn}
                                                </p>

                                                {action.ref && (
                                                    <Link
                                                        href={`/surah-dua#${action.ref.type}-${action.ref.id}`}
                                                        className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-600 transition-colors hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
                                                    >
                                                        <span>সম্পূর্ণ পড়ুন</span>
                                                        <ExternalLink className="h-3 w-3" />
                                                    </Link>
                                                )}
                                            </div>

                                            {action.arabic && (
                                                <div className="mt-1.5 rounded-lg bg-emerald-50/70 px-3 py-2 dark:bg-emerald-950/30 transition-colors group-hover/action:bg-emerald-100/50 dark:group-hover/action:bg-emerald-900/20">
                                                    <p className="arabic-text text-base text-gray-800 dark:text-dark-text">
                                                        {action.arabic}
                                                    </p>
                                                    {action.bangla_pronunciation && (
                                                        <p className="bangla-text mt-1 text-xs text-emerald-600 dark:text-emerald-400">
                                                            {action.bangla_pronunciation}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {action.note && (
                                                <p className="bangla-text mt-1 text-xs text-amber-600 dark:text-amber-400">
                                                    💡 {action.note}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </article>
    );
}
