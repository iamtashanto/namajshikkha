import { Metadata } from "next";
import { PrayerTimesClient } from "@/src/components/prayer/PrayerTimesClient";

export const metadata: Metadata = {
  title:
    "নামাজের সময়সূচী — ৫ ওয়াক্ত সালাত, তাহাজ্জুদ ও নিষিদ্ধ সময় | নামাজ শিক্ষা",
  description:
    "বাংলাদেশের ৬৪টি জেলা ও বিশ্বের যেকোনো শহরের আজকের সঠিক ৫ ওয়াক্ত নামাজের সময়সূচী, তাহাজ্জুদ, ইশরাক, সেহরি ও ইফতারের সময় এবং নামাজের ৩টি নিষিদ্ধ ওয়াক্ত।",
  keywords: [
    "নামাজের সময়সূচী",
    "আজকের নামাজের সময়",
    "prayer times bangladesh",
    "namaz time dhaka",
    "ফজরের সময়",
    "সেহরি ও ইফতারের সময়সূচী",
    "তাহাজ্জুদের সময়",
    "নামাজের নিষিদ্ধ সময়",
  ],
  alternates: {
    canonical: "/prayer-times",
  },
};

export default function PrayerTimesPage() {
  return <PrayerTimesClient />;
}
