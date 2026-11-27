import { supabase, supabaseConfigured } from '@/lib/supabase';
import type {
  AboutPillarItem,
  AboutStatItem,
  ContactLinkItem,
  ExperienceItem,
  GithubLanguageItem,
  GithubRepoItem,
  GithubStatItem,
  MessageItem,
  ProjectItem,
  SkillRow,
  SiteSettings,
  TechItem,
  TestimonialItem,
} from '@/lib/content-types';

/**
 * Fetches a table ordered for display. Returns null when Supabase is not
 * configured, the query fails, or (unless allowEmpty is set) the table is
 * empty so callers can fall back to defaults.
 */
async function fetchTable<T>(
  table: string,
  options: { approvedOnly?: boolean; allowEmpty?: boolean } = {}
): Promise<T[] | null> {
  if (!supabaseConfigured) return null;
  try {
    let query = supabase
      .from(table)
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });
    if (options.approvedOnly) {
      query = query.eq('approved', true);
    }
    const { data, error } = await query;
    if (error || !data) return null;
    if (data.length === 0 && !options.allowEmpty) return null;
    return data as T[];
  } catch {
    return null;
  }
}

async function fetchSettings(): Promise<SiteSettings | null> {
  if (!supabaseConfigured) return null;
  try {
    const { data, error } = await supabase.from('site_settings').select('*');
    if (error || !data) return null;
    const map = Object.fromEntries(
      (data as { key: string; value: Record<string, unknown> }[]).map((row) => [
        row.key,
        row.value,
      ])
    );
    const contact = map['contact'] as SiteSettings | undefined;
    return contact ?? null;
  } catch {
    return null;
  }
}

export type SiteContent = {
  techs: TechItem[] | null;
  skills: SkillRow[] | null;
  projects: ProjectItem[] | null;
  experience: ExperienceItem[] | null;
  testimonials: TestimonialItem[] | null;
  githubRepos: GithubRepoItem[] | null;
  aboutStats: AboutStatItem[] | null;
  aboutPillars: AboutPillarItem[] | null;
  githubStats: GithubStatItem[] | null;
  githubLanguages: GithubLanguageItem[] | null;
  contactLinks: ContactLinkItem[] | null;
  settings: SiteSettings | null;
};

export async function loadSiteContent(): Promise<SiteContent> {
  const [
    techs,
    skills,
    projects,
    experience,
    testimonials,
    githubRepos,
    aboutStats,
    aboutPillars,
    githubStats,
    githubLanguages,
    contactLinks,
    settings,
  ] = await Promise.all([
    fetchTable<TechItem>('tech_stack'),
    fetchTable<SkillRow>('skills'),
    fetchTable<ProjectItem>('projects', { allowEmpty: true }),
    fetchTable<ExperienceItem>('experience'),
    fetchTable<TestimonialItem>('testimonials', { approvedOnly: true, allowEmpty: true }),
    fetchTable<GithubRepoItem>('github_repos'),
    fetchTable<AboutStatItem>('about_stats'),
    fetchTable<AboutPillarItem>('about_pillars'),
    fetchTable<GithubStatItem>('github_stats'),
    fetchTable<GithubLanguageItem>('github_languages'),
    fetchTable<ContactLinkItem>('contact_links'),
    fetchSettings(),
  ]);

  return {
    techs,
    skills,
    projects,
    experience,
    testimonials,
    githubRepos,
    aboutStats,
    aboutPillars,
    githubStats,
    githubLanguages,
    contactLinks,
    settings,
  };
}
