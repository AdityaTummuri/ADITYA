'use client';

import { useEffect, useRef, useState } from 'react';
import { useChecks } from '@/lib/check-store';
import { checkReceipt } from '@/lib/receipt-check';
import type { ApiReceipt, QuotedReceipt } from '@/content/types';
import { isProblem, statusText } from './messages';

const BUTTON =
  'press inline-flex min-h-[4.4rem] items-center rounded-md bg-inverse-canvas px-sm text-body-sm font-medium text-inverse-ink hover:bg-primary-soft disabled:opacity-60';

/** "Check it now": the visitor's own browser asks GitHub, and the answer lands in the status line. */
export function CheckButton({ receipt }: { receipt: QuotedReceipt | ApiReceipt }) {
  const status = useChecks((s) => s.results[receipt.id]);
  const set = useChecks((s) => s.set);
  const run = async () => {
    set(receipt.id, { state: 'checking' });
    set(receipt.id, await checkReceipt(receipt));
  };
  return (
    <button type="button" data-needs-js className={BUTTON} onClick={run} disabled={status?.state === 'checking'}>
      {status && status.state !== 'checking' ? 'Check again' : 'Check it now'}
    </button>
  );
}

/** The result line, last in the receipt: one line tall (two on a phone) at rest, and when a longer answer wraps it only pushes down what is below it. */
export function CheckStatus({ receipt }: { receipt: QuotedReceipt | ApiReceipt }) {
  const status = useChecks((s) => s.results[receipt.id]);
  const problem = isProblem(status);
  return (
    <p role="status" aria-live="polite" data-check-status={status?.state ?? 'idle'} className={`min-h-[2.3rem] text-body-sm max-sm:min-h-[4.6rem] ${problem ? 'text-ink' : 'text-ink-muted'}`}>
      {status ? (
        <>
          {problem ? <Mark /> : status.state === 'checking' ? null : <Tick />}
          {statusText(receipt, status)}
        </>
      ) : null}
    </p>
  );
}

function Tick() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="mr-2 inline-block h-[1.4rem] w-[1.4rem] -translate-y-px text-primary">
      <path d="M3 8.5l3.2 3.2L13 4.8" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function Mark() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="mr-2 inline-block h-[1.4rem] w-[1.4rem] -translate-y-px text-error">
      <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

/** "Copy the command"; the label reads "Copied" for two seconds. */
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button type="button" data-needs-js className={BUTTON} onClick={copy}>
      {copied ? 'Copied' : 'Copy the command'}
    </button>
  );
}
