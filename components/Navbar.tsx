"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  BookOpen,
  Sun,
  Moon,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { usePreferences } from "@/src/context/PreferencesContext";
import { InstallButton } from "./InstallButton";

const primaryNavLinks = [
  { href: "/", label: "হোম", labelEn: "Home" },
  { href: "/namaj-rules", label: "নামাজ", labelEn: "Namaj" },
  { href: "/simulator", label: "সিমুলেটর", labelEn: "Simulator" },
  { href: "/surah-dua", label: "সূরা ও দোয়া", labelEn: "Surah & Dua" },
  { href: "/quran", label: "কুরআন", labelEn: "Quran" },
  { href: "/masail", label: "মাসায়েল", labelEn: "Masail" },
  { href: "/more", label: "আরো", labelEn: "More" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { setPreferencePanelOpen } = usePreferences();

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100/90 bg-white/95 backdrop-blur-md dark:border-dark-border dark:bg-dark-card/95 transition-colors">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-md shadow-emerald-200 transition-transform group-hover:scale-105 dark:shadow-emerald-900/30">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="bangla-text text-lg font-bold leading-tight text-emerald-800 dark:text-emerald-400">
                নামাজ শিক্ষা
              </span>
              <span className="text-[10px] font-medium tracking-wider text-emerald-600/80 uppercase dark:text-emerald-500/70">
                Namaj Shikkha
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="মূল নেভিগেশন"
            className="hidden md:flex items-center gap-1 lg:gap-1.5"
          >
            {primaryNavLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`bangla-text rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-emerald-50 text-emerald-800 font-bold dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "text-gray-600 hover:bg-emerald-50/70 hover:text-emerald-700 dark:text-dark-text-secondary dark:hover:bg-dark-card-hover dark:hover:text-emerald-400"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search Placeholder */}
            <Link
              href="/quran"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-dark-border dark:text-dark-text-muted dark:hover:bg-dark-card-hover dark:hover:text-emerald-400"
              title="সূরা বা আয়াত অনুসন্ধান করুন"
              aria-label="অনুসন্ধান"
            >
              <Search className="h-4.5 w-4.5" />
            </Link>

            {/* Reading / Salah Preferences Button */}
            <button
              onClick={() => setPreferencePanelOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-dark-border dark:text-dark-text-muted dark:hover:bg-dark-card-hover dark:hover:text-emerald-400"
              title="পঠন ও নামাজ পছন্দসমূহ"
              aria-label="পছন্দসমূহ"
            >
              <SlidersHorizontal className="h-4.5 w-4.5" />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-dark-border dark:text-dark-text-muted dark:hover:bg-dark-card-hover dark:hover:text-emerald-400"
              aria-label={theme === "light" ? "ডার্ক মোড চালু করুন" : "লাইট মোড চালু করুন"}
            >
              {theme === "light" ? (
                <Moon className="h-4.5 w-4.5" />
              ) : (
                <Sun className="h-4.5 w-4.5" />
              )}
            </button>

            {/* Desktop Install Button */}
            <div className="hidden sm:block">
              <InstallButton />
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              id="mobile-menu-button"
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:border-dark-border dark:text-dark-text-secondary dark:hover:bg-dark-card-hover dark:hover:text-emerald-400"
              aria-label={isOpen ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
              aria-expanded={isOpen}
              aria-controls="mobile-nav-panel"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Only exposed to assistive tech when open) */}
      <div
        id="mobile-nav-panel"
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-[380px] border-t border-emerald-100 bg-white dark:border-dark-border dark:bg-dark-card"
            : "max-h-0 pointer-events-none"
        }`}
      >
        <div className="space-y-1 px-4 py-3">
          {primaryNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="bangla-text block rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:bg-emerald-50 hover:text-emerald-700 dark:text-dark-text-secondary dark:hover:bg-dark-card-hover dark:hover:text-emerald-400"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-100 dark:border-dark-border sm:hidden">
            <InstallButton />
          </div>
        </div>
      </div>
    </header>
  );
}
