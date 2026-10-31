/**
 * Single source of truth for personal details and links.
 * Leave an optional field undefined to hide it everywhere on the site.
 */
export const site = {
  name: 'Abraham David',
  title: 'Backend Developer & Software Engineer',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  email: 'info.abdavid@gmail.com',
  location: 'Lagos State, Nigeria — Remote Worldwide',
  github: 'cyber-gentle',
  // TODO: fill in your real profile URLs to show them.
  linkedin: undefined as string | undefined, // e.g. 'https://www.linkedin.com/in/your-handle'
  twitter: undefined as string | undefined, // e.g. 'https://x.com/your_handle'
};

export const githubUrl = `https://github.com/${site.github}`;
