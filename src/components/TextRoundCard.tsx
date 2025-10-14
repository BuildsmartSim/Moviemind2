import { useMemo, useState, type SyntheticEvent } from 'react';
import { MissingAssetNotice, getAssetPlaceholder } from './MissingAssetNotice';

interface TextRoundOption {
  id: 'A' | 'B' | 'C';
  text: string;
}

interface TextRoundCardProps {
  roundLabel: string;
  vignette: string[];
  options: TextRoundOption[];
  value?: string;
  onChange: (id: 'A' | 'B' | 'C') => void;
}

const CARD_ART_SRC = '/assets/cards/BLANK_TARRO_00.png';

export function TextRoundCard({ roundLabel, vignette, options, value, onChange }: TextRoundCardProps) {
  const fallbackSrc = useMemo(() => getAssetPlaceholder('Card art missing'), []);
  const [isFallback, setIsFallback] = useState(false);

  const handleCardError = (event: SyntheticEvent<HTMLImageElement>) => {
    const { currentTarget } = event;
    if (currentTarget.src === fallbackSrc) {
      return;
    }
    currentTarget.src = fallbackSrc;
    setIsFallback(true);
  };

  return (
    <div className="flex flex-col gap-6 rounded-3xl bg-surfaceSoft/80 p-6 shadow-ambient backdrop-blur-xl">
      <div className="relative overflow-hidden rounded-2xl border border-white/5 p-8">
        <img
          src={CARD_ART_SRC}
          alt=""
          aria-hidden="true"
          loading="lazy"
          onError={handleCardError}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden />
        <MissingAssetNotice show={isFallback} className="right-4 top-4" label="Card art missing" />
        <div className="relative space-y-3 text-textPrimary">
          <span className="text-xs uppercase tracking-[0.3em] text-textSecondary">{roundLabel}</span>
          {vignette.map((paragraph, index) => (
            <p key={index} className="text-base leading-relaxed text-textPrimary">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
      <fieldset className="flex flex-col gap-3" aria-label={`${roundLabel} options`}>
        {options.map((option) => {
          const isSelected = option.id === value;
          return (
            <label
              key={option.id}
              className={`group flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/5 bg-surfaceSoft/60 px-4 py-3 text-left transition-all duration-[var(--transition-duration)] ease-cinematic hover:border-white/15 focus-within:border-accent ${
                isSelected ? 'ring-2 ring-accent ring-offset-2 ring-offset-surface' : ''
              }`}
            >
              <input
                type="radio"
                name={`text-round-${roundLabel}`}
                value={option.id}
                className="sr-only"
                checked={isSelected}
                onChange={() => onChange(option.id)}
              />
              <div className="flex flex-1 items-center gap-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-textPrimary transition-all duration-[var(--transition-duration)] ease-cinematic group-hover:bg-white/20">
                  {option.id}
                </span>
                <span className="text-sm text-textPrimary/90">{option.text}</span>
              </div>
            </label>
          );
        })}
      </fieldset>
    </div>
  );
}
