import React, { useRef } from "react";

type Img = { src: string; alt: string; key: string };

export default function ImageChoiceGrid({
  images, value, onChange
}: {
  images: Img[];
  value?: string;
  onChange: (k: string) => void;
}) {
  const warned = useRef<Set<string>>(new Set());
  const fallbackDataUrl =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGD4DwABAgEAfVd7VwAAAABJRU5ErkJggg==";

  return (
    <div role="radiogroup" className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
      {images.map(img => {
        const sel = img.key === value;
        return (
          <button
            key={img.key}
            role="radio"
            aria-checked={sel}
            onClick={() => onChange(img.key)}
            className={`group relative aspect-[2.39/1] overflow-hidden rounded-2xl ring-offset-4 ring-offset-black focus-visible:ring-2 transition hover:scale-[1.02] ${sel ? 'ring-2 ring-[var(--mm-amber)]' : ''}`}
          >
            <img
              src={img.src}
              alt={img.alt}
              onError={(e) => {
                const src = (e.currentTarget as HTMLImageElement).src;
                if (!warned.current.has(src)) {
                  warned.current.add(src);
                  // eslint-disable-next-line no-console
                  console.warn('Missing asset:', src);
                }
                (e.currentTarget as HTMLImageElement).src = fallbackDataUrl;
              }}
              className="h-full w-full object-cover opacity-95"
            />
            <span className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]" />
          </button>
        );
      })}
    </div>
  );
}
