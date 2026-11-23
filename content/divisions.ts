import type { DivisionSpec } from './types';

/** The three home divisions, top to bottom. `look` is the scene look while the division is on screen. */
export const divisions: DivisionSpec[] = [
  { id: 'start', label: 'Start', look: 'streaks', index: 0 },
  { id: 'work', label: 'Work', look: 'grid', index: 1 },
  { id: 'contact', label: 'Contact', look: 'calm', index: 2 },
];
