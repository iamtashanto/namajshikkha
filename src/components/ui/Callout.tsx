import React from "react";
import { Lightbulb, AlertTriangle, BookOpen, Info } from "lucide-react";

export type CalloutType = "tip" | "warning" | "reference" | "hanafi" | "info";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const configMap: Record<
  CalloutType,
  {
    icon: React.ComponentType<{ className?: string }>;
    defaultTitle: string;
    container: string;
    iconColor: string;
    titleColor: string;
  }
> = {
  tip: {
    icon: Lightbulb,
    defaultTitle: "টিপস ও গুরুত্বপূর্ণ পরামর্শ",
    container:
      "border-gold-200 bg-gold-50/70 dark:border-gold-800/40 dark:bg-gold-950/20",
    iconColor: "text-gold-600 dark:text-gold-400",
    titleColor: "text-gold-900 dark:text-gold-300",
  },
  warning: {
    icon: AlertTriangle,
    defaultTitle: "সতর্কতা ও ভুল সংশোধন",
    container:
      "border-amber-200 bg-amber-50/80 dark:border-amber-800/40 dark:bg-amber-950/30",
    iconColor: "text-amber-600 dark:text-amber-400",
    titleColor: "text-amber-900 dark:text-amber-300",
  },
  reference: {
    icon: BookOpen,
    defaultTitle: "দলিল ও ফিকহী রেফারেন্স",
    container:
      "border-blue-200 bg-blue-50/60 dark:border-blue-800/40 dark:bg-blue-950/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    titleColor: "text-blue-900 dark:text-blue-300",
  },
  hanafi: {
    icon: Info,
    defaultTitle: "হানাফি মাজহাবের অভিমত",
    container:
      "border-emerald-200 bg-emerald-50/70 dark:border-emerald-800/40 dark:bg-emerald-950/25",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    titleColor: "text-emerald-900 dark:text-emerald-300",
  },
  info: {
    icon: Info,
    defaultTitle: "জেনে রাখা ভালো",
    container:
      "border-gray-200 bg-gray-50/80 dark:border-dark-border dark:bg-dark-card/60",
    iconColor: "text-gray-500 dark:text-dark-text-muted",
    titleColor: "text-gray-900 dark:text-white",
  },
};

export function Callout({
  type = "tip",
  title,
  children,
  className = "",
}: CalloutProps) {
  const current = configMap[type];
  const Icon = current.icon;
  const displayTitle = title || current.defaultTitle;

  return (
    <div
      role="note"
      className={`rounded-2xl border p-4 sm:p-5 transition-all ${current.container} ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 shrink-0 ${current.iconColor}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          {displayTitle && (
            <h4
              className={`bangla-text text-sm font-bold leading-tight ${current.titleColor} mb-1`}
            >
              {displayTitle}
            </h4>
          )}
          <div className="bangla-text text-xs leading-relaxed text-gray-700 dark:text-dark-text-secondary sm:text-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Callout;

