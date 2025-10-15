import { fetchCsv } from "./csv";
import { FALLBACK_IMG } from "./imagePaths";
import { USER_AXES, normalizeVector, type UserVector } from "./scoring";

const MOVIE_PATHS = ["/data/movies_80s.csv", "/data/movies.csv"];
const SCORE_PATHS = ["/data/scores_80s.csv", "/data/scores.csv"];

export interface MovieRecord {
  movieId: string;
  title: string;
  year?: string;
  synopsis?: string;
  mood?: string;
  posterUrl: string;
  tags: string[];
  themes: string[];
  vector: UserVector;
  normalized: UserVector;
}

type CsvRow = Record<string, string>;

function clamp(value: number): number {
  if (Number.isNaN(value)) return 0;
  if (value > 1) return 1;
  if (value < -1) return -1;
  return value;
}

function parseNumber(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeScoreValue(value: number | null): number {
  if (value == null || Number.isNaN(value)) {
    return 0;
  }
  if (Math.abs(value) <= 1) {
    return value;
  }
  // Assume a 0-100 range and convert to [-1, 1]
  return clamp((value / 100) * 2 - 1);
}

async function fetchFirstAvailable(paths: string[]): Promise<CsvRow[]> {
  let lastError: unknown;
  for (const path of paths) {
    try {
      return await fetchCsv(path);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Failed to load CSV data");
}

function emptyVector(): UserVector {
  return USER_AXES.reduce((acc, axis) => {
    acc[axis] = 0;
    return acc;
  }, {} as UserVector);
}

function buildMovieVector(scores: CsvRow): UserVector {
  const vector = emptyVector();
  const depth = normalizeScoreValue(parseNumber(scores.depth));
  const energy = normalizeScoreValue(parseNumber(scores.energy));
  const tension = normalizeScoreValue(parseNumber(scores.tension));
  const sociality = normalizeScoreValue(parseNumber(scores.sociality));
  const romance = normalizeScoreValue(parseNumber(scores.romance));
  const realism = normalizeScoreValue(parseNumber(scores.realism));
  const comfort = normalizeScoreValue(parseNumber(scores.comfort));
  const pacing = normalizeScoreValue(parseNumber(scores.pacing));

  vector.depth = depth;
  vector.energy = energy;
  vector.sociality = sociality;
  vector.romance = romance;
  vector.realism = realism;
  vector.comfort = comfort;
  vector.pacing = pacing;

  const derivedValence = clamp((depth + romance - tension) / 3);
  const derivedDominance = clamp(-tension);
  vector.valence = derivedValence;
  vector.dominance = derivedDominance;
  vector.arousal = energy;

  return vector;
}

function splitTokens(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(/[,|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function loadMovieLibrary(): Promise<MovieRecord[]> {
  const [movies, scores] = await Promise.all([
    fetchFirstAvailable(MOVIE_PATHS),
    fetchFirstAvailable(SCORE_PATHS)
  ]);

  const scoreById = new Map<string, CsvRow>();
  scores.forEach((row) => {
    const key = row.movie_id || row.movieId || row.id;
    if (key) {
      scoreById.set(String(key).trim(), row);
    }
  });

  const results: MovieRecord[] = [];
  movies.forEach((row) => {
    const key = row.movie_id || row.movieId || row.id;
    if (!key) {
      return;
    }
    const trimmedKey = String(key).trim();
    const scoreRow = scoreById.get(trimmedKey);
    if (!scoreRow) {
      return;
    }

    const vector = buildMovieVector(scoreRow);
    const normalized = normalizeVector(vector);
    const poster = row.poster_url?.trim() || row.posterUrl?.trim();

    results.push({
      movieId: trimmedKey,
      title: row.title || row.name || "Untitled",
      year: row.year || row.release_year,
      synopsis: row.synopsis || row.logline || row.description,
      mood: row.mood,
      posterUrl: poster || FALLBACK_IMG,
      tags: splitTokens(row.aesthetic_tags || row.tags),
      themes: splitTokens(row.themes),
      vector,
      normalized
    });
  });

  return results;
}

