/**
 * Articulated 2D Joint Angles & Pose Definitions for the Namaj Simulator Figure.
 * Pure TypeScript data module — defines side and front view joint angles for all 16 postures
 * separately for Male and Female according to Hanafi Fiqh.
 *
 * Angle convention (Side View, facing Left towards Qibla):
 *   0°    = Straight UP (0, -1)
 *  -90°   = Horizontal LEFT (-1, 0) [Facing Qibla]
 *  -180°  = Straight DOWN (0, +1)
 *  -270°  = Horizontal RIGHT (+1, 0) [Away from Qibla]
 */

import { Posture, SalahGender, PostureMode } from "./types";

export type BodyPartHighlight =
  | "forehead_nose"
  | "palms"
  | "knees"
  | "toes"
  | "back"
  | "hands"
  | "index_finger"
  | "feet"
  | "head"
  | "sajda_7_parts";

export interface JointPose {
  /** Hip (root pelvis) X position in 400x320 SVG space */
  hipX: number;
  /** Hip (root pelvis) Y position in 400x320 SVG space (ground is Y=270) */
  hipY: number;
  /** Torso angle from hip to shoulder (0 = upright, -90 = horizontal left) */
  torsoAngle: number;
  /** Head/neck angle from shoulder to head center */
  headAngle: number;
  /** Upper arm angle from shoulder to elbow */
  upperArmAngle: number;
  /** Forearm angle from elbow to wrist/hand */
  forearmAngle: number;
  /** Thigh angle from hip to knee */
  thighAngle: number;
  /** Shin angle from knee to ankle */
  shinAngle: number;
  /** Foot angle from ankle to toe (-90 = flat pointing left, -180 = upright bent toes) */
  footAngle: number;
  /** Head horizontal turn (-1 = left salam, 0 = center, 1 = right salam) */
  headTurn: number;
  /** Whether right index finger (shahadat finger) is raised in tashahhud */
  fingerRaised: boolean;
  /** Whether toes are bent upright pressing into the mat (sajda/sitting) */
  toesBent: boolean;
  /** Front-view specific arm & body parameters for front projection */
  front: {
    /** Vertical body drop from standing height (0 = standing, 68 = sitting, 95 = sajda) */
    bodyDropY: number;
    /** Torso forward tilt compression factor (1 = upright, 0.35 = ruku/sajda foreshortened) */
    torsoScaleY: number;
    /** Left & right upper arm angles in front view (degrees from straight down) */
    leftUpperArmAngle: number;
    rightUpperArmAngle: number;
    /** Left & right forearm target offsets relative to chest/navel/ears */
    handsMode:
      | "sides"
      | "raised_ears"
      | "raised_shoulders"
      | "folded_navel"
      | "folded_chest"
      | "knees"
      | "ground_sajda"
      | "thighs"
      | "munajat";
  };
}

