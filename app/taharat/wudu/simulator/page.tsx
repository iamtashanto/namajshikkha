import { Metadata } from "next";
import dynamic from "next/dynamic";

const WuduSimulatorClient = dynamic(
  () =>
    import("@/src/components/taharat/WuduSimulatorClient").then(
      (mod) => mod.WuduSimulatorClient
    ),
  {
    loading: () => (
      <div className="mx-auto min-h-[600px] max-w-5xl px-4 py-12 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
        <p className="bangla-text mt-4 text-sm font-medium text-gray-600 dark:text-dark-text-secondary">
          অযু সিমুলেটর লোড হচ্ছে...
        </p>
      </div>
    ),
  }
);

export const metadata: Metadata = {
  title:
    "ইন্টারঅ্যাক্টিভ অযু সিমুলেটর ও ধারাবাহিকতা কুইজ | নামাজ শিক্ষা (হানাফি)",
  description:
    "হানাফি ফিকহ অনুযায়ী পানি প্রবাহ অ্যানিমেশন, ৩ বার গণনা, অযুর শুরু ও শেষের ৪-স্তর দোয়া এবং অযুর ধাপসমূহের ধারাবাহিকতা যাচাই কুইজ (Practice Mode)।",
  keywords: [
    "অযু সিমুলেটর",
    "অজুর নিয়ম অ্যানিমেশন",
    "অযু কুইজ",
    "Wudu simulator",
    "অযুর ৪ ফরজ",
    "নামাজ শিক্ষা",
  ],
  alternates: {
    canonical: "/taharat/wudu/simulator",
  },
};

export default function WuduSimulatorPage() {
  return <WuduSimulatorClient />;
}

