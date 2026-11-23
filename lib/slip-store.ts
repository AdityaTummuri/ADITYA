import { create } from 'zustand';

interface SlipState {
  /** The number that was pressed, and where. */
  open: { anchor: HTMLAnchorElement; x: number; y: number } | null;
  show: (anchor: HTMLAnchorElement, x: number, y: number) => void;
  close: () => void;
}

export const useSlip = create<SlipState>((set) => ({
  open: null,
  show: (anchor, x, y) => set({ open: { anchor, x, y } }),
  close: () => set({ open: null }),
}));
