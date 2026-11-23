import { describe, expect, it } from 'vitest';
import { cellSentence, MATRIX, rowTotal } from '@/lib/matrix';
import { receipts } from '@/content/receipts';
import type { QuotedReceipt } from '@/content/types';

describe('confusion matrix', () => {
  it('has the row totals, diagonal and misses the page states', () => {
    expect([0, 1, 2].map(rowTotal)).toEqual([28, 27, 27]);
    expect(MATRIX[0][0] + MATRIX[1][1] + MATRIX[2][2]).toBe(66);
    const all = MATRIX.flat().reduce((a, b) => a + b, 0);
    expect(all - 66).toBe(16);
    expect(MATRIX[1][2] + MATRIX[2][1]).toBe(13);
  });
  it('matches the quote on the receipt', () => {
    const quote = (receipts['fs-matrix'] as QuotedReceipt).quote;
    expect(quote).toBe(`"confusion_matrix":${JSON.stringify(MATRIX)}`);
  });
  it('writes the sentences of the plan', () => {
    expect(cellSentence(2, 1)).toBe('7 of 27 falls were called sitting. Sitting and falling look alike to a radar.');
    expect(cellSentence(2, 0)).toBe('No fall was called walking.');
    expect(cellSentence(0, 0)).toBe('26 of 28 walks were called walking. Correct.');
    expect(cellSentence(0, 1)).toBe('1 of 28 walks were called sitting.');
    expect(cellSentence(1, 2)).toBe('6 of 27 sits were called falling. Sitting and falling look alike to a radar.');
  });
});
