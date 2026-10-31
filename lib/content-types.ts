export type Stat = { label: string; value: number; suffix: string };

export type SiteSettings = {
  available: boolean;
  availability_text: string;
  email: string;
  location: string;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  resume_url: string | null;
  about_bio: string;
  about_passion: string;
  about_journey: string;
  about_focus: string;
  stats: Stat[];
};

export type Project = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  image_url: string | null;
  demo_url: string | null;
  repo_url: string | null;
  accent: string;
  featured: boolean;
  published?: boolean;
  sort_order: number;
};

export type Skill = { id: string; category_id: string; name: string; level: number; sort_order: number };

export type SkillCategory = {
  id: string;
  name: string;
  icon: string;
  color: string;
  sort_order: number;
  skills: Skill[];
};

export type Tech = { id: string; name: string; short: string; sort_order: number };

export type Experience = {
  id: string;
  kind: 'work' | 'education';
  role: string;
  company: string;
  period: string;
  description: string;
  tags: string[];
  accent: string;
  sort_order: number;
};

export type SiteContent = {
  settings: SiteSettings;
  projects: Project[];
  skillCategories: SkillCategory[];
  techs: Tech[];
  experiences: Experience[];
};
