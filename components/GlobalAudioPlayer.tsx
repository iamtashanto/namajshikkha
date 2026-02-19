"use client";

import { useAudio } from "./AudioProvider";
import { Play, Pause, X, Volume2, Music } from "lucide-react";

export function GlobalAudioPlayer() {
    const { activeTrack, isPlaying, progress, duration, toggle, seek, stop, isLoading } = useAudio();

    if (!activeTrack) return null;

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[60] animate-in slide-in-from-bottom duration-500">
            <div className="mx-auto max-w-4xl px-4 pb-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-2xl border border-emerald-100/50 bg-white/80 backdrop-blur-xl shadow-2xl shadow-emerald-900/10 dark:border-white/10 dark:bg-dark-card/80">
                    {/* Background decoration */}
                    <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-3xl" />
                    <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-gold-500/10 blur-3xl" />

                    <div className="relative flex flex-col items-center gap-2 p-4 sm:flex-row sm:gap-6">
                        {/* Track Info */}
                        <div className="flex w-full items-center gap-3 sm:w-auto">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30">
                                <Music className={`h-5 w-5 text-white ${isPlaying ? "animate-pulse" : ""}`} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h4 className="bangla-text truncate text-sm font-bold text-gray-800 dark:text-dark-text">
                                    {activeTrack.title_bn}
                                </h4>
                                <p className="truncate text-[10px] text-gray-400 dark:text-dark-text-muted">
                                    {activeTrack.title_en}
                                </p>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex w-full flex-1 items-center gap-4">
                            <button
                                onClick={toggle}
                                disabled={isLoading}
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 dark:shadow-emerald-900/30"
                                aria-label={isPlaying ? "Pause" : "Play"}
                            >
                                {isLoading ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                ) : isPlaying ? (
                                    <Pause className="h-5 w-5" />
                                ) : (
                                    <Play className="ml-0.5 h-5 w-5" />
                                )}
                            </button>

                            <div className="flex flex-1 flex-col gap-1">
                                <div className="flex items-center gap-2.5">
                                    <span className="w-8 text-right text-[10px] tabular-nums text-gray-400 dark:text-dark-text-muted">
                                        {formatTime(progress)}
                                    </span>
                                    <input
                                        type="range"
                                        min={0}
                                        max={duration || 0}
                                        value={progress}
                                        onChange={(e) => seek(Number(e.target.value))}
                                        className="h-1 flex-1 cursor-pointer accent-emerald-500"
                                    />
                                    <span className="w-8 text-xs text-[10px] tabular-nums text-gray-400 dark:text-dark-text-muted">
                                        {formatTime(duration)}
                                    </span>
                                </div>
                            </div>

                            <div className="hidden items-center gap-2 sm:flex">
                                <Volume2 className="h-4 w-4 text-emerald-400 dark:text-emerald-500" />
                            </div>

                            <button
                                onClick={stop}
                                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:text-dark-text-muted dark:hover:bg-white/5 dark:hover:text-dark-text"
                                aria-label="Stop"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
