'use client';

import { useCallback, useEffect, useState } from 'react';
import { Mail, MailOpen, Trash2, Loader2, Inbox, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { MessageItem } from '@/lib/content-types';
import { Btn, ErrorBanner, DeleteConfirm } from '@/components/admin/crud';

export function MessagesInbox() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (err) setError(err.message);
    else setMessages((data ?? []) as MessageItem[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setRead = async (m: MessageItem, read: boolean) => {
    setBusyId(m.id);
    setError('');
    const { error: err } = await supabase
      .from('messages')
      .update({ read })
      .eq('id', m.id);
    if (err) setError(err.message);
    else setMessages((ms) => ms.map((x) => (x.id === m.id ? { ...x, read } : x)));
    setBusyId(null);
  };

  const remove = async (m: MessageItem) => {
    setBusyId(m.id);
    setError('');
    const { error: err } = await supabase.from('messages').delete().eq('id', m.id);
    if (err) setError(err.message);
    else setMessages((ms) => ms.filter((x) => x.id !== m.id));
    setBusyId(null);
    setConfirmId(null);
  };

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-[#4F8BFF]/25 to-[#8A5CFF]/15">
            <Inbox size={18} className="text-[#7FE7FF]" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold">Messages</h2>
            <p className="text-xs text-white/40">
              {messages.length} total, {unread} unread
            </p>
          </div>
        </div>
        <Btn onClick={load} disabled={loading}>
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          Refresh
        </Btn>
      </div>

      <ErrorBanner message={error} />

      {loading ? (
        <div className="flex items-center justify-center py-10 text-white/40">
          <Loader2 size={22} className="animate-spin text-[#7FE7FF]" />
        </div>
      ) : messages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 px-4 py-10 text-center text-sm text-white/40">
          No messages yet. Submissions from the contact form will appear here.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((m) => {
            const date = new Date(m.created_at).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short',
            });
            return (
              <div
                key={m.id}
                className={`rounded-2xl glass-card p-4 transition-all hover:border-white/20 ${
                  m.read ? 'opacity-70' : 'border-[#4F8BFF]/30'
                }`}
              >
                {confirmId === m.id ? (
                  <DeleteConfirm
                    what={`${m.name} (${m.email})`}
                    busy={busyId === m.id}
                    onConfirm={() => remove(m)}
                    onCancel={() => setConfirmId(null)}
                  />
                ) : (
                  <>
                    <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                      {!m.read && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-[#7FE7FF] shadow-[0_0_10px_#7FE7FF]" />
                      )}
                      <span className="font-display text-sm font-semibold text-white">
                        {m.name}
                      </span>
                      <a
                        href={`mailto:${m.email}`}
                        className="font-mono text-xs text-[#7FE7FF]/80 hover:text-[#7FE7FF]"
                      >
                        {m.email}
                      </a>
                      <span className="ml-auto font-mono text-[10px] text-white/30">
                        {date}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/60">
                      {m.message}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Btn
                        onClick={() => setRead(m, !m.read)}
                        disabled={busyId === m.id}
                        title={m.read ? 'Mark as unread' : 'Mark as read'}
                      >
                        {busyId === m.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : m.read ? (
                          <Mail size={12} />
                        ) : (
                          <MailOpen size={12} />
                        )}
                        {m.read ? 'Mark unread' : 'Mark read'}
                      </Btn>
                      <Btn
                        variant="danger"
                        onClick={() => setConfirmId(m.id)}
                        disabled={busyId === m.id}
                      >
                        <Trash2 size={12} />
                        Delete
                      </Btn>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