export const MALE_POSES: Record<Posture, JointPose> = {
  [Posture.STANDING]: {
    hipX: 230,
    hipY: 158,
    torsoAngle: 0,
    headAngle: -5,
    upperArmAngle: -178,
    forearmAngle: -172,
    thighAngle: -180,
    shinAngle: -180,
    footAngle: -90,
    headTurn: 0,
    fingerRaised: false,
    toesBent: false,
    front: {
      bodyDropY: 0,
      torsoScaleY: 1,
      leftUpperArmAngle: 8,
      rightUpperArmAngle: -8,
      handsMode: "sides",
    },
  },

  [Posture.TAKBIR_HANDS_RAISED]: {
    hipX: 230,
    hipY: 158,
    torsoAngle: 0,
    headAngle: -4,
    upperArmAngle: -125,
    forearmAngle: -28,
    thighAngle: -180,
    shinAngle: -180,
    footAngle: -90,
    headTurn: 0,
    fingerRaised: false,
    toesBent: false,
    front: {
      bodyDropY: 0,
      torsoScaleY: 1,
      leftUpperArmAngle: 55,
      rightUpperArmAngle: -55,
      handsMode: "raised_ears",
    },
  },

  [Posture.QIYAM_HANDS_FOLDED]: {
    hipX: 230,
    hipY: 158,
    torsoAngle: 0,
    headAngle: -12,
    upperArmAngle: -162,
    forearmAngle: -108,
    thighAngle: -180,
    shinAngle: -180,
    footAngle: -90,
    headTurn: 0,
    fingerRaised: false,
    toesBent: false,
    front: {
      bodyDropY: 0,
      torsoScaleY: 1,
      leftUpperArmAngle: 22,
      rightUpperArmAngle: -22,
      handsMode: "folded_navel",
    },
  },

  [Posture.RUKU]: {
    hipX: 252,
    hipY: 162,
    torsoAngle: -90, // Straight 90-degree horizontal back level with head
    headAngle: -90,
    upperArmAngle: -215,
    forearmAngle: -232,
    thighAngle: -180,
    shinAngle: -180,
    footAngle: -90,
    headTurn: 0,
    fingerRaised: false,
    toesBent: false,
    front: {
      bodyDropY: 36,
      torsoScaleY: 0.42,
      leftUpperArmAngle: 15,
      rightUpperArmAngle: -15,
      handsMode: "knees",
    },
  },

  [Posture.QAWMA]: {
    hipX: 230,
    hipY: 158,
    torsoAngle: 0,
    headAngle: -6,
    upperArmAngle: -178,
    forearmAngle: -174,
    thighAngle: -180,
    shinAngle: -180,
    footAngle: -90,
    headTurn: 0,
    fingerRaised: false,
    toesBent: false,
    front: {
      bodyDropY: 0,
      torsoScaleY: 1,
      leftUpperArmAngle: 8,
      rightUpperArmAngle: -8,
      handsMode: "sides",
    },
  },

  [Posture.SAJDA]: {
    hipX: 236,
    hipY: 210, // Elevated hip so belly is separated from thighs
    torsoAngle: -114,
    headAngle: -120, // Forehead & nose touch ground at Y=268
    upperArmAngle: -188, // Elbows raised off the mat
    forearmAngle: -116, // Palms flat on the mat
    thighAngle: -202, // Knees on the mat at (256, 264)
    shinAngle: -270, // Shins flat along the mat
    footAngle: -180, // Upright foot with toes bent facing Qibla
    headTurn: 0,
    fingerRaised: false,
    toesBent: true,
    front: {
      bodyDropY: 94,
      torsoScaleY: 0.35,
      leftUpperArmAngle: 38,
      rightUpperArmAngle: -38,
      handsMode: "ground_sajda",
    },
  },

  [Posture.JALSA]: {
    hipX: 256,
    hipY: 228,
    torsoAngle: 0,
    headAngle: -10,
    upperArmAngle: -166,
    forearmAngle: -122,
    thighAngle: -128,
    shinAngle: -270,
    footAngle: -180,
    headTurn: 0,
    fingerRaised: false,
    toesBent: true,
    front: {
      bodyDropY: 68,
      torsoScaleY: 0.95,
      leftUpperArmAngle: 16,
      rightUpperArmAngle: -16,
      handsMode: "thighs",
    },
  },

  [Posture.QADA]: {
    hipX: 256,
    hipY: 228,
    torsoAngle: 0,
    headAngle: -10,
    upperArmAngle: -166,
    forearmAngle: -122,
    thighAngle: -128,
    shinAngle: -270,
    footAngle: -180,
    headTurn: 0,
    fingerRaised: false,
    toesBent: true,
    front: {
      bodyDropY: 68,
      torsoScaleY: 0.95,
      leftUpperArmAngle: 16,
      rightUpperArmAngle: -16,
      handsMode: "thighs",
    },
  },

  [Posture.TASHAHHUD_FINGER_RAISED]: {
    hipX: 256,
    hipY: 228,
    torsoAngle: 0,
    headAngle: -12,
    upperArmAngle: -166,
    forearmAngle: -118,
    thighAngle: -128,
    shinAngle: -270,
    footAngle: -180,
    headTurn: 0,
    fingerRaised: true,
    toesBent: true,
    front: {
      bodyDropY: 68,
      torsoScaleY: 0.95,
      leftUpperArmAngle: 16,
      rightUpperArmAngle: -16,
      handsMode: "thighs",
    },
  },

  [Posture.SALAM_RIGHT]: {
    hipX: 256,
    hipY: 228,
    torsoAngle: 0,
    headAngle: -6,
    upperArmAngle: -166,
    forearmAngle: -122,
    thighAngle: -128,
    shinAngle: -270,
    footAngle: -180,
    headTurn: 1, // Turned towards Right shoulder
    fingerRaised: false,
    toesBent: true,
    front: {
      bodyDropY: 68,
      torsoScaleY: 0.95,
      leftUpperArmAngle: 16,
      rightUpperArmAngle: -16,
      handsMode: "thighs",
    },
  },

  [Posture.SALAM_LEFT]: {
    hipX: 256,
    hipY: 228,
    torsoAngle: 0,
    headAngle: -6,
    upperArmAngle: -166,
    forearmAngle: -122,
    thighAngle: -128,
    shinAngle: -270,
    footAngle: -180,
    headTurn: -1, // Turned towards Left shoulder
    fingerRaised: false,
    toesBent: true,
    front: {
      bodyDropY: 68,
      torsoScaleY: 0.95,
      leftUpperArmAngle: 16,
      rightUpperArmAngle: -16,
      handsMode: "thighs",
    },
  },

  [Posture.QUNUT_TAKBIR_HANDS_RAISED]: {
    hipX: 230,
    hipY: 158,
    torsoAngle: 0,
    headAngle: -4,
    upperArmAngle: -125,
    forearmAngle: -28,
    thighAngle: -180,
    shinAngle: -180,
    footAngle: -90,
    headTurn: 0,
    fingerRaised: false,
    toesBent: false,
    front: {
      bodyDropY: 0,
      torsoScaleY: 1,
      leftUpperArmAngle: 55,
      rightUpperArmAngle: -55,
      handsMode: "raised_ears",
    },
  },

  [Posture.EID_TAKBIR_HANDS_RAISED]: {
    hipX: 230,
    hipY: 158,
    torsoAngle: 0,
    headAngle: -4,
    upperArmAngle: -125,
    forearmAngle: -28,
    thighAngle: -180,
    shinAngle: -180,
    footAngle: -90,
    headTurn: 0,
    fingerRaised: false,
    toesBent: false,
    front: {
      bodyDropY: 0,
      torsoScaleY: 1,
      leftUpperArmAngle: 55,
      rightUpperArmAngle: -55,
      handsMode: "raised_ears",
    },
  },

  [Posture.EID_TAKBIR_HANDS_DOWN]: {
    hipX: 230,
    hipY: 158,
    torsoAngle: 0,
    headAngle: -6,
    upperArmAngle: -178,
    forearmAngle: -172,
    thighAngle: -180,
    shinAngle: -180,
    footAngle: -90,
    headTurn: 0,
    fingerRaised: false,
    toesBent: false,
    front: {
      bodyDropY: 0,
      torsoScaleY: 1,
      leftUpperArmAngle: 8,
      rightUpperArmAngle: -8,
      handsMode: "sides",
    },
  },

  [Posture.JANAZA_TAKBIR]: {
    hipX: 230,
    hipY: 158,
    torsoAngle: 0,
    headAngle: -10,
    upperArmAngle: -162,
    forearmAngle: -108,
    thighAngle: -180,
    shinAngle: -180,
    footAngle: -90,
    headTurn: 0,
    fingerRaised: false,
    toesBent: false,
    front: {
      bodyDropY: 0,
      torsoScaleY: 1,
      leftUpperArmAngle: 22,
      rightUpperArmAngle: -22,
      handsMode: "folded_navel",
    },
  },

  [Posture.MUNAJAT]: {
    hipX: 256,
    hipY: 228,
    torsoAngle: -4,
    headAngle: -18,
    upperArmAngle: -152,
    forearmAngle: -58,
    thighAngle: -128,
    shinAngle: -270,
    footAngle: -180,
    headTurn: 0,
    fingerRaised: false,
    toesBent: true,
    front: {
      bodyDropY: 68,
      torsoScaleY: 0.95,
      leftUpperArmAngle: 28,
      rightUpperArmAngle: -28,
      handsMode: "munajat",
    },
  },
};

