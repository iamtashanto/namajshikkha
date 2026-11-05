"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Award, RotateCcw } from "lucide-react";
import SurahCard from "@/components/SurahCard";
import SearchBar from "@/components/SearchBar";
import { Breadcrumbs } from "@/src/components/ui";
import { getSurahCardItems } from "@/src/data/surah-dua-items";
import { getDueSurahIds, getAllHifzRecords } from "@/src/lib/hifz/storage";
import { prayerSurahs } from "@/src/data/surahs";
import { HifzRecord } from "@/src/lib/hifz/types";

type TabType = "all" | "surah" | "dua";

export default function SurahDuaPage() {
    const [activeTab, setActiveTab] = useState<TabType>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [dueSurahs, setDueSurahs] = useState<{ id: string; nameBn: string; stage: number }[]>([]);

    useEffect(() => {
        let cancelled = false;
        async function checkDue() {
            try {
                const dueIds = await getDueSurahIds();
                const all = await getAllHifzRecords();
                if (cancelled) return;
                const list = dueIds.map((id) => {
                    const found = prayerSurahs.find((s) => s.id === id);
                    const rec: HifzRecord | undefined = all[id];
                    return {
                        id,
                        nameBn: found ? found.nameBn : id,
                        stage: rec?.stage || 1,
                    };
                });
                setDueSurahs(list);
            } catch {
                // Ignore
            }
        }
        checkDue();
        return () => {
            cancelled = true;
        };
    }, []);

    const allItems = useMemo(() => getSurahCardItems(), []);
    const surahCount = useMemo(() => allItems.filter(i => i.category === "surah").length, [allItems]);
    const duaCount = useMemo(() => allItems.filter(i => i.category === "dua").length, [allItems]);

    const filteredItems = allItems.filter((item) => {
        const matchesTab =
            activeTab === "all" || item.category === activeTab;
        const matchesSearch =
            searchQuery === "" ||
            item.title_bn.includes(searchQuery) ||
            item.title_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.banglish.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const tabs: { key: TabType; label: string; count: number }[] = [
        { key: "all", label: "সবগুলো", count: allItems.length },
        { key: "surah", label: "সূরা", count: surahCount },
        { key: "dua", label: "দোয়া", count: duaCount },
    ];

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
            {/* Breadcrumb Navigation */}
            <Breadcrumbs items={[{ label: "সূরা ও দোয়া" }]} />

            {/* Page Header */}
            <div className="mb-8 text-center">
                <h1 className="bangla-text mb-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                    <span className="bg-gradient-to-r from-gold-500 to-gold-700 bg-clip-text text-transparent dark:from-gold-400 dark:to-gold-600">
                        সূরা ও দোয়া
                    </span>
                </h1>
                <p className="bangla-text mx-auto max-w-xl text-gray-500 dark:text-dark-text-secondary">
                    নামাজে পড়ার সূরা ও দোয়াসমূহ — আরবি, বাংলা উচ্চারণ, ব্যাংলিশ ও
                    বাংলা অর্থসহ
                </p>

                {/* Hifz Mode Navigation Button */}
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <Link
                        href="/surah-dua/surah-1/hifz"
                        className="bangla-text inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-200 hover:shadow-lg dark:shadow-emerald-950/40"
                    >
                        <Sparkles className="h-4 w-4" />
                        <span>সূরা হিফজ ও মুখস্থ অনুশীলন মোড (Hifz Mode)</span>
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>

            {/* Spaced Repetition Due List Banner */}
            {dueSurahs.length > 0 && (
                <div className="mb-6 rounded-3xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5 dark:border-amber-900/40 dark:bg-amber-950/30">
                    <div className="flex items-center gap-2 mb-2">
                        <RotateCcw className="h-4 w-4 text-amber-600 animate-spin" />
                        <h2 className="bangla-text text-sm font-bold text-amber-900 dark:text-amber-200">
                            আজকের হিফজ রিভিশন তালিকা (Spaced Repetition Due):
                        </h2>
                    </div>
                    <p className="bangla-text text-xs text-amber-800 dark:text-amber-300 mb-3">
                        স্পেসড রিপিটেশন অ্যালগরিদম অনুযায়ী নিচের সূরাগুলোর আজ রিভিশন দেওয়ার সময় হয়েছে:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {dueSurahs.map((s) => (
                            <Link
                                key={s.id}
                                href={`/surah-dua/${s.id}/hifz`}
                                className="bangla-text inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-white px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100 dark:border-amber-800 dark:bg-dark-card dark:text-amber-200"
                            >
                                <Award className="h-3.5 w-3.5 text-amber-600" />
                                <span>সূরা {s.nameBn}</span>
                                <span className="text-[10px] text-amber-600">
                                    (ধাপ {s.stage})
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="mb-6">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="সূরা বা দোয়া অনুসন্ধান করুন..."
                />
            </div>

            {/* Tabs */}
            <div className="mb-8 flex gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`bangla-text rounded-xl px-4 py-2 text-sm font-medium transition-all ${activeTab === tab.key
                            ? "bg-emerald-600 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/30"
                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40"
                            }`}
                    >
                        {tab.label}
                        <span className="ml-1.5 text-xs opacity-70">({tab.count})</span>
                    </button>
                ))}
            </div>

            {/* Cards Grid */}
            <div className="space-y-6">
                {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                        <div key={`${item.category}-${item.id}`} id={`${item.category}-${item.id}`} className="scroll-mt-24">
                            <SurahCard data={item} playlist={filteredItems} />
                        </div>
                    ))
                ) : (
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 py-16 text-center dark:border-dark-border dark:bg-dark-card">
                        <p className="bangla-text text-lg text-gray-400 dark:text-dark-text-muted">
                            কোনো ফলাফল পাওয়া যায়নি
                        </p>
                        <p className="mt-1 text-sm text-gray-300 dark:text-dark-text-muted">
                            অন্য কিছু অনুসন্ধান করুন
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
