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
        <Callout type="warning" title="কোন নামাজ পড়তেই হবে আর কোনটা ছাড়া যাবে? (জরুরি ইসলামী বিধান)">
          <div className="space-y-3 text-sm leading-relaxed">
            <p>
              ইসলামী ফেক্বাহ অনুযায়ী ৫ ওয়াক্ত নামাজের রাকাতগুলোর বাধ্যবাধকতা ও স্তরবিন্যাস নিচে সুস্পষ্টভাবে দেওয়া হলো:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              <div className="rounded-xl border border-red-200 bg-red-50/70 p-3.5 dark:border-red-900/40 dark:bg-red-950/20">
                <p className="font-bold text-red-800 dark:text-red-400">🔴 ১. যা অবশ্যই পড়তে হবে (ফরজ ও ওয়াজিব):</p>
                <p className="text-xs text-red-900/90 dark:text-red-300 mt-1">
                  দৈনিক <strong>১৭ রাকাত ফরজ</strong> (ফজর ২, যোহর ৪, আসর ৪, মাগরিব ৩, ইশা ৪) এবং <strong>৩ রাকাত বিতর (ওয়াজিব)</strong> — সর্বমোট <strong>২০ রাকাত</strong> যে কোনো সুস্থ প্রাপ্তবয়স্ক মুসলিমের জন্য পড়া ফরজ ও অলঙ্ঘনীয়। ইচ্ছাকৃত ত্যাগ করা মারাত্মক কবিরা গুনাহ।
                </p>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 dark:border-amber-900/40 dark:bg-amber-950/20">
                <p className="font-bold text-amber-800 dark:text-amber-400">🟡 ২. যা নিয়মিত পড়া উচিত (সুন্নাতে মুয়াক্কাদাহ):</p>
                <p className="text-xs text-amber-900/90 dark:text-amber-300 mt-1">
                  মোট <strong>১২ রাকাত</strong> (ফজরের পূর্বে ২, যোহরের পূর্বে ৪ ও পরে ২, মাগরিবের পরে ২, ইশার পরে ২)। রাসুলুল্লাহ (সা.) সর্বদা তা আদায় করেছেন। ওজর ছাড়া অভ্যাসগতভাবে ছেড়ে দেওয়া গোনাহের কারণ।
                </p>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 dark:border-emerald-900/40 dark:bg-emerald-950/20">
                <p className="font-bold text-emerald-800 dark:text-emerald-400">🟢 ৩. যা পড়লে অতিরিক্ত সওয়াব (সুন্নাতে যায়েদাহ/নফল):</p>
                <p className="text-xs text-emerald-900/90 dark:text-emerald-300 mt-1">
                  আসরের পূর্বে ৪ রাকাত, ইশার পূর্বে ৪ রাকাত এবং অন্যান্য নফল রাকাত। পড়লে জান্নাতে সুউচ্চ মর্যাদা লাভ হয়, কিন্তু সময়ের স্বল্পতায় না পড়লেও কোনো গুনাহ হবে না।
                </p>
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 dark:border-blue-900/40 dark:bg-blue-950/20">
                <p className="font-bold text-blue-800 dark:text-blue-400">💡 সংক্ষিপ্ত সময়ে কী করবেন (অফিস বা ভ্রমণে):</p>
                <p className="text-xs text-blue-900/90 dark:text-blue-300 mt-1">
                  জরুরি সময়ে বা কাজের চাপে অন্তত ফরজ ও বিতর আদায় করে নিলেও ফরজ দায়িত্ব পালন হয়ে যাবে। তবে ফজরের ২ রাকাত সুন্নাত কোনো অবস্থাতেই ছাড়া অনুচিত।
                </p>
              </div>
            </div>
          </div>
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
