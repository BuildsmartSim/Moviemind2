interface ProgressRailProps {
  gateIndex: number;
  roundIndex: number;
}

const TOTAL_ROUNDS = 6;

export function ProgressRail({ gateIndex, roundIndex }: ProgressRailProps) {
  return (
    <div className="flex items-center justify-between gap-2 px-6 py-4 text-textSecondary">
      <div className="text-sm uppercase tracking-[0.2em]">Gate {gateIndex + 1}</div>
      <div className="flex flex-1 items-center justify-end gap-2">
        {Array.from({ length: TOTAL_ROUNDS }).map((_, index) => {
          const isActive = index === roundIndex;
          const isComplete = index < roundIndex;
          return (
            <span
              key={index}
              aria-hidden
              className={`h-1.5 flex-1 rounded-full transition-all duration-[var(--transition-duration)] ease-cinematic ${
                isActive
                  ? 'bg-accent shadow-glow'
                  : isComplete
                  ? 'bg-white/40'
                  : 'bg-white/10'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
