'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { LiveClock } from '@/components/live-clock';
import { cn } from '@/lib/utils';
import { handleAnchorClick } from '@/components/providers/smooth-scroll';

const links = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'GitHub', href: '#github' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

const sectionIds = ['home', ...links.map((l) => l.href.slice(1))];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('#home');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      for (const id of sectionIds) {
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

  const onLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setOpen(false);
    handleAnchorClick(e);
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[10002] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-black"
      >
        Skip to content
      </a>
      <motion.nav
        aria-label="Primary"
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
          <a
            href="#home"
            onClick={onLink}
            aria-label="Abraham David — back to top"
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
          </a>

          {/* Desktop links */}
          <div className="hidden items-center gap-0.5 lg:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={onLink}
                aria-current={active === link.href ? 'location' : undefined}
                data-cursor="hover"
                className={cn(
                  'relative rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  active === link.href
                    ? 'text-white'
                    : 'text-white/60 hover:text-white/90'
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
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden items-center gap-4 lg:flex">
            <div className="hidden xl:block">
              <LiveClock />
            </div>
            <a
              href="#contact"
              onClick={onLink}
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
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-2 text-white/70 lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed left-1/2 top-20 z-[9990] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 lg:hidden"
          >
            <div className="glass-strong flex flex-col gap-1 rounded-2xl p-3">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={onLink}
                  aria-current={active === link.href ? 'location' : undefined}
                  className={cn(
                    'rounded-xl px-4 py-3 text-left text-sm font-medium transition-colors',
                    active === link.href
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  )}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
