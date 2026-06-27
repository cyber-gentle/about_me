'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Briefcase, GraduationCap, Rocket, Building2 } from 'lucide-react';
import { SectionHeading } from '@/components/section-heading';
import { Reveal } from '@/components/providers/reveal';

const experiences = [
  {
    icon: Rocket,
    role: 'Senior Backend Engineer',
    company: 'Nebula Cloud',
    period: '2023 — Present',
    description:
      'Leading the design of distributed services handling millions of requests daily. Built the core API gateway and observability platform from the ground up in Go.',
    tags: ['Go', 'Kubernetes', 'gRPC', 'AWS'],
    accent: '#4F8BFF',
  },
  {
    icon: Building2,
    role: 'Backend Engineer',
    company: 'Quantum Labs',
    period: '2021 — 2023',
    description:
      'Designed and shipped event-driven microservices, real-time data pipelines, and internal developer tooling that cut deployment times by 60%.',
    tags: ['Go', 'Kafka', 'PostgreSQL', 'Docker'],
    accent: '#8A5CFF',
  },
  {
    icon: Briefcase,
    role: 'Software Engineer',
    company: 'ByteForge',
    period: '2019 — 2021',
    description:
      'Built REST APIs and internal dashboards. Introduced CI/CD pipelines and automated testing, improving release confidence and velocity.',
    tags: ['Go', 'React', 'MySQL', 'CI/CD'],
    accent: '#7FE7FF',
  },
  {
    icon: GraduationCap,
    role: 'B.Sc. Computer Science',
    company: 'State University',
    period: '2015 — 2019',
    description:
      'Focused on distributed systems, algorithms, and operating systems. Graduated with honors while building side projects and contributing to open source.',
    tags: ['Algorithms', 'Systems', 'OS', 'C++'],
    accent: '#4F8BFF',
  },
];

export function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section id="experience" className="relative z-10 py-32">
      <div className="mx-auto max-w-4xl px-6">
        <SectionHeading
          eyebrow="Career Path"
          title="Experience &amp; Journey"
          description="The roles, projects, and milestones that shaped my path as a backend engineer."
        />

        <div ref={containerRef} className="relative mt-20 pl-8 sm:pl-0">
          {/* Vertical line (desktop centered, mobile left) */}
          <div className="absolute left-3 top-0 h-full w-px bg-white/10 sm:left-1/2 sm:-translate-x-1/2" />
          <motion.div
            className="absolute left-3 top-0 w-px sm:left-1/2 sm:-translate-x-1/2"
            style={{
              height: lineHeight,
              background:
                'linear-gradient(180deg, #4F8BFF, #8A5CFF, #7FE7FF)',
              boxShadow: '0 0 12px rgba(79,139,255,0.6)',
            }}
          />

          <div className="flex flex-col gap-12">
            {experiences.map((exp, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={exp.role}
                  className={`relative flex ${
                    isLeft ? 'sm:justify-start' : 'sm:justify-end'
                  }`}
                >
                  {/* Node dot */}
                  <div
                    className="absolute left-3 top-6 z-10 -translate-x-1/2 sm:left-1/2"
                    style={{ transform: 'translateX(-50%)' }}
                  >
                    <motion.div
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#050505]"
                      style={{
                        background: `linear-gradient(135deg, ${exp.accent}, ${exp.accent}aa)`,
                        boxShadow: `0 0 20px ${exp.accent}80`,
                      }}
                      whileInView={{ scale: [0, 1.2, 1] }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                    >
                      <exp.icon size={14} className="text-white" />
                    </motion.div>
                  </div>

                  {/* Card */}
                  <Reveal
                    className={`w-full sm:w-[calc(50%-3rem)] ${
                      isLeft ? '' : 'sm:ml-auto'
                    }`}
                    y={30}
                  >
                    <div className="group rounded-2xl glass-card p-6 transition-all hover:border-white/20 hover:bg-white/[0.07]">
                      <div className="mb-1 flex items-center gap-2">
                        <span
                          className="rounded-full px-2.5 py-0.5 font-mono text-[10px] font-medium"
                          style={{
                            background: `${exp.accent}20`,
                            color: exp.accent,
                          }}
                        >
                          {exp.period}
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-semibold text-white">
                        {exp.role}
                      </h3>
                      <p className="mb-3 text-sm font-medium text-white/60">
                        {exp.company}
                      </p>
                      <p className="mb-4 text-sm leading-relaxed text-white/50">
                        {exp.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {exp.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-md border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] text-white/60"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
