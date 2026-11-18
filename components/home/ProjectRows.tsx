import Link from 'next/link';
import { caseStudyProjects, featuredProjects, projects } from '@/content/projects';
import ProjectCard from './ProjectCard';

const hasCase = new Set(caseStudyProjects.map((p) => p.slug));
const alsoBuilt = projects.filter((p) => !p.featured).sort((a, b) => a.order - b.order);

/** The work section body: four flagship builds, then everything else as a one-line-each list. */
export default function ProjectRows() {
  return (
    <div className="grid gap-lg">
      <div className="grid gap-sm sm:grid-cols-2 xl:grid-cols-4">
        {featuredProjects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
      <div>
        <h3 className="mb-xs text-body-sm text-ink-muted">Also built</h3>
        <ul className="grid border-t border-hairline md:grid-cols-2 md:gap-x-lg">
          {alsoBuilt.map((p) => {
            const href = hasCase.has(p.slug) ? `/work/${p.slug}` : p.repo;
            const row = (
              <>
                <span className="text-body font-medium transition-colors duration-300 group-hover:text-primary-soft">{p.title}</span>
                <span className="text-right text-body-sm text-primary">{p.status}</span>
              </>
            );
            const cls = 'group flex items-baseline justify-between gap-xs border-b border-hairline py-xs transition-colors duration-300 hover:border-primary/60';
            return (
              <li key={p.slug}>
                {href?.startsWith('/') ? (
                  <Link href={href} className={cls}>{row}</Link>
                ) : href ? (
                  <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{row}</a>
                ) : (
                  <div className={cls}>{row}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
