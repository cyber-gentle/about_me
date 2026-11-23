'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Loader2, LogIn, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (err) setError(err.message);
    setBusy(false);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-6">
      {/* Glow backdrop */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(79,139,255,0.5), transparent 70%)',
        }}
      />

      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm rounded-3xl glass-card p-8"
      >
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-[#4F8BFF]/25 to-[#8A5CFF]/15">
            <Lock size={20} className="text-[#7FE7FF]" />
          </div>
          <h1 className="font-display text-xl font-semibold">Admin Sign In</h1>
          <p className="mt-1 text-sm text-white/40">
            Manage your portfolio content
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-xs text-red-300">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="relative">
            <label
              htmlFor="admin-email"
              className="mb-1.5 block text-xs font-medium text-white/50"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-all focus:border-[#4F8BFF]/60 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(79,139,255,0.1)]"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div className="relative">
            <label
              htmlFor="admin-password"
              className="mb-1.5 block text-xs font-medium text-white/50"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-all focus:border-[#4F8BFF]/60 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(79,139,255,0.1)]"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <motion.button
            type="submit"
            disabled={busy}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4F8BFF] to-[#8A5CFF] text-sm font-semibold text-white shadow-[0_8px_32px_rgba(79,139,255,0.4)] transition-all disabled:opacity-70"
          >
            {busy ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn size={16} />
                Sign In
              </>
            )}
          </motion.button>
        </div>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-white/30">
          Create the admin user in Supabase Dashboard, Authentication, Users.
          Your email must match the ADMIN_EMAILS list in the migration.
        </p>
      </motion.form>
    </div>
  );
}
