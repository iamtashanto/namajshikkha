export interface MotivationalQuote {
  id: string;
  messageBn: string;
  hadithTextBn: string;
  sourceBn: string;
  referenceNumber: string;
}

export const MOTIVATIONAL_HADITHS: MotivationalQuote[] = [
  {
    id: "hadith-timely-salah",
    messageBn:
      "প্রতিটি ওয়াক্তের নামাজ আপনার অন্তরে প্রশান্তি বয়ে আনুক। একটু একটু করে ধারাবাহিকতা ধরে রাখাই সফলতার চাবিকাঠি।",
    hadithTextBn:
      "রাসূলুল্লাহ সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম-কে জিজ্ঞাসা করা হলো, কোন আমল আল্লাহর কাছে সবচেয়ে প্রিয়? তিনি বললেন: 'সময়মতো নামাজ আদায় করা' এবং পিতা-মাতার সাথে সদ্ব্যবহার করা।",
    sourceBn: "সহীহ বুখারী",
    referenceNumber: "৫২৭",
  },
  {
    id: "hadith-promise-paradise",
    messageBn:
      "আল্লাহর রহমত সর্বদা আপনার সাথে রয়েছে। নিষ্ঠার সাথে আপনার সালাত আদায় চালিয়ে যান।",
    hadithTextBn:
      "যে ব্যক্তি উত্তমরূপে অজু করে এবং যথাসময়ে রুকু-সিজদা পূর্ণ করে পাঁচ ওয়াক্ত নামাজ আদায় করে, আল্লাহর পক্ষ থেকে তার জন্য জান্নাতের ওয়াদা বা প্রতিশ্রুতি রয়েছে।",
    sourceBn: "সুনান আবি দাউদ",
    referenceNumber: "৪২৫",
  },
  {
    id: "hadith-light-and-salvation",
    messageBn:
      "আপনার নামাজ কিয়ামতের কঠিন দিনে আপনার পথের আলো এবং মুক্তিদায়ক সনদ হবে।",
    hadithTextBn:
      "যে ব্যক্তি নামাজের পূর্ণ যত্ন নেবে ও হেফাজত করবে, কিয়ামতের দিন এই নামাজ তার জন্য নূর (আলো), দলিল এবং মুক্তির কারণ হবে।",
    sourceBn: "মুসনাদে আহমাদ",
    referenceNumber: "৬৫৭৬",
  },
  {
    id: "hadith-sins-forgiven",
    messageBn:
      "ভুলত্রুটি হতেই পারে, কিন্তু ফিরে আসাই মুমিনের সৌন্দর্য। নামাজ অতীতের পাপ মোচন করে নতুন শক্তি যোগায়।",
    hadithTextBn:
      "পাঁচ ওয়াক্ত নামাজ এবং এক জুমা থেকে অপর জুমা মধ্যবর্তী সময়ের সগিরা গুনাহসমূহের কাফফারা বা মোচনকারী, যতক্ষণ পর্যন্ত না কবিরা গুনাহে লিপ্ত হওয়া হয়।",
    sourceBn: "সহীহ মুসলিম",
    referenceNumber: "২৩৩",
  },
  {
    id: "hadith-qaza-mercy",
    messageBn:
      "যদি কোনো ওয়াক্তের নামাজ কাজা হয়েও গিয়ে থাকে, তবে হতাশ হবেন না। স্মরণ হওয়া মাত্রই আদায় করে নিন, আল্লাহ পরম দয়ালু।",
    hadithTextBn:
      "যে ব্যক্তি নামাজ পড়তে ভুলে যায় কিংবা ঘুমের কারণে সময় চলে যায়, তার কাফফারা হলো যখনই মনে পড়বে তখনই নামাজটি আদায় করে নেওয়া।",
    sourceBn: "সহীহ বুখারী ও সহীহ মুসলিম",
    referenceNumber: "বুখারী ৫৯৭, মুসলিম ৬৮৪",
  },
  {
    id: "hadith-jamaat-reward",
    messageBn:
      "সম্ভব হলে মসজিদে জামাতে সালাত আদায়ের চেষ্টা করুন। এতে রয়েছে বহুগুণ মর্যাদা ও বরকত।",
    hadithTextBn:
      "জামাতে সালাত আদায় করার সওয়াব একাকী সালাত আদায় করার চেয়ে সাতাশ গুণ (২৭ গুণ) বেশি।",
    sourceBn: "সহীহ বুখারী",
    referenceNumber: "৬৪৫",
  },
  {
    id: "hadith-peace-in-salah",
    messageBn:
      "জীবনের সমস্ত ব্যস্ততা ও উদ্বেগের মাঝে নামাজই আমাদের আত্মিক প্রশান্তির সুশীতল আশ্রয়।",
    hadithTextBn:
      "রাসূলুল্লাহ সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম যখন কোনো বিষয়ে কঠিন পেরেশানি বা দুশ্চিন্তায় পড়তেন, তখন তিনি নামাজে দাঁড়িয়ে যেতেন।",
    sourceBn: "সুনান আবি দাউদ",
    referenceNumber: "১৩১৯",
  },
];

export function getRandomMotivationalQuote(daySeed?: string): MotivationalQuote {
  if (!daySeed) {
    const idx = Math.floor(Math.random() * MOTIVATIONAL_HADITHS.length);
    return MOTIVATIONAL_HADITHS[idx];
  }
  // Deterministic quote based on date string YYYY-MM-DD
  let hash = 0;
  for (let i = 0; i < daySeed.length; i++) {
    hash = (hash << 5) - hash + daySeed.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % MOTIVATIONAL_HADITHS.length;
  return MOTIVATIONAL_HADITHS[idx];
}

