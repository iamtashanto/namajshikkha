import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  bordered?: boolean;
}

export function Card({
  children,
  hover = true,
  bordered = true,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-2xl bg-white p-5 shadow-sm transition-all duration-300 dark:bg-dark-card sm:p-6 ${
        bordered
          ? "border border-emerald-100/90 dark:border-dark-border"
          : ""
      } ${
        hover
          ? "hover:border-emerald-200 hover:shadow-md dark:hover:border-emerald-800/50"
          : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;

