import { projectsByGroup, caseStudyProjects } from '@/content/projects';
import type { ProjectGroup } from '@/content/types';
import AccordionRow from '@/components/ui/AccordionRow';
import FeatureRow from '@/components/ui/FeatureRow';
import TextLinkArrow from '@/components/ui/TextLinkArrow';

const GROUP_LABEL: Record<ProjectGroup, string> = {
  'embedded-robotics': 'Embedded & Robotics',
  'ai-ml': 'AI & Signal',
  systems: 'Systems & Tooling',
  experiments: 'Interfaces & Experiments',
  'products-analytics': 'Analytics & Simulation',
};
const ORDER: ProjectGroup[] = ['embedded-robotics', 'ai-ml', 'systems', 'experiments', 'products-analytics'];
const hasCase = new Set(caseStudyProjects.map((p) => p.slug));

/** Full index: every project grouped by what it is made of, labelled with its status. */
export default function ProjectRows() {
  return (
    <div className="grid gap-xl">
      {ORDER.map((g) => (
        <div key={g}>
          <h3 data-group className="mb-xs font-display text-title-lg tracking-[-0.03em] text-primary">
            {GROUP_LABEL[g]}
          </h3>
          <div className="border-t border-hairline">
            {projectsByGroup[g].map((p) => {
              const links = (
                <div className="mt-xs flex flex-wrap gap-md">
                  {hasCase.has(p.slug) ? <TextLinkArrow href={`/work/${p.slug}`}>Read the transmission</TextLinkArrow> : null}
                  {p.repo ? <TextLinkArrow href={p.repo}>Repository</TextLinkArrow> : null}
                </div>
              );
              return p.tradeoff || p.footnote ? (
                <div key={p.slug} data-row>
                  <AccordionRow title={p.title} meta={p.status}>
                    <p>{p.summary}</p>
                    {p.outcome ? <p className="mt-xs text-ink-muted">{p.outcome}</p> : null}
                    {p.tradeoff ? <p className="mt-sm"><span className="text-ink-muted">Architecture trade-off. </span>{p.tradeoff}</p> : null}
                    {p.footnote ? <p className="mt-xs"><span className="text-ink-muted">Engineering footnote. </span>{p.footnote}</p> : null}
                    {links}
                  </AccordionRow>
                </div>
              ) : (
                <div key={p.slug} data-row>
                  <FeatureRow title={p.title} aside={p.event ? `${p.status} · ${p.event}` : p.status}>
                    <p>{p.summary}</p>
                    {links}
                  </FeatureRow>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
