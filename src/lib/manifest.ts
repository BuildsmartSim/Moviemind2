export type Quadrant = 'HV_HA'|'HV_LA'|'LV_HA'|'LV_LA'|'Neutral';

export type GateRounds = {
  R1_images: string[];
  R2_text_card: string | string[] | undefined;
  R3_images: string[];
  R4_text_card: string | string[] | undefined;
  R5_images: 'reuse_A+B_curated_4' | string[];
  R6_text_card: string | string[] | undefined;
};

export type Gate = {
  id: 'G01'|'G02'|'G03'|'G04'|'G05';
  name: string;
  quadrant: Quadrant;
  rounds: GateRounds;
};

export type Manifest = {
  version: string;
  shared: { text_card: string }; // path to /assets/cards/BLANK_TARRO_00.png
  entry_round: { gateId: string; image: string; seedAxes?: string[] }[];
  scoring_keys: Record<'R0'|'R1'|'R2'|'R3'|'R4'|'R5'|'R6', string[]>;
  gates: Gate[];
};

export async function loadManifest(): Promise<Manifest> {
  const res = await fetch('/data/mpcs1_manifest.json', { cache: 'no-cache' });
  if (!res.ok) throw new Error('Manifest load failed');
  return res.json();
}

// Turn a string or string[] into clean lines for the tarot text.
// Ignore lines that look like asset paths (we don't want "/assets/..." showing as prose).
export function normalizeVignette(input: string | string[] | undefined): string[] {
  const toLines = (s: string) => s.split(/\r?\n/).map(x => x.trim());
  const raw = Array.isArray(input) ? input : (input ? toLines(input) : []);
  const pathLike = /^\/assets\/|^data:image\//i;
  return raw.filter(Boolean).filter(line => !pathLike.test(line));
}
