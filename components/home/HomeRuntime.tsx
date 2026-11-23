'use client';

import { useEffect } from 'react';
import { divisions } from '@/content/divisions';
import { scrollToY } from '@/lib/lenis';
import { useScrollStore } from '@/lib/scroll-store';

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
 * Tells the scene which division holds the middle of the screen (the one crossing the line at 55%),
 * and lands a `/#division` hash once fonts are in. Renders nothing.
 */
export default function HomeRuntime() {
  useEffect(() => {
    const store = useScrollStore.getState();
    store.setPreview(null);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const d = e.isIntersecting && divisions.find((x) => x.id === e.target.id);
          if (d) useScrollStore.getState().set(d.index, d.look);
        }
      },
      { rootMargin: '-55% 0px -45% 0px' },
    );
    for (const d of divisions) {
      const el = document.getElementById(d.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  // Fonts can move line breaks, and so section heights: land the hash again once they are in, unless
  // the visitor has already scrolled.
  useEffect(() => {
    let cancelled = false;
    const cancel = () => {
      cancelled = true;
    };
    window.addEventListener('wheel', cancel, { passive: true, once: true });
    window.addEventListener('touchstart', cancel, { passive: true, once: true });
    document.fonts.ready.then(() => {
      if (cancelled) return;
      const el = hashTarget(window.location.hash);
      if (el) scrollToY(el.getBoundingClientRect().top + window.scrollY, 'instant');
    });
    return () => {
      cancelled = true;
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchstart', cancel);
    };
  }, []);
  return null;
}
