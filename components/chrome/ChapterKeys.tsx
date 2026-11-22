'use client';

import { useEffect } from 'react';
import { chapters } from '@/content/chapters';
import { ScrollTrigger } from '@/lib/gsap';
import { useScrollStore } from '@/lib/scroll-store';
import { useChapterKeys } from '@/lib/use-chapter-keys';

/**
 * Lands hash links and refreshes ScrollTrigger once fonts are in. Renders nothing.
 * Resizes are left to ScrollTrigger's own (debounced, mobile-aware) auto-refresh: a second listener
 * here would also fire on every phone address-bar show/hide and refresh mid-scroll.
 */
export default function ChapterKeys() {
  useChapterKeys();
  // Arriving from an inner page: restart on the hero look, unless a section trigger already
  // reported itself active (scroll restored on Back), which would otherwise be overwritten.
  useEffect(() => {
    const active = chapters.find((c) => ScrollTrigger.getById(c.id)?.isActive);
    if (!active) useScrollStore.getState().set(0, 0, 'streaks');
  }, []);
  return null;
}
