import { create } from 'zustand';
import type { Look } from '@/content/types';

interface ScrollState {
  /** Index of the active home division. */
  chapter: number;
  look: Look;
  /** A look borrowed while a work row is hovered or focused; null when none. */
  preview: Look | null;
  /** The last route change: `dir` is 1 going deeper, -1 coming back, `n` counts changes. */
  travel: { dir: 1 | -1 | 0; n: number };
  set: (chapter: number, look: Look) => void;
  setPreview: (look: Look | null) => void;
  go: (dir: 1 | -1) => void;
}

/**
 * The only bridge between scroll and WebGL. HomeRuntime writes it; the scene reads
 * `getState()` inside useFrame (no React subscription per frame).
 */
export const useScrollStore = create<ScrollState>((set) => ({
  chapter: 0,
  look: 'streaks',
  preview: null,
  travel: { dir: 0, n: 0 },
  set: (chapter, look) => set({ chapter, look }),
  setPreview: (preview) => set({ preview }),
  go: (dir) => set((s) => ({ travel: { dir, n: s.travel.n + 1 } })),
}));
