import { type MutableRefObject, useRef, useState } from "react";
import { FALLBACK_IMG, imageSrcFor } from "../lib/imagePaths";

type Img = {
  id: string;
  alt: string;
  fileName?: string;
  src?: string;
};

export default function ImageChoiceGrid({
  images, value, onChange
}: {
  images: Img[];
  value?: string;
  onChange: (k: string) => void;
}) {
  const warned = useRef<Set<string>>(new Set());

  return (
    <div role="radiogroup" className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {images.map((img, index) => (
        <ImageChoiceTile
          key={`${img.id}-${index}`}
          image={img}
          selected={img.id === value}
          onSelect={() => onChange(img.id)}
          warned={warned}
        />
      ))}
    </div>
  );
}

function ImageChoiceTile({
  image,
  selected,
  onSelect,
  warned
}: {
  image: Img;
  selected: boolean;
  onSelect: () => void;
  warned: MutableRefObject<Set<string>>;
}) {
  const initialSrc = image.fileName ? imageSrcFor(image.fileName) : image.src || FALLBACK_IMG;
  const [resolved, setResolved] = useState(initialSrc);

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={`group relative overflow-hidden rounded-2xl ring-offset-4 ring-offset-black transition focus-visible:ring-2 hover:scale-[1.02] aspect-[3/4] ${
        selected ? "ring-2 ring-[var(--mm-amber)]" : ""
      }`}
    >
      <img
        src={resolved}
        alt={image.alt}
        loading="lazy"
        decoding="async"
        onError={() => {
          if (resolved === FALLBACK_IMG) {
            return;
          }
          if (!warned.current.has(initialSrc)) {
            warned.current.add(initialSrc);
            // eslint-disable-next-line no-console
            console.warn("Missing asset:", initialSrc);
          }
          setResolved(FALLBACK_IMG);
        }}
        className="h-full w-full object-cover object-center opacity-95"
      />
      <span className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]" />
    </button>
  );
}
