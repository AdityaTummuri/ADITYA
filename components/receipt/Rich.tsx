import { Fragment } from 'react';
import github from '@/content/github.json';
import { formatDay } from '@/content/receipt-links';
import type { Copy } from '@/content/types';
import Num from './Num';

const PART = /(\{[a-z0-9-]+\}|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

const DATES: Record<string, string> = {
  date: github.readOn,
  'best-date': github.profile.bestDayDate,
  opened: github.account.created_at,
};

/**
 * Renders Copy: `{id}` becomes a number you can pull, backticks become code, `[label](url)` an
 * external link. `{date}`, `{best-date}` and `{opened}` are dates from content/github.json.
 * Throws at build on an unknown id.
 */
export default function Rich({ children }: { children: Copy }) {
  const parts = children.split(PART).filter(Boolean);
  // the text written before each part, to know whether a value opens a sentence
  const before: string[] = [];
  parts.reduce((acc, part) => {
    before.push(acc);
    return acc + plain(part);
  }, '');
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('{')) {
          const id = part.slice(1, -1);
          if (id in DATES) return <time key={i} dateTime={DATES[id]}>{formatDay(DATES[id])}</time>;
          // a value that opens a sentence starts with a capital
          const atStart = before[i] === '' || /[.!?]\s$/.test(before[i]);
          return <Num key={i} id={id} capitalize={atStart} />;
        }
        if (part.startsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>;
        if (part.startsWith('[')) {
          const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
          if (m) {
            return (
              <a key={i} href={m[2]} className="underline decoration-primary underline-offset-[0.18em] hover:text-primary-soft">
                {m[1]}
              </a>
            );
          }
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

/** What a part contributes to the running text (a number counts as a non-sentence-end word). */
function plain(part: string): string {
  if (part.startsWith('{')) return part.slice(1, -1) in DATES ? formatDay(DATES[part.slice(1, -1)]) : 'x';
  if (part.startsWith('`')) return part.slice(1, -1);
  const m = part.match(/^\[([^\]]+)\]\(/);
  return m ? m[1] : part;
}
