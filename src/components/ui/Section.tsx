import React from "react";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  pattern?: boolean;
}

export function Section({
  children,
  className = "",
  pattern = false,
  ...props
}: SectionProps) {
  return (
    <section
      className={`py-10 sm:py-14 lg:py-18 ${pattern ? "islamic-pattern" : ""} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}

export default Section;

