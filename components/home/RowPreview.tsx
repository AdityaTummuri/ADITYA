'use client';

import { useEffect, useRef } from 'react';
import type { Look } from '@/content/types';
import { useReducedMotion } from '@/lib/a11y';
import { useScrollStore } from '@/lib/scroll-store';

/**
 * A work row that lends the scene its room's look while the mouse is over it (after a 120 ms
 * intent delay) or while it has keyboard focus (no delay). Off under reduced motion.
 */
export default function RowPreview({ look, className, children }: { look: Look; className?: string; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const timer = useRef<number | undefined>(undefined);
  const set = useScrollStore((s) => s.setPreview);

  useEffect(() => () => {
    window.clearTimeout(timer.current);
    useScrollStore.getState().setPreview(null);
  }, []);

  if (reduce) return <li className={className}>{children}</li>;
  const clear = () => {
    window.clearTimeout(timer.current);
    set(null);
  };
  return (
    <li
      className={className}
      onPointerEnter={(e) => {
        if (e.pointerType !== 'mouse') return;
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => set(look), 120);
      }}
      onPointerLeave={clear}
      onFocus={() => {
        window.clearTimeout(timer.current);
        set(look);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) clear();
      }}
    >
      {children}
    </li>
  );
}
