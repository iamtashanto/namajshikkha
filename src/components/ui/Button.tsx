import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    "bangla-text inline-flex items-center justify-center gap-2 font-semibold transition-all rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

  const variantClasses = {
    primary:
      "bg-emerald-600 text-white shadow-md shadow-emerald-200 hover:bg-emerald-700 dark:shadow-emerald-900/30",
    secondary:
      "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-950/80",
    outline:
      "border border-emerald-200 text-emerald-800 hover:bg-emerald-50 dark:border-emerald-800/60 dark:text-emerald-300 dark:hover:bg-dark-card-hover",
    ghost:
      "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-dark-text-secondary dark:hover:bg-dark-card-hover dark:hover:text-white",
    gold:
      "bg-gold-500 text-white shadow-md shadow-gold-200 hover:bg-gold-600 dark:shadow-gold-900/30",
  }[variant];

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  }[size];

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}

export default Button;

