'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Mail, MessageSquareQuote, FolderKanban, Gauge, ArrowRight } from 'lucide-react';
import { useAdmin } from '@/components/admin/admin-context';
import { Badge, Card, PageHeader, Spinner } from '@/components/admin/ui';

type RecentMessage = { id: string; name: string; message: string; read: boolean; created_at: string };

export default function DashboardPage() {
  const { sb } = useAdmin();
  const [data, setData] = useState<{
    unread: number;
    pending: number;
    projects: number;
    skills: number;
    recent: RecentMessage[];
  } | null>(null);

  useEffect(() => {
    const count = (q: PromiseLike<{ count: number | null }>) => Promise.resolve(q).then((r) => r.count ?? 0);
    Promise.all([
      count(sb.from('messages').select('id', { count: 'exact', head: true }).eq('read', false)),
      count(sb.from('testimonials').select('id', { count: 'exact', head: true }).eq('approved', false)),
      count(sb.from('projects').select('id', { count: 'exact', head: true })),
      count(sb.from('skills').select('id', { count: 'exact', head: true })),
      sb.from('messages').select('id, name, message, read, created_at').order('created_at', { ascending: false }).limit(5),
    ]).then(([unread, pending, projects, skills, recent]) =>
      setData({ unread, pending, projects, skills, recent: (recent.data as RecentMessage[]) ?? [] })
    );
  }, [sb]);

  if (!data) return <Spinner />;

  const tiles = [
    { label: 'Unread messages', value: data.unread, href: '/admin/messages', icon: Mail, highlight: data.unread > 0 },
    { label: 'Testimonials to review', value: data.pending, href: '/admin/testimonials', icon: MessageSquareQuote, highlight: data.pending > 0 },
    { label: 'Projects', value: data.projects, href: '/admin/projects', icon: FolderKanban },
    { label: 'Skills', value: data.skills, href: '/admin/skills', icon: Gauge },
  ];

  return (
    <>
      <PageHeader title="Dashboard" description="What needs your attention." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {tiles.map((t) => (
          <Link key={t.label} href={t.href}>
            <Card className={`p-5 transition-colors hover:bg-white/[0.06] ${t.highlight ? 'border-[#4F8BFF]/50' : ''}`}>
              <t.icon size={18} className={t.highlight ? 'text-[#7FE7FF]' : 'text-white/50'} aria-hidden="true" />
              <div className="mt-3 font-display text-3xl font-semibold">{t.value}</div>
              <div className="text-xs text-white/60">{t.label}</div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 mb-3 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Recent messages</h2>
        <Link href="/admin/messages" className="flex items-center gap-1 text-sm text-[#8fb4ff] hover:underline">
          View all <ArrowRight size={14} />
        </Link>
      </div>
      {data.recent.length === 0 ? (
        <Card className="p-6 text-center text-sm text-white/60">No messages yet.</Card>
      ) : (
        <Card className="divide-y divide-white/10">
          {data.recent.map((m) => (
            <Link key={m.id} href={`/admin/messages?id=${m.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.04]">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-sm font-medium">
                  {m.name} {!m.read && <Badge tone="blue">New</Badge>}
                </div>
                <div className="truncate text-sm text-white/55">{m.message}</div>
              </div>
              <div className="shrink-0 text-xs text-white/45">{new Date(m.created_at).toLocaleDateString()}</div>
            </Link>
          ))}
        </Card>
      )}
    </>
  );
}
