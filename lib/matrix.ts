/** Rows are what the person did, columns what the model said: walk, sit, fall. From results/test_evaluation_results.json. */
export const CLASSES = ['Walk', 'Sit', 'Fall'] as const;
export const MATRIX: readonly (readonly number[])[] = [
  [26, 1, 1],
  [1, 20, 6],
  [0, 7, 20],
];
export const rowTotal = (r: number) => MATRIX[r].reduce((a, b) => a + b, 0);
export const MAX_CELL = 28;

const PLURAL = ['walks', 'sits', 'falls'];
const VERB = ['walking', 'sitting', 'falling'];

/** The sentence for one cell, per the plan: `{n} of {row total} {row plural} were called {column}.` plus one more. */
export function cellSentence(r: number, c: number): string {
  const n = MATRIX[r][c];
  if (n === 0) return `No ${PLURAL[r].slice(0, -1)} was called ${VERB[c]}.`;
  const base = `${n} of ${rowTotal(r)} ${PLURAL[r]} were called ${VERB[c]}.`;
  if (r === c) return `${base} Correct.`;
  if ((r === 1 && c === 2) || (r === 2 && c === 1)) return `${base} Sitting and falling look alike to a radar.`;
  return base;
}
