'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { loadSiteContent } from '@/lib/content';
import type {
  AboutPillarItem,
  AboutStatItem,
  ContactLinkItem,
  ExperienceItem,
  GithubLanguageItem,
  GithubRepoItem,
  GithubStatItem,
  ProjectItem,
  SiteSettings,
  SkillRow,
  TechItem,
  TestimonialItem,
} from '@/lib/content-types';
import {
  DEFAULT_ABOUT_PILLARS,
  DEFAULT_ABOUT_STATS,
  DEFAULT_CONTACT_LINKS,
  DEFAULT_EXPERIENCE,
  DEFAULT_GITHUB_LANGUAGES,
  DEFAULT_GITHUB_REPOS,
  DEFAULT_GITHUB_STATS,
  DEFAULT_PROJECTS,
  DEFAULT_SETTINGS,
  DEFAULT_SKILLS,
  DEFAULT_TECHS,
  DEFAULT_TESTIMONIALS,
} from '@/lib/content-defaults';

type ContentContextValue = {
  techs: TechItem[];
  skills: SkillRow[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
  testimonials: TestimonialItem[];
  githubRepos: GithubRepoItem[];
  aboutStats: AboutStatItem[];
  aboutPillars: AboutPillarItem[];
  githubStats: GithubStatItem[];
  githubLanguages: GithubLanguageItem[];
  contactLinks: ContactLinkItem[];
  settings: SiteSettings;
  /** True once the initial load has finished */
  ready: boolean;
  /** Re-fetch all content (e.g. after admin edits) */
  reload: () => Promise<void>;
};

const ContentContext = createContext<ContentContextValue | null>(null);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<Record<string, unknown>>({});
  const [ready, setReady] = useState(false);

  const reload = useCallback(async () => {
    try {
      const next = await loadSiteContent();
      setContent(next as unknown as Record<string, unknown>);
    } catch {
      // keep whatever we have; defaults cover nulls
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const value = useMemo<ContentContextValue>(() => {
    const c = content as Partial<ReturnType<typeof loadSiteContent>> & {
      [key: string]: unknown;
    };
    return {
      techs: (c.techs as TechItem[] | null) ?? DEFAULT_TECHS,
      skills: (c.skills as SkillRow[] | null) ?? DEFAULT_SKILLS,
      projects: (c.projects as ProjectItem[] | null) ?? DEFAULT_PROJECTS,
      experience: (c.experience as ExperienceItem[] | null) ?? DEFAULT_EXPERIENCE,
      testimonials: (c.testimonials as TestimonialItem[] | null) ?? DEFAULT_TESTIMONIALS,
      githubRepos: (c.githubRepos as GithubRepoItem[] | null) ?? DEFAULT_GITHUB_REPOS,
      aboutStats: (c.aboutStats as AboutStatItem[] | null) ?? DEFAULT_ABOUT_STATS,
      aboutPillars: (c.aboutPillars as AboutPillarItem[] | null) ?? DEFAULT_ABOUT_PILLARS,
      githubStats: (c.githubStats as GithubStatItem[] | null) ?? DEFAULT_GITHUB_STATS,
      githubLanguages:
        (c.githubLanguages as GithubLanguageItem[] | null) ?? DEFAULT_GITHUB_LANGUAGES,
      contactLinks: (c.contactLinks as ContactLinkItem[] | null) ?? DEFAULT_CONTACT_LINKS,
      settings: { ...DEFAULT_SETTINGS, ...((c.settings as SiteSettings | null) ?? {}) },
      ready,
      reload,
    };
  }, [content, ready, reload]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}
