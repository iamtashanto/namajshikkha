import { SalahConfig, PrayerType } from "@/src/types/content";
import { Posture, Step, Timeline } from "./types";
import { POSTURE_META } from "./poses";
import { resolveStepRecitations } from "./recitations";
import { toBengaliNumber } from "@/src/lib/bengali";

export type QuizQuestionType =
  | "next-posture"
  | "next-recitation"
  | "repeat-count"
  | "surah-required";

export type FiqhMistakeSeverity =
  | "invalidates_salah"
  | "requires_sajda_sahu"
  | "sunnah_loss";

export interface QuizOption {
  id: string;
  labelBn: string;
  subLabelBn?: string;
  /** Included when question type is 'next-posture' so UI renders a mini pose thumbnail */
  posture?: Posture;
}

export interface QuizQuestion {
  stepIndex: number;
  stepId: string;
  rakat: number | null;
  type: QuizQuestionType;
  promptBn: string;
  hintBn: string;
  options: QuizOption[];
  correctOptionId: string;
  explanationBn: string;
  fiqhImpactBn: string;
  severity: FiqhMistakeSeverity;
  rulingSlug: string;
  rulingTitleBn: string;
  categoryLabelBn: string;
}

const DISTRACTOR_POSTURES: Posture[] = [
  Posture.TAKBIR_HANDS_RAISED,
  Posture.QIYAM_HANDS_FOLDED,
  Posture.RUKU,
  Posture.QAWMA,
  Posture.SAJDA,
  Posture.JALSA,
  Posture.QADA,
  Posture.TASHAHHUD_FINGER_RAISED,
  Posture.SALAM_RIGHT,
  Posture.QUNUT_TAKBIR_HANDS_RAISED,
];

const DISTRACTOR_RECITATIONS: {
  id: string;
  labelBn: string;
  subLabelBn: string;
}[] = [
  {
    id: "dua-1",
    labelBn: "সানা (সুবহানাকাল্লাহুম্মা...)",
    subLabelBn: "ছানা ও আল্লাহর প্রশংসা",
  },
  {
    id: "surah-1",
    labelBn: "সূরা আল-ফাতিহা (আলহামদু লিল্লাহি...)",
    subLabelBn: "পূর্ণ ৭ আয়াত তিলাওয়াত",
  },
  {
    id: "dua-6",
    labelBn: "রুকুর তাসবীহ (সুবহানা রাব্বিয়াল আযীম)",
    subLabelBn: "রুকু অবস্থায় পাঠ",
  },
  {
    id: "dua-qawmah",
    labelBn: "তাসমি ও তাহমীদ (সামিআল্লাহু লিমান হামিদাহ...)",
    subLabelBn: "রুকু থেকে সোজা হয়ে দাঁড়িয়ে পাঠ",
  },
  {
    id: "dua-7",
    labelBn: "সিজদার তাসবীহ (সুবহানা রাব্বিয়াল আ'লা)",
    subLabelBn: "সিজদা অবস্থায় পাঠ",
  },
  {
    id: "dua-jalsah",
    labelBn: "রাব্বিগফির লী (দুই সিজদার মাঝের দোয়া)",
    subLabelBn: "জলসায় বসে পাঠ",
  },
  {
    id: "dua-2",
    labelBn: "আত্তাহিয়্যাতু (তাশাহহুদ)",
    subLabelBn: "বৈঠকে তাশাহহুদ পাঠ",
  },
  {
    id: "dua-3",
    labelBn: "দুরূদে ইব্রাহীম ও দোয়া মাসুরা",
    subLabelBn: "শেষ বৈঠকে দুরূদ ও দোয়া",
  },
  {
    id: "dua-5",
    labelBn: "দোয়া কুনূত (আল্লাহুম্মা ইন্না নাস্তাঈনুকা...)",
    subLabelBn: "বিতর নামাজের ৩য় রাকাতে পাঠ",
  },
  {
    id: "dua-salam",
    labelBn: "আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ",
    subLabelBn: "ডানে ও বামে সালাম ফিরানো",
  },
];

/**
 * Determines the Hanafi fiqh impact (Fard / Wajib / Sunnah) and canonical Masail link for a step.
 */
