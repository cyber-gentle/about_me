'use client';

import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { Loader2, ShieldCheck } from 'lucide-react';
import { supabase, supabaseConfigured } from '@/lib/supabase';
import { LoginForm } from '@/components/admin/login-form';
import { AdminDashboard } from '@/components/admin/admin-dashboard';

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabaseConfigured) {
      setLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!supabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-md rounded-2xl glass-card p-8 text-center">
          <ShieldCheck size={32} className="mx-auto mb-4 text-[#7FE7FF]" />
          <h1 className="mb-2 font-display text-xl font-semibold">
            Supabase not configured
          </h1>
          <p className="text-sm leading-relaxed text-white/50">
            Set <code className="font-mono text-[#7FE7FF]">NEXT_PUBLIC_SUPABASE_URL</code>{' '}
            and{' '}
            <code className="font-mono text-[#7FE7FF]">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{' '}
            in your environment, then reload this page.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 size={28} className="animate-spin text-[#7FE7FF]" />
      </div>
    );
  }

  if (!session) return <LoginForm />;

  return <AdminDashboard email={session.user.email ?? ''} />;
}
