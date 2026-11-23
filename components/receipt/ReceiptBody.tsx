import Link from 'next/link';
import github from '@/content/github.json';
import { fileUrl, formatDay, pinnedSha } from '@/content/receipt-links';
import { receipts } from '@/content/receipts';
import type { Receipt } from '@/content/types';
import { CheckButton, CheckStatus, CopyButton } from './CheckButton';

const LINK = 'press inline-flex min-h-[4.4rem] items-center text-body-sm font-medium text-ink underline decoration-primary decoration-1 underline-offset-[0.2em] hover:text-primary-soft';

function sourceLine(r: Receipt): string {
  if (r.kind === 'quoted') return `${r.repo} / ${r.path}`;
  if (r.kind === 'counted') return r.path ? `${r.repo} / ${r.path}` : r.repo;
  if (r.kind === 'computed') {
    const src = receipts[r.from[0]];
    return src?.kind === 'quoted' ? `${r.repo} / ${src.path}` : r.repo;
  }
  if (r.kind === 'api') return r.repo ? `GitHub API / ${r.repo}` : 'GitHub API';
  return 'GitHub profile';
}

function openLabel(r: Receipt): string {
  if (r.kind === 'quoted' || (r.kind === 'counted' && r.path)) return 'Open the file on GitHub';
  if (r.kind === 'read') return 'Open the profile on GitHub';
  if (r.kind === 'api') return r.repo ? 'Open the repository on GitHub' : 'Open the profile on GitHub';
  return 'Open the repository on GitHub';
}

interface Props {
  receipt: Receipt;
  /** Element for the claim: h2 in the slip, h3 on /receipts, p inline. */
  as?: 'h2' | 'h3' | 'p';
  headingId?: string;
  /** The `/receipts` page lists every receipt, so its items need no permalink. */
  permalink?: boolean;
}

/**
 * One receipt: claim, value, source, the exact line, when it was read and what the visitor can do.
 * Used in the slip, inline on the home page and on /receipts. Server-renderable.
 */
export default function ReceiptBody({ receipt: r, as: Claim = 'p', headingId, permalink = true }: Props) {
  const sha = r.kind === 'api' || r.kind === 'read' ? undefined : pinnedSha(r.repo);
  const checkable = r.kind === 'quoted' || r.kind === 'api';
  const date = r.kind === 'read' ? github.profile.readOn : github.readOn;
  return (
    <div data-receipt-scope={r.id} className="grid gap-xs">
      <Claim id={headingId} className="text-body font-medium leading-snug">{r.claim}</Claim>
      <p className="font-display text-headline text-primary tabular-nums">{r.value}</p>
      <p className="font-cond text-meta text-ink-muted [overflow-wrap:anywhere]">{sourceLine(r)}</p>

      {r.kind === 'quoted' ? (
        <blockquote className="bg-surface-2 px-xs py-xxs [overflow-wrap:anywhere]">
          <code className="!bg-transparent !p-0 text-body-sm whitespace-pre-wrap">{r.quote}</code>
        </blockquote>
      ) : null}
      {r.kind === 'counted' ? (
        r.path ? (
          <p className="text-body-sm text-ink-muted">{r.command}</p>
        ) : (
          <blockquote className="bg-surface-2 px-xs py-xxs [overflow-wrap:anywhere]">
            <code className="!bg-transparent !p-0 text-body-sm whitespace-pre-wrap">{r.command}</code>
          </blockquote>
        )
      ) : null}
      {r.kind === 'computed' ? (
        <>
          <p className="text-body-sm text-ink-muted">{r.working}</p>
          <p className="text-body-sm">
            {'From '}
            {r.from.map((id, i) => (
              <span key={id}>
                {i ? ', ' : ''}
                <Link href={`/receipts#${id}`} className="underline decoration-primary underline-offset-[0.2em]">{receipts[id].value}</Link>
              </span>
            ))}
            .
          </p>
        </>
      ) : null}
      {r.kind === 'read' ? <p className="text-body-sm text-ink-muted">{r.note}</p> : null}
      {r.kind === 'api' ? <p className="text-body-sm text-ink-muted">GitHub’s public API answers this when your browser asks.</p> : null}

      <p className="text-body-sm text-ink-subtle">
        {'Read on '}
        <time dateTime={date}>{formatDay(date)}</time>
        {sha ? <>{' at commit '}<span className="font-cond font-medium">{sha.slice(0, 7)}</span></> : null}
      </p>

      <div className="flex flex-wrap items-center gap-x-sm gap-y-0 pt-xxs">
        {checkable ? <CheckButton receipt={r} /> : null}
        {r.kind === 'counted' && !r.path ? <CopyButton text={r.command} /> : null}
        <a href={fileUrl(r)} target="_blank" rel="noopener noreferrer" className={LINK}>
          {openLabel(r)}
          <span className="sr-only">, opens GitHub</span>
        </a>
        {permalink ? <Link href={`/receipts#${r.id}`} className={LINK}>Permalink</Link> : null}
      </div>
      {checkable ? <CheckStatus receipt={r} /> : null}
    </div>
  );
}
