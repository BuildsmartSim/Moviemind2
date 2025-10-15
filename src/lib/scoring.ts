import type { Manifest } from "./manifest";

export type RoundKey = "R1" | "R2" | "R3" | "R4" | "R5" | "R6";

export type AxisKey =
  | "valence"
  | "arousal"
  | "comfort"
  | "dominance"
  | "sociality"
  | "realism"
  | "pacing"
  | "depth"
  | "romance"
  | "energy";

export const USER_AXES: AxisKey[] = [
  "valence",
  "arousal",
  "comfort",
  "dominance",
  "sociality",
  "realism",
  "pacing",
  "depth",
  "romance",
  "energy"
];

export type UserVector = Record<AxisKey, number>;

export type GateAnswers = Partial<Record<RoundKey, string>>;

export interface StoredAnswers {
  entryGateId?: string;
  gateAnswers: Record<string, GateAnswers>;
}

const STORAGE_KEY = "mm.mpcs1.answers.v1";

export function loadAnswers(): StoredAnswers {
  if (typeof window === "undefined") {
    return { gateAnswers: {} };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { gateAnswers: {} };
    }

    const parsed = JSON.parse(raw) as StoredAnswers;
    return {
      entryGateId: parsed.entryGateId,
      gateAnswers: parsed.gateAnswers ?? {}
    };
  } catch (error) {
    console.warn("Failed to parse stored answers", error);
    return { gateAnswers: {} };
  }
}

const GATE_SEED: Record<string, Pick<UserVector, "valence" | "arousal">> = {
  G01: { valence: 0.4, arousal: 0.4 },
  G02: { valence: 0.4, arousal: -0.2 },
  G03: { valence: -0.3, arousal: 0.45 },
  G04: { valence: -0.35, arousal: -0.25 },
  G05: { valence: 0, arousal: 0 }
};

const IMAGE_VA_DELTAS: Record<string, { valence: number; arousal: number }> = {
  "A01_NEAON_CHASE.png": { valence: 0.8, arousal: 0.7 },
  "A02_NEAON_SIGNAL.png": { valence: 0.65, arousal: 0.65 },
  "A03_NEAON_TRAILS.png": { valence: 0.55, arousal: 0.55 },
  "A04_NEAON_MIRAGE.png": { valence: 0.5, arousal: 0.5 },
  "A01_STIL_MIRROR.png": { valence: 0.55, arousal: -0.4 },
  "A02_STIL_PULSE.png": { valence: 0.5, arousal: -0.35 },
  "A03_STIL_REPOSE.png": { valence: 0.45, arousal: -0.45 },
  "A04_STIL_SILENCE.png": { valence: 0.4, arousal: -0.5 },
  "A01_FORREST_WAKE.png": { valence: -0.4, arousal: 0.55 },
  "A02_FORREST_SIGNAL.png": { valence: -0.45, arousal: 0.6 },
  "A03_THE_FORREST_VEIL.png": { valence: -0.5, arousal: 0.5 },
  "A04_FORREST_SYNTH.png": { valence: -0.35, arousal: 0.45 },
  "A01_DESSERT_MIRAGE.png": { valence: -0.45, arousal: -0.35 },
  "A02_DESSERT_SOL.png": { valence: -0.4, arousal: -0.4 },
  "A03_DESSERT_FREQUENCY.png": { valence: -0.35, arousal: -0.45 },
  "A04_DESSERT_DUSK.png": { valence: -0.5, arousal: -0.3 },
  "A01_NEUTRAL_ORBIT.png": { valence: 0.05, arousal: 0.05 },
  "A02_NEUTRAL_SPECTRUM.png": { valence: 0, arousal: 0 },
  "A03_NEUTRAL_BALANCE.png": { valence: -0.05, arousal: -0.05 },
  "A04_NEUTRAL_CALM.png": { valence: 0.1, arousal: -0.1 }
};

const IMAGE_RP_DELTAS: Record<string, { realism: number; pacing: number }> = {
  "B01_NEAON_RAIN.png": { realism: -0.3, pacing: 0.6 },
  "B02_NEAON_TEMPLE.png": { realism: -0.2, pacing: 0.55 },
  "B03_NEAON_ECHO.png": { realism: -0.15, pacing: 0.5 },
  "B01_STIL_WATER.png": { realism: 0.4, pacing: -0.4 },
  "B02_STIL_SHELL.png": { realism: 0.35, pacing: -0.35 },
  "B03_STIL_ARCADIA.png": { realism: 0.3, pacing: -0.3 },
  "B01_FORREST_BLOOM.png": { realism: 0.2, pacing: 0.35 },
  "B02_FORREST_GROVE.png": { realism: 0.25, pacing: 0.4 },
  "B03_FORREST_LOWLIGHT.png": { realism: 0.3, pacing: 0.3 },
  "B01_DESSERT_STATIC.png": { realism: -0.15, pacing: -0.25 },
  "B02_DESSERT_ORBIT.png": { realism: -0.1, pacing: -0.3 },
  "B03_DESSERT_ECHO.png": { realism: -0.05, pacing: -0.2 },
  "B01_NEUTRAL_DREAM.png": { realism: 0.1, pacing: 0 },
  "B02_NEUTRAL_PERSPECTIVE.png": { realism: 0, pacing: 0.05 },
  "B03_NEUTRAL_PIVOT.png": { realism: 0.05, pacing: -0.05 }
};

