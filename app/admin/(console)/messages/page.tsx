'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Mail, MailOpen, Send, Trash2 } from 'lucide-react';
import { useAdmin } from '@/components/admin/admin-context';
import { Badge, Button, Card, EmptyState, PageHeader, Spinner, inputCls } from '@/components/admin/ui';
import { cn } from '@/lib/utils';
import { site } from '@/lib/site';

type Message = { id: string; name: string; email: string; message: string; read: boolean; created_at: string };
type Reply = { id: string; body: string; sent_at: string };

export default function MessagesPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <Messages />
    </Suspense>
  );
}

function Messages() {
  const { sb, notify } = useAdmin();
  const router = useRouter();
  const params = useSearchParams();
  const selectedId = params.get('id');
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [query, setQuery] = useState('');

  const load = useCallback(async () => {
    const { data, error } = await sb.from('messages').select('*').order('created_at', { ascending: false }).limit(500);
    if (error) notify(error.message, 'error');
    setMessages((data as Message[]) ?? []);
  }, [sb, notify]);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (messages ?? []).filter(
      (m) =>
        (filter === 'all' || !m.read) &&
        (!q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.message.toLowerCase().includes(q))
    );
  }, [messages, filter, query]);

  const selected = messages?.find((m) => m.id === selectedId) ?? null;
  const select = (id: string | null) => router.push(id ? `/admin/messages?id=${id}` : '/admin/messages');

  const patch = (id: string, changes: Partial<Message>) =>
    setMessages((ms) => ms?.map((m) => (m.id === id ? { ...m, ...changes } : m)) ?? null);

  if (!messages) return <Spinner />;

  const unread = messages.filter((m) => !m.read).length;

  return (
    <>
      <PageHeader title="Messages" description={`${messages.length} total · ${unread} unread`} />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,360px)_1fr]">
        {/* List */}
        <div className={cn('flex flex-col gap-3', selected && 'hidden lg:flex')}>
          <div className="flex gap-2">
            <input
              type="search"
              placeholder="Search messages…"
              aria-label="Search messages"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={inputCls}
            />
            <select value={filter} onChange={(e) => setFilter(e.target.value as 'all' | 'unread')} aria-label="Filter" className={`${inputCls} w-28`}>
              <option value="all" className="bg-[#0c0c0f]">All</option>
              <option value="unread" className="bg-[#0c0c0f]">Unread</option>
            </select>
          </div>
          {visible.length === 0 ? (
            <EmptyState title="No messages" />
          ) : (
            <Card className="max-h-[70vh] divide-y divide-white/10 overflow-y-auto">
              {visible.map((m) => (
                <button
                  key={m.id}
                  onClick={() => select(m.id)}
                  className={cn('flex w-full flex-col gap-0.5 px-4 py-3 text-left hover:bg-white/[0.04]', m.id === selectedId && 'bg-white/[0.07]')}
                >
                  <div className="flex items-center gap-2">
                    {!m.read && <span className="h-2 w-2 shrink-0 rounded-full bg-[#4F8BFF]" aria-label="Unread" />}
                    <span className={cn('truncate text-sm', m.read ? 'text-white/75' : 'font-semibold text-white')}>{m.name}</span>
                    <span className="ml-auto shrink-0 text-[11px] text-white/45">{new Date(m.created_at).toLocaleDateString()}</span>
                  </div>
                  <span className="truncate text-xs text-white/50">{m.message}</span>
                </button>
              ))}
            </Card>
          )}
        </div>

        {/* Detail */}
        <div className={cn(!selected && 'hidden lg:block')}>
          {selected ? (
            <MessageDetail
              key={selected.id}
              message={selected}
              onBack={() => select(null)}
              onChange={(changes) => patch(selected.id, changes)}
              onDeleted={() => {
                setMessages((ms) => ms?.filter((m) => m.id !== selected.id) ?? null);
                select(null);
              }}
            />
          ) : (
            <EmptyState title="Select a message">Pick a message on the left to read and reply.</EmptyState>
          )}
        </div>
      </div>
    </>
  );
}

