"use client";

import { useState } from "react";
import { Metadata } from "next";
import SurahCard from "@/components/SurahCard";
import SearchBar from "@/components/SearchBar";
import surahs from "@/data/surahs.json";
import duas from "@/data/duas.json";

type TabType = "all" | "surah" | "dua";

export default function SurahDuaPage() {
    const [activeTab, setActiveTab] = useState<TabType>("all");
    const [searchQuery, setSearchQuery] = useState("");

    const allItems = [...surahs, ...duas];

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
        { key: "surah", label: "সূরা", count: surahs.length },
        { key: "dua", label: "দোয়া", count: duas.length },
    ];

    return (
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
            {/* Page Header */}
            <div className="mb-10 text-center">
                <h1 className="bangla-text mb-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                    <span className="bg-gradient-to-r from-gold-500 to-gold-700 bg-clip-text text-transparent">
                        সূরা ও দোয়া
                    </span>
                </h1>
                <p className="bangla-text mx-auto max-w-xl text-gray-500">
                    নামাজে পড়ার সূরা ও দোয়াসমূহ — আরবি, বাংলা উচ্চারণ, ব্যাংলিশ ও
                    বাংলা অর্থসহ
                </p>
            </div>

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
                                ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
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
                        <SurahCard key={`${item.category}-${item.id}`} data={item} />
                    ))
                ) : (
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 py-16 text-center">
                        <p className="bangla-text text-lg text-gray-400">
                            কোনো ফলাফল পাওয়া যায়নি
                        </p>
                        <p className="mt-1 text-sm text-gray-300">
                            অন্য কিছু অনুসন্ধান করুন
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
