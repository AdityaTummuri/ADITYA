import { create } from 'zustand';

interface UiState {
  menuOpen: boolean;
  /** 'webgl' until a context is lost or unsupported, then 'fallback'. */
  sceneFallback: boolean;
  setMenuOpen: (open: boolean) => void;
  setSceneFallback: (v: boolean) => void;
}

/** Discrete UI state only. Per-frame scroll data lives in lib/scroll-store.ts. */
export const useUi = create<UiState>((set) => ({
  menuOpen: false,
  sceneFallback: false,
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  setSceneFallback: (sceneFallback) => set({ sceneFallback }),
}));
