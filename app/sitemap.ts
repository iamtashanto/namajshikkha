import { MetadataRoute } from 'next';
import historyData from "@/data/islamic-history.json";
import { siteConfig } from "@/src/config/site";
import { prayers } from "@/src/data/prayers";
import { salahRulings } from "@/src/data/rulings";
import { taharatSections } from "@/src/data/taharat";

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = siteConfig.url;

    // Static routes
    const routes = [
        '',
        '/namaj',
        '/namaj-rules',
        '/namaj-details',
        '/simulator',
        '/prayer-times',
        '/surah-dua',
        '/quran',
        '/masail',
        '/islamic-history',
        '/hadith-faq',
        '/taharat',
        '/more',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic Prayer routes
    const prayerRoutes: MetadataRoute.Sitemap = prayers.map((p) => ({
        url: `${baseUrl}/namaj/${p.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: p.category === 'fard' ? 0.9 : 0.8,
    }));

    // Dynamic Masail routes
    const masailRoutes: MetadataRoute.Sitemap = salahRulings.map((r) => ({
        url: `${baseUrl}/masail/${r.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: r.status === 'fard' || r.status === 'wajib' ? 0.85 : 0.75,
    }));

    // Dynamic Taharat routes
    const taharatRoutes: MetadataRoute.Sitemap = taharatSections.map((s) => ({
        url: `${baseUrl}/taharat/${s.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: s.slug === 'wudu' || s.slug === 'ghusl' ? 0.9 : 0.85,
    }));

    // Dynamic History routes
    const historyRoutes: MetadataRoute.Sitemap = [];

    historyData.forEach((era) => {
        era.events.forEach((event) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const slug = (event as any).slug;
            if (slug) {
                historyRoutes.push({
                    url: `${baseUrl}/islamic-history/${era.id}/${slug}`,
                    lastModified: new Date(),
                    changeFrequency: 'yearly' as const,
                    priority: 0.6,
                });
            }
        });
    });

    return [...routes, ...prayerRoutes, ...masailRoutes, ...taharatRoutes, ...historyRoutes];
}
