/**
 * Namaj Simulator Engine — Pure TypeScript Types (Zero React Dependency)
 * Converts any SalahConfig into an ordered, deterministic Timeline of steps.
 */

export enum Posture {
  STANDING = "STANDING",
  TAKBIR_HANDS_RAISED = "TAKBIR_HANDS_RAISED",
  QIYAM_HANDS_FOLDED = "QIYAM_HANDS_FOLDED",
  RUKU = "RUKU",
  QAWMA = "QAWMA",
  SAJDA = "SAJDA",
  JALSA = "JALSA",
  QADA = "QADA",
  TASHAHHUD_FINGER_RAISED = "TASHAHHUD_FINGER_RAISED",
  SALAM_RIGHT = "SALAM_RIGHT",
  SALAM_LEFT = "SALAM_LEFT",
  QUNUT_TAKBIR_HANDS_RAISED = "QUNUT_TAKBIR_HANDS_RAISED",
  EID_TAKBIR_HANDS_RAISED = "EID_TAKBIR_HANDS_RAISED",
  EID_TAKBIR_HANDS_DOWN = "EID_TAKBIR_HANDS_DOWN",
  JANAZA_TAKBIR = "JANAZA_TAKBIR",
  MUNAJAT = "MUNAJAT",
}

export type SalahGender = "male" | "female";
export type SalahRole = "alone" | "imam" | "muqtadi";

export interface GenderVariantFlags {
  handRaiseHeight: "earlobes" | "shoulders";
  handFoldPosition: "below_navel" | "chest";
  rukuBackAngle: "flat_90" | "slight_bow";
  sajdaPosture: "open_elbows_raised" | "compact_elbows_tucked";
  sittingPosture:
    | "left_foot_under_right_upright"
    | "both_feet_right_side_tawarruk";
  feetGapInStanding: "four_fingers" | "joined";
}

export interface Step {
  id: string;
  rakat: number | null;
  posture: Posture;
  recitationIds: string[]; // References into canonical prayerDuas / prayerSurahs
  repeat: number; // e.g., 3 for ruku/sajda tasbih, or Salatut Tasbih counts
  spokenTakbir: string | null; // "আল্লাহু আকবার", "সামিআল্লাহু লিমান হামিদাহ", etc. or null
  isLoud: boolean; // True when recited aloud (jahr) in Imam mode or audible takbirs
  durationHintMs: number;
  titleBn: string;
  instructionBn: string;
  genderVariants: GenderVariantFlags;
  tasbihCount?: number; // Explicit Salatut Tasbih count at this position (if applicable)
}

export interface SimulatorOptions {
  gender: SalahGender;
  role: SalahRole;
  surahChoice?: Record<number, string>; // Map of rakat number -> surah ID (e.g., { 1: "surah-108", 2: "surah-112" })
  prayerSlug?: string;
  unitLabel?: string;
  includeMunajat?: boolean;
}

export interface TimelineMetadata {
  totalRakats: number;
  prayerSlug?: string;
  unitLabel?: string;
  gender: SalahGender;
  role: SalahRole;
  totalSteps: number;
  totalTasbihCount: number;
  estimatedDurationMs: number;
  isJanaza: boolean;
}

export interface Timeline {
  steps: Step[];
  metadata: TimelineMetadata;
}

