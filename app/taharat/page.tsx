import { Metadata } from "next";
import Link from "next/link";
import {
  Droplets,
  Bath,
  Sun,
  ShieldCheck,
  Footprints,
  ArrowRight,
  Sparkles,
  BookOpen,
  HelpCircle,
} from "lucide-react";
import { Breadcrumbs, Badge, Card, Accordion, ReferenceChip } from "@/src/components/ui";

export const metadata: Metadata = {
  title: "পবিত্রতা ও তাহারাত — অজু, গোসল, তায়াম্মুম ও নাপাকি দূর করার শরয়ী নিয়ম",
  description:
    "সালাত কবুল হওয়ার প্রধান পূর্বশর্ত পবিত্রতা। হানাফি মাযহাব ও সহীহ হাদিসের আলোকে অজু, ফরজ গোসল, তায়াম্মুম, নাপাকি দূরীকরণ এবং মোজায় মাসেহের প্রামাণ্য নির্দেশিকা।",
  keywords: [
    "অজুর নিয়ম",
    "ফরজ গোসল",
    "তায়াম্মুম",
    "তাহারাত",
    "নাপাকি দূর করার নিয়ম",
    "মোজায় মাসেহ",
    "হানাফি ফিকহ",
    "পবিত্রতা",
  ],
};

const topicCards = [
  {
    slug: "wudu",
    titleBn: "অযুর সম্পূর্ণ নিয়ম",
    titleEn: "Ablution (Wudu)",
    desc: "৪ ফরজ, সুন্নাত, মুস্তাহাব, অজু ভঙ্গের ৮ কারণ ও চেকলিস্ট নির্দেশিকা।",
    icon: Droplets,
    badge: "সালাতের চাবি",
    color: "from-emerald-500 to-teal-600",
    bgSoft: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800/40",
  },
  {
    slug: "ghusl",
    titleBn: "ফরজ গোসলের নিয়ম",
    titleEn: "Ritual Bath (Ghusl)",
    desc: "গোসল কখন ফরজ হয়, ৩টি ফরজ, সুন্নাহ পদ্ধতি ও মহিলাদের চুলের বিধান।",
    icon: Bath,
    badge: "৩ ফরজ",
    color: "from-blue-500 to-indigo-600",
    bgSoft: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800/40",
  },
  {
    slug: "tayammum",
    titleBn: "তায়াম্মুমের নিয়ম",
    titleEn: "Dry Ablution (Tayammum)",
    desc: "পানি না পেলে বা অসুস্থ হলে মাটি দ্বারা পবিত্রতা অর্জনের সহজ পদ্ধতি।",
    icon: Sun,
    badge: "জরুরি বিকল্প",
    color: "from-amber-500 to-orange-600",
    bgSoft: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800/40",
  },
  {
    slug: "najasat",
    titleBn: "নাপাকি ও পবিত্রকরণ",
    titleEn: "Impurities & Cleansing",
    desc: "ভারী ও হালকা নাপাকির পার্থক্য, মাফযোগ্য সীমা ও কাপড় ধোয়ার শরয়ী নিয়ম।",
    icon: ShieldCheck,
    badge: "পোশাক ও শরীর",
    color: "from-rose-500 to-pink-600",
    bgSoft: "bg-rose-50 dark:bg-rose-950/30",
    border: "border-rose-200 dark:border-rose-800/40",
  },
  {
    slug: "masah-on-socks",
    titleBn: "চামড়ার মোজায় মাসেহ",
    titleEn: "Wiping Over Socks (Khuffain)",
    desc: "মোজায় মাসেহের ৬টি শর্ত, সময়সীমা (২৪/৭২ ঘণ্টা) এবং সুতি মোজার বিধান।",
    icon: Footprints,
    badge: "শীত ও সফর",
    color: "from-purple-500 to-violet-600",
    bgSoft: "bg-purple-50 dark:bg-purple-950/30",
    border: "border-purple-200 dark:border-purple-800/40",
  },
];

