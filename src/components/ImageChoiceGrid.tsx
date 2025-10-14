import { useId, useMemo, useState, type SyntheticEvent } from 'react';
import { MissingAssetNotice, getAssetPlaceholder } from './MissingAssetNotice';

interface ImageChoice {
  src: string;
  alt: string;
  key: string;
}

interface ImageChoiceGridProps {
  images: ImageChoice[];
  value?: string;
  onChange: (key: string) => void;
}

export function ImageChoiceGrid({ images, value, onChange }: ImageChoiceGridProps) {
  const groupId = useId();
  const fallbackSrc = useMemo(() => getAssetPlaceholder(), []);
  const [missingAssets, setMissingAssets] = useState<Record<string, boolean>>({});

  const handleImageError = (imageKey: string) => (event: SyntheticEvent<HTMLImageElement>) => {
    const { currentTarget } = event;
    if (currentTarget.src === fallbackSrc) {
      return;
    }
    currentTarget.src = fallbackSrc;
    setMissingAssets((previous) => {
      if (previous[imageKey]) {
        return previous;
      }
      return { ...previous, [imageKey]: true };
    });
  };

  return (
    <div role="radiogroup" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {images.map((image) => {
        const isSelected = image.key === value;
        return (
          <label
            key={image.key}
            className={`group relative block cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-surfaceSoft/60 shadow-ambient transition-all duration-[var(--transition-duration)] ease-cinematic hover:border-white/15 focus-within:border-accent ${
              isSelected ? 'ring-2 ring-accent ring-offset-2 ring-offset-surface' : ''
            }`}
          >
            <input
              type="radio"
              name={`image-choice-${groupId}`}
              value={image.key}
              className="sr-only"
              checked={isSelected}
              onChange={() => onChange(image.key)}
            />
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              onError={handleImageError(image.key)}
              className="h-56 w-full object-cover transition-transform duration-[var(--transition-duration)] ease-cinematic group-hover:scale-[1.02]"
            />
            <MissingAssetNotice show={Boolean(missingAssets[image.key])} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/40" aria-hidden />
            <div className="absolute bottom-4 left-4 text-sm font-medium text-white/80">{image.alt}</div>
          </label>
        );
      })}
    </div>
  );
}
