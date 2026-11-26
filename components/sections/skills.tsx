'use client';

import { useMemo } from 'react';
import { Cloud, Code, Database, Layout, Server, Wrench } from 'lucide-react';
import { useContent } from '@/components/providers/content-provider';

const CATEGORY_ICONS: Record<string, typeof Server> = {
  Backend: Server,
  Frontend: Layout,
  Databases: Database,
  Cloud: Cloud,
  Tools: Wrench,
  Languages: Code,
};

export function Skills() {
  const { skills: skillRows } = useContent();

  const categories = useMemo(() => {
    const map = new Map<string, { name: string; level: number }[]>();
    for (const s of skillRows) {
      const list = map.get(s.category) ?? [];
      list.push({ name: s.name, level: s.level });
      map.set(s.category, list);
    }
    return Array.from(map.entries()).map(([name, skills]) => ({
      name,
      icon: CATEGORY_ICONS[name] || Code,
      skills,
    }));
  }, [skillRows]);

  return (
    <section
      id="skills"
      className="relative border-b border-[#434850] bg-[#101418] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-[1120px] px-4 sm:px-6">
        {/* Section header */}
        <div className="mb-10 max-w-2xl">
          <p className="font-mono text-xs font-medium uppercase tracking-wider text-[#B0C8EC]">
            Capabilities
          </p>
          <h2 className="mt-2 font-display text-[28px] font-semibold leading-[34px] tracking-[-0.25px] text-[#E2E5EF] sm:text-[36px] sm:leading-[42px] sm:tracking-[-0.5px]">
            Technical skills
          </h2>
          <p className="mt-3 text-[15px] leading-[24px] text-[#A7ABB4]">
            Core languages, frameworks, and infrastructure tools used in
            production.
          </p>
        </div>

        {/* Skills grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <div
                key={category.name}
                className="rounded-[8px] border border-[#434850] bg-[#161A1F] p-5"
              >
                <div className="mb-4 flex items-center gap-3 border-b border-[#434850] pb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#434850] bg-[#101418] text-[#B0C8EC]">
                    <Icon size={16} />
                  </div>
                  <h3 className="font-display text-base font-semibold text-[#E2E5EF]">
                    {category.name}
                  </h3>
                </div>

                <div className="space-y-3.5">
                  {category.skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="font-medium text-[#E2E5EF]">
                          {skill.name}
                        </span>
                        <span className="font-mono text-[#A7ABB4] tabular-nums">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#21262D]">
                        <div
                          className="h-full rounded-full bg-[#B0C8EC]"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
