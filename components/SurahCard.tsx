"use client";

import { useState, useRef, useEffect } from "react";
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

export default function SurahCard({ data }: { data: SurahDuaData }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [activeTab, setActiveTab] = useState<"arabic" | "bangla" | "banglish" | "meaning">("arabic");

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("ended", handleEnded);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("ended", handleEnded);
        };
    }, []);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                    <div className="arabic-text text-2xl leading-[2.4] text-gray-800 sm:text-3xl">
                        {data.arabic_text.split("\n").map((line, i) => (
                            <p key={i} className="mb-2">{line}</p>
                        ))}
                    </div>
                );
            case "bangla":
                return (
                    <div className="bangla-text text-base leading-8 text-gray-700 sm:text-lg">
                        {data.bangla_pronunciation.split("\n").map((line, i) => (
                            <p key={i} className="mb-1.5">{line}</p>
                        ))}
                    </div>
                );
            case "banglish":
                return (
                    <div className="text-base leading-7 text-gray-600 italic sm:text-lg">
                        {data.banglish.split("\n").map((line, i) => (
                            <p key={i} className="mb-1.5">{line}</p>
                        ))}
                    </div>
                );
            case "meaning":
                return (
                    <div className="bangla-text text-base leading-8 text-emerald-800 sm:text-lg">
                        {data.bangla_meaning.split("\n").map((line, i) => (
                            <p key={i} className="mb-1.5">{line}</p>
                        ))}
                    </div>
                );
        }
    };

    return (
        <article className="group overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-emerald-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-emerald-50 bg-gradient-to-r from-emerald-50 to-white px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-sm">
                        <BookOpenText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="bangla-text text-base font-bold text-gray-800 sm:text-lg">
                            {data.title_bn}
                        </h3>
                        <p className="text-xs text-gray-400">{data.title_en}</p>
                    </div>
                </div>
                {data.verse_count && (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                        {data.verse_count} আয়াত
                    </span>
                )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-emerald-50 bg-gray-50/50">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`bangla-text flex-1 py-2.5 text-xs font-medium transition-all sm:text-sm ${activeTab === tab.key
                                ? "border-b-2 border-emerald-500 bg-white text-emerald-700"
                                : "text-gray-400 hover:text-gray-600 hover:bg-white/50"
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
            <div className="border-t border-emerald-50 bg-gradient-to-r from-emerald-50/50 to-white px-5 py-3.5 sm:px-6">
                <audio ref={audioRef} src={data.audio_url} preload="metadata" />
                <div className="flex items-center gap-3">
                    <button
                        onClick={togglePlay}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-md shadow-emerald-200 transition-all hover:shadow-lg hover:scale-105 active:scale-95"
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? (
                            <Pause className="h-4 w-4" />
                        ) : (
                            <Play className="ml-0.5 h-4 w-4" />
                        )}
                    </button>

                    <div className="flex flex-1 items-center gap-2.5">
                        <span className="w-10 text-right text-xs tabular-nums text-gray-400">
                            {formatTime(currentTime)}
                        </span>
                        <input
                            type="range"
                            min={0}
                            max={duration || 0}
                            value={currentTime}
                            onChange={handleSeek}
                            className="h-1 flex-1 cursor-pointer"
                            aria-label="Audio progress"
                        />
                        <span className="w-10 text-xs tabular-nums text-gray-400">
                            {formatTime(duration)}
                        </span>
                    </div>

                    <Volume2 className="h-4 w-4 shrink-0 text-emerald-400" />
                </div>
            </div>
        </article>
    );
}