function MessageDetail({
  message: m,
  onBack,
  onChange,
  onDeleted,
}: {
  message: Message;
  onBack: () => void;
  onChange: (c: Partial<Message>) => void;
  onDeleted: () => void;
}) {
  const { sb, adminFetch, notify } = useAdmin();
  const [replies, setReplies] = useState<Reply[]>([]);
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [emailUnavailable, setEmailUnavailable] = useState(false);

  useEffect(() => {
    sb.from('message_replies').select('id, body, sent_at').eq('message_id', m.id).order('sent_at')
      .then(({ data }) => setReplies((data as Reply[]) ?? []));
    if (!m.read) {
      sb.from('messages').update({ read: true }).eq('id', m.id).then(({ error }) => !error && onChange({ read: true }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [m.id]);

  const toggleRead = async () => {
    const { error } = await sb.from('messages').update({ read: !m.read }).eq('id', m.id);
    if (error) return notify(error.message, 'error');
    onChange({ read: !m.read });
  };

  const remove = async () => {
    if (!confirm('Delete this message and its replies?')) return;
    const { error } = await sb.from('messages').delete().eq('id', m.id);
    if (error) return notify(error.message, 'error');
    notify('Message deleted.');
    onDeleted();
  };

  const mailto = `mailto:${encodeURIComponent(m.email)}?subject=${encodeURIComponent(`Re: Your message to ${site.name}`)}&body=${encodeURIComponent(
    `Hi ${m.name},\n\n${body}\n\n— ${site.name}\n\n> ${m.message.split('\n').join('\n> ')}`
  )}`;

  const send = async () => {
    if (!body.trim()) return;
    setSending(true);
    const res = await adminFetch('/api/admin/reply', { method: 'POST', body: JSON.stringify({ messageId: m.id, body }) });
    setSending(false);
    if (res.status === 501) {
      setEmailUnavailable(true);
      return notify('Email sending is not configured — use “Open in email app” instead.', 'error');
    }
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return notify(`Reply failed: ${json.error ?? res.statusText}`, 'error');
    if (json.reply) setReplies((r) => [...r, json.reply]);
    setBody('');
    notify(`Reply sent to ${m.email}.`);
  };

  return (
    <Card className="flex flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 px-5 py-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="lg:hidden" aria-label="Back to list">
          <ArrowLeft size={14} />
        </Button>
        <div className="ml-auto flex gap-2">
          <Button size="sm" onClick={toggleRead}>
            {m.read ? <Mail size={14} /> : <MailOpen size={14} />} Mark {m.read ? 'unread' : 'read'}
          </Button>
          <Button size="sm" variant="danger" onClick={remove}>
            <Trash2 size={14} /> Delete
          </Button>
        </div>
      </div>

      <div className="px-5 py-5">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <h2 className="font-display text-lg font-semibold">{m.name}</h2>
          {!m.read && <Badge tone="blue">New</Badge>}
        </div>
        <a href={`mailto:${m.email}`} className="text-sm text-[#8fb4ff] hover:underline">
          {m.email}
        </a>
        <div className="mt-1 text-xs text-white/45">{new Date(m.created_at).toLocaleString()}</div>
        <p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-white/85">{m.message}</p>
      </div>

      {replies.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50">Your replies</h3>
          {replies.map((r) => (
            <div key={r.id} className="rounded-lg border border-[#4F8BFF]/25 bg-[#4F8BFF]/[0.06] p-3">
              <p className="whitespace-pre-wrap text-sm text-white/85">{r.body}</p>
              <div className="mt-2 text-[11px] text-white/45">Sent {new Date(r.sent_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-4">
        <label htmlFor="reply" className="text-xs font-medium text-white/75">
          Reply to {m.name}
        </label>
        <textarea
          id="reply"
          rows={6}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your reply…"
          className={`${inputCls} resize-y`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send();
          }}
        />
        <div className="flex flex-wrap items-center justify-end gap-2">
          <a href={mailto} className="inline-flex h-10 items-center rounded-lg px-4 text-sm text-white/70 hover:bg-white/5 hover:text-white">
            Open in email app
          </a>
          <Button variant="primary" onClick={send} loading={sending} disabled={!body.trim() || emailUnavailable}>
            <Send size={14} /> Send reply
          </Button>
        </div>
        <p className="text-[11px] text-white/45">
          {emailUnavailable
            ? 'Add RESEND_API_KEY and RESEND_FROM to enable sending from here.'
            : 'Sends an email from your configured address, quoting the original message. Ctrl/⌘ + Enter to send.'}
        </p>
      </div>
    </Card>
  );
}
