interface FooterNavProps {
  onBack?: () => void;
  onNext?: () => void;
}

export function FooterNav({ onBack, onNext }: FooterNavProps) {
  return (
    <footer className="flex items-center justify-between gap-4 px-6 py-6">
      <button
        type="button"
        onClick={onBack}
        disabled={!onBack}
        className="rounded-full border border-white/10 px-5 py-2 text-sm font-medium text-textSecondary transition-all duration-[var(--transition-duration)] ease-cinematic hover:border-white/20 hover:text-textPrimary focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-40"
      >
        Back
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!onNext}
        className="rounded-full bg-accent/90 px-6 py-2 text-sm font-semibold text-black transition-colors duration-[var(--transition-duration)] ease-cinematic hover:bg-accent focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </footer>
  );
}
