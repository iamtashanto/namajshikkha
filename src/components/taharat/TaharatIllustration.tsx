import React from "react";
import { TaharatIllustrationKey } from "@/src/types/content";

interface TaharatIllustrationProps {
  name: TaharatIllustrationKey | string;
  className?: string;
  title?: string;
}

export function TaharatIllustration({
  name,
  className = "w-full h-40",
  title,
}: TaharatIllustrationProps) {
  const renderSvg = () => {
    switch (name) {
      case "hands-wash":
        return (
          <svg viewBox="0 0 200 140" className="h-full w-full" aria-hidden="true">
            <rect width="200" height="140" rx="16" fill="currentColor" className="text-emerald-50/60 dark:text-emerald-950/20" />
            {/* Water stream from above */}
            <path d="M100 10 V40" stroke="#059669" strokeWidth="3" strokeDasharray="4 3" strokeLinecap="round" />
            <path d="M94 15 V35" stroke="#10b981" strokeWidth="2.5" strokeDasharray="3 3" strokeLinecap="round" />
            <path d="M106 15 V35" stroke="#10b981" strokeWidth="2.5" strokeDasharray="3 3" strokeLinecap="round" />
            {/* Water Drops */}
            <circle cx="100" cy="46" r="3.5" fill="#059669" />
            <circle cx="88" cy="50" r="2.5" fill="#34d399" />
            <circle cx="112" cy="50" r="2.5" fill="#34d399" />
            {/* Left Hand Silhouette */}
            <path
              d="M72 105 C70 95 72 82 76 74 C78 70 82 66 88 68 C94 70 95 76 96 82 C98 76 102 74 105 76 C108 78 107 84 106 88 C108 85 112 84 114 86 C116 88 115 92 113 95 L110 102 C106 110 98 115 88 115 C80 115 74 112 72 105 Z"
              fill="#d1fae5"
              stroke="#059669"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Right Hand overlapping */}
            <path
              d="M128 105 C130 95 128 82 124 74 C122 70 118 66 112 68 C106 70 105 76 104 82 C102 76 98 74 95 76 C92 78 93 84 94 88 C92 85 88 84 86 86 C84 88 85 92 87 95 L90 102 C94 110 102 115 112 115 C120 115 126 112 128 105 Z"
              fill="#a7f3d0"
              stroke="#047857"
              strokeWidth="2.5"
              strokeLinejoin="round"
              opacity="0.9"
            />
            {/* Water Splash Ripples */}
            <path d="M68 95 Q80 90 92 92" stroke="#059669" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M108 92 Q120 90 132 95" stroke="#059669" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        );

      case "mouth-rinse":
        return (
          <svg viewBox="0 0 200 140" className="h-full w-full" aria-hidden="true">
            <rect width="200" height="140" rx="16" fill="currentColor" className="text-emerald-50/60 dark:text-emerald-950/20" />
            {/* Cupped Hand holding water */}
            <path
              d="M65 85 C65 65 85 58 105 58 C125 58 140 70 140 85 C140 105 115 112 100 112 C80 112 65 102 65 85 Z"
              fill="#a7f3d0"
              stroke="#059669"
              strokeWidth="2.5"
            />
            {/* Water in Palm */}
            <ellipse cx="102" cy="78" rx="26" ry="14" fill="#38bdf8" opacity="0.75" />
            <path d="M85 76 Q102 70 118 76" stroke="#0284c7" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Water Droplets and motion to mouth */}
            <circle cx="102" cy="45" r="4" fill="#0284c7" />
            <circle cx="94" cy="52" r="3" fill="#38bdf8" />
            <circle cx="110" cy="52" r="3" fill="#38bdf8" />
            {/* Rinsing swirl arrows */}
            <path d="M92 34 Q102 26 112 34 Q102 42 92 34" stroke="#059669" strokeWidth="2" fill="none" strokeDasharray="3 2" />
          </svg>
        );

      case "nose-clean":
        return (
          <svg viewBox="0 0 200 140" className="h-full w-full" aria-hidden="true">
            <rect width="200" height="140" rx="16" fill="currentColor" className="text-emerald-50/60 dark:text-emerald-950/20" />
            {/* Minimal abstract nasal bridge profile without eyes/mouth */}
            <path
              d="M95 30 L95 65 Q95 82 108 82 Q115 82 118 76"
              stroke="#059669"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Water inhaling & cleaning droplets */}
            <circle cx="102" cy="94" r="4.5" fill="#0284c7" />
            <circle cx="108" cy="105" r="3.5" fill="#38bdf8" />
            <circle cx="95" cy="102" r="3" fill="#38bdf8" />
            {/* Water intake arrow */}
            <path d="M102 118 V98" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" markerEnd="url(#arrow)" />
            <path d="M98 102 L102 96 L106 102" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        );

      case "face-wash":
        return (
          <svg viewBox="0 0 200 140" className="h-full w-full" aria-hidden="true">
            <rect width="200" height="140" rx="16" fill="currentColor" className="text-emerald-50/60 dark:text-emerald-950/20" />
            {/* Modest Oval Face Perimeter (No Eyes, No Mouth, Pure Boundary) */}
            <ellipse
              cx="100"
              cy="68"
              rx="36"
              ry="45"
              fill="#d1fae5"
              stroke="#059669"
              strokeWidth="2.5"
              strokeDasharray="6 3"
            />
            {/* Hairline boundary top */}
            <path d="M72 45 Q100 32 128 45" stroke="#047857" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Chin boundary bottom */}
            <path d="M84 105 Q100 114 116 105" stroke="#047857" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Earlobe boundaries */}
            <path d="M63 60 Q58 68 63 76" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M137 60 Q142 68 137 76" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Gentle Water Waves covering the entire face area */}
            <path d="M78 60 Q100 54 122 60" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
            <path d="M74 74 Q100 68 126 74" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
            <path d="M80 88 Q100 82 120 88" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
            <circle cx="100" cy="22" r="3" fill="#0284c7" />
            <circle cx="92" cy="18" r="2" fill="#38bdf8" />
            <circle cx="108" cy="18" r="2" fill="#38bdf8" />
          </svg>
        );

      case "arms-wash":
        return (
          <svg viewBox="0 0 200 140" className="h-full w-full" aria-hidden="true">
            <rect width="200" height="140" rx="16" fill="currentColor" className="text-emerald-50/60 dark:text-emerald-950/20" />
            {/* Forearm from Hand to Elbow */}
            <path
              d="M45 76 C55 70 85 68 125 64 C140 62 155 60 162 70 C165 76 162 84 150 88 C125 94 85 96 55 94 C48 94 42 86 45 76 Z"
              fill="#d1fae5"
              stroke="#059669"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Elbow mark */}
            <circle cx="160" cy="72" r="6" fill="#a7f3d0" stroke="#047857" strokeWidth="2" />
            <text x="160" y="52" textAnchor="middle" fontSize="10" fill="#047857" fontWeight="bold">কনুই</text>
            {/* Water Flow from Fingers to Elbow */}
            <path d="M48 62 Q95 56 150 56" stroke="#0284c7" strokeWidth="2.5" strokeDasharray="5 3" strokeLinecap="round" fill="none" />
            <path d="M55 104 Q100 102 150 96" stroke="#0284c7" strokeWidth="2.5" strokeDasharray="5 3" strokeLinecap="round" fill="none" />
            <circle cx="70" cy="56" r="3" fill="#38bdf8" />
            <circle cx="110" cy="54" r="3" fill="#38bdf8" />
            <circle cx="140" cy="55" r="3.5" fill="#0284c7" />
          </svg>
        );

      case "head-masah":
        return (
          <svg viewBox="0 0 200 140" className="h-full w-full" aria-hidden="true">
            <rect width="200" height="140" rx="16" fill="currentColor" className="text-emerald-50/60 dark:text-emerald-950/20" />
            {/* Modest abstract head contour */}
            <path
              d="M60 105 C55 75 70 42 100 42 C130 42 145 75 140 105"
              stroke="#059669"
              strokeWidth="3"
              fill="#d1fae5"
              strokeLinecap="round"
            />
            {/* Forward and Backward Motion Arrows */}
            <path d="M75 32 Q100 24 125 32" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M120 28 L126 32 L120 36" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M125 40 Q100 48 75 40" stroke="#047857" strokeWidth="2.5" strokeDasharray="4 2" strokeLinecap="round" fill="none" />
            <path d="M80 36 L74 40 L80 44" stroke="#047857" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            {/* Moist hand wipes */}
            <path d="M85 54 Q100 48 115 54" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M82 66 Q100 60 118 66" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        );

      case "ears-neck-masah":
        return (
          <svg viewBox="0 0 200 140" className="h-full w-full" aria-hidden="true">
            <rect width="200" height="140" rx="16" fill="currentColor" className="text-emerald-50/60 dark:text-emerald-950/20" />
            {/* Abstract ear profile */}
            <path
              d="M80 40 C65 40 55 55 55 75 C55 95 68 105 80 105 C90 105 95 98 95 90 C95 82 85 80 80 80"
              stroke="#059669"
              strokeWidth="3"
              fill="#d1fae5"
              strokeLinecap="round"
            />
            {/* Finger tracing ear */}
            <path d="M72 55 Q65 70 72 85" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Back of neck wipe (horizontal back hand wipe) */}
            <path d="M115 65 Q145 60 165 75" stroke="#047857" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M115 80 Q145 75 165 90" stroke="#047857" strokeWidth="3" strokeLinecap="round" fill="none" />
            <text x="145" y="52" textAnchor="middle" fontSize="10" fill="#047857" fontWeight="bold">ঘাড় মাসেহ</text>
          </svg>
        );

      case "feet-wash":
        return (
          <svg viewBox="0 0 200 140" className="h-full w-full" aria-hidden="true">
            <rect width="200" height="140" rx="16" fill="currentColor" className="text-emerald-50/60 dark:text-emerald-950/20" />
            {/* Foot outline with prominent Ankle (Taknu) */}
            <path
              d="M75 35 L75 70 Q75 80 65 90 C55 100 60 110 80 110 L135 110 C145 110 150 102 145 92 C140 85 125 80 115 72 L105 35 Z"
              fill="#d1fae5"
              stroke="#059669"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Ankle Bone Circle */}
            <circle cx="88" cy="68" r="6" fill="#a7f3d0" stroke="#047857" strokeWidth="2" />
            <text x="60" y="66" textAnchor="middle" fontSize="10" fill="#047857" fontWeight="bold">টাখনু</text>
            {/* Water Pouring over foot & ankle */}
            <path d="M98 20 V45" stroke="#0284c7" strokeWidth="3" strokeDasharray="3 3" strokeLinecap="round" />
            <circle cx="98" cy="52" r="3.5" fill="#0284c7" />
            <circle cx="112" cy="65" r="3" fill="#38bdf8" />
            <circle cx="130" cy="88" r="3" fill="#38bdf8" />
            {/* Finger khilal between toes */}
            <path d="M142 100 L152 100" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
            <path d="M142 105 L152 105" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case "ghusl-intent":
      case "ghusl-wudu":
        return (
          <svg viewBox="0 0 200 140" className="h-full w-full" aria-hidden="true">
            <rect width="200" height="140" rx="16" fill="currentColor" className="text-emerald-50/60 dark:text-emerald-950/20" />
            {/* Water Vessel (Lota/Bucket) */}
            <path
              d="M70 50 L130 50 L122 105 Q120 115 100 115 Q80 115 78 105 Z"
              fill="#a7f3d0"
              stroke="#059669"
              strokeWidth="2.5"
            />
            {/* Water level inside */}
            <ellipse cx="100" cy="50" rx="30" ry="8" fill="#38bdf8" opacity="0.8" />
            {/* Pure water droplets pouring */}
            <path d="M130 52 Q150 65 150 85" stroke="#0284c7" strokeWidth="2.5" strokeDasharray="4 2" fill="none" />
            <circle cx="150" cy="95" r="4" fill="#0284c7" />
            <circle cx="145" cy="106" r="3" fill="#38bdf8" />
            <circle cx="155" cy="115" r="2.5" fill="#38bdf8" />
          </svg>
        );

      case "ghusl-head":
      case "ghusl-body":
        return (
          <svg viewBox="0 0 200 140" className="h-full w-full" aria-hidden="true">
            <rect width="200" height="140" rx="16" fill="currentColor" className="text-emerald-50/60 dark:text-emerald-950/20" />
            {/* Water shower streams from top */}
            <circle cx="100" cy="25" r="14" fill="#a7f3d0" stroke="#059669" strokeWidth="2" />
            <path d="M85 45 L70 120" stroke="#0284c7" strokeWidth="2.5" strokeDasharray="6 4" strokeLinecap="round" />
            <path d="M95 45 L88 125" stroke="#0284c7" strokeWidth="2.5" strokeDasharray="5 3" strokeLinecap="round" />
            <path d="M100 45 L100 128" stroke="#0284c7" strokeWidth="3" strokeDasharray="6 3" strokeLinecap="round" />
            <path d="M105 45 L112 125" stroke="#0284c7" strokeWidth="2.5" strokeDasharray="5 3" strokeLinecap="round" />
            <path d="M115 45 L130 120" stroke="#0284c7" strokeWidth="2.5" strokeDasharray="6 4" strokeLinecap="round" />
            {/* Splashes at bottom */}
            <ellipse cx="100" cy="125" rx="45" ry="8" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.5" />
          </svg>
        );

      case "tayammum-strike-1":
      case "tayammum-strike-2":
        return (
          <svg viewBox="0 0 200 140" className="h-full w-full" aria-hidden="true">
            <rect width="200" height="140" rx="16" fill="currentColor" className="text-amber-50/60 dark:text-amber-950/20" />
            {/* Pure Earth / Stone Ground */}
            <path d="M30 105 Q100 98 170 105 L170 125 L30 125 Z" fill="#fde68a" stroke="#d97706" strokeWidth="2" />
            {/* Dust particles */}
            <circle cx="55" cy="98" r="2" fill="#b45309" />
            <circle cx="85" cy="95" r="1.5" fill="#b45309" />
            <circle cx="120" cy="96" r="2" fill="#b45309" />
            <circle cx="150" cy="98" r="1.5" fill="#b45309" />
            {/* Two open hands pressing down */}
            <g transform="translate(60, 45)">
              <path
                d="M10 40 C5 30 5 15 15 10 C20 8 26 12 28 20 C30 12 36 10 40 12 C44 14 44 22 43 28 C46 22 52 20 56 24 C59 27 57 35 52 42 L48 50 C40 54 20 54 10 40 Z"
                fill="#fef3c7"
                stroke="#d97706"
                strokeWidth="2"
              />
            </g>
            {/* Downward strike arrows */}
            <path d="M90 32 V46" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M86 42 L90 47 L94 42" stroke="#b45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M110 32 V46" stroke="#b45309" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M106 42 L110 47 L114 42" stroke="#b45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        );

      case "tayammum-face":
        return (
          <svg viewBox="0 0 200 140" className="h-full w-full" aria-hidden="true">
            <rect width="200" height="140" rx="16" fill="currentColor" className="text-amber-50/60 dark:text-amber-950/20" />
            {/* Modest Face Outline (No features) */}
            <ellipse cx="100" cy="70" rx="36" ry="44" fill="#fef3c7" stroke="#d97706" strokeWidth="2.5" />
            {/* Dust wipe paths across face */}
            <path d="M74 52 Q100 46 126 52" stroke="#b45309" strokeWidth="2.5" strokeDasharray="4 2" strokeLinecap="round" fill="none" />
            <path d="M70 70 Q100 64 130 70" stroke="#b45309" strokeWidth="2.5" strokeDasharray="4 2" strokeLinecap="round" fill="none" />
            <path d="M76 88 Q100 82 124 88" stroke="#b45309" strokeWidth="2.5" strokeDasharray="4 2" strokeLinecap="round" fill="none" />
          </svg>
        );

      case "tayammum-arms":
        return (
          <svg viewBox="0 0 200 140" className="h-full w-full" aria-hidden="true">
            <rect width="200" height="140" rx="16" fill="currentColor" className="text-amber-50/60 dark:text-amber-950/20" />
            {/* Forearm outline */}
            <path
              d="M45 76 C55 70 85 68 125 64 C140 62 155 60 162 70 C165 76 162 84 150 88 C125 94 85 96 55 94 C48 94 42 86 45 76 Z"
              fill="#fef3c7"
              stroke="#d97706"
              strokeWidth="2.5"
            />
            {/* Wiping hand stroke from fingertips to elbow */}
            <path d="M50 56 Q100 50 155 54" stroke="#b45309" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M148 50 L156 54 L148 58" stroke="#b45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <text x="160" y="42" textAnchor="middle" fontSize="10" fill="#b45309" fontWeight="bold">কনুই পর্যন্ত</text>
          </svg>
        );

      case "masah-khuff":
        return (
          <svg viewBox="0 0 200 140" className="h-full w-full" aria-hidden="true">
            <rect width="200" height="140" rx="16" fill="currentColor" className="text-emerald-50/60 dark:text-emerald-950/20" />
            {/* Leather Sock / Boot Covering Ankle */}
            <path
              d="M75 30 L75 65 Q75 75 65 85 C55 95 60 108 80 108 L140 108 C155 108 158 98 150 88 C140 76 122 72 110 65 L102 30 Z"
              fill="#854d0e"
              stroke="#713f12"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* High ankle collar */}
            <ellipse cx="88" cy="30" rx="14" ry="5" fill="#a16207" stroke="#713f12" strokeWidth="2" />
            {/* 3 Wet Finger Strokes on TOP of the foot */}
            <path d="M145 92 Q130 84 116 76" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M140 96 Q126 88 112 80" stroke="#0284c7" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M135 100 Q122 92 108 84" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
            <text x="135" y="66" textAnchor="middle" fontSize="10" fill="#0284c7" fontWeight="bold">৩ আঙুলে মাসেহ</text>
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 200 140" className="h-full w-full" aria-hidden="true">
            <rect width="200" height="140" rx="16" fill="currentColor" className="text-emerald-50/60 dark:text-emerald-950/20" />
            <circle cx="100" cy="70" r="30" fill="#a7f3d0" stroke="#059669" strokeWidth="2" />
            <path d="M90 70 L97 77 L112 62" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-emerald-100 bg-white/50 p-2 shadow-inner transition-transform dark:border-dark-border dark:bg-dark-card/50 flex items-center justify-center ${className}`}
      title={title || name}
    >
      {renderSvg()}
    </div>
  );
}

