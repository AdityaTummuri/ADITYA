import Link from 'next/link';
import { caseStudyProjects, featuredProjects, projects } from '@/content/projects';
import ProjectCard from './ProjectCard';

// the standout repositories beyond the four featured builds, across every domain
const INDEX_SLUGS = ['armmimic', 'hp-omen-fan-control', 'ascii-cam', 'sudo-shoot', 'leaselens', 'kavach-upi'];

const hasCase = new Set(caseStudyProjects.map((p) => p.slug));
const indexProjects = INDEX_SLUGS.map((slug) => projects.find((p) => p.slug === slug)).filter(Boolean) as typeof projects;

/** The work section body: four featured builds over a compact, labelled index of the rest. */
export default function ProjectRows() {
  return (
    <div className="grid gap-lg">
      <div className="grid gap-sm sm:grid-cols-2 xl:grid-cols-4">
        {featuredProjects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
      <ul className="grid border-t border-hairline md:grid-cols-2 md:gap-x-lg">
        {indexProjects.map((p) => {
          const href = hasCase.has(p.slug) ? `/work/${p.slug}` : p.repo;
          const row = (
            <>
              <span className="text-body font-medium transition-colors duration-300 group-hover:text-primary-soft">{p.title}</span>
              <span className="text-body-sm text-ink-muted">{p.category}</span>
              <span className="text-body-sm text-primary">{p.status}</span>
            </>
          );
          const cls = 'group grid grid-cols-[1fr_auto] items-baseline gap-x-xs border-b border-hairline py-xs transition-colors duration-300 hover:border-primary/60 [&>*:nth-child(2)]:order-3 [&>*:nth-child(2)]:col-span-1 [&>*:nth-child(3)]:text-right';
          return (
            <li key={p.slug}>
              {href?.startsWith('/') ? (
                <Link href={href} className={cls}>{row}</Link>
              ) : href ? (
                <a href={href} className={cls}>{row}</a>
              ) : (
                <div className={cls}>{row}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
