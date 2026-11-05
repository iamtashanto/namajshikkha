"use client";

import React from "react";

export interface TabItem {
  key: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  variant?: "pill" | "underline";
  className?: string;
}

export function Tabs({
  tabs,
  activeKey,
  onChange,
  variant = "pill",
  className = "",
}: TabsProps) {
  return (
    <div
      role="tablist"
      aria-label="বিভাগ নির্বাচন"
      className={`flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar ${
        variant === "underline"
          ? "border-b border-gray-200 dark:border-dark-border"
          : ""
      } ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeKey === tab.key;

        if (variant === "underline") {
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.key)}
              className={`bangla-text relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap ${
                isActive
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-gray-500 hover:text-gray-900 dark:text-dark-text-muted dark:hover:text-dark-text"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    isActive
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "bg-gray-100 text-gray-600 dark:bg-dark-card-hover dark:text-dark-text-muted"
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400" />
              )}
            </button>
          );
        }

        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className={`bangla-text flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
              isActive
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-200 dark:shadow-emerald-900/30"
                : "bg-emerald-50/70 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-950/60"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {typeof tab.count === "number" && (
              <span className="text-xs opacity-75">({tab.count})</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;

