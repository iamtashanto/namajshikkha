"use client";

import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Download, X, Smartphone } from "lucide-react";

export function MobileInstallPrompt() {
  const { isInstallable, shouldPromptUser, installApp, dismissPrompt } =
    usePWAInstall();

  if (!isInstallable || !shouldPromptUser) return null;

  return (
    <div
      role="region"
      aria-label="অ্যাপ ইনস্টল প্রম্পট"
      className="fixed bottom-24 left-4 right-4 z-[70] md:left-auto md:right-6 md:bottom-6 md:w-96"
    >
      <div className="relative overflow-hidden rounded-2xl border border-emerald-200/80 bg-white/95 p-4 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-dark-card/95">
        {/* Background Accent */}
        <div className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full bg-emerald-500/10 blur-2xl" />

        <button
          type="button"
          onClick={dismissPrompt}
          aria-label="প্রম্পট বন্ধ করুন"
          className="absolute right-2 top-2 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/5"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30">
            <Smartphone className="h-6 w-6" />
          </div>
          <div className="flex-1 pr-6">
            <h3 className="bangla-text text-[15px] font-bold text-gray-900 dark:text-dark-text">
              অ্যাপ ইনস্টল করুন
            </h3>
            <p className="bangla-text text-xs text-gray-600 dark:text-dark-text-muted">
              অফলাইনে নামাজ সিমুলেটর, সময়সূচী ও সূরা পড়তে হোমস্ক্রিনে যুক্ত করুন
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={installApp}
          className="bangla-text mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-emerald-700 active:scale-95 dark:bg-emerald-500"
        >
          <Download className="h-4 w-4" />
          <span>অ্যাপ ইনস্টল করুন</span>
        </button>
      </div>
    </div>
  );
}
