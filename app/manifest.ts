import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "নামাজ শিক্ষা — Namaj Shikkha",
    short_name: "নামাজ শিক্ষা",
    description:
      "সহীহ কুরআন, হাদিস ও হানাফি ফিকহ অনুযায়ী ধাপে ধাপে নামাজ, পবিত্রতা, সূরা, দোয়া, সিমুলেটর ও নামাজের সময়সূচী।",
    lang: "bn-BD",
    dir: "ltr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#ffffff",
    theme_color: "#059669",
    categories: ["education", "lifestyle", "books"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    screenshots: [
      {
        src: "/og-image.png",
        sizes: "1200x630",
        type: "image/png",
        form_factor: "wide",
        label: "নামাজ শিক্ষা — ইন্টারঅ্যাক্টিভ নামাজ সিমুলেটর ও গাইড",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        form_factor: "narrow",
        label: "নামাজ শিক্ষা মোবাইল অ্যাপ ভিউ",
      },
    ],
    shortcuts: [
      {
        name: "নামাজ সিমুলেটর",
        short_name: "সিমুলেটর",
        description: "ধাপে ধাপে অ্যানিমেটেড নামাজ প্রশিক্ষণ",
        url: "/simulator",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "নামাজের সময়সূচী",
        short_name: "সময়সূচী",
        description: "আজকের ৫ ওয়াক্ত নামাজ ও নিষিদ্ধ সময়",
        url: "/prayer-times",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "নামাজ ট্র্যাকার",
        short_name: "ট্র্যাকার",
        description: "দৈনিক সালাত চেকলিস্ট ও কাযা হিসাব",
        url: "/tracker",
        icons: [{ src: "/icon-192.png", sizes: "192x192", type: "image/png" }],
      },
    ],
  };
}
