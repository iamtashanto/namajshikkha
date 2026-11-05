"use client";

import React, { createContext, useContext, useEffect, useState, useTransition } from "react";

export type ArabicFontSize = "sm" | "md" | "lg" | "xl";
export type GenderPreference = "male" | "female";

export interface LayerVisibility {
  arabic: boolean;
  uccharon: boolean;
  banglish: boolean;
  meaning: boolean;
}

export interface PreferencesState {
  arabicFontSize: ArabicFontSize;
  layers: LayerVisibility;
  gender: GenderPreference;
}

interface PreferencesContextType {
  preferences: PreferencesState;
  setArabicFontSize: (size: ArabicFontSize) => void;
  toggleLayer: (layer: keyof LayerVisibility) => void;
  setGender: (gender: GenderPreference) => void;
  resetPreferences: () => void;
  isPreferencePanelOpen: boolean;
  setPreferencePanelOpen: (open: boolean) => void;
}

const defaultPreferences: PreferencesState = {
  arabicFontSize: "lg",
  layers: {
    arabic: true,
    uccharon: true,
    banglish: false,
    meaning: true,
  },
  gender: "male",
};

const STORAGE_KEY = "namaj-user-preferences";

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<PreferencesState>(defaultPreferences);
  const [isPreferencePanelOpen, setPreferencePanelOpen] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        startTransition(() => {
          setPreferences((prev) => ({
            ...prev,
            ...parsed,
            layers: {
              ...prev.layers,
              ...(parsed.layers || {}),
            },
          }));
        });
      }
    } catch {
      // localStorage may be disabled or invalid; fail silently
    }
  }, []);

  const savePreferences = (newPrefs: PreferencesState) => {
    setPreferences(newPrefs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
    } catch {
      // Ignore quota or storage errors
    }
  };

  const setArabicFontSize = (size: ArabicFontSize) => {
    savePreferences({
      ...preferences,
      arabicFontSize: size,
    });
  };

  const toggleLayer = (layer: keyof LayerVisibility) => {
    savePreferences({
      ...preferences,
      layers: {
        ...preferences.layers,
        [layer]: !preferences.layers[layer],
      },
    });
  };

  const setGender = (gender: GenderPreference) => {
    savePreferences({
      ...preferences,
      gender,
    });
  };

  const resetPreferences = () => {
    savePreferences(defaultPreferences);
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        setArabicFontSize,
        toggleLayer,
        setGender,
        resetPreferences,
        isPreferencePanelOpen,
        setPreferencePanelOpen,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}

