import type { Metadata } from "next";
import localFont from "next/font/local";
import { siteConfig } from "@/src/config/site";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PreferencesProvider } from "@/src/context/PreferencesContext";
import { SearchProvider } from "@/src/context/SearchContext";
import PreferencesModal from "@/src/components/PreferencesModal";
import SearchModal from "@/src/components/search/SearchModal";
import Navbar from "@/components/Navbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import { AudioProvider } from "@/components/AudioProvider";
import { GlobalAudioPlayer } from "@/components/GlobalAudioPlayer";
import { MobileInstallPrompt } from "@/components/MobileInstallPrompt";
import { ContentDisclaimer } from "@/src/components/ui/ContentDisclaimer";
import "./globals.css";

const amiri = localFont({
  src: [
    {
      path: "../public/fonts/amiri-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/amiri-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-arabic",
  display: "swap",
});

const bengaliFont = localFont({
  src: [
    {
      path: "../public/fonts/noto-sans-bengali-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/noto-sans-bengali-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/noto-sans-bengali-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/noto-sans-bengali-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-bengali",
  display: "swap",
});

export const viewport = {
  themeColor: "#059669",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "নামাজ শিক্ষা — Namaj Shikkha | সঠিক নামাজ শিখুন",
    template: "%s | নামাজ শিক্ষা",
  },
  description:
    "সহীহ কুরআন ও হাদিসের আলোকে সঠিকভাবে নামাজ শিখুন। আরবি, বাংলা উচ্চারণ, ব্যাংলিশ ও বাংলা অর্থসহ সম্পূর্ণ নামাজ সহায়িকা।",
  keywords: [
    "নামাজ শিক্ষা",
    "namaj shikkha",
    "salah learning",
    "prayer guide",
    "bangla namaj",
    "সূরা",
    "দোয়া",
    "হাদিস",
    "নামাজের নিয়ম",
  ],
  authors: [{ name: "নামাজ শিক্ষা" }],
  alternates: {
    canonical: "./",
    languages: {
      "bn": "./",
    },
  },
  openGraph: {
    title: "নামাজ শিক্ষা — Namaj Shikkha",
    description: "সহীহ কুরআন ও হাদিসের আলোকে সঠিকভাবে নামাজ শিখুন। আরবি ও বাংলা অর্থসহ।",
    url: siteConfig.url,
    siteName: "নামাজ শিক্ষা",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "নামাজ শিক্ষা — Namaj Shikkha",
      },
    ],
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "নামাজ শিক্ষা — Namaj Shikkha",
    description: "সহীহ কুরআন ও হাদিসের আলোকে সঠিকভাবে নামাজ শিখুন। আরবি ও বাংলা অর্থসহ।",
    images: ["/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "নামাজ শিক্ষা",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={`${amiri.variable} ${bengaliFont.variable}`} suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('namaj-theme');
                if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-white antialiased dark:bg-dark-bg" suppressHydrationWarning>
        <a
          href="#main-content"
          className="bangla-text sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-xl focus:bg-emerald-700 focus:px-4 focus:py-2.5 focus:text-sm focus:font-bold focus:text-white focus:shadow-lg"
        >
          মূল তথ্যে যান
        </a>
        <ThemeProvider>
          <PreferencesProvider>
            <SearchProvider>
              <AudioProvider>
                <Navbar />
                <main id="main-content" className="flex-1 pb-24 md:pb-16">
                  {children}
                </main>
                <ContentDisclaimer />
                <GlobalAudioPlayer />
                <MobileInstallPrompt />
                <MobileBottomNav />
                <PreferencesModal />
                <SearchModal />
                <Footer />
              </AudioProvider>
            </SearchProvider>
          </PreferencesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
