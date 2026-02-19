"use client";

import { useState } from "react";
import { useAudio } from "./AudioProvider";
import { Play, Pause, Volume2, BookOpenText } from "lucide-react";

interface SurahDuaData {
    id: number;
    title_bn: string;
    title_en: string;
    arabic_text: string;
    bangla_pronunciation: string;
    banglish: string;
    bangla_meaning: string;
    audio_url: string;
    category: string;
    verse_count?: number;
}

export default function SurahCard({ data, playlist }: { data: SurahDuaData; playlist?: SurahDuaData[] }) {
    const { activeTrack, isPlaying, play, pause, toggle, progress, duration, isLoading } = useAudio();
    const [activeTab, setActiveTab] = useState<"arabic" | "bangla" | "banglish" | "meaning">("arabic");

    const isThisPlaying = activeTrack?.url === data.audio_url;

    const handleToggle = () => {
        if (isThisPlaying) {
            toggle();
        } else {
            const trackPlaylist = playlist?.map(item => ({
                id: `${item.category}-${item.id}`,
                title_bn: item.title_bn,
                title_en: item.title_en,
                url: item.audio_url
            }));

            play({
                id: `${data.category}-${data.id}`,
                title_bn: data.title_bn,
                title_en: data.title_en,
                url: data.audio_url
            }, trackPlaylist);
        }
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const tabs = [
        { key: "arabic" as const, label: "আরবি", labelEn: "Arabic" },
        { key: "bangla" as const, label: "বাংলা উচ্চারণ", labelEn: "Bangla" },
        { key: "banglish" as const, label: "ব্যাংলিশ", labelEn: "Banglish" },
        { key: "meaning" as const, label: "অর্থ", labelEn: "Meaning" },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "arabic":
                return (
                    <div className="arabic-text text-2xl leading-[2.4] text-gray-800 dark:text-dark-text sm:text-3xl">
                        {data.arabic_text.split("\n").map((line, i) => (
                            <p key={i} className="mb-2">{line}</p>
                        ))}
                    </div>
                );
            case "bangla":
                return (
                    <div className="bangla-text text-base leading-8 text-gray-700 dark:text-dark-text-secondary sm:text-lg">
                        {data.bangla_pronunciation.split("\n").map((line, i) => (
                            <p key={i} className="mb-1.5">{line}</p>
                        ))}
                    </div>
                );
            case "banglish":
                return (
                    <div className="text-base leading-7 text-gray-600 italic dark:text-dark-text-muted sm:text-lg">
                        {data.banglish.split("\n").map((line, i) => (
                            <p key={i} className="mb-1.5">{line}</p>
                        ))}
                    </div>
                );
            case "meaning":
                return (
                    <div className="bangla-text text-base leading-8 text-emerald-800 dark:text-emerald-400 sm:text-lg">
                        {data.bangla_meaning.split("\n").map((line, i) => (
                            <p key={i} className="mb-1.5">{line}</p>
                        ))}
                    </div>
                );
        }
    };

    return (
        <article className="group overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-emerald-200 dark:border-dark-border dark:bg-dark-card dark:hover:border-emerald-800/50 dark:hover:shadow-emerald-900/10">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-emerald-50 bg-gradient-to-r from-emerald-50 to-white px-5 py-4 dark:border-dark-border dark:from-emerald-950/30 dark:to-dark-card sm:px-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-sm">
                        <BookOpenText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="bangla-text text-base font-bold text-gray-800 dark:text-dark-text sm:text-lg">
                            {data.title_bn}
                        </h3>
                        <p className="text-xs text-gray-400 dark:text-dark-text-muted">{data.title_en}</p>
                    </div>
                </div>
                {data.verse_count && (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                        {data.verse_count} আয়াত
                    </span>
                )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-emerald-50 bg-gray-50/50 dark:border-dark-border dark:bg-dark-bg/50">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`bangla-text flex-1 py-2.5 text-xs font-medium transition-all sm:text-sm ${activeTab === tab.key
                            ? "border-b-2 border-emerald-500 bg-white text-emerald-700 dark:bg-dark-card dark:text-emerald-400"
                            : "text-gray-400 hover:text-gray-600 hover:bg-white/50 dark:text-dark-text-muted dark:hover:text-dark-text-secondary dark:hover:bg-dark-card/50"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="min-h-[120px] px-5 py-5 sm:px-6 sm:py-6">
                {renderContent()}
            </div>

            {/* Audio Player */}
            {data.audio_url ? (
                <div className={`border-t border-emerald-50 bg-gradient-to-r px-5 py-3.5 transition-all duration-300 sm:px-6 ${isThisPlaying ? "from-emerald-50/80 to-emerald-100/30 dark:from-emerald-950/40 dark:to-emerald-900/10" : "from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-dark-card"}`}>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleToggle}
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white shadow-md transition-all hover:scale-105 active:scale-95 ${isThisPlaying && isPlaying ? "bg-gold-500 shadow-gold-200 dark:shadow-gold-900/20" : "bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-emerald-200 dark:shadow-emerald-900/30"}`}
                            aria-label={isThisPlaying && isPlaying ? "Pause" : "Play"}
                        >
                            {isThisPlaying && isPlaying ? (
                                <Pause className="h-4 w-4" />
                            ) : (
                                <Play className="ml-0.5 h-4 w-4" />
                            )}
                        </button>

                        <div className="flex flex-1 items-center gap-2.5">
                            <span className="w-10 text-right text-xs tabular-nums text-gray-400 dark:text-dark-text-muted">
                                {formatTime(isThisPlaying ? progress : 0)}
                            </span>
                            <div className="relative flex-1">
                                <div className="h-1 w-full rounded-full bg-gray-200 dark:bg-dark-bg">
                                    <div
                                        className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                                        style={{ width: `${(isThisPlaying ? progress / duration : 0) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <span className="w-10 text-xs tabular-nums text-gray-400 dark:text-dark-text-muted">
                                {formatTime(isThisPlaying ? duration : 0)}
                            </span>
                        </div>

                        <Volume2 className={`h-4 w-4 shrink-0 transition-colors ${isThisPlaying && isPlaying ? "text-gold-500 animate-pulse" : "text-emerald-400 dark:text-emerald-500"}`} />
                    </div>
                </div>
            ) : (
                <div className="border-t border-emerald-50 bg-gray-50/50 px-5 py-3 text-center text-xs text-gray-400 dark:border-dark-border dark:bg-dark-bg/30 dark:text-dark-text-muted">
                    অডিও শীঘ্রই যুক্ত করা হবে
                </div>
            )}
        </article>
    );
}