export const FEMALE_POSES: Record<Posture, JointPose> = {
  [Posture.STANDING]: {
    ...MALE_POSES[Posture.STANDING],
  },

  [Posture.TAKBIR_HANDS_RAISED]: {
    ...MALE_POSES[Posture.TAKBIR_HANDS_RAISED],
    // Women raise hands up to shoulders/chest level
    upperArmAngle: -145,
    forearmAngle: -44,
    front: {
      bodyDropY: 0,
      torsoScaleY: 1,
      leftUpperArmAngle: 36,
      rightUpperArmAngle: -36,
      handsMode: "raised_shoulders",
    },
  },

  [Posture.QIYAM_HANDS_FOLDED]: {
    ...MALE_POSES[Posture.QIYAM_HANDS_FOLDED],
    // Women fold hands on the chest
    upperArmAngle: -154,
    forearmAngle: -68,
    front: {
      bodyDropY: 0,
      torsoScaleY: 1,
      leftUpperArmAngle: 26,
      rightUpperArmAngle: -26,
      handsMode: "folded_chest",
    },
  },

  [Posture.RUKU]: {
    ...MALE_POSES[Posture.RUKU],
    // Women bow slightly (enough for hands to reach knees) with elbows tucked
    hipX: 246,
    hipY: 164,
    torsoAngle: -64,
    headAngle: -68,
    upperArmAngle: -196,
    forearmAngle: -222,
    front: {
      bodyDropY: 24,
      torsoScaleY: 0.62,
      leftUpperArmAngle: 10,
      rightUpperArmAngle: -10,
      handsMode: "knees",
    },
  },

  [Posture.QAWMA]: {
    ...MALE_POSES[Posture.QAWMA],
  },

  [Posture.SAJDA]: {
    // Women perform a compact sajda (belly resting near thighs, elbows resting on mat)
    hipX: 242,
    hipY: 232,
    torsoAngle: -102,
    headAngle: -112,
    upperArmAngle: -214, // Elbows lowered to touch mat
    forearmAngle: -92, // Forearms flat on mat
    thighAngle: -195,
    shinAngle: -270,
    footAngle: -180,
    headTurn: 0,
    fingerRaised: false,
    toesBent: true,
    front: {
      bodyDropY: 98,
      torsoScaleY: 0.32,
      leftUpperArmAngle: 18,
      rightUpperArmAngle: -18,
      handsMode: "ground_sajda",
    },
  },

  [Posture.JALSA]: {
    ...MALE_POSES[Posture.JALSA],
    // Women sit in tawarruk (on left hip with both feet out to the right)
    hipY: 234,
  },

  [Posture.QADA]: {
    ...MALE_POSES[Posture.QADA],
    hipY: 234,
  },

  [Posture.TASHAHHUD_FINGER_RAISED]: {
    ...MALE_POSES[Posture.TASHAHHUD_FINGER_RAISED],
    hipY: 234,
  },

  [Posture.SALAM_RIGHT]: {
    ...MALE_POSES[Posture.SALAM_RIGHT],
    hipY: 234,
  },

  [Posture.SALAM_LEFT]: {
    ...MALE_POSES[Posture.SALAM_LEFT],
    hipY: 234,
  },

  [Posture.QUNUT_TAKBIR_HANDS_RAISED]: {
    ...MALE_POSES[Posture.QUNUT_TAKBIR_HANDS_RAISED],
    upperArmAngle: -145,
    forearmAngle: -44,
    front: {
      bodyDropY: 0,
      torsoScaleY: 1,
      leftUpperArmAngle: 36,
      rightUpperArmAngle: -36,
      handsMode: "raised_shoulders",
    },
  },

  [Posture.EID_TAKBIR_HANDS_RAISED]: {
    ...MALE_POSES[Posture.EID_TAKBIR_HANDS_RAISED],
    upperArmAngle: -145,
    forearmAngle: -44,
    front: {
      bodyDropY: 0,
      torsoScaleY: 1,
      leftUpperArmAngle: 36,
      rightUpperArmAngle: -36,
      handsMode: "raised_shoulders",
    },
  },

  [Posture.EID_TAKBIR_HANDS_DOWN]: {
    ...MALE_POSES[Posture.EID_TAKBIR_HANDS_DOWN],
  },

  [Posture.JANAZA_TAKBIR]: {
    ...MALE_POSES[Posture.JANAZA_TAKBIR],
    upperArmAngle: -154,
    forearmAngle: -68,
    front: {
      bodyDropY: 0,
      torsoScaleY: 1,
      leftUpperArmAngle: 26,
      rightUpperArmAngle: -26,
      handsMode: "folded_chest",
    },
  },

  [Posture.MUNAJAT]: {
    ...MALE_POSES[Posture.MUNAJAT],
    hipY: 234,
  },
};

