'use client';

import { ResourceManager, type FieldDef } from '@/components/admin/resource-manager';
import { Badge, PageHeader } from '@/components/admin/ui';

const fields: FieldDef[] = [
  { key: 'title', label: 'Title', type: 'text', required: true, maxLength: 120 },
  { key: 'description', label: 'Description', type: 'textarea', required: true, maxLength: 600,
    help: 'One or two sentences: what it does and what makes it interesting.' },
  { key: 'tech', label: 'Tech used', type: 'tags' },
  { key: 'image_url', label: 'Cover image', type: 'image' },
  { key: 'demo_url', label: 'Live demo URL', type: 'url', placeholder: 'https://…', help: 'Leave blank to hide the button.' },
  { key: 'repo_url', label: 'Source code URL', type: 'url', placeholder: 'https://github.com/…', help: 'Leave blank to hide the button.' },
  { key: 'accent', label: 'Accent colour', type: 'color' },
  { key: 'featured', label: 'Featured (tall card)', type: 'checkbox' },
  { key: 'published', label: 'Published', type: 'checkbox', help: 'Unpublished projects are hidden from the site.' },
];

export default function ProjectsAdminPage() {
  return (
    <>
      <PageHeader title="Projects" description="Shown in the “Selected Work” section, in this order." />
      <ResourceManager
        table="projects"
        itemLabel="Project"
        fields={fields}
        defaults={{ title: '', description: '', tech: [], image_url: '', demo_url: '', repo_url: '', accent: '#4F8BFF', featured: false, published: true }}
        renderRow={(r) => (
          <div className="flex items-center gap-3">
            <div
              className="h-12 w-16 shrink-0 rounded-md border border-white/10 bg-cover bg-center"
              style={{ backgroundImage: r.image_url ? `url(${JSON.stringify(r.image_url)})` : undefined, backgroundColor: `${r.accent}33` }}
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
                {String(r.title)}
                {!r.published && <Badge tone="amber">Draft</Badge>}
                {!!r.featured && <Badge tone="blue">Featured</Badge>}
              </div>
              <div className="truncate text-xs text-white/50">{(r.tech as string[]).join(' · ')}</div>
            </div>
          </div>
        )}
      />
    </>
  );
}
