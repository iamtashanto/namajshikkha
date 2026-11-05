"use client";

import React, { useState } from "react";
import { Play, Pause, Volume2, Copy, Check, Type, Layers } from "lucide-react";
import { usePreferences, ArabicFontSize } from "@/src/context/PreferencesContext";
import { useAudio } from "@/components/AudioProvider";
import ReferenceChip from "./ReferenceChip";

export interface ArabicBlockProps {
  id?: string;
  title?: string;
  arabic: string;
  uccharon?: string;
  banglish?: string;
  meaning?: string;
  audioUrl?: string;
  reference?: string;
  hadithNumber?: string | number;
  className?: string;
  initialShowAll?: boolean;
}

const fontSizeClasses: Record<ArabicFontSize, string> = {
  sm: "text-xl sm:text-2xl leading-[2.1]",
  md: "text-2xl sm:text-3xl leading-[2.3]",
  lg: "text-3xl sm:text-4xl leading-[2.5]",
  xl: "text-4xl sm:text-5xl leading-[2.7]",
};

export function ArabicBlock({
  id,
  title,
  arabic,
  uccharon,
  banglish,
  meaning,
  audioUrl,
  reference,
  hadithNumber,
  className = "",
}: ArabicBlockProps) {
  const { preferences } = usePreferences();
  const { activeTrack, isPlaying, play, toggle } = useAudio();

  // Local overrides for visibility and size, initialized from user preferences
  const [visibleLayers, setVisibleLayers] = useState({
    arabic: preferences.layers.arabic,
    uccharon: preferences.layers.uccharon,
    banglish: preferences.layers.banglish,
    meaning: preferences.layers.meaning,
  });

  const [fontSize, setFontSize] = useState<ArabicFontSize>(preferences.arabicFontSize);
  const [copied, setCopied] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const isThisPlaying = Boolean(audioUrl && activeTrack?.url === audioUrl && isPlaying);

  const toggleLayer = (layer: keyof typeof visibleLayers) => {
    setVisibleLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };

  const cycleFontSize = () => {
    const order: ArabicFontSize[] = ["sm", "md", "lg", "xl"];
    const nextIndex = (order.indexOf(fontSize) + 1) % order.length;
    setFontSize(order[nextIndex]);
  };

  const handleAudio = () => {
    if (!audioUrl) return;
    if (activeTrack?.url === audioUrl) {
      toggle();
    } else {
      play({
        id: id || `track-${arabic.slice(0, 10)}`,
        title_bn: title || "দোয়া ও কিরাত",
        title_en: "Recitation",
        url: audioUrl,
      });
    }
  };

  const handleCopy = async () => {
    const textToCopy = `${arabic}\n\n${uccharon ? `উচ্চারণ: ${uccharon}\n` : ""}${
      meaning ? `অর্থ: ${meaning}\n` : ""
    }${reference ? `সূত্র: ${reference}` : ""}`.trim();

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard write failed
    }
  };

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-emerald-100/90 bg-white shadow-sm transition-all dark:border-dark-border dark:bg-dark-card ${className}`}
    >
      {/* Block Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-50 bg-gradient-to-r from-emerald-50/70 to-white px-4 py-3 dark:border-dark-border dark:from-emerald-950/25 dark:to-dark-card sm:px-5">
        <div className="flex items-center gap-2">
          {title && (
            <h3 className="bangla-text text-base font-bold text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {reference && (
            <ReferenceChip source={reference} hadithNumber={hadithNumber} />
          )}
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1.5 ml-auto">
          {/* Layer toggles popup / inline */}
          <button
            type="button"
            onClick={() => setShowControls(!showControls)}
            className={`flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-medium transition-colors ${
              showControls
                ? "bg-emerald-600 text-white"
                : "border border-gray-200 bg-white text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-secondary"
            }`}
            title="স্তর দৃশ্যমানতা নিয়ন্ত্রণ"
          >
            <Layers className="h-3.5 w-3.5" />
            <span className="bangla-text hidden xs:inline">স্তর</span>
          </button>

          {/* Font Size Button */}
          <button
            type="button"
            onClick={cycleFontSize}
            className="flex h-8 items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 text-xs font-semibold text-gray-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-secondary"
            title={`আরবি হরফের আকার পরিবর্তন (${fontSize.toUpperCase()})`}
          >
            <Type className="h-3.5 w-3.5" />
            <span className="uppercase text-[10px] font-bold">{fontSize}</span>
          </button>

          {/* Audio Button */}
          {audioUrl && (
            <button
              type="button"
              onClick={handleAudio}
              className={`flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-white transition-all ${
                isThisPlaying
                  ? "bg-gold-500 shadow-md shadow-gold-200 dark:shadow-gold-900/30"
                  : "bg-emerald-600 hover:bg-emerald-700 shadow-sm"
              }`}
              aria-label={isThisPlaying ? "অডিও বিরতি" : "অডিও শুনুন"}
            >
              {isThisPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5" />
                  <Volume2 className="h-3.5 w-3.5 animate-pulse" />
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  <span className="bangla-text hidden xs:inline">শুনুন</span>
                </>
              )}
            </button>
          )}

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-muted"
            title="অনুলিপি (কপি) করুন"
            aria-label="অনুলিপি করুন"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Layer Toggle Bar */}
      {showControls && (
        <div className="flex flex-wrap items-center gap-2 border-b border-emerald-50 bg-gray-50/80 px-4 py-2 dark:border-dark-border dark:bg-dark-bg/60">
          <span className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted">
            প্রদর্শন:
          </span>
          <button
            type="button"
            onClick={() => toggleLayer("arabic")}
            className={`bangla-text rounded-md px-2 py-1 text-xs font-medium transition-colors ${
              visibleLayers.arabic
                ? "bg-emerald-600 text-white"
                : "bg-gray-200 text-gray-600 dark:bg-dark-card dark:text-dark-text-muted"
            }`}
          >
            আরবি
          </button>
          {uccharon && (
            <button
              type="button"
              onClick={() => toggleLayer("uccharon")}
              className={`bangla-text rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                visibleLayers.uccharon
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-200 text-gray-600 dark:bg-dark-card dark:text-dark-text-muted"
              }`}
            >
              উচ্চারণ
            </button>
          )}
          {meaning && (
            <button
              type="button"
              onClick={() => toggleLayer("meaning")}
              className={`bangla-text rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                visibleLayers.meaning
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-200 text-gray-600 dark:bg-dark-card dark:text-dark-text-muted"
              }`}
            >
              অর্থ
            </button>
          )}
          {banglish && (
            <button
              type="button"
              onClick={() => toggleLayer("banglish")}
              className={`bangla-text rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                visibleLayers.banglish
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-200 text-gray-600 dark:bg-dark-card dark:text-dark-text-muted"
              }`}
            >
              ব্যাংলিশ
            </button>
          )}
        </div>
      )}

      {/* Layer Contents */}
      <div className="space-y-4 p-5 sm:p-6">
        {/* Layer 1: Arabic */}
        {visibleLayers.arabic && (
          <div className="rounded-xl bg-emerald-50/40 p-4 dark:bg-emerald-950/20">
            <div
              className={`arabic-text font-arabic text-gray-900 dark:text-emerald-100 ${fontSizeClasses[fontSize]}`}
            >
              {arabic.split("\n").map((line, idx) => (
                <p key={idx} className="mb-2 last:mb-0">
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Layer 2: Bangla Pronunciation */}
        {visibleLayers.uccharon && uccharon && (
          <div className="border-l-2 border-emerald-500 pl-3.5">
            <span className="bangla-text block text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1">
              বাংলা উচ্চারণ:
            </span>
            <div className="bangla-text text-base leading-relaxed text-gray-800 dark:text-dark-text sm:text-lg">
              {uccharon.split("\n").map((line, idx) => (
                <p key={idx} className="mb-1 last:mb-0">
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Layer 3: Banglish (Bangla in Latin Script) */}
        {visibleLayers.banglish && banglish && (
          <div className="border-l-2 border-gold-400 pl-3.5">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-gold-600 dark:text-gold-400 mb-1">
              Banglish:
            </span>
            <div className="text-sm italic leading-relaxed text-gray-600 dark:text-dark-text-muted sm:text-base">
              {banglish.split("\n").map((line, idx) => (
                <p key={idx} className="mb-1 last:mb-0">
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Layer 4: Bangla Meaning */}
        {visibleLayers.meaning && meaning && (
          <div className="border-l-2 border-teal-500 pl-3.5">
            <span className="bangla-text block text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-1">
              বাংলা অর্থ:
            </span>
            <div className="bangla-text text-sm leading-relaxed text-gray-700 dark:text-dark-text-secondary sm:text-base">
              {meaning.split("\n").map((line, idx) => (
                <p key={idx} className="mb-1 last:mb-0">
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArabicBlock;