const generalFaqs = [
  {
    question: "তাহারাত বা পবিত্রতা ব্যতীত কি সালাত আদায় সম্ভব?",
    answer:
      "না, পবিত্রতা হলো সালাতের প্রাথমিক শর্ত। রাসূলুল্লাহ (সা.) বলেছেন: 'পবিত্রতা ব্যতীত সালাত কবুল হয় না এবং আত্মসাৎকৃত মালের সদকা গৃহীত হয় না।' (সহীহ মুসলিম ২২৪)।",
  },
  {
    question: "হাদাছ (حدث) ও খাবাছ (خبث) এর মধ্যে পার্থক্য কী?",
    answer:
      "হাদাছ হলো শরীরের অদৃশ্য অপবিত্রতা যা অজু বা ফরজ গোসলের মাধ্যমে দূর করতে হয় (যেমন বায়ুর নির্গমন বা বীর্যপাত)। আর খাবাছ হলো শরীরে, কাপড়ে বা স্থানে লেগে থাকা দৃশ্যমান নাপাকি (যেমন পেশাব, রক্ত, মল) যা পানি দ্বারা ধুয়ে দূর করতে হয়।",
  },
  {
    question: "অজু ও তায়াম্মুমের মধ্যে কি ফরজ গোসলের সুযোগ আছে?",
    answer:
      "হ্যাঁ, পানি না থাকলে বা রোগবৃদ্ধির নিশ্চিত আশঙ্কা থাকলে অজু এবং ফরজ গোসল উভয়ের জন্যই মাটি দ্বারা তায়াম্মুম করা যায়।",
  },
];

