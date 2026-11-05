import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  buildTimeline,
  Posture,
  Timeline,
  MALE_POSES,
  FEMALE_POSES,
  interpolatePose,
  generatePracticeQuestions,
  buildWuduTimeline,
  validateWuduStepOrder,
  generateWuduQuizQuestions,
  WuduPosture,
} from "@/src/lib/simulator";
import {
  resolveStepRecitations,
  collectTimelineAudioUrls,
} from "@/src/lib/simulator/recitations";
import {
  prayers,
  getPrayerBySlug,
  prayerDuas,
  prayerSurahs,
  salahRulings,
} from "@/src/data";

/**
 * Helper to verify universal structural invariants of any non-Janaza Timeline
 */
function assertStandardTimelineInvariants(
  timeline: Timeline,
  expectedRakats: number
) {
  expect(timeline.metadata.totalRakats).toBe(expectedRakats);
  expect(timeline.metadata.isJanaza).toBe(false);
  expect(timeline.steps.length).toBeGreaterThan(0);

  // 1. Number of Rukus === rakats
  const rukus = timeline.steps.filter((s) => s.posture === Posture.RUKU);
  expect(rukus).toHaveLength(expectedRakats);

  // 2. Number of Sajdas === rakats * 2
  const sajdas = timeline.steps.filter((s) => s.posture === Posture.SAJDA);
  expect(sajdas).toHaveLength(expectedRakats * 2);

  // 3. Number of Jalsas (between sajdas) === rakats
  const jalsas = timeline.steps.filter((s) => s.posture === Posture.JALSA);
  expect(jalsas).toHaveLength(expectedRakats);

  // 4. Number of Qawmas === rakats
  const qawmas = timeline.steps.filter((s) => s.posture === Posture.QAWMA);
  expect(qawmas).toHaveLength(expectedRakats);

  // 5. Exactly one Salam pair at the end
  const salamRight = timeline.steps.filter(
    (s) => s.posture === Posture.SALAM_RIGHT
  );
  const salamLeft = timeline.steps.filter(
    (s) => s.posture === Posture.SALAM_LEFT
  );
  expect(salamRight).toHaveLength(1);
  expect(salamLeft).toHaveLength(1);

  const lastTwo = timeline.steps.slice(-2);
  expect(lastTwo[0].posture).toBe(Posture.SALAM_RIGHT);
  expect(lastTwo[1].posture).toBe(Posture.SALAM_LEFT);
}

