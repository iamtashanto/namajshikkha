import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  PlayCircle,
  AlertCircle,
  HelpCircle,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Users,
} from "lucide-react";
import {
  prayers,
  getPrayerBySlug,
  prayerDuas,
  getRulingById,
  getRulingBySlug,
} from "@/src/data";
import { siteConfig } from "@/src/config/site";
import { toBengaliNumber } from "@/src/lib/bengali";
import { buildPrayerHowToSchema } from "@/src/lib/seo/schema";
import {
  Breadcrumbs,
  Badge,
  BadgeVariant,
  Card,
  Callout,
  ArabicBlock,
  ReferenceChip,
  Accordion,
} from "@/src/components/ui";
import { PrayerInteractiveGuide } from "@/src/components/prayer/PrayerInteractiveGuide";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  const params = prayers.map((p) => ({
    slug: p.slug,
  }));
  // Add alias for Dhuhr / Zuhr
  params.push({ slug: "zuhr" });
  return params;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const prayer = getPrayerBySlug(slug);

  if (!prayer) {
    return {
      title: "নামাজ পাওয়া যায়নি",
    };
  }

  const title = `${prayer.nameBn} নামাজ কত রাকাত ও পড়ার সঠিক নিয়ম — ${prayer.nameEn} Prayer Rules, Niyyah & Rakats | নামাজ শিক্ষা`;
  const description = `${prayer.nameBn} নামাজ কত রাকাত, কোনটা ফরজ, কোনটা সুন্নত আর কোনটা নফল? ${prayer.nameBn} নামাজের সঠিক নিয়ম, বাংলা ও আরবি নিয়ত, ওয়াক্ত, তাকবীর, রুকু-সিজদা ও সহীহ হাদিস ভিত্তিক ফজিলত।`;

  return {
    title,
    description,
    keywords: [
      `${prayer.nameBn} নামাজ`,
      `${prayer.nameBn} নামাজ কত রাকাত`,
      `${prayer.nameBn} নামাজের নিয়ম`,
      `${prayer.nameBn} নামাজের নিয়্যত`,
      `${prayer.nameBn} নামাজের সময়`,
      `${prayer.nameBn} নামাজের রাকাত`,
      `${prayer.nameBn} নামাজের ফজিলত`,
      `${prayer.nameBn} namaz koto rakat`,
      `${prayer.nameBn} namaz rules`,
      `${prayer.nameEn} prayer rakats`,
      `${prayer.nameEn} salah rules`,
      prayer.nameAr,
      "নামাজ শিক্ষা",
      "হানাফি ফিকহ",
      "ফরজ নামাজ",
      "সুন্নত নামাজ",
      "নফল নামাজ",
    ],
    alternates: {
      canonical: `${siteConfig.url}/namaj/${prayer.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/namaj/${prayer.slug}`,
      siteName: siteConfig.name,
      locale: "bn_BD",
      type: "article",
    },
  };
}

const categoryBadgeMap: Record<
  string,
  { variant: BadgeVariant; label: string }
> = {
  fard: { variant: "fard", label: "ফরজ নামাজ" },
  wajib: { variant: "wajib", label: "ওয়াজিব নামাজ" },
  "sunnah-muakkadah": { variant: "sunnah", label: "সুন্নাতে মুয়াক্কাদাহ" },
  "sunnah-ghair-muakkadah": {
    variant: "sunnah",
    label: "সুন্নাতে গায়রে মুয়াক্কাদাহ",
  },
  nafl: { variant: "nafl", label: "নফল নামাজ" },
  special: { variant: "gold", label: "বিশেষ নামাজ" },
};

