'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { LiveClock } from '@/components/live-clock';
import { cn } from '@/lib/utils';

const links = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('#home');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = links.map((l) => l.href.slice(1));
      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) {
          setActive('#' + id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="fixed left-1/2 top-4 z-[9990] w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2"
      >
        <div
          className={cn(
            'flex items-center justify-between rounded-2xl px-5 py-3 transition-all duration-500',
            scrolled
              ? 'glass-strong shadow-2xl'
              : 'border border-transparent bg-transparent'
          )}
        >
          {/* Logo */}
          <button
            onClick={() => go('#home')}
            className="group flex items-center gap-2.5"
            data-cursor="hover"
          >
            <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#4F8BFF]/30 to-[#8A5CFF]/30">
              <div className="absolute inset-0 flex items-center justify-center font-display text-sm font-bold text-white">
                AD
              </div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
              />
            </div>
            <span className="font-display text-sm font-semibold tracking-tight text-white/90">
              Abraham<span className="text-[#7FE7FF]">.</span>David
            </span>
          </button>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <button
                key={link.href}
                onClick={() => go(link.href)}
                data-cursor="hover"
                className={cn(
                  'relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
                  active === link.href
                    ? 'text-white'
                    : 'text-white/50 hover:text-white/90'
                )}
              >
                {link.label}
                {active === link.href && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-2 -bottom-0.5 h-[2px] rounded-full"
                    style={{
                      background:
                        'linear-gradient(90deg, #4F8BFF, #8A5CFF, #7FE7FF)',
                    }}
                    transition={{ type: 'spring', damping: 22, stiffness: 280 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden items-center gap-4 md:flex">
            <LiveClock />
            <button
              onClick={() => go('#contact')}
              data-cursor="hover"
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-all hover:border-white/20"
            >
              <span className="relative z-10">Let&apos;s Talk</span>
              <motion.div
                className="absolute inset-0 origin-left bg-gradient-to-r from-[#4F8BFF] to-[#8A5CFF]"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
                style={{ transformOrigin: 'left' }}
              />
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-2 text-white/70 md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed left-1/2 top-20 z-[9990] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 md:hidden"
          >
            <div className="glass-strong flex flex-col gap-1 rounded-2xl p-3">
              {links.map((link) => (
                <button
                  key={link.href}
                  onClick={() => go(link.href)}
                  className={cn(
                    'rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors',
                    active === link.href
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  )}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
