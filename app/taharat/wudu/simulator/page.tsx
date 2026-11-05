import { Metadata } from "next";
import { WuduSimulatorClient } from "@/src/components/taharat/WuduSimulatorClient";

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

