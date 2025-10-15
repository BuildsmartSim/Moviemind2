export type Answers = Record<'R1'|'R2'|'R3'|'R4'|'R5'|'R6', string | undefined>;
export type Score = { quadrant: 'HV_HA'|'HV_LA'|'LV_HA'|'LV_LA'|'Neutral' };

export function loadAnswers(): Answers {
  try {
    return JSON.parse(localStorage.getItem('mm.mpcs1.answers.v1') || '{}');
  } catch { return {} as any; }
}

export function scoreAnswers(ans: Answers): Score {
  let hv = 0, ha = 0;
  const add = (r?: string) => {
    if (!r) return;
    if (r === 'A') { hv += 1; ha += 1; }
    if (r === 'B') { hv += 1; ha -= 1; }
    if (r === 'C') { hv -= 1; ha -= 1; }
  };
  add(ans.R2); add(ans.R4); add(ans.R6);

  const quadrant =
    hv >= 0 && ha >= 0 ? 'HV_HA' :
    hv >= 0 && ha <  0 ? 'HV_LA' :
    hv <  0 && ha >= 0 ? 'LV_HA' : 'LV_LA';

  return { quadrant };
}