function buildSittingFloorPose(
  base: JointPose,
  posture: Posture,
  gender: SalahGender
): JointPose {
  switch (posture) {
    case Posture.STANDING:
    case Posture.QAWMA:
      return {
        ...base,
        hipX: 256,
        hipY: 228,
        torsoAngle: 0,
        headAngle: -10,
        upperArmAngle: -166,
        forearmAngle: -122,
        thighAngle: -128,
        shinAngle: -270,
        footAngle: -180,
        front: {
          bodyDropY: 68,
          torsoScaleY: 1.0,
          leftUpperArmAngle: 12,
          rightUpperArmAngle: -12,
          handsMode: "thighs",
        },
      };

    case Posture.TAKBIR_HANDS_RAISED:
    case Posture.QUNUT_TAKBIR_HANDS_RAISED:
    case Posture.EID_TAKBIR_HANDS_RAISED:
      return {
        ...base,
        hipX: 256,
        hipY: 228,
        torsoAngle: 0,
        headAngle: -10,
        thighAngle: -128,
        shinAngle: -270,
        footAngle: -180,
        front: {
          bodyDropY: 68,
          torsoScaleY: 1.0,
          leftUpperArmAngle: gender === "female" ? 36 : 42,
          rightUpperArmAngle: gender === "female" ? -36 : -42,
          handsMode: gender === "female" ? "raised_shoulders" : "raised_ears",
        },
      };

    case Posture.QIYAM_HANDS_FOLDED:
    case Posture.JANAZA_TAKBIR:
      return {
        ...base,
        hipX: 256,
        hipY: 228,
        torsoAngle: 0,
        headAngle: -10,
        thighAngle: -128,
        shinAngle: -270,
        footAngle: -180,
        front: {
          bodyDropY: 68,
          torsoScaleY: 1.0,
          leftUpperArmAngle: 24,
          rightUpperArmAngle: -24,
          handsMode: gender === "female" ? "folded_chest" : "folded_navel",
        },
      };

    case Posture.RUKU:
      return {
        ...base,
        hipX: 256,
        hipY: 228,
        torsoAngle: -40,
        headAngle: -45,
        upperArmAngle: -165,
        forearmAngle: -135,
        thighAngle: -128,
        shinAngle: -270,
        footAngle: -180,
        front: {
          bodyDropY: 68,
          torsoScaleY: 0.72,
          leftUpperArmAngle: 18,
          rightUpperArmAngle: -18,
          handsMode: "knees",
        },
      };

    default:
      return base;
  }
}

