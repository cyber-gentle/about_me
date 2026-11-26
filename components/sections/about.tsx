'use client';

import { useMemo } from 'react';
import { Code2, Compass, Heart, Target } from 'lucide-react';
import { useContent } from '@/components/providers/content-provider';

const PILLAR_ICONS = [Code2, Heart, Compass, Target];

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
    <section
      id="about"
      className="relative py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1120px] px-4 sm:px-6">
        {/* Section header */}
        <div className="mb-10 max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-wider text-[#B0C8EC]">
            About
          </p>
          <h2 className="mt-2 font-display text-[28px] font-semibold leading-[34px] tracking-[-0.25px] text-[#E2E5EF] sm:text-[36px] sm:leading-[42px] sm:tracking-[-0.5px]">
            The engineer behind the code
          </h2>
          <p className="mt-3 text-[15px] leading-[24px] text-[#A7ABB4]">
            A blend of systems thinking, performance discipline, and a focus on
            building software that scales cleanly.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          {/* Left: Profile photo card + stats ledger */}
          <div className="space-y-4">
            <div className="glass-card rounded-2xl p-4">
              {/* Photo frame */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[6px] border border-[#434850] bg-[#101418]">
                <img
                  src="/profile.jpg"
                  alt="Abraham David"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center font-display text-4xl font-bold text-[#B0C8EC]/30">
                  AD
                </div>
              </div>

              {/* Caption bar */}
              <div className="mt-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-base font-semibold text-[#E2E5EF]">
                    Abraham David
                  </h3>
                  <p className="font-mono text-xs text-[#A7ABB4]">
                    Backend Engineer · Remote
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#434850] bg-[#101418] px-2.5 py-1 font-mono text-[11px] text-[#B0C8EC]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#B0C8EC]" />
                  Available
                </span>
              </div>
            </div>

            {stats.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat) => (
                  <div
                    key={stat.id}
                    className="glass-card rounded-2xl p-4"
                  >
                    <div className="font-display text-2xl font-bold text-[#E2E5EF] tabular-nums">
                      {stat.value.toLocaleString()}
                      {stat.suffix}
                    </div>
                    <div className="mt-1 font-mono text-xs text-[#A7ABB4]">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Engineering pillars */}
          <div className="grid gap-4 sm:grid-cols-2">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.id}
                  className="glass-card rounded-2xl p-5 transition-colors duration-150 ease-out hover:border-white/20"
                >
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-[6px] border border-[#434850] bg-[#101418] text-[#B0C8EC]">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-display text-base font-semibold text-[#E2E5EF]">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#A7ABB4]">
                    {pillar.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
