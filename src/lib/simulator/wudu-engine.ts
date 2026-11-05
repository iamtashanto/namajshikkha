/**
 * Wudu Simulator Engine — Pure TypeScript Module (Zero React Dependency)
 * Converts a WuduConfig into an ordered WuduTimeline of steps and validates Wudu step order.
 */

import { SalahGender } from "./types";
import { toBengaliNumber } from "@/src/lib/bengali";

export enum WuduPosture {
  NIYYAT_BISMILLAH = "NIYYAT_BISMILLAH",
  WASH_HANDS = "WASH_HANDS",
  RINSE_MOUTH = "RINSE_MOUTH",
  CLEAN_NOSE = "CLEAN_NOSE",
  WASH_FACE = "WASH_FACE",
  WASH_ARMS = "WASH_ARMS",
  MASAH_HEAD_EARS = "MASAH_HEAD_EARS",
  WASH_FEET = "WASH_FEET",
  DUA_AFTER_WUDU = "DUA_AFTER_WUDU",
}

export type WuduWaterTarget =
  | "none"
  | "hands"
  | "mouth"
  | "nose"
  | "face"
  | "arms"
  | "head"
  | "feet";

export interface WuduConfig {
  includeSunnahSteps: boolean;
  isFasting: boolean;
  hasKhuffMasah: boolean;
  gender: SalahGender;
}

export interface WuduStep {
  id: string;
  stepNumber: number;
  posture: WuduPosture;
  titleBn: string;
  titleEn: string;
  instructionBn: string;
  tipsBn: string;
  isFard: boolean;
  fardNumber: number | null;
  repeat: number;
  hasWaterAnimation: boolean;
  waterTargetPart: WuduWaterTarget;
  recitationId: string | null;
  durationHintMs: number;
  rulingExplanationBn: string;
}

export interface WuduTimelineMetadata {
  totalSteps: number;
  fardCount: number;
  includeSunnahSteps: boolean;
  isFasting: boolean;
  hasKhuffMasah: boolean;
  gender: SalahGender;
  estimatedDurationMs: number;
}

export interface WuduTimeline {
  steps: WuduStep[];
  metadata: WuduTimelineMetadata;
}

export interface WuduQuizOption {
  id: string;
  labelBn: string;
  subLabelBn: string;
  posture: WuduPosture;
}

export interface WuduQuizQuestion {
  stepIndex: number;
  correctStepId: string;
  promptBn: string;
  hintBn: string;
  options: WuduQuizOption[];
  correctOptionId: string;
  explanationBn: string;
  isFard: boolean;
}

export const DEFAULT_WUDU_CONFIG: WuduConfig = {
  includeSunnahSteps: true,
  isFasting: false,
  hasKhuffMasah: false,
  gender: "male",
};

/**
 * Pure TypeScript generator converting WuduConfig into a deterministic WuduTimeline.
 */
