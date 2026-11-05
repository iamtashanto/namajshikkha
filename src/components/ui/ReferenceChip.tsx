import React from "react";
import { BookOpen } from "lucide-react";
import { Reference } from "@/src/types/content";

interface ReferenceChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  source?: string;
  hadithNumber?: string | number;
  grade?: string;
  url?: string;
  reference?: Reference;
}

export function ReferenceChip({
  source,
  hadithNumber,
  grade,
  url,
  reference,
  className = "",
  ...props
}: ReferenceChipProps) {
  const actualSource = reference ? reference.source : source || "";
  const actualNumber = reference ? reference.number : hadithNumber;
  const actualGrade = reference ? reference.grade : grade;
  const actualUrl = reference ? reference.url : url;

  const content = (
    <span
      className={`bangla-text inline-flex items-center gap-1.5 rounded-lg border border-emerald-100 bg-emerald-50/70 px-2.5 py-1 text-xs font-medium text-emerald-800 transition-colors hover:border-emerald-300 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-300 ${className}`}
      {...props}
    >
      <BookOpen className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
      <span>
        {actualSource}
        {actualNumber ? ` : ${actualNumber}` : ""}
      </span>
      {actualGrade && (
        <span className="rounded bg-emerald-200/70 px-1 py-0.2 text-[10px] font-bold text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200">
          {actualGrade}
        </span>
      )}
    </span>
  );

  if (actualUrl) {
    return (
      <a
        href={actualUrl}
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

