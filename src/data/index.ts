import { prayers } from "./prayers";
import { prayerSurahs } from "./surahs";
import { prayerDuas } from "./duas";
import { salahRulings } from "./rulings";

export * from "./prayers";
export * from "./surahs";
export * from "./duas";
export * from "./rulings";
export * from "./hadiths";

// Lookup helpers
export function getPrayerBySlug(slug: string) {
  return prayers.find((p) => p.slug === slug);
}

export function getSurahByNumber(num: number) {
  return prayerSurahs.find((s) => s.number === num);
}

export function getDuaById(id: string) {
  return prayerDuas.find((d) => d.id === id);
}

export function getRulingById(id: string) {
  return salahRulings.find((r) => r.id === id);
}
