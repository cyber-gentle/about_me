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

/* Defaults are shown when Supabase is not configured or a table is empty,
   so the site always renders complete content. */

export const DEFAULT_TECHS: TechItem[] = [
  { id: 't1', name: 'Go', short: 'Go', sort_order: 0 },
  { id: 't2', name: 'JavaScript', short: 'JS', sort_order: 1 },
  { id: 't3', name: 'TypeScript', short: 'TS', sort_order: 2 },
  { id: 't4', name: 'HTML', short: 'HTML', sort_order: 3 },
  { id: 't5', name: 'CSS', short: 'CSS', sort_order: 4 },
  { id: 't6', name: 'Git', short: 'Git', sort_order: 5 },
  { id: 't7', name: 'GitHub', short: 'GH', sort_order: 6 },
  { id: 't8', name: 'Docker', short: 'Dkr', sort_order: 7 },
  { id: 't9', name: 'Linux', short: 'Linux', sort_order: 8 },
  { id: 't10', name: 'MySQL', short: 'SQL', sort_order: 9 },
  { id: 't11', name: 'PostgreSQL', short: 'PG', sort_order: 10 },
  { id: 't12', name: 'REST API', short: 'API', sort_order: 11 },
  { id: 't13', name: 'JSON', short: 'JSON', sort_order: 12 },
  { id: 't14', name: 'VS Code', short: 'VS', sort_order: 13 },
];

export const DEFAULT_SKILLS: SkillRow[] = [
  { id: 's1', category: 'Backend', name: 'Go (Golang)', level: 95, sort_order: 0 },
  { id: 's2', category: 'Backend', name: 'REST APIs', level: 92, sort_order: 1 },
  { id: 's3', category: 'Backend', name: 'gRPC', level: 85, sort_order: 2 },
  { id: 's4', category: 'Backend', name: 'Microservices', level: 88, sort_order: 3 },
  { id: 's5', category: 'Frontend', name: 'React / Next.js', level: 84, sort_order: 4 },
  { id: 's6', category: 'Frontend', name: 'TypeScript', level: 86, sort_order: 5 },
  { id: 's7', category: 'Frontend', name: 'Tailwind CSS', level: 90, sort_order: 6 },
  { id: 's8', category: 'Frontend', name: 'Framer Motion', level: 78, sort_order: 7 },
  { id: 's9', category: 'Databases', name: 'PostgreSQL', level: 90, sort_order: 8 },
  { id: 's10', category: 'Databases', name: 'MySQL', level: 88, sort_order: 9 },
  { id: 's11', category: 'Databases', name: 'Redis', level: 82, sort_order: 10 },
  { id: 's12', category: 'Databases', name: 'MongoDB', level: 75, sort_order: 11 },
  { id: 's13', category: 'Cloud', name: 'Docker', level: 90, sort_order: 12 },
  { id: 's14', category: 'Cloud', name: 'Kubernetes', level: 78, sort_order: 13 },
  { id: 's15', category: 'Cloud', name: 'AWS', level: 82, sort_order: 14 },
  { id: 's16', category: 'Cloud', name: 'CI/CD', level: 85, sort_order: 15 },
  { id: 's17', category: 'Tools', name: 'Git / GitHub', level: 94, sort_order: 16 },
  { id: 's18', category: 'Tools', name: 'Linux', level: 88, sort_order: 17 },
  { id: 's19', category: 'Tools', name: 'VS Code', level: 92, sort_order: 18 },
  { id: 's20', category: 'Tools', name: 'Postman', level: 90, sort_order: 19 },
  { id: 's21', category: 'Languages', name: 'Go', level: 95, sort_order: 20 },
  { id: 's22', category: 'Languages', name: 'TypeScript', level: 86, sort_order: 21 },
  { id: 's23', category: 'Languages', name: 'JavaScript', level: 88, sort_order: 22 },
  { id: 's24', category: 'Languages', name: 'Python', level: 78, sort_order: 23 },
];

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 'p1',
    title: 'Distributed API Gateway',
    description:
      'A high-throughput API gateway built in Go with rate limiting, circuit breaking, and dynamic routing. Handles 50k+ requests per second with sub-millisecond overhead.',
    tech: ['Go', 'Redis', 'gRPC', 'Docker'],
    stars: 342,
    image:
      'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=900',
    url: '',
    sort_order: 0,
  },
  {
    id: 'p2',
    title: 'Realtime Analytics Pipeline',
    description:
      'Event-driven data pipeline ingesting millions of events daily with stream processing and live dashboards.',
    tech: ['Go', 'Kafka', 'PostgreSQL', 'Grafana'],
    stars: 218,
    image:
      'https://images.pexels.com/photos/7376/startup-photos.jpg?auto=compress&cs=tinysrgb&w=900',
    url: '',
    sort_order: 1,
  },
  {
    id: 'p3',
    title: 'Cloud-Native Task Queue',
    description:
      'Reliable background job system with retries, priorities, and dead-letter queues. Powered by Go and Redis.',
    tech: ['Go', 'Redis', 'Kubernetes', 'Prometheus'],
    stars: 187,
    image:
      'https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?auto=compress&cs=tinysrgb&w=900',
    url: '',
    sort_order: 2,
  },
  {
    id: 'p4',
    title: 'Developer Portfolio Engine',
    description:
      'A headless CMS for developer portfolios with markdown content, instant previews, and edge-deployed rendering.',
    tech: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind'],
    stars: 156,
    image:
      'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=900',
    url: '',
    sort_order: 3,
  },
  {
    id: 'p5',
    title: 'Observability Toolkit',
    description:
      'OpenTelemetry-based tracing and metrics toolkit for Go services with one-line instrumentation and beautiful dashboards.',
    tech: ['Go', 'OpenTelemetry', 'Grafana', 'Loki'],
    stars: 264,
    image:
      'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=900',
    url: '',
    sort_order: 4,
  },
  {
    id: 'p6',
    title: 'Auth Microservice',
    description:
      'JWT and OAuth2 authentication service with refresh tokens, RBAC, and audit logging.',
    tech: ['Go', 'PostgreSQL', 'JWT', 'Docker'],
    stars: 142,
    image:
      'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=900',
    url: '',
    sort_order: 5,
  },
];

