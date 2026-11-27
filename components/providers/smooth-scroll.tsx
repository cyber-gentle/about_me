'use client';

import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';

// Shared handle so scroll-driven sections can glide with Lenis
// (e.g. snapping a showcase card into focus) instead of fighting it.
export const lenisRef: { current: Lenis | null } = { current: null };

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRefLocal = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;
    lenisRefLocal.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
