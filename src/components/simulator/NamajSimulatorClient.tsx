"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Volume2,
  VolumeX,
  Layers,
  Maximize2,
  Minimize2,
  ListOrdered,
  Settings2,
  CheckCircle2,
  Search,
  Sparkles,
  Share2,
  AlertTriangle,
  Eye,
  Hand,
  Users,
  User,
  Mic,
  Volume1,
  X,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { prayers, prayerSurahs, getPrayerBySlug } from "@/src/data";
import { getMasteredSurahIds } from "@/src/lib/hifz/storage";
import { PrayerGroup, PrayerType, RakatUnit } from "@/src/types/content";
import {
  buildTimeline,
  getDefaultSurahForRakat,
  POSTURE_META,
  SalahGender,
  SalahRole,
} from "@/src/lib/simulator";
import {
  resolveStepRecitations,
  collectTimelineAudioUrls,
  getDefaultHighlightsForPosture,
} from "@/src/lib/simulator/recitations";
import { PrayerFigure } from "@/src/components/simulator/PrayerFigure";
import { ArabicBlock } from "@/src/components/ui/ArabicBlock";
import { Badge, BadgeVariant } from "@/src/components/ui/Badge";
import { toBengaliNumber } from "@/src/lib/bengali";
import {
  usePreferences,
  LayerVisibility,
} from "@/src/context/PreferencesContext";

type FigureView = "side" | "front";
type SimulatorScreen = "setup" | "player" | "completion";
type PlaybackSpeed = 0.75 | 1 | 1.5;
type PlaybackMode = "auto" | "manual";

interface PersistedSimulatorSettings {
  prayerSlug: string;
  unitIndex: number;
  gender: SalahGender;
  role: SalahRole;
  surahChoices: Record<number, string>;
  speed: PlaybackSpeed;
  mode: PlaybackMode;
  muted: boolean;
}

const STORAGE_KEY = "namaj-simulator-settings-v1";

const GROUP_LABELS: Record<PrayerGroup, { title: string; order: number }> = {
  "daily-fard": { title: "দৈনিক ৫ ওয়াক্ত নামাজ", order: 1 },
  wajib: { title: "ওয়াজিব নামাজ (বিতর)", order: 2 },
  "jumuah-eid": { title: "জুমআ ও দুই ঈদ", order: 3 },
  janaza: { title: "জানাজার নামাজ", order: 4 },
  "sunnah-nafl": { title: "সুন্নাত ও নফল নামাজ", order: 5 },
  special: { title: "বিশেষ সালাত ও বিধান", order: 6 },
};

const STATUS_BADGE_MAP: Record<
  string,
  { variant: BadgeVariant; label: string }
> = {
  fard: { variant: "fard", label: "ফরজ" },
  wajib: { variant: "wajib", label: "ওয়াজিব" },
  sunnah: { variant: "sunnah", label: "সুন্নাত" },
  "sunnah-muakkadah": { variant: "sunnah", label: "সুন্নাত" },
  "sunnah-ghair-muakkadah": { variant: "sunnah", label: "সুন্নাত" },
  nafl: { variant: "nafl", label: "নফল" },
  special: { variant: "gold", label: "বিশেষ" },
};

const ROLE_OPTIONS: {
  value: SalahRole;
  labelBn: string;
  descBn: string;
  icon: typeof User;
}[] = [
  {
    value: "alone",
    labelBn: "একা (মুনফারিদ)",
    descBn: "নিজে একা পূর্ণ কিরাত ও দোয়াসহ আদায়",
    icon: User,
  },
  {
    value: "imam",
    labelBn: "ইমাম",
    descBn: "জামাআতে ইমামতি (জেহরী নামাজে উচ্চস্বরে কিরাত)",
    icon: Mic,
  },
  {
    value: "muqtadi",
    labelBn: "মুক্তাদি",
    descBn: "ইমামের পেছনে ইকতিদা (কিয়ামে নীরবে কিরাত শ্রবণ)",
    icon: Users,
  },
];

function resolvePrayerAlias(slugParam: string | null): PrayerType | undefined {
  if (!slugParam) return undefined;
  const normalized = slugParam.trim().toLowerCase();
  if (normalized === "eid") {
    return getPrayerBySlug("eid-ul-fitr");
  }
  return getPrayerBySlug(normalized);
}

function findBestUnitIndex(
  units: RakatUnit[],
  unitParam: string | null
): number {
  if (!units.length) return 0;
  if (unitParam) {
    const clean = unitParam.trim().toLowerCase();
    // 1. Direct numeric index
    const asNum = Number(clean);
    if (!Number.isNaN(asNum) && asNum >= 0 && asNum < units.length) {
      return asNum;
    }
    // 2. Match by status (e.g. unit=fard, unit=wajib, unit=sunnah)
    const byStatus = units.findIndex((u) => u.status.toLowerCase() === clean);
    if (byStatus !== -1) return byStatus;

    // 3. Match by label substring
    const byLabel = units.findIndex((u) =>
      u.label.toLowerCase().includes(clean)
    );
    if (byLabel !== -1) return byLabel;
  }

  // Default: prefer fard or wajib unit if present
  const fardIdx = units.findIndex(
    (u) => u.status === "fard" || u.status === "wajib"
  );
  return fardIdx !== -1 ? fardIdx : 0;
}

