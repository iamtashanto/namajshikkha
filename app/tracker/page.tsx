import { Metadata } from "next";
import { TrackerClient } from "@/src/components/tracker/TrackerClient";

export const metadata: Metadata = {
  title: "নামাজ ট্র্যাকার ও কাযা হিসাব — সম্পূর্ণ অফলাইন ও গোপনীয় | নামাজ শিক্ষা",
  description:
    "আপনার ৫ ওয়াক্ত ফরজ ও বিতর সালাত, জামাত, কাযা এবং নফল সালাতের ধারাবাহিক ট্র্যাকিং। মাসিক হিটম্যাপ, স্ট্রিক ও কাযা সালাত হিসাব। ১০০% অফলাইন ও সম্পূর্ণ নিজস্ব ডিভাইসে সংরক্ষিত।",
  keywords: [
    "নামাজ ট্র্যাকার",
    "নামাজ চেকলিস্ট",
    "কাযা নামাজ হিসাব",
    "prayer tracker",
    "qaza prayer counter",
    "নামাজ শিক্ষা",
  ],
  alternates: {
    canonical: "/tracker",
  },
};

export default function TrackerPage() {
  return <TrackerClient />;
}

