"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  PlayCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { PrayerType, PrayerGroup } from "@/src/types/content";
import { Badge, BadgeVariant } from "@/src/components/ui/Badge";
import { Card } from "@/src/components/ui/Card";
import { Callout } from "@/src/components/ui/Callout";

interface PrayerHubClientProps {
  prayers: PrayerType[];
}

const groupMeta: Record<
  PrayerGroup,
  { title: string; subtitle: string; order: number }
> = {
  "daily-fard": {
    title: "দৈনিক ৫ ওয়াক্ত ফরজ নামাজ",
    subtitle: "প্রতিদিন নির্দিষ্ট সময়ে প্রত্যেক প্রাপ্তবয়স্ক মুসলিমের ওপর ফরজ",
    order: 1,
  },
  wajib: {
    title: "ওয়াজিব নামাজ",
    subtitle: "ফরজের নিকটবর্তী অপরিহার্য সালাত (যেমন বিতর)",
    order: 2,
  },
  "jumuah-eid": {
    title: "জুমআ ও দুই ঈদের নামাজ",
    subtitle: "সাপ্তাহিক ও বাৎসরিক জামাআতের সালাত",
    order: 3,
  },
  janaza: {
    title: "জানাজার নামাজ",
    subtitle: "মৃত মুসলিমের মাগফিরাতের জন্য ফরযে কিফায়া সালাত",
    order: 4,
  },
  "sunnah-nafl": {
    title: "সুন্নাত ও নফল নামাজ",
    subtitle: "অতিরিক্ত সাওয়াব ও আত্মিক উন্নতির জন্য মোস্তাহাব নামাজসমূহ",
    order: 5,
  },
  special: {
    title: "বিশেষ সালাত ও বিধান",
    subtitle: "বিশেষ প্রয়োজন ও পরিস্থিতিতে আদায়যোগ্য সালাত ও কসর/কাযার নিয়ম",
    order: 6,
  },
};

const categoryBadgeMap: Record<
  string,
  { variant: BadgeVariant; label: string }
> = {
  fard: { variant: "fard", label: "ফরজ" },
  wajib: { variant: "wajib", label: "ওয়াজিব" },
  "sunnah-muakkadah": { variant: "sunnah", label: "সুন্নাতে মুয়াক্কাদাহ" },
  "sunnah-ghair-muakkadah": {
    variant: "sunnah",
    label: "সুন্নাতে গায়রে মুয়াক্কাদাহ",
  },
  nafl: { variant: "nafl", label: "নফল" },
  special: { variant: "gold", label: "বিশেষ বিধান" },
};

