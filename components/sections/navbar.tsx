'use client';

import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { LiveClock } from '@/components/live-clock';
import { cn } from '@/lib/utils';

const links = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Stack', href: '#techstack' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('#home');
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      // Hide when scrolling down, slide back in on any upward scroll.
      // Always visible near the top of the page so the hero entry point
      // stays reachable.
      if (y < 80) {
        setHidden(false);
      } else if (y < lastY.current) {
        setHidden(false);
      } else if (y > lastY.current + 4) {
        setHidden(true);
      }
      lastY.current = y;
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
    <header
      className={cn(
        'fixed inset-x-0 top-3 z-[9990] px-4 transition-all duration-300 ease-out',
        hidden && !open
          ? '-translate-y-[130%] opacity-0'
          : 'translate-y-0 opacity-100'
      )}
    >
      <div
        className={cn(
          'mx-auto flex h-14 max-w-[1160px] items-center justify-between rounded-2xl px-4 sm:px-5 transition-all duration-300',
          scrolled
            ? 'glass-strong border border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.55)]'
            : 'border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
        )}
      >
        {/* Brand */}
        <button
          onClick={() => go('#home')}
          className="group flex items-center gap-2.5 text-left"
          data-cursor="hover"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-gradient-to-br from-[#4F8BFF]/30 to-[#8A5CFF]/30 font-mono text-xs font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
            AD
          </div>
          <span className="font-display text-sm font-semibold tracking-tight text-white">
            Abraham<span className="text-[#7FE7FF]">.</span>David
          </span>
        </button>

        {/* Desktop links */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {links.map((link) => {
            const isActive = active === link.href;
            return (
              <button
                key={link.href}
                onClick={() => go(link.href)}
                data-cursor="hover"
                className={cn(
                  'relative rounded-xl px-3 py-1.5 text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]'
                    : 'text-white/60 hover:bg-white/[0.05] hover:text-white'
                )}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="hidden items-center gap-4 md:flex">
          <LiveClock />
          <button
            onClick={() => go('#contact')}
            data-cursor="hover"
            className="rounded-xl bg-gradient-to-r from-[#4F8BFF] to-[#8A5CFF] px-4 py-1.5 text-sm font-medium text-white shadow-[0_4px_20px_rgba(79,139,255,0.4)] transition-all duration-150 hover:shadow-[0_6px_26px_rgba(79,139,255,0.6)]"
          >
            Get in touch
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] text-white backdrop-blur-md md:hidden"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="mx-auto mt-2 max-w-[1160px] rounded-2xl border border-white/15 bg-white/[0.06] p-4 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.5)] md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <button
                key={link.href}
                onClick={() => go(link.href)}
                className={cn(
                  'rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors duration-150',
                  active === link.href
                    ? 'bg-white/10 text-white'
                    : 'text-white/65 hover:bg-white/[0.05] hover:text-white'
                )}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => go('#contact')}
              className="mt-2 rounded-xl bg-gradient-to-r from-[#4F8BFF] to-[#8A5CFF] px-3 py-2 text-center text-sm font-medium text-white shadow-[0_4px_20px_rgba(79,139,255,0.35)]"
            >
              Get in touch
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