describe("Namaj Simulator Engine (Pure TypeScript)", () => {
  it("1. generates valid timeline for Fajr Fard (2 rakat, jahri)", () => {
    const fajr = getPrayerBySlug("fajr")!;
    const fardUnit = fajr.rakatUnits.find((u) => u.status === "fard")!;

    const timeline = buildTimeline(fardUnit.config, {
      gender: "male",
      role: "alone",
      prayerSlug: "fajr",
    });

    assertStandardTimelineInvariants(timeline, 2);

    // Sana only in Rakat 1
    const sanaSteps = timeline.steps.filter((s) =>
      s.recitationIds.includes("dua-1")
    );
    expect(sanaSteps).toHaveLength(1);
    expect(sanaSteps[0].rakat).toBe(1);

    // Ta'awwuz only in Rakat 1, Tasmiyah in both Rakat 1 & 2
    const taawwuzSteps = timeline.steps.filter((s) =>
      s.recitationIds.includes("dua-taawwuz")
    );
    expect(taawwuzSteps).toHaveLength(1);
    expect(taawwuzSteps[0].rakat).toBe(1);

    // Both rakats have Fatiha and an additional Surah
    const fatihaSteps = timeline.steps.filter((s) =>
      s.recitationIds.includes("surah-1")
    );
    expect(fatihaSteps).toHaveLength(2);

    // Only one Qada (final sitting at rakat 2)
    const qadas = timeline.steps.filter((s) => s.posture === Posture.QADA);
    expect(qadas).toHaveLength(1);
    expect(qadas[0].rakat).toBe(2);
  });

  it("2. generates valid timeline for Maghrib Fard (3 rakat, first sitting after 2, surah only in 1 & 2)", () => {
    const maghrib = getPrayerBySlug("maghrib")!;
    const fardUnit = maghrib.rakatUnits.find((u) => u.status === "fard")!;

    const timeline = buildTimeline(fardUnit.config, {
      gender: "male",
      role: "alone",
      prayerSlug: "maghrib",
    });

    assertStandardTimelineInvariants(timeline, 3);

    // Two sittings: First sitting at rakat 2, Final sitting at rakat 3
    const qadas = timeline.steps.filter((s) => s.posture === Posture.QADA);
    expect(qadas).toHaveLength(2);
    expect(qadas[0].rakat).toBe(2);
    expect(qadas[1].rakat).toBe(3);

    // First sitting has Tashahhud only (dua-2), Final sitting has Tashahhud + Durood (dua-3) + Dua Masura (dua-4)
    const firstFinger = timeline.steps.find(
      (s) =>
        s.posture === Posture.TASHAHHUD_FINGER_RAISED && s.rakat === 2
    )!;
    expect(firstFinger.recitationIds).toEqual(["dua-2"]);

    const finalFinger = timeline.steps.find(
      (s) =>
        s.posture === Posture.TASHAHHUD_FINGER_RAISED && s.rakat === 3
    )!;
    expect(finalFinger.recitationIds).toEqual(["dua-3", "dua-4"]);

    // Extra surah only in Rakat 1 & 2, NOT in Rakat 3
    const surahSteps = timeline.steps.filter((s) => s.id.endsWith("-surah"));
    expect(surahSteps).toHaveLength(2);
    expect(surahSteps.map((s) => s.rakat)).toEqual([1, 2]);
  });

  it("3. generates valid timeline for Zuhr Fard (4 rakat, silent, surah only in 1 & 2)", () => {
    const dhuhr = getPrayerBySlug("dhuhr")!;
    const fardUnit = dhuhr.rakatUnits.find((u) => u.status === "fard")!;

    const timeline = buildTimeline(fardUnit.config, {
      gender: "male",
      role: "imam",
      prayerSlug: "dhuhr",
    });

    assertStandardTimelineInvariants(timeline, 4);

    // Sittings at rakat 2 and rakat 4
    const qadas = timeline.steps.filter((s) => s.posture === Posture.QADA);
    expect(qadas).toHaveLength(2);
    expect(qadas[0].rakat).toBe(2);
    expect(qadas[1].rakat).toBe(4);

    // Fatiha in all 4 rakats, additional surah only in rakats 1 & 2
    const fatihaSteps = timeline.steps.filter((s) =>
      s.recitationIds.includes("surah-1")
    );
    expect(fatihaSteps).toHaveLength(4);
    // Zuhr is sirri (silent), so even in imam mode Fatiha is not loud
    expect(fatihaSteps.every((s) => s.isLoud === false)).toBe(true);

    const surahSteps = timeline.steps.filter((s) => s.id.endsWith("-surah"));
    expect(surahSteps).toHaveLength(2);
    expect(surahSteps.map((s) => s.rakat)).toEqual([1, 2]);
  });

  it("4. generates valid timeline for Witr (3 rakat with Qunut in 3rd rakat before ruku)", () => {
    const witr = getPrayerBySlug("witr")!;
    const witrUnit = witr.rakatUnits[0];

    const timeline = buildTimeline(witrUnit.config, {
      gender: "male",
      role: "alone",
      prayerSlug: "witr",
    });

    assertStandardTimelineInvariants(timeline, 3);

    // Surah after Fatiha in all 3 rakats of Witr
    const surahSteps = timeline.steps.filter((s) => s.id.endsWith("-surah"));
    expect(surahSteps).toHaveLength(3);

    // Qunut Takbir and Dua Qunut in 3rd rakat before Ruku
    const qunutTakbirIdx = timeline.steps.findIndex(
      (s) => s.posture === Posture.QUNUT_TAKBIR_HANDS_RAISED
    );
    const duaQunutIdx = timeline.steps.findIndex((s) =>
      s.recitationIds.includes("dua-5")
    );
    const r3RukuIdx = timeline.steps.findIndex(
      (s) => s.posture === Posture.RUKU && s.rakat === 3
    );

    expect(qunutTakbirIdx).toBeGreaterThan(-1);
    expect(duaQunutIdx).toBe(qunutTakbirIdx + 1);
    expect(r3RukuIdx).toBeGreaterThan(duaQunutIdx);
    expect(timeline.steps[qunutTakbirIdx].rakat).toBe(3);
  });

  it("5. generates valid timeline for Eid (2 rakat with 6 extra takbirs in Hanafi positions)", () => {
    const eid = getPrayerBySlug("eid-ul-fitr")!;
    const eidUnit = eid.rakatUnits[0];

    const timeline = buildTimeline(eidUnit.config, {
      gender: "male",
      role: "imam",
      prayerSlug: "eid-ul-fitr",
    });

    assertStandardTimelineInvariants(timeline, 2);

    // Total 6 extra Eid takbirs (3 in Rakat 1 after Sana, 3 in Rakat 2 before Ruku)
    const eidTakbirsRaised = timeline.steps.filter(
      (s) => s.posture === Posture.EID_TAKBIR_HANDS_RAISED
    );
    expect(eidTakbirsRaised).toHaveLength(6);

    const r1ExtraTakbirs = eidTakbirsRaised.filter((s) => s.rakat === 1);
    const r2ExtraTakbirs = eidTakbirsRaised.filter((s) => s.rakat === 2);
    expect(r1ExtraTakbirs).toHaveLength(3);
    expect(r2ExtraTakbirs).toHaveLength(3);

    // Verify Rakat 1 extra takbirs are AFTER Sana and BEFORE Fatiha
    const sanaIdx = timeline.steps.findIndex((s) => s.id === "r1-sana");
    const firstEidTakbirR1Idx = timeline.steps.findIndex(
      (s) => s.posture === Posture.EID_TAKBIR_HANDS_RAISED && s.rakat === 1
    );
    const r1FatihaIdx = timeline.steps.findIndex((s) => s.id === "r1-fatiha");
    expect(firstEidTakbirR1Idx).toBeGreaterThan(sanaIdx);
    expect(r1FatihaIdx).toBeGreaterThan(firstEidTakbirR1Idx);

    // Verify Rakat 2 extra takbirs are AFTER Surah and BEFORE Ruku
    const r2SurahIdx = timeline.steps.findIndex((s) => s.id === "r2-surah");
    const firstEidTakbirR2Idx = timeline.steps.findIndex(
      (s) => s.posture === Posture.EID_TAKBIR_HANDS_RAISED && s.rakat === 2
    );
    const r2RukuIdx = timeline.steps.findIndex(
      (s) => s.posture === Posture.RUKU && s.rakat === 2
    );
    expect(firstEidTakbirR2Idx).toBeGreaterThan(r2SurahIdx);
    expect(r2RukuIdx).toBeGreaterThan(firstEidTakbirR2Idx);

    // Hands down postures exist between extra takbirs
    const eidHandsDown = timeline.steps.filter(
      (s) => s.posture === Posture.EID_TAKBIR_HANDS_DOWN
    );
    expect(eidHandsDown.length).toBeGreaterThanOrEqual(5);
  });

  it("6. generates valid timeline for Janaza (4 takbirs, standing only, 0 ruku, 0 sajda, ends with salam)", () => {
    const janaza = getPrayerBySlug("janaza")!;
    const janazaUnit = janaza.rakatUnits[0];

    const timeline = buildTimeline(janazaUnit.config, {
      gender: "male",
      role: "imam",
      prayerSlug: "janaza",
    });

    expect(timeline.metadata.isJanaza).toBe(true);
    expect(timeline.metadata.totalRakats).toBe(0);

    // 4 Janaza takbirs
    const janazaTakbirs = timeline.steps.filter(
      (s) => s.posture === Posture.JANAZA_TAKBIR
    );
    expect(janazaTakbirs).toHaveLength(4);
    expect(janazaTakbirs[0].recitationIds).toEqual(["dua-sana-janaza"]);
    expect(janazaTakbirs[1].recitationIds).toEqual(["dua-3"]);
    expect(janazaTakbirs[2].recitationIds).toEqual(["dua-janaza"]);
    expect(janazaTakbirs[3].recitationIds).toEqual([]);

    // 0 Ruku and 0 Sajda
    expect(timeline.steps.filter((s) => s.posture === Posture.RUKU)).toHaveLength(0);
    expect(timeline.steps.filter((s) => s.posture === Posture.SAJDA)).toHaveLength(0);

    // Ends with Salam Right & Left
    const lastTwo = timeline.steps.slice(-2);
    expect(lastTwo[0].posture).toBe(Posture.SALAM_RIGHT);
    expect(lastTwo[1].posture).toBe(Posture.SALAM_LEFT);
  });

  it("7. generates valid timeline for Tahajjud (2 rakat nafl)", () => {
    const tahajjud = getPrayerBySlug("tahajjud")!;
    const unit = tahajjud.rakatUnits[0];

    const timeline = buildTimeline(unit.config, {
      gender: "female",
      role: "alone",
      prayerSlug: "tahajjud",
    });

    assertStandardTimelineInvariants(timeline, unit.config.rakats);
    expect(timeline.metadata.gender).toBe("female");
    expect(timeline.steps[0].genderVariants.handRaiseHeight).toBe("shoulders");
    expect(timeline.steps[0].genderVariants.handFoldPosition).toBe("chest");
  });

  it("8. generates valid timeline for Salatut Tasbih (4 rakats, 75 tasbihs per rakat = 300 total)", () => {
    const tasbihPrayer = getPrayerBySlug("salatut-tasbih")!;
    const unit = tasbihPrayer.rakatUnits[0];

    const timeline = buildTimeline(unit.config, {
      gender: "male",
      role: "alone",
      prayerSlug: "salatut-tasbih",
    });

    assertStandardTimelineInvariants(timeline, 4);

    // Total tasbih count across all 4 rakats must equal 300
    expect(timeline.metadata.totalTasbihCount).toBe(300);

    // Each rakat must sum to 75 tasbihs
    for (let r = 1; r <= 4; r++) {
      const rakatTasbihSum = timeline.steps
        .filter((s) => s.rakat === r)
        .reduce((sum, s) => sum + (s.tasbihCount ?? 0), 0);
      expect(rakatTasbihSum).toBe(75);
    }
  });

  it("9. enforces Hanafi Muqtadi rules (silent standing in Qiyam, no Fatiha/Surah, but recites Sana, Tasbihat, Tashahhud)", () => {
    const fajr = getPrayerBySlug("fajr")!;
    const fardUnit = fajr.rakatUnits.find((u) => u.status === "fard")!;

    const timeline = buildTimeline(fardUnit.config, {
      gender: "male",
      role: "muqtadi",
      prayerSlug: "fajr",
    });

    assertStandardTimelineInvariants(timeline, 2);

    // Muqtadi still recites Sana in Rakat 1
    expect(
      timeline.steps.some((s) => s.recitationIds.includes("dua-1"))
    ).toBe(true);

    // Muqtadi does NOT recite Fatiha or Surah
    expect(
      timeline.steps.some((s) => s.recitationIds.includes("surah-1"))
    ).toBe(false);
    expect(
      timeline.steps.some((s) => s.id.endsWith("-surah"))
    ).toBe(false);

    // Muqtadi recites Ruku tasbih, Sajda tasbih, and Tashahhud
    expect(
      timeline.steps.some((s) => s.recitationIds.includes("dua-6"))
    ).toBe(true);
    expect(
      timeline.steps.some((s) => s.recitationIds.includes("dua-7"))
    ).toBe(true);
    expect(
      timeline.steps.some((s) => s.recitationIds.includes("dua-2"))
    ).toBe(true);
  });

  it("10. supports custom surahChoice override and verifies every PrayerType in the data layer produces a valid timeline", () => {
    const validRecitationIds = new Set([
      ...prayerDuas.map((d) => d.id),
      ...prayerSurahs.map((s) => s.id),
    ]);

    // Test custom surahChoice
    const fajr = getPrayerBySlug("fajr")!;
    const customTimeline = buildTimeline(fajr.rakatUnits[1].config, {
      gender: "male",
      role: "alone",
      surahChoice: { 1: "surah-105", 2: "surah-106" },
    });
    expect(
      customTimeline.steps.some((s) => s.recitationIds.includes("surah-105"))
    ).toBe(true);
    expect(
      customTimeline.steps.some((s) => s.recitationIds.includes("surah-106"))
    ).toBe(true);

    // Loop over ALL 29 PrayerTypes and ALL their rakatUnits
    for (const prayer of prayers) {
      for (const unit of prayer.rakatUnits) {
        const timeline = buildTimeline(unit.config, {
          gender: "male",
          role: "alone",
          prayerSlug: prayer.slug,
          unitLabel: unit.label,
        });

        expect(timeline.steps.length).toBeGreaterThan(0);

        if (unit.config.isJanaza) {
          expect(timeline.metadata.isJanaza).toBe(true);
          expect(
            timeline.steps.filter((s) => s.posture === Posture.JANAZA_TAKBIR)
          ).toHaveLength(4);
        } else {
          assertStandardTimelineInvariants(timeline, unit.config.rakats);
        }

        // Verify every referenced recitationId exists in canonical data layer
        for (const step of timeline.steps) {
          for (const recId of step.recitationIds) {
            expect(validRecitationIds.has(recId)).toBe(true);
          }
        }
      }
    }
  });

  it("11. defines valid articulated joint poses for all 16 postures for both male and female", () => {
    const allPostures = Object.values(Posture);
    expect(allPostures).toHaveLength(16);

    for (const posture of allPostures) {
      expect(MALE_POSES[posture]).toBeDefined();
      expect(FEMALE_POSES[posture]).toBeDefined();
    }

    // Male Ruku has a straight horizontal back (-90 deg) level with head (-90 deg)
    expect(MALE_POSES[Posture.RUKU].torsoAngle).toBe(-90);
    expect(MALE_POSES[Posture.RUKU].headAngle).toBe(-90);

    // Sajda has bent toes and grounded knees/palms/forehead
    expect(MALE_POSES[Posture.SAJDA].toesBent).toBe(true);
    expect(FEMALE_POSES[Posture.SAJDA].toesBent).toBe(true);

    // Tashahhud finger raised
    expect(MALE_POSES[Posture.TASHAHHUD_FINGER_RAISED].fingerRaised).toBe(true);
    expect(FEMALE_POSES[Posture.TASHAHHUD_FINGER_RAISED].fingerRaised).toBe(true);

    // Salam head turns
    expect(MALE_POSES[Posture.SALAM_RIGHT].headTurn).toBe(1);
    expect(MALE_POSES[Posture.SALAM_LEFT].headTurn).toBe(-1);

    // Joint interpolation midpoint
    const mid = interpolatePose(
      MALE_POSES[Posture.STANDING],
      MALE_POSES[Posture.RUKU],
      0.5
    );
    expect(mid.torsoAngle).toBe(-45);
  });

  it("12. resolves 4-layer recitations and local audio files for Fajr, Maghrib, Zuhr, Witr, Eid, and Janaza across both genders", () => {
    const requiredSlugs = [
      "fajr",
      "maghrib",
      "zuhr",
      "witr",
      "eid-ul-fitr",
      "janaza",
    ];

    for (const slug of requiredSlugs) {
      const prayer = getPrayerBySlug(slug);
      expect(prayer).toBeDefined();

      const unit =
        prayer!.rakatUnits.find(
          (u) => u.status === "fard" || u.status === "wajib"
        ) || prayer!.rakatUnits[0];

      for (const gender of ["male", "female"] as const) {
        const timeline = buildTimeline(unit.config, {
          gender,
          role: "alone",
          prayerSlug: prayer!.slug,
          unitLabel: unit.label,
        });

        expect(timeline.steps.length).toBeGreaterThan(0);

        for (const step of timeline.steps) {
          const recitations = resolveStepRecitations(step, prayer!);
          for (const rec of recitations) {
            expect(rec.arabic.trim().length).toBeGreaterThan(0);
            expect(rec.uccharonBn.trim().length).toBeGreaterThan(0);
            expect(rec.banglish.trim().length).toBeGreaterThan(0);
            expect(rec.meaningBn.trim().length).toBeGreaterThan(0);
          }
        }

        const audioUrls = collectTimelineAudioUrls(timeline.steps, prayer!);
        expect(audioUrls.length).toBeGreaterThan(0);

        for (const url of audioUrls) {
          if (url.startsWith("/audio/")) {
            const diskPath = path.join(process.cwd(), "public", url);
            expect(fs.existsSync(diskPath)).toBe(true);
          }
        }
      }
    }
  });

  it("13. generates rotating practice quiz questions (posture, recitation, repeat count, surah required) with Masail ruling links and fiqh consequences", () => {
    const maghrib = getPrayerBySlug("maghrib")!;
    const fardUnit = maghrib.rakatUnits.find((u) => u.status === "fard")!;
    const timeline = buildTimeline(fardUnit.config, {
      gender: "male",
      role: "alone",
      prayerSlug: "maghrib",
      unitLabel: fardUnit.label,
    });

    const questions = generatePracticeQuestions(
      timeline,
      fardUnit.config,
      maghrib
    );
    expect(questions).toHaveLength(timeline.steps.length);

    const seenTypes = new Set(questions.map((q) => q.type));
    expect(seenTypes.has("next-posture")).toBe(true);
    expect(seenTypes.has("next-recitation")).toBe(true);
    expect(seenTypes.has("repeat-count")).toBe(true);
    expect(seenTypes.has("surah-required")).toBe(true);

    const validMasailSlugs = new Set(salahRulings.map((r) => r.slug));

    for (const q of questions) {
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.options.some((o) => o.id === q.correctOptionId)).toBe(true);
      expect(q.explanationBn.trim().length).toBeGreaterThan(0);
      expect(q.fiqhImpactBn.trim().length).toBeGreaterThan(0);
      expect(validMasailSlugs.has(q.rulingSlug)).toBe(true);

      if (q.type === "next-posture") {
        expect(q.options.every((o) => o.posture !== undefined)).toBe(true);
      }
    }
  });

  it("14. builds Wudu timeline with water animation targets, 3x counts, before/after duas, and validates Wudu step order", () => {
    // Full Sunnah + Fard Wudu (9 steps)
    const fullWudu = buildWuduTimeline({
      includeSunnahSteps: true,
      isFasting: false,
      hasKhuffMasah: false,
      gender: "male",
    });

    expect(fullWudu.steps).toHaveLength(9);
    expect(fullWudu.metadata.fardCount).toBe(4);
    expect(fullWudu.steps[0].posture).toBe(WuduPosture.NIYYAT_BISMILLAH);
    expect(fullWudu.steps[0].recitationId).toBe("dua-wudu-before");
    expect(fullWudu.steps[8].posture).toBe(WuduPosture.DUA_AFTER_WUDU);
    expect(fullWudu.steps[8].recitationId).toBe("dua-wudu-after");

    // Verify 4 Fard steps exist and Washing steps have 3x count & water animation
    const fardSteps = fullWudu.steps.filter((s) => s.isFard);
    expect(fardSteps).toHaveLength(4);
    expect(fardSteps.map((s) => s.fardNumber)).toEqual([1, 2, 3, 4]);

    const washHands = fullWudu.steps.find(
      (s) => s.posture === WuduPosture.WASH_HANDS
    )!;
    expect(washHands.repeat).toBe(3);
    expect(washHands.hasWaterAnimation).toBe(true);

    // 4-Fard-Only Wudu
    const fardOnlyWudu = buildWuduTimeline({
      includeSunnahSteps: false,
      gender: "female",
    });
    expect(fardOnlyWudu.steps).toHaveLength(4);
    expect(fardOnlyWudu.steps.every((s) => s.isFard)).toBe(true);

    // Validate canonical Wudu step order vs out-of-order steps
    const canonicalIds = fullWudu.steps.map((s) => s.id);
    const validCheck = validateWuduStepOrder(canonicalIds, {
      includeSunnahSteps: true,
    });
    expect(validCheck.isValid).toBe(true);
    expect(validCheck.firstErrorIndex).toBeNull();

    const swappedIds = [...canonicalIds];
    [swappedIds[1], swappedIds[2]] = [swappedIds[2], swappedIds[1]];
    const invalidCheck = validateWuduStepOrder(swappedIds, {
      includeSunnahSteps: true,
    });
    expect(invalidCheck.isValid).toBe(false);
    expect(invalidCheck.firstErrorIndex).toBe(1);
    expect(invalidCheck.explanationBn.length).toBeGreaterThan(0);

    // Wudu Practice Quiz questions
    const wuduQuiz = generateWuduQuizQuestions(fullWudu);
    expect(wuduQuiz).toHaveLength(9);
    for (const q of wuduQuiz) {
      expect(q.options.length).toBeGreaterThanOrEqual(3);
      expect(q.options.some((o) => o.id === q.correctOptionId)).toBe(true);
    }
  });
});

