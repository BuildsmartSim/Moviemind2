import type { PropsWithChildren } from 'react';
import clsx from 'clsx';

interface CardProps extends PropsWithChildren {
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export function Card({ as: Component = 'div', className, children }: CardProps) {
  return (
    <Component
      className={clsx(
        'relative overflow-hidden rounded-3xl bg-surfaceSoft/80 p-6 shadow-ambient backdrop-blur-xl transition-shadow duration-[var(--transition-duration)] ease-cinematic',
        'border border-white/5 hover:shadow-glow focus-within:shadow-glow',
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20" aria-hidden />
      <div className="relative pointer-events-auto">{children}</div>
    </Component>
  );
}
