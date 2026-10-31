'use client';

import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { site } from '@/lib/site';
import { buildSocials } from '@/lib/socials';
import type { SiteSettings } from '@/lib/content-types';
import { scrollToHash } from '@/components/providers/smooth-scroll';

export function Footer({ settings }: { settings: SiteSettings }) {
  const socials = buildSocials(settings);
  const scrollTop = () => scrollToHash('#home');

  return (
    <footer className="relative z-10 px-6 pb-10 pt-20">
      <div className="mx-auto max-w-6xl">
        {/* Glass strip */}
        <div className="relative overflow-hidden rounded-3xl glass-card p-8 sm:p-12">
          {/* Top gradient line */}
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(79,139,255,0.6), rgba(138,92,255,0.6), rgba(127,231,255,0.6), transparent)',
            }}
          />

          <div className="flex flex-col items-center gap-8 text-center">
            {/* Animated logo */}
            <button onClick={scrollTop} data-cursor="hover" className="group" aria-label="Back to top">
              <div className="relative flex items-center gap-3">
                <motion.div
                  className="relative h-12 w-12 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#4F8BFF]/30 to-[#8A5CFF]/30"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="absolute inset-0 flex items-center justify-center font-display text-base font-bold text-white">
                    AD
                  </div>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
                  />
                </motion.div>
                <span className="font-display text-lg font-semibold text-white">
                  Abraham<span className="text-[#7FE7FF]">.</span>David
                </span>
              </div>
            </button>

            {/* Tagline */}
            <p className="max-w-md text-sm leading-relaxed text-white/60">
              Building fast, scalable, and beautiful software experiences.
              Let&apos;s create something extraordinary together.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  className="group flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition-all hover:border-white/25 hover:bg-white/10 hover:text-white"
                >
                  <s.icon size={18} />
                </a>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px w-full max-w-md bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Bottom row */}
            <div className="flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-xs text-white/50">
                © {new Date().getFullYear()} {site.name}. Crafted with precision.
              </p>
              <button
                onClick={scrollTop}
                data-cursor="hover"
                className="group flex items-center gap-2 text-xs text-white/60 transition-colors hover:text-white/80"
              >
                Back to top
                <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 transition-all group-hover:border-white/25 group-hover:bg-white/10">
                  <ArrowUp size={13} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
