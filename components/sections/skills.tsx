'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import { Code } from 'lucide-react';
import type { SkillCategory } from '@/lib/content-types';
import { skillIcons } from '@/lib/skill-icons';
import { SectionHeading } from '@/components/section-heading';
import { StaggerContainer, StaggerItem } from '@/components/providers/reveal';


function TiltCard({ category }: { category: SkillCategory }) {
  const Icon = skillIcons[category.icon] ?? Code;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), {
    damping: 20,
    stiffness: 200,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), {
    damping: 20,
    stiffness: 200,
  });

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
    setHovered(false);
  };

  return (
    <StaggerItem>
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onLeave}
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        className="group relative h-full rounded-2xl glass-card p-6 transition-shadow"
        data-cursor="hover"
      >
        {/* Hover glow */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${category.color}22, transparent 70%)`,
          }}
        />
        {/* Header */}
        <div className="relative mb-5 flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10"
            style={{
              background: `linear-gradient(135deg, ${category.color}30, ${category.color}10)`,
              boxShadow: hovered ? `0 0 24px ${category.color}50` : 'none',
            }}
          >
            <Icon size={20} aria-hidden="true" style={{ color: category.color }} />
          </div>
          <h3 className="font-display text-lg font-semibold text-white">
            {category.name}
          </h3>
        </div>
        {/* Skills */}
        <div className="relative flex flex-col gap-4">
          {category.skills.map((skill, i) => (
            <div key={skill.id}>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium text-white/70">{skill.name}</span>
                <span className="font-mono text-white/60">{skill.level}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${category.color}, ${category.color}aa)`,
                    boxShadow: `0 0 12px ${category.color}80`,
                  }}
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${skill.level}%` } : {}}
                  transition={{ duration: 1, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </StaggerItem>
  );
}

export function Skills({ categories }: { categories: SkillCategory[] }) {
  return (
    <section id="skills" className="relative z-10 py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Skills & Expertise"
          title="A Full-Stack Toolkit"
          description="From low-level systems to polished interfaces — here are the technologies I use to ship production software."
        />

        <StaggerContainer className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <TiltCard key={cat.id} category={cat} />
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
