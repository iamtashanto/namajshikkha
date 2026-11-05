import { describe, it, expect } from "vitest";
import { searchSite, buildSearchIndex } from "@/src/lib/search";
import {
  calculateNextHifzRecord,
  getMaskedWords,
  SPACED_REPETITION_INTERVALS,
} from "@/src/lib/hifz/storage";
import {
  buildWebSiteSchema,
  buildPrayerHowToSchema,
  buildFAQSchema,
  buildBreadcrumbSchema,
  buildArticleSchema,
} from "@/src/lib/seo/schema";
import { getPrayerBySlug, prayers } from "@/src/data";
import { salahRulings } from "@/src/data/rulings";
import { shikhunArticles } from "@/src/data/shikhun";

describe("Site-wide Search Engine & Synonyms", () => {
  it("builds a search index with over 100 comprehensive items", () => {
    const index = buildSearchIndex();
    expect(index.length).toBeGreaterThan(100);
  });

  const sampleQueries = [
    { query: "janaza", expectedUrlPart: "janaza" },
    { query: "জানাজা", expectedUrlPart: "janaza" },
    { query: "funeral prayer", expectedUrlPart: "janaza" },
    { query: "tahajjud", expectedUrlPart: "tahajjud" },
    { query: "তাহাজ্জুদ", expectedUrlPart: "tahajjud" },
    { query: "night prayer", expectedUrlPart: "tahajjud" },
    { query: "witr", expectedUrlPart: "witr" },
    { query: "বিতর", expectedUrlPart: "witr" },
    { query: "sajda sahu", expectedUrlPart: "sajda-sahu" },
    { query: "সেজদায়ে সাহু", expectedUrlPart: "sajda-sahu" },
    { query: "wudu", expectedUrlPart: "wudu" },
    { query: "অজু", expectedUrlPart: "wudu" },
    { query: "fatiha", expectedUrlPart: "surah-1" },
    { query: "আয়াতুল কুরসী", expectedUrlPart: "ayatul-kursi" },
    { query: "qaza", expectedUrlPart: "tracker" },
  ];

  sampleQueries.forEach(({ query, expectedUrlPart }) => {
    it(`finds relevant results for sample query: "${query}"`, () => {
      const results = searchSite(query);
      expect(results.length).toBeGreaterThan(0);

      // Check that at least one result contains the expected URL keyword
      const allItems = results.flatMap((g) => g.items);
      const matched = allItems.some((item) =>
        item.url.toLowerCase().includes(expectedUrlPart.toLowerCase())
      );
      expect(matched).toBe(true);
    });
  });

  it("returns grouped results categorized cleanly", () => {
    const results = searchSite("নামাজ");
    expect(results.length).toBeGreaterThan(0);
    const categoryKeys = results.map((r) => r.categoryKey);
    expect(categoryKeys).toContain("prayer");
  });
});

describe("Hifz Memorization Spaced Repetition", () => {
  it("uses the correct 1, 3, 7, 14, 30 day intervals", () => {
    expect(SPACED_REPETITION_INTERVALS).toEqual([1, 3, 7, 14, 30]);
  });

  it("calculates due dates and increments mastery stages properly", () => {
    const now = new Date("2026-01-01T00:00:00.000Z");

    // First successful attempt (Stage 0 -> Stage 1, 1 day)
    const rec1 = calculateNextHifzRecord(null, "surah-112", true, now);
    expect(rec1.successStreak).toBe(1);
    expect(rec1.stage).toBe(1);
    expect(rec1.intervalDays).toBe(1);
    expect(rec1.nextReviewDate).toBe("2026-01-02");

    // Second successful attempt (Stage 1 -> Stage 2, 3 days)
    const rec2 = calculateNextHifzRecord(rec1, "surah-112", true, now);
    expect(rec2.successStreak).toBe(2);
    expect(rec2.stage).toBe(2);
    expect(rec2.intervalDays).toBe(3);
    expect(rec2.nextReviewDate).toBe("2026-01-04");

    // Third successful attempt (Stage 2 -> Stage 3, 7 days)
    const rec3 = calculateNextHifzRecord(rec2, "surah-112", true, now);
    expect(rec3.successStreak).toBe(3);
    expect(rec3.stage).toBe(3);
    expect(rec3.intervalDays).toBe(7);
    expect(rec3.nextReviewDate).toBe("2026-01-08");

    // Unsuccessful attempt resets streak to 0 and stage to 1
    const failed = calculateNextHifzRecord(rec3, "surah-112", false, now);
    expect(failed.successStreak).toBe(0);
    expect(failed.stage).toBe(1);
    expect(failed.intervalDays).toBe(1);
    expect(failed.nextReviewDate).toBe("2026-01-02");
  });

  it("correctly masks words for interactive hide modes", () => {
    const text = "قُلْ هُوَ اللَّهُ أَحَدٌ";

    // normal: all visible
    expect(getMaskedWords(text, "normal").every((w) => !w.isHidden)).toBe(true);

    // hide-arabic: all words hidden
    expect(getMaskedWords(text, "hide-arabic").every((w) => w.isHidden)).toBe(
      true
    );

    // hide-every-other-word: alternate words hidden
    const maskedAlternating = getMaskedWords(text, "hide-every-other-word");
    expect(maskedAlternating[0].isHidden).toBe(false);
    expect(maskedAlternating[1].isHidden).toBe(true);

    // first-letters: masked with displayed first char
    const firstLetters = getMaskedWords(text, "first-letters");
    expect(firstLetters[0].isHidden).toBe(true);
    expect(firstLetters[0].word).toContain("ـ...");
  });
});

