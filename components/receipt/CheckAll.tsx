'use client';

import { useState } from 'react';
import { receipts } from '@/content/receipts';
import { receiptsPage } from '@/content/pages';
import type { QuotedReceipt } from '@/content/types';
import { useChecks } from '@/lib/check-store';
import { checkReceipt, pool, type FileCache } from '@/lib/receipt-check';

const quoted = Object.values(receipts).filter((r): r is QuotedReceipt => r.kind === 'quoted');

/**
 * "Check every quoted line": each distinct file is fetched once, four at a time, and every
 * receipt's own line fills in as its answer arrives.
 */
export default function CheckAll() {
  const set = useChecks((s) => s.set);
  const [phase, setPhase] = useState<'idle' | 'running' | 'done'>('idle');
  const [done, setDone] = useState(0);
  const [found, setFound] = useState(0);
  const total = quoted.length;

  const run = async () => {
    setPhase('running');
    setDone(0);
    setFound(0);
    const cache: FileCache = new Map();
    for (const r of quoted) set(r.id, { state: 'checking' });
    await pool(quoted, 4, async (r) => {
      const res = await checkReceipt(r, fetch, cache);
      set(r.id, res);
      setDone((d) => d + 1);
      if (res.state === 'found-main' || res.state === 'found-pinned') setFound((f) => f + 1);
    });
    setPhase('done');
  };

  const failed = total - found;
  return (
    <div data-needs-js className="grid gap-xxs">
      <div>
        <button
          type="button"
          onClick={run}
          disabled={phase === 'running'}
          data-fx="hit"
          data-word="kachi"
          className="btn press disabled:opacity-60"
        >
          {phase === 'done' ? 'Check again' : receiptsPage.checkAll}
        </button>
      </div>
      <p role="status" aria-live="polite" className="min-h-[5.2rem] text-body-sm text-ink-muted">
        {phase === 'running' ? `Checking ${done} of ${total}…` : null}
        {phase === 'done' ? (
          <>
            {`${found} of ${total} lines found on GitHub, just now.`}
            {failed > 0 ? ` ${failed} could not be found. They are marked below.` : null}
          </>
        ) : null}
      </p>
    </div>
  );
}
