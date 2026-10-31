'use client';

import { useCallback, useEffect, useState } from 'react';
import { Code } from 'lucide-react';
import { useAdmin } from '@/components/admin/admin-context';
import { ResourceManager, type FieldDef } from '@/components/admin/resource-manager';
import { Card, PageHeader } from '@/components/admin/ui';
import { skillIconOptions, skillIcons } from '@/lib/skill-icons';

type Category = { id: string; name: string; icon: string; color: string };

const categoryFields: FieldDef[] = [
  { key: 'name', label: 'Category name', type: 'text', required: true, maxLength: 60 },
  { key: 'icon', label: 'Icon', type: 'select', options: skillIconOptions },
  { key: 'color', label: 'Colour', type: 'color' },
];

const skillFields: FieldDef[] = [
  { key: 'name', label: 'Skill', type: 'text', required: true, maxLength: 60 },
  { key: 'level', label: 'Proficiency', type: 'range', help: 'Shown as the bar length and percentage.' },
];

export default function SkillsAdminPage() {
  const { sb } = useAdmin();
  const [categories, setCategories] = useState<Category[]>([]);

  const loadCategories = useCallback(async () => {
    const { data } = await sb.from('skill_categories').select('id, name, icon, color').order('sort_order').order('created_at');
    setCategories((data as Category[]) ?? []);
  }, [sb]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return (
    <>
      <PageHeader title="Skills" description="Skill categories and the percentage shown for each skill." />

      <h2 className="mb-2 font-display text-base font-semibold">Categories</h2>
      <ResourceManager
        table="skill_categories"
        itemLabel="Category"
        fields={categoryFields}
        defaults={{ name: '', icon: 'code', color: '#4F8BFF' }}
        onChanged={loadCategories}
        renderRow={(r) => {
          const Icon = skillIcons[r.icon as string] ?? Code;
          return (
            <div className="flex items-center gap-3">
              <Icon size={16} style={{ color: r.color as string }} aria-hidden="true" />
              <span className="text-sm font-medium">{String(r.name)}</span>
            </div>
          );
        }}
      />

      <div className="mt-10 flex flex-col gap-8">
        {categories.map((c) => (
          <Card key={c.id} className="p-4 sm:p-5">
            <h2 className="mb-1 font-display text-base font-semibold" style={{ color: c.color }}>
              {c.name}
            </h2>
            <ResourceManager
              compact
              table="skills"
              itemLabel="Skill"
              fields={skillFields}
              filter={{ category_id: c.id }}
              defaults={{ name: '', level: 75 }}
              renderRow={(r) => (
                <div className="flex items-center gap-3">
                  <span className="w-40 truncate text-sm">{String(r.name)}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full" style={{ width: `${r.level}%`, background: c.color }} />
                  </div>
                  <span className="w-10 text-right font-mono text-xs text-white/60">{Number(r.level)}%</span>
                </div>
              )}
            />
          </Card>
        ))}
      </div>
    </>
  );
}
