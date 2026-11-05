import { Metadata } from "next";
import { prayers } from "@/src/data/prayers";
import { Breadcrumbs, Badge } from "@/src/components/ui";
import { PrayerHubClient } from "@/src/components/prayer/PrayerHubClient";
import { siteConfig } from "@/src/config/site";

export const metadata: Metadata = {
  title: "সকল নামাজের তালিকা ও নিয়ম — নামাজ শিক্ষা",
  description:
    "ফরজ, ওয়াজিব, সুন্নাত, নফল, জুমআ, দুই ঈদ, জানাজা ও বিশেষ সকল নামাজের সম্পূর্ণ তালিকা, রাকাতের হিসাব ও ধাপে ধাপে নিয়ম। হানাফি ফিকহ ও সহীহ হাদিস ভিত্তিক।",
  keywords: [
    "নামাজ",
    "নামাজের নিয়ম",
    "ফরজ নামাজ",
    "ওয়াজিব নামাজ",
    "সুন্নাত নামাজ",
    "নফল নামাজ",
    "জুমআর নামাজ",
    "ঈদের নামাজ",
    "জানাজার নামাজ",
    "বিতর নামাজ",
    "হানাফি ফিকহ",
  ],
  alternates: {
    canonical: `${siteConfig.url}/namaj`,
  },
  openGraph: {
    title: "সকল নামাজের তালিকা ও নিয়ম — নামাজ শিক্ষা",
    description:
      "ফরজ, ওয়াজিব, সুন্নাত, নফল, জুমআ, দুই ঈদ, জানাজা ও বিশেষ সকল নামাজের সম্পূর্ণ তালিকা ও নিয়ম।",
    url: `${siteConfig.url}/namaj`,
    siteName: siteConfig.name,
    locale: "bn_BD",
    type: "website",
  },
};

export default function NamajHubPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: "নামাজ" }]} />

      {/* Header Section */}
      <div className="mb-10 text-center">
        <div className="mb-3 flex justify-center">
          <Badge variant="fard" dot>
            হানাফি মাজহাব ও সহীহ হাদিস ভিত্তিক সম্পূর্ণ গাইড
          </Badge>
        </div>

        <h1 className="bangla-text mb-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
          <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent dark:from-emerald-400 dark:to-emerald-600">
            সকল নামাজের তালিকা ও নিয়ম
          </span>
        </h1>
        <p className="bangla-text mx-auto max-w-2xl text-base text-gray-600 dark:text-dark-text-secondary sm:text-lg">
          প্রতিদিনের ৫ ওয়াক্ত নামাজ থেকে শুরু করে জুমআ, দুই ঈদ, জানাজা, নফল ও বিশেষ পরিস্থিতির সকল সালাতের নির্ভরযোগ্য নিয়ম ও দলিল।
        </p>
      </div>

      {/* Interactive Prayer Hub Client Component */}
      <PrayerHubClient prayers={prayers} />
    </div>
  );
}

