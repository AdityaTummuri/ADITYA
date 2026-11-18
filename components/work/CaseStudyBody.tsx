import Image from 'next/image';
import type { Project } from '@/content/types';
import { splitOutcome } from '@/content/projects';
import ButtonPrimary from '@/components/ui/ButtonPrimary';
import FeatureRow from '@/components/ui/FeatureRow';
import Reveal from '@/components/ui/Reveal';
import StatTile from '@/components/ui/StatTile';

/** A case study told as a story: the question, the choice that shaped it, what got in the way, what it taught. */
export default function CaseStudyBody({ project }: { project: Project }) {
  const stat = project.outcome ? splitOutcome(project.outcome) : undefined;
  return (
    <div className="container-8bit grid gap-xl pb-xl">
      {project.media ? (
        <Reveal className="mx-auto w-full max-w-[84rem] overflow-hidden rounded-md border border-hairline">
          <Image src={project.media.src} alt={project.media.alt} width={project.media.width} height={project.media.height} sizes="(min-width: 1024px) 84rem, 100vw" className="h-auto w-full" />
        </Reveal>
      ) : null}

      <Reveal className="grid gap-xs sm:grid-cols-3">
        {stat ? <StatTile value={stat.value} label={stat.label} /> : null}
        <StatTile value={project.status} label="status, labelled for what it is" />
        <StatTile value={project.category} label="category" />
      </Reveal>

      {project.question ? (
        <Reveal className="mx-auto max-w-[96rem] text-center">
          <p className="mb-xs text-body-sm text-ink-muted">The question</p>
          <p className="font-display text-display-sm tracking-[-0.03em] text-primary md:text-display-md">{project.question}</p>
        </Reveal>
      ) : null}

      <Reveal className="mx-auto w-full max-w-[84rem] border-t border-hairline">
        {project.tradeoff ? (
          <FeatureRow titleAs="h2" title="The choice that shaped it">{project.tradeoff}</FeatureRow>
        ) : null}
        {project.footnote ? (
          <FeatureRow titleAs="h2" title="What got in the way">{project.footnote}</FeatureRow>
        ) : null}
        {project.lesson ? (
          <FeatureRow titleAs="h2" title={project.lesson.title}>{project.lesson.body}</FeatureRow>
        ) : null}
        {project.tech || project.tags.length ? (
          <FeatureRow titleAs="h2" title="Stack">{(project.tech ?? project.tags).join(' · ')}</FeatureRow>
        ) : null}
      </Reveal>

      {project.repo ? (
        <Reveal className="border-t border-hairline pt-md">
          <div className="flex flex-wrap items-center justify-between gap-md">
            <p className="font-display text-headline tracking-[-0.03em]">Read the code</p>
            <ButtonPrimary href={project.repo}>Open repository</ButtonPrimary>
          </div>
        </Reveal>
      ) : null}
    </div>
  );
}
