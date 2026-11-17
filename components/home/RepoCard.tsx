'use client';

import type { Project } from '@/content/types';
import CardTilt from '@/components/ui/CardTilt';
import Overline from '@/components/ui/Overline';
import TextLinkArrow from '@/components/ui/TextLinkArrow';
import { caseStudyProjects } from '@/content/projects';

const hasCase = new Set(caseStudyProjects.map((p) => p.slug));

export default function RepoCard({ project }: { project: Project }) {
  const isCaseStudy = hasCase.has(project.slug);

  return (
    <CardTilt className="h-full">
      <article className="group flex h-full flex-col justify-between rounded-sm border border-hairline/60 bg-[#080b0d]/90 p-lg backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:bg-[#0c1013]">
        {/* Header: Category & Status */}
        <div>
          <div className="flex items-center justify-between gap-xs">
            <Overline size="sm">{project.category || project.group}</Overline>
            <span className="rounded-full border border-hairline/80 px-xxs py-[0.2rem] font-mono text-[1rem] uppercase tracking-wider text-primary">
              {project.status}
            </span>
          </div>

          {/* Title */}
          <h3 className="mt-xs font-display text-title-md font-medium text-ink transition-colors duration-300 group-hover:text-primary-soft">
            {project.title}
          </h3>

          {/* Question / Summary */}
          {project.question ? (
            <p className="mt-xxs font-display text-[1.5rem] italic text-primary/80">
              {project.question}
            </p>
          ) : null}

          <p className="mt-xs text-body text-ink-muted">
            {project.summary}
          </p>

          {/* Outcome highlight */}
          {project.outcome ? (
            <div className="mt-sm flex items-start gap-xxs rounded-xs bg-white/[0.03] p-xxs text-body-sm text-ink-muted border-l-2 border-primary">
              <span className="font-medium text-primary-soft">Result:</span>
              <span>{project.outcome}</span>
            </div>
          ) : null}
        </div>

        {/* Footer: Tags & Links */}
        <div className="mt-md pt-sm border-t border-hairline/40">
          {/* Tech Tags */}
          {project.tags && project.tags.length > 0 ? (
            <div className="mb-sm flex flex-wrap gap-xxs">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-xs bg-white/[0.05] px-xxs py-[0.15rem] font-mono text-[1.1rem] text-ink-muted group-hover:text-ink transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-md">
            {project.repo ? (
              <TextLinkArrow href={project.repo}>Repository</TextLinkArrow>
            ) : null}
            {isCaseStudy ? (
              <TextLinkArrow href={`/work/${project.slug}`}>Read transmission</TextLinkArrow>
            ) : null}
          </div>
        </div>
      </article>
    </CardTilt>
  );
}

