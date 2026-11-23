'use client';

import { useEffect, useRef, useState } from 'react';
import { candidates, ladderCopy, type CheckState } from '@/content/exhibits';

/** The default is candidate 2, the one that fooled QEDCode, so the page reads without JavaScript. */
const DEFAULT = 1;

function Mark({ state }: { state: CheckState }) {
  const common = { 'aria-hidden': true, viewBox: '0 0 16 16', className: 'h-[1.6rem] w-[1.6rem] shrink-0' } as const;
  if (state === 'passed') {
    return (
      <svg {...common} className={`${common.className} text-primary`}>
        <path d="M2.5 8.5l3.7 3.7L13.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  if (state === 'failed') {
    return (
      <svg {...common} className={`${common.className} text-error`}>
        <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }
  return (
    <svg {...common} className={`${common.className} text-ink-subtle`}>
      <path d="M3.5 8h9" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

/**
 * Four candidate changes followed through QEDCode's eight checks. The grade comes from a port of
 * the repo's own `grade()`; see lib/qed-grade.ts and content/exhibits.ts.
 */
export default function QedLadder() {
  const [selected, setSelected] = useState(DEFAULT);
  // marks fade in one after another; a change from the keyboard is never delayed
  const [shown, setShown] = useState(true);
  const [instant, setInstant] = useState(false);
  const frame = useRef(0);
  const c = candidates[selected];

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const choose = (i: number, fromKey: boolean) => {
    if (i === selected) return;
    cancelAnimationFrame(frame.current);
    setInstant(fromKey);
    setSelected(i);
    if (fromKey) {
      setShown(true);
      return;
    }
    setShown(false);
    frame.current = requestAnimationFrame(() => {
      frame.current = requestAnimationFrame(() => setShown(true));
    });
  };

  const total = ladderCopy.checks.length;
  return (
    <div data-receipt-scope="qed-hidden" className="grid gap-xs">
      <fieldset className="m-0 min-w-0 border-0 p-0">
        <legend className="mb-xxs font-cond text-meta text-ink-muted">{ladderCopy.legend}</legend>
        <div className="grid gap-xxs sm:grid-cols-2">
          {candidates.map((cand, i) => (
            <label
              key={cand.title}
              className={`press relative flex h-[4.8rem] cursor-pointer items-center gap-xs rounded-xs border px-xs text-body font-medium has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary-soft ${
                i === selected ? 'border-primary text-primary' : 'border-hairline text-ink hover:border-hairline-strong'
              }`}
            >
              <input
                type="radio"
                name="candidate"
                value={i}
                checked={i === selected}
                onChange={(e) => choose(i, (e.nativeEvent as MouseEvent).detail === 0)}
                className="sr-only"
              />
              <span aria-hidden className={`h-[1rem] w-[1rem] shrink-0 border ${i === selected ? 'border-primary bg-primary' : 'border-ink-subtle'}`} />
              {cand.title}
            </label>
          ))}
        </div>
      </fieldset>

      <pre className="m-0 whitespace-pre-wrap bg-surface-2 px-xs py-xs text-body-sm leading-relaxed [overflow-wrap:anywhere]" tabIndex={0} aria-label={`Code of the candidate: ${c.title}`}>
        <code>{c.code.join('\n')}</code>
      </pre>

      <ol className="m-0 grid list-none gap-x-md p-0 sm:grid-flow-col sm:grid-rows-4">
        {ladderCopy.checks.map((name, i) => (
          <li key={name} className="flex min-h-[3.4rem] items-center gap-xxs border-b border-hairline py-0.5 text-body-sm">
            <span
              style={{ transitionDelay: instant ? '0s' : `${(i * 40) / 1000}s` }}
              className={`inline-flex transition-opacity duration-[0.12s] ease-linear ${shown ? 'opacity-100' : 'opacity-0'}`}
            >
              <Mark state={c.checks[i]} />
            </span>
            <span className="flex-1 text-ink">{name}</span>
            <span className="text-ink-muted">{ladderCopy.states[c.checks[i]]}</span>
          </li>
        ))}
      </ol>

      <div role="status" aria-live="polite" className="min-h-[8.4rem]">
        <p
          style={{ transitionDelay: instant ? '0s' : `${(total * 40) / 1000}s` }}
          className={`font-display text-title-lg transition-opacity duration-[0.12s] ease-linear ${shown ? 'opacity-100' : 'opacity-0'} ${c.grade ? 'text-ink' : 'text-ink'}`}
        >
          {c.verdict}
        </p>
        <p className="mt-1 max-w-[62ch] text-body-sm text-ink-muted">{c.note}</p>
      </div>

      <noscript>
        <p className="text-body-sm text-ink-muted">
          {candidates.map((cand) => `${cand.title}: ${cand.verdict}`).join(' ')}
        </p>
      </noscript>
    </div>
  );
}