export function PrayerHubClient({ prayers }: PrayerHubClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");

  // Filter prayers
  const filteredPrayers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return prayers.filter((prayer) => {
      // Group filter
      if (selectedGroup !== "all" && prayer.group !== selectedGroup) {
        return false;
      }

      // Search filter
      if (!query) return true;

      const matchNameBn = prayer.nameBn.toLowerCase().includes(query);
      const matchNameAr = prayer.nameAr.toLowerCase().includes(query);
      const matchNameEn = prayer.nameEn.toLowerCase().includes(query);
      const matchTime = prayer.timeDescriptionBn.toLowerCase().includes(query);

      return matchNameBn || matchNameAr || matchNameEn || matchTime;
    });
  }, [prayers, searchQuery, selectedGroup]);

  // Group filtered prayers
  const groupedPrayers = useMemo(() => {
    const groups: { [key in PrayerGroup]?: PrayerType[] } = {};

    for (const prayer of filteredPrayers) {
      if (!groups[prayer.group]) {
        groups[prayer.group] = [];
      }
      groups[prayer.group]!.push(prayer);
    }

    return Object.entries(groups).sort(
      ([a], [b]) =>
        (groupMeta[a as PrayerGroup]?.order || 99) -
        (groupMeta[b as PrayerGroup]?.order || 99)
    );
  }, [filteredPrayers]);

  return (
    <div className="space-y-8">
      {/* Search and Category Filter Toolbar */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-emerald-600 dark:text-emerald-400">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="নামাজের নাম বা ওয়াক্ত দিয়ে খুঁজুন (যেমন: ফজর, জুমআ, তাহাজ্জুদ, জানাজা)..."
            className="bangla-text w-full rounded-2xl border border-emerald-200/90 bg-white py-3.5 pl-11 pr-4 text-sm text-gray-900 shadow-xs transition-colors placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-dark-border dark:bg-dark-card dark:text-white dark:placeholder:text-dark-text-muted dark:focus:border-emerald-500"
          />
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedGroup("all")}
            className={`bangla-text whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all ${
              selectedGroup === "all"
                ? "bg-emerald-600 text-white shadow-xs font-semibold"
                : "bg-white border border-emerald-100 text-gray-700 hover:bg-emerald-50 dark:border-dark-border dark:bg-dark-card dark:text-dark-text-secondary dark:hover:bg-dark-card-hover"
            }`}
          >
            সকল নামাজ ({prayers.length})
          </button>

          {(
            Object.entries(groupMeta) as [
              PrayerGroup,
              (typeof groupMeta)[PrayerGroup]
            ][]
          )
            .sort(([, a], [, b]) => a.order - b.order)
            .map(([groupKey, meta]) => {
              const count = prayers.filter((p) => p.group === groupKey).length;
              const isSelected = selectedGroup === groupKey;

              return (
                <button
                  key={groupKey}
                  type="button"
                  onClick={() => setSelectedGroup(groupKey)}
                  className={`bangla-text whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-emerald-600 text-white shadow-xs font-semibold"
                      : "bg-white border border-emerald-100 text-gray-700 hover:bg-emerald-50 dark:border-dark-border dark:bg-dark-card dark:text-dark-text-secondary dark:hover:bg-dark-card-hover"
                  }`}
                >
                  {meta.title} ({count})
                </button>
              );
            })}
        </div>
      </div>

      {/* Prayers Listing by Group */}
      {groupedPrayers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 p-12 text-center dark:border-dark-border">
          <p className="bangla-text text-base text-gray-600 dark:text-dark-text-secondary">
            &ldquo;{searchQuery}&rdquo; দিয়ে কোনো নামাজ পাওয়া যায়নি।
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedGroup("all");
            }}
            className="bangla-text mt-3 text-sm font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
          >
            ফিল্টার রিসেট করুন
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {groupedPrayers.map(([groupKey, prayerList]) => {
            const meta = groupMeta[groupKey as PrayerGroup];

            return (
              <section key={groupKey} className="space-y-4">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-emerald-100 pb-3 dark:border-dark-border">
                  <div>
                    <h2 className="bangla-text text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                      {meta?.title}
                    </h2>
                    <p className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted mt-0.5">
                      {meta?.subtitle}
                    </p>
                  </div>
                  <span className="bangla-text text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    {prayerList?.length} টি সালাত
                  </span>
                </div>

                {/* Grid of Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {prayerList?.map((prayer) => {
                    const badgeInfo =
                      categoryBadgeMap[prayer.category] || {
                        variant: "neutral" as BadgeVariant,
                        label: prayer.category,
                      };

                    return (
                      <Card
                        key={prayer.slug}
                        className="group flex flex-col justify-between p-5 transition-all hover:border-emerald-300 hover:shadow-md dark:hover:border-emerald-700/60"
                      >
                        <div>
                          {/* Card Top: Badges and Arabic */}
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <Badge variant={badgeInfo.variant} dot>
                              {badgeInfo.label}
                            </Badge>
                            <span className="arabic-text text-xl font-bold text-emerald-700 dark:text-emerald-400">
                              {prayer.nameAr}
                            </span>
                          </div>

                          {/* Card Title & English */}
                          <h3 className="bangla-text text-xl font-bold text-gray-900 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400 transition-colors">
                            {prayer.nameBn}
                          </h3>
                          <p className="text-xs font-medium text-gray-500 dark:text-dark-text-muted mb-3">
                            {prayer.nameEn}
                          </p>

                          {/* Rakats Summary Badge */}
                          <div className="mb-3 flex items-center gap-1.5 text-xs text-gray-700 dark:text-dark-text-secondary">
                            <Clock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span className="bangla-text font-semibold text-emerald-800 dark:text-emerald-300">
                              {prayer.slug === "janaza"
                                ? "৪ তাকবীর (দাঁড়িয়ে)"
                                : `মোট ${prayer.totalRakats} রাকাত`}
                            </span>
                          </div>

                          {/* Time window preview */}
                          <p className="bangla-text text-xs line-clamp-2 text-gray-600 dark:text-dark-text-secondary leading-relaxed mb-4">
                            {prayer.timeDescriptionBn}
                          </p>

                          {/* Rakat Units Mini Chips */}
                          <div className="flex flex-wrap gap-1 mb-5">
                            {prayer.rakatUnits.map((unit, idx) => (
                              <span
                                key={idx}
                                className="bangla-text text-[11px] rounded-md bg-emerald-50/90 px-2 py-0.5 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40"
                              >
                                {unit.label}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Card Bottom Actions */}
                        <div className="flex items-center gap-2 pt-3 border-t border-emerald-100/70 dark:border-dark-border">
                          <Link
                            href={`/namaj/${prayer.slug}`}
                            className="bangla-text flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <span>বিস্তারিত নিয়ম</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>

                          <Link
                            href={`/simulator?prayer=${prayer.slug}`}
                            title="সিমুলেটরে দেখুন"
                            className="inline-flex items-center justify-center rounded-xl border border-emerald-200 bg-white p-2 text-emerald-700 transition-colors hover:bg-emerald-50 dark:border-dark-border dark:bg-dark-card dark:text-emerald-400 dark:hover:bg-dark-card-hover"
                          >
                            <PlayCircle className="h-4 w-4" />
                          </Link>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Helpful Companion Links */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-6">
        <Link
          href="/namaj-rules"
          className="group rounded-2xl border border-emerald-100/90 bg-gradient-to-br from-emerald-50/70 to-white p-5 shadow-xs transition-all hover:border-emerald-300 hover:shadow-md dark:border-dark-border dark:from-emerald-950/20 dark:to-dark-card"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="bangla-text text-base font-bold text-gray-900 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
                ধাপে ধাপে সাধারণ নামাজের নিয়ম
              </h3>
              <p className="bangla-text text-xs text-gray-600 dark:text-dark-text-secondary mt-1">
                তাকবীর থেকে সালাম পর্যন্ত প্রতিটি রুকন, রুকু, সেজদা ও দোয়ার ক্রমিক বিবরণ।
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/namaj-details"
          className="group rounded-2xl border border-amber-100/90 bg-gradient-to-br from-amber-50/70 to-white p-5 shadow-xs transition-all hover:border-amber-300 hover:shadow-md dark:border-dark-border dark:from-amber-950/20 dark:to-dark-card"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-600 text-white shadow-xs">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="bangla-text text-base font-bold text-gray-900 group-hover:text-amber-700 dark:text-white dark:group-hover:text-amber-400">
                ৫ ওয়াক্ত নামাজের রাকাতের পূর্ণ হিসাব
              </h3>
              <p className="bangla-text text-xs text-gray-600 dark:text-dark-text-secondary mt-1">
                কোন ওয়াক্তে কয় রাকাত ফরজ, সুন্নাত, নফল ও বিতর—এক নজরে টেবিল ও বিবরণ।
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Hanafi Madhab Reference Note */}
      <Callout type="hanafi" title="হানাফি ফিকহ ও সহীহ রেফারেন্স">
        এই ডিরেক্টরিতে প্রতিটি নামাজের জন্য বাংলাদেশে অনুসৃত নির্ভরযোগ্য <strong>হানাফি ফিকহ</strong> এবং সহীহ হাদিসের দলীল সন্নিবেশ করা হয়েছে। পুরুষ ও মহিলাদের নামাজের প্রয়োজনীয় পার্থক্যসমূহ সুস্পষ্টভাবে তুলে ধরা হয়েছে।
      </Callout>
    </div>
  );
}
