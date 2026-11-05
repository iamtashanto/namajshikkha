"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Ruling, RulingCategory } from "@/src/types/content";
import { Badge, BadgeVariant } from "@/src/components/ui/Badge";
import { Card } from "@/src/components/ui/Card";
import { Callout } from "@/src/components/ui/Callout";

interface MasailHubClientProps {
  rulings: Ruling[];
}

const categoryMeta: Record<
  RulingCategory,
  { label: string; description: string; order: number }
> = {
  fundamentals: {
    label: "নামাজের মূল ভিত্তি",
    description: "শর্ত, আরকান, ওয়াজিব ও সুন্নাতসমূহ",
    order: 1,
  },
  "mistakes-corrections": {
    label: "ভুলত্রুটি ও সমাধান",
    description: "নামাজ ভঙ্গের কারণ, মাকরূহাত ও সিজদায়ে সাহু",
    order: 2,
  },
  congregation: {
    label: "জামাত ও ইমামত",
    description: "কাতার বিন্যাস, ইমামতির শর্ত ও মাসবূকের নিয়ম",
    order: 3,
  },
  "special-circumstances": {
    label: "বিশেষ পরিস্থিতি ও সফর",
    description: "নিষিদ্ধ সময়, কাযা, মুসাফির, অসুস্থ ব্যক্তি ও বাহনে নামাজ",
    order: 4,
  },
  "lifestyle-etiquette": {
    label: "আদব ও জীবনবিধান",
    description: "সন্তানকে নামাজ শিক্ষা ও প্রাত্যহিক জীবনের আদব",
    order: 5,
  },
};

const statusBadgeMap: Record<string, { variant: BadgeVariant; label: string }> = {
  fard: { variant: "fard", label: "ফরজ বিধান" },
  wajib: { variant: "wajib", label: "ওয়াজিব বিধান" },
  sunnah: { variant: "sunnah", label: "সুন্নাত" },
  mustahab: { variant: "mustahab", label: "মুস্তাহাব ও আদব" },
  makruh: { variant: "gold", label: "মাকরূহাত" },
  haram: { variant: "gold", label: "মুফসিদাত / হারাম" },
};

export function MasailHubClient({ rulings }: MasailHubClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredRulings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return rulings.filter((ruling) => {
      if (selectedCategory !== "all" && ruling.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;

      const titleMatch = ruling.titleBn.toLowerCase().includes(q);
      const enMatch = ruling.titleEn.toLowerCase().includes(q);
      const summaryMatch = ruling.summaryBn.toLowerCase().includes(q);

      return titleMatch || enMatch || summaryMatch;
    });
  }, [rulings, searchQuery, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Search and Category Filter */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-emerald-600 dark:text-emerald-400">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="মাসায়েল অনুসন্ধান করুন (যেমন: সিজদায়ে সাহু, মুসাফির, নিষিদ্ধ সময়, কাযা, জামাত)..."
            className="bangla-text w-full rounded-2xl border border-emerald-200/90 bg-white py-3.5 pl-11 pr-4 text-sm text-gray-900 shadow-xs transition-colors placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-dark-border dark:bg-dark-card dark:text-white dark:placeholder:text-dark-text-muted"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`bangla-text whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all ${
              selectedCategory === "all"
                ? "bg-emerald-600 text-white shadow-xs font-semibold"
                : "bg-white border border-emerald-100 text-gray-700 hover:bg-emerald-50 dark:border-dark-border dark:bg-dark-card dark:text-dark-text-secondary dark:hover:bg-dark-card-hover"
            }`}
          >
            সকল বিষয় ({rulings.length})
          </button>

          {(
            Object.entries(categoryMeta) as [
              RulingCategory,
              (typeof categoryMeta)[RulingCategory]
            ][]
          )
            .sort(([, a], [, b]) => a.order - b.order)
            .map(([catKey, meta]) => {
              const count = rulings.filter((r) => r.category === catKey).length;
              const isSelected = selectedCategory === catKey;

              return (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => setSelectedCategory(catKey)}
                  className={`bangla-text whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-emerald-600 text-white shadow-xs font-semibold"
                      : "bg-white border border-emerald-100 text-gray-700 hover:bg-emerald-50 dark:border-dark-border dark:bg-dark-card dark:text-dark-text-secondary dark:hover:bg-dark-card-hover"
                  }`}
                >
                  {meta.label} ({count})
                </button>
              );
            })}
        </div>
      </div>

      {/* Rulings Grid */}
      {filteredRulings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center dark:border-dark-border">
          <p className="bangla-text text-base text-gray-600 dark:text-dark-text-secondary">
            &ldquo;{searchQuery}&rdquo; বিষয়ে কোনো মাসায়েল পাওয়া যায়নি।
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="bangla-text mt-3 text-sm font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
          >
            ফিল্টার রিসেট করুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRulings.map((ruling) => {
            const badge = statusBadgeMap[ruling.status] || {
              variant: "neutral" as BadgeVariant,
              label: ruling.status,
            };

            return (
              <Card
                key={ruling.id}
                className="group flex flex-col justify-between p-5 transition-all hover:border-emerald-300 hover:shadow-md dark:hover:border-emerald-700/60"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge variant={badge.variant} dot>
                      {badge.label}
                    </Badge>
                    {ruling.decisionTree && (
                      <span className="bangla-text text-[11px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-800/40 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        ইন্টারেক্টিভ হেল্পার
                      </span>
                    )}
                    {ruling.tilawatAyahs && (
                      <span className="bangla-text text-[11px] font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800/40">
                        ১৪ সিজদার আয়াত
                      </span>
                    )}
                  </div>

                  <h3 className="bangla-text text-lg sm:text-xl font-bold text-gray-900 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400 transition-colors">
                    {ruling.titleBn}
                  </h3>
                  <p className="text-xs font-medium text-gray-500 dark:text-dark-text-muted mb-3">
                    {ruling.titleEn}
                  </p>

                  <p className="bangla-text text-xs text-gray-600 dark:text-dark-text-secondary leading-relaxed line-clamp-3 mb-4">
                    {ruling.summaryBn}
                  </p>
                </div>

                <div className="pt-3 border-t border-emerald-100/70 dark:border-dark-border">
                  <Link
                    href={`/masail/${ruling.slug}`}
                    className="bangla-text inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <span>বিস্তারিত বিধান পড়ুন</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Hanafi Fiqh Reference Callout */}
      <Callout type="hanafi" title="হানাফি ফিকহের বিশুদ্ধ ফতোয়া">
        এই মাসায়েল বিভাগের প্রতিটি বিষয় বাংলাদেশে প্রচলিত প্রামাণ্য <strong>হানাফি ফিকহ</strong> (আল-হিদায়া, রদ্দুল মুহতার/ফাতাওয়ায়ে শামী, ফাতাওয়ায়ে আলমগীরী) এবং বিশুদ্ধ হাদিসের সনদ অনুযায়ী সংকলিত হয়েছে।
      </Callout>
    </div>
  );
}
