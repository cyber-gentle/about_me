'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Mail, Terminal } from 'lucide-react';

const pythonLines = [
  { text: 'class Me:', tone: 'keyword' },
  { text: '    def __init__(self):', tone: 'keyword' },
  { text: "        self.name = 'Abraham David'", tone: 'string' },
  { text: "        self.role = 'Backend Developer & Software Engineer'", tone: 'string' },
  { text: "        self.primary_stack = ['Go', 'Python', 'TypeScript', 'PostgreSQL', 'Redis']", tone: 'string' },
  { text: "        self.focus = 'Distributed APIs & cloud systems'", tone: 'string' },
  { text: "        self.availability = 'Open for remote roles & consulting'", tone: 'string' },
  { text: "        self.location = 'Remote / Worldwide'", tone: 'string' },
];

export function Hero() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setVisibleLines((prev) =>
        prev >= pythonLines.length + 3 ? 0 : prev + 1
      );
    }, 420);
    return () => clearInterval(id);
  }, []);

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative border-b border-[#434850] bg-gradient-to-b from-[#0C0E12] via-[#0F1726] to-[#101418] pt-28 pb-16 sm:pt-36 sm:pb-24"
    >
      <div className="mx-auto max-w-[1220px] px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          {/* Left: Editorial headline & CTAs */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#434850] bg-[#161A1F] px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-[#B0C8EC]" />
              <span className="font-mono text-xs font-medium text-[#A7ABB4]">
                Backend Developer &amp; Software Engineer
              </span>
            </div>

            <h1 className="font-display text-[32px] font-bold leading-[38px] tracking-[-0.5px] text-[#E2E5EF] sm:text-[48px] sm:leading-[54px] sm:tracking-[-0.75px]">
              Building fast, reliable backend systems and clean web software.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#A7ABB4] sm:text-[18px] sm:leading-[28px]">
              I design and ship production APIs, data pipelines, and cloud-native
              services in Go and TypeScript—focused on low latency, clear
              architecture, and measurable reliability.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => scrollTo('#projects')}
                data-cursor="hover"
                className="inline-flex items-center gap-2 rounded-[6px] bg-[#B0C8EC] px-5 py-2.5 text-sm font-medium text-[#29425F] transition-colors duration-150 ease-out hover:bg-[#D3E4FF]"
              >
                View projects
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => scrollTo('#contact')}
                data-cursor="hover"
                className="inline-flex items-center gap-2 rounded-[6px] border border-[#434850] bg-[#161A1F] px-5 py-2.5 text-sm font-medium text-[#E2E5EF] transition-colors duration-150 ease-out hover:border-[#71767E] hover:bg-[#1C2026]"
              >
                <Mail size={16} className="text-[#A7ABB4]" />
                Contact me
              </button>
            </div>
          </div>

          {/* Right: Mini MacBook terminal window */}
          <div className="relative overflow-hidden rounded-xl border border-[#434850]/90 bg-[#101418] shadow-[0_16px_40px_rgba(0,0,0,0.45)] ring-1 ring-inset ring-white/5">
            {/* macOS window title bar */}
            <div className="relative z-10 flex items-center gap-3 border-b border-[#434850]/80 bg-[#161A1F]/90 px-4 py-2.5">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
              </div>
              <div className="flex items-center gap-1.5 font-mono text-xs text-[#A7ABB4]">
                <Terminal size={12} className="text-[#71767E]" />
                <span>about_me.py</span>
              </div>
            </div>

            <div className="relative z-10 min-h-[220px] space-y-1.5 overflow-x-auto px-4 py-4 font-mono text-[11px] leading-5 sm:text-xs">
              {pythonLines.slice(0, visibleLines).map((line, idx, arr) => {
                const isLast = idx === arr.length - 1;
                return (
                  <div key={idx} className="whitespace-pre">
                    <span
                      className={
                        line.tone === 'keyword'
                          ? 'text-[#B0C8EC]'
                          : line.tone === 'accent'
                            ? 'text-[#E1D7FF]'
                            : line.tone === 'string'
                              ? 'text-[#E2E5EF]'
                              : 'text-[#A7ABB4]'
                      }
                    >
                      {line.text || ' '}
                    </span>
                    {isLast && (
                      <span className="ml-0.5 inline-block h-3.5 w-2 translate-y-0.5 animate-pulse bg-[#B0C8EC]" />
                    )}
                  </div>
                );
              })}
              {visibleLines === 0 && (
                <div>
                  <span className="inline-block h-3.5 w-2 animate-pulse bg-[#B0C8EC]" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