export function NamajSimulatorClient() {
  const searchParams = useSearchParams();
  const { preferences } = usePreferences();

  // Extract initial URL query params
  const urlPrayerParam = searchParams.get("prayer");
  const urlUnitParam = searchParams.get("unit") || searchParams.get("unitIndex");
  const urlGenderParam = searchParams.get("gender");
  const urlRoleParam = searchParams.get("role");
  const urlAutoStart =
    searchParams.get("autostart") === "1" ||
    searchParams.get("start") === "1" ||
    Boolean(urlPrayerParam && urlUnitParam);

  const initialPrayer =
    resolvePrayerAlias(urlPrayerParam) ||
    getPrayerBySlug("fajr") ||
    prayers[0];
  const initialUnitIdx = findBestUnitIndex(
    initialPrayer.rakatUnits,
    urlUnitParam
  );

  // Screen state
  const [screen, setScreen] = useState<SimulatorScreen>(
    urlAutoStart ? "player" : "setup"
  );

  // Setup configuration state
  const [selectedPrayerSlug, setSelectedPrayerSlug] = useState<string>(
    initialPrayer.slug
  );
  const [selectedUnitIndex, setSelectedUnitIndex] =
    useState<number>(initialUnitIdx);
  const [gender, setGender] = useState<SalahGender>(
    urlGenderParam === "female" || urlGenderParam === "male"
      ? urlGenderParam
      : preferences.gender
  );
  const [role, setRole] = useState<SalahRole>(
    urlRoleParam === "imam" ||
      urlRoleParam === "muqtadi" ||
      urlRoleParam === "alone"
      ? urlRoleParam
      : "alone"
  );
  const [surahChoices, setSurahChoices] = useState<Record<number, string>>({
    1: getDefaultSurahForRakat(1),
    2: getDefaultSurahForRakat(2),
    3: getDefaultSurahForRakat(3),
    4: getDefaultSurahForRakat(4),
  });
  const [includeMunajat, setIncludeMunajat] = useState<boolean>(false);
  const [masteredSurahIdSet, setMasteredSurahIdSet] = useState<Set<string>>(
    () => new Set()
  );

  useEffect(() => {
    let cancelled = false;
    async function loadMastered() {
      const ids = await getMasteredSurahIds();
      if (!cancelled && ids.length > 0) {
        setMasteredSurahIdSet(new Set(ids));
      }
    }
    loadMastered();
    return () => {
      cancelled = true;
    };
  }, []);

  // Setup search/filter state
  const [prayerSearch, setPrayerSearch] = useState<string>("");
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>("all");

  // Player controls state
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [mode, setMode] = useState<PlaybackMode>("auto");
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);
  const [muted, setMuted] = useState<boolean>(false);
  const [viewOverride, setViewOverride] = useState<"auto" | FigureView>("auto");
  const [showHighlights, setShowHighlights] = useState<boolean>(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  // Text layer visibility state (synced with Preferences inicialmente)
  const [visibleLayers, setVisibleLayers] = useState<LayerVisibility>({
    arabic: preferences.layers.arabic,
    uccharon: preferences.layers.uccharon,
    banglish: preferences.layers.banglish,
    meaning: preferences.layers.meaning,
  });

  // Step internal progress (audio / timer / repeat / recitation index)
  const [activeRecitationIdx, setActiveRecitationIdx] = useState<number>(0);
  const [currentRepeat, setCurrentRepeat] = useState<number>(1);
  const [stepProgress, setStepProgress] = useState<number>(0); // 0..1 across current recitation/step
  const [replayNonce, setReplayNonce] = useState<number>(0);

  // Refs for audio & fullscreen container
  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const preloadAudioRef = useRef<HTMLAudioElement | null>(null);

  // Load persisted settings from localStorage (only for fields not overridden by URL)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as Partial<PersistedSimulatorSettings>;

      if (!urlPrayerParam && saved.prayerSlug) {
        const p = resolvePrayerAlias(saved.prayerSlug);
        if (p) {
          setSelectedPrayerSlug(p.slug);
          if (
            typeof saved.unitIndex === "number" &&
            saved.unitIndex >= 0 &&
            saved.unitIndex < p.rakatUnits.length
          ) {
            setSelectedUnitIndex(saved.unitIndex);
          }
        }
      }
      if (
        !urlGenderParam &&
        (saved.gender === "male" || saved.gender === "female")
      ) {
        setGender(saved.gender);
      }
      if (
        !urlRoleParam &&
        (saved.role === "alone" ||
          saved.role === "imam" ||
          saved.role === "muqtadi")
      ) {
        setRole(saved.role);
      }
      if (saved.surahChoices && typeof saved.surahChoices === "object") {
        setSurahChoices((prev) => ({ ...prev, ...saved.surahChoices }));
      }
      if (saved.speed === 0.75 || saved.speed === 1 || saved.speed === 1.5) {
        setSpeed(saved.speed);
      }
      if (saved.mode === "auto" || saved.mode === "manual") {
        setMode(saved.mode);
      }
      if (typeof saved.muted === "boolean") {
        setMuted(saved.muted);
      }
    } catch {
      // Ignore storage access errors
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      const payload: PersistedSimulatorSettings = {
        prayerSlug: selectedPrayerSlug,
        unitIndex: selectedUnitIndex,
        gender,
        role,
        surahChoices,
        speed,
        mode,
        muted,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore storage write errors
    }
  }, [
    selectedPrayerSlug,
    selectedUnitIndex,
    gender,
    role,
    surahChoices,
    speed,
    mode,
    muted,
  ]);

  // Resolve current PrayerType and RakatUnit
  const selectedPrayer = useMemo(
    () =>
      getPrayerBySlug(selectedPrayerSlug) ||
      getPrayerBySlug("fajr") ||
      prayers[0],
    [selectedPrayerSlug]
  );

  const safeUnitIndex =
    selectedUnitIndex >= 0 &&
    selectedUnitIndex < selectedPrayer.rakatUnits.length
      ? selectedUnitIndex
      : 0;

  const selectedUnit = selectedPrayer.rakatUnits[safeUnitIndex];

  // Build deterministic timeline from the pure TS engine
  const timeline = useMemo(() => {
    return buildTimeline(selectedUnit.config, {
      gender,
      role,
      surahChoice: surahChoices,
      prayerSlug: selectedPrayer.slug,
      unitLabel: selectedUnit.label,
      includeMunajat,
    });
  }, [
    selectedUnit,
    gender,
    role,
    surahChoices,
    selectedPrayer.slug,
    includeMunajat,
  ]);

  const totalSteps = timeline.steps.length;
  const safeStepIndex = Math.max(
    0,
    Math.min(totalSteps - 1, currentStepIndex)
  );
  const currentStep = timeline.steps[safeStepIndex];
  const postureMeta = POSTURE_META[currentStep.posture];

  // Resolve current step recitations
  const currentRecitations = useMemo(
    () => resolveStepRecitations(currentStep, selectedPrayer),
    [currentStep, selectedPrayer]
  );

  const safeRecitationIdx = Math.max(
    0,
    Math.min(Math.max(0, currentRecitations.length - 1), activeRecitationIdx)
  );
  const activeRecitation = currentRecitations[safeRecitationIdx] || null;

  // Rakat markers along the timeline progress bar
  const rakatMarkers = useMemo(() => {
    const markers: { rakat: number; stepIndex: number; percent: number }[] = [];
    const seen = new Set<number>();
    timeline.steps.forEach((step, idx) => {
      if (step.rakat !== null && !seen.has(step.rakat)) {
        seen.add(step.rakat);
        markers.push({
          rakat: step.rakat,
          stepIndex: idx,
          percent: totalSteps > 1 ? (idx / (totalSteps - 1)) * 100 : 0,
        });
      }
    });
    return markers;
  }, [timeline.steps, totalSteps]);

  // Precache all timeline audio in the Service Worker when entering Player
  useEffect(() => {
    if (screen !== "player") return;
    const urls = collectTimelineAudioUrls(timeline.steps, selectedPrayer);
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "PRECACHE_AUDIO",
        urls,
      });
    }
  }, [screen, timeline.steps, selectedPrayer]);

  // Preload next step's audio whenever currentStepIndex changes
  useEffect(() => {
    if (screen !== "player") return;
    const nextStep = timeline.steps[safeStepIndex + 1];
    if (!nextStep) return;
    const nextRecs = resolveStepRecitations(nextStep, selectedPrayer);
    const firstNextAudio =
      nextRecs[0]?.audioUrl ||
      (nextStep.spokenTakbir ? "/audio/allahu-akbar.mp3" : undefined);

    if (firstNextAudio && typeof window !== "undefined") {
      if (!preloadAudioRef.current) {
        preloadAudioRef.current = new Audio();
        preloadAudioRef.current.preload = "auto";
      }
      preloadAudioRef.current.src = firstNextAudio;
      preloadAudioRef.current.load();
    }
  }, [screen, safeStepIndex, timeline.steps, selectedPrayer]);

  // Reset internal step counters when step changes
  const goToStep = useCallback(
    (index: number) => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (index >= totalSteps) {
        setIsPlaying(false);
        setScreen("completion");
        return;
      }
      const clamped = Math.max(0, Math.min(totalSteps - 1, index));
      setCurrentStepIndex(clamped);
      setActiveRecitationIdx(0);
      setCurrentRepeat(1);
      setStepProgress(0);
    },
    [totalSteps]
  );

  const handleNextStep = useCallback(() => {
    if (safeStepIndex >= totalSteps - 1) {
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
      setScreen("completion");
    } else {
      goToStep(safeStepIndex + 1);
    }
  }, [safeStepIndex, totalSteps, goToStep]);

  const handlePrevStep = useCallback(() => {
    goToStep(Math.max(0, safeStepIndex - 1));
  }, [safeStepIndex, goToStep]);

  const handleReplayStep = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setActiveRecitationIdx(0);
    setCurrentRepeat(1);
    setStepProgress(0);
    setReplayNonce((n) => n + 1);
    setIsPlaying(true);
  }, []);

  // Advance within a step (multiple recitations or tasbih repeats) or move to next step
  const advanceSegmentOrStep = useCallback(() => {
    const isMultiRepeatTasbih =
      currentStep.repeat > 1 && currentStep.repeat <= 3;

    // 1. If standard 3x tasbih (Ruku / Sajda), repeat up to 3 times
    if (isMultiRepeatTasbih && currentRepeat < currentStep.repeat) {
      setCurrentRepeat((r) => r + 1);
      setStepProgress(0);
      return;
    }

    // 2. If step has multiple recitations (e.g. Ta'awwuz -> Tasmiyah -> Surah Fatiha), advance recitation
    if (safeRecitationIdx < currentRecitations.length - 1) {
      setActiveRecitationIdx((idx) => idx + 1);
      setStepProgress(0);
      return;
    }

    // 3. Otherwise segment is finished: in Auto mode advance to next step; in Manual mode pause at end of step
    if (mode === "auto") {
      handleNextStep();
    } else {
      setStepProgress(1);
      setIsPlaying(false);
    }
  }, [
    currentStep.repeat,
    currentRepeat,
    safeRecitationIdx,
    currentRecitations.length,
    mode,
    handleNextStep,
  ]);

  // Core Audio + Timer Synchronization Effect
  useEffect(() => {
    if (screen !== "player" || !isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      return;
    }

    let cancelled = false;
    let rafId: number | null = null;

    // Determine audio URL for current segment
    const audioUrl =
      activeRecitation?.audioUrl ||
      (currentRecitations.length === 0 &&
      currentStep.spokenTakbir === "আল্লাহু আকবার"
        ? "/audio/allahu-akbar.mp3"
        : undefined);

    // Fallback duration for this segment when muted, no audio, or audio error
    const segmentBaseMs =
      currentRecitations.length > 1
        ? activeRecitation?.isSurah
          ? Math.max(7000, currentStep.durationHintMs * 0.7)
          : 2800
        : currentStep.repeat > 1 && currentStep.repeat <= 3
        ? Math.max(2000, currentStep.durationHintMs / currentStep.repeat)
        : currentStep.durationHintMs;

    const effectiveDurationMs = Math.max(1200, segmentBaseMs / speed);

    const startTimerFallback = () => {
      const startTime = performance.now();
      const isSalatutTasbihHighRepeat = currentStep.repeat > 3;

      const tick = (now: number) => {
        if (cancelled) return;
        const elapsed = now - startTime;
        const p = Math.min(1, elapsed / effectiveDurationMs);
        setStepProgress(p);

        if (isSalatutTasbihHighRepeat) {
          const rep = Math.min(
            currentStep.repeat,
            Math.max(1, Math.ceil(p * currentStep.repeat))
          );
          setCurrentRepeat(rep);
        }

        if (p < 1) {
          rafId = requestAnimationFrame(tick);
        } else {
          advanceSegmentOrStep();
        }
      };

      rafId = requestAnimationFrame(tick);
    };

    if (muted || !audioUrl) {
      startTimerFallback();
      return () => {
        cancelled = true;
        if (rafId !== null) cancelAnimationFrame(rafId);
      };
    }

    // Play real audio and sync highlightProgress + repeat counter
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;
    audio.pause();
    audio.src = audioUrl;
    audio.playbackRate = speed;
    audio.muted = muted;

    const handleTimeUpdate = () => {
      if (cancelled) return;
      if (audio.duration && Number.isFinite(audio.duration) && audio.duration > 0) {
        const p = Math.min(1, audio.currentTime / audio.duration);
        setStepProgress(p);
        if (currentStep.repeat > 3) {
          setCurrentRepeat(
            Math.min(
              currentStep.repeat,
              Math.max(1, Math.ceil(p * currentStep.repeat))
            )
          );
        }
      }
    };

    const handleEnded = () => {
      if (cancelled) return;
      setStepProgress(1);
      // Small natural pause (300ms) between segments
      setTimeout(() => {
        if (!cancelled) {
          advanceSegmentOrStep();
        }
      }, 280);
    };

    const handleError = () => {
      if (cancelled) return;
      startTimerFallback();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    audio.play().catch(() => {
      if (!cancelled) {
        startTimerFallback();
      }
    });

    return () => {
      cancelled = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.pause();
    };
  }, [
    screen,
    isPlaying,
    safeStepIndex,
    safeRecitationIdx,
    currentRepeat,
    replayNonce,
    speed,
    muted,
    activeRecitation,
    currentRecitations.length,
    currentStep.durationHintMs,
    currentStep.repeat,
    currentStep.spokenTakbir,
    advanceSegmentOrStep,
  ]);

  // Toggle Fullscreen (native Fullscreen API + CSS fallback for mobile browsers)
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement && containerRef.current?.requestFullscreen) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } else {
        setIsFullscreen((prev) => !prev);
      }
    } catch {
      setIsFullscreen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Keyboard shortcuts on Player screen: Space play/pause, Arrows prev/next, R replay, M mute, F fullscreen
  useEffect(() => {
    if (screen !== "player") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "SELECT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        handleNextStep();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        handlePrevStep();
      } else if (e.code === "KeyR") {
        e.preventDefault();
        handleReplayStep();
      } else if (e.code === "KeyM") {
        e.preventDefault();
        setMuted((prev) => !prev);
      } else if (e.code === "KeyF") {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    screen,
    handleNextStep,
    handlePrevStep,
    handleReplayStep,
    toggleFullscreen,
  ]);

  // Start Simulator from Setup screen and update URL query string for deep linking
  const startSimulation = (startMode: PlaybackMode = mode, autoPlay = true) => {
    setMode(startMode);
    setCurrentStepIndex(0);
    setActiveRecitationIdx(0);
    setCurrentRepeat(1);
    setStepProgress(0);
    setScreen("player");
    setIsPlaying(autoPlay);

    try {
      const params = new URLSearchParams();
      params.set("prayer", selectedPrayer.slug);
      params.set("unit", selectedUnit.status);
      params.set("gender", gender);
      params.set("role", role);
      window.history.replaceState(null, "", `/simulator?${params.toString()}`);
    } catch {
      // Ignore history API errors
    }
  };

  // Share Simulator Deep Link
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/simulator?prayer=${selectedPrayer.slug}&unit=${selectedUnit.status}&gender=${gender}&role=${role}`;
    const shareTitle = `${selectedPrayer.nameBn} (${selectedUnit.label}) — নামাজ সিমুলেটর | নামাজ শিক্ষা`;
    const shareText = `নামাজ শিক্ষার ইন্টারঅ্যাক্টিভ সিমুলেটরে ধাপে ধাপে ${selectedPrayer.nameBn} নামাজের (${selectedUnit.label}) সঠিক নিয়ম দেখুন।`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      }
    } catch {
      // Fallback to clipboard
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareFeedback("লিঙ্ক কপি হয়েছে!");
      setTimeout(() => setShareFeedback(null), 2500);
    } catch {
      setShareFeedback("লিঙ্ক শেয়ার করা যায়নি");
      setTimeout(() => setShareFeedback(null), 2500);
    }
  };

  // Filtered & grouped prayers for the Setup screen
  const groupedSetupPrayers = useMemo(() => {
    const q = prayerSearch.trim().toLowerCase();
    const filtered = prayers.filter((p) => {
      if (selectedGroupFilter !== "all" && p.group !== selectedGroupFilter) {
        return false;
      }
      if (!q) return true;
      return (
        p.nameBn.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.nameAr.toLowerCase().includes(q)
      );
    });

    const groups: Partial<Record<PrayerGroup, PrayerType[]>> = {};
    for (const p of filtered) {
      if (!groups[p.group]) groups[p.group] = [];
      groups[p.group]!.push(p);
    }

    return Object.entries(groups).sort(
      ([a], [b]) =>
        (GROUP_LABELS[a as PrayerGroup]?.order ?? 99) -
        (GROUP_LABELS[b as PrayerGroup]?.order ?? 99)
    );
  }, [prayerSearch, selectedGroupFilter]);

  const effectiveFigureView: FigureView =
    viewOverride === "auto" ? postureMeta.recommendedView : viewOverride;

  const currentHighlights = useMemo(
    () =>
      showHighlights ? getDefaultHighlightsForPosture(currentStep.posture) : [],
    [showHighlights, currentStep.posture]
  );

  const toggleTextLayer = (layer: keyof LayerVisibility) => {
    setVisibleLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };

  const overallProgressPercent =
    totalSteps > 1 ? (safeStepIndex / (totalSteps - 1)) * 100 : 100;

  return (
    <div
      ref={containerRef}
      className={
        isFullscreen
          ? "fixed inset-0 z-[100] overflow-y-auto bg-white p-3 sm:p-6 dark:bg-dark-bg"
          : "mx-auto max-w-6xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8"
      }
    >
      {/* Screen Reader Live Announcement Region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {screen === "player"
          ? `ধাপ ${toBengaliNumber(safeStepIndex + 1)}, মোট ${toBengaliNumber(
              totalSteps
            )}। ${
              currentStep.rakat
                ? `রাকাত ${toBengaliNumber(currentStep.rakat)}।`
                : ""
            } অবস্থান: ${postureMeta.labelBn}। ${currentStep.titleBn}। নির্দেশনা: ${
              currentStep.instructionBn
            }`
          : screen === "completion"
          ? `আলহামদুলিল্লাহ! আপনি ${selectedPrayer.nameBn} নামাজের ${selectedUnit.label} সম্পন্ন করেছেন।`
          : "নামাজ সিমুলেটর সেটআপ স্ক্রিন"}
      </div>

      {/* Top Mode Switcher Bar */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-2.5 shadow-2xs dark:border-dark-border dark:bg-dark-card">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
            <Sparkles className="h-4.5 w-4.5" />
          </span>
          <div>
            <h1 className="bangla-text text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-tight">
              নামাজ সিমুলেটর
            </h1>
            <p className="bangla-text text-[11px] text-gray-500 dark:text-dark-text-muted">
              {selectedPrayer.nameBn} • {selectedUnit.label} •{" "}
              {gender === "male" ? "পুরুষ" : "মহিলা"} •{" "}
              {role === "alone"
                ? "একা"
                : role === "imam"
                ? "ইমাম"
                : "মুক্তাদি"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setScreen("setup");
            }}
            className={`bangla-text inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              screen === "setup"
                ? "bg-emerald-600 text-white shadow-xs"
                : "border border-gray-200 bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-secondary"
            }`}
          >
            <Settings2 className="h-3.5 w-3.5" />
            <span>১. সেটআপ</span>
          </button>

          <button
            type="button"
            onClick={() => setScreen("player")}
            className={`bangla-text inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              screen === "player"
                ? "bg-emerald-600 text-white shadow-xs"
                : "border border-gray-200 bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-secondary"
            }`}
          >
            <Play className="h-3.5 w-3.5" />
            <span>২. প্লেয়ার ({toBengaliNumber(totalSteps)} ধাপ)</span>
          </button>

          {screen === "completion" && (
            <span className="bangla-text inline-flex items-center gap-1 rounded-xl bg-gold-500 px-3 py-1.5 text-xs font-bold text-white shadow-xs">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>৩. সম্পন্ন</span>
            </span>
          )}

          <Link
            href={`/simulator/practice?prayer=${selectedPrayer.slug}&unit=${selectedUnit.status}&gender=${gender}`}
            className="bangla-text inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
          >
            <span>কুইজ ও অনুশীলন</span>
          </Link>
        </div>
      </div>

      {/* =====================================================================
          SCREEN 1: SETUP SCREEN
         ===================================================================== */}
      {screen === "setup" && (
        <div className="space-y-6">
          {/* Quick Start Banner for currently selected prayer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 via-emerald-50/40 to-white p-4 sm:p-5 shadow-xs dark:border-emerald-800/50 dark:from-emerald-950/40 dark:via-dark-card dark:to-dark-card">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <Badge
                  variant={
                    STATUS_BADGE_MAP[selectedUnit.status]?.variant || "fard"
                  }
                  dot
                >
                  {STATUS_BADGE_MAP[selectedUnit.status]?.label ||
                    selectedUnit.status}
                </Badge>
                <span className="bangla-text text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  মোট {toBengaliNumber(totalSteps)} টি ধাপ • হানাফি ফিকহ
                </span>
              </div>
              <h2 className="bangla-text text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {selectedPrayer.nameBn} — {selectedUnit.label}
              </h2>
              <p className="bangla-text text-xs sm:text-sm text-gray-600 dark:text-dark-text-secondary mt-0.5">
                লিঙ্গ: <strong>{gender === "male" ? "পুরুষ" : "মহিলা"}</strong> •
                ভূমিকা:{" "}
                <strong>
                  {role === "alone"
                    ? "একা (মুনফারিদ)"
                    : role === "imam"
                    ? "ইমাম"
                    : "মুক্তাদি"}
                </strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => startSimulation("auto", true)}
                className="bangla-text inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-emerald-200 transition-all hover:bg-emerald-700 active:scale-95 dark:shadow-emerald-950/40"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>অটো মোডে শুরু করুন</span>
              </button>
              <button
                type="button"
                onClick={() => startSimulation("manual", false)}
                className="bangla-text inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-300 bg-white px-4 py-3 text-sm font-bold text-emerald-800 transition-all hover:bg-emerald-50 dark:border-emerald-700 dark:bg-dark-bg dark:text-emerald-300"
              >
                <span>ম্যানুয়াল অনুশীলন</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left Column (7 cols): Step 1 — Choose Prayer */}
            <div className="lg:col-span-7 space-y-4 rounded-2xl border border-emerald-100 bg-white p-4 sm:p-6 shadow-xs dark:border-dark-border dark:bg-dark-card">
              <div className="flex items-center justify-between border-b border-emerald-50 pb-3 dark:border-dark-border">
                <h3 className="bangla-text text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  ১. নামাজ নির্বাচন করুন ({toBengaliNumber(prayers.length)} টি)
                </h3>
                <Link
                  href={`/namaj/${selectedPrayer.slug}`}
                  className="bangla-text inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>পূর্ণ মাসায়েল</span>
                </Link>
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-600 dark:text-emerald-400" />
                <input
                  type="search"
                  value={prayerSearch}
                  onChange={(e) => setPrayerSearch(e.target.value)}
                  placeholder="নামাজ খুঁজুন (যেমন: ফজর, যোহর, বিতর, ঈদ, জানাজা, তাহাজ্জুদ)..."
                  aria-label="নামাজ অনুসন্ধান করুন"
                  className="bangla-text w-full rounded-xl border border-gray-200 bg-gray-50/70 py-2.5 pl-10 pr-4 text-sm text-gray-900 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-dark-border dark:bg-dark-bg dark:text-white"
                />
              </div>

              {/* Group Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setSelectedGroupFilter("all")}
                  className={`bangla-text whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                    selectedGroupFilter === "all"
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-emerald-50 dark:bg-dark-bg dark:text-dark-text-secondary"
                  }`}
                >
                  সব ({toBengaliNumber(prayers.length)})
                </button>
                {(
                  Object.entries(GROUP_LABELS) as [
                    PrayerGroup,
                    { title: string; order: number }
                  ][]
                )
                  .sort(([, a], [, b]) => a.order - b.order)
                  .map(([grpKey, meta]) => (
                    <button
                      key={grpKey}
                      type="button"
                      onClick={() => setSelectedGroupFilter(grpKey)}
                      className={`bangla-text whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                        selectedGroupFilter === grpKey
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-emerald-50 dark:bg-dark-bg dark:text-dark-text-secondary"
                      }`}
                    >
                      {meta.title}
                    </button>
                  ))}
              </div>

              {/* Grouped Prayer List */}
              <div className="max-h-[420px] space-y-5 overflow-y-auto pr-1">
                {groupedSetupPrayers.map(([grpKey, list]) => (
                  <div key={grpKey} className="space-y-2">
                    <h4 className="bangla-text text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      {GROUP_LABELS[grpKey as PrayerGroup]?.title}
                    </h4>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {list?.map((p) => {
                        const isSelected = p.slug === selectedPrayer.slug;
                        return (
                          <button
                            key={p.slug}
                            type="button"
                            onClick={() => {
                              setSelectedPrayerSlug(p.slug);
                              setSelectedUnitIndex(
                                findBestUnitIndex(p.rakatUnits, null)
                              );
                            }}
                            className={`flex flex-col items-start justify-between rounded-xl border p-3 text-left transition-all ${
                              isSelected
                                ? "border-emerald-600 bg-emerald-50/90 ring-2 ring-emerald-500/20 dark:border-emerald-500 dark:bg-emerald-950/50"
                                : "border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30 dark:border-dark-border dark:bg-dark-bg"
                            }`}
                          >
                            <div className="flex w-full items-center justify-between gap-1 mb-1">
                              <span className="bangla-text text-sm font-bold text-gray-900 dark:text-white">
                                {p.nameBn}
                              </span>
                              <span className="arabic-text text-xs font-bold text-emerald-700 dark:text-emerald-400">
                                {p.nameAr}
                              </span>
                            </div>
                            <span className="bangla-text text-[11px] text-gray-500 dark:text-dark-text-muted">
                              {p.slug === "janaza"
                                ? "৪ তাকবীর"
                                : `${toBengaliNumber(p.totalRakats)} রাকাত`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column (5 cols): Rakat Unit, Gender, Role & Surah Choices */}
            <div className="lg:col-span-5 space-y-5">
              {/* Step 2: Rakat Unit Selection */}
              <div className="rounded-2xl border border-emerald-100 bg-white p-4 sm:p-5 shadow-xs dark:border-dark-border dark:bg-dark-card">
                <h3 className="bangla-text mb-3 text-base font-bold text-gray-900 dark:text-white">
                  ২. রাকাত ইউনিট নির্বাচন করুন ({selectedPrayer.nameBn})
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {selectedPrayer.rakatUnits.map((unit, idx) => {
                    const active = idx === safeUnitIndex;
                    const badge = STATUS_BADGE_MAP[unit.status] || {
                      variant: "neutral" as BadgeVariant,
                      label: unit.status,
                    };
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedUnitIndex(idx)}
                        className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-left transition-all ${
                          active
                            ? "border-emerald-600 bg-emerald-50/90 ring-2 ring-emerald-500/20 dark:border-emerald-500 dark:bg-emerald-950/50"
                            : "border-gray-200 bg-white hover:border-emerald-200 dark:border-dark-border dark:bg-dark-bg"
                        }`}
                      >
                        <span className="bangla-text text-sm font-bold text-gray-900 dark:text-white">
                          {unit.label}
                        </span>
                        <Badge variant={badge.variant} dot>
                          {badge.label}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Gender & Role Selection */}
              <div className="rounded-2xl border border-emerald-100 bg-white p-4 sm:p-5 shadow-xs dark:border-dark-border dark:bg-dark-card space-y-4">
                <div>
                  <h3 className="bangla-text mb-2.5 text-base font-bold text-gray-900 dark:text-white">
                    ৩. লিঙ্গ নির্বাচন (হানাফি অঙ্গভঙ্গির পার্থক্য)
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setGender("male")}
                      className={`bangla-text flex flex-col items-start rounded-xl border p-3 transition-all ${
                        gender === "male"
                          ? "border-emerald-600 bg-emerald-50/90 ring-2 ring-emerald-500/20 dark:border-emerald-500 dark:bg-emerald-950/50"
                          : "border-gray-200 bg-white dark:border-dark-border dark:bg-dark-bg"
                      }`}
                    >
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        পুরুষ (Male)
                      </span>
                      <span className="text-[11px] text-gray-500 dark:text-dark-text-muted mt-0.5">
                        কান পর্যন্ত হাত তোলা, নাভির নিচে বাঁধা
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setGender("female")}
                      className={`bangla-text flex flex-col items-start rounded-xl border p-3 transition-all ${
                        gender === "female"
                          ? "border-emerald-600 bg-emerald-50/90 ring-2 ring-emerald-500/20 dark:border-emerald-500 dark:bg-emerald-950/50"
                          : "border-gray-200 bg-white dark:border-dark-border dark:bg-dark-bg"
                      }`}
                    >
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        মহিলা (Female)
                      </span>
                      <span className="text-[11px] text-gray-500 dark:text-dark-text-muted mt-0.5">
                        কাঁধ পর্যন্ত হাত তোলা, বুকের ওপর বাঁধা
                      </span>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="bangla-text mb-2.5 text-base font-bold text-gray-900 dark:text-white">
                    ৪. নামাজ আদায়ের ভূমিকা (একা / ইমাম / মুক্তাদি)
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {ROLE_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      const active = role === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setRole(opt.value)}
                          className={`flex items-center gap-3 rounded-xl border p-2.5 text-left transition-all ${
                            active
                              ? "border-emerald-600 bg-emerald-50/90 ring-2 ring-emerald-500/20 dark:border-emerald-500 dark:bg-emerald-950/50"
                              : "border-gray-200 bg-white dark:border-dark-border dark:bg-dark-bg"
                          }`}
                        >
                          <span
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                              active
                                ? "bg-emerald-600 text-white"
                                : "bg-gray-100 text-gray-600 dark:bg-dark-card dark:text-dark-text-muted"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <div>
                            <div className="bangla-text text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                              {opt.labelBn}
                            </div>
                            <div className="bangla-text text-[11px] text-gray-500 dark:text-dark-text-muted">
                              {opt.descBn}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Step 5: Optional Surah Choices per Rakat */}
              {!selectedUnit.config.isJanaza &&
                role !== "muqtadi" &&
                selectedUnit.config.qiratRakats.length > 0 && (
                  <div className="rounded-2xl border border-emerald-100 bg-white p-4 sm:p-5 shadow-xs dark:border-dark-border dark:bg-dark-card">
                    <h3 className="bangla-text mb-1 text-base font-bold text-gray-900 dark:text-white">
                      ৫. রাকাতভিত্তিক সূরা নির্বাচন (ঐচ্ছিক)
                    </h3>
                    <p className="bangla-text mb-3 text-xs text-gray-500 dark:text-dark-text-muted">
                      সূরা ফাতিহার পর যে সূরাগুলো তিলাওয়াত করতে চান:
                    </p>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {selectedUnit.config.qiratRakats
                        .slice(0, 4)
                        .map((rakatNum) => {
                          const currentSurahId =
                            surahChoices[rakatNum] ||
                            getDefaultSurahForRakat(rakatNum);
                          return (
                            <div key={rakatNum} className="space-y-1">
                              <label
                                htmlFor={`surah-select-r${rakatNum}`}
                                className="bangla-text block text-xs font-semibold text-gray-700 dark:text-dark-text-secondary"
                              >
                                {toBengaliNumber(rakatNum)}ম রাকাতের সূরা:
                              </label>
                              <select
                                id={`surah-select-r${rakatNum}`}
                                value={currentSurahId}
                                onChange={(e) =>
                                  setSurahChoices((prev) => ({
                                    ...prev,
                                    [rakatNum]: e.target.value,
                                  }))
                                }
                                className="bangla-text w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-900 focus:border-emerald-500 focus:outline-none dark:border-dark-border dark:bg-dark-bg dark:text-white"
                              >
                                {masteredSurahIdSet.size > 0 && (
                                  <optgroup label="★ আমার মুখস্থ সূরা (হিফজ রেকর্ড):">
                                    {prayerSurahs
                                      .filter(
                                        (s) =>
                                          s.number !== 1 &&
                                          masteredSurahIdSet.has(s.id)
                                      )
                                      .map((s) => (
                                        <option key={`mem-${s.id}`} value={s.id}>
                                          ★ {toBengaliNumber(s.number)}. সূরা{" "}
                                          {s.nameBn} ({s.nameAr})
                                        </option>
                                      ))}
                                  </optgroup>
                                )}
                                <optgroup
                                  label={
                                    masteredSurahIdSet.size > 0
                                      ? "অন্যান্য সূরাসমূহ:"
                                      : "নামাজে পঠিত সূরাসমূহ:"
                                  }
                                >
                                  {prayerSurahs
                                    .filter(
                                      (s) =>
                                        s.number !== 1 &&
                                        !masteredSurahIdSet.has(s.id)
                                    )
                                    .map((s) => (
                                      <option key={s.id} value={s.id}>
                                        {toBengaliNumber(s.number)}. সূরা{" "}
                                        {s.nameBn} ({s.nameAr})
                                      </option>
                                    ))}
                                </optgroup>
                              </select>
                            </div>
                          );
                        })}
                    </div>

                    <label className="mt-3 flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeMunajat}
                        onChange={(e) => setIncludeMunajat(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="bangla-text text-xs text-gray-700 dark:text-dark-text-secondary">
                        সালাম ফিরানোর পর মাসনূন জিকির ও মুনাজাতের ধাপ যুক্ত করুন
                      </span>
                    </label>
                  </div>
                )}

              {/* Bottom Start Button */}
              <button
                type="button"
                onClick={() => startSimulation("auto", true)}
                className="bangla-text flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 text-base font-bold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-700 active:scale-98 dark:shadow-emerald-950/50"
              >
                <Play className="h-5 w-5 fill-current" />
                <span>
                  সিমুলেটর শুরু করুন — {selectedPrayer.nameBn} (
                  {selectedUnit.label})
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SCREEN 2: PLAYER SCREEN
         ===================================================================== */}
      {screen === "player" && (
        <div className="space-y-4">
          {/* Top Timeline & Rakat Progress Bar */}
          <div className="rounded-2xl border border-emerald-100 bg-white p-3.5 sm:p-4 shadow-xs dark:border-dark-border dark:bg-dark-card">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="bangla-text rounded-xl bg-emerald-600 px-3 py-1 text-xs sm:text-sm font-bold text-white">
                  {timeline.metadata.isJanaza
                    ? "জানাজা • ৪ তাকবীর"
                    : currentStep.rakat !== null
                    ? `রাকাত ${toBengaliNumber(
                        currentStep.rakat
                      )}/${toBengaliNumber(timeline.metadata.totalRakats)}`
                    : `রাকাত ${toBengaliNumber(
                        timeline.metadata.totalRakats
                      )}/${toBengaliNumber(
                        timeline.metadata.totalRakats
                      )} (সমাপ্তি)`}
                </span>

                <span className="bangla-text text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                  {selectedPrayer.nameBn} — {selectedUnit.label}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="bangla-text text-xs font-semibold text-gray-500 dark:text-dark-text-muted">
                  ধাপ {toBengaliNumber(safeStepIndex + 1)}/
                  {toBengaliNumber(totalSteps)}
                </span>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(true)}
                  className="bangla-text inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3 py-1.5 text-xs font-bold text-emerald-800 transition-colors hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                >
                  <ListOrdered className="h-3.5 w-3.5" />
                  <span>সকল ধাপ</span>
                </button>
              </div>
            </div>

            {/* Whole-Timeline Progress Bar with Rakat Markers */}
            <div className="relative pt-1 pb-4">
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-dark-bg">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-300"
                  style={{ width: `${overallProgressPercent}%` }}
                />
              </div>

              {/* Rakat Marker Ticks */}
              {rakatMarkers.map((m) => (
                <button
                  key={m.rakat}
                  type="button"
                  onClick={() => goToStep(m.stepIndex)}
                  style={{ left: `${Math.min(96, Math.max(2, m.percent))}%` }}
                  title={`${toBengaliNumber(m.rakat)}ম রাকাতে যান`}
                  className={`bangla-text absolute top-0 -translate-x-1/2 flex flex-col items-center group focus:outline-none`}
                >
                  <span
                    className={`h-4 w-4 rounded-full border-2 text-[9px] font-bold flex items-center justify-center transition-transform group-hover:scale-110 ${
                      currentStep.rakat === m.rakat
                        ? "border-emerald-700 bg-emerald-600 text-white"
                        : safeStepIndex >= m.stepIndex
                        ? "border-emerald-500 bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200"
                        : "border-gray-300 bg-white text-gray-500 dark:border-gray-600 dark:bg-dark-card dark:text-gray-400"
                    }`}
                  >
                    {toBengaliNumber(m.rakat)}
                  </span>
                  <span className="mt-0.5 text-[10px] font-semibold text-gray-500 dark:text-dark-text-muted whitespace-nowrap">
                    {toBengaliNumber(m.rakat)}ম রাকাত
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Responsive Split Stage (Works in Portrait, Landscape on Phones, and Desktop) */}
          <div className="grid grid-cols-1 gap-4 landscape:grid-cols-12 lg:grid-cols-12 items-start">
            {/* LEFT / CENTER COLUMN: Large Animated 2D Figure */}
            <div className="landscape:col-span-5 lg:col-span-5 flex flex-col rounded-2xl border border-emerald-100 bg-white p-3.5 shadow-xs dark:border-dark-border dark:bg-dark-card">
              {/* Stage Top Controls (View & Highlights) */}
              <div className="mb-2 flex flex-wrap items-center justify-between gap-1.5">
                <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1 dark:bg-dark-bg">
                  <button
                    type="button"
                    onClick={() => setViewOverride("auto")}
                    className={`bangla-text rounded-lg px-2 py-1 text-[11px] font-semibold transition-colors ${
                      viewOverride === "auto"
                        ? "bg-white text-emerald-700 shadow-2xs dark:bg-dark-card dark:text-emerald-400"
                        : "text-gray-600 dark:text-dark-text-muted"
                    }`}
                  >
                    অটো ভিউ
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewOverride("side")}
                    className={`bangla-text rounded-lg px-2 py-1 text-[11px] font-semibold transition-colors ${
                      viewOverride === "side"
                        ? "bg-white text-emerald-700 shadow-2xs dark:bg-dark-card dark:text-emerald-400"
                        : "text-gray-600 dark:text-dark-text-muted"
                    }`}
                  >
                    পাশ থেকে
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewOverride("front")}
                    className={`bangla-text rounded-lg px-2 py-1 text-[11px] font-semibold transition-colors ${
                      viewOverride === "front"
                        ? "bg-white text-emerald-700 shadow-2xs dark:bg-dark-card dark:text-emerald-400"
                        : "text-gray-600 dark:text-dark-text-muted"
                    }`}
                  >
                    সামনে থেকে
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowHighlights((h) => !h)}
                  className={`bangla-text inline-flex items-center gap-1 rounded-xl border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                    showHighlights
                      ? "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                      : "border-gray-200 bg-white text-gray-500 dark:border-dark-border dark:bg-dark-bg"
                  }`}
                  title="অঙ্গের ফোকাস নির্দেশক"
                >
                  <Eye className="h-3 w-3" />
                  <span>অঙ্গ হাইলাইট</span>
                </button>
              </div>

              {/* Fixed-height Figure Container to prevent any CLS */}
              <div className="relative flex h-[280px] sm:h-[320px] items-center justify-center">
                <PrayerFigure
                  posture={currentStep.posture}
                  gender={gender}
                  view={effectiveFigureView}
                  highlightParts={currentHighlights}
                  className="h-full w-full max-w-[340px]"
                />
              </div>

              {/* Spoken Takbir & Loud/Silent Status Footer under Figure */}
              <div className="mt-2 flex min-h-[36px] flex-wrap items-center justify-between gap-2 rounded-xl bg-emerald-50/70 px-3 py-1.5 dark:bg-emerald-950/30">
                <div className="flex items-center gap-1.5">
                  <Volume1 className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                  <span className="bangla-text text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    {currentStep.spokenTakbir
                      ? `তাকবীর: "${currentStep.spokenTakbir}"`
                      : "তাকবীর নেই (স্থির অবস্থান)"}
                  </span>
                </div>

                <span
                  className={`bangla-text rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                    currentStep.isLoud
                      ? "bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200"
                      : "bg-white/90 text-gray-600 dark:bg-dark-card dark:text-dark-text-muted"
                  }`}
                >
                  {role === "muqtadi" && currentStep.id.includes("qiyam-muqtadi")
                    ? "মুক্তাদি: নীরবে শ্রবণ"
                    : currentStep.isLoud
                    ? "ইমাম: উচ্চস্বরে (জেহরী)"
                    : "নীরবে পাঠ (সিররী)"}
                </span>
              </div>
            </div>

            {/* RIGHT / BOTTOM COLUMN: Instruction, Tasbih Counter & 4-Layer Recitation */}
            <div className="landscape:col-span-7 lg:col-span-7 flex flex-col space-y-3">
              {/* Current Step Instruction Card (Stable min-height) */}
              <div className="min-h-[104px] rounded-2xl border border-emerald-200/90 bg-gradient-to-br from-emerald-50/60 via-white to-white p-4 shadow-xs dark:border-dark-border dark:from-emerald-950/25 dark:via-dark-card dark:to-dark-card">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="bangla-text rounded-lg bg-emerald-600 px-2.5 py-0.5 text-xs font-bold text-white">
                      ধাপ {toBengaliNumber(safeStepIndex + 1)}
                    </span>
                    <h2 className="bangla-text text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                      {currentStep.titleBn}
                    </h2>
                  </div>

                  {/* Repeat Counter Badge ("১/৩" or "১/১৫") for Tasbihat */}
                  {currentStep.repeat > 1 && (
                    <div className="flex items-center gap-2">
                      <span
                        data-testid="repeat-counter"
                        className="bangla-text inline-flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-100/90 px-3 py-1 text-xs sm:text-sm font-bold text-amber-950 shadow-2xs dark:border-amber-700 dark:bg-amber-950/70 dark:text-amber-200"
                      >
                        <span>তাসবীহ গণনা:</span>
                        <span className="text-sm sm:text-base text-emerald-800 dark:text-emerald-300">
                          {toBengaliNumber(currentRepeat)}/
                          {toBengaliNumber(currentStep.repeat)}
                        </span>
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setCurrentRepeat((r) =>
                            r < currentStep.repeat ? r + 1 : 1
                          )
                        }
                        className="bangla-text inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 active:scale-95"
                        title="ম্যানুয়াল তাসবীহ গণনা"
                      >
                        <Hand className="h-3 w-3" />
                        <span>+১</span>
                      </button>
                    </div>
                  )}
                </div>

                <p className="bangla-text text-sm sm:text-base leading-relaxed text-gray-700 dark:text-dark-text-secondary">
                  {currentStep.instructionBn}
                </p>
              </div>

              {/* Recitation Slot (Fixed min-height to prevent layout shifts when step/text changes) */}
              <div className="min-h-[250px] flex flex-col justify-between">
                {/* Multi-recitation sub-tabs when a step has >1 recitation (e.g. Ta'awwuz + Tasmiyah + Fatiha) */}
                {currentRecitations.length > 1 && (
                  <div className="mb-2 flex items-center gap-1.5 overflow-x-auto pb-1">
                    {currentRecitations.map((rec, idx) => (
                      <button
                        key={rec.id}
                        type="button"
                        onClick={() => {
                          setActiveRecitationIdx(idx);
                          setStepProgress(0);
                        }}
                        className={`bangla-text whitespace-nowrap rounded-xl px-3 py-1 text-xs font-semibold transition-all ${
                          idx === safeRecitationIdx
                            ? "bg-emerald-600 text-white shadow-2xs"
                            : idx < safeRecitationIdx
                            ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : "bg-gray-100 text-gray-600 dark:bg-dark-card dark:text-dark-text-muted"
                        }`}
                      >
                        {toBengaliNumber(idx + 1)}. {rec.titleBn}
                      </button>
                    ))}
                  </div>
                )}

                {activeRecitation ? (
                  <ArabicBlock
                    key={`${currentStep.id}-${activeRecitation.id}`}
                    id={activeRecitation.id}
                    title={activeRecitation.titleBn}
                    arabic={activeRecitation.arabic}
                    uccharon={activeRecitation.uccharonBn}
                    banglish={activeRecitation.banglish}
                    meaning={activeRecitation.meaningBn}
                    audioUrl={activeRecitation.audioUrl}
                    reference={activeRecitation.referenceSource}
                    hadithNumber={activeRecitation.referenceNumber}
                    highlightProgress={stepProgress}
                    isHighlighting={isPlaying || stepProgress > 0}
                    externalLayers={visibleLayers}
                    onToggleExternalLayer={toggleTextLayer}
                    compact
                    className="flex-1"
                  />
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-emerald-100 bg-white p-6 text-center dark:border-dark-border dark:bg-dark-card">
                    <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                      <Users className="h-5 w-5" />
                    </div>
                    <h3 className="bangla-text text-base font-bold text-gray-900 dark:text-white">
                      {role === "muqtadi" &&
                      currentStep.id.includes("qiyam-muqtadi")
                        ? "মুক্তাদির বিধান: নীরবে দাঁড়িয়ে ইমামের কিরাত শ্রবণ"
                        : "এই অবস্থানে মুখে অতিরিক্ত কোনো দোয়া নেই"}
                    </h3>
                    <p className="bangla-text mt-1 max-w-md text-xs sm:text-sm text-gray-600 dark:text-dark-text-secondary">
                      {role === "muqtadi" &&
                      currentStep.id.includes("qiyam-muqtadi")
                        ? "হানাফি ফিকহ অনুযায়ী ইমামের পেছনে মুক্তাদি সূরা ফাতিহা ও কিরাত পড়বেন না; নীরবে হাত বেঁধে দাঁড়িয়ে মনোযোগের সাথে ইমামের তিলাওয়াত শুনবেন।"
                        : currentStep.instructionBn}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Unified Player Controls Bar */}
          <div className="sticky bottom-2 z-30 rounded-2xl border border-emerald-200/90 bg-white/95 p-3 sm:p-4 shadow-lg backdrop-blur-md dark:border-dark-border dark:bg-dark-card/95">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Primary Transport Controls: Prev, Play/Pause, Next, Replay */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={safeStepIndex === 0}
                  aria-label="পূর্ববর্তী ধাপ"
                  title="পূর্ববর্তী ধাপ (←)"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-40 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-secondary"
                >
                  <SkipBack className="h-4.5 w-4.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  aria-label={isPlaying ? "বিরতি (Pause)" : "চালান (Play)"}
                  title="চালান / বিরতি (Space)"
                  className="bangla-text inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white shadow-md shadow-emerald-200 transition-all hover:bg-emerald-700 active:scale-95 dark:shadow-emerald-950/40"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-4.5 w-4.5 fill-current" />
                      <span>বিরতি</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4.5 w-4.5 fill-current" />
                      <span>চালান</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleNextStep}
                  aria-label="পরবর্তী ধাপ"
                  title="পরবর্তী ধাপ (→)"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-secondary"
                >
                  <SkipForward className="h-4.5 w-4.5" />
                </button>

                <button
                  type="button"
                  onClick={handleReplayStep}
                  aria-label="ধাপটি পুনরায় চালান"
                  title="পুনরায় চালান (R)"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-secondary"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              {/* Secondary Controls: Auto/Manual, Speed, Mute, Layers, Fullscreen */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {/* Auto vs Manual Mode Toggle */}
                <div className="flex items-center rounded-xl border border-gray-200 bg-gray-100 p-0.5 dark:border-dark-border dark:bg-dark-bg">
                  <button
                    type="button"
                    onClick={() => setMode("auto")}
                    className={`bangla-text rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors ${
                      mode === "auto"
                        ? "bg-emerald-600 text-white shadow-2xs"
                        : "text-gray-600 dark:text-dark-text-muted"
                    }`}
                  >
                    অটো
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("manual")}
                    className={`bangla-text rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors ${
                      mode === "manual"
                        ? "bg-emerald-600 text-white shadow-2xs"
                        : "text-gray-600 dark:text-dark-text-muted"
                    }`}
                  >
                    ম্যানুয়াল
                  </button>
                </div>

                {/* Speed Selector (0.75x, 1x, 1.5x) */}
                <div className="flex items-center rounded-xl border border-gray-200 bg-gray-100 p-0.5 dark:border-dark-border dark:bg-dark-bg">
                  {([0.75, 1, 1.5] as PlaybackSpeed[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSpeed(s)}
                      className={`rounded-lg px-2 py-1.5 text-xs font-bold transition-colors ${
                        speed === s
                          ? "bg-white text-emerald-700 shadow-2xs dark:bg-dark-card dark:text-emerald-400"
                          : "text-gray-600 dark:text-dark-text-muted"
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>

                {/* Mute Toggle */}
                <button
                  type="button"
                  onClick={() => setMuted((m) => !m)}
                  aria-label={muted ? "অডিও চালু করুন" : "অডিও মিউট করুন"}
                  title="মিউট / আনমিউট (M)"
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
                    muted
                      ? "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-400"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-emerald-50 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-secondary"
                  }`}
                >
                  {muted ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </button>

                {/* Toggle Text Layers */}
                <button
                  type="button"
                  onClick={() => setShowLayerMenu((v) => !v)}
                  aria-label="টেক্সট স্তর পরিবর্তন"
                  title="টেক্সট স্তর (আরবি, উচ্চারণ, ব্যাংলিশ, অর্থ)"
                  className={`bangla-text inline-flex h-9 items-center gap-1 rounded-xl border px-2.5 text-xs font-semibold transition-colors ${
                    showLayerMenu
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-emerald-50 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-secondary"
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">স্তর</span>
                </button>

                {/* Fullscreen Toggle */}
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  aria-label={
                    isFullscreen ? "ফুলস্ক্রিন বন্ধ করুন" : "ফুলস্ক্রিন করুন"
                  }
                  title="ফুলস্ক্রিন (F)"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-emerald-50 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-secondary"
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Expandable Layer Toggle Pills inside Controls Bar */}
            {showLayerMenu && (
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-emerald-100 pt-2.5 dark:border-dark-border">
                <span className="bangla-text text-xs font-semibold text-gray-500 dark:text-dark-text-muted">
                  টেক্সট স্তর প্রদর্শন:
                </span>
                {(
                  [
                    { key: "arabic", label: "আরবি" },
                    { key: "uccharon", label: "বাংলা উচ্চারণ" },
                    { key: "banglish", label: "ব্যাংলিশ" },
                    { key: "meaning", label: "বাংলা অর্থ" },
                  ] as { key: keyof LayerVisibility; label: string }[]
                ).map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => toggleTextLayer(item.key)}
                    className={`bangla-text rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                      visibleLayers[item.key]
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-100 text-gray-600 dark:bg-dark-bg dark:text-dark-text-muted"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          STEP LIST DRAWER (Timeline Drawer)
         ===================================================================== */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-[110] flex justify-end bg-black/50 backdrop-blur-xs"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div
            className="flex h-full w-full max-w-md flex-col bg-white p-4 sm:p-6 shadow-2xl dark:bg-dark-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3 dark:border-dark-border">
              <div>
                <h3 className="bangla-text text-lg font-bold text-gray-900 dark:text-white">
                  সম্পূর্ণ টাইমলাইন ({toBengaliNumber(totalSteps)} ধাপ)
                </h3>
                <p className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted">
                  যে কোনো ধাপে ট্যাপ করে সরাসরি সেখানে যান
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                aria-label="ড্রয়ার বন্ধ করুন"
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-100 dark:border-dark-border"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 flex-1 space-y-2 overflow-y-auto pr-1">
              {timeline.steps.map((step, idx) => {
                const isCurrent = idx === safeStepIndex;
                const isDone = idx < safeStepIndex;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => {
                      goToStep(idx);
                      setIsDrawerOpen(false);
                    }}
                    className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all ${
                      isCurrent
                        ? "border-emerald-600 bg-emerald-50/90 ring-2 ring-emerald-500/20 dark:border-emerald-500 dark:bg-emerald-950/60"
                        : isDone
                        ? "border-emerald-100 bg-emerald-50/30 dark:border-dark-border dark:bg-dark-bg/50"
                        : "border-gray-200 bg-white hover:border-emerald-200 dark:border-dark-border dark:bg-dark-bg"
                    }`}
                  >
                    <span
                      className={`bangla-text flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        isCurrent
                          ? "bg-emerald-600 text-white"
                          : isDone
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                          : "bg-gray-100 text-gray-600 dark:bg-dark-card dark:text-gray-400"
                      }`}
                    >
                      {toBengaliNumber(idx + 1)}
                    </span>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="bangla-text text-sm font-bold text-gray-900 dark:text-white truncate">
                          {step.titleBn}
                        </span>
                        {step.rakat !== null && (
                          <span className="bangla-text shrink-0 rounded-md bg-emerald-100/80 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            {toBengaliNumber(step.rakat)}ম রাকাত
                          </span>
                        )}
                      </div>
                      <p className="bangla-text mt-0.5 line-clamp-1 text-xs text-gray-500 dark:text-dark-text-muted">
                        {step.instructionBn}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SCREEN 3: COMPLETION SCREEN
         ===================================================================== */}
      {screen === "completion" && (
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="rounded-3xl border border-emerald-200 bg-gradient-to-b from-emerald-50/70 via-white to-white p-6 sm:p-10 text-center shadow-sm dark:border-emerald-800/50 dark:from-emerald-950/30 dark:via-dark-card dark:to-dark-card">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-950/50">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <span className="bangla-text inline-block rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              আলহামদুলিল্লাহ • অনুশীলন সম্পন্ন
            </span>

            <h2 className="bangla-text mt-3 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              আপনি {selectedPrayer.nameBn} নামাজের {selectedUnit.label} সম্পন্ন
              করেছেন
            </h2>

            <p className="bangla-text mx-auto mt-2 max-w-xl text-sm text-gray-600 dark:text-dark-text-secondary">
              হানাফি ফিকহ অনুযায়ী{" "}
              {gender === "male" ? "পুরুষদের" : "মহিলাদের"} নিয়মে মোট{" "}
              {toBengaliNumber(totalSteps)} টি ধাপ{" "}
              {timeline.metadata.totalTasbihCount > 0
                ? `ও ${toBengaliNumber(
                    timeline.metadata.totalTasbihCount
                  )} বার তাসবীহ `
                : ""}
              সফলভাবে প্রদর্শিত হয়েছে।
            </p>

            {/* Primary Completion CTA Buttons */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/simulator/practice?prayer=${selectedPrayer.slug}&unit=${selectedUnit.status}&gender=${gender}`}
                className="bangla-text inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-emerald-200 transition-all hover:bg-emerald-700 dark:shadow-emerald-950/40"
              >
                <RotateCcw className="h-4 w-4" />
                <span>অনুশীলন মোড (Practice Quiz)</span>
              </Link>

              <button
                type="button"
                onClick={() => setScreen("setup")}
                className="bangla-text inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-5 py-3 text-sm font-bold text-emerald-800 transition-colors hover:bg-emerald-50 dark:border-dark-border dark:bg-dark-bg dark:text-emerald-300"
              >
                <span>অন্য নামাজ দেখুন</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="bangla-text inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-secondary"
              >
                <Share2 className="h-4 w-4" />
                <span>{shareFeedback || "শেয়ার করুন"}</span>
              </button>
            </div>
          </div>

          {/* Common Mistakes for this Prayer */}
          {selectedPrayer.commonMistakes &&
            selectedPrayer.commonMistakes.length > 0 && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 sm:p-6 dark:border-amber-900/40 dark:bg-amber-950/20">
                <div className="mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <h3 className="bangla-text text-lg font-bold text-amber-950 dark:text-amber-200">
                    {selectedPrayer.nameBn} নামাজে সচরাচর ঘটা ভুলসমূহ (সতর্কতা)
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  {selectedPrayer.commonMistakes.map((mistake, idx) => (
                    <li
                      key={idx}
                      className="bangla-text flex items-start gap-2.5 text-sm text-amber-950 dark:text-amber-200 leading-relaxed"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                        {toBengaliNumber(idx + 1)}
                      </span>
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
export default NamajSimulatorClient;
