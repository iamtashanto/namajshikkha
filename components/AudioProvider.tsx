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
    isPlaying: boolean;
    progress: number;
    duration: number;
    play: (track: Track) => void;
    pause: () => void;
    toggle: () => void;
    seek: (time: number) => void;
    stop: () => void;
    isLoading: boolean;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [activeTrack, setActiveTrack] = useState<Track | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Create audio element if not exists
        if (!audioRef.current) {
            audioRef.current = new Audio();
        }

        const audio = audioRef.current;

        const handleTimeUpdate = () => setProgress(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleEnded = () => setIsPlaying(false);
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
    }, []);

    const play = (track: Track) => {
        const audio = audioRef.current;
        if (!audio) return;

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
                isPlaying,
                progress,
                duration,
                play,
                pause,
                toggle,
                seek,
                stop,
                isLoading,
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