function buildChairPose(
  base: JointPose,
  posture: Posture,
  gender: SalahGender
): JointPose {
  const chairHipX = 236;
  const chairHipY = 194;
  const chairThighAngle = -90;
  const chairShinAngle = -180;
  const chairFootAngle = -90;

  switch (posture) {
    case Posture.STANDING:
    case Posture.QAWMA:
      return {
        ...base,
        hipX: chairHipX,
        hipY: chairHipY,
        torsoAngle: 0,
        headAngle: -8,
        upperArmAngle: -168,
        forearmAngle: -120,
        thighAngle: chairThighAngle,
        shinAngle: chairShinAngle,
        footAngle: chairFootAngle,
        front: {
          bodyDropY: 36,
          torsoScaleY: 1.0,
          leftUpperArmAngle: 12,
          rightUpperArmAngle: -12,
          handsMode: "thighs",
        },
      };

    case Posture.TAKBIR_HANDS_RAISED:
    case Posture.QUNUT_TAKBIR_HANDS_RAISED:
    case Posture.EID_TAKBIR_HANDS_RAISED:
      return {
        ...base,
        hipX: chairHipX,
        hipY: chairHipY,
        torsoAngle: 0,
        headAngle: -8,
        thighAngle: chairThighAngle,
        shinAngle: chairShinAngle,
        footAngle: chairFootAngle,
        front: {
          bodyDropY: 36,
          torsoScaleY: 1.0,
          leftUpperArmAngle: gender === "female" ? 36 : 42,
          rightUpperArmAngle: gender === "female" ? -36 : -42,
          handsMode: gender === "female" ? "raised_shoulders" : "raised_ears",
        },
      };

    case Posture.QIYAM_HANDS_FOLDED:
    case Posture.JANAZA_TAKBIR:
      return {
        ...base,
        hipX: chairHipX,
        hipY: chairHipY,
        torsoAngle: 0,
        headAngle: -8,
        thighAngle: chairThighAngle,
        shinAngle: chairShinAngle,
        footAngle: chairFootAngle,
        front: {
          bodyDropY: 36,
          torsoScaleY: 1.0,
          leftUpperArmAngle: 24,
          rightUpperArmAngle: -24,
          handsMode: gender === "female" ? "folded_chest" : "folded_navel",
        },
      };

    case Posture.RUKU:
      return {
        ...base,
        hipX: chairHipX,
        hipY: chairHipY,
        torsoAngle: -32,
        headAngle: -40,
        upperArmAngle: -160,
        forearmAngle: -125,
        thighAngle: chairThighAngle,
        shinAngle: chairShinAngle,
        footAngle: chairFootAngle,
        front: {
          bodyDropY: 36,
          torsoScaleY: 0.78,
          leftUpperArmAngle: 16,
          rightUpperArmAngle: -16,
          handsMode: "knees",
        },
      };

    case Posture.SAJDA:
      return {
        ...base,
        hipX: chairHipX,
        hipY: chairHipY,
        torsoAngle: -58,
        headAngle: -70,
        upperArmAngle: -150,
        forearmAngle: -115,
        thighAngle: chairThighAngle,
        shinAngle: chairShinAngle,
        footAngle: chairFootAngle,
        front: {
          bodyDropY: 36,
          torsoScaleY: 0.55,
          leftUpperArmAngle: 24,
          rightUpperArmAngle: -24,
          handsMode: "knees",
        },
      };

    default:
      return {
        ...base,
        hipX: chairHipX,
        hipY: chairHipY,
        thighAngle: chairThighAngle,
        shinAngle: chairShinAngle,
        footAngle: chairFootAngle,
      };
  }
}

