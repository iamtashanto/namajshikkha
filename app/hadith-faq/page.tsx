"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import hadiths from "@/data/hadiths.json";
import faqs from "@/data/faqs.json";
import { ChevronDown, BookHeart, MessageCircleQuestion } from "lucide-react";

type ViewType = "hadith" | "faq";

export default function HadithFaqPage() {
    const [view, setView] = useState<ViewType>("hadith");
    const [searchQuery, setSearchQuery] = useState("");
    const [openFaqId, setOpenFaqId] = useState<number | null>(null);

    const filteredHadiths = hadiths.filter(
        (h) =>
            searchQuery === "" ||
            h.title_bn.includes(searchQuery) ||
            h.title_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
            h.text_bn.includes(searchQuery)
    );

    const filteredFaqs = faqs.filter(
        (f) =>
            searchQuery === "" ||
            f.question_bn.includes(searchQuery) ||
            f.question_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
            f.answer_bn.includes(searchQuery)
    );

    return (
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
            {/* Page Header */}
            <div className="mb-10 text-center">
                <h1 className="bangla-text mb-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400">
                        হাদিস ও প্রশ্নোত্তর
                    </span>
                </h1>
                <p className="bangla-text mx-auto max-w-xl text-gray-500 dark:text-dark-text-secondary">
                    নামাজ সম্পর্কিত সহীহ হাদিস এবং সচরাচর জিজ্ঞাসিত প্রশ্নের উত্তর
                </p>
            </div>

            {/* Search */}
            <div className="mb-6">
                <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="হাদিস বা প্রশ্ন অনুসন্ধান করুন..."
                />
            </div>

            {/* Toggle */}
            <div className="mb-8 flex gap-2">
                <button
                    onClick={() => { setView("hadith"); setSearchQuery(""); }}
                    className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${view === "hadith"
                            ? "bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/30"
                            : "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
                        }`}
                >
                    <BookHeart className="h-4 w-4" />
                    <span className="bangla-text">হাদিস</span>
                    <span className="text-xs opacity-70">({hadiths.length})</span>
                </button>
                <button
                    onClick={() => { setView("faq"); setSearchQuery(""); }}
                    className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${view === "faq"
                            ? "bg-purple-600 text-white shadow-md shadow-purple-200 dark:shadow-purple-900/30"
                            : "bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/40"
                        }`}
                >
                    <MessageCircleQuestion className="h-4 w-4" />
                    <span className="bangla-text">প্রশ্নোত্তর</span>
                    <span className="text-xs opacity-70">({faqs.length})</span>
                </button>
            </div>

            {/* Hadith View */}
            {view === "hadith" && (
                <div className="space-y-5">
                    {filteredHadiths.length > 0 ? (
                        filteredHadiths.map((hadith) => (
                            <article
                                key={hadith.id}
                                className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-blue-200 dark:border-dark-border dark:bg-dark-card dark:hover:border-blue-800/50 sm:p-6"
                            >
                                <div className="mb-3 flex items-start justify-between gap-3">
                                    <h2 className="bangla-text text-lg font-bold text-gray-800 dark:text-dark-text">
                                        {hadith.title_bn}
                                    </h2>
                                    <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                        {hadith.category === "namaj" ? "নামাজ" : hadith.category === "quran" ? "কুরআন" : hadith.category}
                                    </span>
                                </div>

                                <blockquote className="bangla-text mb-4 border-l-3 border-blue-300 pl-4 text-sm leading-7 text-gray-600 dark:border-blue-600 dark:text-dark-text-secondary sm:text-base">
                                    {hadith.text_bn}
                                </blockquote>

                                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 dark:text-dark-text-muted">
                                    <span className="bangla-text">
                                        📖 বর্ণনাকারী: <strong className="text-gray-500 dark:text-dark-text-secondary">{hadith.narrator_bn}</strong>
                                    </span>
                                    <span className="hidden sm:inline">•</span>
                                    <span className="bangla-text">
                                        📚 সূত্র: <strong className="text-gray-500 dark:text-dark-text-secondary">{hadith.source}</strong>
                                    </span>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 py-16 text-center dark:border-dark-border dark:bg-dark-card">
                            <p className="bangla-text text-lg text-gray-400 dark:text-dark-text-muted">কোনো হাদিস পাওয়া যায়নি</p>
                        </div>
                    )}
                </div>
            )}

            {/* FAQ View */}
            {view === "faq" && (
                <div className="space-y-3">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq) => (
                            <div
                                key={faq.id}
                                className="overflow-hidden rounded-xl border border-purple-100 bg-white transition-all dark:border-dark-border dark:bg-dark-card"
                            >
                                <button
                                    onClick={() =>
                                        setOpenFaqId(openFaqId === faq.id ? null : faq.id)
                                    }
                                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-purple-50/50 dark:hover:bg-purple-900/10"
                                >
                                    <h3 className="bangla-text text-sm font-semibold text-gray-700 dark:text-dark-text sm:text-base">
                                        {faq.question_bn}
                                    </h3>
                                    <ChevronDown
                                        className={`h-4.5 w-4.5 shrink-0 text-purple-400 transition-transform duration-300 dark:text-purple-500 ${openFaqId === faq.id ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaqId === faq.id ? "max-h-96" : "max-h-0"
                                        }`}
                                >
                                    <div className="border-t border-purple-50 bg-purple-50/30 px-5 py-4 dark:border-dark-border dark:bg-purple-950/20">
                                        <p className="bangla-text text-sm leading-7 text-gray-600 dark:text-dark-text-secondary">
                                            {faq.answer_bn}
                                        </p>
                                        <p className="mt-3 text-xs leading-6 text-gray-400 italic dark:text-dark-text-muted">
                                            {faq.answer_en}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="rounded-2xl border border-purple-100 bg-purple-50/50 py-16 text-center dark:border-dark-border dark:bg-dark-card">
                            <p className="bangla-text text-lg text-gray-400 dark:text-dark-text-muted">কোনো প্রশ্ন পাওয়া যায়নি</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
