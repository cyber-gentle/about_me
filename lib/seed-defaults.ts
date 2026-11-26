import { supabase } from '@/lib/supabase';
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

type SeedTarget = {
  table: string;
  rows: Record<string, unknown>[];
};

function stripId<T extends { id: string }>(items: T[]): Omit<T, 'id'>[] {
  return items.map(({ id: _id, ...rest }) => rest);
}

const TARGETS: SeedTarget[] = [
  { table: 'tech_stack', rows: stripId(DEFAULT_TECHS) },
  { table: 'skills', rows: stripId(DEFAULT_SKILLS) },
  { table: 'projects', rows: stripId(DEFAULT_PROJECTS) },
  { table: 'experience', rows: stripId(DEFAULT_EXPERIENCE) },
  { table: 'testimonials', rows: stripId(DEFAULT_TESTIMONIALS) },
  { table: 'github_repos', rows: stripId(DEFAULT_GITHUB_REPOS) },
  { table: 'about_stats', rows: stripId(DEFAULT_ABOUT_STATS) },
  { table: 'about_pillars', rows: stripId(DEFAULT_ABOUT_PILLARS) },
  { table: 'github_stats', rows: stripId(DEFAULT_GITHUB_STATS) },
  { table: 'github_languages', rows: stripId(DEFAULT_GITHUB_LANGUAGES) },
  { table: 'contact_links', rows: stripId(DEFAULT_CONTACT_LINKS) },
];

/**
 * Populates any empty Supabase content tables with the built-in defaults so
 * existing site content becomes editable in /admin without duplicating data.
 */
export async function seedEmptyTables(): Promise<{
  seeded: string[];
  error?: string;
}> {
  const seeded: string[] = [];

  for (const { table, rows } of TARGETS) {
    const { count, error: countErr } = await supabase
      .from(table)
      .select('id', { count: 'exact', head: true });

    if (countErr) {
      return { seeded, error: `${table}: ${countErr.message}` };
    }

    if ((count ?? 0) === 0 && rows.length > 0) {
      const { error: insertErr } = await supabase.from(table).insert(rows);
      if (insertErr) {
        return { seeded, error: `${table}: ${insertErr.message}` };
      }
      seeded.push(table);
    }
  }

  const { data: settingsRow, error: settingsReadErr } = await supabase
    .from('site_settings')
    .select('key')
    .eq('key', 'contact')
    .maybeSingle();

  if (settingsReadErr) {
    return { seeded, error: `site_settings: ${settingsReadErr.message}` };
  }

  if (!settingsRow) {
    const { error: settingsInsertErr } = await supabase
      .from('site_settings')
      .insert({ key: 'contact', value: DEFAULT_SETTINGS });
    if (settingsInsertErr) {
      return { seeded, error: `site_settings: ${settingsInsertErr.message}` };
    }
    seeded.push('site_settings');
  }

  return { seeded };
}
