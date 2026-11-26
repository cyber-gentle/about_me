'use client';

import { useEffect, useState } from 'react';
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
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('#home');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
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
        'fixed inset-x-0 top-0 z-[9990] border-b transition-colors duration-150 ease-out',
        scrolled
          ? 'border-[#434850] bg-[#0C0E12]/95'
          : 'border-transparent bg-[#0C0E12]/80'
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <button
          onClick={() => go('#home')}
          className="group flex items-center gap-2.5 text-left"
          data-cursor="hover"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#434850] bg-[#161A1F] font-mono text-xs font-medium text-[#B0C8EC]">
            AD
          </div>
          <span className="font-display text-sm font-semibold tracking-tight text-[#E2E5EF]">
            Abraham David
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
                  'relative rounded-[6px] px-3 py-1.5 text-sm font-medium transition-colors duration-150 ease-out',
                  isActive
                    ? 'text-[#B0C8EC]'
                    : 'text-[#A7ABB4] hover:text-[#E2E5EF]'
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-[2px] bg-[#B0C8EC]" />
                )}
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
            className="rounded-[6px] bg-[#B0C8EC] px-3.5 py-1.5 text-sm font-medium text-[#29425F] transition-colors duration-150 ease-out hover:bg-[#D3E4FF]"
          >
            Get in touch
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-[#434850] bg-[#161A1F] text-[#E2E5EF] md:hidden"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-[#434850] bg-[#101418] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <button
                key={link.href}
                onClick={() => go(link.href)}
                className={cn(
                  'rounded-[6px] px-3 py-2 text-left text-sm font-medium transition-colors duration-150 ease-out',
                  active === link.href
                    ? 'bg-[#161A1F] text-[#B0C8EC]'
                    : 'text-[#A7ABB4] hover:bg-[#161A1F] hover:text-[#E2E5EF]'
                )}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => go('#contact')}
              className="mt-2 rounded-[6px] bg-[#B0C8EC] px-3 py-2 text-center text-sm font-medium text-[#29425F]"
            >
              Get in touch
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
