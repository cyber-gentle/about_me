'use client';

import { useEffect, useState } from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type {
  AboutPillarItem,
  AboutStatItem,
  ContactLinkItem,
  ExperienceItem,
  GithubLanguageItem,
  GithubRepoItem,
  GithubStatItem,
  ProjectItem,
  SkillRow,
  TechItem,
  TestimonialItem,
} from '@/lib/content-types';
import { ListManager, type FieldDef } from '@/components/admin/list-manager';
import { Btn, ErrorBanner, Field } from '@/components/admin/crud';

const splitList = (v: string) =>
  v
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

/* ------------------------------------------------------------------ */
/* Tech stack                                                          */
/* ------------------------------------------------------------------ */

const TECH_FIELDS: FieldDef[] = [
  { key: 'name', label: 'Name', required: true, half: true, placeholder: 'PostgreSQL' },
  { key: 'short', label: 'Short label', half: true, placeholder: 'PG' },
];

export function TechStackManager() {
  return (
    <ListManager<TechItem>
      table="tech_stack"
      what="Technologies"
      fields={TECH_FIELDS}
      titleOf={(r) => r.name}
      subtitleOf={(r) => r.short}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Skills                                                              */
/* ------------------------------------------------------------------ */

const SKILL_FIELDS: FieldDef[] = [
  { key: 'category', label: 'Category', required: true, half: true, placeholder: 'Backend' },
  { key: 'level', label: 'Level (0-100)', type: 'number', half: true, default: '80' },
  { key: 'name', label: 'Skill', required: true, placeholder: 'Go (Golang)' },
];

export function SkillsManager() {
  return (
    <ListManager<SkillRow>
      table="skills"
      what="Skills"
      fields={SKILL_FIELDS}
      titleOf={(r) => r.name}
      subtitleOf={(r) => `${r.category} - ${r.level}%`}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

const PROJECT_FIELDS: FieldDef[] = [
  { key: 'title', label: 'Title', required: true },
  { key: 'description', label: 'Description', type: 'textarea', rows: 3 },
  {
    key: 'tech',
    label: 'Tech tags (comma separated)',
    placeholder: 'Go, Redis, Docker',
    parse: splitList,
  },
  { key: 'stars', label: 'GitHub stars', type: 'number', half: true, default: '0' },
  { key: 'url', label: 'Live demo URL', half: true, placeholder: 'https://...' },
  { key: 'image', label: 'Image URL', placeholder: 'https://...' },
];

export function ProjectsManager() {
  return (
    <ListManager<ProjectItem>
      table="projects"
      what="Projects"
      fields={PROJECT_FIELDS}
      titleOf={(r) => r.title}
      subtitleOf={(r) => (r.stars ? `${r.stars} stars` : '')}
      detail={(r) =>
        r.tech?.length ? (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {r.tech.map((t) => (
              <span
                key={t}
                className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/50"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null
      }
    />
  );
}

/* ------------------------------------------------------------------ */
/* Experience + education timeline                                     */
/* ------------------------------------------------------------------ */

const EXPERIENCE_FIELDS: FieldDef[] = [
  {
    key: 'entry_type',
    label: 'Type',
    type: 'select',
    half: true,
    default: 'work',
    options: [
      { value: 'work', label: 'Work' },
      { value: 'education', label: 'Education' },
    ],
  },
  { key: 'period', label: 'Period', half: true, placeholder: '2023 - Present' },
  { key: 'role', label: 'Role / Qualification', required: true },
  { key: 'company', label: 'Company / School' },
  { key: 'description', label: 'Description', type: 'textarea', rows: 3 },
  {
    key: 'tags',
    label: 'Tags (comma separated)',
    placeholder: 'Go, Kubernetes, gRPC',
    parse: splitList,
  },
];

export function ExperienceManager() {
  return (
    <ListManager<ExperienceItem>
      table="experience"
      what="Experience"
      fields={EXPERIENCE_FIELDS}
      titleOf={(r) => r.role}
      subtitleOf={(r) =>
        `${r.entry_type === 'education' ? 'Education' : 'Work'} - ${r.company} (${r.period})`
      }
    />
  );
}

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */

const TESTIMONIAL_FIELDS: FieldDef[] = [
  { key: 'quote', label: 'Quote', type: 'textarea', rows: 4, required: true },
  { key: 'name', label: 'Name', required: true, half: true, placeholder: 'Sarah Chen' },
  { key: 'role', label: 'Role / Company', half: true, placeholder: 'VP Engineering, Nebula Cloud' },
];

export function TestimonialsManager() {
  return (
    <ListManager<TestimonialItem>
      table="testimonials"
      what="Testimonials"
      fields={TESTIMONIAL_FIELDS}
      titleOf={(r) => r.name}
      subtitleOf={(r) => r.role}
    />
  );
}

/* ------------------------------------------------------------------ */
/* About: stats + pillars                                              */
/* ------------------------------------------------------------------ */

const STAT_FIELDS: FieldDef[] = [
  { key: 'label', label: 'Label', required: true, half: true, placeholder: 'Years Learning' },
  { key: 'suffix', label: 'Suffix', half: true, placeholder: '+' },
  { key: 'value', label: 'Number', type: 'number', default: '0' },
];

const PILLAR_FIELDS: FieldDef[] = [
  { key: 'title', label: 'Title', required: true, half: true, placeholder: 'Bio' },
  { key: 'body', label: 'Text', type: 'textarea', rows: 3 },
];

export function AboutManager() {
  return (
    <div className="flex flex-col gap-12">
      <ListManager<AboutStatItem>
        table="about_stats"
        what="Stats"
        fields={STAT_FIELDS}
        titleOf={(r) => r.label}
        subtitleOf={(r) => `${r.value.toLocaleString()}${r.suffix}`}
      />
      <ListManager<AboutPillarItem>
        table="about_pillars"
        what="Pillars"
        fields={PILLAR_FIELDS}
        titleOf={(r) => r.title}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* GitHub: repos + stats + languages                                   */
/* ------------------------------------------------------------------ */

const REPO_FIELDS: FieldDef[] = [
  { key: 'name', label: 'Repository name', required: true, placeholder: 'go-api-gateway' },
  { key: 'description', label: 'Description', type: 'textarea', rows: 2 },
  { key: 'language', label: 'Language', half: true, placeholder: 'Go' },
  { key: 'stars', label: 'Stars', type: 'number', half: true, default: '0' },
  { key: 'forks', label: 'Forks', type: 'number', half: true, default: '0' },
];

const GH_STAT_FIELDS: FieldDef[] = [
  { key: 'label', label: 'Label', required: true, half: true, placeholder: 'Total Stars' },
  { key: 'value', label: 'Value', half: true, placeholder: '1.2k' },
];

const LANGUAGE_FIELDS: FieldDef[] = [
  { key: 'name', label: 'Language', required: true, half: true, placeholder: 'Go' },
  { key: 'pct', label: 'Percent (0-100)', type: 'number', half: true, default: '0' },
  { key: 'color', label: 'Color (hex)', half: true, default: '#4F8BFF', placeholder: '#4F8BFF' },
];

export function GithubManager() {
  return (
    <div className="flex flex-col gap-12">
      <ListManager<GithubRepoItem>
        table="github_repos"
        what="Repositories"
        fields={REPO_FIELDS}
        titleOf={(r) => r.name}
        subtitleOf={(r) => `${r.stars} stars - ${r.forks} forks`}
      />
      <ListManager<GithubStatItem>
        table="github_stats"
        what="Stat cards"
        fields={GH_STAT_FIELDS}
        titleOf={(r) => r.label}
        subtitleOf={(r) => r.value}
      />
      <ListManager<GithubLanguageItem>
        table="github_languages"
        what="Languages"
        fields={LANGUAGE_FIELDS}
        titleOf={(r) => r.name}
        subtitleOf={(r) => `${r.pct}%`}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Contact: links + location                                           */
/* ------------------------------------------------------------------ */

const LINK_FIELDS: FieldDef[] = [
  {
    key: 'icon',
    label: 'Icon',
    type: 'select',
    half: true,
    default: 'mail',
    options: [
      { value: 'mail', label: 'Email' },
      { value: 'github', label: 'GitHub' },
      { value: 'linkedin', label: 'LinkedIn' },
      { value: 'twitter', label: 'Twitter' },
    ],
  },
  { key: 'label', label: 'Label', required: true, half: true, placeholder: 'Email' },
  { key: 'value', label: 'Display text', placeholder: 'info.abdavid@gmail.com' },
  { key: 'href', label: 'Link URL', placeholder: 'mailto:... or https://...' },
];

export function ContactManager() {
  return (
    <div className="flex flex-col gap-12">
      <ListManager<ContactLinkItem>
        table="contact_links"
        what="Social links"
        fields={LINK_FIELDS}
        titleOf={(r) => r.label}
        subtitleOf={(r) => r.value}
      />
      <LocationEditor />
    </div>
  );
}

function LocationEditor() {
  const [location, setLocation] = useState('');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'contact')
      .maybeSingle()
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else {
          const v = data?.value as { location?: string } | null;
          setLocation(v?.location ?? 'Lagos State, Nigeria - Remote Worldwide');
        }
        setLoaded(true);
      });
  }, []);

  const save = async () => {
    setBusy(true);
    setSaved(false);
    setError('');
    const { error: err } = await supabase.from('site_settings').upsert({
      key: 'contact',
      value: { location },
      updated_at: new Date().toISOString(),
    });
    if (err) setError(err.message);
    else setSaved(true);
    setBusy(false);
  };

  return (
    <div className="rounded-2xl glass-card p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-[#4F8BFF]/25 to-[#8A5CFF]/15">
          <MapPin size={16} className="text-[#7FE7FF]" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold">Location</h2>
          <p className="text-xs text-white/40">
            Shown in the contact section.
          </p>
        </div>
      </div>
      <ErrorBanner message={error} />
      {!loaded ? (
        <Loader2 size={18} className="animate-spin text-[#7FE7FF]" />
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Field
              label="Location text"
              value={location}
              onChange={setLocation}
              placeholder="Lagos State, Nigeria - Remote Worldwide"
            />
          </div>
          <Btn variant="primary" onClick={save} disabled={busy}>
            {busy ? <Loader2 size={12} className="animate-spin" /> : null}
            {saved ? 'Saved' : 'Save'}
          </Btn>
        </div>
      )}
    </div>
  );
}