export default async function PrayerDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const prayer = getPrayerBySlug(slug);

  if (!prayer) {
    notFound();
  }

  const badgeInfo = categoryBadgeMap[prayer.category] || {
    variant: "neutral" as BadgeVariant,
    label: prayer.category,
  };

  // Structured Data (JSON-LD) for SEO
  const faqSchema = prayer.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: prayer.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }
    : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "হোম",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "নামাজ",
        item: `${siteConfig.url}/namaj`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: prayer.nameBn,
        item: `${siteConfig.url}/namaj/${prayer.slug}`,
      },
    ],
  };

  const howToSchema = buildPrayerHowToSchema(prayer);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: "নামাজ", href: "/namaj" },
          { label: prayer.nameBn },
        ]}
      />

      {/* Header Section */}
      <div className="mb-10 text-center">
        <div className="mb-3 flex justify-center gap-2">
          <Badge variant={badgeInfo.variant} dot>
            {badgeInfo.label}
          </Badge>
          <Badge variant="neutral">হানাফি ফিকহ</Badge>
        </div>

        <p className="arabic-text mb-2 text-3xl font-bold text-emerald-700 dark:text-emerald-400 sm:text-4xl">
          {prayer.nameAr}
        </p>

        <h1 className="bangla-text mb-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
          <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent dark:from-emerald-400 dark:to-emerald-600">
            {prayer.nameBn} নামাজের নিয়ম ও পূর্ণ বিবরণ
          </span>
        </h1>

        <p className="text-sm font-medium text-gray-500 dark:text-dark-text-muted mb-6">
          {prayer.nameEn} Salah Guide
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`/simulator?prayer=${prayer.slug}`}
            className="bangla-text inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-200 transition-all hover:bg-emerald-700 hover:shadow-lg dark:shadow-emerald-950/40"
          >
            <PlayCircle className="h-4 w-4" />
            <span>সিমুলেটরে দেখুন</span>
          </Link>

          <a
            href="#step-by-step"
            className="bangla-text inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-50 dark:border-dark-border dark:bg-dark-card dark:text-emerald-300 dark:hover:bg-dark-card-hover"
          >
            <BookOpen className="h-4 w-4" />
            <span>ধাপে ধাপে নিয়ম</span>
          </a>
        </div>
      </div>

      <div className="space-y-10">
        {/* এক নজরে (Summary Card) */}
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/50 via-white to-white dark:from-emerald-950/20 dark:via-dark-card dark:to-dark-card">
          <div className="border-b border-emerald-100 pb-4 dark:border-dark-border">
            <h2 className="bangla-text text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              এক নজরে {prayer.nameBn} নামাজ
            </h2>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Time Window */}
            <div>
              <span className="bangla-text text-xs font-semibold text-gray-500 dark:text-dark-text-muted">
                ওয়াক্ত বা নামাজের সময়:
              </span>
              <p className="bangla-text text-sm font-medium text-gray-800 dark:text-dark-text-secondary mt-1 leading-relaxed">
                {prayer.timeDescriptionBn}
              </p>
            </div>

            {/* Total Rakats */}
            <div>
              <span className="bangla-text text-xs font-semibold text-gray-500 dark:text-dark-text-muted">
                মোট রাকাত সংখ্যা:
              </span>
              <p className="bangla-text text-lg font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                {prayer.slug === "janaza"
                  ? "৪ তাকবীর (দাঁড়িয়ে আদায়, রুকু-সেজদাবিহীন)"
                  : prayer.rakatUnits[0]?.config.rakatRange
                  ? `${toBengaliNumber(prayer.totalRakats)} রাকাত (ঐচ্ছিক সীমা: ${toBengaliNumber(prayer.rakatUnits[0].config.rakatRange[0])}–${toBengaliNumber(prayer.rakatUnits[0].config.rakatRange[1])} রাকাত)`
                  : `${toBengaliNumber(prayer.totalRakats)} রাকাত`}
              </p>
            </div>
          </div>

          {/* Rakat Units Breakdown */}
          <div className="mt-5 border-t border-emerald-100 pt-4 dark:border-dark-border">
            <span className="bangla-text text-xs font-semibold text-gray-600 dark:text-dark-text-muted mb-2 block">
              রাকাতের বিন্যাস ও হুকুম:
            </span>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {prayer.rakatUnits.map((unit, index) => {
                const uBadge = categoryBadgeMap[unit.status] || {
                  variant: "neutral" as BadgeVariant,
                  label: unit.status,
                };
                return (
                  <Link
                    key={index}
                    href={`/simulator?prayer=${prayer.slug}&unit=${index}`}
                    title={`${unit.label} সিমুলেটরে দেখুন`}
                    className="group flex items-center justify-between rounded-xl border border-emerald-100 bg-white p-3 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40 dark:border-dark-border dark:bg-dark-card-hover"
                  >
                    <span className="bangla-text flex items-center gap-2 text-sm font-semibold text-gray-800 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
                      <PlayCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{unit.label}</span>
                    </span>
                    <Badge variant={uBadge.variant} dot>
                      {uBadge.label}
                    </Badge>
                  </Link>
                );
              })}
            </div>
          </div>
        </Card>

        {/* সালাতুত তাসবীহ ৩০০ তাসবীহের বণ্টন ছক */}
        {prayer.rakatUnits[0]?.config.tasbihDistribution && (
          <Card className="border-purple-200 bg-purple-50/40 dark:border-purple-900/40 dark:bg-purple-950/20">
            <div className="border-b border-purple-200 pb-3 dark:border-dark-border">
              <h3 className="bangla-text text-lg font-bold text-purple-950 dark:text-purple-300">
                সালাতুত তাসবীহ: প্রতি রাকাতে ৭৫ বার ও মোট ৩০০ তাসবীহের অবস্থান বণ্টন
              </h3>
              <p className="bangla-text text-xs text-purple-900/80 dark:text-purple-200 mt-1">
                প্রতি রাকাতে নিম্নোক্ত ৭টি স্থানে মোট ৭৫ বার তাসবীহ (&ldquo;সুবহানাল্লাহি ওয়াল হামদুলিল্লাহি ওয়া লা ইলাহা ইল্লাল্লাহু ওয়াল্লাহু আকবার&rdquo;) পড়তে হয় (৪ রাকাতে মোট ৩০০ বার):
              </p>
            </div>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-purple-200 text-purple-950 dark:border-dark-border dark:text-purple-300">
                    <th className="py-2.5 px-3 font-bold">নামাজের অবস্থান</th>
                    <th className="py-2.5 px-3 font-bold text-center">তাসবীহ সংখ্যা</th>
                    <th className="py-2.5 px-3 font-bold text-right">মোট (৪ রাকাতে)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100 dark:divide-dark-border">
                  {prayer.rakatUnits[0].config.tasbihDistribution.map((item, idx) => (
                    <tr key={idx} className="text-gray-800 dark:text-dark-text-secondary">
                      <td className="py-2 px-3 font-medium bangla-text">
                        {idx + 1}. {item.labelBn}
                      </td>
                      <td className="py-2 px-3 text-center font-bold text-emerald-700 dark:text-emerald-400">
                        {item.count} বার
                      </td>
                      <td className="py-2 px-3 text-right font-semibold">
                        {item.count * 4} বার
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-purple-100/70 font-bold text-purple-950 dark:bg-purple-950/50 dark:text-purple-300">
                    <td className="py-2.5 px-3 bangla-text">সর্বমোট তাসবীহ সংখ্যা</td>
                    <td className="py-2.5 px-3 text-center">৭৫ বার (প্রতি রাকাতে)</td>
                    <td className="py-2.5 px-3 text-right">৩০০ বার</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* ফযিলত ও গুরুত্ব (Fazilat Section) */}
        {prayer.fazilat && (
          <div className="rounded-2xl border border-emerald-200/90 bg-emerald-50/50 p-5 dark:border-dark-border dark:bg-dark-card sm:p-6">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h2 className="bangla-text text-lg font-bold text-gray-900 dark:text-white">
                {prayer.nameBn} নামাজের ফযিলত ও মর্যাদা
              </h2>
            </div>
            <p className="bangla-text text-base leading-relaxed text-gray-800 dark:text-dark-text-secondary">
              &ldquo;{prayer.fazilat.textBn}&rdquo;
            </p>
            {prayer.fazilat.reference && (
              <div className="mt-3">
                <ReferenceChip reference={prayer.fazilat.reference} />
              </div>
            )}
          </div>
        )}

        {/* নিয়্যত (Niyyat Section) */}
        <section className="space-y-4">
          <div className="border-b border-emerald-100 pb-3 dark:border-dark-border">
            <h2 className="bangla-text text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              {prayer.nameBn} নামাজের নিয়্যত
            </h2>
          </div>

          <Callout type="info" title="নিয়্যত সংক্রান্ত শরয়ী বিধান">
            নিয়্যত মূলত <strong>অন্তরের সংকল্প বা ইচ্ছা</strong>। মুখে আরবি বা বাংলায় বাক্য উচ্চারণ করা নামাজ শুদ্ধ হওয়ার শর্ত বা বাধ্যতামূলক নয়; বরং অন্তরে স্পষ্ট জানা যে &ldquo;আমি এই ওয়াক্তের এত রাকাত নামাজ আল্লাহর সন্তুষ্টির উদ্দেশ্যে আদায় করছি&rdquo;—ইহাই নিয়্যত। তবে অন্তরের সংকল্পকে দৃঢ় করার সুবিধার্থে মুখে উচ্চারণ করাও বৈধ ও প্রচলিত।
          </Callout>

          {/* 4-Layer Display of Niyyat */}
          <div className="pt-2">
            <ArabicBlock
              title={prayer.niyyat.titleBn}
              arabic={prayer.niyyat.arabic}
              uccharon={prayer.niyyat.uccharonBn}
              banglish={prayer.niyyat.banglish}
              meaning={prayer.niyyat.meaningBn}
            />
          </div>
        </section>

        {/* বিশেষ বিধানসমূহ (Special Rules, if any) */}
        {prayer.specialRules && prayer.specialRules.length > 0 && (
          <section className="space-y-4">
            <div className="border-b border-emerald-100 pb-3 dark:border-dark-border">
              <h2 className="bangla-text text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                জরুরি বিধান ও বিশেষ মাসায়েল
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {prayer.specialRules.map((rule, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-purple-200 bg-purple-50/60 p-5 dark:border-purple-900/40 dark:bg-purple-950/20"
                >
                  <h3 className="bangla-text text-lg font-bold text-purple-950 dark:text-purple-300 mb-2">
                    {rule.title}
                  </h3>
                  <p className="bangla-text text-sm leading-relaxed text-purple-900 dark:text-purple-200">
                    {rule.description}
                  </p>
                  {rule.reference && (
                    <div className="mt-3">
                      <ReferenceChip reference={rule.reference} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ধাপে ধাপে নামাজের নিয়ম (Interactive Step-by-Step Guide) */}
        <section id="step-by-step" className="space-y-4 scroll-mt-20">
          <div className="border-b border-emerald-100 pb-3 dark:border-dark-border">
            <h2 className="bangla-text text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              ধাপে ধাপে {prayer.nameBn} নামাজ আদায়ের নিয়ম
            </h2>
            <p className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted mt-1">
              তাকবীরে তাহরীমা থেকে সালাম পর্যন্ত প্রতিটি রুকন ও দোয়ার বিস্তারিত ধারাবাহিকতা।
            </p>
          </div>

          <PrayerInteractiveGuide
            steps={prayer.steps}
            duas={prayerDuas}
            prayerNameBn={prayer.nameBn}
          />
        </section>

        {/* পুরুষ ও মহিলাদের নামাজের পার্থক্য (Gender Differences Section) */}
        {prayer.genderDifferences && (
          <section className="space-y-4">
            <div className="border-b border-emerald-100 pb-3 dark:border-dark-border">
              <h2 className="bangla-text text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                পুরুষ ও মহিলাদের নামাজের প্রধান পার্থক্যসমূহ
              </h2>
              <p className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted mt-1">
                হানাফি ফিকহে মহিলাদের সতরের পূর্ণ পর্দা ও বিনম্রতার স্বার্থে কিছু অঙ্গে সুস্পষ্ট পার্থক্য রয়েছে।
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Men's Column */}
              <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 dark:border-blue-900/40 dark:bg-blue-950/20">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs">
                    পু
                  </span>
                  <h3 className="bangla-text text-lg font-bold text-blue-900 dark:text-blue-300">
                    পুরুষদের নিয়ম
                  </h3>
                </div>
                <ul className="space-y-2">
                  {prayer.genderDifferences.male.map((item, idx) => (
                    <li
                      key={idx}
                      className="bangla-text text-sm text-blue-950 dark:text-blue-200 flex items-start gap-2 leading-relaxed"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-2 shrink-0 dark:bg-blue-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Women's Column */}
              <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5 dark:border-rose-900/40 dark:bg-rose-950/20">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-600 text-white font-bold text-xs">
                    মহি
                  </span>
                  <h3 className="bangla-text text-lg font-bold text-rose-900 dark:text-rose-300">
                    মহিলাদের নিয়ম
                  </h3>
                </div>
                <ul className="space-y-2">
                  {prayer.genderDifferences.female.map((item, idx) => (
                    <li
                      key={idx}
                      className="bangla-text text-sm text-rose-950 dark:text-rose-200 flex items-start gap-2 leading-relaxed"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-600 mt-2 shrink-0 dark:bg-rose-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {prayer.genderDifferences.note && (
              <p className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted italic text-center">
                * {prayer.genderDifferences.note}
              </p>
            )}
          </section>
        )}

        {/* সাধারণ ভুলসমূহ (Common Mistakes) */}
        {prayer.commonMistakes && prayer.commonMistakes.length > 0 && (
          <section className="space-y-4">
            <div className="border-b border-amber-100 pb-3 dark:border-dark-border">
              <h2 className="bangla-text text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                {prayer.nameBn} নামাজে সচরাচর ঘটা ভুলসমূহ
              </h2>
            </div>

            <div className="rounded-2xl border border-amber-200/90 bg-amber-50/60 p-5 dark:border-amber-900/40 dark:bg-amber-950/20 sm:p-6">
              <ul className="space-y-3">
                {prayer.commonMistakes.map((mistake, idx) => (
                  <li
                    key={idx}
                    className="bangla-text flex items-start gap-3 text-sm text-amber-950 dark:text-amber-200 leading-relaxed"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-amber-800 font-bold text-xs dark:bg-amber-900 dark:text-amber-300">
                      {idx + 1}
                    </span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* প্রায়শই জিজ্ঞাসিত প্রশ্ন (FAQ Section with Accordion) */}
        {prayer.faqs && prayer.faqs.length > 0 && (
          <section className="space-y-4">
            <div className="border-b border-emerald-100 pb-3 dark:border-dark-border">
              <h2 className="bangla-text text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                {prayer.nameBn} নামাজ সম্পর্কে জরুরি প্রশ্নোত্তর
              </h2>
            </div>

            <Accordion
              allowMultiple
              defaultExpandedIds={[0]}
              items={prayer.faqs.map((faq, idx) => ({
                id: idx,
                title: faq.question,
                content: (
                  <p className="bangla-text text-sm leading-relaxed text-gray-700 dark:text-dark-text-secondary">
                    {faq.answer}
                  </p>
                ),
              }))}
            />
          </section>
        )}

        {/* সম্পর্কিত অন্যান্য নামাজ (Related Prayers) */}
        {prayer.relatedPrayers && prayer.relatedPrayers.length > 0 && (
          <section className="space-y-4">
            <div className="border-b border-emerald-100 pb-3 dark:border-dark-border">
              <h2 className="bangla-text text-xl font-bold text-gray-900 dark:text-white">
                সম্পর্কিত অন্যান্য নামাজ
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {prayer.relatedPrayers.map((relSlug) => {
                const rel = getPrayerBySlug(relSlug);
                if (!rel) return null;

                return (
                  <Link
                    key={rel.slug}
                    href={`/namaj/${rel.slug}`}
                    className="group flex items-center justify-between rounded-xl border border-emerald-100 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-xs dark:border-dark-border dark:bg-dark-card dark:hover:border-emerald-800"
                  >
                    <div>
                      <h3 className="bangla-text text-base font-bold text-gray-900 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
                        {rel.nameBn}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-dark-text-muted">
                        {rel.nameEn}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* প্রাসঙ্গিক জরুরি মাসায়েল (Related Masail) */}
        {prayer.relatedRulings && prayer.relatedRulings.length > 0 && (
          <section className="space-y-4">
            <div className="border-b border-emerald-100 pb-3 dark:border-dark-border">
              <h2 className="bangla-text text-xl font-bold text-gray-900 dark:text-white">
                প্রাসঙ্গিক জরুরি মাসায়েল ও বিধান
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {prayer.relatedRulings.map((rulingId) => {
                const ruling = getRulingById(rulingId) || getRulingBySlug(rulingId);
                if (!ruling) return null;

                return (
                  <Link
                    key={ruling.id}
                    href={`/masail/${ruling.slug}`}
                    className="group flex items-center justify-between rounded-xl border border-emerald-100 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-xs dark:border-dark-border dark:bg-dark-card dark:hover:border-emerald-800"
                  >
                    <div>
                      <h3 className="bangla-text text-base font-bold text-gray-900 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
                        {ruling.titleBn}
                      </h3>
                      <p className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted line-clamp-1 mt-0.5">
                        {ruling.summaryBn}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform shrink-0 ml-3" />
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* তথ্যসূত্র ও হাদিস রেফারেন্স (References Section) */}
        {prayer.references && prayer.references.length > 0 && (
          <section className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5 dark:border-dark-border dark:bg-dark-card sm:p-6">
            <h2 className="bangla-text text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              তথ্যসূত্র ও ফিকহী সনদ
            </h2>
            <div className="flex flex-wrap gap-2">
              {prayer.references.map((ref, idx) => (
                <ReferenceChip key={idx} reference={ref} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
