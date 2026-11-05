import {
  DayPrayerLog,
  FardPrayerKey,
  PrayerStreakStats,
  QazaRecord,
  TrackerBackupData,
} from "./types";

const DB_NAME = "namajshikkha_tracker_db";
const DB_VERSION = 1;
const STORE_LOGS = "daily_logs";
const STORE_META = "tracker_meta";

const LOCAL_STORAGE_LOGS_KEY = "namajshikkha_tracker_logs_backup";
const LOCAL_STORAGE_QAZA_KEY = "namajshikkha_tracker_qaza_backup";

const memoryFallbackLogs: Map<string, DayPrayerLog> = new Map();
let memoryFallbackQaza: QazaRecord = createDefaultQazaRecord();

export function createDefaultDayLog(dateStr: string): DayPrayerLog {
  return {
    date: dateStr,
    prayers: {
      fajr: "pending",
      dhuhr: "pending",
      asr: "pending",
      maghrib: "pending",
      isha: "pending",
      witr: "pending",
    },
    sunnahs: {},
    updatedAt: Date.now(),
  };
}

export function createDefaultQazaRecord(): QazaRecord {
  return {
    fajr: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0,
    witr: 0,
    initialCounts: {
      fajr: 0,
      dhuhr: 0,
      asr: 0,
      maghrib: 0,
      isha: 0,
      witr: 0,
    },
    updatedAt: Date.now(),
  };
}

/**
 * Open IndexedDB connection safely with version management.
 */
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject(new Error("IndexedDB not supported in current environment"));
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_LOGS)) {
        db.createObjectStore(STORE_LOGS, { keyPath: "date" });
      }
      if (!db.objectStoreNames.contains(STORE_META)) {
        db.createObjectStore(STORE_META, { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Retrieve a single DayPrayerLog by YYYY-MM-DD
 */
export async function getDayLog(dateStr: string): Promise<DayPrayerLog | null> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_LOGS, "readonly");
      const store = tx.objectStore(STORE_LOGS);
      const req = store.get(dateStr);
      req.onsuccess = () => resolve((req.result as DayPrayerLog) || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    // Fallback to localStorage
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem(LOCAL_STORAGE_LOGS_KEY);
        if (raw) {
          const map = JSON.parse(raw) as Record<string, DayPrayerLog>;
          if (map[dateStr]) return map[dateStr];
        }
      }
    } catch {
      // Ignore
    }
    return memoryFallbackLogs.get(dateStr) || null;
  }
}

/**
 * Save or update a DayPrayerLog
 */
export async function saveDayLog(log: DayPrayerLog): Promise<void> {
  log.updatedAt = Date.now();

  // Always mirror in localStorage for emergency fallback
  try {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(LOCAL_STORAGE_LOGS_KEY) || "{}";
      const map = JSON.parse(raw) as Record<string, DayPrayerLog>;
      map[log.date] = log;
      localStorage.setItem(LOCAL_STORAGE_LOGS_KEY, JSON.stringify(map));
    }
  } catch {
    // Ignore storage quota
  }
  memoryFallbackLogs.set(log.date, log);

  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_LOGS, "readwrite");
      const store = tx.objectStore(STORE_LOGS);
      const req = store.put(log);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Already in memory / localStorage fallback
  }
}

/**
 * Retrieve all logged days
 */
export async function getAllLogs(): Promise<DayPrayerLog[]> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_LOGS, "readonly");
      const store = tx.objectStore(STORE_LOGS);
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result as DayPrayerLog[]) || []);
      req.onerror = () => resolve([]);
    });
  } catch {
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem(LOCAL_STORAGE_LOGS_KEY);
        if (raw) {
          const map = JSON.parse(raw) as Record<string, DayPrayerLog>;
          return Object.values(map);
        }
      }
    } catch {
      // Ignore
    }
    return Array.from(memoryFallbackLogs.values());
  }
}

/**
 * Retrieve logs for a specific calendar month (0-indexed month)
 */
export async function getLogsForMonth(
  year: number,
  month: number
): Promise<Record<string, DayPrayerLog>> {
  const all = await getAllLogs();
  const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  const map: Record<string, DayPrayerLog> = {};

  for (const log of all) {
    if (log.date.startsWith(prefix)) {
      map[log.date] = log;
    }
  }

  return map;
}

/**
 * Get Qaza prayers record
 */
export async function getQazaRecord(): Promise<QazaRecord> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_META, "readonly");
      const store = tx.objectStore(STORE_META);
      const req = store.get("qaza_record");
      req.onsuccess = () => {
        if (req.result && req.result.data) {
          resolve(req.result.data as QazaRecord);
        } else {
          resolve(createDefaultQazaRecord());
        }
      };
      req.onerror = () => resolve(createDefaultQazaRecord());
    });
  } catch {
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem(LOCAL_STORAGE_QAZA_KEY);
        if (raw) return JSON.parse(raw) as QazaRecord;
      }
    } catch {
      // Ignore
    }
    return memoryFallbackQaza;
  }
}

/**
 * Save Qaza record
 */
