"use client";

import React, { useEffect, useRef, useState } from "react";
import { WuduPosture, WuduWaterTarget } from "@/src/lib/simulator/wudu-engine";
import { SalahGender } from "@/src/lib/simulator/types";
import { toBengaliNumber } from "@/src/lib/bengali";

export interface WuduFigureProps {
  posture: WuduPosture;
  gender?: SalahGender;
  waterTarget?: WuduWaterTarget;
  hasWaterAnimation?: boolean;
  repeatCount?: number;
  currentRepeat?: number;
  isFard?: boolean;
  fardNumber?: number | null;
  className?: string;
}

interface WuduPoseAngles {
  torsoLean: number; // 0 = upright seated, positive = leaning forward toward tap/basin
  headTilt: number; // angle of head
  leftUpperArm: number; // angle in degrees
  leftForearm: number;
  rightUpperArm: number;
  rightForearm: number;
  rightLegLift: number; // 0 = foot on floor, positive = foot lifted toward basin for washing
  targetX: number; // X of active highlight/water splash
  targetY: number; // Y of active highlight/water splash
  labelBn: string;
}

const WUDU_POSES: Record<WuduPosture, WuduPoseAngles> = {
  [WuduPosture.NIYYAT_BISMILLAH]: {
    torsoLean: 4,
    headTilt: 8,
    leftUpperArm: 35,
    leftForearm: -45,
    rightUpperArm: 38,
    rightForearm: -48,
    rightLegLift: 0,
    targetX: 215,
    targetY: 145,
    labelBn: "নিয়্যত ও বিসমিল্লাহ",
  },
  [WuduPosture.WASH_HANDS]: {
    torsoLean: 12,
    headTilt: 16,
    leftUpperArm: 52,
    leftForearm: -12,
    rightUpperArm: 55,
    rightForearm: -15,
    rightLegLift: 0,
    targetX: 252,
    targetY: 168,
    labelBn: "কব্জি পর্যন্ত হাত ধোয়া",
  },
  [WuduPosture.RINSE_MOUTH]: {
    torsoLean: 10,
    headTilt: 12,
    leftUpperArm: 42,
    leftForearm: -18,
    rightUpperArm: 72,
    rightForearm: -88,
    rightLegLift: 0,
    targetX: 192,
    targetY: 102,
    labelBn: "তিনবার কুলি করা",
  },
  [WuduPosture.CLEAN_NOSE]: {
    torsoLean: 12,
    headTilt: 14,
    leftUpperArm: 68,
    leftForearm: -82,
    rightUpperArm: 75,
    rightForearm: -92,
    rightLegLift: 0,
    targetX: 194,
    targetY: 95,
    labelBn: "নাকে পানি দেওয়া",
  },
  [WuduPosture.WASH_FACE]: {
    torsoLean: 16,
    headTilt: 20,
    leftUpperArm: 74,
    leftForearm: -90,
    rightUpperArm: 78,
    rightForearm: -94,
    rightLegLift: 0,
    targetX: 194,
    targetY: 96,
    labelBn: "মুখমণ্ডল ধোয়া (১ম ফরজ)",
  },
  [WuduPosture.WASH_ARMS]: {
    torsoLean: 10,
    headTilt: 15,
    leftUpperArm: 58,
    leftForearm: -5,
    rightUpperArm: 45,
    rightForearm: -52,
    rightLegLift: 0,
    targetX: 222,
    targetY: 156,
    labelBn: "কনুইসহ হাত ধোয়া (২য় ফরজ)",
  },
  [WuduPosture.MASAH_HEAD_EARS]: {
    torsoLean: 6,
    headTilt: 10,
    leftUpperArm: 95,
    leftForearm: -112,
    rightUpperArm: 98,
    rightForearm: -115,
    rightLegLift: 0,
    targetX: 176,
    targetY: 72,
    labelBn: "মাথা ও কান মাসেহ (৩য় ফরজ)",
  },
  [WuduPosture.WASH_FEET]: {
    torsoLean: 28,
    headTilt: 26,
    leftUpperArm: 32,
    leftForearm: 18,
    rightUpperArm: 36,
    rightForearm: 22,
    rightLegLift: 28,
    targetX: 238,
    targetY: 238,
    labelBn: "টাখনুসহ পা ধোয়া (৪র্থ ফরজ)",
  },
  [WuduPosture.DUA_AFTER_WUDU]: {
    torsoLean: 0,
    headTilt: -6,
    leftUpperArm: 42,
    leftForearm: -58,
    rightUpperArm: 62,
    rightForearm: -82,
    rightLegLift: 0,
    targetX: 215,
    targetY: 120,
    labelBn: "কালিমা শাহাদাত ও দোয়া",
  },
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function WuduFigure({
  posture,
  gender = "male",
  waterTarget = "none",
  hasWaterAnimation = false,
  repeatCount = 3,
  currentRepeat = 1,
  isFard = false,
  fardNumber = null,
  className = "",
}: WuduFigureProps) {
  const targetPose = WUDU_POSES[posture] || WUDU_POSES[WuduPosture.NIYYAT_BISMILLAH];
  const [pose, setPose] = useState<WuduPoseAngles>(targetPose);
  const currentPoseRef = useRef<WuduPoseAngles>(targetPose);

  useEffect(() => {
    const from = currentPoseRef.current;
    const to = WUDU_POSES[posture] || WUDU_POSES[WuduPosture.NIYYAT_BISMILLAH];

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let rafId: number | null = null;
    const start = performance.now();
    const duration = reducedMotion ? 1 : 480;

    const animate = (now: number) => {
      const rawT = Math.min(1, (now - start) / duration);
      const t = easeInOutCubic(rawT);
      const next: WuduPoseAngles = {
        torsoLean: lerp(from.torsoLean, to.torsoLean, t),
        headTilt: lerp(from.headTilt, to.headTilt, t),
        leftUpperArm: lerp(from.leftUpperArm, to.leftUpperArm, t),
        leftForearm: lerp(from.leftForearm, to.leftForearm, t),
        rightUpperArm: lerp(from.rightUpperArm, to.rightUpperArm, t),
        rightForearm: lerp(from.rightForearm, to.rightForearm, t),
        rightLegLift: lerp(from.rightLegLift, to.rightLegLift, t),
        targetX: lerp(from.targetX, to.targetX, t),
        targetY: lerp(from.targetY, to.targetY, t),
        labelBn: to.labelBn,
      };
      currentPoseRef.current = next;
      setPose(next);

      if (rawT < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [posture]);

  // Kinematics calculations (Seated on Wudu Stool at X=145, Y=195 facing Right towards Tap at X=295)
  const hipX = 142;
  const hipY = 195;
  const leanRad = (pose.torsoLean * Math.PI) / 180;
  const shoulderX = hipX + Math.sin(leanRad) * 68;
  const shoulderY = hipY - Math.cos(leanRad) * 68;

  const headRad = ((pose.torsoLean + pose.headTilt) * Math.PI) / 180;
  const headX = shoulderX + Math.sin(headRad) * 26;
  const headY = shoulderY - Math.cos(headRad) * 26;

  // Left arm (background arm)
  const lUpperRad = ((pose.leftUpperArm - pose.torsoLean) * Math.PI) / 180;
  const lElbowX = shoulderX + Math.sin(lUpperRad) * 36;
  const lElbowY = shoulderY + Math.cos(lUpperRad) * 36;
  const lForeRad =
    ((pose.leftUpperArm + pose.leftForearm - pose.torsoLean) * Math.PI) / 180;
  const lHandX = lElbowX + Math.sin(lForeRad) * 34;
  const lHandY = lElbowY + Math.cos(lForeRad) * 34;

  // Right arm (foreground arm)
  const rUpperRad = ((pose.rightUpperArm - pose.torsoLean) * Math.PI) / 180;
  const rElbowX = shoulderX + Math.sin(rUpperRad) * 36;
  const rElbowY = shoulderY + Math.cos(rUpperRad) * 36;
  const rForeRad =
    ((pose.rightUpperArm + pose.rightForearm - pose.torsoLean) * Math.PI) / 180;
  const rHandX = rElbowX + Math.sin(rForeRad) * 34;
  const rHandY = rElbowY + Math.cos(rForeRad) * 34;

  // Seated legs & right foot lift for WASH_FEET
  const kneeX = hipX + 44;
  const kneeY = hipY + 4;
  const rFootX = 194 + pose.rightLegLift * 1.45;
  const rFootY = 262 - pose.rightLegLift * 0.85;

  const garmentFill = gender === "female" ? "#0f766e" : "#059669";
  const garmentDark = gender === "female" ? "#115e59" : "#047857";
  const skinColor = "#f3d2b3";

  return (
    <div className={`relative select-none ${className}`}>
      <svg
        viewBox="0 0 380 300"
        role="img"
        aria-label={`অযু সিমুলেটর ফিগার: ${targetPose.labelBn}`}
        className="h-full w-full overflow-visible"
      >
        <defs>
          <linearGradient id="wuduWaterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.35" />
          </linearGradient>
          <radialGradient id="wuduTargetGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Floor & Wudu Drain Tile */}
        <rect
          x="30"
          y="266"
          width="320"
          height="10"
          rx="5"
          fill="#e2e8f0"
          opacity="0.8"
        />
        <rect
          x="220"
          y="264"
          width="95"
          height="6"
          rx="3"
          fill="#bae6fd"
        />

        {/* Wudu Stool (অযু করার আসন) */}
        <rect
          x="108"
          y="204"
          width="54"
          height="12"
          rx="4"
          fill="#065f46"
        />
        <rect x="115" y="216" width="8" height="50" rx="2" fill="#047857" />
        <rect x="147" y="216" width="8" height="50" rx="2" fill="#047857" />

        {/* Wudu Water Tap & Basin Stand on Right */}
        <path
          d="M 318 266 L 318 135 Q 318 118 300 118 L 270 118 L 270 128"
          fill="none"
          stroke="#64748b"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <circle cx="298" cy="108" r="7" fill="#0284c7" />
        <rect x="264" y="124" width="12" height="8" rx="2" fill="#475569" />

        {/* Animated Flowing Water Stream from Tap */}
        {hasWaterAnimation && (
          <g>
            {/* Primary Water Stream */}
            <path
              d="M 270 132 Q 268 195 266 264"
              stroke="url(#wuduWaterGrad)"
              strokeWidth="6"
              strokeDasharray="10 6"
              strokeLinecap="round"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="32"
                to="0"
                dur="0.55s"
                repeatCount="indefinite"
              />
            </path>

            {/* Target Part Glow & Animated Water Droplets */}
            {waterTarget !== "none" && (
              <g>
                <circle
                  cx={pose.targetX}
                  cy={pose.targetY}
                  r="30"
                  fill="url(#wuduTargetGlow)"
                />
                <circle
                  cx={pose.targetX - 10}
                  cy={pose.targetY + 6}
                  r="3.5"
                  fill="#0ea5e9"
                >
                  <animate
                    attributeName="cy"
                    values={`${pose.targetY - 6};${pose.targetY + 18}`}
                    dur="0.7s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="1;0.1"
                    dur="0.7s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle
                  cx={pose.targetX + 9}
                  cy={pose.targetY + 2}
                  r="3"
                  fill="#38bdf8"
                >
                  <animate
                    attributeName="cy"
                    values={`${pose.targetY - 4};${pose.targetY + 20}`}
                    dur="0.6s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="1;0.1"
                    dur="0.6s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle
                  cx={pose.targetX}
                  cy={pose.targetY - 8}
                  r="2.8"
                  fill="#0284c7"
                >
                  <animate
                    attributeName="cy"
                    values={`${pose.targetY - 10};${pose.targetY + 14}`}
                    dur="0.8s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            )}
          </g>
        )}

        {/* Left Leg (Background) */}
        <line
          x1={hipX}
          y1={hipY}
          x2={kneeX - 6}
          y2={kneeY}
          stroke={garmentDark}
          strokeWidth="18"
          strokeLinecap="round"
        />
        <line
          x1={kneeX - 6}
          y1={kneeY}
          x2={182}
          y2={258}
          stroke={garmentDark}
          strokeWidth="14"
          strokeLinecap="round"
        />
        <ellipse cx={188} cy={262} rx="12" ry="6" fill={skinColor} />

        {/* Left Arm (Background) */}
        <line
          x1={shoulderX}
          y1={shoulderY}
          x2={lElbowX}
          y2={lElbowY}
          stroke={garmentDark}
          strokeWidth="13"
          strokeLinecap="round"
        />
        <line
          x1={lElbowX}
          y1={lElbowY}
          x2={lHandX}
          y2={lHandY}
          stroke={skinColor}
          strokeWidth="10"
          strokeLinecap="round"
        />
        <circle cx={lHandX} cy={lHandY} r="6.5" fill={skinColor} />

        {/* Seated Torso */}
        <line
          x1={hipX}
          y1={hipY}
          x2={shoulderX}
          y2={shoulderY}
          stroke={garmentFill}
          strokeWidth="28"
          strokeLinecap="round"
        />

        {/* Right Leg (Foreground, lifts during WASH_FEET) */}
        <line
          x1={hipX}
          y1={hipY}
          x2={kneeX}
          y2={kneeY}
          stroke={garmentFill}
          strokeWidth="18"
          strokeLinecap="round"
        />
        <line
          x1={kneeX}
          y1={kneeY}
          x2={rFootX - 6}
          y2={rFootY - 2}
          stroke={
            waterTarget === "feet" ? "#0ea5e9" : garmentFill
          }
          strokeWidth="14"
          strokeLinecap="round"
        />
        <ellipse
          cx={rFootX}
          cy={rFootY}
          rx="13"
          ry="6.5"
          fill={skinColor}
          stroke={waterTarget === "feet" ? "#0284c7" : "none"}
          strokeWidth="2.5"
        />

        {/* Head (Modest featureless profile + Tupi or Hijab) */}
        <circle
          cx={headX}
          cy={headY}
          r="20"
          fill={skinColor}
          stroke={
            waterTarget === "face" ||
            waterTarget === "mouth" ||
            waterTarget === "nose"
              ? "#0284c7"
              : "none"
          }
          strokeWidth="2.5"
        />
        {gender === "male" ? (
          <path
            d={`M ${headX - 20} ${headY - 4} Q ${headX} ${headY - 28} ${
              headX + 18
            } ${headY - 4} Z`}
            fill={waterTarget === "head" ? "#0284c7" : "#ffffff"}
            stroke="#059669"
            strokeWidth="2"
          />
        ) : (
          <path
            d={`M ${headX - 22} ${headY - 6} Q ${headX} ${headY - 28} ${
              headX + 18
            } ${headY - 4} L ${headX + 12} ${headY + 26} L ${
              headX - 20
            } ${headY + 24} Z`}
            fill={waterTarget === "head" ? "#0284c7" : "#0f766e"}
          />
        )}

        {/* Right Arm (Foreground, forearm exposed for Wudu) */}
        <line
          x1={shoulderX}
          y1={shoulderY}
          x2={rElbowX}
          y2={rElbowY}
          stroke={garmentFill}
          strokeWidth="14"
          strokeLinecap="round"
        />
        <line
          x1={rElbowX}
          y1={rElbowY}
          x2={rHandX}
          y2={rHandY}
          stroke={skinColor}
          strokeWidth="11"
          strokeLinecap="round"
        />
        {waterTarget === "arms" && (
          <line
            x1={rElbowX}
            y1={rElbowY}
            x2={rHandX}
            y2={rHandY}
            stroke="#0ea5e9"
            strokeWidth="15"
            strokeOpacity="0.4"
            strokeLinecap="round"
          />
        )}
        <circle
          cx={rHandX}
          cy={rHandY}
          r="7"
          fill={skinColor}
          stroke={waterTarget === "hands" ? "#0284c7" : "none"}
          strokeWidth="2"
        />
      </svg>

      {/* Top Overlay Badges: Fard/Sunnah & Repeat Count */}
      <div className="pointer-events-none absolute inset-x-3 top-2 flex items-center justify-between gap-2">
        <span
          className={`bangla-text rounded-xl px-2.5 py-1 text-xs font-bold shadow-2xs ${
            isFard
              ? "bg-emerald-600 text-white"
              : "bg-sky-100 text-sky-900 dark:bg-sky-950/80 dark:text-sky-200"
          }`}
        >
          {isFard && fardNumber
            ? `অযুর ${toBengaliNumber(fardNumber)}নং ফরজ`
            : "অযুর সুন্নাত"}
        </span>

        <span className="bangla-text rounded-xl border border-sky-200 bg-white/95 px-2.5 py-1 text-xs font-bold text-sky-800 shadow-2xs dark:border-sky-800 dark:bg-dark-card dark:text-sky-300">
          {repeatCount > 1
            ? `${toBengaliNumber(currentRepeat)}/${toBengaliNumber(
                repeatCount
              )} বার (${toBengaliNumber(repeatCount)} বার)`
            : "১ বার"}
        </span>
      </div>
    </div>
  );
}

export default WuduFigure;

