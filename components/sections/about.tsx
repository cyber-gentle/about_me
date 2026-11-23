'use client';

import { motion, useInView } from 'framer-motion';
import { useMemo, useRef } from 'react';
import { Code2, Heart, Compass, Target } from 'lucide-react';
import { SectionHeading } from '@/components/section-heading';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/providers/reveal';
import { useContent } from '@/components/providers/content-provider';

const PILLAR_ICONS = [Code2, Heart, Compass, Target];



function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <span ref={ref}>
      {inView ? value.toLocaleString() : '0'}
      {suffix}
    </span>
  );
}

export function About() {
  const { aboutStats: stats, aboutPillars: pillarRows } = useContent();

  const pillars = useMemo(
    () =>
      pillarRows.map((p, i) => ({
        ...p,
        icon: PILLAR_ICONS[i % PILLAR_ICONS.length],
        text: p.body,
      })),
    [pillarRows]
  );

  return (
    <section id="about" className="relative z-10 py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="About Me"
          title="The Engineer Behind the Code"
          description="A blend of systems thinking, performance obsession, and a love for building software that scales gracefully."
        />

        <div className="mt-20 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          {/* Image frame */}
          <Reveal>
            <div className="relative mx-auto max-w-sm lg:sticky lg:top-28">
              {/* Glow border */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-[#4F8BFF]/40 via-[#8A5CFF]/30 to-[#7FE7FF]/40 opacity-60 blur-xl" />
              <div className="border-glow relative overflow-hidden rounded-3xl">
                <div className="glass-card overflow-hidden rounded-3xl p-2">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                    {/* Placeholder portrait using gradient + initials */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0a0f1f] via-[#0d0a1f] to-[#0a1a1f]" />
                    <div
                      className="absolute inset-0 opacity-40"
                      style={{
                        background:
                          'radial-gradient(circle at 30% 20%, rgba(79,139,255,0.4), transparent 50%), radial-gradient(circle at 70% 80%, rgba(138,92,255,0.4), transparent 50%)',
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-[7rem] font-bold text-white/10">
                        AD
                      </span>
                    </div>
                    {/* Floating tag */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl glass px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-medium text-white/80">
                          Abraham David
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-white/40">
                        Backend Engineer
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating accent dots */}
              <motion.div
                className="absolute -right-3 top-10 h-3 w-3 rounded-full bg-[#7FE7FF]"
                animate={{ y: [0, -12, 0], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ boxShadow: '0 0 16px #7FE7FF' }}
              />
              <motion.div
                className="absolute -left-3 bottom-20 h-2.5 w-2.5 rounded-full bg-[#8A5CFF]"
                animate={{ y: [0, 10, 0], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                style={{ boxShadow: '0 0 16px #8A5CFF' }}
              />
            </div>
          </Reveal>

          {/* Pillars + stats */}
          <div className="flex flex-col gap-8">
            <StaggerContainer className="grid gap-4 sm:grid-cols-2">
              {pillars.map((p) => (
                <StaggerItem key={p.id}>
                  <div className="group h-full rounded-2xl glass-card p-5 transition-all hover:border-white/20 hover:bg-white/[0.07]">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#4F8BFF]/20 to-[#8A5CFF]/20">
                      <p.icon size={18} className="text-[#7FE7FF]" />
                    </div>
                    <h3 className="mb-2 font-display text-base font-semibold text-white">
                      {p.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-white/50">
                      {p.text}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Stat cards */}
            <StaggerContainer className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((s) => (
                <StaggerItem key={s.id}>
                  <div className="group relative overflow-hidden rounded-2xl glass-card p-5 text-center">
                    <div
                      className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                      style={{
                        background:
                          'radial-gradient(circle at 50% 0%, rgba(79,139,255,0.15), transparent 70%)',
                      }}
                    />
                    <div className="relative font-display text-3xl font-bold text-gradient-blue sm:text-4xl">
                      <CountUp value={s.value} suffix={s.suffix} />
                    </div>
                    <div className="relative mt-1 text-xs font-medium text-white/50">
                      {s.label}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
