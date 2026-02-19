"use client";

import { useState, useRef, useEffect } from "react";
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

export default function QuranSurahCard({ data }: { data: SurahData }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
            setIsLoading(false);
        };
        const handleEnded = () => setIsPlaying(false);
        const handleWaiting = () => setIsLoading(true);
        const handleCanPlay = () => setIsLoading(false);

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("waiting", handleWaiting);
        audio.addEventListener("canplay", handleCanPlay);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("waiting", handleWaiting);
            audio.removeEventListener("canplay", handleCanPlay);
        };
    }, []);

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            setIsLoading(true);
            audio.play().catch(() => setIsLoading(false));
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        const audio = audioRef.current;
        if (!audio) return;
        const time = Number(e.target.value);
        audio.currentTime = time;
        setCurrentTime(time);
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
                <div className="border-t border-emerald-50 bg-gradient-to-r from-emerald-50/50 to-white px-4 py-3 dark:border-dark-border dark:from-emerald-950/20 dark:to-dark-card sm:px-5">
                    <audio ref={audioRef} src={data.audio_url} preload="none" />
                    <div className="flex items-center gap-3">
                        <button
                            onClick={togglePlay}
                            disabled={isLoading}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-md shadow-emerald-200 transition-all hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-60 dark:shadow-emerald-900/30"
                            aria-label={isPlaying ? "Pause" : "Play"}
                        >
                            {isLoading ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : isPlaying ? (
                                <Pause className="h-4 w-4" />
                            ) : (
                                <Play className="ml-0.5 h-4 w-4" />
                            )}
                        </button>

                        <div className="flex flex-1 items-center gap-2">
                            <span className="w-10 text-right text-xs tabular-nums text-gray-400 dark:text-dark-text-muted">
                                {formatTime(currentTime)}
                            </span>
                            <input
                                type="range"
                                min={0}
                                max={duration || 0}
                                value={currentTime}
                                onChange={handleSeek}
                                onClick={(e) => e.stopPropagation()}
                                className="h-1 flex-1 cursor-pointer"
                                aria-label="Audio progress"
                            />
                            <span className="w-10 text-xs tabular-nums text-gray-400 dark:text-dark-text-muted">
                                {formatTime(duration)}
                            </span>
                        </div>

                        <Volume2 className="h-4 w-4 shrink-0 text-emerald-400 dark:text-emerald-500" />
                    </div>
                    <p className="mt-2 text-center text-[10px] text-gray-400 dark:text-dark-text-muted">
                        🔊 সম্পূর্ণ সূরা তিলাওয়াত — mp3quran.net
                    </p>
                </div>
            </div>
        </article>
    );
}
