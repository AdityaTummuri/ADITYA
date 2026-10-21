import { describe, expect, it } from 'vitest';
import { projects, featuredProjects, projectsByGroup, getProject, caseStudyProjects } from '@/content/projects';
import { notes } from '@/content/notes';
import { profile } from '@/content/profile';
import { chapters } from '@/content/chapters';

const GROUPS = ['embedded-robotics', 'ai-ml', 'systems', 'experiments', 'products-analytics'];
const STATUSES = ['Prototype', 'Collaborative', 'Research prototype', 'Tooling', 'Concept', 'Experiment', 'Hackathon', 'Released', 'Open source', 'Project'];

describe('content', () => {
  it('has 20 projects with unique slugs in information.md order', () => {
    expect(projects).toHaveLength(20);
    expect(new Set(projects.map((p) => p.slug)).size).toBe(20);
    expect(projects.map((p) => p.order)).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
  });

  it('features the four transmissions in order', () => {
    expect(featuredProjects.map((p) => p.slug)).toEqual(['rotormind', 'netra-ugv', 'fracsst-mamba', 'my-terminal']);
  });

  it('gives every project a known group and status', () => {
    for (const p of projects) {
      expect(GROUPS).toContain(p.group);
      expect(STATUSES).toContain(p.status);
    }
    expect(Object.keys(projectsByGroup).sort()).toEqual([...GROUPS].sort());
    expect(Object.values(projectsByGroup).flat()).toHaveLength(20);
  });

  it('exposes 11 case-study projects (those with a trade-off) and looks them up by slug', () => {
    expect(caseStudyProjects).toHaveLength(11);
    expect(getProject('rotormind')?.question).toBe('Can a motor tell you it’s unwell before it fails?');
    expect(getProject('nope')).toBeUndefined();
  });

  it('has three notes whose related slugs exist', () => {
    expect(notes).toHaveLength(3);
    for (const n of notes) for (const r of n.related) expect(getProject(r)).toBeDefined();
  });

  it('carries the headline verbatim', () => {
    expect(profile.headline).toEqual(['I build machines', 'that dream in', 'signals & motion.']);
    expect(profile.email).toBe('adityafrom2007@gmail.com');
  });

  it('defines six chapters, hero pinned for 3 viewports', () => {
    expect(chapters.map((c) => c.id)).toEqual(['hero', 'transmissions', 'index', 'notes', 'now', 'contact']);
    expect(chapters[0].pinViewports).toBe(3);
  });
});
