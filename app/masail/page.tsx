import { Metadata } from "next";
import { salahRulings } from "@/src/data/rulings";
import { Breadcrumbs, Badge } from "@/src/components/ui";
import { MasailHubClient } from "@/src/components/masail/MasailHubClient";
import { siteConfig } from "@/src/config/site";

export const metadata: Metadata = {
  title: "নামাজের মাসায়েল ও জরুরি বিধানাবলী — নামাজ শিক্ষা",
  description:
    "নামাজের শর্ত, আরকান, ওয়াজিবাত, সুন্নাত, নামাজ ভঙ্গের কারণ, মাকরূহাত, সিজদায়ে সাহুর নিয়ম, সিজদায়ে তিলাওয়াত, মাসবূক, কাযা, মুসাফির, অসুস্থ ব্যক্তির নামাজ ও নারীদের বিধান। হানাফি ফিকহ ও হাদিস ভিত্তিক পূর্ণাঙ্গ গাইড।",
  keywords: [
    "নামাজের মাসায়েল",
    "সিজদায়ে সাহু",
    "নামাজের ওয়াজিব",
    "নামাজ ভঙ্গের কারণ",
    "নামাজের মাকরূহাত",
    "সিজদায়ে তিলাওয়াত",
    "মাসবূকের নামাজ",
    "কাযা নামাজ",
    "মুসাফিরের নামাজ",
    "অসুস্থ ব্যক্তির নামাজ",
    "হানাফি ফিকহ",
  ],
  alternates: {
    canonical: `${siteConfig.url}/masail`,
  },
  openGraph: {
    title: "নামাজের মাসায়েল ও জরুরি বিধানাবলী — নামাজ শিক্ষা",
    description:
      "হানাফি ফিকহ ও বিশুদ্ধ হাদিসের আলোকে নামাজের সকল জরুরি মাসায়েল ও ইন্টারেক্টিভ ডিসিশন গাইড।",
    url: `${siteConfig.url}/masail`,
    siteName: siteConfig.name,
    locale: "bn_BD",
    type: "website",
  },
};

export default function MasailHubPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: "মাসায়েল" }]} />

      {/* Header Section */}
      <div className="mb-10 text-center">
        <div className="mb-3 flex justify-center">
          <Badge variant="wajib" dot>
            হানাফি ফিকহ ও বিশুদ্ধ হাদিস ভিত্তিক পূর্ণাঙ্গ গাইড
          </Badge>
        </div>

        <h1 className="bangla-text mb-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
          <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent dark:from-emerald-400 dark:to-emerald-600">
            নামাজের প্রয়োজনীয় মাসায়েল ও বিধান
          </span>
        </h1>
        <p className="bangla-text mx-auto max-w-2xl text-base text-gray-600 dark:text-dark-text-secondary sm:text-lg">
          নামাজের শর্ত-আরকান থেকে শুরু করে ভুলত্রুটি সংশোধন, সিজদায়ে সাহু, জামাত, সফর ও বিশেষ পরিস্থিতির প্রামাণ্য শরয়ী ফতোয়া ও সমাধান।
        </p>
      </div>

      {/* Interactive Masail Hub Client Component */}
      <MasailHubClient rulings={salahRulings} />
    </div>
  );
}