export function buildWuduTimeline(
  partialConfig: Partial<WuduConfig> = {}
): WuduTimeline {
  const config: WuduConfig = {
    ...DEFAULT_WUDU_CONFIG,
    ...partialConfig,
  };

  const rawSteps: Omit<WuduStep, "stepNumber">[] = [];

  if (config.includeSunnahSteps) {
    // 1. Niyyat & Bismillah (Dua Before Wudu)
    rawSteps.push({
      id: "wudu-niyyat-bismillah",
      posture: WuduPosture.NIYYAT_BISMILLAH,
      titleBn: "নিয়্যত ও বিসমিল্লাহ পাঠ",
      titleEn: "Intention & Bismillah",
      instructionBn:
        "অন্তরে পবিত্রতা অর্জন ও নামাজ আদায়ের নিয়্যত করে 'বিসমিল্লাহ' বলে অযু শুরু করুন।",
      tipsBn: "উঁচু ও পবিত্র স্থানে কিবলামুখী হয়ে বসে অযু করা মুস্তাহাব।",
      isFard: false,
      fardNumber: null,
      repeat: 1,
      hasWaterAnimation: false,
      waterTargetPart: "none",
      recitationId: "dua-wudu-before",
      durationHintMs: 4000,
      rulingExplanationBn:
        "অযুর শুরুতে নিয়্যত করা ও বিসমিল্লাহ বলা সুন্নাত। ভুলে ছুটে গেলে অযু হয়ে যাবে, তবে সুন্নাতের সওয়াব কম হবে।",
    });

    // 2. Washing Hands to Wrists (3 times)
    rawSteps.push({
      id: "wudu-wash-hands",
      posture: WuduPosture.WASH_HANDS,
      titleBn: "দুই হাত কব্জি পর্যন্ত ধোয়া (৩ বার)",
      titleEn: "Wash Hands up to Wrists (3 times)",
      instructionBn:
        "উভয় হাত কব্জি পর্যন্ত ভালোভাবে ঘষে তিনবার ধৌত করুন এবং এক হাতের আঙুল অপর হাতের আঙুলের ভেতর ঢুকিয়ে খিলাল করুন।",
      tipsBn: "অন্য কোনো অঙ্গে পানি দেওয়ার পূর্বে হাত কব্জি পর্যন্ত ধুয়ে নেওয়া সুন্নাত।",
      isFard: false,
      fardNumber: null,
      repeat: 3,
      hasWaterAnimation: true,
      waterTargetPart: "hands",
      recitationId: null,
      durationHintMs: 6000,
      rulingExplanationBn:
        "অযুর শুরুতে দুই হাত কব্জি পর্যন্ত ৩ বার ধোয়া সুন্নাত।",
    });

    // 3. Rinsing Mouth & Miswak (3 times)
    rawSteps.push({
      id: "wudu-rinse-mouth",
      posture: WuduPosture.RINSE_MOUTH,
      titleBn: "মেসওয়াক ও কুলি করা (৩ বার)",
      titleEn: "Rinse Mouth & Miswak (3 times)",
      instructionBn: config.isFasting
        ? "ডান হাতে পানি নিয়ে মুখের ভেতর দিয়ে তিনবার সাধারণভাবে কুলি করুন (রোজা অবস্থায় গড়গড়া করবেন না)।"
        : "মেসওয়াক বা আঙুল দিয়ে দাঁত পরিষ্কার করে ডান হাতে পানি নিয়ে তিনবার ভালোভাবে গড়গড়াসহ কুলি করুন।",
      tipsBn: config.isFasting
        ? "রোজাদার ব্যক্তির জন্য গলার গভীরে পানি পৌঁছানো মাকরূহ।"
        : "মেসওয়াক না থাকলে শাহাদাত আঙুল দিয়ে দাঁত ঘষে নিন।",
      isFard: false,
      fardNumber: null,
      repeat: 3,
      hasWaterAnimation: true,
      waterTargetPart: "mouth",
      recitationId: null,
      durationHintMs: 6000,
      rulingExplanationBn:
        "অযুতে তিনবার কুলি করা সুন্নাতে মুয়াক্কাদাহ (ফরজ গোসলে কুলি করা ফরজ)।",
    });

    // 4. Cleaning Nose (3 times)
    rawSteps.push({
      id: "wudu-clean-nose",
      posture: WuduPosture.CLEAN_NOSE,
      titleBn: "নাকে পানি দেওয়া ও পরিষ্কার করা (৩ বার)",
      titleEn: "Sniff Water into Nose (3 times)",
      instructionBn: config.isFasting
        ? "ডান হাত দিয়ে নাকে আলতোভাবে তিনবার পানি দিন এবং বাম হাতের কনিষ্ঠা আঙুল দিয়ে নাক পরিষ্কার করুন (রোজা অবস্থায় জোরে পানি টানবেন না)।"
        : "ডান হাত দিয়ে নাকের নরম অংশ পর্যন্ত তিনবার পানি পৌঁছান এবং বাম হাত দিয়ে নাক ঝেড়ে পরিষ্কার করুন।",
      tipsBn: "ডান হাতে পানি দেওয়া এবং বাম হাত দিয়ে নাক পরিষ্কার করা সুন্নাত।",
      isFard: false,
      fardNumber: null,
      repeat: 3,
      hasWaterAnimation: true,
      waterTargetPart: "nose",
      recitationId: null,
      durationHintMs: 6000,
      rulingExplanationBn:
        "অযুতে তিনবার নাকে পানি দেওয়া সুন্নাতে মুয়াক্কাদাহ।",
    });
  }

  // 5. FARD 1: Washing the Face (3 times)
  rawSteps.push({
    id: "wudu-wash-face",
    posture: WuduPosture.WASH_FACE,
    titleBn: "সম্পূর্ণ মুখমণ্ডল ধোয়া (১ম ফরজ • ৩ বার)",
    titleEn: "Wash Entire Face (1st Fard • 3 times)",
    instructionBn:
      "কপালের চুলের গোড়া থেকে থুতনির নিচ পর্যন্ত এবং এক কানের লতি থেকে অপর কানের লতি পর্যন্ত সম্পূর্ণ মুখমণ্ডল তিনবার ধৌত করুন।",
    tipsBn:
      "চোখের কোণা ও ভ্রুর নিচে যেন শুকনো না থাকে। ঘন দাড়ি থাকলে ভেজা আঙুল দিয়ে নিচ থেকে খিলাল করুন।",
    isFard: true,
    fardNumber: 1,
    repeat: 3,
    hasWaterAnimation: true,
    waterTargetPart: "face",
    recitationId: null,
    durationHintMs: 7500,
    rulingExplanationBn:
      "মুখমণ্ডল ধোয়া অযুর ১ম ফরজ (সূরা মায়িদাহ ৫:৬)। একবার ধোয়া ফরজ এবং তিনবার ধোয়া সুন্নাত; মুখের এক চুল পরিমাণ জায়গা শুকনো থাকলে অযু হবে না।",
  });

  // 6. FARD 2: Washing Both Arms including Elbows (3 times)
  rawSteps.push({
    id: "wudu-wash-arms",
    posture: WuduPosture.WASH_ARMS,
    titleBn: "দুই হাত কনুইসহ ধোয়া (২য় ফরজ • ৩ বার)",
    titleEn: "Wash Both Arms Including Elbows (2nd Fard • 3 times)",
    instructionBn:
      "প্রথমে ডান হাত এবং পরে বাম হাত আঙুলের ডগা থেকে কনুইসহ (কনুইয়ের সামান্য ওপর পর্যন্ত) ভালোভাবে ঘষে তিনবার করে ধৌত করুন।",
    tipsBn:
      "হাতে ঘড়ি, চুড়ি বা আংটি থাকলে তা নাড়িয়ে নিচে পানি পৌঁছানো আবশ্যক।",
    isFard: true,
    fardNumber: 2,
    repeat: 3,
    hasWaterAnimation: true,
    waterTargetPart: "arms",
    recitationId: null,
    durationHintMs: 8000,
    rulingExplanationBn:
      "উভয় হাত কনুইসহ ধোয়া অযুর ২য় ফরজ (সূরা মায়িদাহ ৫:৬)। কনুই শুকনো থেকে গেলে অযু ও নামাজ কোনোটিই শুদ্ধ হবে না।",
  });

  // 7. FARD 3: Masah of Head, Ears & Neck (1 time)
  rawSteps.push({
    id: "wudu-masah-head",
    posture: WuduPosture.MASAH_HEAD_EARS,
    titleBn: "মাথা, কান ও ঘাড় মাসেহ করা (৩য় ফরজ • ১ বার)",
    titleEn: "Wipe Head, Ears & Neck (3rd Fard • 1 time)",
    instructionBn:
      "নতুন পানিতে হাত ভিজিয়ে মাথার সামনের দিক থেকে পেছনে ও পেছন থেকে সামনে এনে সম্পূর্ণ মাথা একবার মাসেহ করুন। শাহাদাত ও বৃদ্ধাঙ্গুলি দিয়ে কান এবং হাতের পিঠ দিয়ে ঘাড় মাসেহ করুন।",
    tipsBn:
      "মাথার এক-চতুর্থাংশ মাসেহ করা ফরজ এবং সম্পূর্ণ মাথা একবার মাসেহ করা সুন্নাত। গলা মাসেহ করবেন না।",
    isFard: true,
    fardNumber: 3,
    repeat: 1,
    hasWaterAnimation: true,
    waterTargetPart: "head",
    recitationId: null,
    durationHintMs: 6500,
    rulingExplanationBn:
      "মাথার অন্তত এক-চতুর্থাংশ (১/৪ ভাগ) মাসেহ করা অযুর ৩য় ফরজ এবং পূর্ণ মাথা একবার মাসেহ করা সুন্নাত।",
  });

  // 8. FARD 4: Washing Both Feet up to Ankles (3 times) OR Khuff Masah
  rawSteps.push({
    id: "wudu-wash-feet",
    posture: WuduPosture.WASH_FEET,
    titleBn: config.hasKhuffMasah
      ? "চামড়ার মোজার (খুফ) ওপর মাসেহ (৪র্থ ফরজ • ১ বার)"
      : "দুই পা টাখনুসহ ধোয়া (৪র্থ ফরজ • ৩ বার)",
    titleEn: config.hasKhuffMasah
      ? "Masah on Leather Socks (4th Fard)"
      : "Wash Both Feet Including Ankles (4th Fard • 3 times)",
    instructionBn: config.hasKhuffMasah
      ? "পবিত্র অবস্থায় পরিহিত শরয়ী মোজার ওপর ভেজা হাতের আঙুল দিয়ে পায়ের আঙুল থেকে গোড়ালির ওপর দিকে একবার মাসেহ করুন।"
      : "প্রথমে ডান পা এবং পরে বাম পা টাখনু (পায়ের গিরার উঁচু হাড়) ও গোড়ালিসহ ভালোভাবে ঘষে তিনবার ধৌত করুন এবং বাম হাতের কনিষ্ঠা আঙুল দিয়ে পায়ের আঙুল খিলাল করুন।",
    tipsBn:
      "পায়ের গোড়ালি ও তলার অংশে যেন শুকনো না থাকে সেদিকে বিশেষ সতর্ক থাকুন।",
    isFard: true,
    fardNumber: 4,
    repeat: config.hasKhuffMasah ? 1 : 3,
    hasWaterAnimation: true,
    waterTargetPart: "feet",
    recitationId: null,
    durationHintMs: 8000,
    rulingExplanationBn:
      "দুই পা টাখনুসহ ধোয়া অযুর ৪র্থ ফরজ (সূরা মায়িদাহ ৫:৬ ও সহীহ বুখারী ১৬৩)। গোড়ালি বা টাখনু শুকনো থাকলে অযু শুদ্ধ হবে না।",
  });

  if (config.includeSunnahSteps) {
    // 9. Concluding Dua (Kalima Shahadat & Allahummaj-alni)
    rawSteps.push({
      id: "wudu-dua-after",
      posture: WuduPosture.DUA_AFTER_WUDU,
      titleBn: "কালিমা শাহাদাত ও অযু সমাপ্তির দোয়া",
      titleEn: "Kalima Shahadah & Dua After Wudu",
      instructionBn:
        "অযু শেষে কিবলামুখী হয়ে কালিমা শাহাদাত ও মাসনূন দোয়া ('আল্লাহুম্মাজ আলনী মিনাত তাউওয়াবীনা...') পাঠ করুন।",
      tipsBn:
        "সহীহ মুসলিম (২৩৪) অনুযায়ী অযুর পর এই দোয়া পাঠ করলে জান্নাতের আটটি দরজা খুলে দেওয়া হয়।",
      isFard: false,
      fardNumber: null,
      repeat: 1,
      hasWaterAnimation: false,
      waterTargetPart: "none",
      recitationId: "dua-wudu-after",
      durationHintMs: 10000,
      rulingExplanationBn:
        "অযু সমাপ্তির পর কালিমা শাহাদাত ও দোয়া পাঠ করা মুস্তাহাব ও অত্যন্ত ফযিলতপূর্ণ সুন্নাত।",
    });
  }

  const steps: WuduStep[] = rawSteps.map((s, idx) => ({
    ...s,
    stepNumber: idx + 1,
  }));

  const fardCount = steps.filter((s) => s.isFard).length;
  const estimatedDurationMs = steps.reduce(
    (sum, s) => sum + s.durationHintMs,
    0
  );

  return {
    steps,
    metadata: {
      totalSteps: steps.length,
      fardCount,
      includeSunnahSteps: config.includeSunnahSteps,
      isFasting: config.isFasting,
      hasKhuffMasah: config.hasKhuffMasah,
      gender: config.gender,
      estimatedDurationMs,
    },
  };
}

