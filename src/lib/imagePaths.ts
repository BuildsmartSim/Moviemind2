const BASE = "/assets/mpcs1/images";
export const FALLBACK_IMG = "/assets/cards/BLANK_TARRO_00.png";

/** Accepts a filename like "A01_SUN_RUN.png" and returns a public URL */
export function imageSrcFor(fileName?: string): string {
  if (!fileName) return FALLBACK_IMG;
  const clean = fileName.trim().replace(/^[./\\]+/, "");
  const withExtension = clean.includes('.') ? clean : `${clean}.png`;
  return `${BASE}/${withExtension}`;
}
