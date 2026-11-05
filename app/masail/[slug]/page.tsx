import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Users,
  Lightbulb,
} from "lucide-react";
import {
  salahRulings,
  getRulingBySlug,
  getPrayerBySlug,
} from "@/src/data";
import { siteConfig } from "@/src/config/site";
import {
  Breadcrumbs,
  Badge,
  BadgeVariant,
  Card,
  ReferenceChip,
  Accordion,
} from "@/src/components/ui";
import { DecisionTreeFlow } from "@/src/components/masail/DecisionTreeFlow";
import { TilawatAyahsTable } from "@/src/components/masail/TilawatAyahsTable";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return salahRulings.map((r) => ({
    slug: r.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const ruling = getRulingBySlug(slug);

  if (!ruling) {
    return {
      title: "মাসায়েল পাওয়া যায়নি — নামাজ শিক্ষা",
    };
  }

  const title = `${ruling.titleBn} — হানাফি ফিকহ ও হাদিস বিধান`;
  const description = `${ruling.summaryBn} হানাফি মাযহাবের প্রামাণ্য ফতোয়া, বিশুদ্ধ হাদিস ও বাস্তব উদাহরণসহ সম্পূর্ণ নির্দেশিকা।`;

  return {
    title,
    description,
    keywords: [
      ruling.titleBn,
      ruling.titleEn,
      "নামাজের মাসায়েল",
      "হানাফি ফিকহ",
      "নামাজ শিক্ষা",
      "শরয়ী বিধান",
    ],
    alternates: {
      canonical: `${siteConfig.url}/masail/${ruling.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/masail/${ruling.slug}`,
      siteName: siteConfig.name,
      locale: "bn_BD",
      type: "article",
    },
  };
}

const statusBadgeMap: Record<string, { variant: BadgeVariant; label: string }> = {
  fard: { variant: "fard", label: "ফরজ বিধান" },
  wajib: { variant: "wajib", label: "ওয়াজিব বিধান" },
  sunnah: { variant: "sunnah", label: "সুন্নাত আমল" },
  mustahab: { variant: "mustahab", label: "মুস্তাহাব ও আদব" },
  makruh: { variant: "gold", label: "মাকরূহাত" },
  haram: { variant: "gold", label: "মুফসিদাত / হারাম" },
};

export default async function MasailDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const ruling = getRulingBySlug(slug);

  if (!ruling) {
    notFound();
  }

  const badgeInfo = statusBadgeMap[ruling.status] || {
    variant: "neutral" as BadgeVariant,
    label: ruling.status,
  };

  // Structured Data (JSON-LD) for SEO
  const faqSchema = ruling.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: ruling.faqs.map((faq) => ({
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
        name: "মাসায়েল",
        item: `${siteConfig.url}/masail`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: ruling.titleBn,
        item: `${siteConfig.url}/masail/${ruling.slug}`,
      },
    ],
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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
          { label: "মাসায়েল", href: "/masail" },
          { label: ruling.titleBn },
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

        <h1 className="bangla-text mb-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
          <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent dark:from-emerald-400 dark:to-emerald-600">
            {ruling.titleBn}
          </span>
        </h1>

        <p className="text-sm font-medium text-gray-500 dark:text-dark-text-muted mb-6">
          {ruling.titleEn}
        </p>
      </div>

      <div className="space-y-10">
        {/* ১. সংক্ষেপে (Summary Box at Top) */}
        <div className="rounded-2xl border border-emerald-200/90 bg-gradient-to-br from-emerald-50/80 via-white to-white p-5 sm:p-6 shadow-xs dark:border-dark-border dark:from-emerald-950/20 dark:via-dark-card dark:to-dark-card">
          <div className="flex items-center gap-2 mb-2 text-emerald-800 dark:text-emerald-400">
            <Lightbulb className="h-5 w-5" />
            <h2 className="bangla-text text-base sm:text-lg font-bold">
              সংক্ষেপে মূল বিধান
            </h2>
          </div>
          <p className="bangla-text text-base leading-relaxed text-gray-800 dark:text-dark-text-secondary">
            {ruling.summaryBn}
          </p>
        </div>

        {/* ২. ইন্টারেক্টিভ ডিসিশন হেল্পার (যদি থাকে) */}
        {ruling.decisionTree && (
          <section className="space-y-3">
            <DecisionTreeFlow tree={ruling.decisionTree} />
          </section>
        )}

        {/* ৩. বিস্তারিত ব্যাখ্যা (Detailed Content) */}
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="border-b border-emerald-100 pb-3 dark:border-dark-border">
            <h2 className="bangla-text text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              বিস্তারিত শরয়ী ব্যাখ্যা ও বিবরণ
            </h2>
          </div>

          <div className="prose prose-emerald dark:prose-invert max-w-none bangla-text text-base leading-relaxed text-gray-800 dark:text-dark-text-secondary space-y-4">
            {ruling.bodyBn.split("\n\n").map((paragraph, idx) => {
              // Header handling
              if (paragraph.startsWith("### ")) {
                return (
                  <h3
                    key={idx}
                    className="text-xl font-bold text-gray-900 dark:text-white pt-2 border-b border-gray-100 pb-1.5 dark:border-dark-border"
                  >
                    {paragraph.replace("### ", "")}
                  </h3>
                );
              }
              if (paragraph.startsWith("#### ")) {
                return (
                  <h4
                    key={idx}
                    className="text-lg font-bold text-emerald-800 dark:text-emerald-400 pt-2"
                  >
                    {paragraph.replace("#### ", "")}
                  </h4>
                );
              }
              if (paragraph.startsWith("---")) {
                return (
                  <hr
                    key={idx}
                    className="border-emerald-100 dark:border-dark-border my-4"
                  />
                );
              }
              return (
                <p key={idx} className="whitespace-pre-line">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </Card>

        {/* ৪. সিজদায়ে তিলাওয়াতের ১৪টি আয়াতের তালিকা (যদি থাকে) */}
        {ruling.tilawatAyahs && ruling.tilawatAyahs.length > 0 && (
          <section className="space-y-3">
            <TilawatAyahsTable ayahs={ruling.tilawatAyahs} />
          </section>
        )}

        {/* ৫. বাস্তব উদাহরণসমূহ (Examples) */}
        {ruling.examples && ruling.examples.length > 0 && (
          <section className="space-y-4">
            <div className="border-b border-emerald-100 pb-3 dark:border-dark-border">
              <h2 className="bangla-text text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                বাস্তব উদাহরণ ও সমাধান
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {ruling.examples.map((example, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-xs dark:border-dark-border dark:bg-dark-card space-y-3"
                >
                  <h3 className="bangla-text text-lg font-bold text-gray-900 dark:text-white">
                    {idx + 1}. {example.title}
                  </h3>
                  <div className="rounded-xl border border-amber-200/60 bg-amber-50/60 p-3 dark:border-amber-900/40 dark:bg-amber-950/20">
                    <span className="bangla-text text-xs font-bold text-amber-900 dark:text-amber-300 block mb-0.5">
                      পরিস্থিতি:
                    </span>
                    <p className="bangla-text text-sm text-amber-950 dark:text-amber-200">
                      {example.situation}
                    </p>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <p className="bangla-text text-sm text-gray-700 dark:text-dark-text-secondary">
                      <strong className="text-gray-900 dark:text-white">শরয়ী হুকুম:</strong>{" "}
                      {example.ruling}
                    </p>
                    <p className="bangla-text text-sm text-emerald-800 dark:text-emerald-400 font-semibold">
                      <strong>করণীয়:</strong> {example.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ৬. পুরুষ ও মহিলার বিধানের পার্থক্য */}
        {ruling.genderDifferences && (
          <section className="space-y-4">
            <div className="border-b border-emerald-100 pb-3 dark:border-dark-border">
              <h2 className="bangla-text text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                পুরুষ ও মহিলার বিধানের পার্থক্য
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 dark:border-blue-900/40 dark:bg-blue-950/20">
                <h3 className="bangla-text text-lg font-bold text-blue-900 dark:text-blue-300 mb-3">
                  পুরুষদের ক্ষেত্রে:
                </h3>
                <ul className="space-y-2">
                  {ruling.genderDifferences.male.map((item, idx) => (
                    <li
                      key={idx}
                      className="bangla-text text-sm text-blue-950 dark:text-blue-200 flex items-start gap-2"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5 dark:border-rose-900/40 dark:bg-rose-950/20">
                <h3 className="bangla-text text-lg font-bold text-rose-900 dark:text-rose-300 mb-3">
                  মহিলাদের ক্ষেত্রে:
                </h3>
                <ul className="space-y-2">
                  {ruling.genderDifferences.female.map((item, idx) => (
                    <li
                      key={idx}
                      className="bangla-text text-sm text-rose-950 dark:text-rose-200 flex items-start gap-2"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-600 mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {ruling.genderDifferences.note && (
              <p className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted italic text-center">
                * {ruling.genderDifferences.note}
              </p>
            )}
          </section>
        )}

        {/* ৭. প্রায়শই জিজ্ঞাসিত প্রশ্ন (FAQ Section) */}
        {ruling.faqs && ruling.faqs.length > 0 && (
          <section className="space-y-4">
            <div className="border-b border-emerald-100 pb-3 dark:border-dark-border">
              <h2 className="bangla-text text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                জরুরি প্রশ্নোত্তর (FAQ)
              </h2>
            </div>

            <Accordion
              allowMultiple
              defaultExpandedIds={[0]}
              items={ruling.faqs.map((faq, idx) => ({
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

        {/* ৮. সম্পর্কিত অন্যান্য বিষয় ও নামাজ */}
        {((ruling.relatedTopics && ruling.relatedTopics.length > 0) ||
          (ruling.relatedPrayers && ruling.relatedPrayers.length > 0)) && (
          <section className="space-y-4">
            <div className="border-b border-emerald-100 pb-3 dark:border-dark-border">
              <h2 className="bangla-text text-xl font-bold text-gray-900 dark:text-white">
                সম্পর্কিত বিষয় ও নামাজসমূহ
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {ruling.relatedTopics?.map((relSlug) => {
                const rel = getRulingBySlug(relSlug);
                if (!rel) return null;

                return (
                  <Link
                    key={rel.id}
                    href={`/masail/${rel.slug}`}
                    className="group flex items-center justify-between rounded-xl border border-emerald-100 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-xs dark:border-dark-border dark:bg-dark-card dark:hover:border-emerald-800"
                  >
                    <div>
                      <span className="bangla-text text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                        মাসায়েল
                      </span>
                      <h3 className="bangla-text text-base font-bold text-gray-900 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
                        {rel.titleBn}
                      </h3>
                    </div>
                    <ArrowRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                );
              })}

              {ruling.relatedPrayers?.map((pSlug) => {
                const prayer = getPrayerBySlug(pSlug);
                if (!prayer) return null;

                return (
                  <Link
                    key={prayer.slug}
                    href={`/namaj/${prayer.slug}`}
                    className="group flex items-center justify-between rounded-xl border border-emerald-100 bg-white p-4 transition-all hover:border-emerald-300 hover:shadow-xs dark:border-dark-border dark:bg-dark-card dark:hover:border-emerald-800"
                  >
                    <div>
                      <span className="bangla-text text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                        নামাজ
                      </span>
                      <h3 className="bangla-text text-base font-bold text-gray-900 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
                        {prayer.nameBn}
                      </h3>
                    </div>
                    <ArrowRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ৯. তথ্যসূত্র ও হাদিস সনদ */}
        {ruling.references && ruling.references.length > 0 && (
          <section className="rounded-2xl border border-gray-200 bg-gray-50/70 p-5 dark:border-dark-border dark:bg-dark-card sm:p-6">
            <h2 className="bangla-text text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              দলিল ও ফিকহী রেফারেন্স
            </h2>
            <div className="flex flex-wrap gap-2">
              {ruling.references.map((ref, idx) => (
                <ReferenceChip key={idx} reference={ref} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
