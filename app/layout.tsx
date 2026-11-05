import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PreferencesProvider } from "@/src/context/PreferencesContext";
import PreferencesModal from "@/src/components/PreferencesModal";
import Navbar from "@/components/Navbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import { AudioProvider } from "@/components/AudioProvider";
import { GlobalAudioPlayer } from "@/components/GlobalAudioPlayer";
import { MobileInstallPrompt } from "@/components/MobileInstallPrompt";
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
      path: "../public/fonts/hind-siliguri-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/hind-siliguri-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/hind-siliguri-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/hind-siliguri-700.woff2",
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
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "নামাজ শিক্ষা — Namaj Shikkha | সঠিক নামাজ শিখুন",
    template: "%s | নামাজ শিক্ষা",
  },
  description:
    "নামাজ শিক্ষা — সঠিকভাবে নামাজ পড়া শিখুন। সূরা, দোয়া, নিয়্যত, হাদিস সবকিছু আরবি, বাংলা উচ্চারণ, ব্যাংলিশ ও বাংলা অর্থসহ। Learn to pray correctly with Arabic text, Bangla pronunciation, Banglish, and Bangla meanings.",
  keywords: [
    "নামাজ শিক্ষা",
    "namaj shikkha",
    "salah learning",
    "prayer guide",
    "bangla namaj",
    "সূরা",
    "দোয়া",
    "হাদিস",
  ],
  authors: [{ name: "নামাজ শিক্ষা" }],
  openGraph: {
    title: "নামাজ শিক্ষা — Namaj Shikkha",
    description: "সঠিকভাবে নামাজ পড়া শিখুন। সূরা, দোয়া, নিয়্যত, হাদিস সবকিছু আরবি ও বাংলায়।",
    type: "website",
    locale: "bn_BD",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "নামাজ শিক্ষা",
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
        <ThemeProvider>
          <PreferencesProvider>
            <AudioProvider>
              <Navbar />
              <main className="flex-1 pb-24 md:pb-16">{children}</main>
              <GlobalAudioPlayer />
              <MobileInstallPrompt />
              <MobileBottomNav />
              <PreferencesModal />
              <Footer />
            </AudioProvider>
          </PreferencesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
