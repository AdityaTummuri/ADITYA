import type { Project } from '@/content/types';
import Overline from '@/components/ui/Overline';
import TextLinkArrow from '@/components/ui/TextLinkArrow';

/** Featured build: status overline, title, the question it asks, outcome, link to the case study. */
export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="flex h-full flex-col gap-xs rounded-md border border-hairline bg-canvas/60 p-md backdrop-blur-md transition duration-300 ease-out-cubic hover:-translate-y-[2px] hover:border-primary/60">
      <Overline size="sm">{project.status}</Overline>
      <h3 className="text-title-md font-medium">{project.title}</h3>
      {project.question ? <p className="font-display text-body tracking-[-0.01em] text-primary-soft">{project.question}</p> : null}
      <p className="text-body-sm text-ink-muted">{project.summary}</p>
      {project.outcome ? <p className="text-body-sm text-ink">{project.outcome}</p> : null}
      <div className="mt-auto pt-xs">
        <TextLinkArrow href={`/work/${project.slug}`}>read the case</TextLinkArrow>
      </div>
    </article>
  );
}
