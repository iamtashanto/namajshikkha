import { prayers } from "@/src/data/prayers";
import { prayerSurahs } from "@/src/data/surahs";
import { prayerDuas } from "@/src/data/duas";
import { salahRulings } from "@/src/data/rulings";
import { prayerHadiths } from "@/src/data/hadiths";
import { Reference } from "@/src/types/content";

export interface ValidationError {
  type: "duplicate_id" | "empty_arabic" | "invalid_config" | "rakat_math_mismatch" | "missing_reference_source";
  entityId: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  stats: {
    prayersCount: number;
    surahsCount: number;
    ayahsCount: number;
    duasCount: number;
    rulingsCount: number;
    hadithsCount: number;
  };
}

export function validateContent(): ValidationResult {
  const errors: ValidationError[] = [];
  const seenIds = new Set<string>();

  let ayahsCount = 0;

  function checkId(id: string, entityType: string) {
    if (!id || id.trim() === "") {
      errors.push({
        type: "duplicate_id",
        entityId: id,
        message: `Empty or missing ID in ${entityType}`,
      });
      return;
    }
    if (seenIds.has(id)) {
      errors.push({
        type: "duplicate_id",
        entityId: id,
        message: `Duplicate ID detected: "${id}" in ${entityType}`,
      });
    } else {
      seenIds.add(id);
    }
  }

  function checkArabic(arabic: string | undefined, id: string, entityType: string) {
    if (!arabic || arabic.trim().length === 0) {
      errors.push({
        type: "empty_arabic",
        entityId: id,
        message: `Empty Arabic text found in ${entityType} [${id}]`,
      });
    }
  }

  function checkReference(ref: Reference | undefined, entityId: string) {
    if (!ref) return;
    if (!ref.source || ref.source.trim().length === 0) {
      errors.push({
        type: "missing_reference_source",
        entityId,
        message: `Missing reference source for entity [${entityId}]`,
      });
    }
    if (ref.number === undefined || ref.number === null || String(ref.number).trim().length === 0) {
      errors.push({
        type: "missing_reference_source",
        entityId,
        message: `Missing reference number for entity [${entityId}] in source: ${ref.source}`,
      });
    }
  }

  // 1. Validate Prayers & SalahConfig & Rakat Math
  for (const prayer of prayers) {
    checkId(prayer.slug, "PrayerType");

    if (prayer.niyyat) {
      checkArabic(prayer.niyyat.arabic, `${prayer.slug}-niyyat`, "Niyyat");
    }

    if (prayer.fazilat?.reference) {
      checkReference(prayer.fazilat.reference, prayer.slug);
    }
    for (const ref of prayer.references) {
      checkReference(ref, prayer.slug);
    }

    if (!prayer.rakatUnits || prayer.rakatUnits.length === 0) {
      errors.push({
        type: "invalid_config",
        entityId: prayer.slug,
        message: `Prayer "${prayer.slug}" has no rakat units defined`,
      });
      continue;
    }

    // Rakat Math Check: Sum of units must equal totalRakats
    const calculatedTotal = prayer.rakatUnits.reduce((sum, u) => sum + u.count, 0);
    if (calculatedTotal !== prayer.totalRakats) {
      errors.push({
        type: "rakat_math_mismatch",
        entityId: prayer.slug,
        message: `Rakat math mismatch for "${prayer.nameBn}" (${prayer.slug}): units sum to ${calculatedTotal}, but totalRakats is ${prayer.totalRakats}`,
      });
    }

    // Validate each unit's SalahConfig
    for (let uIdx = 0; uIdx < prayer.rakatUnits.length; uIdx++) {
      const unit = prayer.rakatUnits[uIdx];
      const cfg = unit.config;

      if (!cfg) {
        errors.push({
          type: "invalid_config",
          entityId: `${prayer.slug}-unit-${uIdx}`,
          message: `Unit "${unit.label}" in prayer "${prayer.slug}" has no SalahConfig`,
        });
        continue;
      }

      if (cfg.rakats !== unit.count) {
        errors.push({
          type: "rakat_math_mismatch",
          entityId: `${prayer.slug}-unit-${uIdx}`,
          message: `Unit count (${unit.count}) does not match SalahConfig rakats (${cfg.rakats}) for "${unit.label}" in "${prayer.slug}"`,
        });
      }

      if (!cfg.isJanaza && cfg.sajdaCount < 1) {
        errors.push({
          type: "invalid_config",
          entityId: `${prayer.slug}-unit-${uIdx}`,
          message: `Invalid sajdaCount (${cfg.sajdaCount}) in "${unit.label}"`,
        });
      }

      if (
        !cfg.isJanaza &&
        cfg.firstSittingAfter !== null &&
        (cfg.firstSittingAfter < 1 || cfg.firstSittingAfter > cfg.rakats)
      ) {
        errors.push({
          type: "invalid_config",
          entityId: `${prayer.slug}-unit-${uIdx}`,
          message: `Invalid firstSittingAfter (${cfg.firstSittingAfter}) for ${cfg.rakats}-rakat prayer in "${unit.label}"`,
        });
      }

      for (const qRakat of cfg.qiratRakats) {
        if (!cfg.isJanaza && (qRakat < 1 || qRakat > cfg.rakats)) {
          errors.push({
            type: "invalid_config",
            entityId: `${prayer.slug}-unit-${uIdx}`,
            message: `Invalid qiratRakat index ${qRakat} for ${cfg.rakats}-rakat prayer in "${unit.label}"`,
          });
        }
      }
    }
  }

  // 2. Validate Surahs & Ayahs
  for (const surah of prayerSurahs) {
    checkId(surah.id, "Surah");
    if (surah.fazilat?.reference) {
      checkReference(surah.fazilat.reference, surah.id);
    }

    if (!surah.ayahs || surah.ayahs.length === 0) {
      errors.push({
        type: "invalid_config",
        entityId: surah.id,
        message: `Surah ${surah.nameBn} (${surah.id}) has no ayahs`,
      });
      continue;
    }

    for (const ayah of surah.ayahs) {
      ayahsCount++;
      checkId(ayah.id, `Ayah in ${surah.nameBn}`);
      checkArabic(ayah.arabic, ayah.id, "Ayah");
      if (ayah.reference) {
        checkReference(ayah.reference, ayah.id);
      }
    }
  }

  // 3. Validate Duas
  for (const dua of prayerDuas) {
    checkId(dua.id, "Dua");
    checkArabic(dua.arabic, dua.id, "Dua");
    if (dua.reference) {
      checkReference(dua.reference, dua.id);
    }
  }

  // 4. Validate Rulings
  for (const ruling of salahRulings) {
    checkId(ruling.id, "Ruling");
    for (const ref of ruling.references) {
      checkReference(ref, ruling.id);
    }
  }

  // 5. Validate Hadiths
  for (const hadith of prayerHadiths) {
    checkId(String(hadith.id), "Hadith");
    if (hadith.reference) {
      checkReference(hadith.reference, String(hadith.id));
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    stats: {
      prayersCount: prayers.length,
      surahsCount: prayerSurahs.length,
      ayahsCount,
      duasCount: prayerDuas.length,
      rulingsCount: salahRulings.length,
      hadithsCount: prayerHadiths.length,
    },
  };
}
