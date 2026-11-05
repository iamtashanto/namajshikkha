"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, PlayCircle, Clock, Grid } from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "হোম", href: "/", icon: Home },
    { label: "নামাজ", href: "/namaj", icon: BookOpen },
    { label: "সিমুলেটর", href: "/simulator", icon: PlayCircle },
    { label: "সময়", href: "/prayer-times", icon: Clock },
    { label: "আরো", href: "/more", icon: Grid },
  ];

  return (
    <nav
      aria-label="মোবাইল প্রধান নেভিগেশন"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-emerald-100/90 bg-white/95 backdrop-blur-lg pb-safe dark:border-dark-border dark:bg-dark-card/95 transition-colors"
    >
      <div className="grid h-16 grid-cols-5 items-center px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                isActive
                  ? "text-emerald-700 font-bold dark:text-emerald-400"
                  : "text-gray-500 hover:text-emerald-600 dark:text-dark-text-muted dark:hover:text-dark-text"
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                    : ""
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="bangla-text text-[10px] leading-tight mt-0.5">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileBottomNav;

