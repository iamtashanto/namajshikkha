import Link from "next/link";
import {
  BookOpen,
  BookHeart,
  ScrollText,
  BookOpenCheck,
  ListChecks,
  Landmark,
  Sparkles,
  Clock,
  BookMarked,
  PlayCircle,
  ArrowRight,
} from "lucide-react";
import NavigationCard from "@/components/NavigationCard";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="islamic-pattern relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-white dark:from-dark-bg dark:via-dark-bg dark:to-dark-bg">
        {/* Decorative elements */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-100/40 blur-3xl dark:bg-emerald-900/20" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-gold-100/30 blur-3xl dark:bg-gold-900/10" />

        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="flex flex-col items-center text-center">
            {/* Arabic Bismillah */}
            <p className="arabic-text mb-6 text-2xl text-emerald-600/70 dark:text-emerald-400/60 sm:text-3xl">
              بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ
            </p>

            {/* Main Heading */}
            <h1 className="bangla-text mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 bg-clip-text text-transparent dark:from-emerald-400 dark:via-emerald-500 dark:to-emerald-600">
                নামাজ শিক্ষা
              </span>
            </h1>

            <p className="mb-3 text-lg font-medium tracking-wide text-emerald-600 dark:text-emerald-400 sm:text-xl">
              Namaj Shikkha — Prayer Learning
            </p>

            {/* Subtitle */}
            <p className="bangla-text mx-auto mb-8 max-w-2xl text-base leading-relaxed text-gray-500 dark:text-dark-text-secondary sm:text-lg">
              সঠিকভাবে নামাজ পড়া শিখুন। সূরা, দোয়া, নিয়্যত, হাদিস —
              সবকিছু আরবি, বাংলা উচ্চারণ, ব্যাংলিশ ও বাংলা অর্থসহ।
            </p>

            {/* Hero Primary CTA */}
            <div className="mb-10 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                href="/simulator"
                className="bangla-text inline-flex items-center gap-2.5 rounded-2xl bg-emerald-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-xl dark:shadow-emerald-950/50"
              >
                <PlayCircle className="h-5 w-5" />
                <span>নামাজ শিখুন — ধাপে ধাপে দেখে</span>
              </Link>

              <Link
                href="/namaj"
                className="bangla-text inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-5 py-3.5 text-base font-semibold text-emerald-800 shadow-xs transition-all hover:bg-emerald-50 dark:border-dark-border dark:bg-dark-card dark:text-emerald-300 dark:hover:bg-dark-card-hover"
              >
                <span>সকল নামাজের তালিকা</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Decorative divider */}
            <div className="mb-12 flex items-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-emerald-300 dark:to-emerald-600" />
              <div className="h-2 w-2 rotate-45 rounded-sm bg-emerald-400 dark:bg-emerald-500" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-emerald-300 dark:to-emerald-600" />
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Cards */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8 dark:bg-dark-bg">
        <h2 className="bangla-text mb-8 text-center text-2xl font-bold text-gray-800 dark:text-dark-text sm:text-3xl">
          কী শিখতে চান?
        </h2>
        <div className="stagger-children grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <NavigationCard
            href="/namaj-rules"
            icon={BookOpen}
            title="নামাজের নিয়ম"
            description="ধাপে ধাপে নামাজ পড়ার সম্পূর্ণ নিয়ম শিখুন"
            color="emerald"
          />
          <NavigationCard
            href="/simulator"
            icon={Sparkles}
            title="নামাজ সিমুলেটর"
            description="ইন্টারঅ্যাক্টিভ অ্যানিমেশনসহ নামাজ শিখুন"
            color="gold"
          />
          <NavigationCard
            href="/namaj-details"
            icon={ListChecks}
            title="নামাজের বিবরণ"
            description="কোন নামাজ কত রাকাত, তাকবীর, দোয়া — সব বিস্তারিত"
            color="emerald"
          />
          <NavigationCard
            href="/prayer-times"
            icon={Clock}
            title="নামাজের সময়সূচী"
            description="প্রতিদিনের ৫ ওয়াক্ত নামাজের সঠিক সময়"
            color="blue"
          />
          <NavigationCard
            href="/surah-dua"
            icon={ScrollText}
            title="সূরা ও দোয়া"
            description="নামাজে পড়ার সূরা ও দোয়াসমূহ অর্থসহ"
            color="gold"
          />
          <NavigationCard
            href="/quran"
            icon={BookOpenCheck}
            title="কুরআনের সূরা"
            description="১১৪টি সূরা — অডিও তিলাওয়াত সহ অনুসন্ধান করুন"
            color="emerald"
          />
          <NavigationCard
            href="/masail"
            icon={BookMarked}
            title="নামাজের মাসায়েল"
            description="অযু, গোসল, সেজদায়ে সাহু ও জরুরি বিধানাবলী"
            color="blue"
          />
          <NavigationCard
            href="/hadith-faq"
            icon={BookHeart}
            title="হাদিস ও প্রশ্নোত্তর"
            description="নামাজ সম্পর্কিত সহীহ হাদিস ও সচরাচর প্রশ্ন"
            color="purple"
          />
          <NavigationCard
            href="/islamic-history"
            icon={Landmark}
            title="ইসলামের ইতিহাস"
            description="প্রাক-ইসলাম থেকে আধুনিক যুগ — ৫৮টি ঐতিহাসিক ঘটনা"
            color="purple"
          />
        </div>
      </section>

      {/* Features section */}
      <section className="border-t border-emerald-50 bg-gradient-to-b from-emerald-50/30 to-white py-16 dark:border-dark-border dark:from-dark-card/50 dark:to-dark-bg">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="bangla-text mb-10 text-center text-2xl font-bold text-gray-800 dark:text-dark-text">
            কেন নামাজ শিক্ষা?
          </h2>
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl dark:bg-emerald-900/40">
                📖
              </div>
              <h3 className="bangla-text mb-2 font-bold text-gray-800 dark:text-dark-text">৪ ফরম্যাটে পড়ুন</h3>
              <p className="bangla-text text-sm text-gray-500 dark:text-dark-text-muted">
                আরবি, বাংলা উচ্চারণ, ব্যাংলিশ এবং বাংলা অর্থ — একসাথে
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-100 text-2xl dark:bg-gold-900/30">
                🔊
              </div>
              <h3 className="bangla-text mb-2 font-bold text-gray-800 dark:text-dark-text">অডিও সহ</h3>
              <p className="bangla-text text-sm text-gray-500 dark:text-dark-text-muted">
                প্রতিটি সূরা ও দোয়ার সাথে অডিও প্লেয়ার
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-2xl dark:bg-blue-900/30">
                ⚡
              </div>
              <h3 className="bangla-text mb-2 font-bold text-gray-800 dark:text-dark-text">সুপার ফাস্ট</h3>
              <p className="bangla-text text-sm text-gray-500 dark:text-dark-text-muted">
                স্ট্যাটিক সাইট — ইন্টারনেট ছাড়াও কাজ করে
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
