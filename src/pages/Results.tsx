import { useEffect, useState } from "react";
import { fetchCsv } from "../lib/csv";
import { loadAnswers, scoreAnswers } from "../lib/scoring";

type Movie = { title?: string; quadrant?: string; year?: string; [k: string]: string|undefined };

export default function Results() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);
  const answers = loadAnswers();
  const { quadrant } = scoreAnswers(answers);

  useEffect(() => {
    (async () => {
      try {
        const rows = await fetchCsv("/data/movies_80s.csv").catch(() => fetchCsv("/data/movies.csv"));
        const q = quadrant.trim();
        const matches = rows.filter(r => (r.quadrant || '').trim() === q);
        setMovie((matches[0] as Movie) || (rows[0] as Movie) || null);
      } catch (e: any) {
        setError(e.message || "No movie data found");
      }
    })();
  }, [quadrant]);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-semibold mb-4">MPCS-1 Results</h1>
      <p className="opacity-80 mb-6">Quadrant: <strong>{quadrant}</strong></p>

      {error && <div className="rounded-xl p-4 bg-red-500/10 border border-red-500/30">{error}</div>}

      {movie ? (
        <div className="rounded-2xl p-5 bg-white/5 border border-white/10">
          <div className="text-xl font-medium">{movie.title || "Untitled"}</div>
          <div className="opacity-80">{movie.year ? `(${movie.year})` : null}</div>
          <div className="mt-2 text-sm opacity-70">Matched on quadrant: {quadrant}</div>
        </div>
      ) : !error ? (
        <div className="rounded-xl p-4 bg-white/5 border border-white/10">
          No movie rows found yet. Add <code>/public/data/movies_80s.csv</code> with a <code>quadrant</code> column.
        </div>
      ) : null}

      <div className="mt-8">
        <a href="/" className="rounded-2xl px-5 py-2 bg-[#E8E3D8] text-[#1C1C1C] hover:opacity-90">Restart</a>
      </div>
    </div>
  );
}
