'use client';

import { useEffect, useRef } from 'react';
import { motion, MotionValue, useScroll, useTransform } from 'framer-motion';
import { ExternalLink, Star } from 'lucide-react';
import { useContent } from '@/components/providers/content-provider';
import { lenisRef } from '@/components/providers/smooth-scroll';
import type { ProjectItem } from '@/lib/content-types';

function ProjectSlide({
  project,
  index,
  total,
  progress,
}: {
  project: ProjectItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const step = 1 / Math.max(total - 1, 1);
  const center = index * step;
  const half = step / 2;
  const band = step * 0.3;
  const isLast = index === total - 1;

  // Each slide owns a tiling window of the scroll progress, so exactly one
  // card is on stage at a time: it slides in, holds centered, and is fully
  // gone before the next card starts entering (no half-and-half overlap).
  const w0 = center - half;
  const w1 = center + half;

  const x = useTransform(
    progress,
    isLast ? [w0, w0 + band] : [w0, w0 + band, w1 - band, w1],
    isLast ? ['100%', '0%'] : ['100%', '0%', '0%', '-100%']
  );
  const opacity = useTransform(
    progress,
    isLast
      ? [w0, w0 + band * 0.6]
      : [w0, w0 + band * 0.6, w1 - band * 0.6, w1],
    isLast ? [0, 1] : [0, 1, 1, 0]
  );

  return (
    <motion.article
      style={{
        x: total > 1 ? x : '0%',
        opacity: total > 1 ? opacity : 1,
      }}
      className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-white/15 bg-white/[0.05] p-6 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.18)] sm:p-8"
    >
      <div className="grid h-full gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-center">
        {/* Left: Project details */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 font-mono text-xs text-[#7FE7FF] tabular-nums">
              <span>Project {String(index + 1).padStart(2, '0')}</span>
              <span className="text-white/25">/</span>
              <span className="text-white/50">
                {String(total).padStart(2, '0')}
              </span>
              <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-0.5 text-white/80 backdrop-blur-md">
                <Star size={12} className="fill-[#7FE7FF] text-[#7FE7FF]" />
                {project.stars}
              </span>
            </div>

            <h3 className="font-display text-2xl font-bold tracking-tight text-white sm:text-[32px] sm:leading-[38px]">
              {project.title}
            </h3>

            <p className="mt-2 font-mono text-xs text-white/50">
              {project.tech.join(' · ')}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-white/65 sm:text-[15px]">
              {project.description}
            </p>
          </div>

          <div className="mt-6">
            <a
              href={project.url || '#projects'}
              target={project.url ? '_blank' : undefined}
              rel={project.url ? 'noopener noreferrer' : undefined}
              data-cursor="hover"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#4F8BFF] to-[#8A5CFF] px-5 py-2.5 text-xs font-semibold text-white shadow-[0_6px_24px_rgba(79,139,255,0.4)] transition-all duration-150 ease-out hover:shadow-[0_8px_30px_rgba(79,139,255,0.6)]"
            >
              View Project
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Right: Large frosted project image frame */}
        <div className="aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/15 bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-mono text-xs text-white/40">
              {project.title}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function Projects() {
  const { projects } = useContent();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const total = projects.length;
  const step = 1 / Math.max(total - 1, 1);

  // Scroll-snap: when the user stops scrolling and the active card is only
  // partially shown (mid enter/exit), glide to the nearest card's focus
  // center. Cards already fully in their hold zone are left alone.
  useEffect(() => {
    if (total <= 1) return;
    const band = step * 0.3; // must match the enter/exit band in ProjectSlide
    let raf = 0;
    let last = -1;
    let lastMove = 0;

    const glide = (targetProgress: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return; // off-screen
      const top = rect.top + window.scrollY;
      const target = top + targetProgress * (el.offsetHeight - window.innerHeight);
      const lenis = lenisRef.current;
      if (lenis) lenis.scrollTo(target, { duration: 0.7 });
      else window.scrollTo({ top: target, behavior: 'smooth' });
    };

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      const v = scrollYProgress.get();
      if (v <= 0 || v >= 1) {
        last = v;
        lastMove = t;
        return;
      }
      if (v !== last) {
        // still moving (user input or snap glide in flight)
        last = v;
        lastMove = t;
        return;
      }
      if (t - lastMove < 150) return; // pause not detected yet
      const idx = Math.min(Math.max(Math.round(v / step), 0), total - 1);
      const center = idx * step;
      if (Math.abs(v - center) > step * 0.22) {
        glide(center);
        lastMove = t;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [total, step, scrollYProgress]);

  return (
    <section
      id="projects"
      ref={containerRef}
      style={{ height: total > 1 ? `${total * 100}vh` : 'auto' }}
      className="relative"
    >
      <div className="sticky top-16 flex min-h-[calc(100vh-4rem)] items-center py-12">
        <div className="mx-auto w-full max-w-[1160px] px-4 sm:px-6">
          {/* Header */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="font-mono text-xs font-medium uppercase tracking-wider text-[#7FE7FF]">
                Selected Work
              </p>
              <h2 className="mt-2 font-display text-[28px] font-semibold leading-[34px] tracking-[-0.25px] text-white sm:text-[36px] sm:leading-[42px] sm:tracking-[-0.5px]">
                Shipped systems &amp; projects
              </h2>
            </div>
            {total > 1 && (
              <p className="font-mono text-xs text-white/50">
                Scroll to cycle projects
              </p>
            )}
          </div>

          {/* Focused glass stage with ambient glow */}
          <div className="relative">
            <div
              className="pointer-events-none absolute -inset-4 rounded-3xl opacity-45 blur-3xl"
              style={{
                background:
                  'radial-gradient(circle at 30% 40%, rgba(79,139,255,0.22), transparent 55%), radial-gradient(circle at 75% 60%, rgba(138,92,255,0.2), transparent 55%)',
              }}
              aria-hidden="true"
            />
            <div className="relative h-[520px] w-full overflow-hidden sm:h-[420px]">
              {projects.map((p, i) => (
                <ProjectSlide
                  key={p.id}
                  project={p}
                  index={i}
                  total={total}
                  progress={scrollYProgress}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
