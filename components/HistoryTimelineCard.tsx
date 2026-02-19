"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface HistoryEvent {
    year: string;
    title_bn: string;
    title_en: string;
    description_bn: string;
    significance_bn: string;
}

interface HistoryEra {
    id: string;
    name_bn: string;
    name_en: string;
    period: string;
    color: string;
    icon: string;
    description_bn: string;
    events: HistoryEvent[];
}

const colorMap: Record<string, { accent: string; bg: string; text: string; border: string; badge: string; dot: string }> = {
    slate: { accent: "from-slate-500 to-slate-700", bg: "bg-slate-50 dark:bg-slate-900/20", text: "text-slate-600 dark:text-slate-400", border: "border-slate-200 dark:border-slate-700", badge: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300", dot: "bg-slate-500" },
    amber: { accent: "from-amber-500 to-amber-700", bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-600 dark:text-amber-400", border: "border-amber-200 dark:border-amber-700", badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300", dot: "bg-amber-500" },
    emerald: { accent: "from-emerald-500 to-emerald-700", bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-700", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300", dot: "bg-emerald-500" },
    blue: { accent: "from-blue-500 to-blue-700", bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-600 dark:text-blue-400", border: "border-blue-200 dark:border-blue-700", badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300", dot: "bg-blue-500" },
    red: { accent: "from-red-500 to-red-700", bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-600 dark:text-red-400", border: "border-red-200 dark:border-red-700", badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300", dot: "bg-red-500" },
    purple: { accent: "from-purple-500 to-purple-700", bg: "bg-purple-50 dark:bg-purple-900/20", text: "text-purple-600 dark:text-purple-400", border: "border-purple-200 dark:border-purple-700", badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300", dot: "bg-purple-500" },
    rose: { accent: "from-rose-500 to-rose-700", bg: "bg-rose-50 dark:bg-rose-900/20", text: "text-rose-600 dark:text-rose-400", border: "border-rose-200 dark:border-rose-700", badge: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300", dot: "bg-rose-500" },
    orange: { accent: "from-orange-500 to-orange-700", bg: "bg-orange-50 dark:bg-orange-900/20", text: "text-orange-600 dark:text-orange-400", border: "border-orange-200 dark:border-orange-700", badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300", dot: "bg-orange-500" },
    teal: { accent: "from-teal-500 to-teal-700", bg: "bg-teal-50 dark:bg-teal-900/20", text: "text-teal-600 dark:text-teal-400", border: "border-teal-200 dark:border-teal-700", badge: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300", dot: "bg-teal-500" },
    cyan: { accent: "from-cyan-500 to-cyan-700", bg: "bg-cyan-50 dark:bg-cyan-900/20", text: "text-cyan-600 dark:text-cyan-400", border: "border-cyan-200 dark:border-cyan-700", badge: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300", dot: "bg-cyan-500" },
};

export default function HistoryTimelineCard({ era, eventIndex, event }: { era: HistoryEra; eventIndex: number; event: HistoryEvent }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const colors = colorMap[era.color] || colorMap.emerald;
    const isLeft = eventIndex % 2 === 0;

    return (
        <div className={`relative flex w-full items-start gap-4 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}>
            {/* Timeline dot */}
            <div className="absolute left-5 top-3 z-10 hidden h-4 w-4 -translate-x-1/2 rounded-full border-[3px] border-white shadow-sm dark:border-dark-bg md:left-1/2 md:block">
                <div className={`h-full w-full rounded-full ${colors.dot}`} />
            </div>
            {/* Mobile dot */}
            <div className={`relative z-10 mt-3 flex h-3 w-3 shrink-0 rounded-full md:hidden ${colors.dot}`} />

            {/* Card */}
            <div className={`flex-1 md:w-[calc(50%-2rem)] ${isLeft ? "md:pr-10" : "md:pl-10"}`}>
                <article
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`cursor-pointer overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:bg-dark-card ${colors.border}`}
                >
                    <div className="px-4 py-3">
                        <div className="flex items-start gap-3">
                            <span className={`mt-0.5 shrink-0 rounded-lg px-2 py-0.5 text-xs font-bold ${colors.badge}`}>
                                {event.year}
                            </span>
                            <div className="flex-1 min-w-0">
                                <h3 className="bangla-text text-sm font-bold text-gray-800 dark:text-dark-text leading-6">
                                    {event.title_bn}
                                </h3>
                                <p className="text-[11px] text-gray-400 dark:text-dark-text-muted">{event.title_en}</p>
                            </div>
                            <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                        </div>
                    </div>

                    <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
                        <div className={`border-t px-4 py-3 ${colors.border}`}>
                            <p className="bangla-text text-sm leading-7 text-gray-600 dark:text-dark-text-secondary">
                                {event.description_bn}
                            </p>
                        </div>
                        <div className={`border-t px-4 py-3 ${colors.bg} ${colors.border}`}>
                            <p className={`bangla-text text-xs font-medium ${colors.text}`}>
                                ✦ গুরুত্ব: {event.significance_bn}
                            </p>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    );
}
