'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAdmin } from '@/components/admin/admin-context';
import { ImageInput } from '@/components/admin/resource-manager';
import { Button, Card, PageHeader, Spinner, TextArea, TextInput, Toggle, inputCls } from '@/components/admin/ui';
import type { SiteSettings, Stat } from '@/lib/content-types';
import { defaultContent } from '@/lib/content-defaults';

export default function SettingsAdminPage() {
  const { sb, notify, publish } = useAdmin();
  const [s, setS] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    sb.from('site_settings').select('*').eq('id', 1).maybeSingle().then(({ data, error }) => {
      if (error) notify(error.message, 'error');
      setS({ ...defaultContent.settings, ...(data ?? {}) });
    });
  }, [sb, notify]);

  if (!s) return <Spinner />;

  const set = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => setS((p) => (p ? { ...p, [k]: v } : p));
  const setStat = (i: number, patch: Partial<Stat>) => set('stats', s.stats.map((x, j) => (j === i ? { ...x, ...patch } : x)));

  const save = async () => {
    setSaving(true);
    const nullIfBlank = (v: string | null) => (v && v.trim() ? v.trim() : null);
    const { error } = await sb.from('site_settings').upsert({
      id: 1,
      ...s,
      github: nullIfBlank(s.github),
      linkedin: nullIfBlank(s.linkedin),
      twitter: nullIfBlank(s.twitter),
      resume_url: nullIfBlank(s.resume_url),
      stats: s.stats.filter((x) => x.label.trim()),
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) return notify(error.message, 'error');
    notify('Settings saved.');
    publish();
  };

  return (
    <>
      <PageHeader
        title="Site Settings"
        description="Profile details, links and the About section."
        actions={<Button variant="primary" onClick={save} loading={saving}>Save changes</Button>}
      />

      <div className="flex flex-col gap-6">
        <Section title="Availability">
          <Toggle label="Show “available” badge in the hero" checked={s.available} onChange={(v) => set('available', v)} />
          <TextInput label="Badge text" value={s.availability_text} maxLength={80} onChange={(e) => set('availability_text', e.target.value)} />
        </Section>

        <Section title="Contact & links">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput label="Public email" type="email" value={s.email} onChange={(e) => set('email', e.target.value)} />
            <TextInput label="Location" value={s.location} onChange={(e) => set('location', e.target.value)} />
            <TextInput label="GitHub username" value={s.github ?? ''} placeholder="cyber-gentle"
              help="Also powers the live GitHub section." onChange={(e) => set('github', e.target.value)} />
            <TextInput label="LinkedIn URL" type="url" value={s.linkedin ?? ''} placeholder="https://www.linkedin.com/in/…"
              onChange={(e) => set('linkedin', e.target.value)} />
            <TextInput label="X / Twitter URL" type="url" value={s.twitter ?? ''} placeholder="https://x.com/…"
              onChange={(e) => set('twitter', e.target.value)} />
          </div>
          <ImageInput label="Résumé (PDF)" folder="resume" accept="application/pdf" value={s.resume_url ?? ''}
            help="Upload a PDF or paste a link. Shows a “Résumé” button in the hero." onChange={(v) => set('resume_url', v)} />
        </Section>

        <Section title="About section">
          <TextArea label="Bio" value={s.about_bio} maxLength={600} onChange={(e) => set('about_bio', e.target.value)} />
          <TextArea label="Passion" value={s.about_passion} maxLength={600} onChange={(e) => set('about_passion', e.target.value)} />
          <TextArea label="Journey" value={s.about_journey} maxLength={600} onChange={(e) => set('about_journey', e.target.value)} />
          <TextArea label="Current focus" value={s.about_focus} maxLength={600} onChange={(e) => set('about_focus', e.target.value)}
            help="Leave any card blank to hide it." />
        </Section>

        <Section title="Stats">
          <div className="flex flex-col gap-2">
            {s.stats.map((st, i) => (
              <div key={i} className="flex flex-wrap items-center gap-2">
                <input aria-label="Stat label" placeholder="Label" value={st.label} onChange={(e) => setStat(i, { label: e.target.value })}
                  className={`${inputCls} min-w-[160px] flex-1`} />
                <input aria-label="Stat value" type="number" min={0} value={st.value}
                  onChange={(e) => setStat(i, { value: Number(e.target.value) })} className={`${inputCls} w-28`} />
                <input aria-label="Stat suffix" placeholder="+" maxLength={3} value={st.suffix}
                  onChange={(e) => setStat(i, { suffix: e.target.value })} className={`${inputCls} w-16`} />
                <Button variant="ghost" size="sm" aria-label="Remove stat" onClick={() => set('stats', s.stats.filter((_, j) => j !== i))}>
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
          </div>
          {s.stats.length < 4 && (
            <Button size="sm" className="self-start" onClick={() => set('stats', [...s.stats, { label: '', value: 0, suffix: '' }])}>
              <Plus size={14} /> Add stat
            </Button>
          )}
        </Section>
      </div>

      <div className="mt-6 flex justify-end">
        <Button variant="primary" onClick={save} loading={saving}>
          Save changes
        </Button>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="flex flex-col gap-4 p-5">
      <h2 className="font-display text-base font-semibold">{title}</h2>
      {children}
    </Card>
  );
}