export const DEFAULT_EXPERIENCE: ExperienceItem[] = [
  {
    id: 'e1',
    entry_type: 'work',
    role: 'Senior Backend Engineer',
    company: 'Nebula Cloud',
    period: '2023 - Present',
    description:
      'Leading the design of distributed services handling millions of requests daily. Built the core API gateway and observability platform from the ground up in Go.',
    tags: ['Go', 'Kubernetes', 'gRPC', 'AWS'],
    sort_order: 0,
  },
  {
    id: 'e2',
    entry_type: 'work',
    role: 'Backend Engineer',
    company: 'Quantum Labs',
    period: '2021 - 2023',
    description:
      'Designed and shipped event-driven microservices, real-time data pipelines, and internal developer tooling that cut deployment times by 60%.',
    tags: ['Go', 'Kafka', 'PostgreSQL', 'Docker'],
    sort_order: 1,
  },
  {
    id: 'e3',
    entry_type: 'work',
    role: 'Software Engineer',
    company: 'ByteForge',
    period: '2019 - 2021',
    description:
      'Built REST APIs and internal dashboards. Introduced CI/CD pipelines and automated testing, improving release confidence and velocity.',
    tags: ['Go', 'React', 'MySQL', 'CI/CD'],
    sort_order: 2,
  },
  {
    id: 'e4',
    entry_type: 'education',
    role: 'B.Sc. Computer Science',
    company: 'State University',
    period: '2015 - 2019',
    description:
      'Focused on distributed systems, algorithms, and operating systems. Graduated with honors while building side projects and contributing to open source.',
    tags: ['Algorithms', 'Systems', 'OS', 'C++'],
    sort_order: 3,
  },
];

export const DEFAULT_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'q1',
    quote:
      'Abraham is the kind of engineer every team wants. He shipped our API gateway in record time and it has been rock solid ever since. His attention to performance and clean architecture is unmatched.',
    name: 'Sarah Chen',
    role: 'VP Engineering, Nebula Cloud',
    sort_order: 0,
  },
  {
    id: 'q2',
    quote:
      'Working with Abraham was a turning point for our platform. He redesigned our event pipeline to handle 10x the load without breaking a sweat. A true systems thinker.',
    name: 'Marcus Reid',
    role: 'CTO, Quantum Labs',
    sort_order: 1,
  },
  {
    id: 'q3',
    quote:
      'Rarely do you find an engineer who cares as deeply about developer experience as Abraham does. The tooling he built saved our team hours every single week.',
    name: 'Priya Nair',
    role: 'Staff Engineer, ByteForge',
    sort_order: 2,
  },
  {
    id: 'q4',
    quote:
      'Abraham mentored me through my first production Go service. Patient, precise, and genuinely invested in helping others level up. A phenomenal engineer and teammate.',
    name: 'David Park',
    role: 'Backend Engineer, Nebula Cloud',
    sort_order: 3,
  },
];

