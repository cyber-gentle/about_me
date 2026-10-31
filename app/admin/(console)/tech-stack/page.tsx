'use client';

import { ResourceManager, type FieldDef } from '@/components/admin/resource-manager';
import { PageHeader } from '@/components/admin/ui';

const fields: FieldDef[] = [
  { key: 'name', label: 'Technology', type: 'text', required: true, maxLength: 40, placeholder: 'e.g. PostgreSQL' },
  { key: 'short', label: 'Short label', type: 'text', required: true, maxLength: 5, placeholder: 'e.g. PG',
    help: 'Up to 5 characters — shown on the rotating sphere.' },
];

export default function TechStackAdminPage() {
  return (
    <>
      <PageHeader title="Tech Stack" description="Technologies shown on the interactive sphere and tag list." />
      <ResourceManager
        table="tech_stack"
        itemLabel="Technology"
        fields={fields}
        defaults={{ name: '', short: '' }}
        renderRow={(r) => (
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-12 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[11px] font-bold">
              {String(r.short)}
            </span>
            <span className="text-sm">{String(r.name)}</span>
          </div>
        )}
      />
    </>
  );
}
