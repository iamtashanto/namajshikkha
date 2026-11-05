import React from "react";
import { BookOpen } from "lucide-react";

interface ReferenceChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  source: string;
  hadithNumber?: string | number;
  grade?: string;
  url?: string;
}

export function ReferenceChip({
  source,
  hadithNumber,
  grade,
  url,
  className = "",
  ...props
}: ReferenceChipProps) {
  const content = (
    <span
      className={`bangla-text inline-flex items-center gap-1.5 rounded-lg border border-emerald-100 bg-emerald-50/70 px-2.5 py-1 text-xs font-medium text-emerald-800 transition-colors hover:border-emerald-300 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300 ${className}`}
      {...props}
    >
      <BookOpen className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
      <span>
        {source}
        {hadithNumber ? ` : ${hadithNumber}` : ""}
      </span>
      {grade && (
        <span className="rounded bg-emerald-200/70 px-1 py-0.2 text-[10px] font-bold text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200">
          {grade}
        </span>
      )}
    </span>
  );

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block transition-transform hover:scale-105"
      >
        {content}
      </a>
    );
  }

  return content;
}

export default ReferenceChip;

