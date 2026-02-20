"use client";

import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Download } from "lucide-react";

interface InstallButtonProps {
    variant?: "navbar" | "footer" | "banner";
    className?: string;
}

export function InstallButton({ variant = "navbar", className = "" }: InstallButtonProps) {
    const { isInstallable, installApp } = usePWAInstall();

    if (!isInstallable) return null;

    if (variant === "footer") {
        return (
            <button
                onClick={installApp}
                className={`flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-xl transition-all hover:bg-emerald-700 active:scale-[0.98] dark:bg-emerald-500 dark:hover:bg-emerald-400 ${className}`}
            >
                <Download className="h-5 w-5" />
                <span>অ্যাপ ইনস্টল করুন (Offline Support)</span>
            </button>
        );
    }

    return (
        <button
            onClick={installApp}
            className={`flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white shadow transition-all hover:bg-emerald-700 active:scale-95 md:px-4 md:py-2 md:text-sm dark:bg-emerald-500 dark:hover:bg-emerald-400 ${className}`}
        >
            <Download className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span className="hidden sm:inline">অ্যাপ ইনস্টল করুন</span>
            <span className="sm:hidden">ইনস্টল</span>
        </button>
    );
}
