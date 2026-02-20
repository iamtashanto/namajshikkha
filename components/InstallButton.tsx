"use client";

import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Download } from "lucide-react";

export function InstallButton() {
    const { isInstallable, installApp } = usePWAInstall();

    if (!isInstallable) return null;

    return (
        <button
            onClick={installApp}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-lg transition-all hover:bg-emerald-700 active:scale-95 dark:bg-emerald-500 dark:hover:bg-emerald-400"
        >
            <Download className="h-4 w-4" />
            <span>অ্যাপ ইনস্টল করুন</span>
        </button>
    );
}
