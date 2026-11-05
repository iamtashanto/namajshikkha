import { Metadata } from "next";
import Link from "next/link";
import { PlayCircle, ArrowLeft, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "নামাজ সিমুলেটর — Interactive Namaj Simulator",
  description: "ধাপে ধাপে অ্যানিমেশন, উচ্চারণ এবং অডিওসহ ইন্টারঅ্যাক্টিভ নামাজ সিমুলেটর। শীঘ্রই আসছে।",
};

export default function SimulatorPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-b from-emerald-50/50 to-white p-8 text-center shadow-sm dark:border-dark-border dark:from-emerald-950/20 dark:to-dark-card sm:p-12">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/40">
          <PlayCircle className="h-10 w-10 animate-pulse" />
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-100/70 px-3.5 py-1 text-xs font-semibold text-emerald-800 dark:border-emerald-800/40 dark:bg-emerald-950/60 dark:text-emerald-300">
          <Sparkles className="h-3.5 w-3.5" />
          প্রধান আপগ্রেড ফিচার
        </span>

        <h1 className="bangla-text mt-4 mb-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          ইন্টারঅ্যাক্টিভ নামাজ সিমুলেটর
        </h1>

        <p className="bangla-text mx-auto max-w-lg text-base leading-relaxed text-gray-600 dark:text-dark-text-secondary sm:text-lg">
          অ্যানিমেটেড ফিগারের মাধ্যমে প্রতিটি নামাজের ধাপ, তাকবীর, রুকু, সেজদা, পুরুষ ও মহিলার পার্থক্যের ভিজ্যুয়াল গাইডেন্স আসছে।
        </p>

        <div className="mt-8 rounded-2xl border border-dashed border-emerald-200 bg-white/60 p-6 dark:border-emerald-800/50 dark:bg-dark-bg/40">
          <p className="bangla-text text-xl font-bold text-emerald-600 dark:text-emerald-400">
            শীঘ্রই আসছে (Coming Soon)
          </p>
          <p className="bangla-text mt-2 text-xs text-gray-500 dark:text-dark-text-muted">
            হানাফি মাজহাবের নির্ভুল নিয়ম অনুসারে প্রতিটি অঙ্গভঙ্গির সঠিক প্রদর্শনী।
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/namaj-rules"
            className="bangla-text inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-md shadow-emerald-200 transition-all hover:bg-emerald-700 hover:shadow-lg dark:shadow-emerald-900/30"
          >
            <ArrowLeft className="h-4 w-4" />
            নামাজের সাধারণ নিয়ম দেখুন
          </Link>
        </div>
      </div>
    </div>
  );
}

