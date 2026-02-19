import { MetadataRoute } from 'next';
import historyData from "@/data/islamic-history.json";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://namajshikkha.vercel.app'; // Replace with actual domain if known

    // Static routes
    const routes = [
        '',
        '/namaj-rules',
        '/namaj-details',
        '/quran',
        '/islamic-history',
        '/surah-dua',
        '/hadith-faq',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic History routes
    const historyRoutes: MetadataRoute.Sitemap = [];

    historyData.forEach((era) => {
        era.events.forEach((event: any) => {
            if (event.slug) {
                historyRoutes.push({
                    url: `${baseUrl}/islamic-history/${era.id}/${event.slug}`,
                    lastModified: new Date(),
                    changeFrequency: 'yearly' as const,
                    priority: 0.6,
                });
            }
        });
    });

    return [...routes, ...historyRoutes];
}
