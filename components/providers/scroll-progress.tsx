'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed left-0 top-0 z-[9998] h-[2px] w-full origin-left"
      style={{
        scaleX,
        background:
          'linear-gradient(90deg, #4F8BFF 0%, #8A5CFF 50%, #7FE7FF 100%)',
        boxShadow: '0 0 12px rgba(79, 139, 255, 0.6)',
      }}
    />
  );
}