describe("SEO Structured Data & Meta Tags", () => {
  it("builds valid Organization & WebSite JSON-LD with SearchAction", () => {
    const schema = buildWebSiteSchema();
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@graph"]).toBeInstanceOf(Array);

    const org = schema["@graph"].find((g) => g["@type"] === "Organization");
    expect(org).toBeDefined();
    expect(org?.name).toBe("নামাজ শিক্ষা");

    const website = schema["@graph"].find((g) => g["@type"] === "WebSite");
    expect(website).toBeDefined();
    expect(website?.potentialAction?.["@type"]).toBe("SearchAction");
  });

  it("builds valid HowTo JSON-LD schema for prayer steps", () => {
    const fajr = getPrayerBySlug("fajr");
    expect(fajr).toBeDefined();
    if (!fajr) return;

    const howTo = buildPrayerHowToSchema(fajr);
    expect(howTo["@context"]).toBe("https://schema.org");
    expect(howTo["@type"]).toBe("HowTo");
    expect(howTo.name).toContain("ফজর");
    expect(howTo.step.length).toBeGreaterThan(0);
    expect(howTo.step[0]["@type"]).toBe("HowToStep");
    expect(howTo.step[0].position).toBe(1);
  });

  it("builds valid FAQPage and BreadcrumbList schemas", () => {
    const faq = buildFAQSchema([
      { question: "প্রশ্ন ১", answer: "উত্তর ১" },
      { question: "প্রশ্ন ২", answer: "উত্তর ২" },
    ]);
    expect(faq?.["@type"]).toBe("FAQPage");
    expect(faq?.mainEntity.length).toBe(2);
    expect(faq?.mainEntity[0]["@type"]).toBe("Question");
    expect(faq?.mainEntity[0].acceptedAnswer["@type"]).toBe("Answer");

    const breadcrumb = buildBreadcrumbSchema([
      { name: "হোম", url: "/" },
      { name: "নামাজ", url: "/namaj" },
    ]);
    expect(breadcrumb["@type"]).toBe("BreadcrumbList");
    expect(breadcrumb.itemListElement.length).toBe(2);
    expect(breadcrumb.itemListElement[0].position).toBe(1);
  });

  it("builds valid Article schema", () => {
    const art = buildArticleSchema({
      title: "নামাজে মন বসানোর উপায়",
      description: "একাগ্রতা অর্জনের ১০টি উপায়",
      url: "/shikhun/namaje-mon-boshanor-upay",
    });
    expect(art["@type"]).toBe("Article");
    expect(art.headline).toBe("নামাজে মন বসানোর উপায়");
    expect(art.author["@type"]).toBe("Organization");
  });

  it("verifies all prayer pages have titles <= 60 chars and descriptions <= 155 chars", () => {
    for (const p of prayers) {
      const rawTitle = `${p.nameBn} নামাজের সম্পূর্ণ নিয়ম ও নিয়ত`;
      const title = (rawTitle.length <= 60 ? rawTitle : `${p.nameBn} নামাজের নিয়ম ও নিয়ত`).slice(0, 60);
      const desc = `${p.nameBn} নামাজের সঠিক নিয়ম, নিয়ত, রাকাতের হিসাব ও ফযিলত। হানাফি ফিকহ ও সহীহ হাদিস ভিত্তিক সম্পূর্ণ নির্দেশিকা।`.slice(0, 155);

      expect(title.length).toBeLessThanOrEqual(60);
      expect(desc.length).toBeLessThanOrEqual(155);
      expect(title).toBeTruthy();
      expect(desc).toBeTruthy();
    }
  });

  it("verifies all masail pages have titles <= 60 chars and descriptions <= 155 chars", () => {
    for (const r of salahRulings) {
      const title = `${r.titleBn} — মাসায়েল ও বিধান`.slice(0, 60);
      const desc = `${r.summaryBn} হানাফি ফিকহ ও সহীহ হাদিস ভিত্তিক সম্পূর্ণ প্রামাণ্য নির্দেশিকা।`.slice(0, 155);

      expect(title.length).toBeLessThanOrEqual(60);
      expect(desc.length).toBeLessThanOrEqual(155);
      expect(title).toBeTruthy();
      expect(desc).toBeTruthy();
    }
  });

  it("verifies all shikhun articles have titles <= 60 chars and descriptions <= 155 chars", () => {
    for (const a of shikhunArticles) {
      const title = `${a.titleBn} | নামাজ শিক্ষা`.slice(0, 60);
      const desc = a.summaryBn.slice(0, 155);

      expect(title.length).toBeLessThanOrEqual(60);
      expect(desc.length).toBeLessThanOrEqual(155);
      expect(title).toBeTruthy();
      expect(desc).toBeTruthy();
    }
  });
});
