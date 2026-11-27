'use client';

import { useEffect, useRef } from 'react';

export interface LenisHandle {
  scrollTo: (target: number, options?: { duration?: number }) => void;
  raf: (time: number) => void;
  destroy: () => void;
}

// Shared handle so scroll-driven sections can glide with Lenis
// (e.g. snapping a showcase card into focus) instead of fighting it.
export const lenisRef: { current: LenisHandle | null } = { current: null };

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRefLocal = useRef<LenisHandle | null>(null);

  useEffect(() => {
    let cancelled = false;
    let rafId = 0;
    let lenisInstance: LenisHandle | null = null;

    import('@studio-freight/lenis').then(({ default: LenisCtor }) => {
      if (cancelled) return;
      const lenis = new LenisCtor({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });
      lenisInstance = lenis;
      lenisRef.current = lenis;
      lenisRefLocal.current = lenis;

      function raf(time: number) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      lenisInstance?.destroy();
      lenisRef.current = null;
      lenisRefLocal.current = null;
    };
  }, []);

  return <>{children}</>;
}
