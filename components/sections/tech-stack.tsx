'use client';

import { useRef, useState, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { SectionHeading } from '@/components/section-heading';
import { Reveal } from '@/components/providers/reveal';
import type { Tech } from '@/lib/content-types';


const colors = ['#4F8BFF', '#8A5CFF', '#7FE7FF'];

export function TechStack({ techs }: { techs: Tech[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [hovered, setHovered] = useState<number | null>(null);

  // Distribute icons on a sphere using fibonacci sphere
  const positions = useMemo(() => {
    const n = techs.length;
    const radius = 180;
    if (n === 1) return [{ x: 0, y: 0, z: radius }];
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
  }, [techs.length]);

  return (
    <section id="techstack" className="relative z-10 py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Tech Stack"
          title="Technologies I Work With"
          description="An interactive constellation of the tools, languages, and platforms I use to build and ship software."
        />

        <div className="mt-20 grid items-center gap-12 lg:grid-cols-2">
          {/* Sphere */}
          <Reveal>
            <div
              ref={ref}
              className="relative mx-auto flex h-[420px] w-full max-w-md items-center justify-center"
              style={{ perspective: 1000 }}
            >
              {/* Glow core */}
              <div
                className="absolute h-40 w-40 rounded-full opacity-40 blur-3xl"
                style={{
                  background:
                    'radial-gradient(circle, rgba(79,139,255,0.6), transparent 70%)',
                }}
              />

              {/* Rotating group */}
              <motion.div
                className="relative preserve-3d"
                style={{ transformStyle: 'preserve-3d' }}
                animate={inView ? { rotateY: 360 } : {}}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              >
                {/* Wireframe sphere */}
                <div
                  className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
                  style={{ transform: 'translateZ(0)' }}
                />
                <div
                  className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5"
                  style={{ transform: 'rotateX(70deg)' }}
                />
                <div
                  className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5"
                  style={{ transform: 'rotateY(70deg)' }}
                />

                {/* Orbiting icons */}
                {techs.map((tech, i) => {
                  const p = positions[i];
                  const color = colors[i % colors.length];
                  return (
                    <div
                      key={tech.id}
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
                        className="flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-xl border text-xs font-bold backdrop-blur-md transition-all"
                        style={{
                          background:
                            hovered === i
                              ? `${color}30`
                              : 'rgba(255,255,255,0.04)',
                          borderColor:
                            hovered === i ? color : 'rgba(255,255,255,0.1)',
                          boxShadow:
                            hovered === i ? `0 0 24px ${color}80` : 'none',
                          color: hovered === i ? '#fff' : 'rgba(255,255,255,0.7)',
                        }}
                      >
                        {tech.short}
                      </div>
                    </div>
                  );
                })}
              </motion.div>

              {/* Center label */}
              <div className="pointer-events-none absolute z-10 text-center">
                <div className="font-display text-2xl font-bold text-gradient">
                  {hovered !== null && techs[hovered] ? techs[hovered].name : 'My Stack'}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-white/60">
                  {hovered !== null ? 'Hover to explore' : `${techs.length} technologies`}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Tech list */}
          <Reveal delay={0.1}>
            <div className="flex flex-col gap-4">
              <h3 className="font-display text-2xl font-semibold text-white">
                Every tool has a purpose
              </h3>
              <p className="text-sm leading-relaxed text-white/50">
                I choose technologies based on the problem, not the hype. Here is
                the full set of tools I reach for regularly — each one battle-tested
                in production environments.
              </p>
              <div className="flex flex-wrap gap-2">
                {techs.map((tech, i) => (
                  <motion.span
                    key={tech.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    className="cursor-default rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 transition-all hover:border-white/25 hover:bg-white/10 hover:text-white"
                    data-cursor="hover"
                  >
                    {tech.name}
                  </motion.span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
