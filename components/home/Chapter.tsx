'use client';

import { useRef } from 'react';
import type { ChapterSpec } from '@/content/types';
import ButtonPrimary from '@/components/ui/ButtonPrimary';
import SplitHeading from '@/components/ui/SplitHeading';
import { ScrollTrigger, useGSAP } from '@/lib/gsap';
import { useScrollStore } from '@/lib/scroll-store';

interface Props {
  spec: ChapterSpec;
  /** Right-hand column beside the hero lockup. */
  aside?: React.ReactNode;
  /** The section's content, filling the screen under the heading. */
  children?: React.ReactNode;
}

/**
 * One home section (DESIGN.md `chapter-lockup`, `statement`). Plain document flow: a section is one
 * or two screens tall and never pinned. ScrollTrigger only tells the scene which look to blend to.
 */
export default function Chapter({ spec, aside, children }: Props) {
  const root = useRef<HTMLElement>(null);
  const hero = spec.index === 0;
  const Heading = hero ? 'h1' : 'h2';

  useGSAP(
    () => {
      const section = root.current;
      if (!section) return;
      ScrollTrigger.create({
        id: spec.id,
        trigger: section,
        start: 'top 55%',
        end: 'bottom 55%',
        onUpdate: (self) => {
          if (self.isActive) useScrollStore.getState().set(spec.index, self.progress, spec.look);
        },
        onToggle: (self) => {
          if (self.isActive) useScrollStore.getState().set(spec.index, self.progress, spec.look);
        },
      });
    },
    { scope: root, dependencies: [spec.id] },
  );

  return (
    <section
      ref={root}
      id={spec.id}
      data-chapter={spec.index}
      aria-labelledby={`${spec.id}-title`}
      className={`relative flex min-h-svh scroll-mt-0 items-center ${hero ? 'pb-[14rem] pt-[calc(var(--header-height)+4rem)]' : 'py-2xl pt-[calc(var(--header-height)+4rem)]'}`}
    >
      <div className="container-8bit grid w-full gap-xl lg:grid-cols-12 lg:gap-x-[var(--gutter)] [&>*]:min-w-0">
        <div className={hero ? 'lg:col-span-7 lg:flex lg:flex-col lg:justify-end' : 'lg:col-span-7'}>
          <Heading id={`${spec.id}-title`} className="font-display font-normal">
            <SplitHeading
              as="span"
              data-overline
              lines={[spec.overline]}
              trigger={!hero}
              className={`block text-primary ${hero ? 'text-display-sm md:text-display-lg' : 'text-title-lg'}`}
            />
            <SplitHeading
              as="span"
              lines={spec.title}
              trigger={!hero}
              delay={0.15}
              className={`block leading-none ${hero ? 'text-display-sm md:text-display-xl' : 'text-headline md:text-display-sm'}`}
            />
          </Heading>
          {hero ? (
            <div className="mt-lg grid gap-sm">
              <p className="font-display text-title-lg tracking-[-0.03em] text-primary">{spec.statement}</p>
              {spec.paragraph ? <p className="max-w-[56rem] text-title-md font-medium">{spec.paragraph}</p> : null}
              {spec.cta ? (
                <div className="mt-xs">
                  <ButtonPrimary href={spec.cta.href}>{spec.cta.label}</ButtonPrimary>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
        {hero ? (
          aside ? <div className="hidden lg:col-span-5 lg:flex lg:flex-col lg:justify-end">{aside}</div> : null
        ) : (
          <div className="grid content-end gap-xs lg:col-span-5">
            <p className="font-display text-title-md tracking-[-0.03em] text-primary">{spec.statement}</p>
            {spec.paragraph ? <p className="text-body text-ink-muted">{spec.paragraph}</p> : null}
          </div>
        )}
        {children ? <div className="lg:col-span-12">{children}</div> : null}
      </div>
    </section>
  );
}
