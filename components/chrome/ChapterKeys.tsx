'use client';

import { useEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap';
import { useScrollStore } from '@/lib/scroll-store';
import { useChapterKeys } from '@/lib/use-chapter-keys';

/** Mounts keyboard navigation and refreshes ScrollTrigger once fonts are in. Renders nothing. */
export default function ChapterKeys() {
  useChapterKeys();
  // arriving from an inner page: restart on the hero look
  useEffect(() => {
    useScrollStore.getState().set(0, 0, 'streaks');
  }, []);
  useEffect(() => {
    let t: number;
    const refresh = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    };
    document.fonts.ready.then(refresh);
    window.addEventListener('resize', refresh);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('resize', refresh);
    };
  }, []);
  return null;
}
