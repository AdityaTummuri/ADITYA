'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { useReducedMotion, useWebGLSupport } from '@/lib/a11y';
import { detectTier } from '@/lib/tier';
import { useUi } from '@/lib/ui-store';
import WebGLFallback from './WebGLFallback';

const loadScene = () => import('./Scene');
const Scene = dynamic(loadScene, { ssr: false });

/**
 * Fixed full-viewport scene behind the page. Renders the WebGL scene when a WebGL2 context is
 * available, otherwise (or after context loss) the CSS fallback. Under reduced motion it renders
 * a single still frame.
 */
export default function SceneCanvas() {
  const reduce = useReducedMotion();
  const support = useWebGLSupport();
  const lost = useUi((s) => s.sceneFallback);
  const tier = useMemo(() => (support ? detectTier() : 'low'), [support]);
  // phones get the static CSS scene: no WebGL context, no battery drain, same look
  const phone = useMemo(() => support === true && window.matchMedia('(pointer: coarse) and (max-width: 767px)').matches, [support]);
  const fallback = support === false || lost || phone;
  // only once WebGL is confirmed (support is null through hydration): phones never fetch the 3D chunk
  const wantScene = support === true && !fallback;
  // Mount the heavy scene after first paint so the hero text owns LCP, but start downloading its
  // chunk now, in parallel with hydration, so it is already there when the browser goes idle.
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    if (!wantScene) return;
    loadScene().catch(() => {});
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback && w.cancelIdleCallback) {
      const id = w.requestIdleCallback(() => setIdle(true), { timeout: 800 });
      return () => w.cancelIdleCallback!(id);
    }
    const t = window.setTimeout(() => setIdle(true), 300);
    return () => window.clearTimeout(t);
  }, [wantScene]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      {support === null ? null : fallback ? <WebGLFallback /> : idle && wantScene ? <Scene still={reduce} tier={tier} /> : null}
    </div>
  );
}
