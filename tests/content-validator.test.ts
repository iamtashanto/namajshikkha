import { describe, it, expect } from "vitest";
import { validateContent } from "@/src/lib/validate-content";
import {
  prayers,
  prayerSurahs,
  prayerDuas,
  salahRulings,
  prayerHadiths,
  getPrayerBySlug,
  getSurahByNumber,
} from "@/src/data";

describe("Canonical Religious Content Validator", () => {
  it("passes all schema, integrity, and fiqh validation rules", () => {
    const result = validateContent();

    if (!result.isValid) {
      console.error("Validation Errors:", JSON.stringify(result.errors, null, 2));
    }

    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("verifies stats of loaded content", () => {
    const result = validateContent();

    expect(result.stats.prayersCount).toBeGreaterThanOrEqual(7); // 5 daily + Jumuah + Witr
    expect(result.stats.surahsCount).toBeGreaterThanOrEqual(10);
    expect(result.stats.ayahsCount).toBeGreaterThan(50);
    expect(result.stats.duasCount).toBeGreaterThanOrEqual(14);
    expect(result.stats.rulingsCount).toBeGreaterThanOrEqual(5);
    expect(result.stats.hadithsCount).toBeGreaterThanOrEqual(100);
  });

  it("strictly validates rakat math for the 5 daily prayers + Jumuah + Witr", () => {
    const expectedTotals: Record<string, number> = {
      fajr: 4,
      dhuhr: 12,
      asr: 8,
      maghrib: 7,
      isha: 17,
      jumuah: 14,
      witr: 3,
    };

    for (const [slug, expectedTotal] of Object.entries(expectedTotals)) {
      const prayer = getPrayerBySlug(slug);
      expect(prayer).toBeDefined();
      expect(prayer?.totalRakats).toBe(expectedTotal);

      const calculatedTotal = prayer!.rakatUnits.reduce(
        (sum, unit) => sum + unit.count,
        0
      );
      expect(calculatedTotal).toBe(expectedTotal);
    }
  });

  it("verifies SalahConfig configuration for the simulator", () => {
    const isha = getPrayerBySlug("isha");
    expect(isha).toBeDefined();

    // Find witr unit in isha
    const witrUnit = isha!.rakatUnits.find((u) => u.label.includes("বিতর"));
    expect(witrUnit).toBeDefined();
    expect(witrUnit!.config.hasQunut).toEqual({
      enabled: true,
      rakat: 3,
      position: "before-ruku",
    });

    // Verify 4-rakat Fard prayer in Dhuhr has firstSittingAfter: 2 and qiratRakats: [1, 2]
    const dhuhr = getPrayerBySlug("dhuhr");
    const dhuhrFard = dhuhr!.rakatUnits.find((u) => u.status === "fard");
    expect(dhuhrFard?.config.rakats).toBe(4);
    expect(dhuhrFard?.config.firstSittingAfter).toBe(2);
    expect(dhuhrFard?.config.qiratRakats).toEqual([1, 2]);

    // Verify 4-rakat Sunnah prayer has qirat in all 4 rakats: [1, 2, 3, 4]
    const dhuhrSunnah = dhuhr!.rakatUnits.find((u) => u.status === "sunnah");
    expect(dhuhrSunnah?.config.qiratRakats).toEqual([1, 2, 3, 4]);

    // Verify Eid extra takbirs (Hanafi: 3 in 1st rakat after-sana, 3 in 2nd rakat before-ruku)
    const eidFitr = getPrayerBySlug("eid-ul-fitr");
    expect(eidFitr).toBeDefined();
    const eidWajibUnit = eidFitr!.rakatUnits[0];
    expect(eidWajibUnit.config.extraTakbirs).toHaveLength(2);
    expect(eidWajibUnit.config.extraTakbirs?.[0]).toEqual({
      rakat: 1,
      count: 3,
      position: "after-sana",
    });
    expect(eidWajibUnit.config.extraTakbirs?.[1]).toEqual({
      rakat: 2,
      count: 3,
      position: "before-ruku",
    });

    // Verify Janaza configuration (isJanaza: true, 4 takbirs standing only, no ruku/sajda)
    const janaza = getPrayerBySlug("janaza");
    expect(janaza).toBeDefined();
    const janazaUnit = janaza!.rakatUnits[0];
    expect(janazaUnit.config.isJanaza).toBe(true);
    expect(janazaUnit.config.rakats).toBe(0);
    expect(janazaUnit.config.sajdaCount).toBe(0);
    expect(janazaUnit.config.endsWithSalam).toBe(true);

    // Verify Salatut Tasbih per-position counting
    const tasbih = getPrayerBySlug("salatut-tasbih");
    expect(tasbih).toBeDefined();
    const tasbihUnit = tasbih!.rakatUnits[0];
    expect(tasbihUnit.config.tasbihDistribution).toBeDefined();
    expect(tasbihUnit.config.tasbihDistribution).toHaveLength(7);
    const sumTasbih = tasbihUnit.config.tasbihDistribution!.reduce(
      (sum, item) => sum + item.count,
      0
    );
    expect(sumTasbih).toBe(75); // 75 per rakat * 4 = 300

    // Verify flexible prayers have rakatRange
    const tahajjud = getPrayerBySlug("tahajjud");
    expect(tahajjud?.rakatUnits[0].config.rakatRange).toEqual([2, 12]);
    const chasht = getPrayerBySlug("chasht");
    expect(chasht?.rakatUnits[0].config.rakatRange).toEqual([2, 12]);
  });

  it("verifies all 17 Masail topics, decision trees, and tilawat ayahs", () => {
    expect(salahRulings.length).toBeGreaterThanOrEqual(17);

    // Verify Sajda Sahu decision tree
    const sajdaSahu = salahRulings.find((r) => r.slug === "sajda-sahu");
    expect(sajdaSahu).toBeDefined();
    expect(sajdaSahu?.decisionTree).toBeDefined();
    expect(sajdaSahu?.decisionTree?.rootNodeId).toBe("node-root");

    // Verify Sajda Tilawat 14 ayahs
    const sajdaTilawat = salahRulings.find((r) => r.slug === "sajda-tilawat");
    expect(sajdaTilawat).toBeDefined();
    expect(sajdaTilawat?.tilawatAyahs).toHaveLength(14);

    // Verify Sick Person decision tree
    const sickPerson = salahRulings.find((r) => r.slug === "salah-of-the-sick");
    expect(sickPerson).toBeDefined();
    expect(sickPerson?.decisionTree).toBeDefined();

    // Verify Masbuq worked examples
    const masbuq = salahRulings.find((r) => r.slug === "masbuq-and-lahiq");
    expect(masbuq).toBeDefined();
    expect(masbuq?.bodyBn).toContain("Worked Examples");
  });

  it("verifies that Surah Al-Fatihah is configured per-ayah for memorization mode", () => {
    const fatiha = getSurahByNumber(1);
    expect(fatiha).toBeDefined();
    expect(fatiha?.nameBn).toBe("আল-ফাতিহা");
    expect(fatiha?.ayahCount).toBe(7);
    expect(fatiha?.ayahs).toHaveLength(7);

    // Each ayah has 4 formats
    for (const ayah of fatiha!.ayahs) {
      expect(ayah.arabic.trim().length).toBeGreaterThan(0);
      expect(ayah.uccharonBn.trim().length).toBeGreaterThan(0);
      expect(ayah.banglish.trim().length).toBeGreaterThan(0);
      expect(ayah.meaningBn.trim().length).toBeGreaterThan(0);
    }
  });

  it("verifies no duplicate IDs exist across any religious content", () => {
    const allIds = [
      ...prayers.map((p) => p.slug),
      ...prayerSurahs.map((s) => s.id),
      ...prayerSurahs.flatMap((s) => s.ayahs.map((a) => a.id)),
      ...prayerDuas.map((d) => d.id),
      ...salahRulings.map((r) => r.id),
      ...prayerHadiths.map((h) => String(h.id)),
    ];

    const uniqueIds = new Set(allIds);
    expect(allIds.length).toBe(uniqueIds.size);
  });
});

