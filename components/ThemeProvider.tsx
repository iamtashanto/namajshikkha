"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

const STORAGE_KEY = "namaj-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored === "dark" || stored === "light") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTheme(stored);
        document.documentElement.classList.toggle("dark", stored === "dark");
      } else if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        setTheme("dark");
        document.documentElement.classList.add("dark");
      }
    } catch {
      // Storage access may be blocked; fallback gracefully
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore localStorage write error
    }
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", next === "dark");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
