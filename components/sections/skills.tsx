'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import { Server, Layout, Database, Cloud, Wrench, Code } from 'lucide-react';
import { SectionHeading } from '@/components/section-heading';
import { StaggerContainer, StaggerItem } from '@/components/providers/reveal';

const categories = [
  {
    icon: Server,
    name: 'Backend',
    color: '#4F8BFF',
    skills: [
      { name: 'Go (Golang)', level: 95 },
      { name: 'REST APIs', level: 92 },
      { name: 'gRPC', level: 85 },
      { name: 'Microservices', level: 88 },
    ],
  },
  {
    icon: Layout,
    name: 'Frontend',
    color: '#8A5CFF',
    skills: [
      { name: 'React / Next.js', level: 84 },
      { name: 'TypeScript', level: 86 },
      { name: 'Tailwind CSS', level: 90 },
      { name: 'Framer Motion', level: 78 },
    ],
  },
  {
    icon: Database,
    name: 'Databases',
    color: '#7FE7FF',
    skills: [
      { name: 'PostgreSQL', level: 90 },
      { name: 'MySQL', level: 88 },
      { name: 'Redis', level: 82 },
      { name: 'MongoDB', level: 75 },
    ],
  },
  {
    icon: Cloud,
    name: 'Cloud',
    color: '#4F8BFF',
    skills: [
      { name: 'Docker', level: 90 },
      { name: 'Kubernetes', level: 78 },
      { name: 'AWS', level: 82 },
      { name: 'CI/CD', level: 85 },
    ],
  },
  {
    icon: Wrench,
    name: 'Tools',
    color: '#8A5CFF',
    skills: [
      { name: 'Git / GitHub', level: 94 },
      { name: 'Linux', level: 88 },
      { name: 'VS Code', level: 92 },
      { name: 'Postman', level: 90 },
    ],
  },
  {
    icon: Code,
    name: 'Languages',
    color: '#7FE7FF',
    skills: [
      { name: 'Go', level: 95 },
      { name: 'TypeScript', level: 86 },
      { name: 'JavaScript', level: 88 },
      { name: 'Python', level: 78 },
    ],
  },
];

function TiltCard({ category }: { category: (typeof categories)[number] }) {
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
            <category.icon size={20} style={{ color: category.color }} />
          </div>
          <h3 className="font-display text-lg font-semibold text-white">
            {category.name}
          </h3>
        </div>
        {/* Skills */}
        <div className="relative flex flex-col gap-4">
          {category.skills.map((skill, i) => (
            <div key={skill.name}>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium text-white/70">{skill.name}</span>
                <span className="font-mono text-white/40">{skill.level}%</span>
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

export function Skills() {
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
            <TiltCard key={cat.name} category={cat} />
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
