import type { Metadata } from "next";
import { Inter, Amiri, Noto_Sans_Bengali } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AudioProvider } from "@/components/AudioProvider";
import { GlobalAudioPlayer } from "@/components/GlobalAudioPlayer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-arabic",
  weight: ["400", "700"],
  subsets: ["arabic"],
  display: "swap",
});

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-bengali",
  weight: ["400", "500", "600", "700"],
  subsets: ["bengali"],
  display: "swap",
});

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={`${inter.variable} ${amiri.variable} ${notoSansBengali.variable}`} suppressHydrationWarning>
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
          <AudioProvider>
            <Navbar />
            <main className="flex-1 pb-32">{children}</main>
            <GlobalAudioPlayer />
            <Footer />
          </AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
