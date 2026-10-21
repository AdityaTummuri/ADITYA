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
  university: string;
  location: string;
  mode: string;
  studying: string;
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

export type ChapterBody = 'focus-cards' | 'project-cards' | 'project-rows' | 'notes' | 'now' | 'contact';

export interface ChapterSpec {
  id: 'hero' | 'transmissions' | 'index' | 'notes' | 'now' | 'contact';
  index: number;
  label: string;
  overline: string;
  title: string[];
  statement: string;
  paragraph?: string;
  cta?: { label: string; href: string };
  look: Look;
  pinViewports: number;
  body: ChapterBody;
}
