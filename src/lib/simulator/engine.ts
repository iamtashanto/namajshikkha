import { SalahConfig, TasbihDistribution } from "@/src/types/content";
import {
  Posture,
  SalahGender,
  SimulatorOptions,
  Step,
  Timeline,
  GenderVariantFlags,
} from "./types";

/**
 * Default beginner-friendly short surahs for each rakat.
 * Rakat 1: Surah Al-Kawthar (surah-108)
 * Rakat 2: Surah Al-Ikhlas (surah-112)
 * Rakat 3: Surah Al-Falaq (surah-113)
 * Rakat 4: Surah An-Nas (surah-114)
 */
const DEFAULT_SURAH_CHOICES: Record<number, string> = {
  1: "surah-108",
  2: "surah-112",
  3: "surah-113",
  4: "surah-114",
};

export function getDefaultSurahForRakat(rakat: number): string {
  if (DEFAULT_SURAH_CHOICES[rakat]) {
    return DEFAULT_SURAH_CHOICES[rakat];
  }
  const cycle = ["surah-108", "surah-112", "surah-113", "surah-114"];
  return cycle[(rakat - 1) % cycle.length];
}

export function getGenderVariants(gender: SalahGender): GenderVariantFlags {
  if (gender === "female") {
    return {
      handRaiseHeight: "shoulders",
      handFoldPosition: "chest",
      rukuBackAngle: "slight_bow",
      sajdaPosture: "compact_elbows_tucked",
      sittingPosture: "both_feet_right_side_tawarruk",
      feetGapInStanding: "joined",
    };
  }
  return {
    handRaiseHeight: "earlobes",
    handFoldPosition: "below_navel",
    rukuBackAngle: "flat_90",
    sajdaPosture: "open_elbows_raised",
    sittingPosture: "left_foot_under_right_upright",
    feetGapInStanding: "four_fingers",
  };
}

/**
 * Pure TypeScript function that converts any SalahConfig into an ordered Timeline of steps.
 * Zero React dependencies. Follows the Hanafi school as practiced in Bangladesh.
 */
