import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { getTaharatSectionBySlug } from "@/src/data/taharat";
import {
  Breadcrumbs,
  Badge,
  Accordion,
  ReferenceChip,
  ArabicBlock,
} from "@/src/components/ui";
import { WuduChecklistGuide } from "@/src/components/taharat/WuduChecklistGuide";

export const metadata: Metadata = {
  title: "অযুর সম্পূর্ণ নিয়ম — ৪ ফরজ, সুন্নাত ও ভঙ্গের ৮ কারণ | নামাজ শিক্ষা",
  description:
    "হানাফি মাযহাব ও সহীহ হাদিস অনুসারে অজুর ৪টি ফরজ, সুন্নাত, মুস্তাহাব, মাকরুহ, অজু ভঙ্গের ৮টি কারণ, দোয়া এবং ইন্টারেক্টিভ চেকলিস্ট নির্দেশিকা।",
  keywords: [
    "অজুর নিয়ম",
    "অজুর ৪ ফরজ",
    "অজু ভঙ্গের কারণ",
    "অজুর দোয়া",
    "Wudu guide",
    "নামাজ শিক্ষা",
    "হানাফি ফিকহ",
  ],
};

export default function WuduPage() {
  const section = getTaharatSectionBySlug("wudu");

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
          <Badge variant="fard" dot>
            সালাতের প্রাথমিক ফরজ
          </Badge>
          <Badge variant="neutral">হানাফি ফিকহ</Badge>
        </div>

        <p className="arabic-text mb-2 text-3xl font-bold text-emerald-700 dark:text-emerald-400 sm:text-4xl">
          {section.titleAr}
        </p>

        <h1 className="bangla-text mb-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
          <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent dark:from-emerald-400 dark:to-emerald-600">
            {section.titleBn}
          </span>
        </h1>

        <p className="text-sm font-medium text-gray-500 dark:text-dark-text-muted mb-4">
          {section.titleEn}
        </p>

        <p className="bangla-text mx-auto max-w-2xl text-base text-gray-600 dark:text-dark-text-secondary">
          {section.summaryBn}
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Link
            href="/taharat/wudu/simulator"
            className="bangla-text inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 dark:shadow-emerald-950/40"
          >
            <span>💧 অযু সিমুলেটরে দেখুন ও কুইজ দিন</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Quranic Ayah of Wudu */}
      <div className="mb-10">
        <ArabicBlock
          id="ayah-wudu"
          title="অজুর বিষয়ে পবিত্র কুরআনের নির্দেশ"
          arabic="يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ وَامْسَحُوا بِرُءُوسِكُمْ وَأَرْجُلَكُمْ إِلَى الْكَعْبَيْنِ"
          uccharon="ইয়া আইয়্যুহাল্লাযীনা আমানূ ইযা কুমতুম ইলাস-সালাতি ফাগসিলূ উজূহাকুম ওয়া আইদিয়াকুম ইলাল মারাকফিকি ওয়ামসাহূ বি-রুঊসিকুম ওয়া আরজুলাকুম ইলাল কা'বাইন।"
          banglish="Ya ayyuhalladhina amanoo idha qumtum ilas-salati faghsiloo wujoohakum wa aydiyakum ilal-marafiqi wamsahoo bi-ru'oosikum wa arjulakum ilal-ka'bayn."
          meaning="হে মুমিনগণ! যখন তোমরা সালাতের উদ্দেশ্যে দাঁড়াও, তখন তোমরা তোমাদের মুখমণ্ডল এবং হাতসমূহ কনুই পর্যন্ত ধৌত কর এবং তোমাদের মাথা মাসেহ কর এবং তোমাদের পা টাখনুসহ ধৌত কর।"
          reference="সূরা আল-মায়িদাহ ৫:৬"
        />
      </div>

      <div className="space-y-12">
        {/* ৪ ফরজ (4 Fard of Wudu) */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="bangla-text text-2xl font-bold text-gray-900 dark:text-white">
              অজুর ৪টি ফরজ
            </h2>
            <Badge variant="fard">একটি বাদ পড়লে অজু হবে না</Badge>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {section.farzList?.map((farz) => (
              <div
                key={farz.title}
                className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50/60 to-white p-5 shadow-sm dark:border-dark-border dark:from-emerald-950/20 dark:to-dark-card"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="bangla-text text-lg font-bold text-emerald-800 dark:text-emerald-300">
                    {farz.title}
                  </h3>
                  {farz.reference && <ReferenceChip reference={farz.reference} />}
                </div>
                <p className="bangla-text text-sm leading-relaxed text-gray-700 dark:text-dark-text-secondary">
                  {farz.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Step-by-Step with Checklist Mode */}
        {section.steps && (
          <div id="steps-section">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="bangla-text text-2xl font-bold text-gray-900 dark:text-white">
                  ধাপে ধাপে অজুর ধারাবাহিক নিয়ম
                </h2>
                <p className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted mt-0.5">
                  সুন্নাহ অনুযায়ী অজুর ৮টি ধারাবাহিক ধাপ
                </p>
              </div>
            </div>

            <WuduChecklistGuide steps={section.steps} />
          </div>
        )}

        {/* অজু ভঙ্গের ৮টি কারণ (Nawaqid-e-Wudu) */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-6 w-6 text-rose-600 dark:text-rose-400" />
            <h2 className="bangla-text text-2xl font-bold text-gray-900 dark:text-white">
              অজু ভঙ্গের ৮টি কারণ (নাওয়াকিদ-ই-অজু)
            </h2>
          </div>

          <div className="rounded-3xl border border-rose-200 bg-rose-50/40 p-5 dark:border-rose-900/40 dark:bg-rose-950/20 sm:p-7">
            <div className="space-y-4">
              {section.breakersList?.map((breaker, idx) => (
                <div
                  key={breaker.title}
                  className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm dark:bg-dark-card border border-rose-100 dark:border-dark-border"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-xs font-bold text-rose-700 dark:bg-rose-900/60 dark:text-rose-200">
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="bangla-text text-base font-bold text-gray-900 dark:text-white">
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
        </div>

        {/* অজুর সুন্নাতসমূহ */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="bangla-text text-2xl font-bold text-gray-900 dark:text-white">
              অজুর সুন্নাতসমূহ
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {section.sunnahList?.map((sunnah) => (
              <div
                key={sunnah.title}
                className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm dark:border-dark-border dark:bg-dark-card"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="bangla-text text-sm font-bold text-emerald-800 dark:text-emerald-300">
                    {sunnah.title}
                  </h3>
                  {sunnah.reference && (
                    <ReferenceChip reference={sunnah.reference} />
                  )}
                </div>
                <p className="bangla-text text-xs leading-relaxed text-gray-600 dark:text-dark-text-secondary">
                  {sunnah.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* মুস্তাহাব ও মাকরুহাত কলআউট */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Mustahab */}
          <div className="rounded-3xl border border-teal-200 bg-teal-50/50 p-5 dark:border-teal-900/40 dark:bg-teal-950/20">
            <h3 className="bangla-text text-base font-bold text-teal-900 dark:text-teal-200 mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-teal-500" />
              অজুর মুস্তাহাব ও আদবসমূহ
            </h3>
            <ul className="space-y-2">
              {section.mustahabList?.map((item) => (
                <li
                  key={item}
                  className="bangla-text text-xs text-gray-700 dark:text-dark-text-secondary flex items-start gap-2"
                >
                  <span className="text-teal-600 dark:text-teal-400">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Makruh */}
          <div className="rounded-3xl border border-amber-200 bg-amber-50/50 p-5 dark:border-amber-900/40 dark:bg-amber-950/20">
            <h3 className="bangla-text text-base font-bold text-amber-900 dark:text-amber-200 mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              অজুর মাকরুহাত (অপছন্দনীয় কাজ)
            </h3>
            <ul className="space-y-2">
              {section.makruhList?.map((item) => (
                <li
                  key={item}
                  className="bangla-text text-xs text-gray-700 dark:text-dark-text-secondary flex items-start gap-2"
                >
                  <span className="text-amber-600 dark:text-amber-400">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* বিশেষ অবস্থা: ব্যান্ডেজ ও মোজায় মাসেহ */}
        {section.specialCases && (
          <div>
            <h3 className="bangla-text text-xl font-bold text-gray-900 dark:text-white mb-4">
              বিশেষ অবস্থা ও শরয়ী বিধান
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {section.specialCases.map((sc) => (
                <div
                  key={sc.title}
                  className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-card"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="bangla-text text-base font-bold text-emerald-800 dark:text-emerald-300">
                      {sc.title}
                    </h4>
                    {sc.reference && <ReferenceChip reference={sc.reference} />}
                  </div>
                  <p className="bangla-text text-xs leading-relaxed text-gray-600 dark:text-dark-text-secondary">
                    {sc.bodyBn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQs */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="bangla-text text-xl font-bold text-gray-900 dark:text-white">
              অজু সংক্রান্ত প্রশ্নোত্তর (FAQ)
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
              পরবর্তী গুরুত্বপূর্ণ তাহারাত
            </span>
            <h4 className="bangla-text text-lg font-bold text-gray-900 dark:text-white">
              ফরজ গোসলের সম্পূর্ণ নিয়ম
            </h4>
            <p className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted">
              ৩ ফরজ, গোসল ওয়াজিব হওয়ার কারণ ও সুন্নাহ পদ্ধতি
            </p>
          </div>

          <Link
            href="/taharat/ghusl"
            className="bangla-text inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 dark:shadow-emerald-950/40"
          >
            <span>গোসলের নিয়ম দেখুন</span>
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
