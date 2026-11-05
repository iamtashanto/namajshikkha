import { Metadata } from "next";
import { QiblaClient } from "@/src/components/qibla/QiblaClient";

export const metadata: Metadata = {
  title: "কিবলা কম্পাস — সঠিক কাবার দিকনির্ণয় | নামাজ শিক্ষা",
  description:
    "অফলাইনে সরাসরি ডিভাইস কম্পাস সেন্সর ও জিপিএস ব্যবহার করে পবিত্র কাবা শরীফের সঠিক দিক ও ডিগ্রি জানুন। বাংলাদেশের ৬৪ জেলা ও বিশ্বের যেকোনো শহরের কিবলা দিক।",
  keywords: [
    "কিবলা কম্পাস",
    "কাবার দিক",
    "কিবলা দিক",
    "Qibla compass",
    "Qibla direction online",
    "নামাজ শিক্ষা",
  ],
  alternates: {
    canonical: "/qibla",
  },
};

export default function QiblaPage() {
  return <QiblaClient />;
}

