"use client";

import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Download, X, Smartphone } from "lucide-react";
import { useState, useEffect } from "react";

export function MobileInstallPrompt() {
    const { isInstallable, installApp } = usePWAInstall();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isInstallable) {
            // Small delay to not annoy the user immediately
            const timer = setTimeout(() => {
                const dismissed = localStorage.getItem("pwa-prompt-dismissed");
                if (!dismissed) {
                    setIsVisible(true);
                }
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isInstallable]);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem("pwa-prompt-dismissed", "true");
    };

    if (!isVisible || !isInstallable) return null;

    return (
        <div className="fixed bottom-24 left-4 right-4 z-[70] md:hidden">
            <div className="relative overflow-hidden rounded-2xl border border-emerald-100/50 bg-white/95 p-4 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-dark-card/95">
                {/* Background Accent */}
                <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-emerald-500/10 blur-2xl" />

                <button
                    onClick={handleDismiss}
                    className="absolute right-2 top-2 rounded-full p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30">
                        <Smartphone className="h-6 w-6" />
                    </div>
                    <div className="flex-1 pr-6">
                        <h3 className="bangla-text text-[15px] font-bold text-gray-800 dark:text-dark-text">
                            অ্যাপটি ইনস্টল করুন
                        </h3>
                        <p className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted">
                            অফলাইনে পড়তে এবং দ্রুত এক্সেস করতে অ্যাপটি নামিয়ে নিন
                        </p>
                    </div>
                </div>

                <button
                    onClick={installApp}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-lg transition-all active:scale-95 dark:bg-emerald-500"
                >
                    <Download className="h-4 w-4" />
                    <span>ইনস্টল করুন</span>
                </button>
            </div>
        </div>
    );
}
