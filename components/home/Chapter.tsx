'use client';

import { useRef } from 'react';
import type { ChapterSpec } from '@/content/types';
import ButtonPrimary from '@/components/ui/ButtonPrimary';
import SplitHeading from '@/components/ui/SplitHeading';
import { buildChapterTimeline } from '@/lib/chapter-timeline';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { chapters } from '@/content/chapters';
import { useScrollStore } from '@/lib/scroll-store';

interface Props {
  spec: ChapterSpec;
  /** Card/slider content that lives inside the pinned stage. */
  layerBody?: React.ReactNode;
  /** Tall content (rows, tiles) that flows after the pin releases. */
  flowBody?: React.ReactNode;
}

/**
 * Reports a chapter's progress to the scroll store. ScrollTriggers fire in arbitrary order after a
 * jump, so a finished earlier chapter must not overwrite a later one, and an unreached later chapter
 * must not overwrite the current one.
 */
function report(spec: ChapterSpec, progress: number) {
  const st = useScrollStore.getState();
  if (progress >= 1 && spec.index < st.chapter) return;
  if (progress <= 0 && spec.index > st.chapter) return;
  if (progress <= 0 && spec.index === st.chapter && spec.index > 0) {
    const prev = chapters[spec.index - 1];
    st.set(prev.index, 1, prev.look);
    return;
  }
  st.set(spec.index, progress, spec.look);
}

/**
 * One home chapter (DESIGN.md `chapter-lockup`, `statement`). On wide screens without reduced
 * motion the stage is pinned and its layers are scrubbed by one timeline; otherwise the layers
 * simply stack in document order.
 */
export default function Chapter({ spec, layerBody, flowBody }: Props) {
  const root = useRef<HTMLElement>(null);
  const Heading = spec.index === 0 ? 'h1' : 'h2';
  const reveal = spec.index > 0;

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      const stage = section.querySelector<HTMLElement>('[data-stage]');
      if (!stage) return;
      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        section.setAttribute('data-pinned', '');
        const tl = buildChapterTimeline(section);
        ScrollTrigger.create({
          id: spec.id,
          trigger: stage,
          animation: tl,
          start: 'top top',
          end: () => `+=${spec.pinViewports * window.innerHeight}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => report(spec, self.progress),
          onToggle: (self) => {
            if (self.isActive) report(spec, self.progress);
          },
        });
        return () => section.removeAttribute('data-pinned');
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [spec.id] },
  );

  return (
    <section ref={root} id={spec.id} data-chapter={spec.index} aria-labelledby={`${spec.id}-title`} className="relative">
      <div data-stage className="container-8bit grid gap-xl py-2xl lg:grid-cols-12 lg:gap-x-[var(--gutter)] [&>*]:min-w-0">
        <div data-layer="lockup" className="lg:col-span-12">
          <Heading id={`${spec.id}-title`} className="font-display font-normal">
            <SplitHeading
              as="span"
              data-overline
              lines={[spec.overline]}
              gate={spec.index === 0}
              trigger={reveal}
              className="block text-display-sm text-primary md:text-display-lg"
            />
            <SplitHeading
              as="span"
              lines={spec.title}
              gate={spec.index === 0}
              trigger={reveal}
              delay={0.15}
              className="block text-display-sm leading-none md:text-display-xl"
            />
          </Heading>
        </div>
        <div data-layer="compact" aria-hidden className="font-display tracking-[-0.03em]">
          <span className="block text-title-lg text-primary">{spec.overline}</span>
          <span className="block text-headline">{spec.title.join(' ')}</span>
        </div>
        <p data-layer="statement" className="font-display text-display-sm text-primary tracking-[-0.03em] md:text-display-md lg:col-span-6">
          {spec.statement}
        </p>
        {spec.paragraph ? (
          <p data-layer="paragraph" className="text-title-md font-medium lg:col-span-7 lg:col-start-6">
            {spec.paragraph}
          </p>
        ) : null}
        {layerBody ? <div data-layer="body" className="lg:col-span-12">{layerBody}</div> : null}
        {spec.cta ? (
          <div data-layer="cta" className="lg:col-span-12">
            <ButtonPrimary href={spec.cta.href}>{spec.cta.label}</ButtonPrimary>
          </div>
        ) : null}
      </div>
      {flowBody ? <div data-flow className="container-8bit pb-2xl">{flowBody}</div> : null}
    </section>
  );
}
