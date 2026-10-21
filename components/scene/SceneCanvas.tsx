'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { useReducedMotion, useWebGLSupport } from '@/lib/a11y';
import { detectTier } from '@/lib/tier';
import { useUi } from '@/lib/ui-store';
import WebGLFallback from './WebGLFallback';

const Scene = dynamic(() => import('./Scene'), { ssr: false });

/**
 * Fixed full-viewport scene behind the page. Renders the WebGL scene when a WebGL2 context is
 * available, otherwise (or after context loss) the CSS fallback. Under reduced motion it renders
 * a single still frame.
 */
export default function SceneCanvas() {
  const reduce = useReducedMotion();
  const support = useWebGLSupport();
  const lost = useUi((s) => s.sceneFallback);
  const setLoaded = useUi((s) => s.setLoaded);
  const tier = useMemo(() => (support ? detectTier() : 'low'), [support]);
  const fallback = support === false || lost;
  // load the heavy scene chunk after first paint so the hero text owns LCP
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const t = ric ? ric(() => setIdle(true), { timeout: 800 }) : window.setTimeout(() => setIdle(true), 300);
    return () => {
      if (!ric) window.clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    if (fallback) setLoaded(true);
  }, [fallback, setLoaded]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      {support === null ? null : fallback ? <WebGLFallback /> : idle ? <Scene still={reduce} tier={tier} /> : null}
    </div>
  );
}
