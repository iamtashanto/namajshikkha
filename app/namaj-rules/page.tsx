import { Metadata } from "next";
import namajRules from "@/data/namaj-rules.json";

export const metadata: Metadata = {
    title: "নামাজের নিয়ম — ধাপে ধাপে নামাজ শেখা",
    description:
        "সঠিকভাবে নামাজ পড়ার সম্পূর্ণ নিয়ম ধাপে ধাপে শিখুন। অযু, কিবলামুখী হওয়া, নিয়্যত, তাকবীর, রুকু, সেজদা, সালাম — সব কিছু বিস্তারিত।",
};

export default function NamajRulesPage() {
    return (
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
            {/* Page Header */}
            <div className="mb-12 text-center">
                <h1 className="bangla-text mb-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                    <span className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                        নামাজের নিয়ম
                    </span>
                </h1>
                <p className="bangla-text mx-auto max-w-xl text-gray-500">
                    ধাপে ধাপে সঠিকভাবে নামাজ পড়া শিখুন। প্রতিটি ধাপ বিস্তারিত
                    বর্ণনাসহ।
                </p>
            </div>

            {/* Timeline Steps */}
            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-300 via-emerald-200 to-transparent sm:left-8" />

                <div className="space-y-8">
                    {namajRules.map((step, index) => (
                        <div key={step.id} className="relative flex gap-5 sm:gap-7">
                            {/* Step Number Circle */}
                            <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-sm font-bold text-white shadow-md shadow-emerald-200 sm:h-16 sm:w-16 sm:text-base">
                                {step.step_number}
                            </div>

                            {/* Card */}
                            <div
                                className={`flex-1 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-emerald-200 sm:p-6 ${index === 0 ? "animate-fade-in-up" : ""
                                    }`}
                            >
                                <h2 className="bangla-text mb-1 text-lg font-bold text-gray-800 sm:text-xl">
                                    {step.title_bn}
                                </h2>
                                <p className="mb-3 text-xs font-medium text-emerald-500">
                                    {step.title_en}
                                </p>

                                <p className="bangla-text mb-4 text-sm leading-7 text-gray-600 sm:text-base">
                                    {step.description_bn}
                                </p>

                                {/* Arabic Text if present */}
                                {step.arabic_text && (
                                    <div className="mb-4 rounded-xl bg-emerald-50/70 p-4">
                                        <p className="arabic-text text-lg text-gray-800 sm:text-xl">
                                            {step.arabic_text.split("\n").map((line, i) => (
                                                <span key={i}>
                                                    {line}
                                                    {i < step.arabic_text!.split("\n").length - 1 && <br />}
                                                </span>
                                            ))}
                                        </p>
                                    </div>
                                )}

                                {/* Tips */}
                                {step.tips_bn && (
                                    <div className="rounded-lg border border-gold-200 bg-gold-50 px-4 py-3">
                                        <p className="bangla-text text-xs text-gold-700 sm:text-sm">
                                            💡 <strong>টিপস:</strong> {step.tips_bn}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary at bottom */}
            <div className="mt-14 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white p-6 text-center sm:p-8">
                <p className="arabic-text mb-3 text-xl text-emerald-600">
                    إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا
                </p>
                <p className="bangla-text text-sm text-gray-500">
                    &quot;নিশ্চয়ই নামাজ মু&apos;মিনদের উপর নির্দিষ্ট সময়ে ফরজ করা হয়েছে।&quot;
                    — সূরা আন-নিসা ৪:১০৩
                </p>
            </div>
        </div>
    );
}
