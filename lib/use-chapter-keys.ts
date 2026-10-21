'use client';

import { useEffect } from 'react';
import { useLenis } from 'lenis/react';
import { chapters } from '@/content/chapters';
import { ScrollTrigger } from '@/lib/gsap';
import { labelFractions } from '@/lib/chapter-timeline';
import { useUi } from '@/lib/ui-store';

/** Every sub-state scroll position, in order: pinned label positions, flow-body tops, chapter tops. */
function targets(): number[] {
  const ys: number[] = [];
  for (const c of chapters) {
    const st = ScrollTrigger.getById(c.id);
    const section = document.getElementById(c.id);
    if (st) {
      for (const f of labelFractions) ys.push(Math.round(st.start + f * (st.end - st.start)));
    } else if (section) {
      ys.push(Math.round(section.getBoundingClientRect().top + window.scrollY));
    }
    const flow = section?.querySelector('[data-flow]');
    if (flow) ys.push(Math.round(flow.getBoundingClientRect().top + window.scrollY));
  }
  return [...new Set(ys)].sort((a, b) => a - b);
}

/**
 * Keyboard chapter navigation: Arrow/Page keys step through sub-states, Home/End jump to the ends.
 * Also lands `/#chapter` hashes after the pins have measured.
 */
export function useChapterKeys() {
  const lenis = useLenis();
  const menuOpen = useUi((s) => s.menuOpen);

  useEffect(() => {
    const go = (y: number, immediate = false) => {
      if (lenis) lenis.scrollTo(y, { duration: 0.9, immediate, easing: (t: number) => 1 - Math.pow(1 - t, 3) });
      else window.scrollTo({ top: y, behavior: 'auto' });
    };
    const onKey = (e: KeyboardEvent) => {
      if (menuOpen || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (/^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(t.tagName) || t.isContentEditable)) return;
      const list = targets();
      const y = window.scrollY;
      let next: number | undefined;
      if (['ArrowDown', 'PageDown', 'ArrowRight'].includes(e.key)) next = list.find((v) => v > y + 8);
      else if (['ArrowUp', 'PageUp', 'ArrowLeft'].includes(e.key)) next = [...list].reverse().find((v) => v < y - 8);
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = document.documentElement.scrollHeight;
      else return;
      if (next === undefined) return;
      e.preventDefault();
      go(next);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lenis, menuOpen]);

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
