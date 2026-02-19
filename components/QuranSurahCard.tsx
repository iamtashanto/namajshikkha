"use client";

import { useState } from "react";
import { useAudio } from "./AudioProvider";
import { Play, Pause, Volume2, ChevronDown } from "lucide-react";

interface SurahData {
    number: number;
    name_arabic: string;
    name_bangla: string;
    name_english: string;
    name_banglish: string;
    total_ayah: number;
    revelation_type: string;
    revelation_type_en: string;
    audio_url: string;
}

export default function QuranSurahCard({ data, playlist }: { data: SurahData; playlist?: SurahData[] }) {
    const { activeTrack, isPlaying, play, pause, toggle, progress, duration, isLoading: isGlobalLoading } = useAudio();
    const [isExpanded, setIsExpanded] = useState(false);

    const isThisPlaying = activeTrack?.url === data.audio_url;

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isThisPlaying) {
            toggle();
        } else {
            const trackPlaylist = playlist?.map(item => ({
                id: `surah-${item.number}`,
                title_bn: item.name_bangla,
                title_en: item.name_english,
                url: item.audio_url
            }));

            play({
                id: `surah-${data.number}`,
                title_bn: data.name_bangla,
                title_en: data.name_english,
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

    const revelationColor = data.revelation_type === "মাক্কী"
        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
        : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";

    return (
        <article
            className="group overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-emerald-200 dark:border-dark-border dark:bg-dark-card dark:hover:border-emerald-800/50 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
        >
            {/* Header - Always visible */}
            <div className="flex items-center gap-3 px-4 py-3.5 sm:px-5 sm:py-4">
                {/* Surah Number */}
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center sm:h-12 sm:w-12">
                    <div className="absolute inset-0 rotate-45 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-sm" />
                    <span className="relative text-sm font-bold text-white sm:text-base">
                        {data.number}
                    </span>
                </div>

                {/* Names */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="bangla-text text-base font-bold text-gray-800 dark:text-dark-text truncate sm:text-lg">
                            {data.name_bangla}
                        </h3>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-dark-text-muted">
                        {data.name_english} • {data.total_ayah} আয়াত
                    </p>
                </div>

                {/* Arabic Name */}
                <p className="arabic-text hidden text-lg text-emerald-600 dark:text-emerald-400 sm:block">
                    {data.name_arabic}
                </p>

                {/* Badges & Chevron */}
                <div className="flex items-center gap-2">
                    <span className={`hidden rounded-full px-2.5 py-0.5 text-[10px] font-medium sm:inline-block ${revelationColor}`}>
                        {data.revelation_type}
                    </span>
                    <ChevronDown
                        className={`h-4 w-4 text-gray-400 transition-transform duration-300 dark:text-dark-text-muted ${isExpanded ? "rotate-180" : ""}`}
                    />
                </div>
            </div>

            {/* Expanded Content */}
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
            >
                {/* Mobile Arabic Name + Badge */}
                <div className="flex items-center justify-between border-t border-emerald-50 bg-emerald-50/30 px-4 py-3 sm:hidden dark:border-dark-border dark:bg-emerald-950/20">
                    <p className="arabic-text text-xl text-emerald-600 dark:text-emerald-400">
                        {data.name_arabic}
                    </p>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${revelationColor}`}>
                        {data.revelation_type}
                    </span>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-3 gap-3 border-t border-emerald-50 px-4 py-3 dark:border-dark-border sm:px-5">
                    <div className="text-center">
                        <p className="text-xs text-gray-400 dark:text-dark-text-muted">সূরা নম্বর</p>
                        <p className="text-sm font-bold text-gray-700 dark:text-dark-text">{data.number}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-400 dark:text-dark-text-muted">আয়াত সংখ্যা</p>
                        <p className="text-sm font-bold text-gray-700 dark:text-dark-text">{data.total_ayah}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-400 dark:text-dark-text-muted">অবতীর্ণ</p>
                        <p className="text-sm font-bold text-gray-700 dark:text-dark-text">{data.revelation_type}</p>
                    </div>
                </div>

                {/* Audio Player */}
                <div className={`border-t border-emerald-50 bg-gradient-to-r px-4 py-3 transition-all duration-300 dark:border-dark-border sm:px-5 ${isThisPlaying ? "from-emerald-50/80 to-emerald-100/30 dark:from-emerald-950/40 dark:to-emerald-900/10" : "from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-dark-card"}`}>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleToggle}
                            disabled={isThisPlaying && isGlobalLoading}
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-60 ${isThisPlaying && isPlaying ? "bg-gold-500 shadow-gold-200 dark:shadow-gold-900/20" : "bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-emerald-200 dark:shadow-emerald-900/30"}`}
                            aria-label={isThisPlaying && isPlaying ? "Pause" : "Play"}
                        >
                            {isThisPlaying && isGlobalLoading ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : isThisPlaying && isPlaying ? (
                                <Pause className="h-4 w-4" />
                            ) : (
                                <Play className="ml-0.5 h-4 w-4" />
                            )}
                        </button>

                        <div className="flex flex-1 items-center gap-2">
                            <span className="w-10 text-right text-[10px] tabular-nums text-gray-400 dark:text-dark-text-muted">
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
                            <span className="w-10 text-[10px] tabular-nums text-gray-400 dark:text-dark-text-muted">
                                {formatTime(isThisPlaying ? duration : 0)}
                            </span>
                        </div>

                        <Volume2 className={`h-4 w-4 shrink-0 transition-colors ${isThisPlaying && isPlaying ? "text-gold-500 animate-pulse" : "text-emerald-400 dark:text-emerald-500"}`} />
                    </div>
                    <p className="mt-2 text-center text-[10px] text-gray-400 dark:text-dark-text-muted">
                        🔊 সম্পূর্ণ সূরা তিলাওয়াত — mp3quran.net
                    </p>
                </div>
            </div>
        </article>
    );
}
