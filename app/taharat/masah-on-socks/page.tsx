import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { getTaharatSectionBySlug } from "@/src/data/taharat";
import {
  Breadcrumbs,
  Badge,
  Callout,
  Accordion,
  ReferenceChip,
} from "@/src/components/ui";
import { TaharatIllustration } from "@/src/components/taharat/TaharatIllustration";
import { toBengaliNumber } from "@/src/lib/bengali";

export const metadata: Metadata = {
  title: "চামড়ার মোজায় মাসেহের বিধান — শর্তাবলি, সময় ও নিয়ম | নামাজ শিক্ষা",
  description:
    "হানাফি মাযহাব ও সহীহ হাদিস অনুসারে মোজায় মাসেহ করার ৬টি শর্ত, মুকীম ও মুসাফিরের সময়সীমা, মাসেহের পদ্ধতি এবং সুতি মোজা সম্পর্কে নিরপেক্ষ পর্যালোচনা।",
  keywords: [
    "মোজায় মাসেহের নিয়ম",
    "চামড়ার মোজা",
    "সুতি মোজায় মাসেহ",
    "Masah on Khuffain",
    "হানাফি ফিকহ",
    "নামাজ শিক্ষা",
  ],
};

export default function MasahOnSocksPage() {
  const section = getTaharatSectionBySlug("masah-on-socks");

  if (!section) {
    notFound();
  }

  // FAQ Schema JSON-LD
  const faqSchema = section.faqs.length
    ? {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: section.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    }
    : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "পবিত্রতা ও তাহারাত", href: "/taharat" },
          { label: section.titleBn },
        ]}
      />

      {/* Header */}
      <div className="mb-10 text-center">
        <div className="mb-3 flex justify-center gap-2">
          <Badge variant="purple" dot>
            সুন্নাহ সমর্থিত সুবিধা
          </Badge>
          <Badge variant="neutral">হানাফি ফিকহ</Badge>
        </div>

        <p className="arabic-text mb-2 text-3xl font-bold text-purple-700 dark:text-purple-400 sm:text-4xl">
          {section.titleAr}
        </p>

        <h1 className="bangla-text mb-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
          <span className="bg-gradient-to-r from-purple-600 to-indigo-700 bg-clip-text text-transparent dark:from-purple-400 dark:to-indigo-500">
            {section.titleBn}
          </span>
        </h1>

        <p className="text-sm font-medium text-gray-500 dark:text-dark-text-muted mb-4">
          {section.titleEn}
        </p>

        <p className="bangla-text mx-auto max-w-2xl text-base text-gray-600 dark:text-dark-text-secondary">
          {section.summaryBn}
        </p>
      </div>

      <div className="space-y-12">
        {/* মোজায় মাসেহের শর্তাবলি ও সময়সীমা */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <h2 className="bangla-text text-2xl font-bold text-gray-900 dark:text-white">
              মোজায় মাসেহের মৌলিক শর্ত ও সময়সীমা
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {section.farzList?.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-purple-200 bg-gradient-to-br from-purple-50/60 to-white p-6 shadow-sm dark:border-purple-900/40 dark:from-purple-950/20 dark:to-dark-card"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="bangla-text text-lg font-bold text-purple-900 dark:text-purple-200">
                    {item.title}
                  </h3>
                  {item.reference && <ReferenceChip reference={item.reference} />}
                </div>
                <p className="bangla-text text-sm leading-relaxed text-gray-700 dark:text-dark-text-secondary">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* মাসেহ করার সুন্নাহ পদ্ধতি (Step by step with illustration) */}
        {section.steps && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <h2 className="bangla-text text-2xl font-bold text-gray-900 dark:text-white">
                মোজায় মাসেহ করার সঠিক পদ্ধতি
              </h2>
            </div>

            <div className="space-y-6">
              {section.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="rounded-3xl border border-purple-100 bg-white p-5 shadow-sm transition-all hover:border-purple-200 dark:border-dark-border dark:bg-dark-card sm:p-7"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-sm font-bold text-white shadow-md shadow-purple-200 dark:shadow-none">
                        {toBengaliNumber(step.stepNumber)}
                      </div>
                      <div>
                        <span className="bangla-text text-xs font-semibold text-purple-700 dark:text-purple-400">
                          ধাপ {toBengaliNumber(step.stepNumber)}
                        </span>
                        <h3 className="bangla-text text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                          {step.titleBn}
                        </h3>
                        <p className="text-xs font-medium text-gray-400 dark:text-dark-text-muted">
                          {step.titleEn}
                        </p>
                      </div>
                    </div>

                    {step.reference && (
                      <ReferenceChip reference={step.reference} />
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-center">
                    <div className="md:col-span-1">
                      <TaharatIllustration
                        name={step.illustrationKey}
                        className="h-36 sm:h-40 w-full"
                        title={step.titleBn}
                      />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                      <p className="bangla-text text-sm leading-relaxed text-gray-700 dark:text-dark-text-secondary sm:text-base">
                        {step.descriptionBn}
                      </p>
                      {step.tipsBn && (
                        <Callout type="tip" title="হাদিসের প্রামাণ্য নীতি">
                          {step.tipsBn}
                        </Callout>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* সাধারণ সুতি মোজা প্রসঙ্গে নিরপেক্ষ শরয়ী পর্যালোচনা */}
        {section.specialCases && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <h2 className="bangla-text text-2xl font-bold text-gray-900 dark:text-white">
                সুতি ও সাধারণ মোজা সংক্রান্ত পর্যালোচনা
              </h2>
            </div>

            <div className="space-y-4">
              {section.specialCases.map((sc) => (
                <div
                  key={sc.title}
                  className="rounded-3xl border border-purple-200 bg-purple-50/40 p-6 dark:border-purple-900/40 dark:bg-purple-950/20 sm:p-7"
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="bangla-text text-lg font-bold text-purple-950 dark:text-purple-200">
                      {sc.title}
                    </h3>
                    {sc.reference && <ReferenceChip reference={sc.reference} />}
                  </div>
                  <p className="bangla-text text-sm leading-relaxed text-gray-700 dark:text-dark-text-secondary">
                    {sc.bodyBn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* মাসেহ ভঙ্গের কারণসমূহ */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-6 w-6 text-rose-600 dark:text-rose-400" />
            <h2 className="bangla-text text-2xl font-bold text-gray-900 dark:text-white">
              মোজায় মাসেহ ভঙ্গের কারণসমূহ
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {section.breakersList?.map((breaker, idx) => (
              <div
                key={breaker.title}
                className="flex items-start gap-3 rounded-2xl border border-rose-100 bg-rose-50/30 p-4 shadow-sm dark:border-dark-border dark:bg-rose-950/10"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-xs font-bold text-rose-700 dark:bg-rose-900/60 dark:text-rose-200">
                  {idx + 1}
                </span>
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="bangla-text text-sm font-bold text-gray-900 dark:text-white">
                      {breaker.title}
                    </h3>
                    {breaker.reference && (
                      <ReferenceChip reference={breaker.reference} />
                    )}
                  </div>
                  <p className="bangla-text text-xs leading-relaxed text-gray-600 dark:text-dark-text-secondary mt-1">
                    {breaker.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="bangla-text text-xl font-bold text-gray-900 dark:text-white">
              মোজায় মাসেহ সংক্রান্ত প্রশ্নোত্তর (FAQ)
            </h3>
          </div>

          <Accordion
            items={section.faqs.map((faq) => ({
              id: faq.question,
              title: faq.question,
              content: (
                <p className="bangla-text text-sm leading-relaxed text-gray-700 dark:text-dark-text-secondary">
                  {faq.answer}
                </p>
              ),
            }))}
          />
        </div>

        {/* Return to Taharat Hub / Namaj Rules */}
        <div className="flex flex-col gap-4 rounded-3xl border border-emerald-200 bg-emerald-50/50 p-6 sm:flex-row sm:items-center sm:justify-between dark:border-dark-border dark:bg-dark-card">
          <div>
            <span className="bangla-text text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              তাহারাত সম্পন্ন
            </span>
            <h4 className="bangla-text text-lg font-bold text-gray-900 dark:text-white">
              তাহারাত হাব ও নামাজ নির্দেশিকা
            </h4>
            <p className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted">
              অন্যান্য পবিত্রতার নিয়ম দেখুন অথবা সালাতের ধারাবাহিক নিয়মে প্রবেশ করুন
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/taharat"
              className="bangla-text inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-4 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-50 dark:border-dark-border dark:bg-dark-card dark:text-emerald-300"
            >
              <span>তাহারাত সূচী</span>
            </Link>
            <Link
              href="/namaj-rules"
              className="bangla-text inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 dark:shadow-emerald-950/40"
            >
              <span>নামাজের নিয়ম</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* References Footer */}
        <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-5 dark:border-dark-border dark:bg-dark-card/50">
          <h4 className="bangla-text text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-dark-text-muted mb-3">
            প্রামাণ্য রেফারেন্স:
          </h4>
          <div className="flex flex-wrap gap-2">
            {section.references.map((ref, idx) => (
              <ReferenceChip key={idx} reference={ref} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}