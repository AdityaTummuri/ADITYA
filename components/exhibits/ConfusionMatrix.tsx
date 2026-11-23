'use client';

import { useRef, useState } from 'react';
import { matrixCopy } from '@/content/exhibits';
import { CLASSES, MATRIX, MAX_CELL, cellSentence } from '@/lib/matrix';

/**
 * The confusion matrix of the 82 test recordings, redrawn from the repo's results file. Every cell
 * is a button; arrow keys move between them (roving tabindex) and Enter or Space selects.
 */
export default function ConfusionMatrix({ f1 }: { f1: React.ReactNode }) {
  const [sel, setSel] = useState<[number, number]>([2, 1]);
  const [focus, setFocus] = useState<[number, number]>([2, 1]);
  const refs = useRef<(HTMLButtonElement | null)[][]>([[], [], []]);

  const move = (r: number, c: number, key: string) => {
    let nr = r;
    let nc = c;
    if (key === 'ArrowRight') nc = Math.min(2, c + 1);
    else if (key === 'ArrowLeft') nc = Math.max(0, c - 1);
    else if (key === 'ArrowDown') nr = Math.min(2, r + 1);
    else if (key === 'ArrowUp') nr = Math.max(0, r - 1);
    else if (key === 'Home') nc = 0;
    else if (key === 'End') nc = 2;
    else return false;
    setFocus([nr, nc]);
    refs.current[nr][nc]?.focus();
    return true;
  };

  return (
    <div data-receipt-scope="fs-matrix" className="grid items-start gap-sm xl:grid-cols-[auto_minmax(0,1fr)] xl:gap-x-lg">
      <table className="w-fit border-separate [border-spacing:0.4rem]">
        <caption className="mb-xxs text-left font-cond text-meta text-ink-muted">{matrixCopy.caption}</caption>
        <thead>
          <tr>
            <th scope="col" className="min-w-[6rem] text-left align-bottom font-cond text-meta font-medium text-ink-muted">
              <span className="block text-right">{matrixCopy.corner[1]}</span>
              <span className="block">{matrixCopy.corner[0]}</span>
            </th>
            {CLASSES.map((name) => (
              <th key={name} scope="col" className="pb-1 text-center font-cond text-meta font-medium text-ink-muted">{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MATRIX.map((row, r) => (
            <tr key={CLASSES[r]}>
              <th scope="row" className="pr-xxs text-left font-cond text-meta font-medium text-ink-muted">{CLASSES[r]}</th>
              {row.map((n, c) => {
                const on = sel[0] === r && sel[1] === c;
                return (
                  <td key={CLASSES[c]} className="p-0 text-center">
                    <button
                      ref={(el) => { refs.current[r][c] = el; }}
                      type="button"
                      aria-pressed={on}
                      aria-label={`Did ${CLASSES[r]}, model said ${CLASSES[c]}: ${n}`}
                      tabIndex={focus[0] === r && focus[1] === c ? 0 : -1}
                      onClick={() => { setSel([r, c]); setFocus([r, c]); }}
                      onFocus={() => setFocus([r, c])}
                      onKeyDown={(e) => { if (move(r, c, e.key)) e.preventDefault(); }}
                      style={{ background: `rgb(255 79 154 / ${(n / MAX_CELL) * 0.75})` }}
                      className={`press h-[min(7rem,16vw)] w-[min(7rem,16vw)] font-display text-headline tabular-nums text-ink md:h-[8rem] md:w-[8rem] ${
                        r === c ? 'border border-primary' : 'border border-transparent'
                      } ${on ? 'outline outline-2 outline-offset-2 outline-ink' : ''}`}
                    >
                      {n}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="grid gap-sm xl:pt-[3.6rem]">
        <p role="status" aria-live="polite" className="min-h-[5.6rem] max-w-[46ch] text-body text-ink xl:min-h-[11.2rem]">{cellSentence(sel[0], sel[1])}</p>
        <p className="text-body-sm text-ink-muted">{f1}</p>
      </div>
    </div>
  );
}
