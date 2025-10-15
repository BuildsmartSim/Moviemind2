import React from "react";
import { normalizeVignette } from "../lib/manifest";

type Opt = { id: 'A'|'B'|'C'; text: string };

export default function TextRoundCard({
  roundLabel, vignette, sharedTextCardSrc, options, value, onChange
}: {
  roundLabel: string;
  vignette: string | string[] | undefined;
  sharedTextCardSrc: string; // from manifest.shared.text_card
  options: Opt[];
  value?: string;
  onChange: (id: Opt['id']) => void;
}) {
  const lines = normalizeVignette(vignette);
  const fallbackDataUrl =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGD4DwABAgEAfVd7VwAAAABJRU5ErkJggg==";

  return (
    <div className="w-full flex justify-center">
      <div className="relative rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.45)] bg-[color:var(--mm-bg-1)] max-w-md w-full">
        {/* Portrait aspect */}
        <div className="relative w-full aspect-[3/4]">
          <img
            src={sharedTextCardSrc}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = fallbackDataUrl; }}
            alt=""
            className="absolute inset-0 h-full w-full object-contain opacity-60"
          />
          <div className="absolute inset-0 p-5 md:p-6 flex flex-col">
            <div className="tracking-[0.2em] uppercase text-xs md:text-sm text-[color:var(--mm-text-on-dark)]/80">
              {roundLabel}
            </div>

            {lines.length > 0 && (
              <div className="mt-3 space-y-2 text-[color:var(--mm-text-on-card)] text-base leading-7 md:leading-8 bg-white/80 backdrop-blur-sm rounded-xl p-4">
                {lines.map((t, i) => <p key={i}>{t}</p>)}
              </div>
            )}

            <div className="mt-auto">
              <div className="mt-4 divide-y divide-white/10 rounded-2xl bg-white/85 text-[color:var(--mm-text-on-card)]">
                {options.map((o, i) => (
                  <button
                    key={o.id}
                    type="button"
                    role="radio"
                    aria-pressed={value === o.id}
                    onClick={() => onChange(o.id)}
                    className={`w-full text-left p-4 md:p-5 focus-visible:outline-none focus-visible:ring-2 ring-offset-4 ring-offset-black ${
                      i === 0 ? 'rounded-t-2xl' : ''} ${i === options.length - 1 ? 'rounded-b-2xl' : ''}`}
                  >
                    <span className={`mr-2 inline-block w-6 text-center ${value === o.id ? 'text-[var(--mm-amber)]' : 'opacity-70'}`}>{o.id}</span>
                    {o.text}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
