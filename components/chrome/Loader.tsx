'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/a11y';
import { useUi } from '@/lib/ui-store';

const FULL = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
const MID = 'polygon(0 0, 100% 0, 100% 0, 0 100%)';
const GONE = 'polygon(0 0, 100% 0, 100% 0, 0 0)';

/**
 * Canvas-black cover with wordmark and arc, then the diagonal clip-path wipe (1.3s power2.inOut)
 * and the chrome intro (logo up, hamburger lines drawn). Skipped under reduced motion.
 */
export default function Loader() {
  const reduce = useReducedMotion();
  const loaded = useUi((s) => s.loaded);
  const setIntroDone = useUi((s) => s.setIntroDone);
  const [done, setDone] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce) setIntroDone(true);
  }, [reduce, setIntroDone]);

  useEffect(() => {
    document.fonts.ready.then(() => setFontsReady(true));
    const t = window.setTimeout(() => setTimedOut(true), 2500);
    return () => window.clearTimeout(t);
  }, []);

  const ready = fontsReady && (loaded || timedOut);

  useEffect(() => {
    if (reduce || !ready || !root.current) return;
    const tl = gsap.timeline({
      onComplete: () => setDone(true),
    });
    tl.call(() => setIntroDone(true), undefined, 0)
      .fromTo(root.current, { clipPath: FULL }, { clipPath: MID, duration: 0.65, ease: 'power2.inOut' }, 0)
      .to(root.current, { clipPath: GONE, duration: 0.65, ease: 'power2.inOut' })
      .fromTo('[data-motion=logo]', { yPercent: 110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1, ease: 'power3.inOut' }, 0.2)
      .fromTo('[data-motion=hamb-line]', { scaleX: 0, x: 15, transformOrigin: 'right center' }, { scaleX: 1, x: 0, duration: 1, ease: 'power3.inOut', stagger: 0.1 }, 0.3);
    return () => {
      tl.kill();
    };
  }, [reduce, ready, setIntroDone]);

  if (done || reduce) return null;
  return (
    <div
      ref={root}
      data-loader
      aria-hidden
      className="fixed inset-0 z-[99] flex items-center justify-center bg-canvas"
    >
      <span className="font-display text-[1.7rem] tracking-[-0.02em] text-ink">aditya tummuri</span>
      <span className="absolute h-[16rem] w-[16rem] animate-rotate rounded-full border-2 border-transparent border-r-ink border-t-ink" />
    </div>
  );
}
