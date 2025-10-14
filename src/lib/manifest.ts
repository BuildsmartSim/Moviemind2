export type GateQuadrant = 'HV_HA' | 'HV_LA' | 'LV_HA' | 'LV_LA' | 'Neutral';
export type RoundKey = 'R0' | 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6';

export interface ManifestEntryRound {
  gateId: string;
  image: string;
  seedAxes: string[];
}

export interface ManifestGateRound {
  R1_images: string[];
  R2_text_card: string;
  R3_images: string[];
  R4_text_card: string;
  R5_images: 'reuse_A+B_curated_4' | string[];
  R6_text_card: string;
}

export interface ManifestGate {
  id: 'G01' | 'G02' | 'G03' | 'G04' | 'G05';
  name: string;
  quadrant: GateQuadrant;
  rounds: ManifestGateRound;
}

export interface MPCS1Manifest {
  version: string;
  shared: { text_card: string };
  entry_round: ManifestEntryRound[];
  scoring_keys: Record<RoundKey, string[]>;
  gates: ManifestGate[];
}

let manifestPromise: Promise<MPCS1Manifest> | null = null;

export function loadManifest(): Promise<MPCS1Manifest> {
  if (!manifestPromise) {
    manifestPromise = fetch('/data/mpcs1_manifest.json').then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to load manifest: ${response.status}`);
      }
      return (await response.json()) as MPCS1Manifest;
    });
  }

  return manifestPromise;
}