export function getStepFiqhRuleInfo(
  step: Step,
  config: SalahConfig
): {
  severity: FiqhMistakeSeverity;
  explanationBn: string;
  fiqhImpactBn: string;
  rulingSlug: string;
  rulingTitleBn: string;
  categoryLabelBn: string;
} {
  // 1. Fard (Arkan) steps — omitting invalidates Salah
  if (
    step.id === "r1-takbir-tahrima" ||
    step.id === "janaza-takbir-1" ||
    step.posture === Posture.JANAZA_TAKBIR
  ) {
    return {
      severity: "invalidates_salah",
      explanationBn: config.isJanaza
        ? "জানাজার নামাজের ৪টি তাকবীরই ফরজ (রুকন); কোনো একটি তাকবীর বাদ পড়লে জানাজা শুদ্ধ হবে না।"
        : "তাকবীরে তাহরীমা ('আল্লাহু আকবার' বলে নামাজ শুরু করা) নামাজের অন্যতম ফরজ রুকন।",
      fiqhImpactBn:
        "হুকুম: এটি ফরজ। এটি বাদ পড়লে নামাজ শুরু বা শুদ্ধই হবে না; পুনরায় নামাজ আদায় করতে হবে।",
      rulingSlug: "conditions-and-arkan",
      rulingTitleBn: "নামাজের শর্ত ও আরকান (১৩ ফরজ)",
      categoryLabelBn: "তাকবীরে তাহরীমা ও ফরজ রুকন",
    };
  }

  if (step.posture === Posture.RUKU) {
    return {
      severity: "invalidates_salah",
      explanationBn:
        "প্রতি রাকাতে একবার রুকু করা ফরজ (রুকন) এবং রুকুতে অন্তত তিনবার 'সুবহানা রাব্বিয়াল আযীম' বলা সুন্নাত।",
      fiqhImpactBn:
        "হুকুম: রুকু করা ফরজ—রুকু বাদ পড়লে নামাজ বাতিল হয়ে যাবে (সিজদায়ে সাহু দিয়েও হবে না, পুনরায় পড়তে হবে)।",
      rulingSlug: "conditions-and-arkan",
      rulingTitleBn: "নামাজের শর্ত ও আরকান (১৩ ফরজ)",
      categoryLabelBn: "রুকু ও তা'দিলে আরকান",
    };
  }

  if (step.posture === Posture.SAJDA) {
    return {
      severity: "invalidates_salah",
      explanationBn:
        "প্রতি রাকাতে দুইবার সিজদা করা ফরজ (রুকন) এবং সিজদায় অন্তত তিনবার 'সুবহানা রাব্বিয়াল আ'লা' বলা সুন্নাত।",
      fiqhImpactBn:
        "হুকুম: প্রতি রাকাতে দুটি সিজদা করা ফরজ—একটি সিজদাও বাদ পড়লে নামাজ বাতিল হয়ে যাবে।",
      rulingSlug: "conditions-and-arkan",
      rulingTitleBn: "নামাজের শর্ত ও আরকান (১৩ ফরজ)",
      categoryLabelBn: "সিজদা ও ফরজ আরকান",
    };
  }

  if (step.id.includes("qada-final")) {
    return {
      severity: "invalidates_salah",
      explanationBn:
        "নামাজের শেষ রাকাতে তাশাহহুদ (আত্তাহিয়্যাতু) পড়ার পরিমাণ সময় শেষ বৈঠকে বসা ফরজ এবং তাশাহহুদ পাঠ করা ওয়াজিব।",
      fiqhImpactBn:
        "হুকুম: শেষ বৈঠক ফরজ (রুকন)—শেষ বৈঠক না করে সালাম ফিরালে নামাজ বাতিল হয়ে যাবে।",
      rulingSlug: "conditions-and-arkan",
      rulingTitleBn: "নামাজের শর্ত ও আরকান (১৩ ফরজ)",
      categoryLabelBn: "শেষ বৈঠক ও তাশাহহুদ",
    };
  }

  // 2. Wajib steps — omitting by mistake requires Sajda Sahu
  if (
    step.id.endsWith("-fatiha") ||
    step.id.endsWith("-surah") ||
    step.id.includes("qiyam-muqtadi")
  ) {
    return {
      severity: "requires_sajda_sahu",
      explanationBn: step.id.includes("qiyam-muqtadi")
        ? "হানাফি মাযহাব অনুযায়ী মুক্তাদি ইমামের পেছনে সূরা ফাতিহা বা সূরা পড়বেন না; নীরবে ইমামের কিরাত শ্রবণ করবেন।"
        : "হানাফি মাযহাবে সূরা ফাতিহা পাঠ করা এবং নির্ধারিত রাকাতে কুরআন থেকে সূরা মিলানো ওয়াজিব।",
      fiqhImpactBn:
        "হুকুম: এটি ওয়াজিব। ভুলবশত সূরা ফাতিহা বা সূরা মিলানো ছুটে গেলে নামাজের শেষে সিজদায়ে সাহু দেওয়া ওয়াজিব।",
      rulingSlug: "sajda-sahu",
      rulingTitleBn: "সিজদায়ে সাহুর সম্পূর্ণ নিয়ম ও মাসায়েল",
      categoryLabelBn: "কিরাত ও সূরা মিলানোর বিধান",
    };
  }

  if (step.posture === Posture.QAWMA || step.posture === Posture.JALSA) {
    return {
      severity: "requires_sajda_sahu",
      explanationBn:
        step.posture === Posture.QAWMA
          ? "রুকু থেকে সম্পূর্ণ সোজা হয়ে স্থিরভাবে দাঁড়ানো (কওমা) ওয়াজিব।"
          : "দুই সিজদার মাঝখানে সোজা হয়ে স্থিরভাবে বসা (জলসা) ওয়াজিব।",
      fiqhImpactBn:
        "হুকুম: কওমা ও জলসায় ধীরস্থিরতা (তা'দিলে আরকান) ওয়াজিব। ভুলবশত তড়িঘড়ি করে ছেড়ে দিলে সিজদায়ে সাহু ওয়াজিব হবে।",
      rulingSlug: "wajibat-of-salah",
      rulingTitleBn: "নামাজের ওয়াজিবসমূহ (১৪টি ওয়াজিব)",
      categoryLabelBn: "কওমা ও জলসা (তা'দিলে আরকান)",
    };
  }

  if (
    step.id.includes("qada-first") ||
    step.id.includes("tashahhud-finger-first")
  ) {
    return {
      severity: "requires_sajda_sahu",
      explanationBn:
        "৩ বা ৪ রাকাতবিশিষ্ট নামাজে ২য় রাকাতের পর প্রথম বৈঠকে বসা ও তাশাহহুদ পাঠ করা ওয়াজিব (দুরূদ না পড়ে ৩য় রাকাতে দাঁড়াতে হয়)।",
      fiqhImpactBn:
        "হুকুম: প্রথম বৈঠক ওয়াজিব। ভুলবশত প্রথম বৈঠক না করে দাঁড়িয়ে গেলে বা প্রথম বৈঠকে দুরূদ পড়ে ফেললে সিজদায়ে সাহু দেওয়া ওয়াজিব।",
      rulingSlug: "sajda-sahu",
      rulingTitleBn: "সিজদায়ে সাহুর সম্পূর্ণ নিয়ম ও মাসায়েল",
      categoryLabelBn: "প্রথম বৈঠক (কা'দায়ে উলা)",
    };
  }

  if (
    step.posture === Posture.QUNUT_TAKBIR_HANDS_RAISED ||
    step.id.includes("dua-qunut")
  ) {
    return {
      severity: "requires_sajda_sahu",
      explanationBn:
        "বিতর নামাজের ৩য় রাকাতে সূরা মিলানোর পর রুকুর পূর্বে তাকবীর বলে দোয়া কুনূত পাঠ করা ওয়াজিব।",
      fiqhImpactBn:
        "হুকুম: বিতরে দোয়া কুনূত পাঠ করা ওয়াজিব। ভুলবশত কুনূত না পড়ে রুকুতে চলে গেলে শেষ বৈঠকে সিজদায়ে সাহু দেওয়া ওয়াজিব।",
      rulingSlug: "sajda-sahu",
      rulingTitleBn: "সিজদায়ে সাহুর সম্পূর্ণ নিয়ম ও মাসায়েল",
      categoryLabelBn: "বিতর নামাজ ও দোয়া কুনূত",
    };
  }

  if (
    step.posture === Posture.EID_TAKBIR_HANDS_RAISED ||
    step.posture === Posture.EID_TAKBIR_HANDS_DOWN
  ) {
    return {
      severity: "requires_sajda_sahu",
      explanationBn:
        "হানাফি ফিকহ অনুযায়ী দুই ঈদের নামাজে ৬টি অতিরিক্ত তাকবীর (১ম রাকাতে ৩টি, ২য় রাকাতে ৩টি) বলা ওয়াজিব।",
      fiqhImpactBn:
        "হুকুম: ঈদের অতিরিক্ত তাকবীর ওয়াজিব। একাকী বা ইমামের ভুলবশত ছুটে গেলে সিজদায়ে সাহু ওয়াজিব হয়।",
      rulingSlug: "wajibat-of-salah",
      rulingTitleBn: "নামাজের ওয়াজিবসমূহ (১৪টি ওয়াজিব)",
      categoryLabelBn: "ঈদের অতিরিক্ত তাকবীর",
    };
  }

  if (
    step.posture === Posture.SALAM_RIGHT ||
    step.posture === Posture.SALAM_LEFT
  ) {
    return {
      severity: "requires_sajda_sahu",
      explanationBn:
        "নামাজ শেষ করার জন্য প্রথমে ডান দিকে এবং পরে বাম দিকে 'আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ' বলে সালাম ফিরানো ওয়াজিব।",
      fiqhImpactBn:
        "হুকুম: উভয় দিকে সালাম ফিরানোর মাধ্যমে নামাজ সম্পন্ন করা ওয়াজিব।",
      rulingSlug: "wajibat-of-salah",
      rulingTitleBn: "নামাজের ওয়াজিবসমূহ (১৪টি ওয়াজিব)",
      categoryLabelBn: "সালাম ও নামাজ সমাপ্তি",
    };
  }

  // 3. Sunnah / Mustahab steps (Sana, Durood & Dua Masura in final sitting, Niyyat, Salatut Tasbih counts)
  if (step.id.includes("tashahhud-finger-final")) {
    return {
      severity: "sunnah_loss",
      explanationBn:
        "শেষ বৈঠকে তাশাহহুদের পর দুরূদে ইব্রাহীম ও দোয়া মাসুরা পাঠ করা সুন্নাতে মুয়াক্কাদাহ।",
      fiqhImpactBn:
        "হুকুম: দুরূদ ও দোয়া মাসুরা পড়া সুন্নাত। তাশাহহুদ পড়ার পর এগুলো ভুলবশত ছুটে গেলে নামাজ হয়ে যাবে এবং সিজদায়ে সাহু লাগবে না, তবে সওয়াব কমে যাবে।",
      rulingSlug: "sunnahs-of-salah",
      rulingTitleBn: "নামাজের সুন্নাতসমূহ",
      categoryLabelBn: "শেষ বৈঠকের দুরূদ ও দোয়া মাসুরা",
    };
  }

  return {
    severity: "sunnah_loss",
    explanationBn:
      "তাকবীরে তাহরীমার পর ১ম রাকাতে নীরবে ছানা পাঠ করা এবং সুন্নাহ পদ্ধতিতে হাত বাঁধা সুন্নাত।",
    fiqhImpactBn:
      "হুকুম: এটি সুন্নাত। ভুলবশত ছানা ছুটে গেলে নামাজ শুদ্ধ হয়ে যাবে এবং সিজদায়ে সাহু ওয়াজিব হবে না।",
    rulingSlug: "sunnahs-of-salah",
    rulingTitleBn: "নামাজের সুন্নাতসমূহ",
    categoryLabelBn: "ছানা ও নামাজের সুন্নাত",
  };
}

