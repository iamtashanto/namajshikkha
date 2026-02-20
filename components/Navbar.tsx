"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, BookOpen, Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { InstallButton } from "./InstallButton";

const navLinks = [
    { href: "/", label: "হোম", labelEn: "Home" },
    { href: "/namaj-rules", label: "নামাজের নিয়ম", labelEn: "Namaj Rules" },
    { href: "/namaj-details", label: "নামাজের বিবরণ", labelEn: "Prayer Details" },
    { href: "/quran", label: "কুরআন", labelEn: "Quran" },
    { href: "/islamic-history", label: "ইতিহাস", labelEn: "History" },
    { href: "/surah-dua", label: "সূরা ও দোয়া", labelEn: "Surah & Dua" },
    { href: "/hadith-faq", label: "হাদিস ও FAQ", labelEn: "Hadith & FAQ" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="sticky top-0 z-50 border-b border-emerald-100 bg-white/90 backdrop-blur-md dark:border-dark-border dark:bg-dark-card/90">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-md shadow-emerald-200 transition-transform group-hover:scale-105 dark:shadow-emerald-900/30">
                            <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="bangla-text text-lg font-bold leading-tight text-emerald-800 dark:text-emerald-400">
                                নামাজ শিক্ষা
                            </span>
                            <span className="text-[10px] font-medium tracking-wider text-emerald-500 uppercase dark:text-emerald-500/70">
                                Prayer Learning
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav + Theme Toggle */}
                    <div className="hidden md:flex items-center gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="bangla-text rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-emerald-50 hover:text-emerald-700 dark:text-dark-text-secondary dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400"
                            >
                                {link.label}
                            </Link>
                        ))}

                        <InstallButton />

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="ml-2 flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-100 text-gray-500 transition-all hover:bg-emerald-50 hover:text-emerald-600 dark:border-dark-border dark:text-dark-text-muted dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400"
                            aria-label="Toggle theme"
                        >
                            {theme === "light" ? (
                                <Moon className="h-4.5 w-4.5" />
                            ) : (
                                <Sun className="h-4.5 w-4.5" />
                            )}
                        </button>
                    </div>

                    {/* Mobile: Theme Toggle + Menu Button */}
                    <div className="md:hidden flex items-center gap-1">
                        <InstallButton />
                        <button
                            onClick={toggleTheme}
                            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:text-dark-text-muted dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400"
                            aria-label="Toggle theme"
                        >
                            {theme === "light" ? (
                                <Moon className="h-5 w-5" />
                            ) : (
                                <Sun className="h-5 w-5" />
                            )}
                        </button>
                        <button
                            id="mobile-menu-button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:text-dark-text-secondary dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </div>

            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 border-t border-emerald-100 dark:border-dark-border" : "max-h-0"
                    }`}
            >
                <div className="space-y-1 bg-white px-4 py-3 dark:bg-dark-card">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="bangla-text block rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition-all hover:bg-emerald-50 hover:text-emerald-700 dark:text-dark-text-secondary dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