export default function TaharatHubPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: "পবিত্রতা ও তাহারাত" }]} />

      {/* Header Banner */}
      <div className="mb-12 text-center">
        <div className="mb-3 flex justify-center gap-2">
          <Badge variant="fard" dot>
            সালাতের মৌলিক শর্ত
          </Badge>
          <Badge variant="neutral">হানাফি ফিকহ ও সহীহ হাদিস</Badge>
        </div>

        <p className="arabic-text mb-2 text-2xl font-bold text-emerald-700 dark:text-emerald-400 sm:text-3xl">
          الطَّهُورُ شَطْرُ الإِيمَانِ
        </p>

        <h1 className="bangla-text mb-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
          <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent dark:from-emerald-400 dark:to-emerald-600">
            পবিত্রতা ও তাহারাত নির্দেশিকা
          </span>
        </h1>

        <p className="bangla-text mx-auto max-w-2xl text-base text-gray-600 dark:text-dark-text-secondary sm:text-lg">
          &quot;পবিত্রতা ঈমানের অর্ধেক।&quot; — সহীহ মুসলিম ২২৩। সালাত কবুল হওয়ার জন্য শরীর, পোশাক ও স্থান বাহ্যিক ও অভ্যন্তরীণ উভয় অপবিত্রতা থেকে মুক্ত হওয়া অপরিহার্য।
        </p>
      </div>

      {/* 5 Topic Cards Grid */}
      <div className="mb-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {topicCards.map((topic) => {
          const Icon = topic.icon;
          return (
            <Link
              key={topic.slug}
              href={`/taharat/${topic.slug}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-emerald-100/90 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg dark:border-dark-border dark:bg-dark-card dark:hover:border-emerald-700/60"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${topic.color} text-white shadow-md shadow-emerald-200/50 dark:shadow-none`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="bangla-text rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {topic.badge}
                  </span>
                </div>

                <h2 className="bangla-text text-xl font-bold text-gray-900 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400 transition-colors">
                  {topic.titleBn}
                </h2>
                <p className="text-xs font-medium text-gray-400 dark:text-dark-text-muted mb-3">
                  {topic.titleEn}
                </p>

                <p className="bangla-text text-sm leading-relaxed text-gray-600 dark:text-dark-text-secondary">
                  {topic.desc}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <span>সম্পূর্ণ নিয়ম দেখুন</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}

        {/* Quick Link to Namaj Rules Card */}
        <Link
          href="/namaj-rules"
          className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/40 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-emerald-800/40 dark:from-emerald-950/20 dark:via-dark-card dark:to-emerald-950/10"
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700 text-white shadow-md">
                <BookOpen className="h-6 w-6" />
              </div>
              <span className="bangla-text rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200">
                পরবর্তী ধাপ
              </span>
            </div>

            <h2 className="bangla-text text-xl font-bold text-gray-900 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400 transition-colors">
              ধাপে ধাপে নামাজের নিয়ম
            </h2>
            <p className="text-xs font-medium text-gray-400 dark:text-dark-text-muted mb-3">
              Step-by-Step Salah Guide
            </p>

            <p className="bangla-text text-sm leading-relaxed text-gray-600 dark:text-dark-text-secondary">
              পবিত্রতা অর্জনের পর তাকবীরে তাহরীমা থেকে সালাম পর্যন্ত প্রতিটি রুকন ও আমল সঠিকভাবে আদায় করার নির্দেশিকা।
            </p>
          </div>

          <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
            <span>নামাজ নির্দেশিকায় যান</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </div>

      {/* Summary Box */}
      <Card className="mb-14 border-emerald-200 bg-gradient-to-br from-emerald-50/50 via-white to-white p-6 dark:from-emerald-950/20 dark:via-dark-card dark:to-dark-card sm:p-8">
        <h3 className="bangla-text text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          এক নজরে তাহারাত ও পবিত্রতার মূলনীতি
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-emerald-100 bg-white p-4 dark:border-dark-border dark:bg-dark-card">
            <h4 className="bangla-text text-sm font-bold text-emerald-800 dark:text-emerald-300 mb-1">
              ১. অজুর ৪ ফরজ
            </h4>
            <p className="bangla-text text-xs leading-relaxed text-gray-600 dark:text-dark-text-secondary">
              মুখমণ্ডল ধোয়া, দুই হাত কনুইসহ ধোয়া, মাথার এক-চতুর্থাংশ মাসেহ এবং দুই পা টাখনুসহ ধোয়া।
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-4 dark:border-dark-border dark:bg-dark-card">
            <h4 className="bangla-text text-sm font-bold text-emerald-800 dark:text-emerald-300 mb-1">
              ২. গোসলের ৩ ফরজ
            </h4>
            <p className="bangla-text text-xs leading-relaxed text-gray-600 dark:text-dark-text-secondary">
              গড়গড়া সহকারে কুলি করা, নাকের নরম অংশ পর্যন্ত পানি পৌঁছানো এবং সমস্ত শরীরে এমনভাবে পানি ঢালা যাতে একটুও শুকনো না থাকে।
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-4 dark:border-dark-border dark:bg-dark-card">
            <h4 className="bangla-text text-sm font-bold text-emerald-800 dark:text-emerald-300 mb-1">
              ৩. তায়াম্মুমের ৩ ফরজ
            </h4>
            <p className="bangla-text text-xs leading-relaxed text-gray-600 dark:text-dark-text-secondary">
              নিয়্যত করা, পবিত্র মাটিতে হাত মেরে মুখমণ্ডল মাসেহ করা এবং পুনরায় হাত মেরে দুই হাতের কনুইসহ মাসেহ করা।
            </p>
          </div>
        </div>
      </Card>

      {/* FAQs */}
      <div className="mb-14">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="bangla-text text-xl font-bold text-gray-900 dark:text-white">
            পবিত্রতা বিষয়ে সচরাচর জিজ্ঞাসিত প্রশ্ন
          </h3>
        </div>

        <Accordion
          items={generalFaqs.map((faq) => ({
            id: faq.question,
            title: faq.question,
            content: (
              <p className="bangla-text text-sm leading-relaxed text-gray-700 dark:text-dark-text-secondary">
                {faq.answer}
              </p>
            ),
          }))}
        />
      </div>

      {/* References Footer */}
      <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-5 dark:border-dark-border dark:bg-dark-card/50">
        <h4 className="bangla-text text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-dark-text-muted mb-3">
          প্রামাণ্য তথ্যসূত্র ও ফিকহ রেফারেন্স:
        </h4>
        <div className="flex flex-wrap gap-2">
          <ReferenceChip source="সূরা আল-মায়িদাহ" hadithNumber="৫:৬" />
          <ReferenceChip source="সহীহ মুসলিম" hadithNumber="২২৩" />
          <ReferenceChip source="সহীহ বুখারী" hadithNumber="১৫৯" />
          <ReferenceChip source="আল-হিদায়া (কিতাবুত তাহারাত)" />
          <ReferenceChip source="রদ্দুল মুহতার (ফাতাওয়া শামী)" />
        </div>
      </div>
    </div>
  );
}
