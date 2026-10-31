'use client';

import { ResourceManager, type FieldDef } from '@/components/admin/resource-manager';
import { Badge, PageHeader } from '@/components/admin/ui';

const fields: FieldDef[] = [
  { key: 'kind', label: 'Type', type: 'select', options: [{ value: 'work', label: 'Work' }, { value: 'education', label: 'Education' }] },
  { key: 'role', label: 'Role / degree', type: 'text', required: true, maxLength: 120 },
  { key: 'company', label: 'Company / school', type: 'text', required: true, maxLength: 120 },
  { key: 'period', label: 'Period', type: 'text', required: true, placeholder: '2024 — Present' },
  { key: 'description', label: 'Description', type: 'textarea', maxLength: 600 },
  { key: 'tags', label: 'Tags', type: 'tags' },
  { key: 'accent', label: 'Accent colour', type: 'color' },
];

export default function ExperienceAdminPage() {
  return (
    <>
      <PageHeader title="Experience" description="Timeline entries, top to bottom. Put the most recent first." />
      <ResourceManager
        table="experiences"
        itemLabel="Entry"
        fields={fields}
        defaults={{ kind: 'work', role: '', company: '', period: '', description: '', tags: [], accent: '#4F8BFF' }}
        renderRow={(r) => (
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
              {String(r.role)}
              <Badge tone={r.kind === 'education' ? 'green' : 'neutral'}>{r.kind === 'education' ? 'Education' : 'Work'}</Badge>
            </div>
            <div className="truncate text-xs text-white/55">
              {String(r.company)} · {String(r.period)}
            </div>
          </div>
        )}
      />
    </>
  );
}
