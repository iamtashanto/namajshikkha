"use client";

import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Download, Smartphone } from "lucide-react";

interface InstallButtonProps {
    variant?: "navbar" | "footer" | "banner";
    className?: string;
}

export function InstallButton({ variant = "navbar", className = "" }: InstallButtonProps) {
    const { isInstallable, installApp } = usePWAInstall();

    if (variant === "footer") {
        return (
            <div className={`flex flex-col gap-2.5 ${className}`}>
                <a
                    href="/download/namajshikkha.apk"
                    download="namajshikkha.apk"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold-600 px-6 py-3 text-sm font-bold text-gray-950 shadow-xl transition-all hover:bg-gold-500 active:scale-[0.98] dark:bg-gold-500 dark:hover:bg-gold-400"
                >
                    <Smartphone className="h-5 w-5" />
                    <span>Android APK ডাউনলোড করুন</span>
                </a>
                {isInstallable && (
                    <button
                        onClick={installApp}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700/80 px-6 py-2.5 text-xs font-bold text-white shadow transition-all hover:bg-emerald-600 active:scale-[0.98] dark:bg-emerald-900/60 dark:hover:bg-emerald-800"
                    >
                        <Download className="h-4 w-4" />
                        <span>PWA অ্যাপ হিসেবে যুক্ত করুন</span>
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1.5">
            <a
                href="/download/namajshikkha.apk"
                download="namajshikkha.apk"
                className={`flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white shadow transition-all hover:bg-emerald-700 active:scale-95 md:px-3.5 md:py-2 md:text-xs dark:bg-emerald-500 dark:hover:bg-emerald-400 ${className}`}
                title="Android APK ডাউনলোড করুন"
            >
                <Smartphone className="h-3.5 w-3.5 md:h-4 md:w-4" />
                <span>APK ডাউনলোড</span>
            </a>
            {isInstallable && (
                <button
                    onClick={installApp}
                    className="hidden lg:flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-2 text-xs font-semibold text-emerald-800 shadow-sm transition-all hover:bg-emerald-100 active:scale-95 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                    title="PWA হিসেবে ব্রাউজারে ইনস্টল করুন"
                >
                    <Download className="h-3.5 w-3.5" />
                    <span>PWA</span>
                </button>
            )}
        </div>
    );
}
