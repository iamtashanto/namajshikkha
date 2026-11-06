"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Posture,
  SalahGender,
  PostureMode,
  BodyPartHighlight,
  JointPose,
  getPoseForPosture,
  interpolatePose,
  POSTURE_META,
} from "@/src/lib/simulator";

export interface PrayerFigureProps {
  posture: Posture;
  gender: SalahGender;
  postureMode?: PostureMode;
  view?: "side" | "front";
  highlightParts?: BodyPartHighlight[];
  className?: string;
  transitionDurationMs?: number;
  showQiblaIndicator?: boolean;
  showPostureBadge?: boolean;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function pointFromAngle(
  origin: { x: number; y: number },
  length: number,
  angleDeg: number
): { x: number; y: number } {
  const rad = degToRad(angleDeg);
  return {
    x: origin.x + length * Math.sin(rad),
    y: origin.y - length * Math.cos(rad),
  };
}

function ArticulatedLimb({
  p1,
  p2,
  outerWidth,
  innerWidth,
  stroke,
  fill,
}: {
  p1: { x: number; y: number };
  p2: { x: number; y: number };
  outerWidth: number;
  innerWidth: number;
  stroke: string;
  fill: string;
}) {
  return (
    <>
      <line
        x1={p1.x}
        y1={p1.y}
        x2={p2.x}
        y2={p2.y}
        stroke={stroke}
        strokeWidth={outerWidth}
        strokeLinecap="round"
      />
      <line
        x1={p1.x}
        y1={p1.y}
        x2={p2.x}
        y2={p2.y}
        stroke={fill}
        strokeWidth={innerWidth}
        strokeLinecap="round"
      />
    </>
  );
}

function HighlightCallout({
  cx,
  cy,
  r = 11,
  label,
  tx,
  ty,
  amber = false,
}: {
  cx: number;
  cy: number;
  r?: number;
  label?: string;
  tx?: number;
  ty?: number;
  amber?: boolean;
}) {
  const color = amber ? "#f59e0b" : "#10b981";
  const stroke = amber ? "#d97706" : "#059669";
  const textFill = amber ? "#b45309" : "#047857";
  return (
    <g filter="url(#highlight-glow)">
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={color}
        fillOpacity="0.28"
        stroke={stroke}
        strokeWidth="2"
      />
      {label && (
        <text
          x={tx ?? cx - 20}
          y={ty ?? cy - 15}
          fontSize="9.5"
          fontWeight="700"
          fill={textFill}
        >
          {label}
        </text>
      )}
    </g>
  );
}

export function PrayerFigure({
  posture,
  gender,
  postureMode = "standing",
  view = "side",
  highlightParts = [],
  className = "w-full max-w-md",
  transitionDurationMs = 520,
  showQiblaIndicator = true,
  showPostureBadge = false,
}: PrayerFigureProps) {
  const targetPose = getPoseForPosture(posture, gender, postureMode);
  const [pose, setPose] = useState<JointPose>(targetPose);
  const currentPoseRef = useRef<JointPose>(targetPose);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const nextTarget = getPoseForPosture(posture, gender, postureMode);
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const startPose = currentPoseRef.current;
    const startTime = performance.now();

    const animate = (now: number) => {
      if (prefersReducedMotion || transitionDurationMs <= 0) {
        currentPoseRef.current = nextTarget;
        setPose(nextTarget);
        return;
      }

      const elapsed = now - startTime;
      const rawProgress = Math.min(1, elapsed / transitionDurationMs);
      const easedProgress = easeInOutCubic(rawProgress);

      const nextInterpolated = interpolatePose(
        startPose,
        nextTarget,
        easedProgress
      );
      currentPoseRef.current = nextInterpolated;
      setPose(nextInterpolated);

      if (rawProgress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [posture, gender, transitionDurationMs]);

  const activeHighlights = new Set<BodyPartHighlight>(highlightParts);
  if (activeHighlights.has("sajda_7_parts")) {
    activeHighlights.add("forehead_nose");
    activeHighlights.add("palms");
    activeHighlights.add("knees");
    activeHighlights.add("toes");
  }

  // Forward kinematics (Side View facing Left towards Qibla)
  const hip = { x: pose.hipX, y: pose.hipY };
  const knee = pointFromAngle(hip, 52, pose.thighAngle);
  const ankle = pointFromAngle(knee, 50, pose.shinAngle);
  const toe = pose.toesBent
    ? { x: ankle.x - 16, y: 268 }
    : pointFromAngle(ankle, 22, pose.footAngle);

  const shoulder = pointFromAngle(hip, 64, pose.torsoAngle);
  const neck = pointFromAngle(shoulder, 8, pose.headAngle);
  const headCenter = pointFromAngle(shoulder, 24, pose.headAngle);
  const foreheadPoint = {
    x: headCenter.x + 15 * Math.sin(degToRad(pose.headAngle - 45)),
    y: headCenter.y - 15 * Math.cos(degToRad(pose.headAngle - 45)),
  };

  const shoulderJoint = pointFromAngle(hip, 56, pose.torsoAngle);
  const elbow = pointFromAngle(shoulderJoint, 38, pose.upperArmAngle);
  const wrist = pointFromAngle(elbow, 36, pose.forearmAngle);

  const isFemale = gender === "female";
  const garmentPrimary = isFemale ? "#047857" : "#ecfdf5";
  const garmentSecondary = isFemale ? "#065f46" : "#d1fae5";
  const garmentStroke = isFemale ? "#064e3b" : "#059669";
  const pantsFill = isFemale ? "#065f46" : "#f8fafc";
  const skinFill = "#fde68a";
  const skinStroke = "#d97706";

  return (
    <div
      className={`relative select-none overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-b from-emerald-50/40 via-white to-emerald-50/20 shadow-sm dark:border-dark-border dark:from-emerald-950/20 dark:via-dark-card dark:to-dark-card ${className}`}
    >
      <svg
        viewBox="0 0 400 320"
        className="h-auto w-full"
        role="img"
        aria-label={`${POSTURE_META[posture].labelBn} (${isFemale ? "মহিলা" : "পুরুষ"})`}
      >
        <defs>
          <filter id="highlight-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="mat-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#047857" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
        </defs>

        {/* Mihrab Arch Backdrop */}
        <path
          d="M140 270 L140 95 Q200 40 260 95 L260 270 Z"
          fill="currentColor"
          className="text-emerald-100/35 dark:text-emerald-900/15"
        />

        {/* Qibla Direction Badge */}
        {showQiblaIndicator && (
          <g id="qibla-indicator" transform="translate(22, 22)">
            <rect
              x="0"
              y="0"
              width="124"
              height="26"
              rx="13"
              fill="#ecfdf5"
              stroke="#a7f3d0"
              strokeWidth="1.2"
            />
            {view === "side" ? (
              <>
                <path
                  d="M24 13 L12 13 M12 13 L17 8 M12 13 L17 18"
                  stroke="#047857"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <text x="30" y="17" fontSize="10.5" fontWeight="700" fill="#065f46">
                  কিবলা (পশ্চিম)
                </text>
              </>
            ) : (
              <>
                <circle cx="16" cy="13" r="4" fill="#059669" />
                <text x="26" y="17" fontSize="10" fontWeight="700" fill="#065f46">
                  কিবলা অভিমুখী
                </text>
              </>
            )}
          </g>
        )}

        {/* Gender Badge */}
        <g transform="translate(278, 22)">
          <rect
            x="0"
            y="0"
            width="100"
            height="24"
            rx="12"
            fill={isFemale ? "#fdf2f8" : "#f0fdf4"}
            stroke={isFemale ? "#fbcfe8" : "#bbf7d0"}
          />
          <text
            x="50"
            y="15.5"
            textAnchor="middle"
            fontSize="10"
            fontWeight="700"
            fill={isFemale ? "#9d174d" : "#166534"}
          >
            {isFemale ? "মহিলাদের নিয়ম" : "পুরুষদের নিয়ম"}
          </text>
        </g>

        {/* Prayer Mat Underneath */}
        <g id="prayer-mat">
          <ellipse cx="200" cy="278" rx="162" ry="7" fill="#064e3b" opacity="0.12" />
          <rect
            x="48"
            y="266"
            width="304"
            height="12"
            rx="5"
            fill="url(#mat-gradient)"
            stroke="#065f46"
            strokeWidth="1.5"
          />
          <line
            x1="58"
            y1="272"
            x2="342"
            y2="272"
            stroke="#fbbf24"
            strokeWidth="1.5"
            strokeDasharray="8 4"
          />
          {view === "side" && (
            <path d="M62 272 L78 267 L88 272 L78 277 Z" fill="#fbbf24" opacity="0.9" />
          )}
          <path
            d="M48 269 L40 269 M48 272 L38 272 M48 275 L40 275 M352 269 L360 269 M352 272 L362 272 M352 275 L360 275"
            stroke="#d97706"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>

        {/* Chair for Sitting on Chair Mode */}
        {postureMode === "sittingChair" && (
          <g id="prayer-chair" opacity="0.95">
            {view === "side" ? (
              <>
                {/* Side View Chair */}
                <rect x="182" y="196" width="70" height="10" rx="3" fill="#059669" fillOpacity="0.4" stroke="#8d5b4c" strokeWidth="2" />
                {/* Backrest */}
                <line x1="248" y1="120" x2="248" y2="204" stroke="#8d5b4c" strokeWidth="5" strokeLinecap="round" />
                <line x1="248" y1="135" x2="242" y2="135" stroke="#8d5b4c" strokeWidth="4" />
                <line x1="248" y1="160" x2="242" y2="160" stroke="#8d5b4c" strokeWidth="4" />
                {/* Legs */}
                <line x1="186" y1="206" x2="186" y2="270" stroke="#8d5b4c" strokeWidth="5" strokeLinecap="round" />
                <line x1="248" y1="206" x2="248" y2="270" stroke="#8d5b4c" strokeWidth="5" strokeLinecap="round" />
                <line x1="186" y1="245" x2="248" y2="245" stroke="#8d5b4c" strokeWidth="3" />
              </>
            ) : (
              <>
                {/* Front View Chair */}
                <rect x="164" y="196" width="72" height="10" rx="3" fill="#059669" fillOpacity="0.4" stroke="#8d5b4c" strokeWidth="2" />
                <line x1="170" y1="206" x2="170" y2="270" stroke="#8d5b4c" strokeWidth="5" strokeLinecap="round" />
                <line x1="230" y1="206" x2="230" y2="270" stroke="#8d5b4c" strokeWidth="5" strokeLinecap="round" />
                <line x1="168" y1="120" x2="168" y2="200" stroke="#8d5b4c" strokeWidth="5" strokeLinecap="round" />
                <line x1="232" y1="120" x2="232" y2="200" stroke="#8d5b4c" strokeWidth="5" strokeLinecap="round" />
                <line x1="168" y1="125" x2="232" y2="125" stroke="#8d5b4c" strokeWidth="5" strokeLinecap="round" />
              </>
            )}
          </g>
        )}

        {view === "side" ? (
          <g id="figure-side-view">
            {/* Back Leg */}
            <g id="back-leg-group" opacity="0.65" transform="translate(-4, -2)">
              <line
                x1={hip.x}
                y1={hip.y}
                x2={knee.x}
                y2={knee.y}
                stroke={garmentStroke}
                strokeWidth="22"
                strokeLinecap="round"
              />
              <line
                x1={knee.x}
                y1={knee.y}
                x2={ankle.x}
                y2={ankle.y}
                stroke={garmentStroke}
                strokeWidth="18"
                strokeLinecap="round"
              />
            </g>

            {/* Thigh & Shin */}
            <g id="thigh-group">
              <ArticulatedLimb
                p1={hip}
                p2={knee}
                outerWidth={24}
                innerWidth={20}
                stroke={garmentStroke}
                fill={pantsFill}
              />
            </g>
            <g id="shin-group">
              <ArticulatedLimb
                p1={knee}
                p2={ankle}
                outerWidth={20}
                innerWidth={16}
                stroke={garmentStroke}
                fill={pantsFill}
              />
            </g>

            {/* Foot & Toes */}
            <g id="foot-group">
              {pose.toesBent ? (
                <path
                  d={`M ${ankle.x} ${ankle.y - 4} L ${ankle.x + 2} 266 L ${ankle.x - 16} 267`}
                  fill="none"
                  stroke={skinStroke}
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <line
                  x1={ankle.x + 3}
                  y1={ankle.y}
                  x2={toe.x}
                  y2={toe.y}
                  stroke={skinStroke}
                  strokeWidth="10"
                  strokeLinecap="round"
                />
              )}
            </g>

            {/* Torso */}
            <g id="torso-group">
              <ArticulatedLimb
                p1={hip}
                p2={shoulder}
                outerWidth={isFemale ? 34 : 30}
                innerWidth={isFemale ? 30 : 26}
                stroke={garmentStroke}
                fill={garmentPrimary}
              />
              <circle
                cx={(hip.x + knee.x) / 2}
                cy={(hip.y + knee.y) / 2}
                r={isFemale ? "16" : "13"}
                fill={garmentPrimary}
                stroke={garmentStroke}
                strokeWidth="2"
              />
            </g>

            {/* Head & Neck */}
            <g id="head-group">
              <line
                x1={shoulder.x}
                y1={shoulder.y}
                x2={neck.x}
                y2={neck.y}
                stroke={isFemale ? garmentPrimary : skinStroke}
                strokeWidth="11"
                strokeLinecap="round"
              />
              <circle
                cx={headCenter.x}
                cy={headCenter.y}
                r="16"
                fill={skinFill}
                stroke={skinStroke}
                strokeWidth="2"
              />
              <circle
                cx={foreheadPoint.x}
                cy={foreheadPoint.y}
                r="3.5"
                fill={skinFill}
                stroke={skinStroke}
                strokeWidth="1.5"
              />
              {isFemale ? (
                <g transform={`translate(${headCenter.x}, ${headCenter.y}) rotate(${pose.headAngle})`}>
                  <path
                    d="M -6 -17 A 17.5 17.5 0 1 1 8 15 L 18 32 L -4 26 L -4 -6 Z"
                    fill={garmentSecondary}
                    stroke={garmentStroke}
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                </g>
              ) : (
                <g transform={`translate(${headCenter.x}, ${headCenter.y}) rotate(${pose.headAngle})`}>
                  <path
                    d="M -15 -4 A 16.5 15 0 0 1 16 -2 L 15 2 L -15 0 Z"
                    fill="#ffffff"
                    stroke="#059669"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </g>
              )}

              {Math.abs(pose.headTurn) > 0.2 && (
                <g transform={`translate(${headCenter.x}, ${headCenter.y - 28})`}>
                  <rect x="-44" y="-12" width="88" height="20" rx="10" fill="#059669" />
                  <text x="0" y="2" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#ffffff">
                    {pose.headTurn > 0 ? "ডান দিকে সালাম ↻" : "↺ বাম দিকে সালাম"}
                  </text>
                </g>
              )}
            </g>

            {/* Upper Arm, Forearm & Hand */}
            <g id="upper-arm-group">
              <ArticulatedLimb
                p1={shoulderJoint}
                p2={elbow}
                outerWidth={15}
                innerWidth={11}
                stroke={garmentStroke}
                fill={garmentSecondary}
              />
            </g>
            <g id="forearm-group">
              <ArticulatedLimb
                p1={elbow}
                p2={wrist}
                outerWidth={13}
                innerWidth={9}
                stroke={garmentStroke}
                fill={garmentSecondary}
              />
            </g>
            <g id="hand-group">
              {posture === Posture.SAJDA ? (
                <path
                  d={`M ${wrist.x + 4} 266 L ${wrist.x - 14} 267`}
                  stroke={skinStroke}
                  strokeWidth="7"
                  strokeLinecap="round"
                />
              ) : (
                <circle
                  cx={wrist.x}
                  cy={wrist.y}
                  r="5.5"
                  fill={skinFill}
                  stroke={skinStroke}
                  strokeWidth="1.8"
                />
              )}
              {pose.fingerRaised && (
                <g id="shahadat-finger">
                  <line
                    x1={wrist.x}
                    y1={wrist.y}
                    x2={wrist.x - 14}
                    y2={wrist.y - 5}
                    stroke={skinStroke}
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <circle
                    cx={wrist.x - 15}
                    cy={wrist.y - 5.5}
                    r="6"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeDasharray="2 2"
                  />
                </g>
              )}
            </g>

            {/* Highlights */}
            {activeHighlights.has("forehead_nose") && (
              <HighlightCallout
                cx={foreheadPoint.x}
                cy={foreheadPoint.y}
                label="কপাল ও নাক"
                tx={foreheadPoint.x - 36}
                ty={foreheadPoint.y - 14}
              />
            )}
            {activeHighlights.has("palms") && (
              <HighlightCallout
                cx={wrist.x - 4}
                cy={wrist.y}
                label="দুই হাতের তালু"
                tx={wrist.x - 12}
                ty={wrist.y - 16}
              />
            )}
            {activeHighlights.has("knees") && (
              <HighlightCallout
                cx={knee.x}
                cy={knee.y}
                r={12}
                label="দুই হাঁটু"
                tx={knee.x - 16}
                ty={knee.y - 16}
              />
            )}
            {activeHighlights.has("toes") && (
              <HighlightCallout
                cx={ankle.x - 4}
                cy={266}
                label="পায়ের আঙুল"
                tx={ankle.x - 20}
                ty={246}
              />
            )}
            {activeHighlights.has("back") && (
              <g filter="url(#highlight-glow)">
                <line
                  x1={hip.x}
                  y1={hip.y - 16}
                  x2={headCenter.x}
                  y2={headCenter.y - 16}
                  stroke="#f59e0b"
                  strokeWidth="3"
                  strokeDasharray="5 3"
                />
                <text
                  x={(hip.x + headCenter.x) / 2}
                  y={hip.y - 24}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="700"
                  fill="#b45309"
                >
                  পিঠ ও মাথা সমান্তরাল
                </text>
              </g>
            )}
            {(activeHighlights.has("index_finger") || pose.fingerRaised) && (
              <HighlightCallout
                cx={wrist.x - 14}
                cy={wrist.y - 5}
                r={10}
                label="শাহাদাত আঙুল ইশারা"
                tx={wrist.x - 45}
                ty={wrist.y - 18}
                amber
              />
            )}
            {activeHighlights.has("hands") && (
              <HighlightCallout cx={wrist.x} cy={wrist.y} r={14} />
            )}
          </g>
        ) : (
          /* Front View Articulated Figure */
          <g id="figure-front-view" transform={`translate(0, ${pose.front.bodyDropY})`}>
            {pose.front.bodyDropY < 45 ? (
              <g id="front-legs">
                <ArticulatedLimb
                  p1={{ x: isFemale ? 194 : 186, y: 165 }}
                  p2={{ x: isFemale ? 194 : 186, y: 264 }}
                  outerWidth={20}
                  innerWidth={16}
                  stroke={garmentStroke}
                  fill={pantsFill}
                />
                <ArticulatedLimb
                  p1={{ x: isFemale ? 206 : 214, y: 165 }}
                  p2={{ x: isFemale ? 206 : 214, y: 264 }}
                  outerWidth={20}
                  innerWidth={16}
                  stroke={garmentStroke}
                  fill={pantsFill}
                />
                <ellipse cx={isFemale ? 193 : 185} cy={266} rx="9" ry="5" fill={skinFill} stroke={skinStroke} strokeWidth="1.8" />
                <ellipse cx={isFemale ? 207 : 215} cy={266} rx="9" ry="5" fill={skinFill} stroke={skinStroke} strokeWidth="1.8" />
              </g>
            ) : (
              <ellipse
                cx={isFemale ? 206 : 200}
                cy={192}
                rx={isFemale ? 38 : 34}
                ry="16"
                fill={garmentPrimary}
                stroke={garmentStroke}
                strokeWidth="2"
              />
            )}

            <rect
              x={isFemale ? 168 : 172}
              y={94}
              width={isFemale ? 64 : 56}
              height={96 * pose.front.torsoScaleY}
              rx="22"
              fill={garmentPrimary}
              stroke={garmentStroke}
              strokeWidth="2.2"
            />

            <g
              id="front-head"
              transform={`translate(${200 - pose.headTurn * 14}, ${70 + (1 - pose.front.torsoScaleY) * 35})`}
            >
              {isFemale && (
                <path
                  d="M -26 6 C -26 -24 26 -24 26 6 L 32 46 Q 0 56 -32 46 Z"
                  fill={garmentSecondary}
                  stroke={garmentStroke}
                  strokeWidth="2"
                />
              )}
              <circle cx="0" cy="0" r="17" fill={skinFill} stroke={skinStroke} strokeWidth="2" />
              {!isFemale && (
                <path
                  d="M -16 -5 A 17 14 0 0 1 16 -5 L 16 0 L -16 0 Z"
                  fill="#ffffff"
                  stroke="#059669"
                  strokeWidth="2"
                />
              )}
              {Math.abs(pose.headTurn) > 0.15 && (
                <path
                  d={pose.headTurn > 0 ? "M -4 -3 L -11 2 L -4 5" : "M 4 -3 L 11 2 L 4 5"}
                  fill="none"
                  stroke={skinStroke}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </g>

            {pose.front.handsMode === "raised_ears" && (
              <g id="front-arms-ears">
                <path d="M 172 106 L 148 92 L 164 66" fill="none" stroke={garmentStroke} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 228 106 L 252 92 L 236 66" fill="none" stroke={garmentStroke} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="166" cy="64" r="6" fill={skinFill} stroke={skinStroke} strokeWidth="1.8" />
                <circle cx="234" cy="64" r="6" fill={skinFill} stroke={skinStroke} strokeWidth="1.8" />
              </g>
            )}
            {pose.front.handsMode === "raised_shoulders" && (
              <g id="front-arms-shoulders">
                <path d="M 170 108 L 154 116 L 168 92" fill="none" stroke={garmentStroke} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 230 108 L 246 116 L 232 92" fill="none" stroke={garmentStroke} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="168" cy="90" r="6" fill={skinFill} stroke={skinStroke} strokeWidth="1.8" />
                <circle cx="232" cy="90" r="6" fill={skinFill} stroke={skinStroke} strokeWidth="1.8" />
              </g>
            )}
            {pose.front.handsMode === "folded_navel" && (
              <g id="front-arms-navel">
                <path d="M 172 106 L 162 142 L 196 154" fill="none" stroke={garmentStroke} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 228 106 L 238 142 L 204 154" fill="none" stroke={garmentStroke} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                <ellipse cx="200" cy="154" rx="11" ry="6" fill={skinFill} stroke={skinStroke} strokeWidth="1.8" />
              </g>
            )}
            {pose.front.handsMode === "folded_chest" && (
              <g id="front-arms-chest">
                <path d="M 170 108 L 162 132 L 196 124" fill="none" stroke={garmentStroke} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 230 108 L 238 132 L 204 124" fill="none" stroke={garmentStroke} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                <ellipse cx="200" cy="124" rx="11" ry="6" fill={skinFill} stroke={skinStroke} strokeWidth="1.8" />
              </g>
            )}
            {pose.front.handsMode === "sides" && (
              <g id="front-arms-sides">
                <line x1="170" y1="106" x2="164" y2="176" stroke={garmentStroke} strokeWidth="12" strokeLinecap="round" />
                <line x1="230" y1="106" x2="236" y2="176" stroke={garmentStroke} strokeWidth="12" strokeLinecap="round" />
                <circle cx="164" cy="180" r="5.5" fill={skinFill} stroke={skinStroke} strokeWidth="1.8" />
                <circle cx="236" cy="180" r="5.5" fill={skinFill} stroke={skinStroke} strokeWidth="1.8" />
              </g>
            )}
            {(pose.front.handsMode === "thighs" || pose.front.handsMode === "knees") && (
              <g id="front-arms-thighs">
                <path d="M 172 108 L 166 150 L 180 176" fill="none" stroke={garmentStroke} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 228 108 L 234 150 L 220 176" fill="none" stroke={garmentStroke} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="180" cy="178" r="6" fill={skinFill} stroke={skinStroke} strokeWidth="1.8" />
                <circle cx="220" cy="178" r="6" fill={skinFill} stroke={skinStroke} strokeWidth="1.8" />
                {pose.fingerRaised && (
                  <g>
                    <line x1="180" y1="178" x2="180" y2="164" stroke={skinStroke} strokeWidth="4" strokeLinecap="round" />
                    <circle cx="180" cy="163" r="7" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="2 2" />
                  </g>
                )}
              </g>
            )}
            {pose.front.handsMode === "ground_sajda" && (
              <g id="front-arms-sajda">
                <ellipse cx="166" cy="172" rx="8" ry="5" fill={skinFill} stroke={skinStroke} strokeWidth="1.8" />
                <ellipse cx="234" cy="172" rx="8" ry="5" fill={skinFill} stroke={skinStroke} strokeWidth="1.8" />
              </g>
            )}
            {pose.front.handsMode === "munajat" && (
              <g id="front-arms-munajat">
                <path d="M 172 110 L 166 144 L 188 128" fill="none" stroke={garmentStroke} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 228 110 L 234 144 L 212 128" fill="none" stroke={garmentStroke} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                <ellipse cx="191" cy="126" rx="7" ry="5" fill={skinFill} stroke={skinStroke} strokeWidth="1.8" />
                <ellipse cx="209" cy="126" rx="7" ry="5" fill={skinFill} stroke={skinStroke} strokeWidth="1.8" />
              </g>
            )}
          </g>
        )}

        {showPostureBadge && (
          <g transform="translate(200, 302)">
            <text x="0" y="0" textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#065f46">
              {POSTURE_META[posture].labelBn}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