/**
 * Validates whether a user-provided sequence of Wudu step IDs follows the canonical Tartib (order)
 * and includes all 4 Fard steps.
 */
export function validateWuduStepOrder(
  submittedStepIds: string[],
  partialConfig: Partial<WuduConfig> = {}
): {
  isValid: boolean;
  firstErrorIndex: number | null;
  expectedStepId: string | null;
  explanationBn: string;
} {
  const canonical = buildWuduTimeline(partialConfig).steps;
  const expectedIds = canonical.map((s) => s.id);

  for (let i = 0; i < Math.max(expectedIds.length, submittedStepIds.length); i++) {
    if (submittedStepIds[i] !== expectedIds[i]) {
      const expectedStep = canonical[i];
      return {
        isValid: false,
        firstErrorIndex: i,
        expectedStepId: expectedStep?.id ?? null,
        explanationBn: expectedStep
          ? `অযুর তারতীব (ধারাবাহিকতা) অনুযায়ী ${toBengaliNumber(
              i + 1
            )} নং ধাপে "${expectedStep.titleBn}" করতে হয়। ${
              expectedStep.rulingExplanationBn
            }`
          : "ধাপের সংখ্যা সঠিক নয়।",
      };
    }
  }

  return {
    isValid: true,
    firstErrorIndex: null,
    expectedStepId: null,
    explanationBn:
      "মাশাআল্লাহ! আপনি সুন্নাহ ও তারতীব (ধারাবাহিকতা) বজায় রেখে অযুর সকল ধাপ সঠিক ক্রমে সম্পন্ন করেছেন।",
  };
}

