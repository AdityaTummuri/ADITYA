/**
 * Typed access to the Sakuga VFX core (public/sakuga/core.js, MIT, by Justin Finkelman).
 * The core draws every effect on one fixed canvas over the page and drops them all under
 * prefers-reduced-motion. This file only wraps it; nothing here is needed for the site to work.
 */
type Opts = Record<string, unknown>;
export interface SakugaFX {
  P: { fill: string; shade: string; line: string; accent: string; ink: string; sfx: string[] };
  calm: boolean;
  rnd: (a?: number, b?: number) => number;
  later: (ms: number, fn: () => void) => void;
  at: (el: Element, fx?: number, fy?: number) => { x: number; y: number; w: number; h: number };
  burst: (x: number, y: number, o?: Opts) => void;
  puff: (x: number, y: number, o?: Opts) => void;
  ticks: (x: number, y: number, o?: Opts) => void;
  shards: (x: number, y: number, o?: Opts) => void;
  slash: (x: number, y: number, o?: Opts) => void;
  lines: (x: number, y: number, o?: Opts) => void;
  kira: (x: number, y: number, o?: Opts) => void;
  donut: (x: number, y: number, o?: Opts) => void;
  splash: (x: number, y: number, o?: Opts) => void;
  sfx: (word: Word, x: number, y: number, o?: Opts) => void;
  hollow: () => Opts;
  dotted: () => Opts;
}
export type Word = 'don' | 'kachi' | 'shu' | 'pon' | 'zuza' | 'gogo';
export const WORDS: Word[] = ['don', 'kachi', 'shu', 'pon', 'zuza'];

declare global {
  interface Window { SakugaFX?: SakugaFX }
}

let loading: Promise<SakugaFX | null> | null = null;

/** The core's file is loaded once, on the first call; resolves to null if it cannot load. */
export function loadFx(): Promise<SakugaFX | null> {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (window.SakugaFX) return Promise.resolve(window.SakugaFX);
  loading ??= new Promise((resolve) => {
    const s = document.createElement('script');
    s.src = '/sakuga/core.js';
    s.async = true;
    s.onload = () => {
      const fx = window.SakugaFX ?? null;
      // the site's own palette: paper white, sun-yellow shade, ink line, pink accent
      if (fx) Object.assign(fx.P, { fill: '#ffffff', shade: '#ffd86b', line: '#17142e', accent: '#ff4f9a', ink: '#17142e', sfx: ['#17142e', '#ffffff'] });
      resolve(fx);
    };
    s.onerror = () => resolve(null);
    document.head.appendChild(s);
  });
  return loading;
}
