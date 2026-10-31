'use client';

import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { SectionHeading } from '@/components/section-heading';
import { StaggerContainer, StaggerItem } from '@/components/providers/reveal';

import type { Project } from '@/lib/content-types';

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="relative z-10 py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Selected Work"
          title="Projects I&apos;m Proud Of"
          description="A collection of production-grade systems and tools — built with performance, reliability, and clean architecture in mind."
        />

        <StaggerContainer className="mt-20 grid auto-rows-[minmax(280px,auto)] gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <StaggerItem key={p.id} className={p.featured ? 'lg:row-span-2' : ''}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', damping: 20, stiffness: 280 }}
                className="group relative h-full overflow-hidden rounded-2xl glass-card"
                data-cursor="hover"
              >
                {/* Accent glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${p.accent}22, transparent 60%)`,
                  }}
                />

                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage: p.image_url
                        ? `url(${JSON.stringify(p.image_url)})`
                        : `radial-gradient(circle at 30% 30%, ${p.accent}55, transparent 60%), radial-gradient(circle at 80% 80%, #8A5CFF40, transparent 60%)`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(to top, ${p.accent}30, transparent 60%)`,
                    }}
                  />
                </div>

                {/* Content */}
                <div className="relative p-5">
                  <h3 className="mb-2 font-display text-lg font-semibold text-white">
                    {p.title}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-white/50">
                    {p.description}
                  </p>

                  {/* Tech tags */}
                  <div className="mb-5 flex flex-wrap gap-1.5">
                    {p.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] text-white/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Buttons — rendered only for links that exist */}
                  {(p.demo_url || p.repo_url) && (
                    <div className="flex gap-2">
                      {p.demo_url && (
                        <a
                          href={p.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${p.title} live demo`}
                          data-cursor="hover"
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 transition-all hover:border-white/25 hover:bg-white/10"
                        >
                          <ExternalLink size={13} />
                          Live Demo
                        </a>
                      )}
                      {p.repo_url && (
                        <a
                          href={p.repo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${p.title} source code on GitHub`}
                          data-cursor="hover"
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 transition-all hover:border-white/25 hover:bg-white/10"
                        >
                          <Github size={13} />
                          GitHub
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Reflection line */}
                <div
                  className="absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${p.accent}, transparent)`,
                  }}
                />
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
