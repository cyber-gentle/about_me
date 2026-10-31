'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { Button, TextInput } from '@/components/admin/ui';

export default function AdminLoginPage() {
  const router = useRouter();
  const sb = getSupabase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    sb?.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/admin');
    });
  }, [sb, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sb) return setError('Supabase is not configured.');
    setLoading(true);
    setError('');
    const { error: authError } = await sb.auth.signInWithPassword({ email: email.trim(), password });
    if (authError) {
      setLoading(false);
      return setError('Invalid email or password.');
    }
    const { data: isAdmin } = await sb.rpc('is_admin');
    if (isAdmin !== true) {
      await sb.auth.signOut();
      setLoading(false);
      return setError('This account does not have admin access.');
    }
    router.replace('/admin');
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-8">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#4F8BFF] to-[#8A5CFF]">
            <Lock size={20} aria-hidden="true" />
          </div>
          <h1 className="font-display text-xl font-semibold">Admin sign in</h1>
        </div>
        <div className="flex flex-col gap-4">
          <TextInput label="Email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextInput label="Password" type="password" autoComplete="current-password" required value={password}
            onChange={(e) => setPassword(e.target.value)} />
          <p role="alert" className="min-h-[1.25rem] text-sm text-red-300">
            {error}
          </p>
          <Button type="submit" variant="primary" loading={loading}>
            Sign in
          </Button>
        </div>
      </form>
    </div>
  );
}
