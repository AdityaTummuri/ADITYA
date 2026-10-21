import { create } from 'zustand';
import type { Look } from '@/content/types';

interface ScrollState {
  chapter: number;
  /** 0..1 progress inside the active chapter. */
  progress: number;
  look: Look;
  set: (chapter: number, progress: number, look: Look) => void;
}

/**
 * The only bridge between scroll and WebGL. ScrollTrigger writes it; the scene reads
 * `getState()` inside useFrame (no React subscription per frame).
 */
export const useScrollStore = create<ScrollState>((set) => ({
  chapter: 0,
  progress: 0,
  look: 'streaks',
  set: (chapter, progress, look) => set({ chapter, progress, look }),
}));
