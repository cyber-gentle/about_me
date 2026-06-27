'use client';

import { motion } from 'framer-motion';

export function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Base radial vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(79,139,255,0.08), transparent 60%), radial-gradient(ellipse 60% 50% at 80% 100%, rgba(138,92,255,0.06), transparent 60%)',
        }}
      />

      {/* Animated aurora blobs */}
      <motion.div
        className="absolute -left-40 top-[-10%] h-[40rem] w-[40rem] rounded-full blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, rgba(79,139,255,0.18) 0%, transparent 70%)',
        }}
        animate={{
          x: [0, 80, -40, 0],
          y: [0, 60, 30, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[-10%] top-[20%] h-[36rem] w-[36rem] rounded-full blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, rgba(138,92,255,0.16) 0%, transparent 70%)',
        }}
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 40, -50, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-10%] left-[30%] h-[32rem] w-[32rem] rounded-full blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, rgba(127,231,255,0.12) 0%, transparent 70%)',
        }}
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 20, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Subtle grid overlay */}
      <div className="grid-bg absolute inset-0 opacity-40" />

      {/* Top fade */}
      <div
        className="absolute inset-x-0 top-0 h-32"
        style={{
          background:
            'linear-gradient(180deg, rgba(5,5,5,0.8) 0%, transparent 100%)',
        }}
      />
    </div>
  );
}