export function buildTimeline(
  config: SalahConfig,
  options: SimulatorOptions
): Timeline {
  const { gender, role, surahChoice, prayerSlug, unitLabel, includeMunajat } =
    options;
  const genderVariants = getGenderVariants(gender);
  const steps: Step[] = [];

  // ============================================================================
  // SPECIAL CASE 1: SALATUL JANAZA (Standing only, 4 Takbirs, No Ruku/Sajda)
  // ============================================================================
  if (config.isJanaza) {
    // 1. Standing & Niyyat
    steps.push({
      id: "janaza-niyyat",
      rakat: null,
      posture: Posture.STANDING,
      recitationIds: [],
      repeat: 1,
      spokenTakbir: null,
      isLoud: false,
      durationHintMs: 4000,
      titleBn: "কিবলামুখী হয়ে দাঁড়ানো ও নিয়্যত",
      instructionBn:
        "মাইয়্যিতকে সামনে রেখে কিবলামুখী হয়ে দাঁড়ান এবং ৪ তাকবীরের সাথে জানাজার নামাজের নিয়্যত করুন।",
      genderVariants,
    });

    // 2. First Takbir + Sana
    steps.push({
      id: "janaza-takbir-1",
      rakat: null,
      posture: Posture.JANAZA_TAKBIR,
      recitationIds: ["dua-sana-janaza"],
      repeat: 1,
      spokenTakbir: "আল্লাহু আকবার",
      isLoud: role === "imam",
      durationHintMs: 8000,
      titleBn: "১ম তাকবীর ও ছানা পাঠ",
      instructionBn:
        gender === "male"
          ? "'আল্লাহু আকবার' বলে কান পর্যন্ত হাত তুলে নাভির নিচে বাঁধুন এবং নীরবে জানাজার ছানা পাঠ করুন।"
          : "'আল্লাহু আকবার' বলে কাঁধ পর্যন্ত হাত তুলে বুকের ওপর বাঁধুন এবং নীরবে জানাজার ছানা পাঠ করুন।",
      genderVariants,
    });

    // 3. Second Takbir + Durood Ibrahim
    steps.push({
      id: "janaza-takbir-2",
      rakat: null,
      posture: Posture.JANAZA_TAKBIR,
      recitationIds: ["dua-3"],
      repeat: 1,
      spokenTakbir: "আল্লাহু আকবার",
      isLoud: role === "imam",
      durationHintMs: 12000,
      titleBn: "২য় তাকবীর ও দুরূদ শরীফ পাঠ",
      instructionBn:
        "হাত না উঠিয়ে (হাত বাঁধা অবস্থায়) 'আল্লাহু আকবার' বলুন এবং নীরবে দুরূদে ইব্রাহীম পাঠ করুন।",
      genderVariants,
    });

    // 4. Third Takbir + Janaza Dua
    steps.push({
      id: "janaza-takbir-3",
      rakat: null,
      posture: Posture.JANAZA_TAKBIR,
      recitationIds: ["dua-janaza"],
      repeat: 1,
      spokenTakbir: "আল্লাহু আকবার",
      isLoud: role === "imam",
      durationHintMs: 14000,
      titleBn: "৩য় তাকবীর ও মাগফিরাতের দোয়া",
      instructionBn:
        "হাত না উঠিয়ে 'আল্লাহু আকবার' বলুন এবং নীরবে মাইয়্যিতের মাগফিরাতের দোয়া পাঠ করুন।",
      genderVariants,
    });

    // 5. Fourth Takbir (Before Salam)
    steps.push({
      id: "janaza-takbir-4",
      rakat: null,
      posture: Posture.JANAZA_TAKBIR,
      recitationIds: [],
      repeat: 1,
      spokenTakbir: "আল্লাহু আকবার",
      isLoud: role === "imam",
      durationHintMs: 3000,
      titleBn: "৪র্থ তাকবীর",
      instructionBn:
        "হাত না উঠিয়ে চতুর্থ বার 'আল্লাহু আকবার' বলুন এবং এরপর উভয় হাত পাশে ছেড়ে দিয়ে সালাম ফিরান।",
      genderVariants,
    });

    // 6. Salam Right & Left
    if (config.endsWithSalam) {
      steps.push({
        id: "salam-right",
        rakat: null,
        posture: Posture.SALAM_RIGHT,
        recitationIds: ["dua-salam"],
        repeat: 1,
        spokenTakbir: "আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ",
        isLoud: role === "imam",
        durationHintMs: 3000,
        titleBn: "ডান দিকে সালাম",
        instructionBn:
          "ডান কাঁধের দিকে মুখ ফিরিয়ে 'আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ' বলুন।",
        genderVariants,
      });

      steps.push({
        id: "salam-left",
        rakat: null,
        posture: Posture.SALAM_LEFT,
        recitationIds: ["dua-salam"],
        repeat: 1,
        spokenTakbir: "আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ",
        isLoud: role === "imam",
        durationHintMs: 3000,
        titleBn: "বাম দিকে সালাম",
        instructionBn:
          "বাম কাঁধের দিকে মুখ ফিরিয়ে 'আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ' বলুন।",
        genderVariants,
      });
    }

    const estimatedDurationMs = steps.reduce(
      (sum, s) => sum + s.durationHintMs,
      0
    );

    return {
      steps,
      metadata: {
        totalRakats: 0,
        prayerSlug,
        unitLabel,
        gender,
        role,
        totalSteps: steps.length,
        totalTasbihCount: 0,
        estimatedDurationMs,
        isJanaza: true,
      },
    };
  }

  // ============================================================================
  // STANDARD & SPECIAL SALAH FLOW (2, 3, 4+ Rakats, Witr, Eid, Salatut Tasbih)
  // ============================================================================

  const getTasbihForPosition = (
    pos: TasbihDistribution["position"]
  ): TasbihDistribution | undefined =>
    config.tasbihDistribution?.find((item) => item.position === pos);

  // 0. Standing & Niyyat (Before Rakat 1)
  steps.push({
    id: "step-niyyat",
    rakat: 1,
    posture: Posture.STANDING,
    recitationIds: [],
    repeat: 1,
    spokenTakbir: null,
    isLoud: false,
    durationHintMs: 3500,
    titleBn: "কিবলামুখী হয়ে দাঁড়ানো ও নিয়্যত",
    instructionBn:
      gender === "male"
        ? "কিবলামুখী হয়ে দুই পায়ের মাঝে চার আঙুল ফাঁকা রেখে সোজা হয়ে দাঁড়ান এবং অন্তরে নামাজের নিয়্যত করুন।"
        : "কিবলামুখী হয়ে উভয় পা একসাথে মিলিয়ে সোজা হয়ে দাঁড়ান এবং অন্তরে নামাজের নিয়্যত করুন।",
    genderVariants,
  });

  // 1. Takbire Tahrima (Opening Takbir in Rakat 1)
  steps.push({
    id: "r1-takbir-tahrima",
    rakat: 1,
    posture: Posture.TAKBIR_HANDS_RAISED,
    recitationIds: ["dua-8"],
    repeat: 1,
    spokenTakbir: "আল্লাহু আকবার",
    isLoud: role === "imam",
    durationHintMs: 3000,
    titleBn: "তাকবীরে তাহরীমা",
    instructionBn:
      gender === "male"
        ? "দুই হাতের বৃদ্ধাঙ্গুলি কানের লতি পর্যন্ত উঠিয়ে 'আল্লাহু আকবার' বলুন।"
        : "দুই হাত কাঁধ বা বুক পর্যন্ত উঠিয়ে 'আল্লাহু আকবার' বলুন।",
    genderVariants,
  });

  // Loop over each rakat
  for (let r = 1; r <= config.rakats; r++) {
    const isRakatLoud = role === "imam" && config.jahr.includes(r);
    // When rising from previous rakat's sajda or sitting, the transition takbir is "আল্লাহু আকবার"
    let pendingStandingTakbir: string | null = r > 1 ? "আল্লাহু আকবার" : null;

    // 1A. Sana (Only in 1st Rakat)
    if (r === 1) {
      steps.push({
        id: "r1-sana",
        rakat: 1,
        posture: Posture.QIYAM_HANDS_FOLDED,
        recitationIds: ["dua-1"],
        repeat: 1,
        spokenTakbir: null,
        isLoud: false,
        durationHintMs: 7000,
        titleBn: "হাত বাঁধা ও ছানা পাঠ",
        instructionBn:
          gender === "male"
            ? "নাভির নিচে ডান হাত বাম হাতের কব্জির ওপর রেখে বাঁধুন এবং নীরবে ছানা পাঠ করুন।"
            : "বুকের ওপর ডান হাত বাম হাতের পিঠের ওপর রেখে বাঁধুন এবং নীরবে ছানা পাঠ করুন।",
        genderVariants,
      });
    }

    // 1B. Salatut Tasbih: after-sana (15 times before Fatiha in every rakat)
    const tasbihAfterSana = getTasbihForPosition("after-sana");
    if (tasbihAfterSana) {
      steps.push({
        id: `r${r}-tasbih-after-sana`,
        rakat: r,
        posture: Posture.QIYAM_HANDS_FOLDED,
        recitationIds: ["dua-tasbih"],
        repeat: tasbihAfterSana.count,
        tasbihCount: tasbihAfterSana.count,
        spokenTakbir: pendingStandingTakbir,
        isLoud: false,
        durationHintMs: 14000,
        titleBn: `সালাতুত তাসবীহ পাঠ (${tasbihAfterSana.count} বার)`,
        instructionBn: `${tasbihAfterSana.labelBn}: সূরা ফাতিহা শুরুর পূর্বে হাত বাঁধা অবস্থায় ১৫ বার তাসবীহ পাঠ করুন।`,
        genderVariants,
      });
      pendingStandingTakbir = null;
    }

    // 1C. Eid Extra Takbirs: after-sana (Typically 3 extra takbirs in Rakat 1)
    const extraTakbirsAfterSana =
      config.extraTakbirs?.filter(
        (et) => et.rakat === r && et.position === "after-sana"
      ) ?? [];

    for (const et of extraTakbirsAfterSana) {
      for (let t = 1; t <= et.count; t++) {
        steps.push({
          id: `r${r}-eid-takbir-after-sana-${t}-raise`,
          rakat: r,
          posture: Posture.EID_TAKBIR_HANDS_RAISED,
          recitationIds: ["dua-eid-takbir"],
          repeat: 1,
          spokenTakbir: "আল্লাহু আকবার",
          isLoud: role === "imam",
          durationHintMs: 2500,
          titleBn: `ঈদের অতিরিক্ত তাকবীর (${t}) — হাত উত্তোলন`,
          instructionBn: `'আল্লাহু আকবার' বলে দুই হাত ${gender === "male" ? "কান" : "কাঁধ"} পর্যন্ত উঠান।`,
          genderVariants,
        });

        if (t < et.count) {
          steps.push({
            id: `r${r}-eid-takbir-after-sana-${t}-down`,
            rakat: r,
            posture: Posture.EID_TAKBIR_HANDS_DOWN,
            recitationIds: [],
            repeat: 1,
            spokenTakbir: null,
            isLoud: false,
            durationHintMs: 2000,
            titleBn: `হাত ছেড়ে দেওয়া (${t})`,
            instructionBn:
              "হাত না বেঁধে শরীরের দুই পাশে ছেড়ে দিন এবং ৩ তাসবীহ পরিমাণ নীরব থাকুন।",
            genderVariants,
          });
        }
      }
    }

    // 2. Qirat in Qiyam (Fatiha + Surah OR Silent Listening for Muqtadi)
    if (role === "muqtadi") {
      steps.push({
        id: `r${r}-qiyam-muqtadi`,
        rakat: r,
        posture: Posture.QIYAM_HANDS_FOLDED,
        recitationIds: [],
        repeat: 1,
        spokenTakbir: pendingStandingTakbir,
        isLoud: false,
        durationHintMs: 15000,
        titleBn: `${r}ম রাকাত: নীরবে কিয়াম ও কেরাত শ্রবণ`,
        instructionBn:
          "হানাফি মাযহাব অনুযায়ী মুক্তাদী ইমামের পেছনে সূরা ফাতিহা বা সূরা পড়বেন না; নীরবে হাত বেঁধে দাঁড়িয়ে মনোযোগসহ ইমামের কেরাত শুনুন।",
        genderVariants,
      });
      pendingStandingTakbir = null;
    } else {
      // Alone or Imam: Recite Surah Al-Fatiha
      const fatihaRecitations =
        r === 1
          ? ["dua-taawwuz", "dua-tasmiyah", "surah-1"]
          : ["dua-tasmiyah", "surah-1"];

      steps.push({
        id: `r${r}-fatiha`,
        rakat: r,
        posture: Posture.QIYAM_HANDS_FOLDED,
        recitationIds: fatihaRecitations,
        repeat: 1,
        spokenTakbir: pendingStandingTakbir,
        isLoud: isRakatLoud,
        durationHintMs: 16000,
        titleBn: "সূরা আল-ফাতিহা তিলাওয়াত",
        instructionBn:
          r === 1
            ? "নীরবে আউযুবিল্লাহ ও বিসমিল্লাহ পড়ে সূরা আল-ফাতিহা পাঠ করুন এবং শেষে নীরবে 'আমীন' বলুন।"
            : "নীরবে বিসমিল্লাহ পড়ে সূরা আল-ফাতিহা পাঠ করুন এবং শেষে নীরবে 'আমীন' বলুন।",
        genderVariants,
      });
      pendingStandingTakbir = null;

      // Recite Additional Surah if configured in qiratRakats
      if (config.qiratRakats.includes(r)) {
        const selectedSurahId =
          surahChoice?.[r] || getDefaultSurahForRakat(r);

        steps.push({
          id: `r${r}-surah`,
          rakat: r,
          posture: Posture.QIYAM_HANDS_FOLDED,
          recitationIds: ["dua-tasmiyah", selectedSurahId],
          repeat: 1,
          spokenTakbir: null,
          isLoud: isRakatLoud,
          durationHintMs: 12000,
          titleBn: "অতিরিক্ত সূরা মিলানো (কিরাত)",
          instructionBn:
            "নীরবে বিসমিল্লাহ পড়ে পবিত্র কুরআন থেকে একটি সূরা বা অন্তত তিন আয়াত তিলাওয়াত করুন।",
          genderVariants,
        });
      }
    }

    // 2B. Salatut Tasbih: after-surah (10 times standing before ruku)
    const tasbihAfterSurah = getTasbihForPosition("after-surah");
    if (tasbihAfterSurah) {
      steps.push({
        id: `r${r}-tasbih-after-surah`,
        rakat: r,
        posture: Posture.QIYAM_HANDS_FOLDED,
        recitationIds: ["dua-tasbih"],
        repeat: tasbihAfterSurah.count,
        tasbihCount: tasbihAfterSurah.count,
        spokenTakbir: null,
        isLoud: false,
        durationHintMs: 10000,
        titleBn: `কেরাতের পর তাসবীহ পাঠ (${tasbihAfterSurah.count} বার)`,
        instructionBn: `${tasbihAfterSurah.labelBn}: রুকুতে যাওয়ার পূর্বে দাঁড়ানো অবস্থায় ১০ বার তাসবীহ পাঠ করুন।`,
        genderVariants,
      });
    }

    // 2C. Witr Qunut (Before Ruku in 3rd Rakat)
    const isQunutBeforeRuku =
      (typeof config.hasQunut === "object" &&
        config.hasQunut.enabled &&
        config.hasQunut.rakat === r &&
        config.hasQunut.position === "before-ruku") ||
      (config.hasQunut === true && r === config.rakats);

    if (isQunutBeforeRuku) {
      steps.push({
        id: `r${r}-qunut-takbir`,
        rakat: r,
        posture: Posture.QUNUT_TAKBIR_HANDS_RAISED,
        recitationIds: ["dua-8"],
        repeat: 1,
        spokenTakbir: "আল্লাহু আকবার",
        isLoud: role === "imam",
        durationHintMs: 2500,
        titleBn: "দোয়া কুনূতের তাকবীর",
        instructionBn: `'আল্লাহু আকবার' বলে দুই হাত ${gender === "male" ? "কানের লতি" : "কাঁধ"} পর্যন্ত উঠান এবং পুনরায় হাত বাঁধুন।`,
        genderVariants,
      });

      steps.push({
        id: `r${r}-dua-qunut`,
        rakat: r,
        posture: Posture.QIYAM_HANDS_FOLDED,
        recitationIds: ["dua-5"],
        repeat: 1,
        spokenTakbir: null,
        isLoud: false,
        durationHintMs: 14000,
        titleBn: "দোয়া কুনূত পাঠ",
        instructionBn: "হাত বাঁধা অবস্থায় নীরবে দোয়া কুনূত পাঠ করুন।",
        genderVariants,
      });
    }

    // 2D. Eid Extra Takbirs: before-ruku / after-qirat (Typically 3 extra takbirs in Rakat 2)
    const extraTakbirsBeforeRuku =
      config.extraTakbirs?.filter(
        (et) =>
          et.rakat === r &&
          (et.position === "before-ruku" || et.position === "after-qirat")
      ) ?? [];

    for (const et of extraTakbirsBeforeRuku) {
      for (let t = 1; t <= et.count; t++) {
        steps.push({
          id: `r${r}-eid-takbir-before-ruku-${t}-raise`,
          rakat: r,
          posture: Posture.EID_TAKBIR_HANDS_RAISED,
          recitationIds: ["dua-eid-takbir"],
          repeat: 1,
          spokenTakbir: "আল্লাহু আকবার",
          isLoud: role === "imam",
          durationHintMs: 2500,
          titleBn: `ঈদের অতিরিক্ত তাকবীর (${t}) — হাত উত্তোলন`,
          instructionBn: `'আল্লাহু আকবার' বলে দুই হাত ${gender === "male" ? "কান" : "কাঁধ"} পর্যন্ত উঠান।`,
          genderVariants,
        });

        steps.push({
          id: `r${r}-eid-takbir-before-ruku-${t}-down`,
          rakat: r,
          posture: Posture.EID_TAKBIR_HANDS_DOWN,
          recitationIds: [],
          repeat: 1,
          spokenTakbir: null,
          isLoud: false,
          durationHintMs: 2000,
          titleBn: `হাত ছেড়ে দেওয়া (${t})`,
          instructionBn: "হাত না বেঁধে শরীরের দুই পাশে ছেড়ে দিন।",
          genderVariants,
        });
      }
    }

    // 3. Ruku
    const tasbihRuku = getTasbihForPosition("ruku");
    steps.push({
      id: `r${r}-ruku`,
      rakat: r,
      posture: Posture.RUKU,
      recitationIds: tasbihRuku ? ["dua-6", "dua-tasbih"] : ["dua-6"],
      repeat: tasbihRuku ? tasbihRuku.count : 3,
      tasbihCount: tasbihRuku?.count,
      spokenTakbir: "আল্লাহু আকবার",
      isLoud: role === "imam",
      durationHintMs: tasbihRuku ? 12000 : 6000,
      titleBn: "রুকু",
      instructionBn:
        gender === "male"
          ? "'আল্লাহু আকবার' বলে রুকুতে যান। পিঠ ও মাথা এক সমান্তরালে সোজা রাখুন, হাত দিয়ে হাঁটু আঁকড়ে ধরুন এবং রুকুর তাসবীহ পাঠ করুন।"
          : "'আল্লাহু আকবার' বলে সামান্য ঝুঁকে রুকুতে যান, হাঁটুর ওপর হাত রাখুন, কনুই পাঁজরের সাথে মিলিয়ে রাখুন এবং রুকুর তাসবীহ পাঠ করুন।",
      genderVariants,
    });

    // 4. Qawma (Standing up after Ruku)
    const tasbihQawma = getTasbihForPosition("qawmah");
    const qawmaSpoken =
      role === "muqtadi"
        ? "রাব্বানা লাকাল হামদ"
        : "সামিআল্লাহু লিমান হামিদাহ";

    steps.push({
      id: `r${r}-qawma`,
      rakat: r,
      posture: Posture.QAWMA,
      recitationIds: tasbihQawma ? ["dua-qawmah", "dua-tasbih"] : ["dua-qawmah"],
      repeat: tasbihQawma ? tasbihQawma.count : 1,
      tasbihCount: tasbihQawma?.count,
      spokenTakbir: qawmaSpoken,
      isLoud: role === "imam",
      durationHintMs: tasbihQawma ? 10000 : 4000,
      titleBn: "কওমা (রুকু থেকে সোজা হয়ে দাঁড়ানো)",
      instructionBn:
        "রুকু থেকে সম্পূর্ণ সোজা হয়ে স্থিরভাবে দাঁড়ান এবং তাসমি ও তাহমীদ পাঠ করুন।",
      genderVariants,
    });

    // 5. Sajdas & Jalsa
    for (let s = 1; s <= config.sajdaCount; s++) {
      const tasbihSajda = getTasbihForPosition(
        s === 1 ? "sajda-1" : "sajda-2"
      );

      steps.push({
        id: `r${r}-sajda-${s}`,
        rakat: r,
        posture: Posture.SAJDA,
        recitationIds: tasbihSajda ? ["dua-7", "dua-tasbih"] : ["dua-7"],
        repeat: tasbihSajda ? tasbihSajda.count : 3,
        tasbihCount: tasbihSajda?.count,
        spokenTakbir: "আল্লাহু আকবার",
        isLoud: role === "imam",
        durationHintMs: tasbihSajda ? 12000 : 6500,
        titleBn: s === 1 ? "প্রথম সিজদা" : "দ্বিতীয় সিজদা",
        instructionBn:
          gender === "male"
            ? "'আল্লাহু আকবার' বলে সিজদায় যান। নাক ও কপাল মাটিতে রাখুন, কনুই জমিন ও পেট উরু থেকে আলাদা রাখুন এবং সিজদার তাসবীহ পাঠ করুন।"
            : "'আল্লাহু আকবার' বলে সিজদায় যান। উভয় হাত ও কনুই মাটির সাথে মিলিয়ে জড়সড় হয়ে সিজদা করুন এবং সিজদার তাসবীহ পাঠ করুন।",
        genderVariants,
      });

      // Jalsa between Sajda 1 and Sajda 2
      if (s < config.sajdaCount) {
        const tasbihJalsa = getTasbihForPosition("jalsah");

        steps.push({
          id: `r${r}-jalsa`,
          rakat: r,
          posture: Posture.JALSA,
          recitationIds: tasbihJalsa
            ? ["dua-jalsah", "dua-tasbih"]
            : ["dua-jalsah"],
          repeat: tasbihJalsa ? tasbihJalsa.count : 1,
          tasbihCount: tasbihJalsa?.count,
          spokenTakbir: "আল্লাহু আকবার",
          isLoud: role === "imam",
          durationHintMs: tasbihJalsa ? 10000 : 4000,
          titleBn: "জলসা (দুই সিজদার মাঝের বৈঠক)",
          instructionBn:
            "'আল্লাহু আকবার' বলে সিজদা থেকে উঠে স্থির হয়ে বসুন এবং দুই সিজদার মাঝের দোয়া পাঠ করুন।",
          genderVariants,
        });
      }
    }

    // 6. Sittings (First Sitting Qa'dah Ula OR Final Sitting Qa'dah Akhirah)
    const isFirstSitting =
      config.firstSittingAfter !== null &&
      r === config.firstSittingAfter &&
      r < config.rakats;
    const isFinalSitting = r === config.rakats;

    if (isFirstSitting) {
      steps.push({
        id: `r${r}-qada-first`,
        rakat: r,
        posture: Posture.QADA,
        recitationIds: ["dua-2"],
        repeat: 1,
        spokenTakbir: "আল্লাহু আকবার",
        isLoud: role === "imam",
        durationHintMs: 9000,
        titleBn: "প্রথম বৈঠক (কা'দায়ে উলা) ও তাশাহহুদ",
        instructionBn:
          gender === "male"
            ? "'আল্লাহু আকবার' বলে বাম পা বিছিয়ে তার ওপর বসুন, ডান পা খাড়া রাখুন এবং আত্তাহিয়্যাতু পাঠ শুরু করুন।"
            : "'আল্লাহু আকবার' বলে উভয় পা ডান দিকে বের করে বাম নিতম্বের ওপর বসুন এবং আত্তাহিয়্যাতু পাঠ শুরু করুন।",
        genderVariants,
      });

      steps.push({
        id: `r${r}-tashahhud-finger-first`,
        rakat: r,
        posture: Posture.TASHAHHUD_FINGER_RAISED,
        recitationIds: ["dua-2"],
        repeat: 1,
        spokenTakbir: null,
        isLoud: false,
        durationHintMs: 4000,
        titleBn: "শাহাদাত আঙুল উত্তোলন (প্রথম বৈঠক)",
        instructionBn:
          "'আশহাদু আল্লা ইলাহা' বলার সময় ডান হাতের শাহাদাত আঙুল তুলুন এবং 'ইল্লাল্লাহু' বলার সময় নামিয়ে নিন। এরপর দুরূদ না পড়ে পরবর্তী রাকাতের জন্য দাঁড়িয়ে যান।",
        genderVariants,
      });
    } else if (isFinalSitting) {
      steps.push({
        id: `r${r}-qada-final`,
        rakat: r,
        posture: Posture.QADA,
        recitationIds: ["dua-2"],
        repeat: 1,
        spokenTakbir: "আল্লাহু আকবার",
        isLoud: role === "imam",
        durationHintMs: 9000,
        titleBn: "শেষ বৈঠক (কা'দায়ে আখিরাহ) ও তাশাহহুদ",
        instructionBn:
          gender === "male"
            ? "'আল্লাহু আকবার' বলে শেষ বৈঠকে বসুন এবং আত্তাহিয়্যাতু পাঠ করুন।"
            : "'আল্লাহু আকবার' বলে উভয় পা ডান দিকে বের করে শেষ বৈঠকে বসুন এবং আত্তাহিয়্যাতু পাঠ করুন।",
        genderVariants,
      });

      steps.push({
        id: `r${r}-tashahhud-finger-final`,
        rakat: r,
        posture: Posture.TASHAHHUD_FINGER_RAISED,
        recitationIds: ["dua-3", "dua-4"],
        repeat: 1,
        spokenTakbir: null,
        isLoud: false,
        durationHintMs: 16000,
        titleBn: "শাহাদাত আঙুল ইশারা, দুরূদ শরীফ ও দোয়া মাসুরা",
        instructionBn:
          "শাহাদাত আঙুল দ্বারা ইশারা করার পর পূর্ণ দুরূদে ইব্রাহীম এবং দোয়া মাসুরা পাঠ করুন।",
        genderVariants,
      });
    }
  }

  // 7. Concluding Salam Pair (Right then Left)
  if (config.endsWithSalam) {
    steps.push({
      id: "salam-right",
      rakat: null,
      posture: Posture.SALAM_RIGHT,
      recitationIds: ["dua-salam"],
      repeat: 1,
      spokenTakbir: "আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ",
      isLoud: role === "imam",
      durationHintMs: 3000,
      titleBn: "ডান দিকে সালাম",
      instructionBn:
        "ডান কাঁধের দিকে মুখ ফিরিয়ে 'আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ' বলুন।",
      genderVariants,
    });

    steps.push({
      id: "salam-left",
      rakat: null,
      posture: Posture.SALAM_LEFT,
      recitationIds: ["dua-salam"],
      repeat: 1,
      spokenTakbir: "আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ",
      isLoud: role === "imam",
      durationHintMs: 3000,
      titleBn: "বাম দিকে সালাম",
      instructionBn:
        "বাম কাঁধের দিকে মুখ ফিরিয়ে 'আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ' বলুন।",
      genderVariants,
    });
  }

  // 8. Optional Munajat (After Salam)
  if (includeMunajat) {
    steps.push({
      id: "step-munajat",
      rakat: null,
      posture: Posture.MUNAJAT,
      recitationIds: ["dua-after-salah-astaghfirullah"],
      repeat: 1,
      spokenTakbir: null,
      isLoud: false,
      durationHintMs: 8000,
      titleBn: "সালাম পর ইস্তিগফার ও মুনাজাত",
      instructionBn:
        "সালাম ফিরানোর পর তিনবার আস্তাগফিরুল্লাহ ও মাসনূন জিকির পাঠ করে আল্লাহর দরবারে দোয়া করুন।",
      genderVariants,
    });
  }

  const totalTasbihCount = steps.reduce(
    (sum, step) => sum + (step.tasbihCount ?? 0),
    0
  );
  const estimatedDurationMs = steps.reduce(
    (sum, step) => sum + step.durationHintMs,
    0
  );

  return {
    steps,
    metadata: {
      totalRakats: config.rakats,
      prayerSlug,
      unitLabel,
      gender,
      role,
      totalSteps: steps.length,
      totalTasbihCount,
      estimatedDurationMs,
      isJanaza: false,
    },
  };
}

