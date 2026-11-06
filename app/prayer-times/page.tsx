import { Metadata } from "next";
import { PrayerTimesClient } from "@/src/components/prayer/PrayerTimesClient";
import { siteConfig } from "@/src/config/site";
import { JsonLd } from "@/src/components/seo/JsonLd";
import { BANGLADESH_DISTRICTS } from "@/src/data/locations";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "আজকের নামাজের সময়সূচী ও ক্যালেন্ডার — ৫ ওয়াক্ত সালাত, সেহরি, ইফতার, সূর্যোদয় ও সূর্যাস্ত | নামাজ শিক্ষা",
  description: "বাংলাদেশের ৬৪টি জেলা ও বিশ্বের যেকোনো শহরের আজকের সঠিক ৫ ওয়াক্ত নামাজের সময়সূচী, সেহরি ও ইফতারের শেষ সময়, সূর্যোদয় ও সূর্যাস্তের সময়, তাহাজ্জুদ, ইশরাক, চাশত, রোজা এবং ৩টি নিষিদ্ধ ওয়াক্ত। আরবি, বাংলা ও ইংরেজি তারিখসহ ক্যালেন্ডার।",
  keywords: [
    "নামাজের সময়সূচী",
    "আজকের নামাজের সময়",
    "আজকের নামাজের সময়সূচী",
    "আজকের সেহরি ও ইফতারের সময়",
    "সূর্যোদয় ও সূর্যাস্তের সময়",
    "আজকের সূর্যোদয়ের সময়",
    "আজকের সূর্যাস্তের সময়",
    "আজকের আরবি তারিখ",
    "আজকের বাংলা তারিখ",
    "রোজার সময়সূচী",
    "রমজান ক্যালেন্ডার",
    "prayer times bangladesh",
    "namaz time dhaka",
    "ফজরের সময়",
    "যোহরের সময়",
    "আসরের সময়",
    "মাগরিবের সময়",
    "ইশার সময়",
    "তাহাজ্জুদের সময়",
    "নামাজের নিষিদ্ধ সময়",
    "নামাজ শিক্ষা",
  ],
  alternates: {
    canonical: `${siteConfig.url}/prayer-times`,
  },
  openGraph: {
    title: "আজকের সঠিক ৫ ওয়াক্ত নামাজের সময়সূচী, সেহরি-ইফতার, সূর্যোদয় ও সূর্যাস্ত — নামাজ শিক্ষা",
    description: "৬৪ জেলার নির্ভুল নামাজের ওয়াক্ত, রোজা, সেহরি, ইফতার, সূর্যোদয় ও সূর্যাস্ত এবং ৩টি মাকরুহ ওয়াক্ত।",
    url: `${siteConfig.url}/prayer-times`,
    siteName: siteConfig.name,
    locale: "bn_BD",
    type: "website",
  },
};

const mainPrayerFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "আজকের ৫ ওয়াক্ত নামাজের সময়সূচী কিভাবে জানা যায়?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "আমাদের প্ল্যাটফর্মে বাংলাদেশের ৬৪টি জেলা ও বিশ্বের যেকোনো শহরের জন্য প্রতিদিনের নির্ভুল ফজর, যোহর, আসর, মাগরিব ও ইশার সময়সূচী স্বয়ংক্রিয় জ্যোতির্বিজ্ঞান সূত্র ও হানাফি মাযহাব অনুসারে প্রদর্শিত হয়।",
      },
    },
    {
      "@type": "Question",
      "name": "আজকের সেহরি ও ইফতারের সময় কখন?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "সেহরির শেষ সময় ফজরের ওয়াক্ত শুরুর সাথে সাথে এবং ইফতারের সময় শুরু হয় ঠিক সূর্যাস্তের (মাগরিবের ওয়াক্ত) সাথে সাথে। আমাদের সাইটে আপনার জেলা নির্বাচন করে তাৎক্ষণিক সঠিক সেহরি ও ইফতারের সময় দেখে নিতে পারেন।",
      },
    },
    {
      "@type": "Question",
      "name": "আজকের সূর্যোদয় ও সূর্যাস্তের সময় কখন এবং নামাজের নিষিদ্ধ সময় কোনগুলো?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "প্রতিদিনের সূর্যোদয়ের সাথে ১৫ মিনিট এবং সূর্যাস্তের পূর্বের ১৫ মিনিট ও ঠিক দ্বিপ্রহরে নামাজ আদায় করা নিষিদ্ধ (মাকরুহে তাহরিমি)। সূর্য অস্ত যাওয়ার সাথে সাথে মাগরিব ও ইফতারের ওয়াক্ত শুরু হয়।",
      },
    },
    {
      "@type": "Question",
      "name": "আজকের আরবি (হিজরি) ও বাংলা তারিখ কত?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "আমাদের ওয়েবসাইটে ইসলামিক হিজরি তারিখ (চাঁদের হিসাব অনুযায়ী) এবং বাংলা একাডেমির সংশোধিত বঙ্গাব্দ সন ও গ্রেগরীয় ইংরেজি তারিখ প্রতিদিন লাইভ আপডেট হয়।",
      },
    },
  ],
};

export default function PrayerTimesPage() {
  return (
    <>
      <JsonLd schema={mainPrayerFaqSchema} />
      <PrayerTimesClient />

      {/* Bangladesh 64 Districts SEO Navigation Section */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
          <MapPin className="h-4 w-4" />
          <span>সকল জেলা ভিত্তিক নামাজের সময়সূচী ও ক্যালেন্ডার</span>
        </div>
        <h2 className="bangla-text text-2xl font-bold text-gray-900 dark:text-white mb-2">
          বাংলাদেশের ৬৪ জেলার প্রতিদিনের সঠিক নামাজের সময় দেখতে ঘুরে আসতে পারেন
        </h2>
        <p className="bangla-text text-sm text-gray-600 dark:text-dark-text-secondary mb-6 max-w-3xl">
          আপনার জেলার নামের উপর ক্লিক করে সরাসরি সেই জেলার আজকের সূর্যোদয়, সূর্যাস্ত, সেহরি, ইফতার ও ৫ ওয়াক্ত নামাজের সময়সূচী দেখুন:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5">
          {BANGLADESH_DISTRICTS.map((dist) => (
            <Link
              key={dist.id}
              href={`/prayer-times/${dist.id}`}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-2.5 text-xs font-semibold text-gray-800 shadow-sm transition-all hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800 dark:border-dark-border dark:bg-dark-card dark:text-dark-text-secondary dark:hover:bg-dark-card-hover dark:hover:text-emerald-400"
            >
              <span>{dist.nameBn}</span>
              <ArrowRight className="h-3 w-3 opacity-40" />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
