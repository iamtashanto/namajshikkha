import { prayers } from "@/src/data/prayers";
import { salahRulings } from "@/src/data/rulings";
import { prayerSurahs } from "@/src/data/surahs";
import { prayerDuas } from "@/src/data/duas";
import { taharatSections } from "@/src/data/taharat";
import { prayerHadiths } from "@/src/data/hadiths";
import allSurahsData from "@/data/all-surahs.json";
import faqsData from "@/data/faqs.json";
import historyData from "@/data/islamic-history.json";
import { shikhunArticles } from "@/src/data/shikhun";
import { expandQueryWithSynonyms } from "@/src/data/search-synonyms";

export type SearchCategoryKey =
  | "prayer"
  | "masail"
  | "surah"
  | "dua"
  | "taharat"
  | "hadith_faq"
  | "tool"
  | "history";

export interface SearchDoc {
  id: string;
  titleBn: string;
  titleEn: string;
  titleAr?: string;
  categoryKey: SearchCategoryKey;
  categoryLabelBn: string;
  url: string;
  snippetBn: string;
  searchableContent: string;
}

export interface SearchResultItem extends SearchDoc {
  score: number;
}

export interface SearchGroupedResults {
  categoryKey: SearchCategoryKey;
  categoryLabelBn: string;
  items: SearchResultItem[];
}

/**
 * Build-time / initial static index of all knowledge items across the site
 */
