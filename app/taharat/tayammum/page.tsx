import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Layers,
} from "lucide-react";
import { getTaharatSectionBySlug } from "@/src/data/taharat";
import {
  Breadcrumbs,
  Badge,
  Callout,
  Accordion,
  ReferenceChip,
  ArabicBlock,
} from "@/src/components/ui";
import { TaharatIllustration } from "@/src/components/taharat/TaharatIllustration";
import { toBengaliNumber } from "@/src/lib/bengali";

export const metadata: Metadata = {
  title: "তায়াম্মুমের সম্পূর্ণ নিয়ম — ৩ ফরজ ও মাটি দ্বারা পবিত্রতা | নামাজ শিক্ষা",
  description:
    "পানি না পেলে বা অসুস্থ হলে মাটি দ্বারা পবিত্রতা অর্জনের শরয়ী বিধান। তায়াম্মুম কখন জায়েজ, ৩টি ফরজ, ধারাবাহিক পদ্ধতি ও ভঙ্গের কারণসমূহ।",
  keywords: [
    "তায়াম্মুমের নিয়ম",
    "তায়াম্মুমের ফরজ",
    "মাটি দ্বারা পবিত্রতা",
    "Tayammum rules",
    "হানাফি ফিকহ",
    "নামাজ শিক্ষা",
  ],
};

export default function TayammumPage() {
  const section = getTaharatSectionBySlug("tayammum");

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
          <Badge variant="gold" dot>
            জরুরি অবকাশ (রুখসত)
          </Badge>
          <Badge variant="neutral">হানাফি ফিকহ</Badge>
        </div>

        <p className="arabic-text mb-2 text-3xl font-bold text-amber-700 dark:text-amber-400 sm:text-4xl">
          {section.titleAr}
        </p>

        <h1 className="bangla-text mb-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
          <span className="bg-gradient-to-r from-amber-600 to-orange-700 bg-clip-text text-transparent dark:from-amber-400 dark:to-orange-500">
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

      {/* Quranic Ayah of Tayammum */}
      <div className="mb-10">
        <ArabicBlock
          id="ayah-tayammum"
          title="তায়াম্মুমের বিষয়ে পবিত্র কুরআনের আয়াত"
          arabic="فَلَمْ تَجِدُوا مَاءً فَتَيَمَّمُوا صَعِيدًا طَيِّبًا فَامْسَحُوا بِوُجُوهِكُمْ وَأَيْدِيكُمْ مِنْهُ"
          uccharon="ফালাম তাজিদূ মা-আন ফাতায়াম্মামূ সাঈদান তাইয়্যিবান ফামসাহূ বি-উজূহিকুম ওয়া আইদিকুম মিনহু।"
          banglish="Falam tajidoo maa-an fatayammamoo sa'eedan tayyiban famsahoo bi-wujoohikum wa aydeekum minhu."
          meaning="অতঃপর যদি তোমরা পানি না পাও, তবে পবিত্র মাটি দ্বারা তায়াম্মুম কর; সুতরাং তা দ্বারা তোমাদের মুখমণ্ডল ও হাতসমূহ মাসেহ কর।"
          reference="সূরা আল-মায়িদাহ ৫:৬"
        />
      </div>

      <div className="space-y-12">
        {/* কখন তায়াম্মুম জায়েজ */}
        {section.specialCases && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Layers className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              <h2 className="bangla-text text-2xl font-bold text-gray-900 dark:text-white">
                তায়াম্মুমের শরয়ী কারণ ও উপাদান
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {section.specialCases.map((sc) => (
                <div
                  key={sc.title}
                  className="rounded-3xl border border-amber-200 bg-amber-50/40 p-5 dark:border-amber-900/40 dark:bg-amber-950/20"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="bangla-text text-base font-bold text-amber-900 dark:text-amber-200">
                      {sc.title}
                    </h3>
                    {sc.reference && <ReferenceChip reference={sc.reference} />}
                  </div>
                  <p className="bangla-text text-xs leading-relaxed text-gray-700 dark:text-dark-text-secondary">
                    {sc.bodyBn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* তায়াম্মুমের ৩টি ফরজ */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="bangla-text text-2xl font-bold text-gray-900 dark:text-white">
              তায়াম্মুমের ৩টি ফরজ
            </h2>
            <Badge variant="fard">একটি বাদ পড়লে তায়াম্মুম হবে না</Badge>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {section.farzList?.map((farz) => (
              <div
                key={farz.title}
                className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/70 via-white to-white p-5 shadow-sm dark:border-dark-border dark:from-emerald-950/20 dark:to-dark-card"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="bangla-text text-base font-bold text-emerald-800 dark:text-emerald-300">
                    {farz.title}
                  </h3>
                  {farz.reference && <ReferenceChip reference={farz.reference} />}
                </div>
                <p className="bangla-text text-xs leading-relaxed text-gray-700 dark:text-dark-text-secondary">
                  {farz.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ধারাবাহিক তায়াম্মুমের পদ্ধতি (Step by step) */}
        {section.steps && (
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              <h2 className="bangla-text text-2xl font-bold text-gray-900 dark:text-white">
                তায়াম্মুমের ধারাবাহিক পদ্ধতি (ধাপে ধাপে)
              </h2>
            </div>

            <div className="space-y-6">
              {section.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="rounded-3xl border border-amber-100 bg-white p-5 shadow-sm transition-all hover:border-amber-200 dark:border-dark-border dark:bg-dark-card sm:p-7"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-600 to-orange-600 text-sm font-bold text-white shadow-md shadow-amber-200 dark:shadow-none">
                        {toBengaliNumber(step.stepNumber)}
                      </div>
                      <div>
                        <span className="bangla-text text-xs font-semibold text-amber-700 dark:text-amber-400">
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
                        <Callout type="tip" title="সতর্কতা ও টিপস">
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

        {/* তায়াম্মুম ভঙ্গের কারণসমূহ */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-6 w-6 text-rose-600 dark:text-rose-400" />
            <h2 className="bangla-text text-2xl font-bold text-gray-900 dark:text-white">
              তায়াম্মুম ভঙ্গের কারণসমূহ
            </h2>
          </div>

          <div className="space-y-3">
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
              তায়াম্মুম সংক্রান্ত প্রশ্নোত্তর (FAQ)
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

        {/* Next Topic Navigation */}
        <div className="flex flex-col gap-4 rounded-3xl border border-emerald-200 bg-emerald-50/50 p-6 sm:flex-row sm:items-center sm:justify-between dark:border-dark-border dark:bg-dark-card">
          <div>
            <span className="bangla-text text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              পরবর্তী গুরুত্বপূর্ণ বিষয়
            </span>
            <h4 className="bangla-text text-lg font-bold text-gray-900 dark:text-white">
              নাপাকি ও পবিত্রকরণের মাসায়েল
            </h4>
            <p className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted">
              ভারী ও হালকা নাপাকির ক্ষমাযোগ্য সীমা এবং পরিষ্কারের নিয়ম
            </p>
          </div>

          <Link
            href="/taharat/najasat"
            className="bangla-text inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 dark:shadow-emerald-950/40"
          >
            <span>নাপাকির বিধান দেখুন</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
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
