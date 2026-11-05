import { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Headphones,
  Scale,
  ShieldAlert,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { siteConfig } from "@/src/config/site";
import { validateContent } from "@/src/lib/validate-content";
import { toBengaliNumber } from "@/src/lib/bengali";

export const metadata: Metadata = {
  title: "আমাদের সম্পর্কে ও তথ্যসূত্র (About & Sources)",
  description:
    "নামাজ শিক্ষা প্রজেক্টের অনুসৃত মাযহাব (হানাফি ফিকহ), কুরআন ও হাদিসের তথ্যসূত্র, ফিকহ গ্রন্থাবলি, অডিও ক্বারী ও লাইসেন্স এবং আলেম পর্যালোচনার বিবরণ।",
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
};

const PRIMARY_BOOKS = [
  {
    category: "আল-কুরআন ও তাফসীর",
    items: [
      "আল-কুরআনুল কারীম — উসমানী লিপি (Tanzil.net Uthmani Verified Text ও মদিনা মুসহাফ মানদণ্ড)",
      "তাফসীরে ইবনে কাসীর ও তাফসীরে মাআরিফুল কুরআন (মুফতি মুহাম্মাদ শফী রহ.)",
    ],
  },
  {
    category: "হাদিস গ্রন্থাবলি (কুতুবে সিত্তাহ ও অন্যান্য)",
    items: [
      "সহীহ বুখারী — ইমাম মুহাম্মাদ ইবনে ইসমাঈল আল-বুখারী (রহ.)",
      "সহীহ মুসলিম — ইমাম মুসলিম ইবনুল হাজ্জাজ (রহ.)",
      "সুনানে আবু দাউদ, জামে তিরমিজি, সুনানে নাসাঈ ও সুনানে ইবনে মাজাহ",
      "মুসনাদে আহমাদ, সহীহ ইবনে খুজাইমা, সহীহ ইবনে হিব্বান ও মুস্তাদরাকে হাকেম",
    ],
  },
  {
    category: "হানাফি ফিকহ ও ফতোয়া গ্রন্থাবলি",
    items: [
      "আল-হিদায়া (Al-Hidaya) — শাইখুল ইসলাম বুরহানুদ্দীন আল-মারগীনানী (রহ.)",
      "রাদ্দুল মুহতার / ফতোয়ায়ে শামী (Raddul Muhtar) — আল্লামা ইবনে আবিদীন শামী (রহ.)",
      "ফতোয়ায়ে আলমগীরী / ফতোয়ায়ে হিন্দিয়া (Fatawa Hindiyya)",
      "বাদায়েউস সানায়ে — ইমাম কাসানী (রহ.) এবং নূরুল ইযাহ ও মারাকিল ফালাহ — ইমাম শুরুনবুলালী (রহ.)",
      "বেহেশতী জেওর — হাকীমুল উম্মত মাওলানা আশরাফ আলী থানভী (রহ.)",
      "মাসআলা-মাসায়েল ও নামাজ শিক্ষা — বাংলাদেশে প্রচলিত নির্ভরযোগ্য দারুল ইফতা ও ইসলামিক ফাউন্ডেশন বাংলাদেশ প্রকাশিত গ্রন্থাবলি",
    ],
  },
];

const AUDIO_SOURCES = [
  {
    name: "শাইখ মিশারি রশিদ আল-আফাসি (Mishary Rashid Alafasy)",
    source: "EveryAyah.com / MP3Quran.net (64kbps - 128kbps)",
    usage: "সূরা, আয়াতুল কুরসী ও নামাজের তিলাওয়াত",
    license: "উন্মুক্ত দাওয়াহ ও শিক্ষামূলক ব্যবহারের জন্য অনুমোদিত",
  },
  {
    name: "শাইখ আব্দুল বাসিত আব্দুস সামাদ (Abdul Basit Abdus Samad)",
    source: "MP3Quran.net",
    usage: "কুরআন মাজীদ বিভাগ (মুরাত্তাল তিলাওয়াত)",
    license: "উন্মুক্ত দাওয়াহ ও শিক্ষামূলক ব্যবহারের জন্য অনুমোদিত",
  },
  {
    name: "শাইখ মাহমুদ খলিল আল-হুসারি ও শাইখ মিনশাউই",
    source: "EveryAyah.com / MP3Quran.net",
    usage: "তাজবীদ ও হিফজ (মুখস্থ) অনুশীলন মোড",
    license: "উন্মুক্ত দাওয়াহ ও শিক্ষামূলক ব্যবহারের জন্য অনুমোদিত",
  },
  {
    name: "সিন্থেসাইজড ও লোকাল অডিও ফলব্যাক (Offline Audio & Web Speech API)",
    source: "প্রজেক্টের নিজস্ব পাবলিক অডিও ফাইল (/public/audio/*)",
    usage: "তাকবীর, তাসবীহ ও অফলাইন নামাজ সিমুলেটর",
    license: "MIT / ওপেন-সোর্স",
  },
];

export default function AboutPage() {
  const validation = validateContent();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Header */}
      <header className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 p-6 text-white shadow-lg sm:p-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-emerald-200">
          <Sparkles className="h-3.5 w-3.5 text-gold-400" />
          <span>স্বচ্ছতা, বিশুদ্ধতা ও তথ্যসূত্র</span>
        </div>
        <h1 className="bangla-text mt-4 text-2xl font-bold sm:text-4xl">
          আমাদের সম্পর্কে ও তথ্যসূত্র
        </h1>
        <p className="bangla-text mt-3 max-w-3xl text-sm leading-relaxed text-emerald-100/90 sm:text-base">
          <strong>নামাজ শিক্ষা (Namaj Shikkha)</strong> একটি সম্পূর্ণ ফ্রি, বিজ্ঞাপনমুক্ত, অফলাইন-সক্ষম এবং ওপেন-সোর্স বাংলা নামাজ ও পবিত্রতা শেখার প্ল্যাটফর্ম। কুরআন ও সহীহ সুন্নাহর আলোকে এবং বাংলাদেশে প্রচলিত হানাফি ফিকহ অনুযায়ী প্রতিটি মানুষ যেন বিশুদ্ধভাবে নামাজ শিখতে পারেন—সেই লক্ষ্যেই এই উদ্যোগ।
        </p>

        {/* Live Content Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
            <div className="bangla-text text-xl font-bold text-gold-300">
              {toBengaliNumber(validation.stats.prayersCount)}টি
            </div>
            <div className="bangla-text text-xs text-emerald-200">
              পূর্ণাঙ্গ নামাজের গাইড
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
            <div className="bangla-text text-xl font-bold text-gold-300">
              {toBengaliNumber(validation.stats.duasCount)}টি
            </div>
            <div className="bangla-text text-xs text-emerald-200">
              নামাজ ও ওযুর দোয়া
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
            <div className="bangla-text text-xl font-bold text-gold-300">
              {toBengaliNumber(validation.stats.rulingsCount)}টি
            </div>
            <div className="bangla-text text-xs text-emerald-200">
              ফিকহি মাসায়েল অধ্যায়
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
            <div className="bangla-text text-xl font-bold text-gold-300">
              {toBengaliNumber(validation.stats.hadithsCount)}টি
            </div>
            <div className="bangla-text text-xs text-emerald-200">
              হাদিস ও কুরআনের দলিল
            </div>
          </div>
        </div>
      </header>

      <div className="mt-8 space-y-8">
        {/* 1. Madhab & Methodology */}
        <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-xs sm:p-8 dark:border-dark-border dark:bg-dark-card">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h2 className="bangla-text text-xl font-bold text-gray-900 dark:text-white">
                অনুসৃত মাযহাব ও ফিকহি নীতিমালা
              </h2>
              <p className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted">
                হানাফি ফিকহ (বাংলাদেশ মানদণ্ড) ও অন্যান্য মাযহাবের প্রতি শ্রদ্ধাশীল উপস্থাপনা
              </p>
            </div>
          </div>

          <div className="bangla-text mt-4 space-y-3 text-sm leading-relaxed text-gray-700 dark:text-dark-text-secondary">
            <p>
              ১. <strong>হানাফি মাযহাবের প্রাধান্য:</strong> বাংলাদেশের সংখ্যাগরিষ্ঠ মুসলিম জনগোষ্ঠী ও মসজিদসমূহে ইমাম আবু হানিফা (রহ.)-এর ফিকহ অনুসৃত হওয়ায় এই সাইটের রাকাত সংখ্যা, ফরজ-ওয়াজিব-সুন্নাত বিভাজন, ওযু-গোসলের নিয়ম, বিতর ও ঈদের নামাজের পদ্ধতি এবং সেজদায়ে সাহুর বিধানসমূহ <strong>হানাফি মাযহাব</strong> অনুযায়ী সাজানো হয়েছে।
            </p>
            <p>
              ২. <strong>মতভেদপূর্ণ মাসআলায় নিরপেক্ষতা ও আদব:</strong> যেসব মাসআলায় সাহাবায়ে কেরাম ও মুজতাহিদ ইমামগণের মাঝে দলিলভিত্তিক মতপার্থক্য রয়েছে (যেমন: তারাবীহ ২০ রাকাত বনাম ৮ রাকাত, পুরুষ ও নারীর নামাজের কিছু সুন্নাত ভঙ্গি, সুতি মোজার ওপর মাসেহ ইত্যাদি), সেখানে হানাফি মাযহাবের মূল আমল স্পষ্ট করার পাশাপাশি অপর মতটিও সম্পূর্ণ শ্রদ্ধাশীল ও নিরপেক্ষ ভাষায় উল্লেখ করা হয়েছে।
            </p>
            <p>
              ৩. <strong>হাদিসের মান (Grading) উল্লেখ:</strong> প্রতিটি হাদিসের সাথে কিতাবের নাম, হাদিস নম্বর এবং মুহাদ্দিসগণের তাহকীক অনুযায়ী মান (<strong>সহীহ</strong>, <strong>হাসান</strong> বা <strong>যঈফ</strong>) যুক্ত করা হয়েছে। কোনো যঈফ সনদের বর্ণনাকে সহীহ হিসেবে দাবি করা হয়নি; বরং ফযীলতের ক্ষেত্রে গ্রহণযোগ্যতা ও সনদের অবস্থা টীকায় স্পষ্ট করা হয়েছে।
            </p>
          </div>
        </section>

        {/* 2. Scholar Review Slot & Audit Status */}
        <section className="rounded-3xl border border-amber-200 bg-amber-50/50 p-6 shadow-xs sm:p-8 dark:border-amber-900/40 dark:bg-amber-950/20">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="bangla-text text-xl font-bold text-gray-900 dark:text-white">
                আলেম ও মুফতি পর্যালোচনা (Scholar Review Status)
              </h2>
              <p className="bangla-text text-xs text-gray-600 dark:text-dark-text-muted">
                আমরা মুফতি নই — সতর্ক সংকলক ও সম্পাদক হিসেবে প্রতিটি তথ্য আলেমদের নিরীক্ষার জন্য উন্মুক্ত রেখেছি
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-amber-200/80 bg-white p-4 dark:border-dark-border dark:bg-dark-card">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>স্বয়ংক্রিয় ও সম্পাদকীয় যাচাই</span>
              </div>
              <p className="bangla-text mt-2 text-xs leading-relaxed text-gray-600 dark:text-dark-text-secondary">
                কুরআনের সকল সূরা ও আয়াত তানযীল উসমানী টেক্সটের সাথে মিলিয়ে দেখা হয়েছে এবং মোট{" "}
                <strong>{toBengaliNumber(validation.needsReviewItems.length)}টি</strong> সূক্ষ্ম ফিকহি ও সনদগত বিষয় মুফতি বোর্ডের প্রত্যয়নের জন্য আলাদাভাবে চিহ্নিত (Flagged) করা হয়েছে।
              </p>
            </div>

            <div className="rounded-2xl border border-amber-200/80 bg-white p-4 dark:border-dark-border dark:bg-dark-card">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                <ClipboardCheck className="h-4 w-4" />
                <span>পর্যালোচনাকারী আলেমের প্রত্যয়ন স্লট</span>
              </div>
              <div className="bangla-text mt-2 space-y-1 text-xs text-gray-700 dark:text-dark-text-secondary">
                <p>
                  <strong>পর্যালোচনাকারী আলেম/মুফতি:</strong>{" "}
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 font-semibold text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                    [চূড়ান্ত দারুল ইফতা নিরীক্ষার পর নাম ও সনদ যুক্ত হবে]
                  </span>
                </p>
                <p>
                  <strong>প্রতিষ্ঠান / দারুল ইফতা:</strong> নির্ধারিত স্লট (পেন্ডিং রিভিউ)
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200/60 bg-white/80 px-4 py-3 text-xs dark:border-dark-border dark:bg-dark-card/60">
            <span className="bangla-text text-gray-700 dark:text-dark-text-secondary">
              আপনি কি একজন আলেম বা মুফতি? আমাদের{" "}
              <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] dark:bg-dark-bg">
                /docs/CONTENT_REVIEW.md
              </code>{" "}
              তালিকাটি যাচাইয়ে সহায়তা করতে পারেন।
            </span>
            <a
              href="mailto:contact@tashanto.com?subject=Scholar%20Review%20-%20Namaj%20Shikkha"
              className="bangla-text font-bold text-emerald-700 hover:underline dark:text-emerald-400"
            >
              যোগাযোগ করুন →
            </a>
          </div>
        </section>

        {/* 3. Books & References */}
        <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-xs sm:p-8 dark:border-dark-border dark:bg-dark-card">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="bangla-text text-xl font-bold text-gray-900 dark:text-white">
                ব্যবহৃত কিতাব ও নির্ভরযোগ্য তথ্যসূত্র
              </h2>
              <p className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted">
                যে সকল মূল গ্রন্থ ও ওয়েবসাইট থেকে মাসআলা, আরবি পাঠ ও হাদিস সংকলন করা হয়েছে
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-5">
            {PRIMARY_BOOKS.map((group) => (
              <div
                key={group.category}
                className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 dark:border-dark-border dark:bg-dark-bg/50"
              >
                <h3 className="bangla-text text-sm font-bold text-emerald-800 dark:text-emerald-400">
                  {group.category}
                </h3>
                <ul className="mt-2.5 space-y-1.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="bangla-text flex items-start gap-2 text-xs sm:text-sm text-gray-700 dark:text-dark-text-secondary"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Audio Sources & Licenses */}
        <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-xs sm:p-8 dark:border-dark-border dark:bg-dark-card">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Headphones className="h-5 w-5" />
            </div>
            <div>
              <h2 className="bangla-text text-xl font-bold text-gray-900 dark:text-white">
                অডিও তিলাওয়াতের উৎস ও লাইসেন্স
              </h2>
              <p className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted">
                কুরআন তিলাওয়াত ও নামাজ সিমুলেটরে ব্যবহৃত অডিওর ক্বারী ও কপিরাইট তথ্য
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {AUDIO_SOURCES.map((audio) => (
              <div
                key={audio.name}
                className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 dark:border-dark-border dark:bg-dark-bg/50"
              >
                <h3 className="bangla-text text-sm font-bold text-gray-900 dark:text-white">
                  {audio.name}
                </h3>
                <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">
                  উৎস: {audio.source}
                </p>
                <p className="bangla-text mt-1 text-xs text-gray-600 dark:text-dark-text-secondary">
                  ব্যবহার: {audio.usage}
                </p>
                <p className="bangla-text mt-1 text-[11px] text-gray-500 dark:text-dark-text-muted">
                  লাইসেন্স: {audio.license}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Transliteration Warning & Privacy Note */}
        <section className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-xs dark:border-dark-border dark:bg-dark-card">
            <div className="flex items-center gap-2.5">
              <FileText className="h-5 w-5 text-emerald-600" />
              <h2 className="bangla-text text-base font-bold text-gray-900 dark:text-white">
                বাংলা উচ্চারণ ও বানান রীতি
              </h2>
            </div>
            <p className="bangla-text mt-2.5 text-xs leading-relaxed text-gray-600 dark:text-dark-text-secondary">
              আরবি হরফের মাখরাজ ও তাজবীদ বাংলা বর্ণমালা বা রোমান ইংরেজি দিয়ে শতভাগ নিখুঁতভাবে প্রকাশ করা সম্ভব নয়। তাই বাংলা উচ্চারণ কেবল প্রাথমিক শিক্ষার্থীদের সহায়তার জন্য দেওয়া হয়েছে। বিশুদ্ধ তিলাওয়াতের জন্য আমাদের অডিও প্লেয়ার শুনুন এবং একজন অভিজ্ঞ ক্বারী বা আলেমের কাছে মশক করে নিন।
            </p>
          </div>

          <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-xs dark:border-dark-border dark:bg-dark-card">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="h-5 w-5 text-emerald-600" />
              <h2 className="bangla-text text-base font-bold text-gray-900 dark:text-white">
                ১০০% গোপনীয়তা ও অফলাইন নিশ্চয়তা
              </h2>
            </div>
            <p className="bangla-text mt-2.5 text-xs leading-relaxed text-gray-600 dark:text-dark-text-secondary">
              আপনার লোকেশন (নামাজের সময় ও কিবলার জন্য), নামাজ ট্র্যাকারের হিসাব, বুকমার্ক এবং মুখস্থ সূরার অগ্রগতি সম্পূর্ণরূপে আপনার ডিভাইসের ব্রাউজারে (localStorage / IndexedDB) সংরক্ষিত থাকে। কোনো ব্যক্তিগত তথ্য কোনো সার্ভারে পাঠানো হয় না।
            </p>
          </div>
        </section>

        {/* Quick Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/namaj"
            className="bangla-text rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-700"
          >
            সকল নামাজের গাইড দেখুন
          </Link>
          <Link
            href="/simulator"
            className="bangla-text rounded-2xl border border-emerald-200 bg-white px-5 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50 dark:border-dark-border dark:bg-dark-card dark:text-emerald-300"
          >
            নামাজ সিমুলেটর চালু করুন
          </Link>
        </div>
      </div>
    </div>
  );
}