export function getPoseForPosture(
  posture: Posture,
  gender: SalahGender,
  mode: PostureMode = "standing"
): JointPose {
  const base = gender === "female" ? FEMALE_POSES[posture] : MALE_POSES[posture];
  if (mode === "sittingFloor") return buildSittingFloorPose(base, posture, gender);
  if (mode === "sittingChair") return buildChairPose(base, posture, gender);
  return base;
}

export const POSTURE_META: Record<
  Posture,
  { labelBn: string; labelEn: string; recommendedView: "side" | "front" }
> = {
  [Posture.STANDING]: {
    labelBn: "কিয়াম (দাঁড়ানো ও নিয়্যত)",
    labelEn: "Standing (Qiyam)",
    recommendedView: "side",
  },
  [Posture.TAKBIR_HANDS_RAISED]: {
    labelBn: "তাকবীরে তাহরীমা (হাত উত্তোলন)",
    labelEn: "Takbir Hands Raised",
    recommendedView: "front",
  },
  [Posture.QIYAM_HANDS_FOLDED]: {
    labelBn: "হাত বেঁধে কিয়াম (কেরাত)",
    labelEn: "Standing Hands Folded",
    recommendedView: "side",
  },
  [Posture.RUKU]: {
    labelBn: "রুকু (পিঠ সমান্তরাল)",
    labelEn: "Bowing (Ruku)",
    recommendedView: "side",
  },
  [Posture.QAWMA]: {
    labelBn: "কওমা (রুকু থেকে দাঁড়ানো)",
    labelEn: "Standing After Ruku (Qawma)",
    recommendedView: "side",
  },
  [Posture.SAJDA]: {
    labelBn: "সিজদা (৭ অঙ্গ মাটিতে স্পর্শ)",
    labelEn: "Prostration (Sajda)",
    recommendedView: "side",
  },
  [Posture.JALSA]: {
    labelBn: "জলসা (দুই সিজদার মাঝের বৈঠক)",
    labelEn: "Sitting Between Sajdas (Jalsa)",
    recommendedView: "side",
  },
  [Posture.QADA]: {
    labelBn: "কা'দাহ (তাশাহহুদ বৈঠক)",
    labelEn: "Sitting for Tashahhud (Qada)",
    recommendedView: "side",
  },
  [Posture.TASHAHHUD_FINGER_RAISED]: {
    labelBn: "তাশাহহুদে শাহাদাত আঙুল ইশারা",
    labelEn: "Tashahhud Index Finger Raised",
    recommendedView: "side",
  },
  [Posture.SALAM_RIGHT]: {
    labelBn: "ডান দিকে সালাম",
    labelEn: "Salam to the Right",
    recommendedView: "front",
  },
  [Posture.SALAM_LEFT]: {
    labelBn: "বাম দিকে সালাম",
    labelEn: "Salam to the Left",
    recommendedView: "front",
  },
  [Posture.QUNUT_TAKBIR_HANDS_RAISED]: {
    labelBn: "দোয়া কুনূতের তাকবীর",
    labelEn: "Qunut Takbir Hands Raised",
    recommendedView: "front",
  },
  [Posture.EID_TAKBIR_HANDS_RAISED]: {
    labelBn: "ঈদের অতিরিক্ত তাকবীর (হাত তোলা)",
    labelEn: "Eid Extra Takbir Raised",
    recommendedView: "front",
  },
  [Posture.EID_TAKBIR_HANDS_DOWN]: {
    labelBn: "ঈদের তাকবীরের মাঝে হাত ছাড়া",
    labelEn: "Eid Takbir Hands Released",
    recommendedView: "front",
  },
  [Posture.JANAZA_TAKBIR]: {
    labelBn: "জানাজার তাকবীর ও কিয়াম",
    labelEn: "Janaza Standing Takbir",
    recommendedView: "front",
  },
  [Posture.MUNAJAT]: {
    labelBn: "মুনাজাত (সালাম পরবর্তী দোয়া)",
    labelEn: "Post-Salah Supplication (Munajat)",
    recommendedView: "front",
  },
};

