import { Suspense } from "react";
import { Metadata } from "next";
import { siteConfig } from "@/src/config/site";
import { NamajSimulatorClient } from "@/src/components/simulator/NamajSimulatorClient";

export const metadata: Metadata = {
  title: "ইন্টারঅ্যাক্টিভ নামাজ সিমুলেটর — ধাপে ধাপে দেখে নামাজ শিখুন",
  description:
    "হানাফি ফিকহ অনুযায়ী পুরুষ ও মহিলাদের নামাজের প্রতিটি রাকাত, অবস্থান, রুকু, সিজদা, তাসবীহ এবং ৪-স্তরের আরবি-বাংলা উচ্চারণ ও অডিওসহ ইন্টারঅ্যাক্টিভ নামাজ সিমুলেটর।",
  keywords: [
    "নামাজ সিমুলেটর",
    "নামাজ শিক্ষা",
    "ধাপে ধাপে নামাজ",
    "পুরুষ ও মহিলার নামাজ",
    "হানাফি নামাজ সিমুলেটর",
    "salah simulator",
    "namaj simulator bangla",
  ],
  alternates: {
    canonical: `${siteConfig.url}/simulator`,
  },
  openGraph: {
    title: "ইন্টারঅ্যাক্টিভ নামাজ সিমুলেটর — নামাজ শিক্ষা",
    description:
      "ধাপে ধাপে অ্যানিমেটেড ফিগার, উচ্চারণ এবং অডিওসহ ফরজ, ওয়াজিব, সুন্নাত, ঈদ ও জানাজার নামাজ শিখুন।",
    url: `${siteConfig.url}/simulator`,
    siteName: siteConfig.name,
    locale: "bn_BD",
    type: "website",
  },
};

export default function SimulatorPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
          <p className="bangla-text mt-4 text-sm font-medium text-gray-600 dark:text-dark-text-secondary">
            নামাজ সিমুলেটর লোড হচ্ছে...
          </p>
        </div>
      }
    >
      <NamajSimulatorClient />
    </Suspense>
  );
}
