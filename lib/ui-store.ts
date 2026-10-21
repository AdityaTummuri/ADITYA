import { create } from 'zustand';

interface UiState {
  menuOpen: boolean;
  loaded: boolean;
  /** True once the intro wipe has started; gated headings wait for it. */
  introDone: boolean;
  /** 'webgl' until a context is lost or unsupported, then 'fallback'. */
  sceneFallback: boolean;
  setMenuOpen: (open: boolean) => void;
  setLoaded: (loaded: boolean) => void;
  setIntroDone: (done: boolean) => void;
  setSceneFallback: (v: boolean) => void;
}

/** Discrete UI state only. Per-frame scroll data lives in lib/scroll-store.ts. */
export const useUi = create<UiState>((set) => ({
  menuOpen: false,
  loaded: false,
  introDone: false,
  sceneFallback: false,
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  setLoaded: (loaded) => set({ loaded }),
  setIntroDone: (introDone) => set({ introDone }),
  setSceneFallback: (sceneFallback) => set({ sceneFallback }),
}));
