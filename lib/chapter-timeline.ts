import { gsap } from '@/lib/gsap';

/** Scroll fractions (0..1 of a chapter's pinned range) at which each sub-state lands. */
export const LABELS = {
  lockup: 0,
  handoff: 0.18,
  statement: 0.3,
  paragraph: 0.5,
  body: 0.72,
  cta: 0.9,
} as const;

export type LabelName = keyof typeof LABELS;

/** How many viewport heights each chapter stays pinned (mirrors content/chapters.ts pinViewports). */
export const labelFractions = Object.values(LABELS);


/**
 * Builds the scrubbed timeline for one pinned chapter. Total length is 1, so a label's position
 * equals its scroll fraction. Layers fade and drift; lockups reveal their own masked lines.
 */
export function buildChapterTimeline(section: HTMLElement): gsap.core.Timeline {
  const layer = (name: string) => section.querySelector<HTMLElement>(`[data-layer="${name}"]`);
  const lockup = layer('lockup');
  const compact = layer('compact');
  const statement = layer('statement');
  const paragraph = layer('paragraph');
  const body = layer('body');
  const cta = layer('cta');

  gsap.set([compact, statement, paragraph, body, cta].filter(Boolean), { autoAlpha: 0 });

  const tl = gsap.timeline({ defaults: { ease: 'none' } });
  (Object.keys(LABELS) as LabelName[]).forEach((k) => tl.addLabel(k, LABELS[k]));

  if (lockup) tl.to(lockup, { autoAlpha: 0, y: -40, duration: 0.12 }, LABELS.handoff);
  if (compact) tl.fromTo(compact, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.12 }, LABELS.handoff + 0.04);
  if (statement) {
    tl.fromTo(statement, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.1 }, LABELS.statement);
    tl.to(statement, { autoAlpha: 0, y: -40, duration: 0.1 }, LABELS.paragraph + 0.08);
  }
  if (paragraph) {
    tl.fromTo(paragraph, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.1 }, LABELS.paragraph);
    if (body) tl.to(paragraph, { autoAlpha: 0, y: -24, duration: 0.08 }, LABELS.body - 0.04);
  }
  if (body) tl.fromTo(body, { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 0.12 }, LABELS.body);
  if (cta) tl.fromTo(cta, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.08 }, LABELS.cta);
  // pad so the timeline is exactly 1 long
  tl.to({}, { duration: 0 }, 1);
  return tl;
}
