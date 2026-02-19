"use client";

import { useState, useMemo } from "react";
import SearchBar from "@/components/SearchBar";
import HistoryTimelineCard from "@/components/HistoryTimelineCard";
import historyData from "@/data/islamic-history.json";

const colorBadgeMap: Record<string, string> = {
    slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-700",
    emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-700",
    red: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-700",
    purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-700",
    rose: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-700",
    orange: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-700",
    teal: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 border-teal-200 dark:border-teal-700",
    cyan: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300 border-cyan-200 dark:border-cyan-700",
};

const colorDotMap: Record<string, string> = {
    slate: "bg-slate-500", amber: "bg-amber-500", emerald: "bg-emerald-500",
    blue: "bg-blue-500", red: "bg-red-500", purple: "bg-purple-500",
    rose: "bg-rose-500", orange: "bg-orange-500", teal: "bg-teal-500", cyan: "bg-cyan-500",
};

export default function IslamicHistoryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedEra, setSelectedEra] = useState<string>("all");

    const totalEvents = historyData.reduce((sum, era) => sum + era.events.length, 0);

    const filteredData = useMemo(() => {
        return historyData
            .filter(era => selectedEra === "all" || era.id === selectedEra)
            .map(era => ({
                ...era,
                events: era.events.filter(event => {
                    if (!searchQuery) return true;
                    const q = searchQuery.toLowerCase();
                    return (
                        event.title_bn.includes(searchQuery) ||
                        event.title_en.toLowerCase().includes(q) ||
                        event.description_bn.includes(searchQuery) ||
                        event.year.includes(searchQuery)
                    );
                })
            }))
            .filter(era => era.events.length > 0);
    }, [searchQuery, selectedEra]);

    return (
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
            {/* Header */}
            <div className="mb-10 text-center">
                <p className="arabic-text mb-3 text-xl text-emerald-500/60 dark:text-emerald-400/40">
                    تَارِيخُ الْإِسْلَامِ
                </p>
                <h1 className="bangla-text mb-3 text-3xl font-bold sm:text-4xl">
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400">
                        ইসলামের ইতিহাস
                    </span>
                </h1>
                <p className="bangla-text mx-auto max-w-2xl text-gray-500 dark:text-dark-text-secondary">
                    প্রাক-ইসলামী যুগ থেকে আধুনিক বিশ্ব — ইসলামের সম্পূর্ণ ইতিহাস একনজরে
                </p>
            </div>

            {/* Stats */}
            <div className="mb-6 grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 text-center dark:border-dark-border dark:bg-dark-card">
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{historyData.length}</p>
                    <p className="bangla-text text-xs text-gray-400 dark:text-dark-text-muted">যুগ / কালপর্ব</p>
                </div>
                <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3 text-center dark:border-dark-border dark:bg-dark-card">
                    <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{totalEvents}</p>
                    <p className="bangla-text text-xs text-gray-400 dark:text-dark-text-muted">ঐতিহাসিক ঘটনা</p>
                </div>
                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3 text-center dark:border-dark-border dark:bg-dark-card">
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">১৪০০+</p>
                    <p className="bangla-text text-xs text-gray-400 dark:text-dark-text-muted">বছরের ইতিহাস</p>
                </div>
            </div>

            {/* Search */}
            <div className="mb-5">
                <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="ঘটনা অনুসন্ধান করুন... (নাম বা বছর)" />
            </div>

            {/* Era Filter */}
            <div className="mb-8 flex flex-wrap gap-2">
                <button
                    onClick={() => setSelectedEra("all")}
                    className={`bangla-text rounded-xl border px-3 py-1.5 text-xs font-medium transition-all ${selectedEra === "all"
                        ? "border-emerald-500 bg-emerald-600 text-white shadow-md"
                        : "border-gray-200 bg-white text-gray-500 hover:border-emerald-200 dark:border-dark-border dark:bg-dark-card dark:text-dark-text-muted"}`}
                >
                    সবগুলো
                </button>
                {historyData.map(era => (
                    <button
                        key={era.id}
                        onClick={() => setSelectedEra(era.id)}
                        className={`bangla-text rounded-xl border px-3 py-1.5 text-xs font-medium transition-all ${selectedEra === era.id
                            ? `border-transparent shadow-md ${colorBadgeMap[era.color] || ""}`
                            : "border-gray-200 bg-white text-gray-500 hover:border-emerald-200 dark:border-dark-border dark:bg-dark-card dark:text-dark-text-muted"}`}
                    >
                        {era.icon} {era.name_bn}
                    </button>
                ))}
            </div>

            {/* Timeline */}
            {filteredData.length > 0 ? (
                <div className="space-y-10">
                    {filteredData.map(era => (
                        <section key={era.id}>
                            {/* Era Header */}
                            <div className="mb-5 flex items-center gap-3">
                                <span className="text-2xl">{era.icon}</span>
                                <div>
                                    <h2 className="bangla-text text-lg font-bold text-gray-800 dark:text-dark-text">
                                        {era.name_bn}
                                    </h2>
                                    <p className="text-xs text-gray-400 dark:text-dark-text-muted">
                                        {era.name_en} • {era.period} • {era.events.length} ঘটনা
                                    </p>
                                </div>
                            </div>

                            {/* Era Description */}
                            <p className="bangla-text mb-4 rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-2.5 text-sm leading-7 text-gray-500 dark:border-dark-border dark:bg-dark-card dark:text-dark-text-secondary">
                                {era.description_bn}
                            </p>

                            {/* Events Timeline */}
                            <div className="relative">
                                {/* Vertical line */}
                                <div className={`absolute left-[5px] top-0 h-full w-0.5 md:left-1/2 md:-translate-x-1/2 ${colorDotMap[era.color] || "bg-gray-200"} opacity-20`} />

                                <div className="space-y-3">
                                    {era.events.map((event, idx) => (
                                        <HistoryTimelineCard key={idx} era={era} eventIndex={idx} event={event} />
                                    ))}
                                </div>
                            </div>
                        </section>
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-gray-100 bg-gray-50/50 py-16 text-center dark:border-dark-border dark:bg-dark-card">
                    <p className="bangla-text text-lg text-gray-400 dark:text-dark-text-muted">কোনো ঘটনা পাওয়া যায়নি</p>
                </div>
            )}

            {/* Footer Quote */}
            <div className="mt-12 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white p-6 text-center dark:border-emerald-800/40 dark:from-emerald-950/30 dark:to-dark-card">
                <p className="arabic-text mb-3 text-lg text-emerald-600 dark:text-emerald-400">
                    لَقَدْ كَانَ فِي قَصَصِهِمْ عِبْرَةٌ لِّأُولِي الْأَلْبَابِ
                </p>
                <p className="bangla-text text-sm text-gray-500 dark:text-dark-text-muted">
                    &quot;নিশ্চয়ই তাদের কাহিনীতে বুদ্ধিমানদের জন্য শিক্ষা রয়েছে।&quot; — সূরা ইউসুফ ১২:১১১
                </p>
            </div>
        </div>
    );
}
