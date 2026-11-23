import type Lenis from 'lenis';

/** The one Lenis instance, or null on touch screens, under reduced motion and before it has loaded. */
let lenis: Lenis | null = null;

export function setLenis(next: Lenis | null) {
  lenis = next;
}

export function getLenis(): Lenis | null {
  return lenis;
}

/** Scroll the page to `y`, through Lenis when it is running so the two never disagree. */
export function scrollToY(y: number, how: 'smooth' | 'instant') {
  if (lenis) {
    // the menu may have stopped Lenis; wake it so an eased scroll actually runs
    if (how === 'smooth') lenis.start();
    lenis.scrollTo(y, how === 'smooth' ? { duration: 0.9, force: true } : { immediate: true, force: true });
    return;
  }
  const smooth = how === 'smooth' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: y, behavior: smooth ? 'smooth' : 'instant' });
}
