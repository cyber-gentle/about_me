'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { Session, SupabaseClient } from '@supabase/supabase-js';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';

type Toast = { id: number; tone: 'success' | 'error'; text: string };

type AdminContextValue = {
  sb: SupabaseClient;
  session: Session;
  /** fetch() with the admin's access token attached. */
  adminFetch: (input: string, init?: RequestInit) => Promise<Response>;
  /** Refresh the public homepage after a content change. */
  publish: () => Promise<void>;
  notify: (text: string, tone?: Toast['tone']) => void;
};

const AdminContext = createContext<AdminContextValue | null>(null);

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used inside <AdminProvider>');
  return ctx;
}

export function AdminProvider({
  sb,
  session,
  children,
}: {
  sb: SupabaseClient;
  session: Session;
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);
  const sessionRef = useRef(session);
  sessionRef.current = session;

  const notify = useCallback((text: string, tone: Toast['tone'] = 'success') => {
    const id = ++nextId.current;
    setToasts((t) => [...t, { id, tone, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const adminFetch = useCallback(async (input: string, init: RequestInit = {}) => {
    const { data } = await sb.auth.getSession();
    const token = data.session?.access_token ?? sessionRef.current.access_token;
    return fetch(input, {
      ...init,
      headers: { ...(init.headers ?? {}), Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
  }, [sb]);

  const publish = useCallback(async () => {
    const res = await adminFetch('/api/revalidate', { method: 'POST' }).catch(() => null);
    if (!res?.ok) notify('Saved, but the live page could not be refreshed — it will update within 5 minutes.', 'error');
  }, [adminFetch, notify]);

  const value = useMemo(() => ({ sb, session, adminFetch, publish, notify }), [sb, session, adminFetch, publish, notify]);

  return (
    <AdminContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex flex-col gap-2" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex max-w-sm items-start gap-2 rounded-lg border px-4 py-3 text-sm shadow-xl ${
              t.tone === 'success'
                ? 'border-emerald-500/30 bg-[#0d1a14] text-emerald-200'
                : 'border-red-500/30 bg-[#1c0d0f] text-red-200'
            }`}
          >
            {t.tone === 'success' ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" /> : <AlertCircle size={16} className="mt-0.5 shrink-0" />}
            {t.text}
          </div>
        ))}
      </div>
    </AdminContext.Provider>
  );
}

/** Tracks the Supabase session and whether the signed-in user is an admin. */
export function useAdminSession() {
  const sb = getSupabase();
  const [session, setSession] = useState<Session | null>(null);
  const [state, setState] = useState<'loading' | 'signed-out' | 'not-admin' | 'admin' | 'unconfigured'>(
    sb ? 'loading' : 'unconfigured'
  );

  useEffect(() => {
    if (!sb) return;
    let cancelled = false;

    const check = async (s: Session | null) => {
      if (cancelled) return;
      setSession(s);
      if (!s) return setState('signed-out');
      const { data } = await sb.rpc('is_admin');
      if (!cancelled) setState(data === true ? 'admin' : 'not-admin');
    };

    sb.auth.getSession().then(({ data }) => check(data.session));
    const { data: sub } = sb.auth.onAuthStateChange((event, s) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') check(s);
      else if (s) setSession(s);
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [sb]);

  return { sb, session, state };
}
