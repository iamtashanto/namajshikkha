import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prayerSurahs } from "@/src/data/surahs";
import { HifzMemorizeClient } from "@/src/components/hifz/HifzMemorizeClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return prayerSurahs.map((s) => ({
    id: s.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const surah = prayerSurahs.find((s) => s.id === id);

  if (!surah) {
    return {
      title: "সূরা হিফজ ও মুখস্থ অনুশীলন | নামাজ শিক্ষা",
    };
  }

  return {
    title: `সূরা ${surah.nameBn} হিফজ ও মুখস্থ অনুশীলন (${surah.nameAr}) | নামাজ শিক্ষা`,
    description: `সূরা ${surah.nameBn} (${surah.nameAr}) আয়াত ধরে ধরে অডিও ও স্পেসড রিপিটেশন সহ মুখস্থ করুন। আরবি লুকানো ও সেলফ-টেস্ট মোড।`,
    keywords: [
      `সূরা ${surah.nameBn} মুখস্থ`,
      `সূরা ${surah.nameBn} হিফজ`,
      `সূরা ${surah.nameBn} অডিও`,
      `${surah.nameEn} memorization`,
      "নামাজের সূরা মুখস্থ",
    ],
    alternates: {
      canonical: `/surah-dua/${surah.id}/hifz`,
    },
  };
}

export default async function HifzPage({ params }: PageProps) {
  const { id } = await params;
  const surah = prayerSurahs.find((s) => s.id === id);

  if (!surah) {
    notFound();
  }

  return <HifzMemorizeClient initialSurahId={surah.id} />;
}

