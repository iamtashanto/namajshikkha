"use client";

import { useState, useMemo } from "react";
import SearchBar from "@/components/SearchBar";
import QuranSurahCard from "@/components/QuranSurahCard";
import allSurahs from "@/data/all-surahs.json";

type FilterType = "all" | "meccan" | "medinan";

export default function QuranPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<FilterType>("all");

    const filteredSurahs = useMemo(() => {
        return allSurahs.filter((surah) => {
            const matchesFilter =
                filter === "all" ||
                (filter === "meccan" && surah.revelation_type === "মাক্কী") ||
                (filter === "medinan" && surah.revelation_type === "মাদানী");

            const q = searchQuery.toLowerCase();
            const matchesSearch =
                searchQuery === "" ||
                surah.name_bangla.includes(searchQuery) ||
                surah.name_english.toLowerCase().includes(q) ||
                surah.name_banglish.toLowerCase().includes(q) ||
                surah.name_arabic.includes(searchQuery) ||
                String(surah.number) === searchQuery;

            return matchesFilter && matchesSearch;
        });
    }, [searchQuery, filter]);

    const meccanCount = allSurahs.filter(s => s.revelation_type === "মাক্কী").length;
    const medinanCount = allSurahs.filter(s => s.revelation_type === "মাদানী").length;

    const filters: { key: FilterType; label: string; count: number }[] = [
        { key: "all", label: "সবগুলো", count: allSurahs.length },
        { key: "meccan", label: "মাক্কী", count: meccanCount },
        { key: "medinan", label: "মাদানী", count: medinanCount },
    ];

    return (
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
            {/* Page Header */}
            <div className="mb-10 text-center">
                <p className="arabic-text mb-3 text-xl text-emerald-500/60 dark:text-emerald-400/40">
                    الْقُرْآنُ الْكَرِيمُ
                </p>
                <h1 className="bangla-text mb-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                    <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400">
                        কুরআনের সূরাসমূহ
                    </span>
                </h1>
                <p className="bangla-text mx-auto max-w-xl text-gray-500 dark:text-dark-text-secondary">
                    পবিত্র কুরআনের সম্পূর্ণ ১১৪টি সূরা — সূরা তিলাওয়াত শুনুন
                </p>
            </div>

            {/* Stats Bar */}
            <div className="mb-6 grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 text-center dark:border-dark-border dark:bg-dark-card">
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">১১৪</p>
                    <p className="bangla-text text-xs text-gray-400 dark:text-dark-text-muted">মোট সূরা</p>
                </div>
                <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3 text-center dark:border-dark-border dark:bg-dark-card">
                    <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{meccanCount}</p>
                    <p className="bangla-text text-xs text-gray-400 dark:text-dark-text-muted">মাক্কী সূরা</p>
                </div>
                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3 text-center dark:border-dark-border dark:bg-dark-card">
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{medinanCount}</p>
                    <p className="bangla-text text-xs text-gray-400 dark:text-dark-text-muted">মাদানী সূরা</p>
                </div>
            </div>

            {/* Search */}
            <div className="mb-5">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="সূরা অনুসন্ধান করুন... (নাম বা নম্বর)"
                />
            </div>

            {/* Filter Tabs */}
            <div className="mb-6 flex gap-2">
                {filters.map((f) => (
                    <button
                        key={f.key}
                        onClick={() => setFilter(f.key)}
                        className={`bangla-text rounded-xl px-4 py-2 text-sm font-medium transition-all ${filter === f.key
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/30"
                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40"
                            }`}
                    >
                        {f.label}
                        <span className="ml-1.5 text-xs opacity-70">({f.count})</span>
                    </button>
                ))}
            </div>

            {/* Surahs List */}
            <div className="space-y-3">
                {filteredSurahs.length > 0 ? (
                    filteredSurahs.map((surah) => (
                        <QuranSurahCard key={surah.number} data={surah} />
                    ))
                ) : (
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 py-16 text-center dark:border-dark-border dark:bg-dark-card">
                        <p className="bangla-text text-lg text-gray-400 dark:text-dark-text-muted">
                            কোনো সূরা পাওয়া যায়নি
                        </p>
                        <p className="mt-1 text-sm text-gray-300 dark:text-dark-text-muted">
                            অন্য কিছু অনুসন্ধান করুন
                        </p>
                    </div>
                )}
            </div>

            {/* Footer Note */}
            <div className="mt-10 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white p-5 text-center dark:border-emerald-800/40 dark:from-emerald-950/30 dark:to-dark-card">
                <p className="bangla-text text-sm text-gray-500 dark:text-dark-text-muted">
                    🔊 অডিও সোর্স: <strong className="text-emerald-600 dark:text-emerald-400">mp3quran.net</strong> —
                    ক্বারী মিশারী রশিদ আল-আফাসীর তিলাওয়াত
                </p>
                <p className="mt-1 text-xs text-gray-400 dark:text-dark-text-muted">
                    ফ্রি ও ওপেন সোর্স
                </p>
            </div>
        </div>
    );
}
