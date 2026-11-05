export interface SocialLink {
  platform: "github" | "twitter" | "facebook" | "mail" | "linkedin" | "youtube";
  url: string;
  label: string;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  description: string;
  url: string;
  ogImage: string;
  themeColor: string;
  developer: {
    name: string;
    url: string;
    role: string;
  };
  socials: Record<string, string>;
  navigation: {
    primary: { label: string; labelEn: string; href: string }[];
    bottomBar: { label: string; href: string; icon: string }[];
    footer: {
      title: string;
      links: { label: string; href: string; isExternal?: boolean }[];
    }[];
  };
}

export const siteConfig: SiteConfig = {
  name: "নামাজ শিক্ষা",
  shortName: "Namaj Shikkha",
  description:
    "সহীহ কুরআন ও হাদিসের আলোকে সঠিকভাবে নামাজ শিখুন। আরবি, বাংলা উচ্চারণ, ব্যাংলিশ ও বাংলা অর্থসহ সম্পূর্ণ নামাজ সহায়িকা।",
  url: "https://namajshikkha.tashanto.com",
  ogImage: "/og-image.png",
  themeColor: "#059669",
  developer: {
    name: "TA Shanto",
    url: "https://tashanto.com",
    role: "Full-Stack Engineer & Product Designer",
  },
  socials: {
    github: "https://github.com/ta-shanto/namajshikkha",
    mail: "mailto:contact@tashanto.com",
    twitter: "",
    facebook: "",
    linkedin: "https://linkedin.com/in/ta-shanto",
    youtube: "",
  },
  navigation: {
    primary: [
      { label: "হোম", labelEn: "Home", href: "/" },
      { label: "নামাজের নিয়ম", labelEn: "Namaj Rules", href: "/namaj-rules" },
      { label: "নামাজের বিবরণ", labelEn: "Prayer Details", href: "/namaj-details" },
      { label: "সিমুলেটর", labelEn: "Simulator", href: "/simulator" },
      { label: "সূরা ও দোয়া", labelEn: "Surah & Dua", href: "/surah-dua" },
      { label: "কুরআন", labelEn: "Quran", href: "/quran" },
      { label: "মাসায়েল", labelEn: "Masail", href: "/masail" },
      { label: "ইতিহাস", labelEn: "History", href: "/islamic-history" },
      { label: "হাদিস ও FAQ", labelEn: "Hadith & FAQ", href: "/hadith-faq" },
    ],
    bottomBar: [
      { label: "হোম", href: "/", icon: "home" },
      { label: "নামাজ", href: "/namaj-rules", icon: "book" },
      { label: "সিমুলেটর", href: "/simulator", icon: "play" },
      { label: "সময়", href: "/prayer-times", icon: "clock" },
      { label: "আরো", href: "/more", icon: "grid" },
    ],
    footer: [
      {
        title: "নামাজ শিক্ষা",
        links: [
          { label: "নামাজের নিয়ম", href: "/namaj-rules" },
          { label: "নামাজের বিবরণ", href: "/namaj-details" },
          { label: "সূরা ও দোয়া", href: "/surah-dua" },
          { label: "কুরআন মাজীদ", href: "/quran" },
        ],
      },
      {
        title: "রিসোর্স ও মাসায়েল",
        links: [
          { label: "নামাজের সময়", href: "/prayer-times" },
          { label: "সহীহ হাদিস", href: "/hadith-faq" },
          { label: "সচরাচর প্রশ্ন", href: "/hadith-faq" },
          { label: "ইসলামিক ইতিহাস", href: "/islamic-history" },
        ],
      },
    ],
  },
};

