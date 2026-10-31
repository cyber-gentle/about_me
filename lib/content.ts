import { createClient } from '@supabase/supabase-js';
import type { Experience, Project, SiteContent, SiteSettings, Skill, SkillCategory, Tech } from './content-types';
import { defaultContent } from './content-defaults';

/** Loads all public site content on the server. Falls back per-section to defaults. */
export async function getContent(): Promise<SiteContent> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return defaultContent;

  const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

  const [settings, projects, categories, skills, techs, experiences] = await Promise.all([
    sb.from('site_settings').select('*').eq('id', 1).maybeSingle(),
    sb.from('projects').select('*').eq('published', true).order('sort_order').order('created_at'),
    sb.from('skill_categories').select('*').order('sort_order').order('created_at'),
    sb.from('skills').select('*').order('sort_order').order('created_at'),
    sb.from('tech_stack').select('*').order('sort_order').order('created_at'),
    sb.from('experiences').select('*').order('sort_order').order('created_at'),
  ]);

  const skillCategories: SkillCategory[] | null =
    categories.error || skills.error || !categories.data
      ? null
      : categories.data.map((c) => ({
          ...c,
          skills: ((skills.data ?? []) as Skill[]).filter((s) => s.category_id === c.id),
        }));

  return {
    settings: settings.data
      ? { ...defaultContent.settings, ...(settings.data as Partial<SiteSettings>) }
      : defaultContent.settings,
    projects: (projects.data as Project[] | null) ?? defaultContent.projects,
    skillCategories: skillCategories ?? defaultContent.skillCategories,
    techs: (techs.data as Tech[] | null) ?? defaultContent.techs,
    experiences: (experiences.data as Experience[] | null) ?? defaultContent.experiences,
  };
}