export const DEFAULT_GITHUB_REPOS: GithubRepoItem[] = [
  {
    id: 'r1',
    name: 'go-api-gateway',
    description: 'High-throughput API gateway with rate limiting and circuit breaking.',
    language: 'Go',
    stars: 342,
    forks: 48,
    sort_order: 0,
  },
  {
    id: 'r2',
    name: 'event-pipeline',
    description: 'Stream processing pipeline for millions of daily events.',
    language: 'Go',
    stars: 218,
    forks: 31,
    sort_order: 1,
  },
  {
    id: 'r3',
    name: 'task-queue',
    description: 'Reliable background job system with retries and priorities.',
    language: 'Go',
    stars: 187,
    forks: 24,
    sort_order: 2,
  },
  {
    id: 'r4',
    name: 'otel-toolkit',
    description: 'One-line OpenTelemetry instrumentation for Go services.',
    language: 'Go',
    stars: 264,
    forks: 39,
    sort_order: 3,
  },
];

export const DEFAULT_ABOUT_STATS: AboutStatItem[] = [
  { id: 'a1', label: 'Years Learning', value: 2, suffix: '+', sort_order: 0 },
  { id: 'a3', label: 'GitHub Contributions', value: 2300, suffix: '+', sort_order: 2 },
];

export const DEFAULT_ABOUT_PILLARS: AboutPillarItem[] = [
  {
    id: 'ap1',
    title: 'Bio',
    body: 'I am a backend-focused software engineer who loves crafting reliable, high-performance systems. From distributed APIs to data pipelines, I turn complex problems into clean, maintainable code.',
    sort_order: 0,
  },
  {
    id: 'ap2',
    title: 'Passion',
    body: 'I am obsessed with performance, developer experience, and elegant architecture. Every millisecond matters, and so does every line of code that ships to production.',
    sort_order: 1,
  },
  {
    id: 'ap3',
    title: 'Journey',
    body: 'Started with scripting and automation, fell in love with Go and distributed systems, and have been building cloud-native applications and scalable APIs ever since.',
    sort_order: 2,
  },
  {
    id: 'ap4',
    title: 'Current Focus',
    body: 'Deepening my expertise in observability, event-driven architecture, and edge computing - while mentoring the next generation of backend engineers.',
    sort_order: 3,
  },
];

export const DEFAULT_GITHUB_STATS: GithubStatItem[] = [
  { id: 'g1', label: 'Repositories', value: '64', sort_order: 0 },
  { id: 'g2', label: 'Total Stars', value: '1.2k', sort_order: 1 },
  { id: 'g3', label: 'Total Forks', value: '186', sort_order: 2 },
  { id: 'g4', label: 'Followers', value: '540', sort_order: 3 },
];

export const DEFAULT_GITHUB_LANGUAGES: GithubLanguageItem[] = [
  { id: 'gl1', name: 'Go', pct: 62, color: '#4F8BFF', sort_order: 0 },
  { id: 'gl2', name: 'TypeScript', pct: 18, color: '#8A5CFF', sort_order: 1 },
  { id: 'gl3', name: 'Python', pct: 9, color: '#7FE7FF', sort_order: 2 },
  { id: 'gl4', name: 'Other', pct: 11, color: '#888888', sort_order: 3 },
];

export const DEFAULT_CONTACT_LINKS: ContactLinkItem[] = [
  {
    id: 'c1',
    icon: 'mail',
    label: 'Email',
    value: 'info.abdavid@gmail.com',
    href: 'mailto:info.abdavid@gmail.com',
    sort_order: 0,
  },
  {
    id: 'c2',
    icon: 'github',
    label: 'GitHub',
    value: 'cyber-gentle',
    href: 'https://github.com/cyber-gentle',
    sort_order: 1,
  },
  {
    id: 'c3',
    icon: 'linkedin',
    label: 'LinkedIn',
    value: '/in/dev.abraham',
    href: 'https://linkedin.com',
    sort_order: 2,
  },
  {
    id: 'c4',
    icon: 'twitter',
    label: 'Twitter',
    value: '@dev.abraham',
    href: 'https://twitter.com',
    sort_order: 3,
  },
];

export const DEFAULT_SETTINGS = {
  location: 'Lagos State, Nigeria - Remote Worldwide',
};
