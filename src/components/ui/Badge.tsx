import React from "react";

export type BadgeVariant =
  | "fard"
  | "sunnah"
  | "nafl"
  | "wajib"
  | "mustahab"
  | "neutral"
  | "gold";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
  fard: {
    container:
      "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/40",
    dot: "bg-emerald-500",
  },
  sunnah: {
    container:
      "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/40",
    dot: "bg-amber-500",
  },
  nafl: {
    container:
      "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/40",
    dot: "bg-blue-500",
  },
  wajib: {
    container:
      "bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800/40",
    dot: "bg-purple-500",
  },
  mustahab: {
    container:
      "bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800/40",
    dot: "bg-teal-500",
  },
  gold: {
    container:
      "bg-gold-50 text-gold-800 border-gold-200 dark:bg-gold-950/50 dark:text-gold-300 dark:border-gold-800/40",
    dot: "bg-gold-500",
  },
  neutral: {
    container:
      "bg-gray-100 text-gray-700 border-gray-200 dark:bg-dark-card-hover dark:text-dark-text-secondary dark:border-dark-border",
    dot: "bg-gray-400 dark:bg-dark-text-muted",
  },
};

export function Badge({
  variant = "neutral",
  children,
  dot = false,
  className = "",
  ...props
}: BadgeProps) {
  const current = variantStyles[variant];

  return (
    <span
      className={`bangla-text inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide ${current.container} ${className}`}
      {...props}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${current.dot}`} />}
      {children}
    </span>
  );
}

export default Badge;

