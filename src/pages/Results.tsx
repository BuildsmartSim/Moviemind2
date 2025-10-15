import { useEffect, useMemo, useState } from "react";
import type { AnswersState } from "../App";
import type { Manifest } from "../lib/manifest";
import { FALLBACK_IMG } from "../lib/imagePaths";
import { loadMovieLibrary, type MovieRecord } from "../lib/movies";
import {
  USER_AXES,
  computeUserProfile,
  loadAnswers as loadStoredAnswers,
  type AxisKey,
  type UserProfile,
  type StoredAnswers
} from "../lib/scoring";

const AXIS_DISPLAY: Record<AxisKey, string> = {
  valence: "valence",
  arousal: "energy",
  comfort: "comfort",
  dominance: "dominance",
  sociality: "sociality",
  realism: "realism",
  pacing: "pacing",
  depth: "depth",
  romance: "romance",
  energy: "drive"
};

interface ResultsProps {
  manifest: Manifest;
  answers: AnswersState;
}

type Recommendation = MovieRecord & {
  score: number;
  axes: string[];
};

function dotProduct(a: UserProfile["normalized"], b: MovieRecord["normalized"]): number {
  return USER_AXES.reduce((sum, axis) => sum + (a[axis] ?? 0) * (b[axis] ?? 0), 0);
}

function pickTopAxes(profile: UserProfile, movie: MovieRecord): string[] {
  const contributions = USER_AXES.map((axis) => {
    const weight = (profile.normalized[axis] ?? 0) * (movie.normalized[axis] ?? 0);
    return { axis, weight };
  }).filter((entry) => Math.abs(entry.weight) > 0.01);

  contributions.sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight));
  return contributions.slice(0, 2).map((entry) => AXIS_DISPLAY[entry.axis]);
}

function resolveStoredAnswers(answers: AnswersState | undefined): StoredAnswers {
  if (answers) {
    return {
      entryGateId: answers.entryGateId,
      gateAnswers: answers.gateAnswers ?? {}
    };
  }
  return loadStoredAnswers();
}

export default function Results({ manifest, answers }: ResultsProps) {
  const [movies, setMovies] = useState<MovieRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    loadMovieLibrary()
      .then((items) => {
        if (!active) return;
        setMovies(items);
        setError(null);
      })
      .catch((err: unknown) => {
        if (!active) return;
        const message = err instanceof Error ? err.message : "Data unavailable";
        setError(message);
        setMovies([]);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const stored = useMemo(() => resolveStoredAnswers(answers), [answers]);
  const userProfile = useMemo(() => computeUserProfile(manifest, stored), [manifest, stored]);

  const recommendations: Recommendation[] = useMemo(() => {
    if (!userProfile) {
      return [];
    }
    const ranked = movies
      .map((movie) => {
        const score = dotProduct(userProfile.normalized, movie.normalized);
        return {
          ...movie,
          score,
          axes: pickTopAxes(userProfile, movie)
        };
      })
      .filter((item) => Number.isFinite(item.score))
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    return ranked.slice(0, 3);
  }, [movies, userProfile]);

  useEffect(() => {
    if (import.meta.env.DEV && userProfile) {
      // eslint-disable-next-line no-console
      console.groupCollapsed("MPCS-1 scoring");
      // eslint-disable-next-line no-console
      console.log("user vector", userProfile.normalized);
      if (recommendations.length) {
        // eslint-disable-next-line no-console
        console.table(
          recommendations.map((rec) => ({
            title: rec.title,
            score: rec.score.toFixed(3)
          }))
        );
      }
      // eslint-disable-next-line no-console
      console.groupEnd();
    }
  }, [recommendations, userProfile]);

  const missingProfile = !userProfile;
  const insufficient = !missingProfile && recommendations.length < 3 && !loading && !error;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 pb-12 pt-10 text-textPrimary">
      <div>
        <h1 className="text-3xl font-semibold md:text-4xl">MPCS-1 Results</h1>
        {userProfile ? (
          <p className="mt-2 text-sm text-textSecondary">
            Gate: <span className="font-medium">{userProfile.gateId}</span>
          </p>
        ) : null}
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200">
          {error || "Data unavailable"}
        </div>
      ) : null}

      {missingProfile ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-textSecondary">
          We could not find your MPCS-1 selections. Restart the experience to generate fresh results.
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((movie) => (
          <article
            key={movie.movieId}
            className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-ambient"
          >
            <div className="relative w-full overflow-hidden bg-black/20 aspect-[3/4]">
              <img
                src={movie.posterUrl || FALLBACK_IMG}
                alt={movie.title}
                className="h-full w-full object-cover object-center"
                onError={(event) => {
                  if ((event.currentTarget as HTMLImageElement).src !== FALLBACK_IMG) {
                    (event.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
                  }
                }}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5 text-sm">
              <div>
                <h2 className="text-lg font-semibold text-white">{movie.title}</h2>
                {movie.year ? <p className="text-xs text-textSecondary">{movie.year}</p> : null}
                {movie.mood ? <p className="text-xs text-textSecondary/80">Mood: {movie.mood}</p> : null}
              </div>
              {movie.synopsis ? (
                <p className="line-clamp-3 text-sm text-textSecondary" style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {movie.synopsis}
                </p>
              ) : null}
              {movie.tags.length ? (
                <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.2em] text-textSecondary/70">
                  {movie.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="rounded-full bg-white/10 px-2 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="mt-auto rounded-2xl bg-white/10 px-4 py-3 text-xs text-textSecondary">
                {movie.axes.length ? `Why this? matches your ${movie.axes.join(" and ")}.` : "Why this? Aligns with your MPCS-1 profile."}
              </div>
            </div>
          </article>
        ))}
      </div>

      {insufficient ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-textSecondary">
          We only found {recommendations.length} film{recommendations.length === 1 ? "" : "s"} with complete score data.
        </div>
      ) : null}

      <div>
        <a href="/" className="inline-flex rounded-2xl bg-[#E8E3D8] px-6 py-3 text-sm font-medium text-[#1C1C1C] transition hover:opacity-90">
          Restart MPCS-1
        </a>
      </div>
    </div>
  );
}
