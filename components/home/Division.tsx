import type { DivisionSpec } from '@/content/types';

interface Props {
  spec: DivisionSpec;
  /** Id of the heading that names the division. */
  labelledBy: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * One home division: a screen of plain document flow, never pinned. HomeRuntime tells the scene which
 * one is on screen. On desktop each division fits one screen; below 760px tall it may grow.
 */
export default function Division({ spec, labelledBy, className = '', children }: Props) {
  return (
    <section
      id={spec.id}
      data-division={spec.index}
      aria-labelledby={labelledBy}
      className={`relative flex scroll-mt-0 flex-col pb-[4rem] pt-[calc(var(--header-height)+2rem)] md:min-h-svh md:pb-[6rem] md:pt-[calc(var(--header-height)+4rem)] ${className}`}
    >
      {children}
    </section>
  );
}
