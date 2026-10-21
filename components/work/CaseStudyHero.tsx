import type { Project } from '@/content/types';
import ButtonPrimary from '@/components/ui/ButtonPrimary';
import Overline from '@/components/ui/Overline';

/** Centred hero for a case study: status overline, title, summary, repository button when there is one. */
export default function CaseStudyHero({ project }: { project: Project }) {
  return (
    <header className="container-8bit flex min-h-[80svh] flex-col items-center justify-center gap-sm pb-xl pt-[calc(var(--header-height)+4rem)] text-center">
      <Overline>{project.status}</Overline>
      <h1 className="font-display text-display-sm font-normal md:text-display-xl">{project.title}</h1>
      <p className="max-w-[72rem] text-title-md font-medium">{project.summary}</p>
      {project.repo ? <ButtonPrimary href={project.repo}>View repository</ButtonPrimary> : null}
    </header>
  );
}
