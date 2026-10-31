'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Mail,
  FolderKanban,
  Gauge,
  Layers,
  Briefcase,
  MessageSquareQuote,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';
import { AdminProvider, useAdminSession } from './admin-context';
import { Button, Spinner } from './ui';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/messages', label: 'Messages', icon: Mail },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/skills', label: 'Skills', icon: Gauge },
  { href: '/admin/tech-stack', label: 'Tech Stack', icon: Layers },
  { href: '/admin/experience', label: 'Experience', icon: Briefcase },
  { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { sb, session, state } = useAdminSession();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (state === 'signed-out') router.replace('/admin/login');
  }, [state, router]);

  useEffect(() => setMenuOpen(false), [pathname]);

  if (state === 'unconfigured') {
    return (
      <Centered>
        Supabase is not configured. Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
        <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
      </Centered>
    );
  }
  if (state === 'loading' || state === 'signed-out' || !sb || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner label="Checking session" />
      </div>
    );
  }
  if (state === 'not-admin') {
    return (
      <Centered>
        <p className="mb-4">
          <strong className="text-white">{session.user.email}</strong> is signed in but is not an admin.
        </p>
        <Button onClick={() => sb.auth.signOut()}>Sign out</Button>
      </Centered>
    );
  }

  const isActive = (href: string) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href));

  const sidebar = (
    <nav aria-label="Admin" className="flex h-full flex-col gap-1 p-4">
      <div className="mb-6 flex items-center gap-2.5 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#4F8BFF] to-[#8A5CFF] font-display text-xs font-bold text-white">
          AD
        </div>
        <div>
          <div className="text-sm font-semibold text-white">Portfolio Admin</div>
          <div className="max-w-[150px] truncate text-[11px] text-white/50">{session.user.email}</div>
        </div>
      </div>
      {nav.map((n) => (
        <Link
          key={n.href}
          href={n.href}
          aria-current={isActive(n.href) ? 'page' : undefined}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
            isActive(n.href) ? 'bg-white/10 text-white' : 'text-white/65 hover:bg-white/5 hover:text-white'
          )}
        >
          <n.icon size={16} aria-hidden="true" />
          {n.label}
        </Link>
      ))}
      <div className="mt-auto flex flex-col gap-1 border-t border-white/10 pt-4">
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/65 hover:bg-white/5 hover:text-white"
        >
          <ExternalLink size={16} aria-hidden="true" /> View site
        </a>
        <button
          onClick={async () => {
            await sb.auth.signOut();
            router.replace('/admin/login');
          }}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-white/65 hover:bg-white/5 hover:text-white"
        >
          <LogOut size={16} aria-hidden="true" /> Sign out
        </button>
      </div>
    </nav>
  );

  return (
    <AdminProvider sb={sb} session={session}>
      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-white/10 bg-[#08080a] lg:block">{sidebar}</aside>

        {/* Mobile sidebar */}
        {menuOpen && (
          <div className="fixed inset-0 z-40 bg-black/70 lg:hidden" onClick={() => setMenuOpen(false)}>
            <aside className="h-full w-64 border-r border-white/10 bg-[#08080a]" onClick={(e) => e.stopPropagation()}>
              {sidebar}
            </aside>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/10 bg-[#050505]/90 px-4 py-3 backdrop-blur lg:hidden">
            <button onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle admin menu" className="rounded-lg p-1.5 text-white/70 hover:bg-white/10">
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span className="text-sm font-semibold text-white">Portfolio Admin</span>
          </header>
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-8">{children}</main>
        </div>
      </div>
    </AdminProvider>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-md rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center text-sm text-white/70">{children}</div>
    </div>
  );
}
