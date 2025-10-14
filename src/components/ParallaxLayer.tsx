import type { PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';

function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return false;
    }

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => setPrefersReducedMotion(mediaQuery.matches);

    handler();
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

interface ParallaxLayerProps extends PropsWithChildren {
  offset?: number;
}

export function ParallaxLayer({ children, offset = 16 }: ParallaxLayerProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [transform, setTransform] = useState('translate3d(0, 0, 0)');

  useEffect(() => {
    if (prefersReducedMotion) {
      setTransform('translate3d(0, 0, 0)');
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (event.clientX / innerWidth - 0.5) * offset;
      const y = (event.clientY / innerHeight - 0.5) * offset;
      setTransform(`translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`);
    };

    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [offset, prefersReducedMotion]);

  return (
    <div
      style={{
        transform,
        transition: `transform var(--transition-duration) cubic-bezier(0.22, 1, 0.36, 1)`
      }}
    >
      {children}
    </div>
  );
}