/**
 * Linearly interpolates between two JointPoses for smooth 60fps animation.
 */
export function interpolatePose(
  from: JointPose,
  to: JointPose,
  t: number
): JointPose {
  const lerp = (a: number, b: number) => a + (b - a) * t;
  return {
    hipX: lerp(from.hipX, to.hipX),
    hipY: lerp(from.hipY, to.hipY),
    torsoAngle: lerp(from.torsoAngle, to.torsoAngle),
    headAngle: lerp(from.headAngle, to.headAngle),
    upperArmAngle: lerp(from.upperArmAngle, to.upperArmAngle),
    forearmAngle: lerp(from.forearmAngle, to.forearmAngle),
    thighAngle: lerp(from.thighAngle, to.thighAngle),
    shinAngle: lerp(from.shinAngle, to.shinAngle),
    footAngle: lerp(from.footAngle, to.footAngle),
    headTurn: lerp(from.headTurn, to.headTurn),
    fingerRaised: t >= 0.5 ? to.fingerRaised : from.fingerRaised,
    toesBent: t >= 0.5 ? to.toesBent : from.toesBent,
    front: {
      bodyDropY: lerp(from.front.bodyDropY, to.front.bodyDropY),
      torsoScaleY: lerp(from.front.torsoScaleY, to.front.torsoScaleY),
      leftUpperArmAngle: lerp(
        from.front.leftUpperArmAngle,
        to.front.leftUpperArmAngle
      ),
      rightUpperArmAngle: lerp(
        from.front.rightUpperArmAngle,
        to.front.rightUpperArmAngle
      ),
      handsMode: t >= 0.5 ? to.front.handsMode : from.front.handsMode,
    },
  };
}

