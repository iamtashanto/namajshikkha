import { Metadata } from "next";
import namajRules from "@/data/namaj-rules.json";
import {
  Breadcrumbs,
  ArabicBlock,
  Callout,
  Badge,
  ReferenceChip,
} from "@/src/components/ui";

export const metadata: Metadata = {
  title: "নামাজের নিয়ম — ধাপে ধাপে সহীহ নামাজ শিক্ষা",
  description:
    "হানাফি মাজহাবের আলোকে সহীহ হাদিস ও কুরআনের রেফারেন্সসহ ধাপে ধাপে নামাজ পড়ার সম্পূর্ণ নিয়ম। অযু, তাকবীর, রুকু, সেজদা, সালাম ও পুরুষ-মহিলার পার্থক্য।",
};

export default function NamajRulesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumbs items={[{ label: "নামাজের নিয়ম" }]} />

      {/* Page Header */}
      <div className="mb-10 text-center">
        <div className="mb-3 flex justify-center">
          <Badge variant="fard" dot>
            হানাফি ফিকহ ও সহীহ হাদিস ভিত্তিক
          </Badge>
        </div>

        <h1 className="bangla-text mb-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent dark:from-emerald-400 dark:to-emerald-600">
            ধাপে ধাপে নামাজের নিয়ম
          </span>
        </h1>
        <p className="bangla-text mx-auto max-w-2xl text-base text-gray-600 dark:text-dark-text-secondary sm:text-lg">
          তাকবীরে তাহরীমা থেকে সালাম পর্যন্ত প্রতিটি রুকন, ওয়াজিব ও সুন্নাতের বিস্তারিত বিবরণ — আরবি, বাংলা উচ্চারণ, ব্যাংলিশ ও অর্থসহ।
        </p>
      </div>

      {/* Madhab & Fiqh Note Callout */}
      <div className="mb-10">
        <Callout type="hanafi" title="মাযহাব সংক্রান্ত বিশেষ জ্ঞাতব্য">
          এই নির্দেশিকায় বাংলাদেশে প্রচলিত <strong>হানাফি মাযহাবের</strong> নির্ভরযোগ্য ফতোয়া ও সুন্নাহর বিধান অনুসরণ করা হয়েছে। নামাজের কয়েকটি ক্ষেত্রে (যেমন হাত তোলা, হাত বাঁধা, রুকু, সেজদা ও বৈঠক) পুরুষ ও মহিলাদের নিয়মের সুনির্দিষ্ট পার্থক্য উল্লেখ রয়েছে। অন্য মাযহাবে সামান্য ভিন্নতা থাকতে পারে—ইসলামের সকল প্রতিষ্ঠিত মাযহাবই শ্রদ্ধেয়।
        </Callout>
      </div>

      {/* Timeline Steps */}
      <div className="relative">
        {/* Continuous Timeline Line */}
        <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-emerald-400 via-emerald-200 to-emerald-100 dark:from-emerald-600 dark:via-emerald-900 dark:to-dark-border sm:left-8" />

        <div className="space-y-10">
          {namajRules.map((step, index) => (
            <div key={step.id} className="relative flex items-start gap-4 sm:gap-7">
              {/* Step Number Circle */}
              <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 font-bold text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/40 sm:h-16 sm:w-16 text-base sm:text-xl">
                {step.step_number}
              </div>

              {/* Step Detail Card */}
              <div
                className={`flex-1 overflow-hidden rounded-3xl border border-emerald-100/90 bg-white p-5 shadow-sm transition-all duration-300 hover:border-emerald-200 hover:shadow-md dark:border-dark-border dark:bg-dark-card sm:p-7 ${
                  index === 0 ? "animate-fade-in-up" : ""
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h2 className="bangla-text text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                    {step.title_bn}
                  </h2>
                  {step.reference && (
                    <ReferenceChip source={step.reference} />
                  )}
                </div>

                <p className="mb-4 text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {step.title_en}
                </p>

                <p className="bangla-text mb-6 text-sm leading-relaxed text-gray-700 dark:text-dark-text-secondary sm:text-base">
                  {step.description_bn}
                </p>

                {/* ArabicBlock if Arabic Text Exists */}
                {step.arabic_text && (
                  <div className="mb-6">
                    <ArabicBlock
                      id={`step-${step.id}`}
                      title={step.title_bn}
                      arabic={step.arabic_text}
                      uccharon={step.bangla_pronunciation}
                      banglish={step.banglish}
                      meaning={step.bangla_meaning}
                      reference={step.reference}
                    />
                  </div>
                )}

                {/* Practical Tips & Gender Difference */}
                {step.tips_bn && (
                  <Callout type="tip" title="পুরুষ ও মহিলার নিয়ম / জরুরি টিপস">
                    {step.tips_bn}
                  </Callout>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Ayah Reference Quote */}
      <div className="mt-16 rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50/70 via-white to-emerald-50/40 p-6 text-center shadow-sm dark:border-emerald-800/40 dark:from-emerald-950/30 dark:via-dark-card dark:to-emerald-950/20 sm:p-8">
        <p className="arabic-text mb-3 text-2xl text-emerald-700 dark:text-emerald-300 sm:text-3xl">
          إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا
        </p>
        <p className="bangla-text text-base text-gray-700 dark:text-dark-text-secondary">
          &quot;নিশ্চয়ই নামাজ মু&apos;মিনদের উপর নির্দিষ্ট সময়ে ফরজ করা হয়েছে।&quot;
        </p>
        <div className="mt-2 flex justify-center">
          <ReferenceChip source="সূরা আন-নিসা" hadithNumber="৪:১০৩" />
        </div>
      </div>
    </div>
  );
}
