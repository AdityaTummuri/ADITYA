'use client';

import { useEffect } from 'react';
import type { Look } from '@/content/types';
import { useScrollStore } from '@/lib/scroll-store';

/** Tells the persistent scene which look to use on pages without pinned chapters. */
export default function SetLook({ look = 'calm' }: { look?: Look }) {
  useEffect(() => {
    useScrollStore.getState().set(0, 0, look);
  }, [look]);
  return null;
}
