# Namaj Simulator Engine Architecture (`/src/lib/simulator`)

## Overview
The **Namaj Simulator Engine** is a pure, deterministic TypeScript module with **zero React or DOM dependencies**. Its sole responsibility is to transform any prayer unit's `SalahConfig` (from `/src/data/prayers.ts`) along with user preferences (`gender`, `role`, `surahChoice`) into an ordered, self-contained `Timeline` of `Step` objects.

By decoupling the fiqh state machine from the UI layer, the engine can be:
1. Unit-tested exhaustively across all 29 prayer types and 49 rakat units in milliseconds.
2. Consumed by the 2D/SVG animated figure, audio synchronizer, step-by-step scrubber, and text reader.

---

## Core Types (`/src/lib/simulator/types.ts`)

### 1. `Posture` Enum
Represents the 16 discrete physical postures of salah:
- `STANDING` — Standing upright facing Qibla (Niyyat).
- `TAKBIR_HANDS_RAISED` — Raising hands to earlobes (male) or shoulders (female) for Takbire Tahrima.
- `QIYAM_HANDS_FOLDED` — Standing with hands folded (below navel for men, on chest for women) during Sana, Fatiha, Surah, or Dua Qunut.
- `RUKU` — Bowing posture (90° flat back for men, slight bow for women).
- `QAWMA` — Standing upright after rising from Ruku.
- `SAJDA` — Prostration with nose, forehead, hands, knees, and toes touching the ground.
- `JALSA` — Sitting upright between the two prostrations.
- `QADA` — Sitting for Tashahhud (First Sitting *Qa'dah Ula* or Final Sitting *Qa'dah Akhirah*).
- `TASHAHHUD_FINGER_RAISED` — Raising the right index finger at *"Ashhadu alla ilaha"* and lowering at *"illallah"*, followed by Durood & Dua Masura in the final sitting.
- `SALAM_RIGHT` / `SALAM_LEFT` — Turning head to the right and left shoulders for concluding Tasleem.
- `QUNUT_TAKBIR_HANDS_RAISED` — Raising hands before Ruku in the 3rd rakat of Witr for Dua Qunut.
- `EID_TAKBIR_HANDS_RAISED` / `EID_TAKBIR_HANDS_DOWN` — Raising hands for the 6 extra Wajib takbirs of Eid and releasing hands to the sides between takbirs.
- `JANAZA_TAKBIR` — Standing takbirs of Salatul Janaza (4 takbirs, no Ruku or Sajda).
- `MUNAJAT` — Optional post-salah Istighfar and supplication.

### 2. `Step` Interface
Each step in the timeline contains:
- `id`: Deterministic step identifier (e.g., `"r1-fatiha"`, `"r2-sajda-1"`).
- `rakat`: Current rakat number (`1..N`) or `null` for pre/post-rakat steps (e.g., Salam, Janaza).
- `posture`: `Posture` enum value.
- `recitationIds`: Array of canonical IDs pointing into `prayerDuas` (`/src/data/duas.ts`) or `prayerSurahs` (`/src/data/surahs.ts`).
- `repeat`: Repetition count for the recitation (e.g., `3` for Ruku/Sajda tasbih, `10` or `15` for Salatut Tasbih).
- `spokenTakbir`: Audible transition phrase (`"আল্লাহু আকবার"`, `"সামিআল্লাহু লিমান হামিদাহ"`, `"রাব্বানা লাকাল হামদ"`, `"আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ"`, or `null`).
- `isLoud`: `true` when recited aloud (*jahr*) in Imam mode or audible transition takbirs.
- `durationHintMs`: Suggested duration in milliseconds for auto-play pacing.
- `titleBn` & `instructionBn`: Concise Bangla heading and posture/fiqh instruction.
- `genderVariants`: `GenderVariantFlags` specifying exact posture differences for male vs female worshippers.
- `tasbihCount`: Optional explicit tasbih counter for *Salatut Tasbih*.

---

## Fiqh Rules Implemented in `buildTimeline` (`/src/lib/simulator/engine.ts`)

1. **Rakat Structure & Qirat**:
   - **Sana (`dua-1`)** and **Ta'awwuz (`dua-taawwuz`)** are recited only in the 1st rakat.
   - **Tasmiyah (`dua-tasmiyah`)** is recited silently at the start of every rakat before Surah Al-Fatiha (`surah-1`).
   - An additional Surah is recited after Fatiha only in rakats listed in `config.qiratRakats` (e.g., Rakats 1 & 2 for 3/4-rakat Fard prayers; all rakats for Sunnah, Nafl, and Witr).
2. **Sittings (*Qa'dah*)**:
   - **First Sitting (*Qa'dah Ula*)** occurs after `config.firstSittingAfter` (Rakat 2 in 3- and 4-rakat prayers) and recites *Attahiyyatu* (`dua-2`) only, before rising for the 3rd rakat.
   - **Final Sitting (*Qa'dah Akhirah*)** occurs at `r === config.rakats` and recites *Attahiyyatu* (`dua-2`), *Durood Ibrahim* (`dua-3`), and *Dua Masura* (`dua-4`).
3. **Role Handling (`alone` | `imam` | `muqtadi`)**:
   - **Muqtadi (Follower in Hanafi Fiqh)**: Does not recite Fatiha or additional Surah in Qiyam (stands silently listening to the Imam), while reciting Sana in Rakat 1, Ruku/Sajda tasbihat, `"রাব্বানা লাকাল হামদ"` in Qawma, and Tashahhud/Durood/Dua Masura in sittings.
   - **Imam**: Sets `isLoud = true` on transition takbirs and on Qirat steps in *jahri* rakats (`config.jahr`).
4. **Special Prayers**:
   - **Witr**: Inserts `QUNUT_TAKBIR_HANDS_RAISED` + `dua-5` (Dua Qunut) in Rakat 3 after Surah recitation and before Ruku.
   - **Eid-ul-Fitr & Eid-ul-Adha**: Inserts 3 extra takbirs in Rakat 1 after Sana (`after-sana`) with hands released between Takbirs 1 & 2 and folded after Takbir 3, plus 3 extra takbirs in Rakat 2 after Surah and before Ruku (`before-ruku`).
   - **Salatul Janaza**: Generates 4 standing `JANAZA_TAKBIR` steps (Sana -> Durood Ibrahim -> Janaza Dua -> Silent pause) followed by Salam right and left, with `0` Ruku and `0` Sajda.
   - **Salatut Tasbih**: Distributes 75 tasbihs (`dua-tasbih`) across 7 positions in each rakat (`15 + 10 + 10 + 10 + 10 + 10 + 10 = 75`), totaling 300 tasbihs across 4 rakats.

---

## Usage Example

```ts
import { buildTimeline } from "@/src/lib/simulator";
import { getPrayerBySlug } from "@/src/data";

const fajr = getPrayerBySlug("fajr")!;
const fardUnit = fajr.rakatUnits.find((u) => u.status === "fard")!;

const timeline = buildTimeline(fardUnit.config, {
  gender: "male",
  role: "alone",
  prayerSlug: "fajr",
  surahChoice: {
    1: "surah-108", // Surah Al-Kawthar
    2: "surah-112", // Surah Al-Ikhlas
  },
});

console.log(timeline.metadata.totalSteps); // 16
```

