"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";

interface Track {
    id: string | number;
    title_bn: string;
    title_en: string;
    url: string;
}

interface AudioContextType {
    activeTrack: Track | null;
    playlist: Track[];
    isPlaying: boolean;
    progress: number;
    duration: number;
    autoNext: boolean;
    play: (track: Track, newPlaylist?: Track[]) => void;
    pause: () => void;
    toggle: () => void;
    seek: (time: number) => void;
    stop: () => void;
    playNext: () => void;
    playPrevious: () => void;
    setAutoNext: (val: boolean) => void;
    setPlaylist: (list: Track[]) => void;
    isLoading: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [activeTrack, setActiveTrack] = useState<Track | null>(null);
    const [playlist, setPlaylist] = useState<Track[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [autoNext, setAutoNext] = useState(true);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const activeIndex = playlist.findIndex((t) => t.url === activeTrack?.url);
    const hasNext = activeIndex !== -1 && activeIndex < playlist.length - 1;
    const hasPrevious = activeIndex > 0;

    const playNext = () => {
        if (hasNext) {
            play(playlist[activeIndex + 1]);
        }
    };

    const playPrevious = () => {
        if (hasPrevious) {
            play(playlist[activeIndex - 1]);
        }
    };

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
        }

        const audio = audioRef.current;

        const handleTimeUpdate = () => setProgress(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleEnded = () => {
            if (autoNext && hasNext) {
                playNext();
            } else {
                setIsPlaying(false);
            }
        };
        const handleWaiting = () => setIsLoading(true);
        const handleCanPlay = () => setIsLoading(false);
        const handleError = () => {
            setIsLoading(false);
            setIsPlaying(false);
        };

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("waiting", handleWaiting);
        audio.addEventListener("canplay", handleCanPlay);
        audio.addEventListener("error", handleError);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("waiting", handleWaiting);
            audio.removeEventListener("canplay", handleCanPlay);
            audio.removeEventListener("error", handleError);
        };
    }, [autoNext, hasNext, playlist, activeIndex]); // Dependencies added for handleEnded logic

    const play = (track: Track, newPlaylist?: Track[]) => {
        const audio = audioRef.current;
        if (!audio) return;

        if (newPlaylist) {
            setPlaylist(newPlaylist);
        }

        if (activeTrack?.url === track.url) {
            audio.play();
            setIsPlaying(true);
            return;
        }

        audio.src = track.url;
        setActiveTrack(track);
        setIsLoading(true);
        audio.play()
            .then(() => setIsPlaying(true))
            .catch((err) => {
                console.error("Audio play error:", err);
                setIsPlaying(false);
                setIsLoading(false);
            });
    };

    const pause = () => {
        audioRef.current?.pause();
        setIsPlaying(false);
    };

    const toggle = () => {
        if (isPlaying) {
            pause();
        } else if (activeTrack) {
            audioRef.current?.play();
            setIsPlaying(true);
        }
    };

    const seek = (time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setProgress(time);
        }
    };

    const stop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
        }
        setActiveTrack(null);
        setIsPlaying(false);
        setProgress(0);
        setDuration(0);
        setIsLoading(false);
    };

    return (
        <AudioContext.Provider
            value={{
                activeTrack,
                playlist,
                isPlaying,
                progress,
                duration,
                autoNext,
                play,
                pause,
                toggle,
                seek,
                stop,
                playNext,
                playPrevious,
                setAutoNext,
                setPlaylist,
                isLoading,
                hasNext,
                hasPrevious,
            }}
        >
            {children}
        </AudioContext.Provider>
    );
}

export function useAudio() {
    const context = useContext(AudioContext);
    if (context === undefined) {
        throw new Error("useAudio must be used within an AudioProvider");
    }
    return context;
}
