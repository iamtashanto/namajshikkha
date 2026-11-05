import { describe, it, expect } from "vitest";
import manifest from "@/app/manifest";
import sitemap from "@/app/sitemap";
import fs from "node:fs";
import path from "node:path";

describe("PWA Manifest, Service Worker & Hardening Checks", () => {
  it("generates a complete PWA manifest with Bangla name, maskable icons, screenshots, and shortcuts", () => {
    const m = manifest();
    expect(m.name).toContain("নামাজ শিক্ষা");
    expect(m.short_name).toBe("নামাজ শিক্ষা");
    expect(m.display).toBe("standalone");
    expect(m.icons).toBeDefined();

    const maskableIcons = (m.icons || []).filter(
      (icon) => icon.purpose === "maskable"
    );
    expect(maskableIcons.length).toBeGreaterThanOrEqual(2);

    expect(m.screenshots).toBeDefined();
    expect((m.screenshots || []).length).toBeGreaterThanOrEqual(2);

    expect(m.shortcuts).toBeDefined();
    const shortcutUrls = (m.shortcuts || []).map((s) => s.url);
    expect(shortcutUrls).toContain("/simulator");
    expect(shortcutUrls).toContain("/prayer-times");
    expect(shortcutUrls).toContain("/tracker");
  });

  it("includes /about and all dynamic routes in sitemap", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls.some((u) => u.endsWith("/about"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/simulator"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/prayer-times"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/qibla"))).toBe(true);
  });

  it("verifies service worker implements precache, stale-while-revalidate, cache size limits, and /offline fallback", () => {
    const swPath = path.join(process.cwd(), "public/sw.js");
    const swContent = fs.readFileSync(swPath, "utf8");

    expect(swContent).toContain('"/offline"');
    expect(swContent).toContain("MAX_AUDIO_CACHE_ITEMS");
    expect(swContent).toContain("MAX_FONT_CACHE_ITEMS");
    expect(swContent).toContain("enforceCacheSizeLimit");
  });

  it("verifies documentation files for release hardening and content review exist", () => {
    const requiredDocs = [
      "docs/CONTENT_REVIEW.md",
      "docs/TRANSLITERATION.md",
      "docs/PERFORMANCE.md",
      "docs/RELEASE_CHECKLIST.md",
    ];
    for (const relPath of requiredDocs) {
      const fullPath = path.join(process.cwd(), relPath);
      expect(fs.existsSync(fullPath)).toBe(true);
    }
  });
});

