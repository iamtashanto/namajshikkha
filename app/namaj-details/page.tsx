"use client";

import PrayerCard from "@/components/PrayerCard";
import prayerDetails from "@/data/prayer-details.json";

export default function NamajDetailsPage() {
    const totalRakat = prayerDetails
        .filter((p) => p.id <= 5)
        .reduce((sum, p) => sum + p.total_rakat, 0);

    return (
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
            {/* Page Header */}
            <div className="mb-10 text-center">
                <p className="arabic-text mb-3 text-xl text-emerald-500/60 dark:text-emerald-400/40">
                    أَقِيمُوا الصَّلَاةَ
                </p>
                <h1 className="bangla-text mb-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                    <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent dark:from-emerald-400 dark:to-emerald-600">
                        নামাজের বিস্তারিত বিবরণ
                    </span>
                </h1>
                <p className="bangla-text mx-auto max-w-xl text-gray-500 dark:text-dark-text-secondary">
                    কোন নামাজ কত রাকাত, কোন রাকাতে কী পড়তে হয় — তাকবীর, সূরা, দোয়া সব বিস্তারিত
                </p>
            </div>

            {/* Summary Cards */}
            <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4 text-center dark:border-dark-border dark:from-emerald-950/30 dark:to-dark-card">
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">৫</p>
                    <p className="bangla-text text-xs text-gray-400 dark:text-dark-text-muted">ওয়াক্ত</p>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-4 text-center dark:border-dark-border dark:from-emerald-950/30 dark:to-dark-card">
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{totalRakat}</p>
                    <p className="bangla-text text-xs text-gray-400 dark:text-dark-text-muted">মোট রাকাত (দৈনিক)</p>
                </div>
                <div className="rounded-xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-4 text-center dark:border-dark-border dark:from-amber-950/30 dark:to-dark-card">
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">১৭</p>
                    <p className="bangla-text text-xs text-gray-400 dark:text-dark-text-muted">ফরজ রাকাত</p>
                </div>
                <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4 text-center dark:border-dark-border dark:from-blue-950/30 dark:to-dark-card">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">৩</p>
                    <p className="bangla-text text-xs text-gray-400 dark:text-dark-text-muted">বিতর (ওয়াজিব)</p>
                </div>
            </div>

            {/* Color Legend */}
            <div className="mb-6 flex flex-wrap items-center justify-center gap-4 rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-2.5 dark:border-dark-border dark:bg-dark-card">
                <span className="bangla-text text-xs text-gray-400 dark:text-dark-text-muted">রং বুঝুন:</span>
                <span className="flex items-center gap-1.5 text-xs">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span className="bangla-text text-gray-500 dark:text-dark-text-secondary">ফরজ</span>
                </span>
                <span className="flex items-center gap-1.5 text-xs">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <span className="bangla-text text-gray-500 dark:text-dark-text-secondary">সুন্নাত</span>
                </span>
                <span className="flex items-center gap-1.5 text-xs">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                    <span className="bangla-text text-gray-500 dark:text-dark-text-secondary">নফল</span>
                </span>
                <span className="flex items-center gap-1.5 text-xs">
                    <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
                    <span className="bangla-text text-gray-500 dark:text-dark-text-secondary">বিতর</span>
                </span>
            </div>

            {/* Prayer Cards */}
            <div className="space-y-4">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {prayerDetails.map((prayer: any) => (
                    <PrayerCard key={prayer.id} data={prayer} />
                ))}
            </div>

            {/* Important Note */}
            <div className="mt-10 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-white p-5 dark:border-amber-800/40 dark:from-amber-950/20 dark:to-dark-card sm:p-6">
                <h3 className="bangla-text mb-2 font-bold text-amber-700 dark:text-amber-400">
                    ⚠️ গুরুত্বপূর্ণ তথ্য
                </h3>
                <ul className="bangla-text space-y-1.5 text-sm leading-7 text-gray-600 dark:text-dark-text-secondary">
                    <li>• ফরজ নামাজ অবশ্যই পড়তে হবে, ছাড়া যাবে না</li>
                    <li>• সুন্নাতে মুয়াক্কাদা (ফজরের ২ + যোহরের ৪+২ + মাগরিবের ২ + ইশার ২) খুবই গুরুত্বপূর্ণ</li>
                    <li>• বিতর নামাজ ওয়াজিব — ইশার পর পড়তে হয়</li>
                    <li>• জামাতে নামাজ পড়ার সওয়াব একা পড়ার চেয়ে ২৭ গুণ বেশি</li>
                    <li>• নামাজের আগে অযু করা ফরজ</li>
                </ul>
            </div>

            {/* Hadith Quote */}
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white p-6 text-center dark:border-emerald-800/40 dark:from-emerald-950/30 dark:to-dark-card">
                <p className="arabic-text mb-3 text-lg text-emerald-600 dark:text-emerald-400">
                    إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا
                </p>
                <p className="bangla-text text-sm text-gray-500 dark:text-dark-text-muted">
                    &quot;নিশ্চয়ই নামাজ মু&apos;মিনদের উপর নির্দিষ্ট সময়ে ফরজ করা হয়েছে।&quot;
                    — সূরা আন-নিসা ৪:১০৩
                </p>
            </div>
        </div>
    );
}
