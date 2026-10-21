import { create } from 'zustand';

interface UiState {
  menuOpen: boolean;
  loaded: boolean;
  /** True once the intro wipe has started; gated headings wait for it. */
  introDone: boolean;
  setMenuOpen: (open: boolean) => void;
  setLoaded: (loaded: boolean) => void;
  setIntroDone: (done: boolean) => void;
}

/** Discrete UI state only. Per-frame scroll data lives in lib/scroll-store.ts. */
export const useUi = create<UiState>((set) => ({
  menuOpen: false,
  loaded: false,
  introDone: false,
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  setLoaded: (loaded) => set({ loaded }),
  setIntroDone: (introDone) => set({ introDone }),
}));