const TEXT_R2: Record<string, Pick<UserVector, "dominance" | "sociality" | "realism">> = {
  A: { dominance: 0.35, sociality: 0.05, realism: 0.1 },
  B: { dominance: 0.1, sociality: 0.3, realism: 0.15 },
  C: { dominance: 0.2, sociality: 0.05, realism: 0.3 }
};

const TEXT_R4: Record<string, Pick<UserVector, "valence" | "arousal" | "comfort">> = {
  A: { valence: 0.3, arousal: 0.05, comfort: 0.35 },
  B: { valence: 0.15, arousal: 0.25, comfort: 0.2 },
  C: { valence: 0.1, arousal: 0.05, comfort: 0.4 }
};

const TEXT_R6: Record<string, Pick<UserVector, "dominance" | "romance" | "energy">> = {
  A: { dominance: 0.35, romance: 0.05, energy: 0.3 },
  B: { dominance: 0.25, romance: 0.1, energy: 0.15 },
  C: { dominance: 0.2, romance: 0.3, energy: 0.15 }
};

const ZERO_VECTOR: UserVector = USER_AXES.reduce((acc, axis) => {
  acc[axis] = 0;
  return acc;
}, {} as UserVector);

function cloneVector(): UserVector {
  const next: UserVector = { ...ZERO_VECTOR };
  return next;
}

function clamp(value: number): number {
  return Math.max(-1, Math.min(1, value));
}

function applyDelta(vector: UserVector, delta: Partial<UserVector>, weight: number) {
  (Object.keys(delta) as AxisKey[]).forEach((axis) => {
    const diff = delta[axis] ?? 0;
    vector[axis] = clamp(vector[axis] + diff * weight);
  });
}

function vectorMagnitude(vector: UserVector): number {
  return Math.sqrt(USER_AXES.reduce((sum, axis) => sum + vector[axis] * vector[axis], 0));
}

export function normalizeVector(vector: UserVector): UserVector {
  const mag = vectorMagnitude(vector);
  if (!mag || Number.isNaN(mag)) {
    return cloneVector();
  }
  const normalized: UserVector = { ...ZERO_VECTOR };
  USER_AXES.forEach((axis) => {
    normalized[axis] = vector[axis] / mag;
  });
  return normalized;
}

export interface UserProfile {
  gateId: string;
  vector: UserVector;
  normalized: UserVector;
}

export function computeUserProfile(manifest: Manifest, stored: StoredAnswers): UserProfile | null {
  const gateId = stored.entryGateId ?? manifest.entry_round[0]?.gateId;
  if (!gateId) {
    return null;
  }

  const gate = manifest.gates.find((item) => item.id === gateId);
  if (!gate) {
    return null;
  }

  const answers = stored.gateAnswers[gateId] ?? {};
  const profile = cloneVector();
  const seed = GATE_SEED[gateId];
  if (seed) {
    applyDelta(profile, seed, 1);
  }

  const applyImageVA = (fileName: string | undefined, baseWeight: number) => {
    if (!fileName) {
      return;
    }
    const delta = IMAGE_VA_DELTAS[fileName];
    if (!delta) {
      return;
    }
    applyDelta(profile, delta, baseWeight);
  };

  const applyImageRP = (fileName: string | undefined, baseWeight: number) => {
    if (!fileName) {
      return;
    }
    const delta = IMAGE_RP_DELTAS[fileName];
    if (!delta) {
      return;
    }
    applyDelta(profile, delta, baseWeight);
  };

  const r1 = answers.R1;
  if (r1) {
    applyImageVA(r1, 0.8);
  }

  const r2 = answers.R2;
  if (r2 && TEXT_R2[r2]) {
    applyDelta(profile, TEXT_R2[r2], 0.5);
  }

  const r3 = answers.R3;
  if (r3) {
    applyImageRP(r3, 0.6);
  }

  const r4 = answers.R4;
  if (r4 && TEXT_R4[r4]) {
    applyDelta(profile, TEXT_R4[r4], 0.5);
  }

  const r5 = answers.R5;
  if (r5) {
    const delta = IMAGE_VA_DELTAS[r5];
    if (delta) {
      const combined: Partial<UserVector> = {
        valence: delta.valence * 0.5,
        arousal: delta.arousal * 0.5,
        depth: 0.4
      };
      applyDelta(profile, combined, 0.6);
    }
  }

  const r6 = answers.R6;
  if (r6 && TEXT_R6[r6]) {
    applyDelta(profile, TEXT_R6[r6], 0.5);
  }

  const normalized = normalizeVector(profile);
  return { gateId, vector: profile, normalized };
}
