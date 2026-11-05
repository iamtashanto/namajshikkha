/**
 * Comprehensive Synonyms & Phonetic Mappings for Site Search.
 * Handles Bangla, Banglish (phonetic phonetic romanization), and English queries.
 */
export const SEARCH_SYNONYMS: Record<string, string[]> = {
  // Janaza / Funeral
  janaza: ["জানাজা", "জানাযা", "funeral", "দাফন", "কাফন", "ময়্যিত", "লাশ", "কবর"],
  "funeral prayer": ["জানাজা", "janaza", "নামাজে জানাজা"],
  জানাজা: ["janaza", "janazah", "janaja", "funeral", "দাফন", "ময়্যিত"],

  // Fajr
  fajr: ["ফজর", "fojor", "ভোর", "সকাল", "সুবহে সাদিক"],
  fojor: ["ফজর", "fajr"],
  ফজর: ["fajr", "fojor", "ভোর", "সকাল"],

  // Dhuhr / Zuhr
  dhuhr: ["যোহর", "জোহর", "zuhr", "johor", "দুপুর", "মধ্যাহ্ন"],
  zuhr: ["যোহর", "জোহর", "dhuhr", "johor"],
  johor: ["যোহর", "জোহর", "dhuhr"],
  যোহর: ["dhuhr", "zuhr", "johor", "জোহর", "দুপুর"],

  // Asr
  asr: ["আসর", "ashor", "asor", "বিকাল", "অপরাহ্ন"],
  ashor: ["আসর", "asr"],
  আসর: ["asr", "ashor", "বিকাল"],

  // Maghrib
  maghrib: ["মাগরিব", "magrib", "সন্ধ্যা", "সূর্যাস্ত", "ইফতার"],
  magrib: ["মাগরিব", "maghrib", "সন্ধ্যা"],
  মাগরিব: ["maghrib", "magrib", "সন্ধ্যা", "ইফতার"],

  // Isha
  isha: ["এশা", "ইশা", "esha", "রাত"],
  esha: ["এশা", "ইশা", "isha"],
  এশা: ["isha", "esha", "রাত"],

  // Witr
  witr: ["বিতর", "bitor", "betor", "বেতের", "ওয়াজিব"],
  bitor: ["বিতর", "witr", "বেতের"],
  বিতর: ["witr", "bitor", "বেতের", "দোয়া কুনুত"],

  // Tahajjud
  tahajjud: ["তাহাজ্জুদ", "tahajjut", "night prayer", "কিয়ামুল লাইল", "নফল"],
  "night prayer": ["তাহাজ্জুদ", "tahajjud", "কিয়ামুল লাইল"],
  তাহাজ্জুদ: ["tahajjud", "tahajjut", "night prayer", "কিয়ামুল লাইল"],

  // Jumuah / Friday
  jumuah: ["জুমা", "জুমুআ", "jumma", "juma", "শুক্রবার"],
  jumma: ["জুমা", "jumuah", "শুক্রবার"],
  জুমা: ["jumuah", "jumma", "juma", "জুমুআ", "শুক্রবার"],

  // Eid
  eid: ["ঈদ", "ঈদুল ফিতর", "ঈদুল আজহা", "eid-ul-fitr", "eid-ul-adha"],
  ঈদ: ["eid", "ঈদুল ফিতর", "ঈদুল আজহা"],

  // Tarawih
  tarawih: ["তারাবীহ", "তারাওয়ীহ", "tarabi", "রমজান"],
  তারাবীহ: ["tarawih", "tarabi", "রমজান"],

  // Sajda Sahu
  "sajda sahu": ["সেজদায়ে সাহু", "সিজদা সাহু", "sahu", "ভুল"],
  sahu: ["সেজদায়ে সাহু", "সিজদা সাহু", "sajda sahu"],
  "সেজদায়ে সাহু": ["sajda sahu", "সিজদা সাহু", "sahu"],

  // Wudu / Ablution
  wudu: ["অজু", "অযু", "উজু", "ablution", "তায়াম্মুম"],
  ablution: ["অজু", "অযু", "wudu"],
  oju: ["অজু", "অযু", "wudu"],
  অজু: ["wudu", "oju", "অযু", "উজু", "ablution"],
  অযু: ["wudu", "oju", "অজু"],

  // Ghusl / Bath
  ghusl: ["গোসল", "ফরজ গোসল", "gosol", "bath"],
  gosol: ["গোসল", "ghusl"],
  গোসল: ["ghusl", "gosol", "ফরজ গোসল"],

  // Tayammum
  tayammum: ["তায়াম্মুম", "তায়ামুম", "tayamum", "মাটি"],
  তায়াম্মুম: ["tayammum", "tayamum"],

  // Qaza / Missed
  qaza: ["কাযা", "ক্বাযা", "কাজা", "kaza", "missed prayer"],
  "missed prayer": ["কাযা", "qaza", "কাজা"],
  kaza: ["কাযা", "qaza", "কাজা"],
  কাযা: ["qaza", "kaza", "কাজা", "missed prayer"],

  // Ayatul Kursi
  "ayatul kursi": ["আয়াতুল কুরসী", "আয়াতুল কুরসি", "kursi", "কুরসী"],
  kursi: ["আয়াতুল কুরসী", "ayatul kursi", "কুরসী"],
  "আয়াতুল কুরসী": ["ayatul kursi", "kursi", "কুরসী"],

  // Fatiha
  fatiha: ["ফাতিহা", "ফাতেহা", "fateha", "আলহামদু"],
  ফাতিহা: ["fatiha", "fateha", "আলহামদু"],

  // Musafir / Kasr
  musafir: ["মুসাফির", "কসর", "kasr", "traveler"],
  কসর: ["kasr", "musafir", "মুসাফির"],

  // Qibla
  qibla: ["কিবলা", "কাবার দিক", "compass", "কাবা"],
  কিবলা: ["qibla", "compass", "কাবার দিক"],

  // Tracker
  tracker: ["ট্র্যাকার", "চেকলিস্ট", "নামাজ ট্র্যাকার"],
  ট্র্যাকার: ["tracker", "চেকলিস্ট"],
};

/**
 * Expands a search query by including all mapped synonyms
 */
export function expandQueryWithSynonyms(query: string): string[] {
  const q = query.trim().toLowerCase();
  const tokens = q.split(/\s+/).filter(Boolean);
  const terms = new Set<string>([q, ...tokens]);

  for (const [key, synList] of Object.entries(SEARCH_SYNONYMS)) {
    const k = key.toLowerCase();
    if (q === k || tokens.includes(k) || q.includes(k)) {
      terms.add(k);
      for (const s of synList) terms.add(s.toLowerCase());
    }
    for (const syn of synList) {
      const sLower = syn.toLowerCase();
      if (q === sLower || tokens.includes(sLower) || q.includes(sLower)) {
        terms.add(k);
        for (const item of synList) terms.add(item.toLowerCase());
      }
    }
  }

  return Array.from(terms);
}
