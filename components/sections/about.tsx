'use client';

import { useMemo } from 'react';
import { Code2, Compass, Heart, Target } from 'lucide-react';
import { useContent } from '@/components/providers/content-provider';

const PILLAR_ICONS = [Code2, Heart, Compass, Target];
const PILLAR_COLORS = ['#4F8BFF', '#8A5CFF', '#7FE7FF', '#4F8BFF'];

export function About() {
  const { aboutStats: stats, aboutPillars: pillarRows } = useContent();

  const pillars = useMemo(
    () =>
      pillarRows.map((p, i) => ({
        ...p,
        icon: PILLAR_ICONS[i % PILLAR_ICONS.length],
        color: PILLAR_COLORS[i % PILLAR_COLORS.length],
        text: p.body,
      })),
    [pillarRows]
  );

  return (
    <section id="about" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-[1160px] px-4 sm:px-6">
        {/* Section header */}
        <div className="mb-12 max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-wider text-[#7FE7FF]">
            About
          </p>
          <h2 className="mt-2 font-display text-[28px] font-semibold leading-[34px] tracking-[-0.25px] text-white sm:text-[36px] sm:leading-[42px] sm:tracking-[-0.5px]">
            The engineer behind the code
          </h2>
          <p className="mt-3 text-[15px] leading-[24px] text-white/60">
            A blend of systems thinking, performance discipline, and a focus on
            building software that scales cleanly.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          {/* Left: Frosted glass photo card + stats ledger */}
          <div className="space-y-4">
            <div className="relative">
              <div
                className="pointer-events-none absolute -inset-2 rounded-3xl opacity-45 blur-xl"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(79,139,255,0.35), rgba(138,92,255,0.28), rgba(127,231,255,0.25))',
                }}
                aria-hidden="true"
              />

              <div className="relative rounded-2xl border border-white/15 bg-white/[0.05] p-4 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.16)]">
                {/* Photo frame */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/15 bg-white/[0.03]">
                  <img
                    src="/profile.jpg"
                    alt="Abraham David"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center font-display text-4xl font-bold text-[#7FE7FF]/30">
                    AD
                  </div>
                </div>

                {/* Caption bar */}
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display text-base font-semibold text-white">
                      Abraham David
                    </h3>
                    <p className="font-mono text-xs text-white/60">
                      Backend Engineer · Remote
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-1 font-mono text-[11px] text-[#7FE7FF] backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Available
                  </span>
                </div>
              </div>
            </div>

            {stats.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {stats.map((stat) => (
                  <div
                    key={stat.id}
                    className="rounded-2xl border border-white/15 bg-white/[0.05] p-4 backdrop-blur-2xl shadow-[0_8px_28px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.12)]"
                  >
                    <div className="font-display text-2xl font-bold text-white tabular-nums">
                      {stat.value.toLocaleString()}
                      {stat.suffix}
                    </div>
                    <div className="mt-1 font-mono text-xs text-white/55">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Frosted glass engineering pillars */}
          <div className="grid gap-4 sm:grid-cols-2">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.id}
                  className="group rounded-2xl border border-white/15 bg-white/[0.05] p-5 backdrop-blur-2xl shadow-[0_12px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.14)] transition-all duration-150 hover:border-white/25 hover:bg-white/[0.08]"
                >
                  <div
                    className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/15"
                    style={{
                      background: `linear-gradient(135deg, ${pillar.color}28, ${pillar.color}0c)`,
                    }}
                  >
                    <Icon size={18} style={{ color: pillar.color }} />
                  </div>
                  <h3 className="font-display text-base font-semibold text-white">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
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
