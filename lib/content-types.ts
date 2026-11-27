export type TechItem = {
  id: string;
  name: string;
  short: string;
  sort_order: number;
};

export type SkillRow = {
  id: string;
  category: string;
  name: string;
  level: number;
  sort_order: number;
};

export type ProjectItem = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  stars: number;
  image: string;
  url: string;
  sort_order: number;
};

export type ExperienceItem = {
  id: string;
  entry_type: 'work' | 'education';
  role: string;
  company: string;
  period: string;
  description: string;
  tags: string[];
  sort_order: number;
};

export type TestimonialItem = {
  id: string;
  quote: string;
  name: string;
  role: string;
  approved: boolean;
  sort_order: number;
};

export type GithubRepoItem = {
  id: string;
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  sort_order: number;
};

export type AboutStatItem = {
  id: string;
  label: string;
  value: number;
  suffix: string;
  sort_order: number;
};

export type AboutPillarItem = {
  id: string;
  title: string;
  body: string;
  sort_order: number;
};

export type GithubStatItem = {
  id: string;
  label: string;
  value: string;
  sort_order: number;
};

export type GithubLanguageItem = {
  id: string;
  name: string;
  pct: number;
  color: string;
  sort_order: number;
};

export type ContactLinkItem = {
  id: string;
  icon: string;
  label: string;
  value: string;
  href: string;
  sort_order: number;
};

export type MessageItem = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
};

export type SiteSettings = {
  location?: string;
};
