'use client';

import { useEffect } from 'react';
import type { Look } from '@/content/types';
import { useScrollStore } from '@/lib/scroll-store';

/** Tells the persistent scene which look to use on pages without home divisions. */
export default function SetLook({ look = 'calm' }: { look?: Look }) {
  useEffect(() => {
    const s = useScrollStore.getState();
    s.set(0, look);
    s.setPreview(null);
  }, [look]);
  return null;
}
