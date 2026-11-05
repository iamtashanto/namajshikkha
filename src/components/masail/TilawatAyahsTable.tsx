import React from "react";
import { BookOpen } from "lucide-react";
import { TilawatAyah } from "@/src/types/content";

interface TilawatAyahsTableProps {
  ayahs: TilawatAyah[];
}

export function TilawatAyahsTable({ ayahs }: TilawatAyahsTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-200/90 bg-white shadow-xs dark:border-dark-border dark:bg-dark-card">
      <div className="border-b border-emerald-100 bg-emerald-50/70 p-4 sm:p-5 dark:border-dark-border dark:bg-dark-card-hover flex items-center gap-2.5">
        <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        <div>
          <h3 className="bangla-text text-base sm:text-lg font-bold text-gray-900 dark:text-white">
            পবিত্র কুরআনের ১৪টি সিজদার আয়াতের পূর্ণ তালিকা
          </h3>
          <p className="bangla-text text-xs text-gray-600 dark:text-dark-text-muted">
            হানাফি ফিকহ অনুযায়ী নিম্নোক্ত যেকোনো আয়াত তিলাওয়াত করলে বা শ্রবণ করলে সিজদায়ে তিলাওয়াত ওয়াজিব হয়:
          </p>
        </div>
      </div>

      <div className="divide-y divide-emerald-100 dark:divide-dark-border">
        {ayahs.map((ayah) => (
          <div key={ayah.serial} className="p-4 sm:p-5 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs">
                  {ayah.serial}
                </span>
                <span className="bangla-text font-bold text-sm sm:text-base text-gray-900 dark:text-white">
                  {ayah.surahNameBn}
                </span>
                <span className="arabic-text text-sm text-emerald-700 dark:text-emerald-400">
                  ({ayah.surahNameAr})
                </span>
              </div>
              <span className="bangla-text text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100/70 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                আয়াত নং {ayah.ayahRef}
              </span>
            </div>

            {/* Arabic Text */}
            <p className="arabic-text text-xl sm:text-2xl leading-relaxed text-right text-emerald-950 dark:text-emerald-300 pt-1 font-amiri">
              {ayah.textAr}
            </p>

            {/* Bangla Meaning */}
            <p className="bangla-text text-xs sm:text-sm text-gray-700 dark:text-dark-text-secondary leading-relaxed pt-1 border-t border-emerald-50 dark:border-dark-border/50">
              <strong className="text-gray-900 dark:text-white">অর্থ:</strong> {ayah.meaningBn}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

