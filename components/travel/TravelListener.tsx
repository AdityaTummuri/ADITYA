'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * Marks the document once the visitor has travelled, so the home headline pops in once per visit
 * and not on every return. Renders nothing.
 */
export default function TravelListener() {
  const pathname = usePathname();
  const last = useRef(pathname);

  useEffect(() => {
    if (last.current === pathname) return;
    last.current = pathname;
    document.documentElement.dataset.travelled = '';
  }, [pathname]);

  return null;
}
