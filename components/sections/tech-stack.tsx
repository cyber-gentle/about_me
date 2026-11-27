'use client';

import { useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useContent } from '@/components/providers/content-provider';

const CATEGORIES = ['All', 'Languages', 'Backend', 'Data', 'Infra'] as const;
type Category = (typeof CATEGORIES)[number];

function inferCategory(name: string): Category {
  const n = name.toLowerCase();
  if (
    ['go', 'python', 'typescript', 'javascript', 'html', 'css'].some((k) =>
      n.includes(k)
    )
  ) {
    return 'Languages';
  }
  if (['postgres', 'mysql', 'redis', 'sql', 'mongo'].some((k) => n.includes(k))) {
    return 'Data';
  }
  if (
    ['docker', 'linux', 'git', 'github', 'vs code', 'cloud', 'k8s'].some((k) =>
      n.includes(k)
    )
  ) {
    return 'Infra';
  }
  return 'Backend';
}

export function TechStack() {
  const { techs } = useContent();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [hovered, setHovered] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const positions = useMemo(() => {
    const n = techs.length;
    if (n === 0) return [];
    if (n === 1) return [{ x: 0, y: 0, z: 0 }];
    const radius = 175;
    const pts: { x: number; y: number; z: number }[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    // Round to 2 decimals: keeps SSR and client style strings byte-identical
    // (avoids hydration mismatches from float serialization differences).
    const round = (v: number) => Math.round(v * 100) / 100;
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      pts.push({
        x: round(Math.cos(theta) * r * radius),
        y: round(y * radius),
        z: round(Math.sin(theta) * r * radius),
      });
    }
    return pts;
  }, [techs]);

  const activeTech = hovered !== null ? techs[hovered] : null;

  return (
    <section id="techstack" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-[1160px] px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: Frosted glass 3D sphere */}
          <div
            ref={ref}
            className="relative mx-auto flex h-[380px] w-full max-w-md items-center justify-center sm:h-[420px]"
            style={{ perspective: 1000 }}
          >
            {/* Ambient multi-stop glow */}
            <div
              className="pointer-events-none absolute inset-4 rounded-full opacity-55 blur-3xl"
              style={{
                background:
                  'radial-gradient(circle, rgba(79,139,255,0.22) 0%, rgba(138,92,255,0.14) 45%, transparent 70%)',
              }}
              aria-hidden="true"
            />

            {/* Center glass readout */}
            <div className="pointer-events-none relative z-10 rounded-2xl border border-white/15 bg-white/[0.06] px-5 py-3 text-center backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.18)]">
              <div className="font-display text-xl font-bold tracking-tight text-white">
                {activeTech ? activeTech.name : 'My Stack'}
              </div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-[#7FE7FF] tabular-nums">
                {activeTech ? activeTech.short : `${techs.length} TECHNOLOGIES`}
              </div>
            </div>

            {/* Rotating group */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              style={{ transformStyle: 'preserve-3d' }}
              animate={inView ? { rotateY: 360 } : {}}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            >
              {/* Wireframe rings */}
              <div
                className="absolute h-[350px] w-[350px] rounded-full border border-white/15"
                style={{ transform: 'translateZ(0)' }}
              />
              <div
                className="absolute h-[350px] w-[350px] rounded-full border border-white/10"
                style={{ transform: 'rotateX(70deg)' }}
              />
              <div
                className="absolute h-[350px] w-[350px] rounded-full border border-white/10"
                style={{ transform: 'rotateY(70deg)' }}
              />

              {/* Orbiting frosted badges */}
              {techs.map((tech, i) => {
                const p = positions[i];
                if (!p) return null;
                const isHovered = hovered === i;
                const matchesCategory =
                  activeCategory === 'All' ||
                  inferCategory(tech.name) === activeCategory;

                return (
                  <div
                    key={tech.name}
                    className="absolute left-1/2 top-1/2"
                    style={{
                      transform: `translate3d(${p.x}px, ${p.y}px, ${p.z}px)`,
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <div
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                      data-cursor="hover"
                      className={`flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-xl border font-mono text-xs font-medium backdrop-blur-xl transition-all duration-150 ${
                        isHovered
                          ? 'border-[#7FE7FF]/70 bg-white/15 text-white shadow-[0_0_24px_rgba(127,231,255,0.4)]'
                          : matchesCategory
                            ? 'border-white/15 bg-white/[0.06] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]'
                            : 'border-white/5 bg-white/[0.02] text-white/30 opacity-35'
                      }`}
                    >
                      {tech.short}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Right: Eyebrow, Copy, Frosted Filter Chips & Pills */}
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-wider text-[#7FE7FF]">
              Tech Stack
            </p>
            <h2 className="mt-2 font-display text-[28px] font-semibold leading-[34px] tracking-[-0.25px] text-white sm:text-[32px] sm:leading-[38px]">
              Every tool has a purpose
            </h2>
            <p className="mt-4 text-[15px] leading-[24px] text-white/60">
              I choose technologies based on the problem, not the hype. Here is
              the full set of tools I reach for regularly — each one
              battle-tested in production environments.
            </p>

            {/* Category filter chips */}
            <div className="mt-6 flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-lg border px-3 py-1 font-mono text-[11px] backdrop-blur-md transition-all duration-150 ${
                    activeCategory === cat
                      ? 'border-[#4F8BFF]/60 bg-[#4F8BFF]/20 text-white shadow-[0_0_16px_rgba(79,139,255,0.25)]'
                      : 'border-white/10 bg-white/[0.04] text-white/60 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Frosted tech pills */}
            <div className="mt-4 flex flex-wrap gap-2">
              {techs.map((tech, i) => {
                const matchesCategory =
                  activeCategory === 'All' ||
                  inferCategory(tech.name) === activeCategory;
                return (
                  <span
                    key={tech.name}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    className={`cursor-default rounded-full border px-3.5 py-1.5 text-xs font-medium backdrop-blur-xl transition-all duration-150 ${
                      hovered === i
                        ? 'border-[#7FE7FF]/60 bg-white/15 text-white shadow-[0_0_20px_rgba(127,231,255,0.3)]'
                        : matchesCategory
                          ? 'border-white/15 bg-white/[0.06] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] hover:border-white/25 hover:bg-white/[0.1]'
                          : 'border-white/5 bg-white/[0.02] text-white/30 opacity-40'
                    }`}
                  >
                    {tech.name}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
