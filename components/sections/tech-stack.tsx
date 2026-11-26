'use client';

import { useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useContent } from '@/components/providers/content-provider';

const CATEGORIES = ['All', 'Languages', 'Backend', 'Data', 'Infra'] as const;
type Category = (typeof CATEGORIES)[number];

function inferCategory(name: string): Category {
  const n = name.toLowerCase();
  if (['go', 'python', 'typescript', 'javascript', 'html', 'css'].some((k) => n.includes(k))) {
    return 'Languages';
  }
  if (['postgres', 'mysql', 'redis', 'sql', 'mongo'].some((k) => n.includes(k))) {
    return 'Data';
  }
  if (['docker', 'linux', 'git', 'github', 'vs code', 'cloud', 'k8s'].some((k) => n.includes(k))) {
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
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      pts.push({
        x: Math.cos(theta) * r * radius,
        y: y * radius,
        z: Math.sin(theta) * r * radius,
      });
    }
    return pts;
  }, [techs]);

  const activeTech = hovered !== null ? techs[hovered] : null;

  return (
    <section
      id="techstack"
      className="relative border-b border-[#434850] bg-gradient-to-b from-[#0C0E12] via-[#0F1726] to-[#101418] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-[1120px] px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: 3D Rotating Sphere */}
          <div
            ref={ref}
            className="relative mx-auto flex h-[380px] w-full max-w-md items-center justify-center sm:h-[420px]"
            style={{ perspective: 1000 }}
          >
            {/* Subtle radial vignette */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(circle, rgba(176,200,236,0.08) 0%, transparent 65%)',
              }}
              aria-hidden="true"
            />

            {/* Center readout */}
            <div className="pointer-events-none relative z-10 text-center">
              <div className="font-display text-2xl font-bold tracking-tight text-[#B0C8EC]">
                {activeTech ? activeTech.name : 'My Stack'}
              </div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-[#A7ABB4] tabular-nums">
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
                className="absolute h-[350px] w-[350px] rounded-full border border-[#434850]/40"
                style={{ transform: 'translateZ(0)' }}
              />
              <div
                className="absolute h-[350px] w-[350px] rounded-full border border-[#434850]/25"
                style={{ transform: 'rotateX(70deg)' }}
              />
              <div
                className="absolute h-[350px] w-[350px] rounded-full border border-[#434850]/25"
                style={{ transform: 'rotateY(70deg)' }}
              />

              {/* Orbiting badges */}
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
                      className={`flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-[8px] border font-mono text-xs font-medium transition-all duration-150 ${
                        isHovered
                          ? 'border-[#B0C8EC] bg-[#1C2026] text-[#B0C8EC]'
                          : matchesCategory
                            ? 'border-[#434850] bg-[#161A1F]/90 text-[#E2E5EF]'
                            : 'border-[#434850]/40 bg-[#101418]/50 text-[#71767E] opacity-40'
                      }`}
                    >
                      {tech.short}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Right: Eyebrow, Copy, Filter Chips & Pill Badges */}
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-wider text-[#B0C8EC]">
              Tech Stack
            </p>
            <h2 className="mt-2 font-display text-[28px] font-semibold leading-[34px] tracking-[-0.25px] text-[#E2E5EF] sm:text-[32px] sm:leading-[38px]">
              Every tool has a purpose
            </h2>
            <p className="mt-4 text-[15px] leading-[24px] text-[#A7ABB4]">
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
                  className={`rounded-[6px] border px-2.5 py-1 font-mono text-[11px] transition-colors duration-150 ${
                    activeCategory === cat
                      ? 'border-[#B0C8EC] bg-[#B0C8EC]/10 text-[#B0C8EC]'
                      : 'border-[#434850] bg-[#101418] text-[#A7ABB4] hover:text-[#E2E5EF]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Tech pills */}
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
                    className={`cursor-default rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-150 ${
                      hovered === i
                        ? 'border-[#B0C8EC] bg-[#1C2026] text-[#B0C8EC]'
                        : matchesCategory
                          ? 'border-[#434850] bg-[#161A1F] text-[#E2E5EF] hover:border-[#71767E]'
                          : 'border-[#434850]/40 bg-[#101418] text-[#71767E] opacity-45'
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
