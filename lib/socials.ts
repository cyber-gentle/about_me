import { Mail, Github, Linkedin, Twitter, type LucideIcon } from 'lucide-react';
import type { SiteSettings } from './content-types';

export type SocialLink = { icon: LucideIcon; label: string; value: string; href: string; color: string };

const handleFromUrl = (url: string) => url.replace(/\/+$/, '').split('/').pop() ?? url;

/** Builds the list of contact links from settings, skipping anything left blank. */
export function buildSocials(s: Pick<SiteSettings, 'email' | 'github' | 'linkedin' | 'twitter'>): SocialLink[] {
  const links: (SocialLink | null)[] = [
    s.email ? { icon: Mail, label: 'Email', value: s.email, href: `mailto:${s.email}`, color: '#4F8BFF' } : null,
    s.github
      ? { icon: Github, label: 'GitHub', value: s.github, href: `https://github.com/${s.github}`, color: '#8A5CFF' }
      : null,
    s.linkedin
      ? { icon: Linkedin, label: 'LinkedIn', value: handleFromUrl(s.linkedin), href: s.linkedin, color: '#7FE7FF' }
      : null,
    s.twitter
      ? { icon: Twitter, label: 'X / Twitter', value: '@' + handleFromUrl(s.twitter), href: s.twitter, color: '#4F8BFF' }
      : null,
  ];
  return links.filter((l): l is SocialLink => l !== null);
}
