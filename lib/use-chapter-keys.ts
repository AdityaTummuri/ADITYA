'use client';

import { useEffect } from 'react';
import { useLenis } from 'lenis/react';
import { ScrollTrigger } from '@/lib/gsap';

/** Element for a location hash, or null. Never throws on hashes that aren't valid CSS selectors. */
function hashTarget(hash: string): HTMLElement | null {
  if (hash.length < 2) return null;
  let id = hash.slice(1);
  try {
    id = decodeURIComponent(id);
  } catch {
    /* keep the raw id */
  }
  return document.getElementById(id);
}

/**
 * Once fonts have loaded (line breaks, and so section heights, can change): re-measure the
 * ScrollTriggers, then land a `/#section` hash if there is one.
 */
export function useChapterKeys() {
  const lenis = useLenis();

  useEffect(() => {
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      ScrollTrigger.refresh();
      const el = hashTarget(window.location.hash);
      if (!el) return;
      const y = el.getBoundingClientRect().top + window.scrollY;
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
    });
    return () => {
      cancelled = true;
    };
  }, [lenis]);
}