/**
 * Combines multiple RakatUnit timelines into a single continuous,
 * multi-unit prayer simulation (e.g., full 4+4+2+2+3 Isha prayer).
 */
export function buildCombinedTimeline(
  units: { label: string; config: SalahConfig }[],
  options: SimulatorOptions
): Timeline {
  if (!units.length) {
    throw new Error("Cannot build combined timeline from empty units list");
  }

  const allSteps: Step[] = [];
  let totalRakatsCombined = 0;
  let totalTasbihCountCombined = 0;
  let totalEstimatedDurationMs = 0;
  const unitLabels = units.map((u) => u.label).join(" + ");

  units.forEach((unit, uIdx) => {
    const isLastUnit = uIdx === units.length - 1;
    const unitTimeline = buildTimeline(unit.config, {
      ...options,
      unitLabel: unit.label,
      includeMunajat: isLastUnit,
    });

    unitTimeline.steps.forEach((step) => {
      allSteps.push({
        ...step,
        id: `u${uIdx + 1}_${step.id}`,
        instructionBn: `【${unit.label}】 ${step.instructionBn}`,
      });
    });

    totalRakatsCombined += unit.config.rakats;
    totalTasbihCountCombined += unitTimeline.metadata.totalTasbihCount;
    totalEstimatedDurationMs += unitTimeline.metadata.estimatedDurationMs;
  });

  return {
    steps: allSteps,
    metadata: {
      totalRakats: totalRakatsCombined,
      prayerSlug: options.prayerSlug,
      unitLabel: unitLabels,
      gender: options.gender,
      role: options.role,
      totalSteps: allSteps.length,
      totalTasbihCount: totalTasbihCountCombined,
      estimatedDurationMs: totalEstimatedDurationMs,
      isJanaza: false,
    },
  };
}

