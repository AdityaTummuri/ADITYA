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

  // opacity only (never visibility): hidden layers must stay in the accessibility tree and focusable
  const hiddenLayers = [compact, statement, paragraph, body, cta].filter(Boolean);
  if (hiddenLayers.length > 0) gsap.set(hiddenLayers, { opacity: 0 });

  const interactiveLayers = [body, cta].filter(Boolean);
  if (interactiveLayers.length > 0) gsap.set(interactiveLayers, { pointerEvents: 'none' });

  const tl = gsap.timeline({ defaults: { ease: 'none' } });
  (Object.keys(LABELS) as LabelName[]).forEach((k) => tl.addLabel(k, LABELS[k]));

  if (lockup) tl.to(lockup, { opacity: 0, y: -40, rotateX: 3, duration: 0.12 }, LABELS.handoff);
  if (compact) tl.fromTo(compact, { opacity: 0, y: 40, rotateX: -2 }, { opacity: 1, y: 0, rotateX: 0, duration: 0.12 }, LABELS.handoff + 0.04);
  if (statement) {
    tl.fromTo(statement, { opacity: 0, y: 40, rotateY: 2 }, { opacity: 1, y: 0, rotateY: 0, duration: 0.1 }, LABELS.statement);
    tl.to(statement, { opacity: 0, y: -40, rotateY: -1, duration: 0.1 }, LABELS.paragraph + 0.08);
  }
  if (paragraph) {
    tl.fromTo(paragraph, { opacity: 0, y: 24, rotateY: 1.5 }, { opacity: 1, y: 0, rotateY: 0, duration: 0.1 }, LABELS.paragraph);
    if (body) tl.to(paragraph, { opacity: 0, y: -24, duration: 0.08 }, LABELS.body - 0.04);
  }
  if (body) {
    tl.fromTo(body, { opacity: 0, x: 40, rotateY: -3 }, { opacity: 1, x: 0, rotateY: 0, duration: 0.12 }, LABELS.body);
    tl.set(body, { pointerEvents: 'auto' }, LABELS.body + 0.04);
  }
  if (cta) {
    tl.fromTo(cta, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.08 }, LABELS.cta);
    tl.set(cta, { pointerEvents: 'auto' }, LABELS.cta + 0.03);
  }
  // pad so the timeline is exactly 1 long
  tl.to({}, { duration: 0 }, 1);
  return tl;
}

/** Scroll fraction at which each layer is fully shown; focus on a hidden layer jumps here. */
export const REVEALED_AT: Record<string, { from: number; to: number; at: number }> = {
  lockup: { from: 0, to: 0.16, at: 0.02 },
  statement: { from: 0.4, to: 0.58, at: 0.45 },
  paragraph: { from: 0.6, to: 0.7, at: 0.64 },
  body: { from: 0.84, to: 1, at: 0.9 },
  cta: { from: 0.99, to: 1, at: 1 },
};
