'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUi } from '@/lib/ui-store';

/** In a room, Escape goes back to the work list, unless something else is using the key. */
export default function RoomKeys() {
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      if (useUi.getState().menuOpen) return;
      try {
        if (document.querySelector(':popover-open')) return;
      } catch {
        /* browsers that do not know the selector have no popover to protect */
      }
      const a = document.activeElement;
      if (a && (a.matches('input, textarea, select, [role=switch]') || (a as HTMLElement).isContentEditable)) return;
      router.push('/#work', { transitionTypes: ['out'] });
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [router]);

  return null;
}
