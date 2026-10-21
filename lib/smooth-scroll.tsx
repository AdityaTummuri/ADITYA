'use client';

import { ReactLenis, type LenisRef, useLenis } from 'lenis/react';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/a11y';
import { useUi } from '@/lib/ui-store';

/** Lenis driven by gsap.ticker, kept in sync with ScrollTrigger. Off under reduced motion. */
export default function SmoothScroll() {
  const reduce = useReducedMotion();
  const ref = useRef<LenisRef>(null);
  const menuOpen = useUi((s) => s.menuOpen);

  useLenis(() => ScrollTrigger.update());

  useEffect(() => {
    if (reduce) return;
    const update = (time: number) => ref.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, [reduce]);

  useEffect(() => {
    const lenis = ref.current?.lenis;
    if (!lenis) return;
    if (menuOpen) lenis.stop();
    else lenis.start();
  }, [menuOpen]);

  if (reduce) return null;
  return <ReactLenis root ref={ref} options={{ autoRaf: false, lerp: 0.1, smoothWheel: true, syncTouch: false, anchors: true }} />;
}
