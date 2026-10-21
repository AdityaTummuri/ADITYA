'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}

/** True when the visitor asked for reduced motion. Server snapshot is false. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false);
}

let webglSupport: boolean | null = null;

/** null on the server and until measured, then whether a WebGL2 context can be created. */
export function useWebGLSupport(): boolean | null {
  return useSyncExternalStore(
    () => () => {},
    () => {
      if (webglSupport === null) {
        try {
          webglSupport = !!document.createElement('canvas').getContext('webgl2');
        } catch {
          webglSupport = false;
        }
      }
      return webglSupport;
    },
    () => null,
  );
}