export async function saveQazaRecord(record: QazaRecord): Promise<void> {
  record.updatedAt = Date.now();
  memoryFallbackQaza = record;

  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_QAZA_KEY, JSON.stringify(record));
    }
  } catch {
    // Ignore quota
  }

  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_META, "readwrite");
      const store = tx.objectStore(STORE_META);
      const req = store.put({ key: "qaza_record", data: record });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Already in memory / localStorage fallback
  }
}

/**
 * Computes streaks and weekly adherence summary
 */
export function calculateStreakStats(logs: DayPrayerLog[]): PrayerStreakStats {
  if (!logs.length) {
    return {
      currentStreak: 0,
      bestStreak: 0,
      thisWeekCompleted: 0,
      thisWeekTotal: 35,
      thisWeekPercent: 0,
      totalTrackedDays: 0,
    };
  }

  // Map by date string
  const logMap = new Map<string, DayPrayerLog>();
  for (const l of logs) {
    logMap.set(l.date, l);
  }

  // Count active prayers for today/yesterday backwards to find streak
  const now = new Date();
  let currentStreak = 0;
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Check today or yesterday
  const toKey = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const todayKey = toKey(cursor);
  const todayLog = logMap.get(todayKey);

  // If today has completed prayers, start streak from today; otherwise start from yesterday
  const hasCompletedToday = todayLog && isDayActive(todayLog);
  if (!hasCompletedToday) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (true) {
    const key = toKey(cursor);
    const l = logMap.get(key);
    if (l && isDayActive(l)) {
      currentStreak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  // Calculate Best Streak across sorted dates
  const sortedDates = Array.from(logMap.keys()).sort();
  let bestStreak = 0;
  let tempStreak = 0;
  let prevDate: Date | null = null;

  for (const dateStr of sortedDates) {
    const l = logMap.get(dateStr)!;
    if (isDayActive(l)) {
      const cur = new Date(dateStr);
      if (prevDate) {
        const diffDays = Math.round(
          (cur.getTime() - prevDate.getTime()) / 86400000
        );
        if (diffDays === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }
      prevDate = cur;
      if (tempStreak > bestStreak) bestStreak = tempStreak;
    }
  }

  // Weekly stats (last 7 days: 5 fard prayers per day = 35 total)
  let thisWeekCompleted = 0;
  const fardKeys: FardPrayerKey[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

  for (let i = 0; i < 7; i++) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const key = toKey(d);
    const l = logMap.get(key);
    if (l) {
      for (const pk of fardKeys) {
        if (l.prayers[pk] === "completed" || l.prayers[pk] === "jamaat") {
          thisWeekCompleted++;
        }
      }
    }
  }

  const thisWeekTotal = 35;
  const thisWeekPercent = Math.round((thisWeekCompleted / thisWeekTotal) * 100);

  return {
    currentStreak,
    bestStreak: Math.max(bestStreak, currentStreak),
    thisWeekCompleted,
    thisWeekTotal,
    thisWeekPercent,
    totalTrackedDays: logMap.size,
  };
}

function isDayActive(log: DayPrayerLog): boolean {
  // A day is active for streak if at least 1 fard was completed/jamaat
  return Object.values(log.prayers).some(
    (st) => st === "completed" || st === "jamaat"
  );
}

/**
 * Export complete backup object as JSON
 */
export async function exportTrackerBackup(): Promise<TrackerBackupData> {
  const logs = await getAllLogs();
  const qaza = await getQazaRecord();

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    source: "namajshikkha-prayer-tracker",
    logs,
    qaza,
  };
}

/**
 * Import and restore tracker backup
 */
export async function importTrackerBackup(
  backup: TrackerBackupData
): Promise<void> {
  if (!backup || !Array.isArray(backup.logs)) {
    throw new Error("অবৈধ ব্যাকআপ ফাইল ফরম্যাট");
  }

  // Save logs
  for (const log of backup.logs) {
    if (log && log.date && log.prayers) {
      await saveDayLog(log);
    }
  }

  // Save Qaza
  if (backup.qaza) {
    await saveQazaRecord(backup.qaza);
  }
}

/**
 * Clear all user tracker data
 */
export async function clearAllTrackerData(): Promise<void> {
  memoryFallbackLogs.clear();
  memoryFallbackQaza = createDefaultQazaRecord();

  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_LOGS_KEY);
      localStorage.removeItem(LOCAL_STORAGE_QAZA_KEY);
    }
  } catch {
    // Ignore
  }

  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([STORE_LOGS, STORE_META], "readwrite");
      tx.objectStore(STORE_LOGS).clear();
      tx.objectStore(STORE_META).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Ignore
  }
}

/**
 * Check if the user has started using the tracker
 */
export async function hasStartedTracking(): Promise<boolean> {
  const logs = await getAllLogs();
  if (logs.some((l) => isDayActive(l))) return true;
  const qaza = await getQazaRecord();
  return (
    qaza.fajr > 0 ||
    qaza.dhuhr > 0 ||
    qaza.asr > 0 ||
    qaza.maghrib > 0 ||
    qaza.isha > 0 ||
    qaza.witr > 0
  );
}
