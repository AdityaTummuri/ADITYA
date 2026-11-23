'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect } from 'react';
import { useReducedMotion } from '@/lib/a11y';
import { getLenis, scrollToY, setLenis } from '@/lib/lenis';
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

/**
 * Eased wheel scrolling (Lenis), for mouse and trackpad only: touch screens already scroll smoothly,
 * so they never download it. Off under reduced motion.
 */
export default function SmoothScroll() {
  const reduce = useReducedMotion();
  const menuOpen = useUi((s) => s.menuOpen);
  const pathname = usePathname();

  useEffect(() => {
    if (reduce || !window.matchMedia('(pointer: fine)').matches) return;
    let cancelled = false;
    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({ autoRaf: true, lerp: 0.14, smoothWheel: true, syncTouch: false, anchors: false });
      if (useUi.getState().menuOpen) lenis.stop();
      setLenis(lenis);
    }).catch(() => {});
    return () => {
      cancelled = true;
      getLenis()?.destroy();
      setLenis(null);
    };
  }, [reduce]);

  useEffect(() => {
    const lenis = getLenis();
    if (menuOpen) lenis?.stop();
    else lenis?.start();
  }, [menuOpen]);

  // A glide that is still running must not carry on into the next page: stop() and start() both
  // drop the momentum and take the page's real position as the new starting point.
  useLayoutEffect(() => {
    const lenis = getLenis();
    if (!lenis) return;
    lenis.stop();
    lenis.start();
  }, [pathname]);

  // Same-page links (`#work`, `/#work` on the home, `/` on the home) scroll here, once. Left alone,
  // Next's router jumps with scrollIntoView() while Lenis eases toward the same spot, and the two
  // fight for a frame. Capture phase so this runs before Next's <Link> handler, which then bails.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const hit = samePageTarget(e);
      if (!hit) return;
      e.preventDefault();
      if (hit.url.href !== window.location.href) window.history.pushState(null, '', hit.url.href);
      useUi.getState().setMenuOpen(false);
      scrollToY(hit.el === 'top' ? 0 : hit.el.getBoundingClientRect().top + window.scrollY, 'smooth');
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
