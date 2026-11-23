import { create } from 'zustand';
import type { CheckResult } from '@/lib/receipt-check';

export type CheckStatus = CheckResult | { state: 'checking' };

interface ChecksState {
  results: Record<string, CheckStatus>;
  set: (id: string, status: CheckStatus) => void;
}

/** What GitHub said, per receipt id, shared by the slip, the inline receipt and /receipts. */
export const useChecks = create<ChecksState>((set) => ({
  results: {},
  set: (id, status) => set((s) => ({ results: { ...s.results, [id]: status } })),
}));
