'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/a11y';
import { useScrollStore } from '@/lib/scroll-store';

/**
 * Right-edge progress rail (DESIGN.md `progress-rail`): dot, 1px track with a white fill that grows
 * with the active chapter's progress, dot. Writes straight to the DOM; no React re-render per frame.
 */
export default function ProgressRail() {
  const reduce = useReducedMotion();
  const fill = useRef<HTMLSpanElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduce) return;
    const apply = (s: { chapter: number; progress: number }) => {
      if (fill.current) fill.current.style.transform = `scaleY(${s.progress})`;
      if (label.current) label.current.textContent = String(s.chapter).padStart(2, '0');
    };
    apply(useScrollStore.getState());
    return useScrollStore.subscribe(apply);
  }, [reduce]);

  if (reduce) return null;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-[var(--margin)] top-0 z-30 hidden h-full w-[0.2rem] flex-col items-center justify-center [@media(pointer:fine)]:flex"
    >
      <span ref={label} className="mb-xs whitespace-nowrap text-body-sm text-ink-muted">00</span>
      <span className="h-[0.2rem] w-[0.2rem] bg-ink" />
      <span className="relative my-sm h-[27.8rem] w-px bg-hairline-strong">
        <span ref={fill} data-rail-fill className="absolute inset-0 origin-top bg-ink" style={{ transform: 'scaleY(0)' }} />
      </span>
      <span className="h-[0.2rem] w-[0.2rem] bg-ink" />
    </div>
  );
}
