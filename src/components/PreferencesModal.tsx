"use client";

import React, { useEffect, useRef } from "react";
import { X, SlidersHorizontal, Check, RefreshCw, User } from "lucide-react";
import { usePreferences, ArabicFontSize } from "@/src/context/PreferencesContext";

export default function PreferencesModal() {
  const {
    preferences,
    setArabicFontSize,
    toggleLayer,
    setGender,
    resetPreferences,
    isPreferencePanelOpen,
    setPreferencePanelOpen,
  } = usePreferences();

  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isPreferencePanelOpen) {
        setPreferencePanelOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPreferencePanelOpen, setPreferencePanelOpen]);

  if (!isPreferencePanelOpen) return null;

  const fontSizes: { size: ArabicFontSize; label: string; preview: string }[] = [
    { size: "sm", label: "ছোট", preview: "text-lg" },
    { size: "md", label: "মাঝারি", preview: "text-xl" },
    { size: "lg", label: "বড়", preview: "text-2xl" },
    { size: "xl", label: "অনেক বড়", preview: "text-3xl" },
  ];

  const layerKeys: { key: keyof typeof preferences.layers; label: string; desc: string }[] = [
    { key: "arabic", label: "আরবি টেক্সট", desc: "মূল আরবি হরফ ও তাশকীল" },
    { key: "uccharon", label: "বাংলা উচ্চারণ", desc: "আরবির সঠিক বাংলা লিপ্যন্তর" },
    { key: "meaning", label: "বাংলা অর্থ", desc: "আয়াত বা দোয়ার সরল বঙ্গানুবাদ" },
    { key: "banglish", label: "ব্যাংলিশ", desc: "ইংরেজি অক্ষরে বাংলা উচ্চারণ" },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pref-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up"
      onClick={(e) => {
        if (e.target === e.currentTarget) setPreferencePanelOpen(false);
      }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 shadow-2xl dark:border-dark-border dark:bg-dark-card sm:p-7 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-dark-border">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
            <div>
              <h2 id="pref-modal-title" className="bangla-text text-lg font-bold text-gray-900 dark:text-white">
                পঠন ও নামাজ পছন্দসমূহ
              </h2>
              <p className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted">
                আপনার প্রয়োজন অনুযায়ী সাইটটি কাস্টমাইজ করুন
              </p>
            </div>
          </div>
          <button
            onClick={() => setPreferencePanelOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-dark-card-hover dark:hover:text-white"
            aria-label="প্যানেল বন্ধ করুন"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Preferences Form */}
        <div className="mt-5 space-y-6">
          {/* 1. Gender Selection */}
          <div>
            <label className="bangla-text block text-sm font-semibold text-gray-800 dark:text-dark-text mb-2">
              কাদের জন্য নিয়ম দেখতে চান?
            </label>
            <p className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted mb-3">
              হানাফি মাজহাবে তাকবীর, হাত বাঁধা, রুকু ও সেজদায় পুরুষ ও মহিলাদের কিছু পার্থক্য রয়েছে।
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender("male")}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${
                  preferences.gender === "male"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-300 shadow-sm"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-dark-border dark:text-dark-text-secondary dark:hover:bg-dark-card-hover"
                }`}
              >
                <User className="h-4 w-4" />
                <span className="bangla-text">পুরুষদের নিয়ম</span>
                {preferences.gender === "male" && <Check className="h-4 w-4 text-emerald-600" />}
              </button>

              <button
                type="button"
                onClick={() => setGender("female")}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition-all ${
                  preferences.gender === "female"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-300 shadow-sm"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-dark-border dark:text-dark-text-secondary dark:hover:bg-dark-card-hover"
                }`}
              >
                <User className="h-4 w-4" />
                <span className="bangla-text">মহিলাদের নিয়ম</span>
                {preferences.gender === "female" && <Check className="h-4 w-4 text-emerald-600" />}
              </button>
            </div>
          </div>

          {/* 2. Arabic Font Size */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="bangla-text text-sm font-semibold text-gray-800 dark:text-dark-text">
                আরবি ফন্ট সাইজ
              </label>
              <span className="arabic-text text-emerald-600 dark:text-emerald-400 font-bold">
                بِسْمِ اللَّهِ
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {fontSizes.map((f) => (
                <button
                  key={f.size}
                  type="button"
                  onClick={() => setArabicFontSize(f.size)}
                  className={`flex flex-col items-center justify-center rounded-xl border py-2.5 px-2 transition-all ${
                    preferences.arabicFontSize === f.size
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:border-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-300 shadow-sm font-bold"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-dark-border dark:text-dark-text-secondary dark:hover:bg-dark-card-hover"
                  }`}
                >
                  <span className="bangla-text text-xs">{f.label}</span>
                  <span className={`arabic-text ${f.preview} leading-none mt-1`}>ع</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Layer Visibility */}
          <div>
            <label className="bangla-text block text-sm font-semibold text-gray-800 dark:text-dark-text mb-2">
              ডিফল্টভাবে প্রদর্শিত স্তরসমূহ (৪ ফরম্যাট)
            </label>
            <p className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted mb-3">
              যে স্তরগুলো আপনি সবসময় দেখতে চান তা অন রাখুন
            </p>
            <div className="space-y-2.5">
              {layerKeys.map(({ key, label, desc }) => {
                const isEnabled = preferences.layers[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleLayer(key)}
                    className={`flex w-full items-center justify-between rounded-xl border p-3 transition-all ${
                      isEnabled
                        ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-800/50 dark:bg-emerald-950/30"
                        : "border-gray-200 bg-white dark:border-dark-border dark:bg-dark-bg/60 opacity-60"
                    }`}
                  >
                    <div className="text-left">
                      <p className="bangla-text text-sm font-semibold text-gray-900 dark:text-white">
                        {label}
                      </p>
                      <p className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted">
                        {desc}
                      </p>
                    </div>
                    <div
                      className={`flex h-6 w-11 items-center rounded-full p-1 transition-colors ${
                        isEnabled ? "bg-emerald-600" : "bg-gray-300 dark:bg-gray-700"
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded-full bg-white transition-transform ${
                          isEnabled ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-7 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-dark-border">
          <button
            type="button"
            onClick={resetPreferences}
            className="bangla-text inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-emerald-600 dark:text-dark-text-muted dark:hover:text-emerald-400"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            পূর্বাবস্থায় ফেরান
          </button>
          <button
            type="button"
            onClick={() => setPreferencePanelOpen(false)}
            className="bangla-text rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-200 transition-all hover:bg-emerald-700 dark:shadow-emerald-900/30"
          >
            সংরক্ষণ করুন
          </button>
        </div>
      </div>
    </div>
  );
}
