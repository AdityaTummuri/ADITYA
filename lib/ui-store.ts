import { create } from 'zustand';

interface UiState {
  menuOpen: boolean;
  loaded: boolean;
  setMenuOpen: (open: boolean) => void;
  setLoaded: (loaded: boolean) => void;
}

/** Discrete UI state only. Per-frame scroll data lives in lib/scroll-store.ts. */
export const useUi = create<UiState>((set) => ({
  menuOpen: false,
  loaded: false,
  setMenuOpen: (menuOpen) => set({ menuOpen }),
  setLoaded: (loaded) => set({ loaded }),
}));
