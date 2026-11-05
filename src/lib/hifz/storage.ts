import { HifzHideMode, HifzRecord, SPACED_REPETITION_INTERVALS } from "./types";
export { SPACED_REPETITION_INTERVALS } from "./types";

const DB_NAME = "namajshikkha_hifz_db";
const DB_VERSION = 1;
const STORE_HIFZ = "hifz_records";
const LOCAL_STORAGE_KEY = "namajshikkha_hifz_records_backup";

const memoryHifzMap: Map<string, HifzRecord> = new Map();

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject(new Error("IndexedDB not available"));
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_HIFZ)) {
        db.createObjectStore(STORE_HIFZ, { keyPath: "surahId" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getTodayKey(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function addDaysToDateKey(days: number): string {
  const target = new Date(Date.now() + days * 86400000);
  const yyyy = target.getFullYear();
  const mm = String(target.getMonth() + 1).padStart(2, "0");
  const dd = String(target.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export async function getHifzRecord(surahId: string): Promise<HifzRecord | null> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_HIFZ, "readonly");
      const store = tx.objectStore(STORE_HIFZ);
      const req = store.get(surahId);
      req.onsuccess = () => resolve((req.result as HifzRecord) || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (raw) {
          const map = JSON.parse(raw) as Record<string, HifzRecord>;
          if (map[surahId]) return map[surahId];
        }
      }
    } catch {
      // Ignore
    }
    return memoryHifzMap.get(surahId) || null;
  }
}

export async function saveHifzRecord(record: HifzRecord): Promise<void> {
  memoryHifzMap.set(record.surahId, record);

  try {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY) || "{}";
      const map = JSON.parse(raw) as Record<string, HifzRecord>;
      map[record.surahId] = record;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(map));
    }
  } catch {
    // Ignore
  }

  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_HIFZ, "readwrite");
      const store = tx.objectStore(STORE_HIFZ);
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Fallback in memory & localStorage
  }
}

export async function getAllHifzRecords(): Promise<Record<string, HifzRecord>> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_HIFZ, "readonly");
      const store = tx.objectStore(STORE_HIFZ);
      const req = store.getAll();
      req.onsuccess = () => {
        const list = (req.result as HifzRecord[]) || [];
        const map: Record<string, HifzRecord> = {};
        for (const r of list) map[r.surahId] = r;
        resolve(map);
      };
      req.onerror = () => resolve({});
    });
  } catch {
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (raw) return JSON.parse(raw) as Record<string, HifzRecord>;
      }
    } catch {
      // Ignore
    }
    const map: Record<string, HifzRecord> = {};
    memoryHifzMap.forEach((v, k) => {
      map[k] = v;
    });
    return map;
  }
}

/**
 * Pure SRS calculation function for next review stage and date
 */
export function calculateNextHifzRecord(
  existing: HifzRecord | null,
  surahId: string,
  passed: boolean,
  baseDate = new Date()
): HifzRecord {
  const currentStage = existing ? existing.stage : 0;
  const currentStreak = existing ? existing.successStreak : 0;
  const currentReviews = existing ? existing.totalReviews : 0;

  let newStage: number;
  let newStreak: number;

  if (passed) {
    newStreak = currentStreak + 1;
    newStage = Math.min(SPACED_REPETITION_INTERVALS.length, currentStage + 1);
  } else {
    newStreak = 0;
    newStage = 1; // Reset to 1 day review
  }

  const intervalDays =
    newStage <= SPACED_REPETITION_INTERVALS.length && newStage > 0
      ? SPACED_REPETITION_INTERVALS[newStage - 1]
      : 1;

  const isMastered = newStage >= SPACED_REPETITION_INTERVALS.length;
  const targetDate = new Date(baseDate.getTime() + intervalDays * 24 * 60 * 60 * 1000);
  const nextReviewDate = targetDate.toISOString().split("T")[0];

  return {
    surahId,
    stage: newStage,
    intervalDays,
    lastReviewedAt: baseDate.getTime(),
    nextReviewDate,
    isMastered,
    successStreak: newStreak,
    totalReviews: currentReviews + 1,
  };
}

/**
 * Record a practice attempt using Spaced Repetition (SRS):
 * If passed: stage increases (1 -> 3 -> 7 -> 14 -> 30 days -> mastered).
 * If failed: stage resets to 1 day.
 */
export async function recordHifzAttempt(
  surahId: string,
  passed: boolean,
  baseDate = new Date()
): Promise<HifzRecord> {
  const existing = await getHifzRecord(surahId);
  const updated = calculateNextHifzRecord(existing, surahId, passed, baseDate);
  await saveHifzRecord(updated);
  return updated;
}

/**
 * Returns Surah IDs that are currently due for spaced-repetition review
 */
export async function getDueSurahIds(): Promise<string[]> {
  const all = await getAllHifzRecords();
  const today = getTodayKey();
  const dueIds: string[] = [];

  for (const r of Object.values(all)) {
    if (r.nextReviewDate <= today && r.stage > 0) {
      dueIds.push(r.surahId);
    }
  }

  return dueIds;
}

/**
 * Returns Surah IDs memorized / practiced by user to prioritize in simulator
 */
export async function getMasteredSurahIds(): Promise<string[]> {
  const all = await getAllHifzRecords();
  return Object.values(all)
    .filter((r) => r.isMastered || r.stage >= 2)
    .sort((a, b) => b.stage - a.stage)
    .map((r) => r.surahId);
}

export interface MaskedWord {
  word: string;
  isHidden: boolean;
  wordIndex: number;
}

/**
 * Breaks down an Arabic ayah into interactive words according to HifzHideMode.
 */
export function getMaskedWords(
  arabicAyah: string,
  mode: HifzHideMode,
  revealedIndices: Set<number> = new Set()
): MaskedWord[] {
  const rawWords = arabicAyah.trim().split(/\s+/);

  return rawWords.map((word, wordIndex) => {
    if (revealedIndices.has(wordIndex) || mode === "normal") {
      return { word, isHidden: false, wordIndex };
    }

    if (mode === "hide-every-other-word") {
      // Hide odd indices (1, 3, 5...)
      const shouldHide = wordIndex % 2 === 1;
      return {
        word: shouldHide ? "•••••" : word,
        isHidden: shouldHide,
        wordIndex,
      };
    }

    if (mode === "first-letters") {
      // Show first 1-2 Arabic chars and mask the rest
      const firstChar = Array.from(word).slice(0, 2).join("");
      return {
        word: `${firstChar}ـ...`,
        isHidden: true,
        wordIndex,
      };
    }

    if (mode === "fully-hidden" || mode === "hide-arabic") {
      return {
        word: "••••••",
        isHidden: true,
        wordIndex,
      };
    }

    return { word, isHidden: false, wordIndex };
  });
}
