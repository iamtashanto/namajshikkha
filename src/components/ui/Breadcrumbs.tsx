import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`mb-6 flex items-center overflow-x-auto text-xs text-gray-500 dark:text-dark-text-muted ${className}`}
    >
      <ol className="flex items-center gap-1.5 whitespace-nowrap">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 text-gray-500 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="bangla-text">হোম</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3 text-gray-400" />
              {isLast || !item.href ? (
                <span
                  className="bangla-text font-semibold text-emerald-700 dark:text-emerald-400"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="bangla-text transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;

