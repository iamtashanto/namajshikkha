import { Suspense } from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { siteConfig } from "@/src/config/site";

const NamajPracticeClient = dynamic(
  () =>
    import("@/src/components/simulator/NamajPracticeClient").then(
      (mod) => mod.NamajPracticeClient
    ),
  {
    loading: () => (
      <div className="mx-auto min-h-[640px] max-w-6xl px-4 py-12 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
        <p className="bangla-text mt-4 text-sm font-medium text-gray-600 dark:text-dark-text-secondary">
          অনুশীলন মোড লোড হচ্ছে...
        </p>
      </div>
    ),
  }
);

export const metadata: Metadata = {
  title: "নামাজ অনুশীলন ও কুইজ মোড — সিমুলেটর | নামাজ শিক্ষা",
  description:
    "প্রতিটি ধাপে অবস্থান, দোয়া, তাসবীহ সংখ্যা ও সূরা মিলানোর বিধানের ইন্টারঅ্যাক্টিভ কুইজের মাধ্যমে নামাজের নিয়ম ও সিজদায়ে সাহুর মাসায়েল যাচাই করুন।",
  alternates: {
    canonical: `${siteConfig.url}/simulator/practice`,
  },
};

export default function SimulatorPracticePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
          <p className="bangla-text mt-4 text-sm font-medium text-gray-600 dark:text-dark-text-secondary">
            অনুশীলন মোড লোড হচ্ছে...
          </p>
        </div>
      }
    >
      <NamajPracticeClient />
    </Suspense>
  );
}

