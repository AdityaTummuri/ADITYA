import type { Project } from '@/content/types';
import { splitOutcome } from '@/content/projects';
import ButtonPrimary from '@/components/ui/ButtonPrimary';
import FeatureRow from '@/components/ui/FeatureRow';
import Reveal from '@/components/ui/Reveal';
import StatTile from '@/components/ui/StatTile';

/** Facts, the question, trade-off and footnote of a case study. */
export default function CaseStudyBody({ project }: { project: Project }) {
  const stat = project.outcome ? splitOutcome(project.outcome) : undefined;
  return (
    <div className="container-8bit grid gap-xl pb-xl">
      <Reveal className="grid gap-xs sm:grid-cols-2 lg:grid-cols-4">
        {stat ? <StatTile value={stat.value} label={stat.label} /> : null}
        <StatTile value={project.status} label="status, labelled for what it is" />
        <StatTile value={project.category} label="category" />
        <StatTile value={String(project.tags.length)} label={project.tags.join(', ')} />
      </Reveal>

      {project.question ? (
        <Reveal className="mx-auto max-w-[96rem] text-center">
          <p className="mb-xs text-body-sm text-ink-muted">The question</p>
          <p className="font-display text-display-sm tracking-[-0.03em] text-primary md:text-display-md">{project.question}</p>
        </Reveal>
      ) : null}

      <Reveal className="mx-auto w-full max-w-[84rem] border-t border-hairline">
        {project.tradeoff ? (
          <FeatureRow titleAs="h2" title="Architecture trade-off">{project.tradeoff}</FeatureRow>
        ) : null}
        {project.footnote ? (
          <FeatureRow titleAs="h2" title="Engineering footnote">{project.footnote}</FeatureRow>
        ) : null}
        {project.tech || project.tags.length ? (
          <FeatureRow titleAs="h2" title="Stack">{(project.tech ?? project.tags).join(' · ')}</FeatureRow>
        ) : null}
      </Reveal>

      {project.repo ? (
        <Reveal className="rounded-md bg-gradient-to-r from-[#455d64] to-[#8bb4c0] p-md">
          <div className="flex flex-wrap items-center justify-between gap-md">
            <p className="font-display text-headline tracking-[-0.03em]">Read the code</p>
            <ButtonPrimary href={project.repo}>Open repository</ButtonPrimary>
          </div>
        </Reveal>
      ) : null}
    </div>
  );
}
