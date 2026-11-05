import { Metadata } from "next";
import Link from "next/link";
import { BookMarked, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "নামাজের মাসায়েল ও বিধান — Masail",
  description: "নামাজের ওয়াজিবাত, সুন্নাত, অযু, তায়াম্মুম, সেজদায়ে সাহু, কাজা ও বিশেষ নামাজের মাসায়েল। শীঘ্রই আসছে।",
};

export default function MasailPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-b from-emerald-50/50 to-white p-8 text-center shadow-sm dark:border-dark-border dark:from-emerald-950/20 dark:to-dark-card sm:p-12">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/40">
          <BookMarked className="h-10 w-10 animate-pulse" />
        </div>

        <h1 className="bangla-text mt-4 mb-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          নামাজের যাবতীয় মাসায়েল
        </h1>

        <p className="bangla-text mx-auto max-w-lg text-base leading-relaxed text-gray-600 dark:text-dark-text-secondary sm:text-lg">
          তাহরাত (অযু, গোসল, তায়াম্মুম), সেজদায়ে সাহু, মাসবুক, কাজা নামাজ, মুসাফিরের নামাজ ও অসুস্থ ব্যক্তির নামাজের হানাফি ফিকহের নির্ভরযোগ্য বিধানাবলী আসছে।
        </p>

        <div className="mt-8 rounded-2xl border border-dashed border-emerald-200 bg-white/60 p-6 dark:border-emerald-800/50 dark:bg-dark-bg/40">
          <p className="bangla-text text-xl font-bold text-emerald-600 dark:text-emerald-400">
            শীঘ্রই আসছে (Coming Soon)
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="bangla-text inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-emerald-200 transition-all hover:bg-emerald-700 hover:shadow-lg dark:shadow-emerald-900/30"
          >
            <ArrowLeft className="h-4 w-4" />
            হোমে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}