export function buildSearchIndex(): SearchDoc[] {
  const docs: SearchDoc[] = [];

  // 1. Core Tools
  docs.push(
    {
      id: "tool-prayer-times",
      titleBn: "নামাজের সময়সূচী",
      titleEn: "Prayer Times",
      categoryKey: "tool",
      categoryLabelBn: "টুলস ও সেবা",
      url: "/prayer-times",
      snippetBn: "প্রতিদিনের ৫ ওয়াক্ত সালাত, তাহাজ্জুদ ও ৩টি নিষিদ্ধ সময়সূচী।",
      searchableContent:
        "নামাজের সময়সূচী prayer times fajr dhuhr asr maghrib isha তাহাজ্জুদ সেহরি ইফতার নিষিদ্ধ সময় zawal",
    },
    {
      id: "tool-qibla",
      titleBn: "কিবলা কম্পাস",
      titleEn: "Qibla Direction",
      categoryKey: "tool",
      categoryLabelBn: "টুলস ও সেবা",
      url: "/qibla",
      snippetBn: "পবিত্র কাবা শরীফের সঠিক দিক ও ডিগ্রি নির্ণয় কম্পাস।",
      searchableContent: "কিবলা কম্পাস qibla compass কাবার দিক দিকনির্ণয় কাবা",
    },
    {
      id: "tool-tracker",
      titleBn: "নামাজ ট্র্যাকার ও কাযা হিসাব",
      titleEn: "Prayer Tracker & Qaza Counter",
      categoryKey: "tool",
      categoryLabelBn: "টুলস ও সেবা",
      url: "/tracker",
      snippetBn: "দৈনিক ৫ ওয়াক্ত সালাত চেকলিস্ট, স্ট্রিক ও কাযা সালাতের হিসাব।",
      searchableContent:
        "নামাজ ট্র্যাকার prayer tracker qaza kaza কাযা কাজা হিসাব চেকলিস্ট",
    },
    {
      id: "tool-simulator",
      titleBn: "ইন্টারঅ্যাক্টিভ নামাজ সিমুলেটর",
      titleEn: "Namaj Simulator",
      categoryKey: "tool",
      categoryLabelBn: "টুলস ও সেবা",
      url: "/simulator",
      snippetBn: "অ্যানিমেটেড চিত্র ও অডিও সহ ধাপে ধাপে নামাজ শেখার সিমুলেটর।",
      searchableContent:
        "নামাজ সিমুলেটর simulator learn salah নামাজ শেখা অ্যানিমেশন রুকু সিজদা কিয়াম",
    },
    {
      id: "tool-hifz",
      titleBn: "সূরা হিফজ ও মুখস্থ অনুশীলন মোড",
      titleEn: "Surah Memorization Mode",
      categoryKey: "tool",
      categoryLabelBn: "টুলস ও সেবা",
      url: "/surah-dua/surah-1/hifz",
      snippetBn: "স্পেসড রিপিটেশন, অডিও পুনরাবৃত্তি ও সেলফ-টেস্ট সহ সূরা মুখস্থ করুন।",
      searchableContent:
        "হিফজ মুখস্থ memorization hifz surah সূরা মুখস্থ আয়াতুল কুরসী ফাতিহা",
    }
  );

  // 2. Prayers (29 Prayer Types)
  for (const p of prayers) {
    docs.push({
      id: `prayer-${p.slug}`,
      titleBn: p.nameBn,
      titleEn: p.nameEn,
      titleAr: p.nameAr,
      categoryKey: "prayer",
      categoryLabelBn: "নামাজ ও সালাত",
      url: `/namaj/${p.slug}`,
      snippetBn: p.fazilat?.textBn || `${p.nameBn} নামাজের সম্পূর্ণ নিয়ম, রাকাত ও নিয়ত।`,
      searchableContent: `${p.nameBn} ${p.nameEn} ${p.nameAr} ${p.category} ${p.fazilat?.textBn || ""} ${p.niyyat?.meaningBn || ""} ${p.niyyat?.arabic || ""}`,
    });
  }

  // 3. Masail Rulings (17 Fiqh Rulings)
  for (const r of salahRulings) {
    docs.push({
      id: `masail-${r.slug}`,
      titleBn: r.titleBn,
      titleEn: r.titleEn,
      categoryKey: "masail",
      categoryLabelBn: "নামাজের মাসায়েল",
      url: `/masail/${r.slug}`,
      snippetBn: r.summaryBn,
      searchableContent: `${r.titleBn} ${r.titleEn} ${r.summaryBn} ${r.bodyBn.slice(0, 300)}`,
    });
  }

  // 4. Surahs (Prayer Surahs + Ayatul Kursi)
  for (const s of prayerSurahs) {
    docs.push({
      id: `surah-${s.id}`,
      titleBn: s.id === "ayatul-kursi" ? s.nameBn : `সূরা ${s.nameBn}`,
      titleEn: s.nameEn,
      titleAr: s.nameAr,
      categoryKey: "surah",
      categoryLabelBn: "সূরা ও কুরআন",
      url: `/surah-dua/${s.id}/hifz`,
      snippetBn: `${s.nameBn} — ${s.ayahCount} আয়াত। আরবি, বাংলা উচ্চারণ, অর্থ ও হিফজ।`,
      searchableContent: `${s.nameBn} ${s.nameEn} ${s.nameAr} ${s.ayahs.map((a) => `${a.uccharonBn} ${a.meaningBn}`).join(" ")}`,
    });
  }

  // 5. Duas
  for (const d of prayerDuas) {
    docs.push({
      id: `dua-${d.id}`,
      titleBn: d.titleBn,
      titleEn: d.titleEn,
      titleAr: d.arabic.slice(0, 30),
      categoryKey: "dua",
      categoryLabelBn: "দোয়া ও জিকির",
      url: `/surah-dua#${d.id}`,
      snippetBn: d.meaningBn,
      searchableContent: `${d.titleBn} ${d.titleEn} ${d.uccharonBn} ${d.meaningBn} ${d.banglish}`,
    });
  }

  // 6. Taharat
  for (const t of taharatSections) {
    docs.push({
      id: `taharat-${t.slug}`,
      titleBn: t.titleBn,
      titleEn: t.titleEn,
      titleAr: t.titleAr,
      categoryKey: "taharat",
      categoryLabelBn: "পবিত্রতা ও তাহারাত",
      url: `/taharat/${t.slug}`,
      snippetBn: t.summaryBn,
      searchableContent: `${t.titleBn} ${t.titleEn} ${t.titleAr} ${t.summaryBn}`,
    });
  }

  // 7. Hadiths
  for (const h of prayerHadiths) {
    const source = h.reference?.source || "";
    docs.push({
      id: `hadith-${h.id}`,
      titleBn: h.titleBn,
      titleEn: h.titleEn,
      categoryKey: "hadith_faq",
      categoryLabelBn: "হাদিস ও প্রশ্নোত্তর",
      url: `/hadith-faq#${h.id}`,
      snippetBn: `${h.textBn.slice(0, 100)}... (${source})`,
      searchableContent: `${h.titleBn} ${h.titleEn} ${h.textBn} ${source}`,
    });
  }

  // 8. FAQs
  for (let i = 0; i < faqsData.length; i++) {
    const f = faqsData[i];
    docs.push({
      id: `faq-${f.id}`,
      titleBn: f.question_bn,
      titleEn: f.question_en,
      categoryKey: "hadith_faq",
      categoryLabelBn: "হাদিস ও প্রশ্নোত্তর",
      url: `/hadith-faq#faq-${f.id}`,
      snippetBn: `${f.answer_bn.slice(0, 110)}...`,
      searchableContent: `${f.question_bn} ${f.question_en} ${f.answer_bn}`,
    });
  }

  // 9. Islamic History events
  for (const era of historyData) {
    for (const ev of era.events) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyEv = ev as any;
      if (anyEv.slug) {
        docs.push({
          id: `hist-${anyEv.slug}`,
          titleBn: anyEv.title_bn,
          titleEn: anyEv.title_en,
          categoryKey: "history",
          categoryLabelBn: "ইসলামিক ইতিহাস",
          url: `/islamic-history/${era.id}/${anyEv.slug}`,
          snippetBn: anyEv.short_desc_bn || anyEv.title_bn,
          searchableContent: `${anyEv.title_bn} ${anyEv.title_en} ${anyEv.short_desc_bn || ""}`,
        });
      }
    }
  }

  // 10. Shikhun Articles
  for (const art of shikhunArticles) {
    docs.push({
      id: `shikhun-${art.slug}`,
      titleBn: art.titleBn,
      titleEn: art.titleEn,
      categoryKey: "masail",
      categoryLabelBn: "নামাজের মাসায়েল ও প্রবন্ধ",
      url: `/shikhun/${art.slug}`,
      snippetBn: art.summaryBn,
      searchableContent: `${art.titleBn} ${art.titleEn} ${art.summaryBn} ${art.categoryLabelBn}`,
    });
  }

  return docs;
}

