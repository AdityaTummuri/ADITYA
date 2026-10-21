'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/a11y';

const FULL = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
const MID = 'polygon(0 0, 100% 0, 100% 0, 0 100%)';
const GONE = 'polygon(0 0, 100% 0, 100% 0, 0 0)';

/** Diagonal wipe played on every route change (not on first load; the Loader owns that). */
export default function RouteWipe() {
  const pathname = usePathname();
  const prev = useRef(pathname);
  const el = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (prev.current === pathname) return;
    prev.current = pathname;
    const node = el.current;
    if (!node) return;
    node.dataset.wipe = 'running';
    const tl = gsap.timeline({ onComplete: () => { node.dataset.wipe = 'idle'; gsap.set(node, { clipPath: GONE }); } });
    if (reduce) {
      tl.fromTo(node, { opacity: 1, clipPath: FULL }, { opacity: 0, duration: 0.2 });
    } else {
      tl.fromTo(node, { opacity: 1, clipPath: FULL }, { clipPath: MID, duration: 0.65, ease: 'power2.inOut' })
        .to(node, { clipPath: GONE, duration: 0.65, ease: 'power2.inOut' });
    }
    return () => { tl.kill(); };
  }, [pathname, reduce]);

  return (
    <div
      ref={el}
      id="route-wipe"
      data-wipe="idle"
      aria-hidden
      style={{ clipPath: GONE }}
      className="pointer-events-none fixed inset-0 z-[90] bg-canvas"
    />
  );
}
