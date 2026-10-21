import type { Project } from '@/content/types';
import HexFrame from '@/components/ui/HexFrame';
import Overline from '@/components/ui/Overline';
import TextLinkArrow from '@/components/ui/TextLinkArrow';
import { Glyph, type GlyphName } from './glyphs';

const BY_GROUP: Record<Project['group'], GlyphName> = {
  'embedded-robotics': 'wave',
  'ai-ml': 'grid',
  systems: 'prompt',
  experiments: 'cube',
  'products-analytics': 'sine',
};

/** Featured transmission card: status overline, title, the question, outcome, link to the case study. */
export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="flex flex-col gap-sm">
      <HexFrame className="max-w-[14rem]"><Glyph name={BY_GROUP[project.group]} /></HexFrame>
      <Overline size="sm">{project.status}</Overline>
      <h3 className="text-title-md font-medium">{project.title}</h3>
      {project.question ? <p className="font-display text-headline tracking-[-0.03em]">{project.question}</p> : null}
      <p className="text-body">{project.summary}</p>
      {project.outcome ? <p className="text-body text-ink-muted">{project.outcome}</p> : null}
      <TextLinkArrow href={`/work/${project.slug}`}>Read the transmission</TextLinkArrow>
    </article>
  );
}
