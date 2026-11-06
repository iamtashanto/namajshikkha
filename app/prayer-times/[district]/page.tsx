import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BANGLADESH_DISTRICTS, ALL_LOCATIONS } from "@/src/data/locations";
import { PrayerTimesClient } from "@/src/components/prayer/PrayerTimesClient";
import { calculatePrayerTimes, DEFAULT_PRAYER_SETTINGS } from "@/src/lib/prayer-times/calculator";
import {
  formatBanglaTime,
  formatGregorianDateBn,
  formatHijriDate,
  formatBanglaDate,
} from "@/src/lib/prayer-times/dates";
import { JsonLd } from "@/src/components/seo/JsonLd";
import { siteConfig } from "@/src/config/site";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

export const dynamic = "force-static";

export function generateStaticParams() {
  return ALL_LOCATIONS.map((loc) => ({
    district: loc.id,
  }));
}

interface PageProps {
  params: Promise<{ district: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { district } = await params;
  const location = ALL_LOCATIONS.find((l) => l.id.toLowerCase() === district.toLowerCase());

  if (!location) {
    return {
      title: "নামাজের সময়সূচী | নামাজ শিক্ষা",
    };
  }

  const today = new Date();
  const times = calculatePrayerTimes(today, {
    ...DEFAULT_PRAYER_SETTINGS,
    location,
  });

  const title = `${location.nameBn} জেলার আজকের সঠিক নামাজের সময়সূচী ও ক্যালেন্ডার — ${location.nameEn} Prayer Times | নামাজ শিক্ষা`;
  const description = `${location.nameBn} জেলার প্রতিদিনের সঠিক নামাজের সময় দেখতে ঘুরে আসতে পারেন। আজকের ফজরের সময় ${formatBanglaTime(times.fajr)}, যোহর ${formatBanglaTime(times.dhuhr)}, আসর ${formatBanglaTime(times.asr)}, মাগরিব ${formatBanglaTime(times.maghrib)}, ইশা ${formatBanglaTime(times.isha)}, সেহরি ও ইফতারের সময়, তাহাজ্জুদ ও নিষিদ্ধ সময়সূচী।`;

  const canonicalUrl = `${siteConfig.url}/prayer-times/${location.id}`;

  return {
    title,
    description,
    keywords: [
      `${location.nameBn} নামাজের সময়`,
      `${location.nameBn} জেলার নামাজের সময়সূচী`,
      `${location.nameBn} আজকের নামাজের সময়সূচী`,
      `${location.nameBn} সেহরি ও ইফতারের সময়`,
      `${location.nameEn} prayer times`,
      `namaz time ${location.nameEn.toLowerCase()}`,
      `${location.nameBn} ফজর জোহর আসর মাগরিব ইশা`,
      `${location.nameBn} রমজান ক্যালেন্ডার`,
      "নামাজের সময়সূচী বাংলাদেশ",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: "bn_BD",
      type: "website",
    },
  };
}

export default async function DistrictPrayerTimesPage({ params }: PageProps) {
  const { district } = await params;
  const location = ALL_LOCATIONS.find((l) => l.id.toLowerCase() === district.toLowerCase());

  if (!location) {
    notFound();
  }

  const today = new Date();
  const times = calculatePrayerTimes(today, {
    ...DEFAULT_PRAYER_SETTINGS,
    location,
  });

  const gregDateBn = formatGregorianDateBn(today, true);
  const hijriDateBn = formatHijriDate(today);
  const banglaDateBn = formatBanglaDate(today);

  // Structured Data Schema for Google AI, Search Engine snippets, and Rich Results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `${location.nameBn} জেলায় আজকের ৫ ওয়াক্ত নামাজের সময়সূচী কী?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${location.nameBn} জেলায় আজকের নামাজের সঠিক সময়সূচী: ফজর শুরু ${formatBanglaTime(times.fajr)}, সূর্যোদয় ${formatBanglaTime(times.sunrise)}, যোহর ${formatBanglaTime(times.dhuhr)}, আসর ${formatBanglaTime(times.asr)}, মাগরিব (ইফতার) ${formatBanglaTime(times.maghrib)}, এবং ইশা ${formatBanglaTime(times.isha)}। তাহাজ্জুদের শেষ ওয়াক্ত (সেহরির শেষ সময়) ${formatBanglaTime(times.fajr)}।`,
        },
      },
      {
        "@type": "Question",
        "name": `${location.nameBn} জেলায় কোন কোন সময়ে নামাজ পড়া সম্পূর্ণ নিষিদ্ধ?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `হাদিস অনুযায়ী দিনে ৩টি সময়ে সকল প্রকার সালাত আদায় করা মাকরুহে তাহরিমি বা নিষিদ্ধ: ১) সূর্যোদয়ের সময় (${formatBanglaTime(times.sunrise)} হতে ১৫ মিনিট), ২) ঠিক দ্বিপ্রহরে বা সূর্য মধ্যাকাশে থাকাকালীন (যোহরের ঠিক ১৫ মিনিট পূর্বে), ৩) সূর্যাস্তের সময় (${formatBanglaTime(times.maghrib)} এর ১৫ মিনিট পূর্ব হতে সূর্যাস্ত পর্যন্ত)।`,
        },
      },
      {
        "@type": "Question",
        "name": "দৈনিক পাঁচ ওয়াক্ত নামাজে মোট কত রাকাত নামাজ পড়তে হয়?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "দৈনিক ৫ ওয়াক্তে সর্বমোট ১৭ রাকাত ফরজ নামাজ আবশ্যকভাবে পড়তেই হয়। এর সাথে ৩ রাকাত বিতর ওয়াজিব এবং ১২ রাকাত সুন্নাতে মুয়াক্কাদাহ (ফজর ২, যোহর ৪+২, মাগরিব ২, ইশা ২) পড়া অতি গুরুত্বপূর্ণ সুন্নাহ। মোট ফরজ, ওয়াজিব ও সুন্নাত মিলিয়ে সাধারণ নিয়মে ৩২ রাকাত এবং নফলসহ সর্বোচ্চ ৪৮ রাকাত পর্যন্ত পড়া যায়।",
        },
      },
      {
        "@type": "Question",
        "name": `${location.nameBn} জেলায় আজকের সেহরি ও ইফতারের সময় কখন?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `${location.nameBn} জেলায় আজকের সেহরির শেষ সময় ফজরের ওয়াক্ত শুরুর সাথে সাথে ${formatBanglaTime(times.fajr)} এবং সূর্যাস্তের সাথে সাথে ইফতারের সময় শুরু ${formatBanglaTime(times.maghrib)}।`,
        },
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "হোম",
        "item": siteConfig.url,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "নামাজের সময়সূচী",
        "item": `${siteConfig.url}/prayer-times`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `${location.nameBn} জেলা`,
        "item": `${siteConfig.url}/prayer-times/${location.id}`,
      },
    ],
  };

  return (
    <>
      <JsonLd schema={[faqSchema, breadcrumbSchema]} />

      {/* District Dedicated SEO & Answer Box Section */}
      <div className="bg-emerald-950 text-emerald-100 py-8 px-4 sm:px-6 lg:px-8 border-b border-emerald-900/60">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-400">
                <MapPin className="h-4 w-4" />
                <span>
                  {location.divisionBn ? `${location.divisionBn} বিভাগ • ` : ""}
                  {location.countryBn}
                </span>
              </div>
              <h1 className="bangla-text mt-1 text-2xl sm:text-3xl font-bold text-white">
                {location.nameBn} জেলার প্রতিদিনের সঠিক নামাজের সময়সূচী
              </h1>
              <p className="bangla-text mt-2 text-sm text-emerald-300/90 max-w-3xl leading-relaxed">
                <strong>{location.nameBn} জেলার প্রতিদিনের সঠিক নামাজের সময় দেখতে ঘুরে আসতে পারেন</strong> — সহীহ জ্যোতির্বিজ্ঞান সূত্র ও হানাফি মাযহাব অনুসারে প্রস্তুতকৃত {location.nameBn} ({location.nameEn}) জেলার ফজরের সময়, যোহরের সময়, আসর, মাগরিব, ইশা এবং সেহরি-ইফতারের নির্ভুল সময়সূচী।
              </p>
            </div>

            {/* Live Today's Date Box */}
            <div className="rounded-2xl border border-emerald-800/80 bg-emerald-900/40 p-4 text-right">
              <p className="bangla-text text-xs text-gold-400 font-semibold">{hijriDateBn}</p>
              <p className="bangla-text text-sm font-bold text-white mt-0.5">{gregDateBn}</p>
              <p className="bangla-text text-xs text-emerald-300/80 mt-0.5">বঙ্গাব্দ: {banglaDateBn}</p>
            </div>
          </div>

          {/* Quick AI Answer Box: Instant Answer for Google AI Overview & Users */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            <div className="rounded-xl bg-white/5 p-3 border border-white/10 text-center">
              <span className="text-xs text-emerald-300">ফজর</span>
              <p className="bangla-text text-base sm:text-lg font-bold text-white mt-1">
                {formatBanglaTime(times.fajr)}
              </p>
              <span className="text-[10px] text-emerald-400/80">সূর্যোদয় {formatBanglaTime(times.sunrise)}</span>
            </div>
            <div className="rounded-xl bg-white/5 p-3 border border-white/10 text-center">
              <span className="text-xs text-emerald-300">যোহর</span>
              <p className="bangla-text text-base sm:text-lg font-bold text-white mt-1">
                {formatBanglaTime(times.dhuhr)}
              </p>
              <span className="text-[10px] text-emerald-400/80">৪ রাকাত ফরজ</span>
            </div>
            <div className="rounded-xl bg-white/5 p-3 border border-white/10 text-center">
              <span className="text-xs text-emerald-300">আসর</span>
              <p className="bangla-text text-base sm:text-lg font-bold text-white mt-1">
                {formatBanglaTime(times.asr)}
              </p>
              <span className="text-[10px] text-emerald-400/80">৪ রাকাত ফরজ</span>
            </div>
            <div className="rounded-xl bg-emerald-500/20 p-3 border border-emerald-400/30 text-center">
              <span className="text-xs text-gold-300 font-bold">মাগরিব (ইফতার)</span>
              <p className="bangla-text text-base sm:text-lg font-bold text-white mt-1">
                {formatBanglaTime(times.maghrib)}
              </p>
              <span className="text-[10px] text-emerald-300">৩ রাকাত ফরজ</span>
            </div>
            <div className="rounded-xl bg-white/5 p-3 border border-white/10 text-center">
              <span className="text-xs text-emerald-300">ইশা ও বিতর</span>
              <p className="bangla-text text-base sm:text-lg font-bold text-white mt-1">
                {formatBanglaTime(times.isha)}
              </p>
              <span className="text-[10px] text-emerald-400/80">৪ ফরজ + ৩ বিতর</span>
            </div>
            <div className="rounded-xl bg-gold-500/10 p-3 border border-gold-400/20 text-center">
              <span className="text-xs text-gold-300 font-semibold">সেহরি শেষ</span>
              <p className="bangla-text text-base sm:text-lg font-bold text-white mt-1">
                {formatBanglaTime(times.fajr)}
              </p>
              <span className="text-[10px] text-gold-400/80">তাহাজ্জুদ শুরু {formatBanglaTime(times.tahajjudStart)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Prayer Times Component Preset to this Location */}
      <PrayerTimesClient initialLocation={location} />

      {/* Nearby & Other Bangladesh Districts for SEO Interlinking */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="bangla-text text-xl font-bold text-gray-900 dark:text-white mb-4">
          বাংলাদেশের অন্যান্য জেলার প্রতিদিনের সঠিক নামাজের সময়সূচী
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {BANGLADESH_DISTRICTS.map((dist) => {
            const isCurrent = dist.id === location.id;
            return (
              <Link
                key={dist.id}
                href={`/prayer-times/${dist.id}`}
                className={`flex items-center justify-between rounded-xl p-2.5 text-xs font-semibold transition-all ${
                  isCurrent
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-bold"
                    : "border border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 dark:border-dark-border dark:bg-dark-card dark:text-dark-text-secondary dark:hover:bg-dark-card-hover dark:hover:text-emerald-400"
                }`}
              >
                <span>{dist.nameBn}</span>
                {!isCurrent && <ArrowRight className="h-3 w-3 opacity-40" />}
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}

