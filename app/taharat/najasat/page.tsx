import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  Droplets,
  Sparkles,
} from "lucide-react";
import { getTaharatSectionBySlug } from "@/src/data/taharat";
import {
  Breadcrumbs,
  Badge,
  Accordion,
  ReferenceChip,
  ArabicBlock,
} from "@/src/components/ui";

export const metadata: Metadata = {
  title: "নাপাকি ও পবিত্রকরণের মাসায়েল — গালীজাহ ও খাফীফাহ নাপাকির বিধান | নামাজ শিক্ষা",
  description:
    "হানাফি ফিকহের আলোকে ভারী (গালীয়াহ) ও হালকা (খাফীফাহ) নাপাকির তালিকা, ক্ষমাযোগ্য সীমা, কাপড় ধোয়ার শরয়ী নিয়ম এবং এস্তেঞ্জার আদব।",
  keywords: [
    "নাপাকি দূর করার নিয়ম",
    "নাজাসাতে গালীজাহ",
    "নাজাসাতে খাফীফাহ",
    "কাপড় পবিত্র করার নিয়ম",
    "হানাফি ফিকহ",
    "নামাজ শিক্ষা",
  ],
};

export default function NajasatPage() {
  const section = getTaharatSectionBySlug("najasat");

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
          <Badge variant="rose" dot>
            পোশাক, শরীর ও স্থান
          </Badge>
          <Badge variant="neutral">হানাফি ফিকহ</Badge>
        </div>

        <p className="arabic-text mb-2 text-3xl font-bold text-rose-700 dark:text-rose-400 sm:text-4xl">
          {section.titleAr}
        </p>

        <h1 className="bangla-text mb-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
          <span className="bg-gradient-to-r from-rose-600 to-pink-700 bg-clip-text text-transparent dark:from-rose-400 dark:to-pink-500">
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

      {/* Quranic Ayah */}
      <div className="mb-10">
        <ArabicBlock
          id="ayah-najasat"
          title="পোশাক ও শরীর পবিত্র রাখার বিষয়ে কুরআনের নির্দেশ"
          arabic="وَثِيَابَكَ فَطَهِّرْ وَالرُّجْزَ فَاهْجُرْ"
          uccharon="ওয়া সিয়াবাকা ফাতাহহির, ওয়ার-রুজযা ফাহজ়ুর।"
          banglish="Wa thiyabaka fatahhir, war-rujza fahjur."
          meaning="এবং আপনার পরিচ্ছদ পবিত্র রাখুন এবং অপবিত্রতা থেকে দূরে থাকুন।"
          reference="সূরা আল-মুদ্দাসসির ৭৪:৪-৫"
        />
      </div>

      <div className="space-y-12">
        {/* নাপাকির দুই প্রকার ও ক্ষমাযোগ্য সীমা */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="h-6 w-6 text-rose-600 dark:text-rose-400" />
            <h2 className="bangla-text text-2xl font-bold text-gray-900 dark:text-white">
              নাপাকির প্রকারভেদ ও ক্ষমাযোগ্য সীমা
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {section.farzList?.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-rose-200 bg-gradient-to-br from-rose-50/60 to-white p-6 shadow-sm dark:border-rose-900/40 dark:from-rose-950/20 dark:to-dark-card"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="bangla-text text-lg font-bold text-rose-900 dark:text-rose-200">
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

        {/* নাপাকি দূর করার শরয়ী নিয়ম */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Droplets className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <h2 className="bangla-text text-2xl font-bold text-gray-900 dark:text-white">
              নাপাকি দূর করার শরয়ী নিয়ম ও পদ্ধতি
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {section.sunnahList?.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm dark:border-dark-border dark:bg-dark-card"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="bangla-text text-base font-bold text-emerald-800 dark:text-emerald-300">
                    {item.title}
                  </h3>
                  {item.reference && <ReferenceChip reference={item.reference} />}
                </div>
                <p className="bangla-text text-xs leading-relaxed text-gray-600 dark:text-dark-text-secondary">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* এস্তেঞ্জার আদব ও সতর্কতা কলআউট */}
        <div className="rounded-3xl border border-teal-200 bg-teal-50/60 p-6 dark:border-teal-900/40 dark:bg-teal-950/20">
          <h3 className="bangla-text text-lg font-bold text-teal-900 dark:text-teal-200 mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            এস্তেঞ্জা ও ইস্তিবরার সুন্নাহ আদব
          </h3>
          <ul className="space-y-2 text-xs leading-relaxed text-gray-700 dark:text-dark-text-secondary">
            <li>• পেশাব-পায়খানার জন্য প্রবেশের পূর্বে &apos;আল্লাহুম্মা ইন্নি আউযু বিকা মিনাল খুবুসি ওয়াল খাবায়িস&apos; দোয়া পাঠ করা।</li>
            <li>• বাঁ পা দিয়ে শৌচাগারে প্রবেশ করা এবং ডান পা দিয়ে বের হওয়া।</li>
            <li>• কিবলার দিকে মুখ বা পিঠ দিয়ে না বসা।</li>
            <li>• ডান হাত দিয়ে যৌনাঙ্গ স্পর্শ না করা; বাঁ হাত দ্বারা পানি ও টিস্যু দিয়ে পরিচ্ছন্নতা অর্জন করা।</li>
            <li>• পেশাবের ফোঁটা পুরোপুরি বন্ধ হয়েছে নিশ্চিত না হওয়া পর্যন্ত (ইস্তিবরা) কিছুক্ষণ অপেক্ষা করা বা সামান্য চলাফেরা করা।</li>
          </ul>
        </div>

        {/* FAQs */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="bangla-text text-xl font-bold text-gray-900 dark:text-white">
              নাপাকি ও পবিত্রকরণ সংক্রান্ত প্রশ্নোত্তর (FAQ)
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
              পরবর্তী বিশেষ সুবিধা
            </span>
            <h4 className="bangla-text text-lg font-bold text-gray-900 dark:text-white">
              চামড়ার মোজায় মাসেহের বিধান
            </h4>
            <p className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted">
              শর্তাবলি, সময়সীমা ও সুতি মোজা সম্পর্কে নিরপেক্ষ পর্যালোচনা
            </p>
          </div>

          <Link
            href="/taharat/masah-on-socks"
            className="bangla-text inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 dark:shadow-emerald-950/40"
          >
            <span>মোজায় মাসেহের নিয়ম দেখুন</span>
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