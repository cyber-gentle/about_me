'use client';

import { useEffect, useState } from 'react';
import { Github, GitFork, Star, Users, BookOpen, ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '@/components/section-heading';
import { Reveal, StaggerContainer, StaggerItem } from '@/components/providers/reveal';
import { site } from '@/lib/site';

type Repo = {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  archived: boolean;
  pushed_at: string;
};

type GitHubData = {
  publicRepos: number;
  followers: number;
  stars: number;
  forks: number;
  topRepos: Repo[];
  languages: { name: string; pct: number; color: string }[];
};

const PALETTE = ['#4F8BFF', '#8A5CFF', '#7FE7FF', '#5EE6A8', '#FFB86B'];

const compact = (n: number) =>
  new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n);

async function loadGitHub(user: string): Promise<GitHubData> {
  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${user}`),
    fetch(`https://api.github.com/users/${user}/repos?per_page=100&sort=pushed`),
  ]);
  if (!userRes.ok || !reposRes.ok) throw new Error('GitHub API unavailable');
  const profile = await userRes.json();
  const all: Repo[] = await reposRes.json();
  const own = all.filter((r) => !r.fork);

  const langCounts = new Map<string, number>();
  for (const r of own) if (r.language) langCounts.set(r.language, (langCounts.get(r.language) ?? 0) + 1);
  const totalLang = Array.from(langCounts.values()).reduce((a, b) => a + b, 0);
  const sorted = Array.from(langCounts.entries()).sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 4);
  const otherCount = sorted.slice(4).reduce((a, [, c]) => a + c, 0);
  const languages = [
    ...top.map(([name, c], i) => ({ name, pct: Math.round((c / totalLang) * 100), color: PALETTE[i] })),
    ...(otherCount ? [{ name: 'Other', pct: Math.round((otherCount / totalLang) * 100), color: '#888' }] : []),
  ];

  const topRepos = own
    .filter((r) => !r.archived)
    .sort((a, b) => b.stargazers_count - a.stargazers_count || +new Date(b.pushed_at) - +new Date(a.pushed_at))
    .slice(0, 4);

  return {
    publicRepos: profile.public_repos ?? own.length,
    followers: profile.followers ?? 0,
    stars: own.reduce((a, r) => a + r.stargazers_count, 0),
    forks: own.reduce((a, r) => a + r.forks_count, 0),
    topRepos,
    languages,
  };
}

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-white/[0.04] ${className}`} />;
}

export function GitHub({ username }: { username: string }) {
  const githubUrl = `https://github.com/${username}`;
  const [data, setData] = useState<GitHubData | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    loadGitHub(username).then(setData).catch(() => setFailed(true));
  }, [username]);

  const stats = data && [
    { icon: BookOpen, label: 'Public Repositories', value: compact(data.publicRepos) },
    { icon: Star, label: 'Stars Earned', value: compact(data.stars) },
    { icon: GitFork, label: 'Forks', value: compact(data.forks) },
    { icon: Users, label: 'Followers', value: compact(data.followers) },
  ];

  return (
    <section id="github" className="relative z-10 py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Open Source"
          title="GitHub Activity"
          description="Live from my GitHub profile — contributions, repositories, and the languages I write in."
        />

        <div className="mt-20 grid gap-6 lg:grid-cols-3">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 lg:col-span-3 lg:grid-cols-4">
            {stats
              ? stats.map((s) => (
                  <div key={s.label} className="flex items-center gap-4 rounded-2xl glass-card p-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#4F8BFF]/20 to-[#8A5CFF]/20">
                      <s.icon size={20} className="text-[#7FE7FF]" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="font-display text-2xl font-bold text-white">{s.value}</div>
                      <div className="text-xs text-white/60">{s.label}</div>
                    </div>
                  </div>
                ))
              : !failed &&
                Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-[88px]" />)}
          </div>

          {/* Contribution chart (real data, rendered by ghchart) */}
          <Reveal className="lg:col-span-2">
            <div className="h-full rounded-2xl glass-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-base font-semibold text-white">Contribution Graph</h3>
                <span className="font-mono text-xs text-white/60">Last 12 months</span>
              </div>
              <div className="overflow-x-auto scrollbar-hide">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://ghchart.rshah.org/4F8BFF/${username}`}
                  alt={`${site.name}'s GitHub contribution graph for the last year`}
                  loading="lazy"
                  className="min-w-[640px] w-full opacity-90 [filter:invert(1)_hue-rotate(180deg)]"
                />
              </div>
            </div>
          </Reveal>

          {/* Language breakdown */}
          <Reveal delay={0.1}>
            <div className="h-full rounded-2xl glass-card p-6">
              <h3 className="mb-4 font-display text-base font-semibold text-white">Languages</h3>
              {data && data.languages.length > 0 ? (
                <>
                  <div className="mb-4 flex h-2.5 overflow-hidden rounded-full" aria-hidden="true">
                    {data.languages.map((l) => (
                      <div key={l.name} style={{ width: `${l.pct}%`, background: l.color }} />
                    ))}
                  </div>
                  <ul className="flex flex-col gap-3">
                    {data.languages.map((l) => (
                      <li key={l.name} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ background: l.color }} aria-hidden="true" />
                          <span className="text-white/70">{l.name}</span>
                        </span>
                        <span className="font-mono text-white/60">{l.pct}%</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs text-white/50">Share of my public repositories.</p>
                </>
              ) : failed ? (
                <p className="text-sm text-white/60">Couldn&apos;t reach GitHub right now.</p>
              ) : (
                <Skeleton className="h-32" />
              )}
            </div>
          </Reveal>

          {/* Repo cards */}
          {data && data.topRepos.length > 0 && (
            <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:col-span-3">
              {data.topRepos.map((r) => (
                <StaggerItem key={r.name}>
                  <a
                    href={r.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="hover"
                    className="group flex h-full flex-col rounded-2xl glass-card p-5 transition-all hover:border-white/20 hover:bg-white/[0.07]"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <Github size={14} className="text-white/60" aria-hidden="true" />
                      <span className="font-mono text-sm font-medium text-white/90">{r.name}</span>
                      <ArrowUpRight size={14} className="ml-auto text-white/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </div>
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-white/60">
                      {r.description ?? 'No description yet.'}
                    </p>
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span>{r.language ?? '—'}</span>
                      <span className="flex items-center gap-3">
                        <span className="flex items-center gap-1" aria-label={`${r.stargazers_count} stars`}>
                          <Star size={12} aria-hidden="true" /> {r.stargazers_count}
                        </span>
                        <span className="flex items-center gap-1" aria-label={`${r.forks_count} forks`}>
                          <GitFork size={12} aria-hidden="true" /> {r.forks_count}
                        </span>
                      </span>
                    </div>
                  </a>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}

          <div className="flex justify-center lg:col-span-3">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 transition-all hover:border-white/30 hover:bg-white/10"
            >
              <Github size={16} aria-hidden="true" />
              View my GitHub profile
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
