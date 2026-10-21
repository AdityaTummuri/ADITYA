export type Tier = 'high' | 'mid' | 'low';

export const TIER_CONFIG: Record<Tier, { streaks: number; points: number; dpr: [number, number] }> = {
  high: { streaks: 240, points: 6000, dpr: [1, 1.5] },
  mid: { streaks: 160, points: 3500, dpr: [1, 1.25] },
  low: { streaks: 96, points: 1800, dpr: [1, 1] },
};

/** Pure heuristic from device facts; no network benchmark. */
export function detectTier(): Tier {
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const cores = navigator.hardwareConcurrency || 4;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  if (coarse || window.innerWidth < 768) return mem >= 6 && cores >= 8 ? 'mid' : 'low';
  return cores >= 8 && mem >= 8 ? 'high' : 'mid';
}
