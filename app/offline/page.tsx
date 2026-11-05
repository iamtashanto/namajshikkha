import { Metadata } from "next";
import Link from "next/link";
import {
  WifiOff,
  BookOpen,
  Sparkles,
  Clock,
  Calendar,
  Droplets,
  ScrollText,
  Home,
} from "lucide-react";

export const metadata: Metadata = {
  title: "অফলাইন মোড — নামাজ শিক্ষা",
  description:
    "আপনি বর্তমানে অফলাইনে আছেন। ক্যাশ করা নামাজের নিয়ম, সিমুলেটর, নামাজের সময়সূচী ও ট্র্যাকার অফলাইনেই ব্যবহার করুন।",
};

const OFFLINE_ROUTES = [
  {
    href: "/",
    label: "হোম পৃষ্ঠা",
    desc: "মূল ড্যাশবোর্ড ও সংক্ষিপ্ত সূচী",
    icon: Home,
  },
  {
    href: "/simulator",
    label: "নামাজ সিমুলেটর",
    desc: "অফলাইন অ্যানিমেটেড নামাজ গাইড",
    icon: Sparkles,
  },
  {
    href: "/prayer-times",
    label: "নামাজের সময়সূচী",
    desc: "১০০% অফলাইন ওয়াক্ত ও কাউন্টডাউন",
    icon: Clock,
  },
  {
    href: "/namaj",
    label: "সকল নামাজের নিয়ম",
    desc: "ফরজ, ওয়াজিব, সুন্নাত ও নফল নামাজ",
    icon: BookOpen,
  },
  {
    href: "/taharat",
    label: "পবিত্রতা ও ওযু",
    desc: "ওযু, গোসল ও তায়াম্মুমের নিয়ম",
    icon: Droplets,
  },
  {
    href: "/surah-dua",
    label: "সূরা ও দোয়া",
    desc: "নামাজের প্রয়োজনীয় সূরা ও দোয়াসমূহ",
    icon: ScrollText,
  },
  {
    href: "/tracker",
    label: "নামাজ ট্র্যাকার",
    desc: "দৈনিক সালাত ও কাযা হিসাব",
    icon: Calendar,
  },
];

export default function OfflinePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-emerald-200 bg-white p-6 text-center shadow-sm sm:p-10 dark:border-dark-border dark:bg-dark-card">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
          <WifiOff className="h-8 w-8" />
        </div>

        <span className="bangla-text mt-4 inline-block rounded-full bg-amber-100 px-3.5 py-1 text-xs font-bold text-amber-900 dark:bg-amber-950 dark:text-amber-200">
          ইন্টারনেট সংযোগ নেই • অফলাইন মোড
        </span>

        <h1 className="bangla-text mt-3 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
          আপনি বর্তমানে অফলাইনে আছেন
        </h1>

        <p className="bangla-text mx-auto mt-2 max-w-xl text-sm leading-relaxed text-gray-600 dark:text-dark-text-secondary">
          এই পৃষ্ঠাটি এখনো আপনার ডিভাইসে অফলাইন ক্যাশে সংরক্ষিত হয়নি। তবে চিন্তা নেই—নিচের মূল বিভাগগুলো ইন্টারনেট ছাড়াই ব্যবহার করা যাবে:
        </p>

        <div className="mt-8 grid gap-3 text-left sm:grid-cols-2">
          {OFFLINE_ROUTES.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3.5 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-3.5 transition-all hover:border-emerald-300 hover:bg-emerald-50 dark:border-dark-border dark:bg-dark-bg dark:hover:border-emerald-700"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="bangla-text truncate text-sm font-bold text-gray-900 dark:text-white">
                    {item.label}
                  </h2>
                  <p className="bangla-text truncate text-xs text-gray-500 dark:text-dark-text-muted">
                    {item.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

