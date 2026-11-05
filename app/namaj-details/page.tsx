"use client";

import PrayerCard from "@/components/PrayerCard";
import prayerDetails from "@/data/prayer-details.json";
import { Breadcrumbs, Badge, Callout, ReferenceChip } from "@/src/components/ui";

export default function NamajDetailsPage() {
  const totalRakat = prayerDetails
    .filter((p) => p.id <= 5)
    .reduce((sum, p) => sum + p.total_rakat, 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: "নামাজের বিবরণ" }]} />

      {/* Page Header */}
      <div className="mb-10 text-center">
        <p className="arabic-text mb-2 text-2xl text-emerald-600 dark:text-emerald-400">
          أَقِيمُوا الصَّلَاةَ
        </p>
        <h1 className="bangla-text mb-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent dark:from-emerald-400 dark:to-emerald-600">
            ৫ ওয়াক্ত নামাজের বিবরণ
          </span>
        </h1>
        <p className="bangla-text mx-auto max-w-xl text-gray-600 dark:text-dark-text-secondary">
          কোন নামাজ কত রাকাত, কোন রাকাতে কী পড়তে হয় — তাকবীর, কিরাত, রুকু ও সেজদার বিস্তারিত হিসাব
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4 text-center dark:border-dark-border dark:from-emerald-950/30 dark:to-dark-card">
          <p className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">৫</p>
          <p className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted mt-1">ওয়াক্ত</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4 text-center dark:border-dark-border dark:from-emerald-950/30 dark:to-dark-card">
          <p className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">{totalRakat}</p>
          <p className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted mt-1">মোট রাকাত (দৈনিক)</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-4 text-center dark:border-dark-border dark:from-amber-950/30 dark:to-dark-card">
          <p className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">১৭</p>
          <p className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted mt-1">ফরজ রাকাত</p>
        </div>
        <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-4 text-center dark:border-dark-border dark:from-purple-950/30 dark:to-dark-card">
          <p className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">৩</p>
          <p className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted mt-1">বিতর (ওয়াজিব)</p>
        </div>
      </div>

      {/* Semantic Color Legend Using Badge Components */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-emerald-100/80 bg-gray-50/60 px-4 py-3 dark:border-dark-border dark:bg-dark-card">
        <span className="bangla-text text-xs font-semibold text-gray-600 dark:text-dark-text-muted">
          রাকাতের ধরন:
        </span>
        <Badge variant="fard" dot>ফরজ</Badge>
        <Badge variant="sunnah" dot>সুন্নাত</Badge>
        <Badge variant="wajib" dot>ওয়াজিব / বিতর</Badge>
        <Badge variant="nafl" dot>নফল</Badge>
      </div>

      {/* Prayer Cards */}
      <div className="space-y-4">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {prayerDetails.map((prayer: any) => (
          <PrayerCard key={prayer.id} data={prayer} />
        ))}
      </div>

      {/* Important Note Callout */}
      <div className="mt-10">
        <Callout type="warning" title="জরুরি জ্ঞাতব্য ও ফজিলত">
          <ul className="space-y-1.5 list-disc list-inside">
            <li>ফরজ নামাজ ইচ্ছাকৃত ত্যাগ করা কবিরা গুনাহ ও কুফরীর সমতুল্য গর্হিত কাজ।</li>
            <li>সুন্নাতে মুয়াক্কাদা (ফজরের ২ + যোহরের ৪+২ + মাগরিবের ২ + ইশার ২) বিনা ওজরে ত্যাগ করা উচিত নয়।</li>
            <li>বিতর নামাজ হানাফি মাজহাবে ওয়াজিব — ইশার পর ঘুমানোর পূর্বে বা তাহাজ্জুদের সাথে আদায় করতে হয়।</li>
            <li>জামাতে নামাজ আদায়ের সওয়াব একা পড়ার চেয়ে ২৭ গুণ বেশি।</li>
            <li>নামাজ শুদ্ধ হওয়ার পূর্বশর্ত সঠিক নিয়মে পবিত্রতা ও অযু অর্জন।</li>
          </ul>
        </Callout>
      </div>

      {/* Ayah Quote at bottom */}
      <div className="mt-8 rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50/70 via-white to-emerald-50/40 p-6 text-center shadow-sm dark:border-emerald-800/40 dark:from-emerald-950/30 dark:via-dark-card dark:to-emerald-950/20 sm:p-8">
        <p className="arabic-text mb-3 text-2xl text-emerald-700 dark:text-emerald-300">
          إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا
        </p>
        <p className="bangla-text text-sm text-gray-600 dark:text-dark-text-secondary">
          &quot;নিশ্চয়ই নামাজ মু&apos;মিনদের উপর নির্দিষ্ট সময়ে ফরজ করা হয়েছে।&quot;
        </p>
        <div className="mt-2 flex justify-center">
          <ReferenceChip source="সূরা আন-নিসা" hadithNumber="৪:১০৩" />
        </div>
      </div>
    </div>
  );
}
