import { PrayerType, Recitation } from "@/src/types/content";
import { prayerDuas, prayerSurahs } from "@/src/data";
import { Posture, Step } from "./types";
import { BodyPartHighlight } from "./poses";

export interface ResolvedRecitation {
  id: string;
  titleBn: string;
  titleEn: string;
  arabic: string;
  uccharonBn: string;
  banglish: string;
  meaningBn: string;
  audioUrl?: string;
  referenceSource?: string;
  referenceNumber?: string | number;
  isSurah?: boolean;
}

/**
 * Resolves a single recitationId (from dua or surah canonical data)
 * into a unified ResolvedRecitation with local offline-ready audio URL.
 */
export function resolveRecitationById(id: string): ResolvedRecitation | null {
  const dua = prayerDuas.find((d) => d.id === id);
  if (dua) {
    return {
      id: dua.id,
      titleBn: dua.titleBn,
      titleEn: dua.titleEn,
      arabic: dua.arabic,
      uccharonBn: dua.uccharonBn,
      banglish: dua.banglish,
      meaningBn: dua.meaningBn,
      audioUrl: dua.audioSrc,
      referenceSource: dua.reference?.source,
      referenceNumber: dua.reference?.number,
      isSurah: false,
    };
  }

  const surah = prayerSurahs.find((s) => s.id === id);
  if (surah) {
    // Exclude duplicate Bismillah line if dua-tasmiyah is already recited separately,
    // except for Surah Al-Fatihah where Ayah 1 is Bismillah
    const ayahsToJoin =
      surah.number === 1
        ? surah.ayahs
        : surah.ayahs.filter((a) => !a.id.endsWith("-line-1") || a.titleEn !== "Bismillah");

    const effectiveAyahs = ayahsToJoin.length > 0 ? ayahsToJoin : surah.ayahs;

    // Prefer self-hosted local audio (/audio/surah-{number}.mp3) for instant zero-CORS offline playback
    const localSurahAudio = `/audio/surah-${surah.number}.mp3`;

    return {
      id: surah.id,
      titleBn: `সূরা ${surah.nameBn} (${surah.nameAr})`,
      titleEn: `Surah ${surah.nameEn}`,
      arabic: effectiveAyahs.map((a) => a.arabic).join("\n"),
      uccharonBn: effectiveAyahs.map((a) => a.uccharonBn).join("\n"),
      banglish: effectiveAyahs.map((a) => a.banglish).join("\n"),
      meaningBn: effectiveAyahs.map((a) => a.meaningBn).join("\n"),
      audioUrl: localSurahAudio || surah.audioSrc,
      referenceSource: `আল-কুরআন, সূরা ${surah.nameBn}`,
      referenceNumber: `সূরা নং ${surah.number}`,
      isSurah: true,
    };
  }

  return null;
}

/**
 * Resolves all recitations for a simulator Step, including Niyyat fallback on step-niyyat.
 */
export function resolveStepRecitations(
  step: Step,
  prayer?: PrayerType
): ResolvedRecitation[] {
  if (
    (step.id === "step-niyyat" || step.id === "janaza-niyyat") &&
    prayer?.niyyat
  ) {
    const n: Recitation = prayer.niyyat;
    return [
      {
        id: n.id,
        titleBn: `${prayer.nameBn} নামাজের নিয়্যত (অন্তরের সংকল্প)`,
        titleEn: n.titleEn,
        arabic: n.arabic,
        uccharonBn: n.uccharonBn,
        banglish: n.banglish,
        meaningBn: n.meaningBn,
        audioUrl: n.audioSrc,
        isSurah: false,
      },
    ];
  }

  const list: ResolvedRecitation[] = [];
  for (const id of step.recitationIds) {
    const resolved = resolveRecitationById(id);
    if (resolved) {
      list.push(resolved);
    }
  }
  return list;
}

/**
 * Collects all unique audio URLs needed for an entire prayer timeline so the Service Worker
 * can precache them for offline playback.
 */
export function collectTimelineAudioUrls(
  steps: Step[],
  prayer?: PrayerType
): string[] {
  const urls = new Set<string>();
  urls.add("/audio/allahu-akbar.mp3");

  for (const step of steps) {
    const recitations = resolveStepRecitations(step, prayer);
    for (const r of recitations) {
      if (r.audioUrl) {
        urls.add(r.audioUrl);
      }
    }
  }

  return Array.from(urls);
}

/**
 * Returns default anatomical highlights for a posture so the learner sees key sunnah/fard body positions.
 */
export function getDefaultHighlightsForPosture(
  posture: Posture
): BodyPartHighlight[] {
  switch (posture) {
    case Posture.TAKBIR_HANDS_RAISED:
    case Posture.QUNUT_TAKBIR_HANDS_RAISED:
    case Posture.EID_TAKBIR_HANDS_RAISED:
      return ["hands"];
    case Posture.RUKU:
      return ["back", "knees"];
    case Posture.SAJDA:
      return ["sajda_7_parts"];
    case Posture.TASHAHHUD_FINGER_RAISED:
      return ["index_finger"];
    case Posture.QADA:
    case Posture.JALSA:
      return ["toes"];
    default:
      return [];
  }
}