/**
 * Generates interactive order-validation quiz questions for every step of a WuduTimeline.
 */
export function generateWuduQuizQuestions(
  timeline: WuduTimeline
): WuduQuizQuestion[] {
  return timeline.steps.map((step, idx) => {
    const correctOption: WuduQuizOption = {
      id: step.id,
      labelBn: step.titleBn,
      subLabelBn: step.isFard
        ? `অযুর ${toBengaliNumber(step.fardNumber!)}নং ফরজ • ${toBengaliNumber(
            step.repeat
          )} বার`
        : `সুন্নাত • ${toBengaliNumber(step.repeat)} বার`,
      posture: step.posture,
    };

    const otherSteps = timeline.steps.filter((s) => s.id !== step.id);
    const distractors: WuduQuizOption[] = [];
    for (let i = 0; i < Math.min(3, otherSteps.length); i++) {
      const d = otherSteps[(idx + i * 2) % otherSteps.length];
      distractors.push({
        id: d.id,
        labelBn: d.titleBn,
        subLabelBn: d.isFard
          ? `অযুর ${toBengaliNumber(d.fardNumber!)}নং ফরজ`
          : "সুন্নাত ধাপ",
        posture: d.posture,
      });
    }

    const combined = [correctOption, ...distractors];
    const shift = idx % combined.length;
    const rotated = [...combined.slice(shift), ...combined.slice(0, shift)];

    const prevStep = idx > 0 ? timeline.steps[idx - 1] : null;

    return {
      stepIndex: idx,
      correctStepId: step.id,
      promptBn: prevStep
        ? `"${prevStep.titleBn}" এর পর অযুর পরবর্তী (${toBengaliNumber(
            idx + 1
          )} নং) ধাপ কোনটি?`
        : `সুন্নাহ অনুযায়ী অযু শুরু করার ১ম ধাপ কোনটি?`,
      hintBn: `হিন্ট: ${step.instructionBn}`,
      options: rotated,
      correctOptionId: step.id,
      explanationBn: step.rulingExplanationBn,
      isFard: step.isFard,
    };
  });
}

