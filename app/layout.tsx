import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
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
    <html lang="bn" className={inter.variable}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen flex-col bg-white antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
