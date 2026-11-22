'use client';

import { ReactLenis, type LenisRef, useLenis } from 'lenis/react';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/a11y';
import { useUi } from '@/lib/ui-store';

/**
 * Same-page link target, or null when the click should be left to the browser / Next router.
 * `top` means "scroll to the top" (a link to the current path with no hash).
 */
function samePageTarget(e: MouseEvent): { url: URL; el: Element | 'top' } | null {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return null;
  const a = (e.target as Element | null)?.closest?.('a[href]');
  if (!(a instanceof HTMLAnchorElement)) return null;
  if ((a.target && a.target !== '_self') || a.hasAttribute('download')) return null;
  const url = new URL(a.href, window.location.href);
  const here = window.location;
  if (url.origin !== here.origin || url.pathname !== here.pathname || url.search !== here.search) return null;
  if (!url.hash) return { url, el: 'top' };
  let id = url.hash.slice(1);
  try {
    id = decodeURIComponent(id);
  } catch {
    /* keep the raw id */
  }
  const el = document.getElementById(id);
  return el ? { url, el } : null;
}

/** Lenis driven by gsap.ticker, kept in sync with ScrollTrigger. Off under reduced motion. */
export default function SmoothScroll() {
  const reduce = useReducedMotion();
  const ref = useRef<LenisRef>(null);
  const menuOpen = useUi((s) => s.menuOpen);

  useLenis(() => {
    ScrollTrigger.update();
  });

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

  // Same-page links (`#work`, `/#about` on the home, `/` on the home) scroll here, once. Left alone,
  // Next's router jumps with scrollIntoView() while Lenis eases toward the same spot, and the two
  // fight for a frame. Capture phase so this runs before Next's <Link> handler, which then bails.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const hit = samePageTarget(e);
      if (!hit) return;
      e.preventDefault();
      if (hit.url.href !== window.location.href) window.history.pushState(null, '', hit.url.href);
      useUi.getState().setMenuOpen(false);
      const lenis = ref.current?.lenis;
      const y = hit.el === 'top' ? 0 : hit.el.getBoundingClientRect().top + window.scrollY;
      if (lenis) {
        // the menu may have stopped Lenis; wake it so the eased scroll actually runs
        lenis.start();
        lenis.scrollTo(y, { duration: 1.1, force: true });
      } else {
        window.scrollTo(0, y);
      }
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  if (reduce) return null;
  return (
    <ReactLenis
      root
      ref={ref}
      options={{
        autoRaf: false,
        lerp: 0.1,
        smoothWheel: true,
        syncTouch: false,
        // anchors are handled by the capture listener above
        anchors: false,
        infinite: false,
      }}
    />
  );
}
