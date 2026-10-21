'use client';

import { Fragment, useRef } from 'react';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/a11y';
import { useUi } from '@/lib/ui-store';

interface Props {
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  /** Explicit visual lines. */
  lines: string[];
  delay?: number;
  /** Wait for the intro wipe before revealing. */
  gate?: boolean;
  /** Reveal once when the heading scrolls into view (instead of on mount). */
  trigger?: boolean;
  'data-overline'?: boolean;
}

/**
 * Masked line reveal (teardown §5): SplitText lines inside overflow masks, yPercent 100 -> 0.
 * autoSplit re-splits when fonts load or the width changes; the tween is built inside onSplit.
 * Hidden until split to avoid a flash (noscript in the layout restores it).
 */
export default function SplitHeading({ as = 'h2', className, lines, delay = 0, gate = false, trigger = false, 'data-overline': overline }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (reduce) {
        gsap.set(el, { autoAlpha: 1 });
        return;
      }
      let current: gsap.core.Tween | null = null;
      const split = SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'line',
        aria: 'none',
        autoSplit: true,
        onSplit(self) {
          gsap.set(el, { autoAlpha: 1 });
          current = gsap.from(self.lines, {
            yPercent: 100,
            duration: 1,
            ease: 'power3.out',
            stagger: 0.08,
            delay,
            paused: gate && !useUi.getState().introDone,
            ...(trigger ? { scrollTrigger: { trigger: el, start: 'top 90%', once: true } } : {}),
          });
          return current;
        },
      });
      const unsub = useUi.subscribe((s) => {
        if (s.introDone) current?.play();
      });
      return () => {
        unsub();
        split.revert();
      };
    },
    { scope: ref, dependencies: [reduce, gate, delay, trigger], revertOnUpdate: true },
  );

  const Tag = as as 'h2';
  return (
    <Tag ref={ref as React.Ref<HTMLHeadingElement>} className={className} data-split="" data-overline={overline ? '' : undefined} style={{ visibility: 'hidden' }}>
      {lines.map((l, i) => (
        <Fragment key={l}>
          {i > 0 ? <br /> : null}
          {l}
        </Fragment>
      ))}
    </Tag>
  );
}
