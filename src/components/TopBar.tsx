interface TopBarProps {
  onBack?: () => void;
}

export function TopBar({ onBack }: TopBarProps) {
  return (
    <header className="flex items-center justify-between gap-4 px-6 py-4">
      <div className="flex items-center gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="rounded-full bg-white/5 px-3 py-2 text-sm font-medium text-textSecondary transition-colors duration-[var(--transition-duration)] ease-cinematic hover:bg-white/10 focus-visible:bg-white/15"
            aria-label="Go back"
          >
            ← Back
          </button>
        ) : (
          <span className="text-sm uppercase tracking-[0.3em] text-textSecondary">Moviemind</span>
        )}
        <span className="text-lg font-semibold text-textPrimary">MPCS-1</span>
      </div>
      <span className="text-xs uppercase tracking-[0.4em] text-textSecondary/60">Cinematic Questionnaire</span>
    </header>
  );
}
