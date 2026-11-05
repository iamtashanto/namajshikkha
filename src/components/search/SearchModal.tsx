"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Compass,
  BookOpen,
  HelpCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Flame,
} from "lucide-react";
import { useSearch } from "@/src/context/SearchContext";
import {
  searchSite,
  SearchCategoryKey,
  SearchResultItem,
} from "@/src/lib/search";

const QUICK_SUGGESTIONS = [
  { label: "জানাজার নামাজ", query: "জানাজা" },
  { label: "তাহাজ্জুদ নামাজ", query: "তাহাজ্জুদ" },
  { label: "বিতর ও দোয়া কুনুত", query: "বিতর" },
  { label: "সেজদায়ে সাহু", query: "সেজদায়ে সাহু" },
  { label: "অজুর ৪ ফরজ", query: "অজু" },
  { label: "আয়াতুল কুরসী", query: "আয়াতুল কুরসী" },
  { label: "কিবলা কম্পাস", query: "কিবলা" },
  { label: "নামাজের সময়সূচী", query: "নামাজের সময়সূচী" },
  { label: "কাযা নামাজ ট্র্যাকার", query: "কাযা" },
];

const CATEGORY_TABS: { key: "all" | SearchCategoryKey; label: string }[] = [
  { key: "all", label: "সকল" },
  { key: "prayer", label: "নামাজ" },
  { key: "masail", label: "মাসায়েল" },
  { key: "surah", label: "সূরা" },
  { key: "dua", label: "দোয়া" },
  { key: "taharat", label: "তাহারাত" },
  { key: "tool", label: "টুলস" },
  { key: "hadith_faq", label: "হাদিস ও FAQ" },
];

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const terms = query
    .trim()
    .split(/\s+/)
    .filter((t) => t.length > 1);
  if (terms.length === 0) return text;

  try {
    const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const regex = new RegExp(`(${escaped.join("|")})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark
          key={i}
          className="bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 font-semibold rounded px-0.5"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  } catch {
    return text;
  }
}

export function SearchModal() {
  const { isSearchOpen, closeSearch } = useSearch();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | SearchCategoryKey>("all");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleClose = useCallback(() => {
    setQuery("");
    setActiveCategory("all");
    closeSearch();
  }, [closeSearch]);

  // Focus input on open
  useEffect(() => {
    if (isSearchOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  // Execute in-memory search
  const rawResults = useMemo(() => {
    if (!query.trim()) return [];
    return searchSite(query, 10);
  }, [query]);

  // Filter by category tab
  const filteredGroups = useMemo(() => {
    if (activeCategory === "all") return rawResults;
    return rawResults.filter((g) => g.categoryKey === activeCategory);
  }, [rawResults, activeCategory]);

  const totalResultsCount = useMemo(() => {
    return filteredGroups.reduce((acc, g) => acc + g.items.length, 0);
  }, [filteredGroups]);

  if (!isSearchOpen) return null;

  const handleSelectResult = (url: string) => {
    handleClose();
    router.push(url);
  };

  const getCategoryIcon = (key: SearchCategoryKey) => {
    switch (key) {
      case "prayer":
        return <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
      case "tool":
        return <Compass className="h-4 w-4 text-teal-600 dark:text-teal-400" />;
      case "hadith_faq":
        return <HelpCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
      default:
        return <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 pt-12 sm:pt-20 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-dark-card border border-emerald-100 dark:border-dark-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Search Input */}
        <div className="relative flex items-center border-b border-gray-100 dark:border-dark-border px-4 py-3.5 bg-emerald-50/40 dark:bg-dark-card-hover/40">
          <Search className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            id="search-modal-title"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="খুঁজুন... (যেমন: জানাজা, তাহাজ্জুদ, সেজদায়ে সাহু, অজু)"
            className="w-full bg-transparent text-gray-800 dark:text-dark-text placeholder:text-gray-400 dark:placeholder:text-dark-text-muted text-base sm:text-lg focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              title="মুছে ফেলুন"
              aria-label="মুছে ফেলুন"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <span className="hidden sm:inline-block text-[11px] font-mono px-2 py-0.5 rounded border border-gray-200 dark:border-dark-border text-gray-400 dark:text-dark-text-muted">
              ESC
            </span>
          )}
        </div>

        {/* Category Tabs (shown when searching) */}
        {query.trim().length > 0 && rawResults.length > 0 && (
          <div className="flex items-center gap-1.5 px-4 py-2 border-b border-gray-100 dark:border-dark-border overflow-x-auto no-scrollbar bg-gray-50/50 dark:bg-dark-bg/40">
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeCategory === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveCategory(tab.key)}
                  className={`text-xs px-2.5 py-1 rounded-lg shrink-0 transition-colors ${
                    isActive
                      ? "bg-emerald-600 text-white font-medium shadow-sm"
                      : "text-gray-600 dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-dark-card-hover"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* 1. Empty State: Suggestions */}
          {!query.trim() && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
                <Flame className="h-3.5 w-3.5 text-amber-500" />
                <span>জনপ্রিয় ও দ্রুত অনুসন্ধান</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {QUICK_SUGGESTIONS.map((item) => (
                  <button
                    key={item.query}
                    onClick={() => setQuery(item.query)}
                    className="text-xs px-3 py-1.5 rounded-xl border border-emerald-100 dark:border-dark-border bg-emerald-50/50 dark:bg-dark-card-hover text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/80 dark:hover:bg-emerald-950/60 transition-all text-left flex items-center gap-1.5"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="h-3 w-3 opacity-60" />
                  </button>
                ))}
              </div>

              {/* Quick Navigation Links */}
              <div className="pt-4 border-t border-gray-100 dark:border-dark-border">
                <span className="text-xs font-medium text-gray-500 dark:text-dark-text-muted">
                  গুরুত্বপূর্ণ ফিচারসমূহ:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                  <button
                    onClick={() => handleSelectResult("/simulator")}
                    className="p-2.5 rounded-xl border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-card hover:border-emerald-300 dark:hover:border-emerald-600 text-left transition-colors flex items-center gap-2"
                  >
                    <BookOpen className="h-4 w-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-gray-800 dark:text-dark-text">নামাজ সিমুলেটর</div>
                      <div className="text-[10px] text-gray-400 dark:text-dark-text-muted">অ্যানিমেশন সহ</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleSelectResult("/prayer-times")}
                    className="p-2.5 rounded-xl border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-card hover:border-emerald-300 dark:hover:border-emerald-600 text-left transition-colors flex items-center gap-2"
                  >
                    <Clock className="h-4 w-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-gray-800 dark:text-dark-text">নামাজের সময়সূচী</div>
                      <div className="text-[10px] text-gray-400 dark:text-dark-text-muted">৬৪ জেলা</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleSelectResult("/qibla")}
                    className="p-2.5 rounded-xl border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-card hover:border-emerald-300 dark:hover:border-emerald-600 text-left transition-colors flex items-center gap-2"
                  >
                    <Compass className="h-4 w-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-gray-800 dark:text-dark-text">কিবলা কম্পাস</div>
                      <div className="text-[10px] text-gray-400 dark:text-dark-text-muted">কাবার দিক</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. No Results State */}
          {query.trim() && totalResultsCount === 0 && (
            <div className="text-center py-10 space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                <Search className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-dark-text">
                &ldquo;{query}&rdquo; এর কোনো ফলাফল পাওয়া যায়নি
              </p>
              <p className="text-xs text-gray-500 dark:text-dark-text-muted max-w-sm mx-auto">
                অনুগ্রহ করে বাংলা, ইংরেজি বা বাংলিশে অন্য কোনো শব্দ দিয়ে চেষ্টা করুন (যেমন: janaza, witr, অজু, তারাবীহ)।
              </p>
            </div>
          )}

          {/* 3. Result Groups */}
          {query.trim() &&
            filteredGroups.map((group) => (
              <div key={group.categoryKey} className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 pb-1 border-b border-gray-100 dark:border-dark-border">
                  {getCategoryIcon(group.categoryKey)}
                  <span>{group.categoryLabelBn}</span>
                  <span className="ml-auto text-[10px] font-normal px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300">
                    {group.items.length} টি ফলাফল
                  </span>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-dark-border">
                  {group.items.map((item: SearchResultItem) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelectResult(item.url)}
                      className="w-full text-left py-2.5 px-2 rounded-xl hover:bg-emerald-50/60 dark:hover:bg-dark-card-hover transition-colors group flex items-start justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900 dark:text-dark-text group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                            {highlightText(item.titleBn, query)}
                          </span>
                          {item.titleAr && (
                            <span className="font-arabic text-xs text-emerald-700/80 dark:text-emerald-400/80">
                              {item.titleAr}
                            </span>
                          )}
                          <span className="text-[10px] text-gray-400 dark:text-dark-text-muted">
                            ({item.titleEn})
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-dark-text-secondary line-clamp-1 leading-relaxed">
                          {highlightText(item.snippetBn, query)}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-300 dark:text-dark-text-muted group-hover:text-emerald-600 dark:group-hover:text-emerald-400 shrink-0 mt-1 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
        </div>

        {/* Footer shortcuts info */}
        <div className="px-4 py-2.5 border-t border-gray-100 dark:border-dark-border bg-gray-50/60 dark:bg-dark-bg/60 text-[11px] text-gray-500 dark:text-dark-text-muted flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>ক্লিক করে বিস্তারিত দেখুন</span>
            <span>•</span>
            <span>হিন্দ ও বাংলা সব ভাষায় প্রযোজ্য</span>
          </div>
          <button
            onClick={handleClose}
            className="hover:text-gray-700 dark:hover:text-gray-300"
          >
            বন্ধ করুন [ESC]
          </button>
        </div>
      </div>
    </div>
  );
}
export default SearchModal;
