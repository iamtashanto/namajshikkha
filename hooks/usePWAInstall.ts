import { useState, useEffect, useCallback } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const VISIT_COUNT_KEY = "namaj-pwa-visit-count";
const SESSION_MARKED_KEY = "namaj-pwa-session-marked";
const SIM_COMPLETED_KEY = "namaj-pwa-sim-completed";
const PROMPT_DISMISSED_KEY = "pwa-prompt-dismissed";

function checkIsEligibleForPrompt(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (localStorage.getItem(PROMPT_DISMISSED_KEY) === "true") {
      return false;
    }
    const alreadyMarked = sessionStorage.getItem(SESSION_MARKED_KEY);
    let visitCount = parseInt(localStorage.getItem(VISIT_COUNT_KEY) || "0", 10);
    if (!alreadyMarked) {
      visitCount += 1;
      localStorage.setItem(VISIT_COUNT_KEY, String(visitCount));
      sessionStorage.setItem(SESSION_MARKED_KEY, "true");
    }
    const simCompleted = localStorage.getItem(SIM_COMPLETED_KEY) === "true";
    return visitCount >= 2 || simCompleted;
  } catch {
    return false;
  }
}

export function usePWAInstall() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [shouldPromptUser, setShouldPromptUser] = useState<boolean>(() =>
    checkIsEligibleForPrompt()
  );

  const evaluatePromptEligibility = useCallback(() => {
    try {
      const dismissed = localStorage.getItem(PROMPT_DISMISSED_KEY) === "true";
      if (dismissed) {
        setShouldPromptUser(false);
        return;
      }
      const visitCount = parseInt(
        localStorage.getItem(VISIT_COUNT_KEY) || "1",
        10
      );
      const simCompleted =
        localStorage.getItem(SIM_COMPLETED_KEY) === "true";

      if (visitCount >= 2 || simCompleted) {
        setShouldPromptUser(true);
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Ignore service worker registration errors in dev
      });
    }

    const handleSimulationComplete = () => {
      try {
        localStorage.setItem(SIM_COMPLETED_KEY, "true");
      } catch {
        // Ignore storage errors
      }
      evaluatePromptEligibility();
    };

    window.addEventListener(
      "namaj:simulation-complete",
      handleSimulationComplete
    );

    // If already installed, we don't need to listen for the prompt
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return () => {
        window.removeEventListener(
          "namaj:simulation-complete",
          handleSimulationComplete
        );
      };
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      evaluatePromptEligibility();
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener(
        "namaj:simulation-complete",
        handleSimulationComplete
      );
    };
  }, [evaluatePromptEligibility]);

  const installApp = async () => {
    if (!installPrompt) return;

    await installPrompt.prompt();

    const { outcome } = await installPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstallable(false);
      setShouldPromptUser(false);
      setInstallPrompt(null);
    }
  };

  const dismissPrompt = () => {
    setShouldPromptUser(false);
    try {
      localStorage.setItem(PROMPT_DISMISSED_KEY, "true");
    } catch {
      // Ignore storage errors
    }
  };

  return {
    isInstallable,
    shouldPromptUser,
    installApp,
    dismissPrompt,
  };
}
