import { create } from 'zustand';

interface UiState {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

/** Discrete UI state only. */
export const useUi = create<UiState>((set) => ({
  menuOpen: false,
  setMenuOpen: (menuOpen) => set({ menuOpen }),
}));
