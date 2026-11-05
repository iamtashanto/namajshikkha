import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Clock, ArrowRight, Compass } from "lucide-react";
import { siteConfig } from "@/src/config/site";
import { shikhunArticles } from "@/src/data/shikhun";
import { Breadcrumbs } from "@/src/components/ui";
import { JsonLd } from "@/src/components/seo/JsonLd";
import { buildBreadcrumbSchema } from "@/src/lib/seo/schema";

export const metadata: Metadata = {
  title: "নামাজ শিখুন — প্রামাণ্য ইসলামিক প্রবন্ধ ও গাইড",
  description:
    "নামাজে মন বসানোর উপায়, নারী-পুরুষের নামাজের পার্থক্য, কাযা নামাজের বিধান, সেজদায়ে সাহু ও সহীহ মাসায়েল নিয়ে বিস্তারিত প্রবন্ধসমূহ।",
  keywords: [
    "নামাজ শিক্ষা প্রবন্ধ",
    "নামাজে মন বসানোর উপায়",
    "মহিলাদের নামাজ",
    "কাযা নামাজের হিসাব",
    "সেজদায়ে সাহু",
    "নামাজ শিখুন",
  ],
  alternates: {
    canonical: `${siteConfig.url}/shikhun`,
  },
  openGraph: {
    title: "নামাজ শিখুন — প্রামাণ্য ইসলামিক প্রবন্ধ ও গাইড",
    description:
      "নামাজে মন বসানোর উপায়, নারী-পুরুষের নামাজের পার্থক্য, কাযা নামাজের বিধান ও সেজদায়ে সাহু সংক্রান্ত পূর্ণাঙ্গ নির্দেশিকা।",
    url: `${siteConfig.url}/shikhun`,
  },
};

export default function ShikhunHubPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "হোম", url: "/" },
    { name: "শিখুন", url: "/shikhun" },
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <JsonLd schema={breadcrumbSchema} />

      <Breadcrumbs items={[{ label: "শিখুন" }]} />

      {/* Header */}
      <div className="text-center mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <BookOpen className="h-3.5 w-3.5" />
          <span>প্রবন্ধ ও গাইড</span>
        </div>
        <h1 className="bangla-text text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          <span className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 bg-clip-text text-transparent dark:from-emerald-400 dark:via-emerald-500 dark:to-emerald-600">
            নামাজ শিখুন ও জ্ঞান অর্জন করুন
          </span>
        </h1>
        <p className="bangla-text text-sm sm:text-base text-gray-600 dark:text-dark-text-secondary max-w-2xl mx-auto leading-relaxed">
          নামাজে একাগ্রতা অর্জন, সূক্ষ্ম ভুল-ত্রুটি সংশোধন এবং প্রাত্যহিক জীবনের প্রয়োজনীয় শরয়ী মাসায়েল নিয়ে তথ্যবহুল বিশ্লেষণধর্মী প্রবন্ধ।
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {shikhunArticles.map((article) => (
          <article
            key={article.slug}
            className="group relative flex flex-col justify-between rounded-2xl border border-emerald-100/90 dark:border-dark-border bg-white dark:bg-dark-card p-6 shadow-sm hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300">
                  {article.categoryLabelBn}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-dark-text-muted">
                  <Clock className="h-3 w-3" />
                  {article.readTimeMinutes} মিনিট পাঠ
                </span>
              </div>

              <h2 className="bangla-text text-lg sm:text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                <Link href={`/shikhun/${article.slug}`}>
                  <span className="absolute inset-0" />
                  {article.titleBn}
                </Link>
              </h2>

              <p className="bangla-text text-xs sm:text-sm text-gray-600 dark:text-dark-text-secondary leading-relaxed line-clamp-3">
                {article.summaryBn}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-dark-border flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <span>সম্পূর্ণ পড়ুন</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </article>
        ))}
      </div>

      {/* Quick Tools Banner */}
      <div className="mt-12 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-dark-card dark:to-dark-card p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="bangla-text text-lg font-bold text-gray-900 dark:text-white">
            অনুশীলন করতে চান? সরাসরি সিমুলেটর ব্যবহার করুন
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-text-secondary">
            অ্যানিমেশনের সাথে প্রতিটি রুকু, সিজদা ও তাসবীহ শেখার সহজ মাধ্যম।
          </p>
        </div>
        <Link
          href="/simulator"
          className="bangla-text shrink-0 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
        >
          <Compass className="h-4 w-4" />
          <span>নামাজ সিমুলেটর</span>
        </Link>
      </div>
    </div>
  );
}
