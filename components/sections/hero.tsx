'use client';

import { ArrowRight, Mail, Sparkles, Terminal } from 'lucide-react';
import { TerminalShell } from '@/components/sections/terminal-shell';

export function Hero() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative pt-28 pb-16 sm:pt-36 sm:pb-24"
    >
      <div className="mx-auto max-w-[1220px] px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          {/* Left: Editorial headline & CTAs */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1.5 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
              <Sparkles size={13} className="text-[#7FE7FF]" />
              <span className="font-mono text-xs font-medium text-white/80">
                Backend Developer &amp; Software Engineer
              </span>
            </div>

            <h1 className="font-display text-[32px] font-bold leading-[38px] tracking-[-0.5px] sm:text-[48px] sm:leading-[54px] sm:tracking-[-0.75px]">
              <span className="text-gradient">Building fast, reliable</span>{' '}
              <span className="text-gradient-blue">backend systems</span>{' '}
              <span className="text-gradient">and clean web software.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65 sm:text-[18px] sm:leading-[28px]">
              I design and ship production APIs, data pipelines, and cloud-native
              services in Go and TypeScript—focused on low latency, clear
              architecture, and measurable reliability.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => scrollTo('#projects')}
                data-cursor="hover"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#4F8BFF] to-[#8A5CFF] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_28px_rgba(79,139,255,0.4)] transition-all duration-150 hover:shadow-[0_12px_36px_rgba(79,139,255,0.6)]"
              >
                View projects
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => scrollTo('#contact')}
                data-cursor="hover"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-5 py-2.5 text-sm font-medium text-white/90 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-all duration-150 hover:border-white/25 hover:bg-white/[0.1]"
              >
                <Mail size={16} className="text-[#7FE7FF]" />
                Contact me
              </button>
            </div>
          </div>

          {/* Right: Frosted glass MacBook terminal window with ambient glow */}
          <div className="relative">
            {/* Ambient multi-stop glow */}
            <div
              className="pointer-events-none absolute -inset-4 rounded-3xl opacity-50 blur-2xl"
              style={{
                background:
                  'radial-gradient(circle at 20% 20%, rgba(79,139,255,0.28), transparent 55%), radial-gradient(circle at 80% 80%, rgba(138,92,255,0.25), transparent 55%)',
              }}
              aria-hidden="true"
            />

            <div className="relative overflow-hidden rounded-2xl border border-white/25 bg-white/[0.08] backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(79,139,255,0.18),inset_0_1px_0_rgba(255,255,255,0.22)]">
              {/* macOS window title bar */}
              <div className="flex items-center gap-3 border-b border-white/15 bg-white/[0.06] px-4 py-2.5">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs font-medium text-white/85">
                  <Terminal size={13} className="text-[#7FE7FF]" />
                  <span>guest@abdavid — zsh</span>
                </div>
              </div>

              <TerminalShell />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
