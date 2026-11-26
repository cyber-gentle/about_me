'use client';

import { ExternalLink, Star } from 'lucide-react';
import { useContent } from '@/components/providers/content-provider';

export function Projects() {
  const { projects } = useContent();

  return (
    <section
      id="projects"
      className="relative border-b border-[#434850] bg-gradient-to-b from-[#101418] via-[#0F1726] to-[#0C0E12] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-[1120px] px-4 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-wider text-[#B0C8EC]">
            Selected Work
          </p>
          <h2 className="mt-2 font-display text-[28px] font-semibold leading-[34px] tracking-[-0.25px] text-[#E2E5EF] sm:text-[36px] sm:leading-[42px] sm:tracking-[-0.5px]">
            Shipped systems &amp; projects
          </h2>
          <p className="mt-3 text-[15px] leading-[24px] text-[#A7ABB4]">
            Production-grade services and tools built with performance,
            reliability, and clean architecture in mind.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((p) => (
            <article
              key={p.id}
              className="flex min-h-[260px] flex-col justify-between rounded-[8px] border border-[#434850] bg-[#161A1F] p-7 transition-colors duration-150 ease-out hover:border-[#71767E]"
            >
              <div>
                {/* Project image */}
                {p.image ? (
                  <div className="mb-5 aspect-[16/9] w-full overflow-hidden rounded-[6px] border border-[#434850] bg-[#101418]">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}

                {/* Header */}
                <div className="mb-4 flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl font-semibold text-[#E2E5EF]">
                    {p.title}
                  </h3>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#434850] bg-[#101418] px-2.5 py-0.5 font-mono text-xs text-[#A7ABB4] tabular-nums">
                    <Star size={12} className="text-[#B0C8EC]" />
                    {p.stars}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed text-[#A7ABB4]">
                  {p.description}
                </p>

                {/* Tech tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-[4px] border border-[#434850] bg-[#101418] px-2 py-0.5 font-mono text-xs text-[#A7ABB4]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 border-t border-[#434850] pt-4">
                <a
                  href={p.url || '#projects'}
                  target={p.url ? '_blank' : undefined}
                  rel={p.url ? 'noopener noreferrer' : undefined}
                  data-cursor="hover"
                  className="inline-flex w-full items-center justify-center gap-1.5 rounded-[6px] bg-[#B0C8EC] px-3 py-2 text-xs font-medium text-[#29425F] transition-colors duration-150 ease-out hover:bg-[#D3E4FF]"
                >
                  View Project
                  <ExternalLink size={13} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
