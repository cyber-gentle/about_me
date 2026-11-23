'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Inbox,
  Globe,
  LogOut,
  Cpu,
  Gauge,
  FolderGit2,
  Route,
  Quote,
  UserRound,
  Github,
  Link2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { MessagesInbox } from '@/components/admin/messages-inbox';
import {
  AboutManager,
  ContactManager,
  ExperienceManager,
  GithubManager,
  ProjectsManager,
  SkillsManager,
  TechStackManager,
  TestimonialsManager,
} from '@/components/admin/managers';

const TABS = [
  { id: 'messages', label: 'Messages', icon: Inbox },
  { id: 'techstack', label: 'Tech Stack', icon: Cpu },
  { id: 'skills', label: 'Skills', icon: Gauge },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'experience', label: 'Experience', icon: Route },
  { id: 'testimonials', label: 'Testimonials', icon: Quote },
  { id: 'about', label: 'About', icon: UserRound },
  { id: 'github', label: 'GitHub', icon: Github },
  { id: 'contact', label: 'Contact', icon: Link2 },
] as const;

type TabId = (typeof TABS)[number]['id'];

export function AdminDashboard({ email }: { email: string }) {
  const [tab, setTab] = useState<TabId>('messages');
  const [signingOut, setSigningOut] = useState(false);

  const signOut = async () => {
    setSigningOut(true);
    await supabase.auth.signOut();
    setSigningOut(false);
  };

  return (
    <div className="relative min-h-screen">
      {/* Glow backdrop */}
      <div
        className="pointer-events-none fixed left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(79,139,255,0.5), transparent 70%)',
        }}
      />

      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#050505]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#4F8BFF] to-[#8A5CFF] shadow-[0_4px_20px_rgba(79,139,255,0.4)]">
              <Globe size={16} className="text-white" />
            </div>
            <div>
              <div className="font-display text-sm font-semibold leading-tight">
                Portfolio Admin
              </div>
              <div className="font-mono text-[10px] text-white/40">{email}</div>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 transition-all hover:border-white/25 hover:bg-white/10"
            >
              <Globe size={12} />
              View site
            </a>
            <button
              onClick={signOut}
              disabled={signingOut}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 transition-all hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
            >
              <LogOut size={12} />
              Sign out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-auto max-w-5xl overflow-x-auto px-6 scrollbar-hide">
          <div className="flex gap-1 pb-3">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  tab === t.id
                    ? 'text-white'
                    : 'text-white/40 hover:bg-white/5 hover:text-white/70'
                }`}
              >
                <t.icon size={13} />
                {t.label}
                {tab === t.id && (
                  <motion.div
                    layoutId="admin-tab"
                    className="absolute inset-0 -z-10 rounded-lg border border-white/10 bg-white/[0.07]"
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 mx-auto max-w-5xl px-6 py-10">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl glass-card p-6 sm:p-8"
        >
          {tab === 'messages' && <MessagesInbox />}
          {tab === 'techstack' && <TechStackManager />}
          {tab === 'skills' && <SkillsManager />}
          {tab === 'projects' && <ProjectsManager />}
          {tab === 'experience' && <ExperienceManager />}
          {tab === 'testimonials' && <TestimonialsManager />}
          {tab === 'about' && <AboutManager />}
          {tab === 'github' && <GithubManager />}
          {tab === 'contact' && <ContactManager />}
        </motion.div>
      </main>
    </div>
  );
}
