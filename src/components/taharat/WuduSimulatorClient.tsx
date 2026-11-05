"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
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
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Droplets,
  Trophy,
  BookOpen,
  Hand,
  X,
} from "lucide-react";
import {
  buildWuduTimeline,
  generateWuduQuizQuestions,
  validateWuduStepOrder,
  SalahGender,
} from "@/src/lib/simulator";
import { resolveRecitationById } from "@/src/lib/simulator/recitations";
import { WuduFigure } from "@/src/components/simulator/WuduFigure";
import { ArabicBlock } from "@/src/components/ui/ArabicBlock";
import { Badge } from "@/src/components/ui/Badge";
import { toBengaliNumber } from "@/src/lib/bengali";
import {
  usePreferences,
  LayerVisibility,
} from "@/src/context/PreferencesContext";

type WuduTab = "player" | "practice" | "completed";
type PlaybackSpeed = 0.75 | 1 | 1.5;

export function WuduSimulatorClient() {
  const { preferences } = usePreferences();

  // Mode tab: player | practice | completed
  const [activeTab, setActiveTab] = useState<WuduTab>("player");

  // WuduConfig options
  const [includeSunnahSteps, setIncludeSunnahSteps] = useState<boolean>(true);
  const [isFasting, setIsFasting] = useState<boolean>(false);
  const [hasKhuffMasah, setHasKhuffMasah] = useState<boolean>(false);
  const [gender, setGender] = useState<SalahGender>(preferences.gender);

  // Player controls
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [mode, setMode] = useState<"auto" | "manual">("auto");
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);
  const [muted, setMuted] = useState<boolean>(false);
  const [currentRepeat, setCurrentRepeat] = useState<number>(1);
  const [stepProgress, setStepProgress] = useState<number>(0);
  const [replayNonce, setReplayNonce] = useState<number>(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);

  const [visibleLayers, setVisibleLayers] = useState<LayerVisibility>({
    arabic: preferences.layers.arabic,
    uccharon: preferences.layers.uccharon,
    banglish: preferences.layers.banglish,
    meaning: preferences.layers.meaning,
  });

  // Practice Quiz (Order Validation) state
  const [quizIndex, setQuizIndex] = useState<number>(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(
    null
  );
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [submittedOrderIds, setSubmittedOrderIds] = useState<string[]>([]);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Build deterministic WuduTimeline from WuduConfig
  const timeline = useMemo(
    () =>
      buildWuduTimeline({
        includeSunnahSteps,
        isFasting,
        hasKhuffMasah,
        gender,
      }),
    [includeSunnahSteps, isFasting, hasKhuffMasah, gender]
  );

  const totalSteps = timeline.steps.length;
  const safeStepIndex = Math.max(
    0,
    Math.min(totalSteps - 1, currentStepIndex)
  );
  const currentStep = timeline.steps[safeStepIndex];

  const activeDua = useMemo(
    () =>
      currentStep.recitationId
        ? resolveRecitationById(currentStep.recitationId)
        : null,
    [currentStep.recitationId]
  );

  const quizQuestions = useMemo(
    () => generateWuduQuizQuestions(timeline),
    [timeline]
  );

  const goToStep = useCallback(
    (idx: number) => {
      if (audioRef.current) audioRef.current.pause();
      if (idx >= totalSteps) {
        setIsPlaying(false);
        setActiveTab("completed");
        return;
      }
      setCurrentStepIndex(Math.max(0, Math.min(totalSteps - 1, idx)));
      setCurrentRepeat(1);
      setStepProgress(0);
    },
    [totalSteps]
  );

  const handleNextStep = useCallback(() => {
    if (safeStepIndex >= totalSteps - 1) {
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
      setActiveTab("completed");
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
    setCurrentRepeat(1);
    setStepProgress(0);
    setReplayNonce((n) => n + 1);
    setIsPlaying(true);
  }, []);

  // Synchronize Audio / Timer / 3x Repeat Counter in Player
  useEffect(() => {
    if (activeTab !== "player" || !isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      return;
    }

    let cancelled = false;
    let rafId: number | null = null;
    const audioUrl = activeDua?.audioUrl;
    const durationMs = Math.max(1500, currentStep.durationHintMs / speed);

    const startTimer = () => {
      const start = performance.now();
      const tick = (now: number) => {
        if (cancelled) return;
        const p = Math.min(1, (now - start) / durationMs);
        setStepProgress(p);

        if (currentStep.repeat > 1) {
          const rep = Math.min(
            currentStep.repeat,
            Math.max(1, Math.ceil(p * currentStep.repeat))
          );
          setCurrentRepeat(rep);
        }

        if (p < 1) {
          rafId = requestAnimationFrame(tick);
        } else if (mode === "auto") {
          handleNextStep();
        } else {
          setIsPlaying(false);
        }
      };
      rafId = requestAnimationFrame(tick);
    };

    if (muted || !audioUrl) {
      startTimer();
      return () => {
        cancelled = true;
        if (rafId !== null) cancelAnimationFrame(rafId);
      };
    }

    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;
    audio.pause();
    audio.src = audioUrl;
    audio.playbackRate = speed;
    audio.muted = muted;

    const onTimeUpdate = () => {
      if (cancelled) return;
      if (audio.duration && Number.isFinite(audio.duration) && audio.duration > 0) {
        setStepProgress(Math.min(1, audio.currentTime / audio.duration));
      }
    };

    const onEnded = () => {
      if (cancelled) return;
      setStepProgress(1);
      setTimeout(() => {
        if (!cancelled) {
          if (mode === "auto") handleNextStep();
          else setIsPlaying(false);
        }
      }, 300);
    };

    const onError = () => {
      if (!cancelled) startTimer();
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    audio.play().catch(() => {
      if (!cancelled) startTimer();
    });

    return () => {
      cancelled = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.pause();
    };
  }, [
    activeTab,
    isPlaying,
    safeStepIndex,
    replayNonce,
    speed,
    muted,
    mode,
    activeDua,
    currentStep.durationHintMs,
    currentStep.repeat,
    handleNextStep,
  ]);

  // Keyboard shortcuts
  useEffect(() => {
    if (activeTab !== "player") return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        handleNextStep();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        handlePrevStep();
      } else if (e.code === "KeyR") {
        e.preventDefault();
        handleReplayStep();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeTab, handleNextStep, handlePrevStep, handleReplayStep]);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement && containerRef.current?.requestFullscreen) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } else {
        setIsFullscreen((v) => !v);
      }
    } catch {
      setIsFullscreen((v) => !v);
    }
  };

  // Start Practice Quiz
  const startPracticeQuiz = () => {
    setIsPlaying(false);
    setQuizIndex(0);
    setSelectedQuizOption(null);
    setQuizAnswered(false);
    setQuizScore(0);
    setSubmittedOrderIds([]);
    setQuizFinished(false);
    setActiveTab("practice");
  };

  const currentQuizQuestion = quizQuestions[quizIndex];

  const handleSelectQuizOption = (optionId: string) => {
    if (quizAnswered || !currentQuizQuestion) return;
    setSelectedQuizOption(optionId);
    setQuizAnswered(true);
    setSubmittedOrderIds((prev) => [...prev, optionId]);
    if (optionId === currentQuizQuestion.correctOptionId) {
      setQuizScore((s) => s + 1);
    }
  };

  const handleNextQuizStep = () => {
    if (quizIndex >= quizQuestions.length - 1) {
      setQuizFinished(true);
    } else {
      setQuizIndex((i) => i + 1);
      setSelectedQuizOption(null);
      setQuizAnswered(false);
    }
  };

  const orderValidationResult = useMemo(
    () =>
      validateWuduStepOrder(submittedOrderIds, {
        includeSunnahSteps,
        isFasting,
        hasKhuffMasah,
        gender,
      }),
    [submittedOrderIds, includeSunnahSteps, isFasting, hasKhuffMasah, gender]
  );

  return (
    <div
      ref={containerRef}
      className={
        isFullscreen
          ? "fixed inset-0 z-[100] overflow-y-auto bg-white p-3 sm:p-6 dark:bg-dark-bg"
          : "mx-auto max-w-6xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8"
      }
    >
      {/* Top Bar: Title & Mode Tabs */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-sky-200 bg-white px-4 py-3 shadow-2xs dark:border-dark-border dark:bg-dark-card">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-emerald-600 text-white shadow-xs">
            <Droplets className="h-5 w-5" />
          </span>
          <div>
            <h1 className="bangla-text text-base sm:text-lg font-bold text-gray-900 dark:text-white">
              ইন্টারঅ্যাক্টিভ অযু সিমুলেটর ও অনুশীলন
            </h1>
            <p className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted">
              পানি প্রবাহ অ্যানিমেশন, ৩ বার গণনা, দোয়া এবং অযুর ধারাবাহিকতা যাচাই কুইজ
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("player")}
            className={`bangla-text inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              activeTab === "player"
                ? "bg-emerald-600 text-white shadow-xs"
                : "border border-gray-200 bg-gray-50 text-gray-700 hover:bg-emerald-50 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-secondary"
            }`}
          >
            <Play className="h-3.5 w-3.5" />
            <span>১. অযু সিমুলেটর ({toBengaliNumber(totalSteps)} ধাপ)</span>
          </button>

          <button
            type="button"
            onClick={startPracticeQuiz}
            className={`bangla-text inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              activeTab === "practice"
                ? "bg-emerald-600 text-white shadow-xs"
                : "border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
            }`}
          >
            <Trophy className="h-3.5 w-3.5" />
            <span>২. ধারাবাহিকতা কুইজ (Practice Mode)</span>
          </button>

          <Link
            href="/taharat/wudu"
            className="bangla-text inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-secondary"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>অযুর পূর্ণ মাসায়েল</span>
          </Link>
        </div>
      </div>

      {/* Wudu Config Options Toolbar */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 dark:border-dark-border dark:bg-dark-card">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIncludeSunnahSteps(true);
              setCurrentStepIndex(0);
            }}
            className={`bangla-text rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
              includeSunnahSteps
                ? "bg-emerald-600 text-white"
                : "bg-white text-gray-700 border border-gray-200 dark:bg-dark-bg dark:border-dark-border dark:text-dark-text-secondary"
            }`}
          >
            সুন্নাতসহ পূর্ণ অযু (৯ ধাপ)
          </button>
          <button
            type="button"
            onClick={() => {
              setIncludeSunnahSteps(false);
              setCurrentStepIndex(0);
            }}
            className={`bangla-text rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
              !includeSunnahSteps
                ? "bg-emerald-600 text-white"
                : "bg-white text-gray-700 border border-gray-200 dark:bg-dark-bg dark:border-dark-border dark:text-dark-text-secondary"
            }`}
          >
            শুধু ৪ ফরজ (সংক্ষিপ্ত অযু)
          </button>

          <label className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 cursor-pointer dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-secondary">
            <input
              type="checkbox"
              checked={isFasting}
              onChange={(e) => setIsFasting(e.target.checked)}
              className="h-3.5 w-3.5 rounded text-emerald-600"
            />
            <span className="bangla-text">রোজাদার অবস্থা</span>
          </label>

          <label className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 cursor-pointer dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-secondary">
            <input
              type="checkbox"
              checked={hasKhuffMasah}
              onChange={(e) => setHasKhuffMasah(e.target.checked)}
              className="h-3.5 w-3.5 rounded text-emerald-600"
            />
            <span className="bangla-text">চামড়ার মোজায় মাসেহ</span>
          </label>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setGender("male")}
            className={`bangla-text rounded-lg px-2.5 py-1 text-xs font-bold ${
              gender === "male"
                ? "bg-emerald-600 text-white"
                : "bg-white text-gray-600 dark:bg-dark-bg dark:text-dark-text-muted"
            }`}
          >
            পুরুষ
          </button>
          <button
            type="button"
            onClick={() => setGender("female")}
            className={`bangla-text rounded-lg px-2.5 py-1 text-xs font-bold ${
              gender === "female"
                ? "bg-emerald-600 text-white"
                : "bg-white text-gray-600 dark:bg-dark-bg dark:text-dark-text-muted"
            }`}
          >
            মহিলা
          </button>
        </div>
      </div>

      {/* =====================================================================
          TAB 1: WUDU PLAYER SCREEN
         ===================================================================== */}
      {activeTab === "player" && (
        <div className="space-y-4">
          {/* Timeline Progress Bar with 4 Fard Markers */}
          <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-xs dark:border-dark-border dark:bg-dark-card">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="bangla-text rounded-xl bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
                  ধাপ {toBengaliNumber(safeStepIndex + 1)}/
                  {toBengaliNumber(totalSteps)}
                </span>
                <span className="bangla-text text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                  {currentStep.titleBn}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="bangla-text inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
              >
                <ListOrdered className="h-3.5 w-3.5" />
                <span>অযুর সকল ধাপ</span>
              </button>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-9 gap-1.5">
              {timeline.steps.map((s, idx) => {
                const active = idx === safeStepIndex;
                const done = idx < safeStepIndex;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goToStep(idx)}
                    className={`bangla-text flex flex-col items-center rounded-xl border p-1.5 text-center transition-all ${
                      active
                        ? "border-emerald-600 bg-emerald-50 font-bold text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950/60 dark:text-emerald-200"
                        : done
                        ? "border-emerald-200 bg-emerald-50/40 text-emerald-800 dark:border-dark-border dark:bg-dark-bg dark:text-emerald-400"
                        : "border-gray-200 bg-white text-gray-500 dark:border-dark-border dark:bg-dark-bg"
                    }`}
                  >
                    <span className="text-[10px]">
                      ধাপ {toBengaliNumber(idx + 1)}{" "}
                      {s.isFard ? "• ফরজ" : ""}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 items-start">
            {/* Left (5 cols): Animated Wudu Figure with Flowing Water */}
            <div className="lg:col-span-5 rounded-2xl border border-emerald-100 bg-white p-4 shadow-xs dark:border-dark-border dark:bg-dark-card">
              <div className="flex h-[290px] items-center justify-center">
                <WuduFigure
                  posture={currentStep.posture}
                  gender={gender}
                  waterTarget={currentStep.waterTargetPart}
                  hasWaterAnimation={currentStep.hasWaterAnimation}
                  repeatCount={currentStep.repeat}
                  currentRepeat={currentRepeat}
                  isFard={currentStep.isFard}
                  fardNumber={currentStep.fardNumber}
                  className="h-full w-full max-w-[360px]"
                />
              </div>

              <div className="mt-2 flex items-center justify-between rounded-xl bg-sky-50/80 px-3 py-2 text-xs dark:bg-sky-950/30">
                <span className="bangla-text font-bold text-sky-900 dark:text-sky-200">
                  {currentStep.hasWaterAnimation
                    ? "💧 প্রবহমান পানি দ্বারা ধৌতকরণ / মাসেহ"
                    : "🤲 অযুর মাসনূন দোয়া পাঠ"}
                </span>
                <span className="bangla-text font-bold text-emerald-700 dark:text-emerald-400">
                  {toBengaliNumber(currentStep.repeat)} বার
                </span>
              </div>
            </div>

            {/* Right (7 cols): Instruction, Count (৩ বার), Tips & Before/After Duas */}
            <div className="lg:col-span-7 space-y-3">
              <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/60 via-white to-white p-4 sm:p-5 shadow-xs dark:border-dark-border dark:from-emerald-950/25 dark:via-dark-card dark:to-dark-card">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={currentStep.isFard ? "fard" : "sunnah"}
                      dot
                    >
                      {currentStep.isFard
                        ? `অযুর ${toBengaliNumber(
                            currentStep.fardNumber!
                          )}নং ফরজ`
                        : "অযুর সুন্নাত"}
                    </Badge>
                    <h2 className="bangla-text text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                      {currentStep.titleBn}
                    </h2>
                  </div>

                  {/* Repeat Counter (৩ বার) */}
                  <div className="flex items-center gap-2">
                    <span className="bangla-text rounded-xl border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold text-sky-900 dark:border-sky-800 dark:bg-sky-950/60 dark:text-sky-200">
                      গণনা: {toBengaliNumber(currentRepeat)}/
                      {toBengaliNumber(currentStep.repeat)} বার
                    </span>
                    {currentStep.repeat > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentRepeat((r) =>
                            r < currentStep.repeat ? r + 1 : 1
                          )
                        }
                        className="bangla-text inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white hover:bg-emerald-700"
                      >
                        <Hand className="h-3 w-3" />
                        <span>+১</span>
                      </button>
                    )}
                  </div>
                </div>

                <p className="bangla-text text-sm sm:text-base leading-relaxed text-gray-700 dark:text-dark-text-secondary">
                  {currentStep.instructionBn}
                </p>

                <div className="mt-3 rounded-xl border border-emerald-100 bg-white/90 p-3 text-xs text-gray-600 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-secondary">
                  <strong className="bangla-text text-emerald-700 dark:text-emerald-400">
                    শরয়ী নোট ও টিপস:{" "}
                  </strong>
                  <span className="bangla-text">{currentStep.tipsBn}</span>
                </div>
              </div>

              {/* 4-Layer Dua Before / After Wudu (when applicable, or reference card on washing steps) */}
              <div className="min-h-[210px]">
                {activeDua ? (
                  <ArabicBlock
                    key={activeDua.id}
                    id={activeDua.id}
                    title={activeDua.titleBn}
                    arabic={activeDua.arabic}
                    uccharon={activeDua.uccharonBn}
                    banglish={activeDua.banglish}
                    meaning={activeDua.meaningBn}
                    audioUrl={activeDua.audioUrl}
                    reference={activeDua.referenceSource}
                    hadithNumber={activeDua.referenceNumber}
                    highlightProgress={stepProgress}
                    isHighlighting={isPlaying || stepProgress > 0}
                    externalLayers={visibleLayers}
                    onToggleExternalLayer={(layer) =>
                      setVisibleLayers((prev) => ({
                        ...prev,
                        [layer]: !prev[layer],
                      }))
                    }
                    compact
                  />
                ) : (
                  <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-xs dark:border-dark-border dark:bg-dark-card">
                    <h3 className="bangla-text text-sm font-bold text-emerald-800 dark:text-emerald-300 mb-1.5">
                      এই ধাপের ফিকহী বিধান ({currentStep.titleBn})
                    </h3>
                    <p className="bangla-text text-sm leading-relaxed text-gray-700 dark:text-dark-text-secondary">
                      {currentStep.rulingExplanationBn}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Transport Controls Bar (Same as Namaj Simulator) */}
          <div className="sticky bottom-2 z-30 rounded-2xl border border-emerald-200/90 bg-white/95 p-3 sm:p-4 shadow-lg backdrop-blur-md dark:border-dark-border dark:bg-dark-card/95">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={safeStepIndex === 0}
                  aria-label="পূর্ববর্তী ধাপ"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-emerald-50 disabled:opacity-40 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-secondary"
                >
                  <SkipBack className="h-4.5 w-4.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  className="bangla-text inline-flex h-11 items-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white shadow-md hover:bg-emerald-700"
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
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-emerald-50 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-secondary"
                >
                  <SkipForward className="h-4.5 w-4.5" />
                </button>

                <button
                  type="button"
                  onClick={handleReplayStep}
                  aria-label="পুনরায় চালান"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-emerald-50 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-secondary"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center rounded-xl border border-gray-200 bg-gray-100 p-0.5 dark:border-dark-border dark:bg-dark-bg">
                  <button
                    type="button"
                    onClick={() => setMode("auto")}
                    className={`bangla-text rounded-lg px-2.5 py-1.5 text-xs font-bold ${
                      mode === "auto"
                        ? "bg-emerald-600 text-white"
                        : "text-gray-600 dark:text-dark-text-muted"
                    }`}
                  >
                    অটো
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("manual")}
                    className={`bangla-text rounded-lg px-2.5 py-1.5 text-xs font-bold ${
                      mode === "manual"
                        ? "bg-emerald-600 text-white"
                        : "text-gray-600 dark:text-dark-text-muted"
                    }`}
                  >
                    ম্যানুয়াল
                  </button>
                </div>

                <div className="flex items-center rounded-xl border border-gray-200 bg-gray-100 p-0.5 dark:border-dark-border dark:bg-dark-bg">
                  {([0.75, 1, 1.5] as PlaybackSpeed[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSpeed(s)}
                      className={`rounded-lg px-2 py-1.5 text-xs font-bold ${
                        speed === s
                          ? "bg-white text-emerald-700 shadow-2xs dark:bg-dark-card dark:text-emerald-400"
                          : "text-gray-600 dark:text-dark-text-muted"
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setMuted((m) => !m)}
                  aria-label="মিউট"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-secondary"
                >
                  {muted ? (
                    <VolumeX className="h-4 w-4 text-rose-500" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowLayerMenu((v) => !v)}
                  className="bangla-text inline-flex h-9 items-center gap-1 rounded-xl border border-gray-200 bg-white px-2.5 text-xs font-semibold text-gray-700 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-secondary"
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>স্তর</span>
                </button>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  aria-label="ফুলস্ক্রিন"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-secondary"
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-4 w-4" />
                  ) : (
                    <Maximize2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {showLayerMenu && (
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-2.5 dark:border-dark-border">
                <span className="bangla-text text-xs font-semibold text-gray-500 dark:text-dark-text-muted">
                  দোয়ার টেক্সট স্তর:
                </span>
                {(
                  [
                    { key: "arabic", label: "আরবি" },
                    { key: "uccharon", label: "বাংলা উচ্চারণ" },
                    { key: "banglish", label: "Banglish" },
                    { key: "meaning", label: "বাংলা অর্থ" },
                  ] as { key: keyof LayerVisibility; label: string }[]
                ).map((item) => {
                  const active = visibleLayers[item.key];
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() =>
                        setVisibleLayers((prev) => ({
                          ...prev,
                          [item.key]: !prev[item.key],
                        }))
                      }
                      className={`bangla-text rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        active
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-100 text-gray-600 dark:bg-dark-bg dark:text-dark-text-muted"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2: WUDU PRACTICE QUIZ MODE (Validates Order of Wudu Steps)
         ===================================================================== */}
      {activeTab === "practice" && (
        <div className="mx-auto max-w-4xl space-y-5">
          {!quizFinished && currentQuizQuestion ? (
            <div className="rounded-2xl border border-emerald-200 bg-white p-5 sm:p-6 shadow-xs dark:border-dark-border dark:bg-dark-card">
              <div className="mb-4 flex items-center justify-between">
                <span className="bangla-text rounded-xl bg-emerald-600 px-3 py-1 text-xs font-bold text-white">
                  ধারাবাহিকতা যাচাই: ধাপ {toBengaliNumber(quizIndex + 1)}/
                  {toBengaliNumber(quizQuestions.length)}
                </span>
                <span className="bangla-text text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  স্কোর: {toBengaliNumber(quizScore)}/
                  {toBengaliNumber(quizIndex + (quizAnswered ? 1 : 0))}
                </span>
              </div>

              <h2 className="bangla-text mb-4 text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                {currentQuizQuestion.promptBn}
              </h2>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {currentQuizQuestion.options.map((opt) => {
                  const isSelected = selectedQuizOption === opt.id;
                  const isCorrect =
                    opt.id === currentQuizQuestion.correctOptionId;

                  let style =
                    "border-gray-200 bg-white hover:border-emerald-400 dark:border-dark-border dark:bg-dark-bg";
                  if (quizAnswered) {
                    if (isCorrect) {
                      style =
                        "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-500/20 dark:border-emerald-500 dark:bg-emerald-950/50";
                    } else if (isSelected) {
                      style =
                        "border-rose-500 bg-rose-50 ring-2 ring-rose-500/20 dark:border-rose-500 dark:bg-rose-950/40";
                    } else {
                      style = "border-gray-200 bg-gray-50 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={quizAnswered}
                      onClick={() => handleSelectQuizOption(opt.id)}
                      className={`flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all ${style}`}
                    >
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-sky-100 bg-sky-50/40">
                        <WuduFigure
                          posture={opt.posture}
                          gender={gender}
                          hasWaterAnimation={false}
                          className="h-full w-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="bangla-text text-sm font-bold text-gray-900 dark:text-white">
                          {opt.labelBn}
                        </div>
                        <div className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted">
                          {opt.subLabelBn}
                        </div>
                      </div>
                      {quizAnswered && isCorrect && (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                      )}
                      {quizAnswered && isSelected && !isCorrect && (
                        <XCircle className="h-5 w-5 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {quizAnswered && (
                <div
                  className={`mt-5 rounded-2xl border p-4 ${
                    selectedQuizOption === currentQuizQuestion.correctOptionId
                      ? "border-emerald-300 bg-emerald-50/70 dark:border-emerald-800 dark:bg-emerald-950/40"
                      : "border-rose-300 bg-rose-50/70 dark:border-rose-800 dark:bg-rose-950/30"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {selectedQuizOption ===
                    currentQuizQuestion.correctOptionId ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-rose-600" />
                    )}
                    <span className="bangla-text text-sm font-bold text-gray-900 dark:text-white">
                      {selectedQuizOption ===
                      currentQuizQuestion.correctOptionId
                        ? "সঠিক ক্রম (তারতীব)!"
                        : "ক্রমটি সঠিক নয় — অযুর তারতীব ও বিধান:"}
                    </span>
                  </div>
                  <p className="bangla-text text-xs sm:text-sm text-gray-700 dark:text-dark-text-secondary">
                    {currentQuizQuestion.explanationBn}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <Link
                      href="/taharat/wudu"
                      className="bangla-text text-xs font-bold text-emerald-700 underline dark:text-emerald-400"
                    >
                      অযুর ৪ ফরজ ও সুন্নাত বিস্তারিত দেখুন
                    </Link>
                    <button
                      type="button"
                      onClick={handleNextQuizStep}
                      className="bangla-text rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                    >
                      পরবর্তী ধাপ →
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-xs dark:border-dark-border dark:bg-dark-card">
              <Trophy className="mx-auto mb-3 h-12 w-12 text-emerald-600" />
              <h2 className="bangla-text text-2xl font-bold text-gray-900 dark:text-white">
                অযু অনুশীলন কুইজ সম্পন্ন! স্কোর: {toBengaliNumber(quizScore)}/
                {toBengaliNumber(quizQuestions.length)}
              </h2>
              <p className="bangla-text mt-2 text-sm text-gray-600 dark:text-dark-text-secondary">
                {orderValidationResult.explanationBn}
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={startPracticeQuiz}
                  className="bangla-text rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
                >
                  আবার চেষ্টা করুন
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStepIndex(0);
                    setActiveTab("player");
                  }}
                  className="bangla-text rounded-2xl border border-emerald-200 px-5 py-2.5 text-sm font-bold text-emerald-800 dark:text-emerald-300"
                >
                  সিমুলেটরে ফিরুন
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 3: WUDU COMPLETION SCREEN
         ===================================================================== */}
      {activeTab === "completed" && (
        <div className="mx-auto max-w-2xl rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-xs dark:border-dark-border dark:bg-dark-card">
          <CheckCircle2 className="mx-auto mb-3 h-14 w-14 text-emerald-600" />
          <h2 className="bangla-text text-2xl font-bold text-gray-900 dark:text-white">
            আলহামদুলিল্লাহ! আপনি অযুর সকল ধাপ সম্পন্ন করেছেন
          </h2>
          <p className="bangla-text mt-2 text-sm text-gray-600 dark:text-dark-text-secondary">
            এখন আপনি পবিত্র অবস্থায় যেকোনো নামাজ আদায়ের জন্য প্রস্তুত।
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={startPracticeQuiz}
              className="bangla-text rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700"
            >
              অযুর ক্রম কুইজ দিন
            </button>
            <Link
              href="/simulator"
              className="bangla-text rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
            >
              নামাজ সিমুলেটরে যান →
            </Link>
          </div>
        </div>
      )}

      {/* Step Drawer */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-[110] flex justify-end bg-black/50 backdrop-blur-xs"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div
            className="flex h-full w-full max-w-md flex-col bg-white p-5 shadow-2xl dark:bg-dark-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3 dark:border-dark-border">
              <h3 className="bangla-text text-lg font-bold text-gray-900 dark:text-white">
                অযুর ধারাবাহিক ধাপসমূহ ({toBengaliNumber(totalSteps)})
              </h3>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="rounded-lg p-1 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 flex-1 space-y-2 overflow-y-auto">
              {timeline.steps.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    goToStep(idx);
                    setIsDrawerOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl border p-3 text-left ${
                    idx === safeStepIndex
                      ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60"
                      : "border-gray-200 bg-white dark:border-dark-border dark:bg-dark-bg"
                  }`}
                >
                  <div>
                    <div className="bangla-text text-sm font-bold text-gray-900 dark:text-white">
                      {toBengaliNumber(idx + 1)}. {s.titleBn}
                    </div>
                    <div className="bangla-text text-xs text-gray-500 dark:text-dark-text-muted">
                      {toBengaliNumber(s.repeat)} বার
                    </div>
                  </div>
                  <Badge variant={s.isFard ? "fard" : "sunnah"}>
                    {s.isFard ? "ফরজ" : "সুন্নাত"}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WuduSimulatorClient;
