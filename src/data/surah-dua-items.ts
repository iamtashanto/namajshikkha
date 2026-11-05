import { prayerSurahs } from "./surahs";
import { prayerDuas } from "./duas";

export interface SurahDuaCardItem {
  id: number | string;
  title_bn: string;
  title_en: string;
  arabic_text: string;
  bangla_pronunciation: string;
  banglish: string;
  bangla_meaning: string;
  audio_url: string;
  category: "surah" | "dua";
  verse_count?: number;
}

export function getSurahCardItems(): SurahDuaCardItem[] {
  const surahs: SurahDuaCardItem[] = prayerSurahs.map((s) => ({
    id: s.number,
    title_bn: `সূরা ${s.nameBn}`,
    title_en: `Surah ${s.nameEn}`,
    arabic_text: s.ayahs.map((a) => a.arabic).join("\n"),
    bangla_pronunciation: s.ayahs.map((a) => a.uccharonBn).join("\n"),
    banglish: s.ayahs.map((a) => a.banglish).join("\n"),
    bangla_meaning: s.ayahs.map((a) => a.meaningBn).join("\n"),
    audio_url: s.audioSrc,
    category: "surah",
    verse_count: s.ayahCount,
  }));

  const duas: SurahDuaCardItem[] = prayerDuas.map((d, idx) => ({
    id: d.id.replace(/^dua-/, "") || idx + 1,
    title_bn: d.titleBn,
    title_en: d.titleEn,
    arabic_text: d.arabic,
    bangla_pronunciation: d.uccharonBn,
    banglish: d.banglish,
    bangla_meaning: d.meaningBn,
    audio_url: d.audioSrc || "",
    category: "dua",
  }));

  return [...surahs, ...duas];
}

