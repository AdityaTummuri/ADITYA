'use client';

import { useEffect, useRef } from 'react';
import { useScrollStore } from '@/lib/scroll-store';

/** Rotating arc + hint (DESIGN.md `scroll-hint`). Fades out once the visitor leaves the hero. */
export default function ScrollHint() {
  const el = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const apply = (s: { chapter: number }) => {
      if (el.current) el.current.style.opacity = s.chapter > 0 ? '0' : '1';
    };
    apply(useScrollStore.getState());
    return useScrollStore.subscribe(apply);
  }, []);
  return (
    <span ref={el} className="flex items-center gap-xs text-body-sm text-ink transition-opacity duration-500 ease-out-cubic">
      <svg aria-hidden viewBox="25 25 50 50" className="h-[1.6rem] w-[1.6rem] animate-rotate">
        <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="60 200" strokeLinecap="round" />
      </svg>
      Scroll down to continue
    </span>
  );
}
