'use client';

import { useCallback, useEffect, useState } from 'react';
import { Check, EyeOff, Trash2 } from 'lucide-react';
import { useAdmin } from '@/components/admin/admin-context';
import { Badge, Button, Card, EmptyState, PageHeader, Spinner } from '@/components/admin/ui';
import { cn } from '@/lib/utils';

type Testimonial = { id: string; name: string; role: string | null; email: string; quote: string; approved: boolean; created_at: string };

export default function TestimonialsAdminPage() {
  const { sb, notify } = useAdmin();
  const [items, setItems] = useState<Testimonial[] | null>(null);
  const [tab, setTab] = useState<'pending' | 'approved'>('pending');
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await sb.from('testimonials').select('*').order('created_at', { ascending: false });
    if (error) notify(error.message, 'error');
    setItems((data as Testimonial[]) ?? []);
  }, [sb, notify]);

  useEffect(() => {
    load();
  }, [load]);

  const setApproved = async (t: Testimonial, approved: boolean) => {
    setBusy(t.id);
    const { error } = await sb.from('testimonials').update({ approved }).eq('id', t.id);
    setBusy(null);
    if (error) return notify(error.message, 'error');
    notify(approved ? `Published ${t.name}'s testimonial.` : 'Testimonial hidden from the site.');
    setItems((xs) => xs?.map((x) => (x.id === t.id ? { ...x, approved } : x)) ?? null);
  };

  const remove = async (t: Testimonial) => {
    if (!confirm(`Delete ${t.name}'s testimonial?`)) return;
    setBusy(t.id);
    const { error } = await sb.from('testimonials').delete().eq('id', t.id);
    setBusy(null);
    if (error) return notify(error.message, 'error');
    notify('Testimonial deleted.');
    setItems((xs) => xs?.filter((x) => x.id !== t.id) ?? null);
  };

  if (!items) return <Spinner />;
  const pending = items.filter((t) => !t.approved);
  const approved = items.filter((t) => t.approved);
  const list = tab === 'pending' ? pending : approved;

  return (
    <>
      <PageHeader title="Testimonials" description="Submitted by visitors. Nothing appears on the site until you approve it." />
      <div role="tablist" className="mb-4 inline-flex rounded-lg border border-white/10 p-1">
        {(['pending', 'approved'] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn('rounded-md px-4 py-1.5 text-sm capitalize', tab === t ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white')}
          >
            {t} ({t === 'pending' ? pending.length : approved.length})
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState title={tab === 'pending' ? 'Nothing waiting for review' : 'No published testimonials yet'} />
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((t) => (
            <Card key={t.id} className="p-5">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="font-medium">{t.name}</span>
                {t.role && <span className="text-sm text-white/55">· {t.role}</span>}
                <Badge tone={t.approved ? 'green' : 'amber'}>{t.approved ? 'Published' : 'Pending'}</Badge>
                <span className="ml-auto text-xs text-white/45">{new Date(t.created_at).toLocaleDateString()}</span>
              </div>
              <blockquote className="whitespace-pre-wrap text-sm leading-relaxed text-white/85">“{t.quote}”</blockquote>
              <div className="mt-2 text-xs text-white/45">
                Submitted by <a href={`mailto:${t.email}`} className="text-[#8fb4ff] hover:underline">{t.email}</a> (private)
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {t.approved ? (
                  <Button size="sm" onClick={() => setApproved(t, false)} loading={busy === t.id}>
                    <EyeOff size={14} /> Unpublish
                  </Button>
                ) : (
                  <Button size="sm" variant="primary" onClick={() => setApproved(t, true)} loading={busy === t.id}>
                    <Check size={14} /> Approve &amp; publish
                  </Button>
                )}
                <Button size="sm" variant="danger" onClick={() => remove(t)} disabled={busy === t.id}>
                  <Trash2 size={14} /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
