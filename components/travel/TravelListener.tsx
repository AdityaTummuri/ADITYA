'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useScrollStore } from '@/lib/scroll-store';

/** `/` is depth 0; every other page is depth 1. */
const depth = (path: string) => (path === '/' ? 0 : 1);

/**
 * Tells the scene when the visitor has travelled: home to a place goes forward, a place to home goes
 * back, a place to a place goes forward. It watches the path, so the browser's Back and Forward
 * travel correctly too. Renders nothing.
 */
export default function TravelListener() {
  const pathname = usePathname();
  const last = useRef(pathname);

  useEffect(() => {
    if (last.current === pathname) return;
    const dir = depth(pathname) < depth(last.current) ? -1 : 1;
    last.current = pathname;
    // the home headline rises once per visit, not on every return (globals.css, .line)
    document.documentElement.dataset.travelled = '';
    useScrollStore.getState().go(dir);
  }, [pathname]);

  return null;
}
