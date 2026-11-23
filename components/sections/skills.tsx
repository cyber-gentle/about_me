'use client';

import { useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useInView } from 'framer-motion';
import { Server, Layout, Database, Cloud, Wrench, Code } from 'lucide-react';
import { SectionHeading } from '@/components/section-heading';
import { StaggerContainer, StaggerItem } from '@/components/providers/reveal';
import { useContent } from '@/components/providers/content-provider';

type Category = {
  icon: typeof Server;
  name: string;
  color: string;
  skills: { name: string; level: number }[];
};

const CATEGORY_ICONS: Record<string, typeof Server> = {
  Backend: Server,
  Frontend: Layout,
  Databases: Database,
  Cloud: Cloud,
  Tools: Wrench,
  Languages: Code,
};

const CATEGORY_COLORS = ['#4F8BFF', '#8A5CFF', '#7FE7FF'];

function TiltCard({ category }: { category: Category }) {
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
  const { skills } = useContent();

  const categories = useMemo<Category[]>(() => {
    const grouped: Category[] = [];
    const byName = new Map<string, Category>();
    skills.forEach((row) => {
      let cat = byName.get(row.category);
      if (!cat) {
        cat = {
          icon: CATEGORY_ICONS[row.category] ?? Code,
          name: row.category,
          color: CATEGORY_COLORS[grouped.length % CATEGORY_COLORS.length],
          skills: [],
        };
        byName.set(row.category, cat);
        grouped.push(cat);
      }
      cat.skills.push({ name: row.name, level: row.level });
    });
    return grouped;
  }, [skills]);

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
