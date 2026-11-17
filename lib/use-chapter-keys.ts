'use client';

import { useEffect } from 'react';
import { useLenis } from 'lenis/react';
import { ScrollTrigger } from '@/lib/gsap';

/** Lands `/#section` hashes once fonts have loaded and the sections have measured. */
export function useChapterKeys() {
  const lenis = useLenis();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      ScrollTrigger.refresh();
      const el = document.querySelector(hash);
      if (!el) return;
      const y = el.getBoundingClientRect().top + window.scrollY;
      if (lenis) lenis.scrollTo(y, { immediate: true });
      else window.scrollTo(0, y);
    });
    return () => {
      cancelled = true;
    };
  }, [lenis]);
}
