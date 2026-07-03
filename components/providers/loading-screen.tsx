'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function LoadingScreen() {
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const duration = 1600;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 350);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[10001] flex items-center justify-center bg-[#050505]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <div className="grid-bg absolute inset-0 opacity-20" />
          <div className="relative flex flex-col items-center gap-8">
            <motion.div
              className="relative h-24 w-24"
              animate={{ rotate: 360 }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute inset-0 rounded-full border border-white/10" />
              <div className="absolute inset-0 rounded-full border-t-2 border-[#4F8BFF]" />
              <div
                className="absolute inset-2 rounded-full border-b-2 border-[#8A5CFF]"
                style={{ animation: 'spin 3s linear infinite reverse' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-2xl font-bold text-gradient">
                  AD
                </span>
              </div>
            </motion.div>

            <div className="flex flex-col items-center gap-3">
              <div className="h-[3px] w-56 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    background:
                      'linear-gradient(90deg, #4F8BFF, #8A5CFF, #7FE7FF)',
                  }}
                />
              </div>
              <span className="font-mono text-xs tracking-widest text-white/40">
                {progress}% — INITIALIZING
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
