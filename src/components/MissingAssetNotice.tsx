interface MissingAssetNoticeProps {
  show: boolean;
  label?: string;
  className?: string;
}

const DEFAULT_LABEL = 'Asset not found';

export function getAssetPlaceholder(label: string = DEFAULT_LABEL) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" role="img" aria-labelledby="title"><title>${label}</title><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#111827"/><stop offset="100%" stop-color="#1f2937"/></linearGradient></defs><rect width="320" height="200" fill="url(#grad)"/><g fill="none" stroke="#f472b6" stroke-width="4" opacity="0.6"><rect x="24" y="24" width="272" height="152" rx="24" ry="24" stroke-dasharray="12 12"/></g><text x="50%" y="50%" text-anchor="middle" fill="#f9fafb" font-family="'Inter', 'Arial', sans-serif" font-size="18" opacity="0.85">${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function MissingAssetNotice({ show, label = DEFAULT_LABEL, className = '' }: MissingAssetNoticeProps) {
  if (!show) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none absolute right-3 top-3 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-white/80 shadow-lg backdrop-blur ${className}`.trim()}
    >
      <span aria-hidden="true">⚠️</span>
      <span>{label}</span>
    </div>
  );
}
