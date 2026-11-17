export type ProjectGroup = 'embedded-robotics' | 'ai-ml' | 'systems' | 'experiments' | 'products-analytics';

export type ProjectStatus =
  | 'Prototype'
  | 'Collaborative'
  | 'Research prototype'
  | 'Tooling'
  | 'Concept'
  | 'Experiment'
  | 'Hackathon'
  | 'Released'
  | 'Open source'
  | 'Project';

export type Look = 'streaks' | 'grid' | 'calm' | 'cloud' | 'tunnel';

export interface Project {
  slug: string;
  title: string;
  group: ProjectGroup;
  category: string;
  status: ProjectStatus;
  /** Hackathon or event name, when relevant. */
  event?: string;
  summary: string;
  tags: string[];
  tech?: string[];
  outcome?: string;
  tradeoff?: string;
  footnote?: string;
  question?: string;
  repo?: string;
  featured: boolean;
  order: number;
}

export interface Note {
  slug: string;
  index: '01' | '02' | '03';
  title: string;
  quote: string;
  /** Slugs of related projects. */
  related: string[];
}

export interface FocusArea {
  title: string;
  detail: string;
}

export interface Hackathon {
  event: string;
  project: string;
  domain: string;
}

export interface Profile {
  name: string;
  email: string;
  github: string;
  linkedin: string;
  university: string;
  location: string;
  mode: string;
  studying: string;
  degree: string;
  year: string;
  /** Non-tech interests, shown plainly. */
  interests: string[];
  /** What the visitor can reach out about. */
  openTo: string;
  siteTitle: string;
  roleLine: string;
  headline: [string, string, string];
  subheadline: string;
  focusAreas: FocusArea[];
  toolkit: string[];
  languages: { name: string; share: number }[];
  hackathons: Hackathon[];
  stats: { repos: number; original: number; forks: number };
  phrases: Record<string, string>;
}

export interface ChapterSpec {
  id: 'hero' | 'work' | 'about' | 'contact';
  index: number;
  label: string;
  overline: string;
  title: string[];
  statement: string;
  paragraph?: string;
  cta?: { label: string; href: string };
  look: Look;
}
