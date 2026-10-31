import {
  Server,
  Layout,
  Database,
  Cloud,
  Wrench,
  Code,
  Cpu,
  Shield,
  Smartphone,
  Terminal,
  Brain,
  GitBranch,
  type LucideIcon,
} from 'lucide-react';

/** Icons selectable for a skill category in the admin console. */
export const skillIcons: Record<string, LucideIcon> = {
  server: Server,
  layout: Layout,
  database: Database,
  cloud: Cloud,
  wrench: Wrench,
  code: Code,
  cpu: Cpu,
  shield: Shield,
  smartphone: Smartphone,
  terminal: Terminal,
  brain: Brain,
  'git-branch': GitBranch,
};

export const skillIconOptions = Object.keys(skillIcons).map((k) => ({ value: k, label: k }));
