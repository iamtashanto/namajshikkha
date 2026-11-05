import { Metadata } from "next";
import Link from "next/link";
import { Clock, ArrowLeft, Bell } from "lucide-react";

export const metadata: Metadata = {
  title: "নামাজের সময়সূচী — Prayer Times",
  description: "বাংলাদেশের সকল জেলার ৫ ওয়াক্ত নামাজের সময়সূচী, সেহরি ও ইফতারের সময়। শীঘ্রই আসছে।",
};

export default function PrayerTimesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-b from-emerald-50/50 to-white p-8 text-center shadow-sm dark:border-dark-border dark:from-emerald-950/20 dark:to-dark-card sm:p-12">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/40">
          <Clock className="h-10 w-10 animate-pulse" />
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-100/70 px-3.5 py-1 text-xs font-semibold text-emerald-800 dark:border-emerald-800/40 dark:bg-emerald-950/60 dark:text-emerald-300">
          <Bell className="h-3.5 w-3.5" />
          আসন্ন নতুন ফিচার
        </span>

        <h1 className="bangla-text mt-4 mb-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          নামাজের সময়সূচী
        </h1>

        <p className="bangla-text mx-auto max-w-lg text-base leading-relaxed text-gray-600 dark:text-dark-text-secondary sm:text-lg">
          বাংলাদেশের ৬৪টি জেলার জন্য প্রতিদিনের ৫ ওয়াক্ত নামাজের সঠিক সময়সূচী, তাহাজ্জুদ ও নিষিদ্ধ সময়সহ এই ফিচারটি খুব শীঘ্রই যুক্ত হচ্ছে।
        </p>

        <div className="mt-8 rounded-2xl border border-dashed border-emerald-200 bg-white/60 p-6 dark:border-emerald-800/50 dark:bg-dark-bg/40">
          <p className="bangla-text text-xl font-bold text-emerald-600 dark:text-emerald-400">
            শীঘ্রই আসছে (Coming Soon)
          </p>
          <p className="bangla-text mt-2 text-xs text-gray-500 dark:text-dark-text-muted">
            অফলাইনেও জিপিএস বা জেলা নির্বাচনের মাধ্যমে সঠিক নামাজের ওয়াক্ত ও আজানের অ্যালার্ম সুবিধা থাকবে।
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

