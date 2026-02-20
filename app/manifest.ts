import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'নামাজ শিক্ষা — Namaj Shikkha',
        short_name: 'নামাজ শিক্ষা',
        description: 'সঠিকভাবে নামাজ পড়া শিখুন। সূরা, দোয়া, নিয়্যত, হাদিস সবকিছু আরবি ও বাংলায়।',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#059669',
        icons: [
            {
                src: '/icon-192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
            {
                src: '/apple-icon.png',
                sizes: '180x180',
                type: 'image/png',
            },
        ],
    };
}
