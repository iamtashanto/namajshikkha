"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface AccordionItemData {
  id: string | number;
  title: string | React.ReactNode;
  subtitle?: string;
  badge?: React.ReactNode;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItemData[];
  allowMultiple?: boolean;
  defaultExpandedIds?: (string | number)[];
  className?: string;
}

export function Accordion({
  items,
  allowMultiple = false,
  defaultExpandedIds = [],
  className = "",
}: AccordionProps) {
  const [expandedIds, setExpandedIds] = useState<(string | number)[]>(
    defaultExpandedIds
  );

  const toggle = (id: string | number) => {
    if (allowMultiple) {
      setExpandedIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setExpandedIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item) => {
        const isExpanded = expandedIds.includes(item.id);

        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-2xl border border-emerald-100/90 bg-white shadow-sm transition-all dark:border-dark-border dark:bg-dark-card"
          >
            <button
              type="button"
              aria-expanded={isExpanded}
              onClick={() => toggle(item.id)}
              className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-emerald-50/40 dark:hover:bg-dark-card-hover sm:p-5"
            >
              <div className="flex-1 pr-3">
                <div className="flex items-center gap-2">
                  <span className="bangla-text text-base font-bold text-gray-900 dark:text-white sm:text-lg">
                    {item.title}
                  </span>
                  {item.badge}
                </div>
                {item.subtitle && (
                  <p className="bangla-text mt-0.5 text-xs text-gray-500 dark:text-dark-text-muted">
                    {item.subtitle}
                  </p>
                )}
              </div>
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-emerald-600 transition-transform duration-200 dark:text-emerald-400 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              >
                <ChevronDown className="h-5 w-5" />
              </div>
            </button>

            {isExpanded && (
              <div className="border-t border-emerald-50 bg-white/50 p-4 dark:border-dark-border dark:bg-dark-bg/40 sm:p-5">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Accordion;