/**
 * Generates a rotating sequence of quiz questions for every step of a Timeline.
 * Rotates between:
 *  - "এখন কী করবেন?" (next-posture, with pose thumbnails)
 *  - "এখন কী পড়বেন?" (next-recitation)
 *  - "কতবার পড়বেন?" (repeat-count)
 *  - "এই রাকাতে কি সূরা মেলাতে হবে?" (surah-required)
 */
export function generatePracticeQuestions(
  timeline: Timeline,
  config: SalahConfig,
  prayer?: PrayerType
): QuizQuestion[] {
  const questions: QuizQuestion[] = [];

  timeline.steps.forEach((step, idx) => {
    const ruleInfo = getStepFiqhRuleInfo(step, config);
    const resolvedRecs = resolveStepRecitations(step, prayer);

    // Choose the best question type for this step so all 4 types rotate naturally
    let qType: QuizQuestionType = "next-posture";

    if (
      step.id.endsWith("-fatiha") &&
      step.rakat !== null &&
      !config.isJanaza
    ) {
      // On Fatiha step, ask "এই রাকাতে কি সূরা মেলাতে হবে?"
      qType = "surah-required";
    } else if (step.repeat > 1 && idx % 2 === 1) {
      // On Ruku/Sajda/Tasbih steps, alternate between repeat-count and posture/recitation
      qType = "repeat-count";
    } else if (
      resolvedRecs.length > 0 &&
      step.id !== "step-niyyat" &&
      step.id !== "janaza-niyyat" &&
      idx % 3 === 1
    ) {
      qType = "next-recitation";
    } else if (step.repeat > 1 && idx % 4 === 2) {
      qType = "repeat-count";
    } else if (
      resolvedRecs.length > 0 &&
      step.id !== "step-niyyat" &&
      idx % 2 === 0 &&
      idx > 0
    ) {
      qType = "next-recitation";
    } else {
      qType = "next-posture";
    }

    // 1. Build "surah-required" ("এই রাকাতে কি সূরা মেলাতে হবে?")
    if (qType === "surah-required" && step.rakat !== null) {
      const r = step.rakat;
      const isMuqtadi = timeline.metadata.role === "muqtadi";
      const needsSurah = !isMuqtadi && config.qiratRakats.includes(r);

      const options: QuizOption[] = [
        {
          id: "yes",
          labelBn: "হ্যাঁ, সূরা ফাতিহার পর অন্য একটি সূরা মেলাতে হবে",
          subLabelBn: "কমপক্ষে ৩টি ছোট আয়াত বা ১টি বড় আয়াত",
        },
        {
          id: "no",
          labelBn: isMuqtadi
            ? "না, মুক্তাদি নীরবে ইমামের কিরাত শুনবেন"
            : "না, এই রাকাতে শুধু সূরা ফাতিহা পড়তে হবে (অন্য সূরা মেলাতে হবে না)",
          subLabelBn: isMuqtadi
            ? "হানাফি ফিকহে মুক্তাদির বিধান"
            : "ফরজ নামাজের ৩য় ও ৪র্থ রাকাতের বিধান",
        },
      ];

      questions.push({
        stepIndex: idx,
        stepId: step.id,
        rakat: r,
        type: "surah-required",
        promptBn: `${toBengaliNumber(
          r
        )}ম রাকাতে কি সূরা ফাতিহার পর অন্য সূরা মেলাতে হবে?`,
        hintBn: needsSurah
          ? `হিন্ট: এই রাকাতে (${toBengaliNumber(
              r
            )}ম রাকাত) সূরা ফাতিহার পর একটি সূরা বা তিন আয়াত মিলানো ওয়াজিব।`
          : `হিন্ট: ফরজ নামাজের ৩য় ও ৪র্থ রাকাতে শুধু সূরা ফাতিহা পড়তে হয়, অতিরিক্ত সূরা মেলাতে হয় না।`,
        options,
        correctOptionId: needsSurah ? "yes" : "no",
        explanationBn: needsSurah
          ? `${toBengaliNumber(
              r
            )}ম রাকাতে সূরা ফাতিহার পর অন্য একটি সূরা বা অন্তত তিন আয়াত মিলানো ওয়াজিব।`
          : `ফরজ নামাজের ৩য় ও ৪র্থ রাকাতে শুধুমাত্র সূরা আল-ফাতিহা পাঠ করা সুন্নাত; অন্য সূরা মেলাতে হয় না।`,
        fiqhImpactBn: ruleInfo.fiqhImpactBn,
        severity: ruleInfo.severity,
        rulingSlug: ruleInfo.rulingSlug,
        rulingTitleBn: ruleInfo.rulingTitleBn,
        categoryLabelBn: ruleInfo.categoryLabelBn,
      });
      return;
    }

    // 2. Build "repeat-count" ("কতবার পড়বেন?")
    if (qType === "repeat-count") {
      const correctCount = step.repeat;
      const candidateCounts = Array.from(
        new Set([correctCount, 1, 3, 5, 10, 15])
      ).slice(0, 4);
      if (!candidateCounts.includes(correctCount)) {
        candidateCounts[0] = correctCount;
      }
      candidateCounts.sort((a, b) => a - b);

      const options: QuizOption[] = candidateCounts.map((cnt) => ({
        id: `count-${cnt}`,
        labelBn: `${toBengaliNumber(cnt)} বার`,
        subLabelBn:
          cnt === 3
            ? "সুন্নাত সংখ্যা (ন্যূনতম ৩ বার)"
            : cnt === 1
            ? "১ বার পাঠ"
            : `সালাতুত তাসবীহ সংখ্যা (${toBengaliNumber(cnt)} বার)`,
      }));

      questions.push({
        stepIndex: idx,
        stepId: step.id,
        rakat: step.rakat,
        type: "repeat-count",
        promptBn: `কতবার পড়বেন? (${step.titleBn})`,
        hintBn: `হিন্ট: এই অবস্থানে দোয়া বা তাসবীহটি ${toBengaliNumber(
          correctCount
        )} বার পাঠ করতে হয়।`,
        options,
        correctOptionId: `count-${correctCount}`,
        explanationBn: `${step.titleBn} অবস্থানে তাসবীহটি কমপক্ষে ${toBengaliNumber(
          correctCount
        )} বার পাঠ করা সুন্নাত।`,
        fiqhImpactBn: ruleInfo.fiqhImpactBn,
        severity: ruleInfo.severity,
        rulingSlug: ruleInfo.rulingSlug,
        rulingTitleBn: ruleInfo.rulingTitleBn,
        categoryLabelBn: ruleInfo.categoryLabelBn,
      });
      return;
    }

    // 3. Build "next-recitation" ("এখন কী পড়বেন?")
    if (qType === "next-recitation" && resolvedRecs.length > 0) {
      const primaryRec = resolvedRecs[resolvedRecs.length - 1];
      const correctOption: QuizOption = {
        id: primaryRec.id,
        labelBn: primaryRec.titleBn,
        subLabelBn: primaryRec.uccharonBn.slice(0, 58) + "...",
      };

      const distractors = DISTRACTOR_RECITATIONS.filter(
        (d) =>
          d.id !== primaryRec.id &&
          !resolvedRecs.some((r) => r.id === d.id)
      ).slice(0, 3);

      // Deterministic rotation of options based on step index
      const combined: QuizOption[] = [correctOption, ...distractors];
      const shift = idx % combined.length;
      const rotated = [
        ...combined.slice(shift),
        ...combined.slice(0, shift),
      ];

      questions.push({
        stepIndex: idx,
        stepId: step.id,
        rakat: step.rakat,
        type: "next-recitation",
        promptBn: `এখন কী পড়বেন? (${step.titleBn})`,
        hintBn: `হিন্ট: এখন "${primaryRec.titleBn}" পাঠ করার পালা।`,
        options: rotated,
        correctOptionId: primaryRec.id,
        explanationBn: ruleInfo.explanationBn,
        fiqhImpactBn: ruleInfo.fiqhImpactBn,
        severity: ruleInfo.severity,
        rulingSlug: ruleInfo.rulingSlug,
        rulingTitleBn: ruleInfo.rulingTitleBn,
        categoryLabelBn: ruleInfo.categoryLabelBn,
      });
      return;
    }

    // 4. Default: "next-posture" ("এখন কী করবেন?" with 3–4 pose thumbnails)
    const correctPosture = step.posture;
    const correctMeta = POSTURE_META[correctPosture];

    const correctOption: QuizOption = {
      id: `posture-${correctPosture}-${step.id}`,
      labelBn: step.titleBn,
      subLabelBn: correctMeta.labelBn,
      posture: correctPosture,
    };

    const otherPostures = DISTRACTOR_POSTURES.filter(
      (p) => p !== correctPosture
    );
    const pickedDistractors: QuizOption[] = [];
    for (let i = 0; i < 3; i++) {
      const p = otherPostures[(idx + i * 2) % otherPostures.length];
      pickedDistractors.push({
        id: `posture-dist-${p}-${i}`,
        labelBn: POSTURE_META[p].labelBn,
        subLabelBn: POSTURE_META[p].labelEn,
        posture: p,
      });
    }

    const allOptions = [correctOption, ...pickedDistractors];
    const shift = idx % allOptions.length;
    const rotated = [
      ...allOptions.slice(shift),
      ...allOptions.slice(0, shift),
    ];

    questions.push({
      stepIndex: idx,
      stepId: step.id,
      rakat: step.rakat,
      type: "next-posture",
      promptBn: `এখন কী করবেন? (${
        step.rakat ? `${toBengaliNumber(step.rakat)}ম রাকাত • ` : ""
      }ধাপ ${toBengaliNumber(idx + 1)})`,
      hintBn: `হিন্ট: ${step.instructionBn}`,
      options: rotated,
      correctOptionId: correctOption.id,
      explanationBn: ruleInfo.explanationBn,
      fiqhImpactBn: ruleInfo.fiqhImpactBn,
      severity: ruleInfo.severity,
      rulingSlug: ruleInfo.rulingSlug,
      rulingTitleBn: ruleInfo.rulingTitleBn,
      categoryLabelBn: ruleInfo.categoryLabelBn,
    });
  });

  return questions;
}

