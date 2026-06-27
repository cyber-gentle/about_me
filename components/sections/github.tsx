'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Github, GitFork, Star, Users, BookOpen } from 'lucide-react';
import { SectionHeading } from '@/components/section-heading';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/providers/reveal';

const repos = [
  {
    name: 'go-api-gateway',
    description: 'High-throughput API gateway with rate limiting and circuit breaking.',
    language: 'Go',
    stars: 342,
    forks: 48,
    color: '#4F8BFF',
  },
  {
    name: 'event-pipeline',
    description: 'Stream processing pipeline for millions of daily events.',
    language: 'Go',
    stars: 218,
    forks: 31,
    color: '#8A5CFF',
  },
  {
    name: 'task-queue',
    description: 'Reliable background job system with retries and priorities.',
    language: 'Go',
    stars: 187,
    forks: 24,
    color: '#7FE7FF',
  },
  {
    name: 'otel-toolkit',
    description: 'One-line OpenTelemetry instrumentation for Go services.',
    language: 'Go',
    stars: 264,
    forks: 39,
    color: '#4F8BFF',
  },
];

const stats = [
  { icon: BookOpen, label: 'Repositories', value: '64' },
  { icon: Star, label: 'Total Stars', value: '1.2k' },
  { icon: GitFork, label: 'Total Forks', value: '186' },
  { icon: Users, label: 'Followers', value: '540' },
];

const languageStats = [
  { name: 'Go', pct: 62, color: '#4F8BFF' },
  { name: 'TypeScript', pct: 18, color: '#8A5CFF' },
  { name: 'Python', pct: 9, color: '#7FE7FF' },
  { name: 'Other', pct: 11, color: '#888' },
];

/* Deterministic pseudo-random contribution heatmap */
function useHeatmap() {
  return useMemo(() => {
    const weeks = 26;
    const days = 7;
    const grid: number[][] = [];
    let seed = 42;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let w = 0; w < weeks; w++) {
      const col: number[] = [];
      for (let d = 0; d < days; d++) {
        const r = rand();
        let level = 0;
        if (r > 0.85) level = 4;
        else if (r > 0.65) level = 3;
        else if (r > 0.45) level = 2;
        else if (r > 0.25) level = 1;
        col.push(level);
      }
      grid.push(col);
    }
    return grid;
  }, []);
}

const levelColors = [
  'rgba(255,255,255,0.05)',
  'rgba(79,139,255,0.35)',
  'rgba(79,139,255,0.6)',
  'rgba(138,92,255,0.75)',
  'rgba(127,231,255,0.9)',
];

export function GitHub() {
  const heatmap = useHeatmap();

  return (
    <section id="github" className="relative z-10 py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Open Source"
          title="GitHub Activity"
          description="I build in the open. Here is a snapshot of my contributions, repositories, and the languages I write in."
        />

        <div className="mt-20 grid gap-6 lg:grid-cols-3">
          {/* Stats */}
          <StaggerContainer className="grid grid-cols-2 gap-4 lg:col-span-3">
            {stats.map((s) => (
              <StaggerItem key={s.label}>
                <div className="group flex items-center gap-4 rounded-2xl glass-card p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#4F8BFF]/20 to-[#8A5CFF]/20">
                    <s.icon size={20} className="text-[#7FE7FF]" />
                  </div>
                  <div>
                    <div className="font-display text-2xl font-bold text-white">
                      {s.value}
                    </div>
                    <div className="text-xs text-white/50">{s.label}</div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Contribution heatmap */}
          <Reveal className="lg:col-span-2">
            <div className="h-full rounded-2xl glass-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-base font-semibold text-white">
                  Contribution Graph
                </h3>
                <span className="font-mono text-xs text-white/40">
                  Last 26 weeks
                </span>
              </div>
              <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                {heatmap.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-1">
                    {week.map((level, di) => (
                      <motion.div
                        key={di}
                        className="h-3 w-3 rounded-sm"
                        style={{ background: levelColors[level] }}
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: (wi * 7 + di) * 0.003 }}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-end gap-1.5 text-xs text-white/40">
                <span>Less</span>
                {levelColors.map((c, i) => (
                  <div
                    key={i}
                    className="h-3 w-3 rounded-sm"
                    style={{ background: c }}
                  />
                ))}
                <span>More</span>
              </div>
            </div>
          </Reveal>

          {/* Language breakdown */}
          <Reveal delay={0.1}>
            <div className="h-full rounded-2xl glass-card p-6">
              <h3 className="mb-4 font-display text-base font-semibold text-white">
                Languages
              </h3>
              {/* Stacked bar */}
              <div className="mb-4 flex h-2.5 overflow-hidden rounded-full">
                {languageStats.map((l) => (
                  <div
                    key={l.name}
                    style={{
                      width: `${l.pct}%`,
                      background: l.color,
                      boxShadow: `0 0 8px ${l.color}80`,
                    }}
                  />
                ))}
              </div>
              <div className="flex flex-col gap-3">
                {languageStats.map((l) => (
                  <div
                    key={l.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: l.color }}
                      />
                      <span className="text-white/70">{l.name}</span>
                    </div>
                    <span className="font-mono text-white/40">{l.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Repo cards */}
          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:col-span-3">
            {repos.map((r) => (
              <StaggerItem key={r.name}>
                <div
                  className="group h-full rounded-2xl glass-card p-5 transition-all hover:border-white/20 hover:bg-white/[0.07]"
                  data-cursor="hover"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Github size={14} className="text-white/40" />
                    <span className="font-mono text-sm font-medium text-white/90">
                      {r.name}
                    </span>
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-white/50">
                    {r.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ background: r.color }}
                      />
                      <span className="text-xs text-white/60">{r.language}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/50">
                      <span className="flex items-center gap-1">
                        <Star size={12} /> {r.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork size={12} /> {r.forks}
                      </span>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
