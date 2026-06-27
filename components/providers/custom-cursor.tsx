'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
  const [hidden, setHidden] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 380, mass: 0.6 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setHidden(false);
    };
    const out = () => setHidden(true);
    const down = () => setClicking(true);
    const up = () => setClicking(false);

    const checkHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest(
        'a, button, [role="button"], input, textarea, select, [data-cursor="hover"]'
      );
      setHovering(!!interactive);
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mousemove', checkHover);
    document.addEventListener('mouseleave', out);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup', up);

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mousemove', checkHover);
      document.removeEventListener('mouseleave', out);
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup', up);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[10000] hidden md:block"
        style={{ x, y }}
        animate={{ opacity: hidden ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full"
          animate={{
            width: hovering ? 56 : 16,
            height: hovering ? 56 : 16,
            backgroundColor: hovering
              ? 'rgba(79, 139, 255, 0.15)'
              : 'rgba(79, 139, 255, 0.9)',
            border: hovering
              ? '1.5px solid rgba(138, 92, 255, 0.8)'
              : '1.5px solid rgba(127, 231, 255, 0.6)',
            scale: clicking ? 0.8 : 1,
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          style={{
            boxShadow: '0 0 24px rgba(79, 139, 255, 0.5)',
          }}
        />
      </motion.div>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[10000] hidden md:block"
        style={{ x: cursorX, y: cursorY }}
        animate={{ opacity: hidden ? 0 : 0.5 }}
      >
        <div
          className="-translate-x-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-white"
          style={{ boxShadow: '0 0 8px rgba(255,255,255,0.8)' }}
        />
      </motion.div>
    </>
  );
}
