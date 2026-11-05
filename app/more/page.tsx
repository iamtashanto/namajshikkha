import { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  ListChecks,
  Sparkles,
  ScrollText,
  BookOpenCheck,
  BookMarked,
  Clock,
  Landmark,
  BookHeart,
} from "lucide-react";

export const metadata: Metadata = {
  title: "সকল সূচী ও মেনু — More Sections",
  description: "নামাজ শিক্ষার সকল বিভাগ, সূরা, দোয়া, হাদিস, ইতিহাস ও সেটিংস এক নজরে।",
};

const allSections = [
  { href: "/namaj-rules", label: "নামাজের নিয়ম", desc: "ধাপে ধাপে নামাজ শেখা", icon: BookOpen, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400" },
  { href: "/namaj-details", label: "নামাজের বিবরণ", desc: "কোন নামাজ কত রাকাত ও নিয়ম", icon: ListChecks, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400" },
  { href: "/simulator", label: "নামাজ সিমুলেটর", desc: "অ্যানিমেটেড নামাজ গাইড", icon: Sparkles, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400" },
  { href: "/surah-dua", label: "সূরা ও দোয়া", desc: "প্রয়োজনীয় সূরা ও দোয়াসমূহ", icon: ScrollText, color: "text-gold-600 bg-gold-50 dark:bg-gold-950/40 dark:text-gold-400" },
  { href: "/quran", label: "কুরআন মাজীদ", desc: "১১৪টি সূরার তালিকা ও অডিও", icon: BookOpenCheck, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400" },
  { href: "/masail", label: "নামাজের মাসায়েল", desc: "তাহরাত, কাজা, সেজদায়ে সাহু", icon: BookMarked, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400" },
  { href: "/prayer-times", label: "নামাজের সময়সূচী", desc: "প্রতিদিনের ৫ ওয়াক্ত নামাজের সময়", icon: Clock, color: "text-teal-600 bg-teal-50 dark:bg-teal-950/40 dark:text-teal-400" },
  { href: "/islamic-history", label: "ইসলামিক ইতিহাস", desc: "৫৮টি ঐতিহাসিক ঘটনা", icon: Landmark, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-400" },
  { href: "/hadith-faq", label: "হাদিস ও প্রশ্নোত্তর", desc: "সহীহ হাদিস ও নামাজ FAQ", icon: BookHeart, color: "text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400" },
];

export default function MorePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8">
        <h1 className="bangla-text text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          সকল সূচী ও মেনু
        </h1>
        <p className="bangla-text mt-1 text-sm text-gray-500 dark:text-dark-text-secondary">
          নামাজ শিক্ষার যেকোনো বিভাগে সহজেই প্রবেশ করুন
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {allSections.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3.5 rounded-2xl border border-emerald-100/80 bg-white p-4 shadow-sm transition-all hover:border-emerald-300 hover:shadow-md dark:border-dark-border dark:bg-dark-card dark:hover:border-emerald-700/60"
            >
              <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="bangla-text text-base font-bold text-gray-900 dark:text-white truncate">
                  {item.label}
                </h2>
                <p className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted truncate">
                  {item.desc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
