import type { SiteContent } from './content-types';
import { site } from './site';

/**
 * Fallback content used when Supabase is not configured (e.g. local dev
 * without env vars) or a query fails. The live site reads from the database,
 * which you edit in /admin.
 */
export const defaultContent: SiteContent = {
  settings: {
    available: true,
    availability_text: 'Available for new opportunities',
    email: site.email,
    location: site.location,
    github: site.github,
    linkedin: site.linkedin ?? null,
    twitter: site.twitter ?? null,
    resume_url: null,
    about_bio:
      'I am a backend-focused software engineer who loves crafting reliable, high-performance systems. From distributed APIs to data pipelines, I turn complex problems into clean, maintainable code.',
    about_passion:
      'I am obsessed with performance, developer experience, and elegant architecture. Every millisecond matters, and so does every line of code that ships to production.',
    about_journey:
      'Started with scripting and automation, fell in love with Go and distributed systems, and have been building cloud-native applications and scalable APIs ever since.',
    about_focus: 'Deepening my expertise in observability, event-driven architecture, and edge computing.',
    stats: [
      { label: 'Years Learning', value: 2, suffix: '+' },
      { label: 'Projects Built', value: 8, suffix: '' },
      { label: 'GitHub Contributions', value: 2300, suffix: '+' },
      { label: 'Technologies', value: 24, suffix: '+' },
    ],
  },
  projects: [],
  skillCategories: [],
  techs: [],
  experiences: [],
};
