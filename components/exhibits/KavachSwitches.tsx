'use client';

import { useEffect, useReducer } from 'react';
import { kavachCopy } from '@/content/exhibits';
import { initialView, intervalFor, viewReducer, type KavachMessage } from '@/lib/kavach';

interface Props {
  /** The status lines, rendered on the server because they hold numbers you can pull. */
  messages: Record<KavachMessage, React.ReactNode>;
  spoken: React.ReactNode;
}

function Switch({ id, label, on, onToggle }: { id: string; label: string; on: boolean; onToggle: () => void }) {
  return (
    <div className="flex h-[5.6rem] items-center justify-between gap-xs border-b border-hairline">
      <span id={id} className="text-body font-medium">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-labelledby={id}
        onClick={onToggle}
        className={`press relative h-[3.2rem] w-[6rem] shrink-0 rounded-full border-2 transition-colors duration-[160ms] after:absolute after:-inset-y-[0.6rem] after:inset-x-0 after:content-[''] ${on ? 'border-primary bg-primary' : 'border-ink-subtle bg-transparent'}`}
      >
        <span
          aria-hidden
          className={`absolute left-[0.3rem] top-[0.3rem] h-[2.4rem] w-[2.4rem] rounded-full transition-transform duration-[160ms] ease-[var(--ease-out)] ${on ? 'translate-x-[2.8rem] bg-white' : 'translate-x-0 bg-ink'}`}
        />
        <span className="sr-only">{on ? 'On' : 'Off'}</span>
      </button>
    </div>
  );
}

/** The rule `upiOpen && screenShareActive`, with the real timings, running in the browser. */
export default function KavachSwitches({ messages, spoken }: Props) {
  const [v, dispatch] = useReducer(viewReducer, initialView);

  // real timers: every second with a payment open, every three seconds without; paused with the tab
  const upi = v.upi;
  useEffect(() => {
    let id: number | undefined;
    const start = () => {
      if (document.hidden) return;
      id = window.setInterval(() => dispatch('tick'), intervalFor({ upi }));
    };
    const stop = () => window.clearInterval(id);
    const onVisibility = () => {
      stop();
      start();
    };
    start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [upi]);

  return (
    <div data-receipt-scope="kv-active" className="grid gap-sm">
      <div className="kv-live grid gap-sm">
        <div>
          <Switch id="kv-switch-upi" label={kavachCopy.switches[0]} on={v.upi} onToggle={() => dispatch('toggleUpi')} />
          <div className="flex h-[4.4rem] items-center gap-xxs text-ink-muted">
            <svg aria-hidden viewBox="0 0 24 24" className="h-[2.4rem] w-[2.4rem]">
              <path d="M5 4h6a8 8 0 010 16H5zM1 9h4M1 15h4M19 12h4" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            <span className="font-cond text-meta">AND</span>
          </div>
          <Switch id="kv-switch-share" label={kavachCopy.switches[1]} on={v.share} onToggle={() => dispatch('toggleShare')} />
        </div>

        <div
          className={`min-h-[8.4rem] rounded-xs border p-sm transition-colors duration-200 ${
            v.shield ? 'border-error bg-[#ffe3e5]' : 'border-hairline bg-transparent'
          }`}
        >
          <p role="status" aria-live="polite" className={`font-display text-title-lg ${v.shield ? 'text-ink' : 'text-ink'}`}>
            {messages[v.msg]}
          </p>
          {v.shield ? (
            <div className="mt-xs grid gap-xs text-body text-ink">
              <p>{kavachCopy.english}</p>
              <p lang="hi">{kavachCopy.hindi}</p>
            </div>
          ) : null}
        </div>
        <p className="text-body-sm text-ink-muted">{spoken}</p>
      </div>

      <noscript>
        <style>{'.kv-live{display:none}'}</style>
        <div className="rounded-xs border border-error bg-[#ffe3e5] p-sm">
          <p className="font-display text-title-lg">Both switches on: the shield is up</p>
          <div className="mt-xs grid gap-xs text-body">
            <p>{kavachCopy.english}</p>
            <p lang="hi">{kavachCopy.hindi}</p>
          </div>
        </div>
        <p className="mt-xs text-body-sm text-ink-muted">{spoken}</p>
      </noscript>
    </div>
  );
}