// Singleton cached index
let cachedIndex: SearchDoc[] | null = null;

function getCachedSearchIndex(): SearchDoc[] {
  if (!cachedIndex) {
    cachedIndex = buildSearchIndex();
  }
  return cachedIndex;
}

/**
 * Searches across the knowledge base with:
 * - Synonym expansion (Bangla, Banglish, English)
 * - Exact and fuzzy token matching
 * - Priority scoring
 * - Grouping by category
 */
export function searchSite(
  query: string,
  limitPerCategory = 5
): SearchGroupedResults[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const index = getCachedSearchIndex();
  const searchTerms = expandQueryWithSynonyms(trimmed);

  const scoredDocs: SearchResultItem[] = [];

  for (const doc of index) {
    let score = 0;
    const titleBnLower = doc.titleBn.toLowerCase();
    const titleEnLower = doc.titleEn.toLowerCase();
    const snippetLower = doc.snippetBn.toLowerCase();
    const contentLower = doc.searchableContent.toLowerCase();

    for (const term of searchTerms) {
      const t = term.toLowerCase();
      if (!t) continue;

      // Exact title match gets huge boost
      if (titleBnLower === t || titleEnLower === t) {
        score += 100;
      } else if (titleBnLower.startsWith(t) || titleEnLower.startsWith(t)) {
        score += 60;
      } else if (titleBnLower.includes(t) || titleEnLower.includes(t)) {
        score += 40;
      } else if (snippetLower.includes(t)) {
        score += 15;
      } else if (contentLower.includes(t)) {
        score += 8;
      }
    }

    if (score > 0) {
      scoredDocs.push({
        ...doc,
        score,
      });
    }
  }

  // Sort descending by score
  scoredDocs.sort((a, b) => b.score - a.score);

  // Group by category
  const groupMap = new Map<SearchCategoryKey, SearchResultItem[]>();
  const categoryOrder: SearchCategoryKey[] = [
    "prayer",
    "masail",
    "surah",
    "dua",
    "taharat",
    "hadith_faq",
    "tool",
    "history",
  ];

  for (const doc of scoredDocs) {
    if (!groupMap.has(doc.categoryKey)) {
      groupMap.set(doc.categoryKey, []);
    }
    const list = groupMap.get(doc.categoryKey)!;
    if (list.length < limitPerCategory) {
      list.push(doc);
    }
  }

  const results: SearchGroupedResults[] = [];
  for (const catKey of categoryOrder) {
    const items = groupMap.get(catKey);
    if (items && items.length > 0) {
      results.push({
        categoryKey: catKey,
        categoryLabelBn: items[0].categoryLabelBn,
        items,
      });
    }
  }

  return results;
}
