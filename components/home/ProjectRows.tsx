'use client';

import { projects } from '@/content/projects';
import { profile } from '@/content/profile';
import Reveal from '@/components/ui/Reveal';
import ButtonPrimary from '@/components/ui/ButtonPrimary';
import RepoCard from './RepoCard';

// 8 curated standout repositories across all domains
const CURATED_SLUGS = [
  'rotormind',
  'netra-ugv',
  'fracsst-mamba',
  'armmimic',
  'hp-omen-fan-control',
  'my-terminal',
  'ascii-cam',
  'sudo-shoot',
];

const curatedProjects = CURATED_SLUGS.map((slug) => projects.find((p) => p.slug === slug)).filter(Boolean) as typeof projects;

/** Curated repository cards with 3D tilt and cursor-reactive hover effects. */
export default function ProjectRows() {
  return (
    <div className="grid gap-xl">
      <Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md lg:gap-lg">
          {curatedProjects.map((p) => (
            <RepoCard key={p.slug} project={p} />
          ))}
        </div>
      </Reveal>

      {/* Footer link to view full catalogue on GitHub */}
      <div className="mt-md flex flex-col items-center justify-center gap-xs text-center border-t border-hairline/40 pt-lg">
        <p className="text-body text-ink-muted">
          Showing 8 of {projects.length} curated repositories.
        </p>
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-body text-primary transition-colors hover:text-primary-soft underline underline-offset-4"
        >
          View all 40+ repositories on GitHub →
        </a>
      </div>
    </div>
  );
}
