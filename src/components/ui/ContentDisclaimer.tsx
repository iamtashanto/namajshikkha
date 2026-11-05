"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertCircle,
  BookOpen,
  Check,
  Copy,
  ExternalLink,
  Mail,
  MessageSquareWarning,
  ShieldCheck,
  X,
} from "lucide-react";
import { siteConfig } from "@/src/config/site";

const ISSUE_CATEGORIES = [
  { value: "arabic", label: "আরবি টেক্সট বা হরকত সংক্রান্ত ভুল" },
  { value: "uccharon", label: "বাংলা উচ্চারণ বা অর্থ সংক্রান্ত ভুল" },
  { value: "reference", label: "হাদিস নম্বর, মান (সহীহ/যঈফ) বা তথ্যসূত্র" },
  { value: "masail", label: "রাকাত সংখ্যা বা ফিকহি মাসআলা সংক্রান্ত" },
  { value: "technical", label: "অডিও, সিমুলেটর বা কারিগরি ত্রুটি" },
];

export function ContentDisclaimer() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [category, setCategory] = useState(ISSUE_CATEGORIES[0].value);
  const [details, setDetails] = useState("");
  const [copied, setCopied] = useState(false);

  const pageUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${pathname}`
      : `${siteConfig.url}${pathname || ""}`;

  const selectedCategoryLabel =
    ISSUE_CATEGORIES.find((c) => c.value === category)?.label ||
    ISSUE_CATEGORIES[0].label;

  const reportSubject = `[নামাজ শিক্ষা — সংশোধনী প্রস্তাব] ${pathname || "/"}`;
  const reportBody = `আসসালামু আলাইকুম,\n\nপৃষ্ঠার লিঙ্ক: ${pageUrl}\nবিষয়ের ধরন: ${selectedCategoryLabel}\n\nবিস্তারিত বিবরণ / সঠিক তথ্যসূত্র:\n${
    details.trim() || "(এখানে ভুলের বিবরণ ও দলিল লিখুন)"
  }\n\nজাযাকাল্লাহু খাইরান।`;

  const mailtoHref = `mailto:contact@tashanto.com?subject=${encodeURIComponent(
    reportSubject
  )}&body=${encodeURIComponent(reportBody)}`;

  const handleCopyReport = async () => {
    try {
      await navigator.clipboard.writeText(
        `Subject: ${reportSubject}\n\n${reportBody}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ignore clipboard failure
    }
  };

  return (
    <>
      <section
        aria-label="শারঈ দায়মুক্তি ও সংশোধনী বার্তা"
        className="border-t border-emerald-100 bg-emerald-50/60 py-6 dark:border-dark-border dark:bg-dark-bg/90"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-emerald-200/80 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:p-5 dark:border-dark-border dark:bg-dark-card">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="bangla-text text-sm font-bold text-gray-900 dark:text-white">
                    শারঈ সতর্কবার্তা ও তথ্যসূত্র (হানাফি ফিকহ)
                  </h2>
                  <Link
                    href="/about"
                    className="bangla-text inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300"
                  >
                    <BookOpen className="h-3 w-3" />
                    <span>আমাদের সম্পর্কে ও তথ্যসূত্র</span>
                  </Link>
                </div>
                <p className="bangla-text text-xs leading-relaxed text-gray-600 dark:text-dark-text-secondary">
                  এই ওয়েবসাইটের সকল মাসআলা ও নামাজের নিয়ম কুরআন, সহীহ হাদিস এবং বাংলাদেশে প্রচলিত{" "}
                  <strong>হানাফি মাযহাবের</strong> নির্ভরযোগ্য ফিকহ গ্রন্থের আলোকে শিক্ষামূলক উদ্দেশ্যে সংকলিত। ব্যক্তিগত বা জটিল মাসআলার চূড়ান্ত ফতোয়ার জন্য একজন বিজ্ঞ মুফতি বা আলেমের শরণাপন্ন হোন।
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:self-center">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="bangla-text inline-flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-900 transition-colors hover:bg-amber-100 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-200 dark:hover:bg-amber-900/50"
              >
                <MessageSquareWarning className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span>কোনো ভুল চোখে পড়লে জানান</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-modal-title"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl border border-emerald-100 bg-white p-6 shadow-2xl dark:border-dark-border dark:bg-dark-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-4 dark:border-dark-border">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3
                    id="feedback-modal-title"
                    className="bangla-text text-lg font-bold text-gray-900 dark:text-white"
                  >
                    কোনো ভুল চোখে পড়লে জানান
                  </h3>
                  <p className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted">
                    কুরআনের আয়াত, হরকত, উচ্চারণ বা মাসআলায় কোনো ত্রুটি থাকলে দলিলসহ জানান
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                aria-label="বন্ধ করুন"
                className="rounded-xl p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="bangla-text block text-xs font-bold text-gray-700 dark:text-gray-300">
                  সংশ্লিষ্ট পৃষ্ঠা
                </label>
                <div className="mt-1 truncate rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-600 dark:border-dark-border dark:bg-dark-bg dark:text-gray-400">
                  {pageUrl}
                </div>
              </div>

              <div>
                <label
                  htmlFor="issue-category"
                  className="bangla-text block text-xs font-bold text-gray-700 dark:text-gray-300"
                >
                  ভুলের ধরন নির্বাচন করুন
                </label>
                <select
                  id="issue-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bangla-text mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 focus:border-emerald-500 focus:outline-none dark:border-dark-border dark:bg-dark-bg dark:text-white"
                >
                  {ISSUE_CATEGORIES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="issue-details"
                  className="bangla-text block text-xs font-bold text-gray-700 dark:text-gray-300"
                >
                  বিস্তারিত বিবরণ ও কিতাবের রেফারেন্স (ঐচ্ছিক)
                </label>
                <textarea
                  id="issue-details"
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="কোন লাইনে বা কোন দোয়ায় ভুল রয়েছে এবং সঠিক পাঠ বা দলিল কী হওয়া উচিত তা সংক্ষেপে লিখুন..."
                  className="bangla-text mt-1 w-full rounded-xl border border-gray-200 bg-white p-3 text-sm text-gray-800 focus:border-emerald-500 focus:outline-none dark:border-dark-border dark:bg-dark-bg dark:text-white"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCopyReport}
                  className="bangla-text inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 dark:border-dark-border dark:bg-dark-bg dark:text-gray-200"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span>টেক্সট কপি হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>রিপোর্ট কপি করুন</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <a
                    href="https://github.com/ta-shanto/namajshikkha/issues/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bangla-text inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300"
                  >
                    <span>GitHub Issue</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>

                  <a
                    href={mailtoHref}
                    className="bangla-text inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
                  >
                    <Mail className="h-4 w-4" />
                    <span>ইমেইল পাঠান</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default ContentDisclaimer;

