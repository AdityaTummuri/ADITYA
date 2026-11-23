import github from '../content/github.json' with { type: 'json' };
import { liveRef, pinnedSha, rawUrl } from '../content/receipt-links.ts';
import type { ApiReceipt, QuotedReceipt } from '../content/types.ts';

export type CheckState = 'found-main' | 'found-pinned' | 'missing' | 'matches' | 'changed' | 'offline';
export interface CheckResult {
  state: CheckState;
  /** 1-based line of the quote. */
  line?: number;
  /** What GitHub says now (api receipts). */
  now?: number;
  /** What this site read on the day (api receipts). */
  was?: number;
}

const strip = (s: string) => s.replace(/\s+/g, '');

/**
 * The 1-based line of `text` where `quote` starts, comparing with all whitespace removed on both
 * sides; null when it is not there.
 */
export function findQuote(text: string, quote: string): number | null {
  const wanted = strip(quote);
  if (!wanted) return null;
  let squashed = '';
  const lineAt: number[] = [];
  let line = 1;
  for (const ch of text) {
    if (ch === '\n') line += 1;
    if (/\s/.test(ch)) continue;
    squashed += ch;
    for (let i = 0; i < ch.length; i++) lineAt.push(line);
  }
  const at = squashed.indexOf(wanted);
  return at === -1 ? null : lineAt[at];
}

type FileResult = { status: 'ok'; text: string } | { status: 'missing' } | { status: 'error' };
/** One in-flight or finished fetch per URL, so a file shared by many receipts is asked for once. */
export type FileCache = Map<string, Promise<FileResult>>;

const TIMEOUT_MS = 8000;

async function getFile(url: string, fetchImpl: typeof fetch, cache?: FileCache): Promise<FileResult> {
  const hit = cache?.get(url);
  if (hit) return hit;
  const run = (async (): Promise<FileResult> => {
    try {
      const res = await fetchImpl(url, { signal: AbortSignal.timeout(TIMEOUT_MS), cache: 'no-store' });
      if (res.status === 404) return { status: 'missing' };
      if (!res.ok) return { status: 'error' };
      return { status: 'ok', text: await res.text() };
    } catch {
      return { status: 'error' };
    }
  })();
  cache?.set(url, run);
  return run;
}

/** The number an api receipt carries on this site, from content/github.json. */
export function expectedFor(r: ApiReceipt): number {
  switch (r.field) {
    case 'public_repos':
      return github.account.public_repos;
    case 'originals':
      return github.account.originals;
    case 'forks':
      return github.account.forks;
    case 'originalStars':
      return github.account.originalStars;
    case 'stargazers_count':
      return (github.stars as Record<string, number>)[r.repo] ?? 0;
  }
}

function fromApi(r: ApiReceipt, json: unknown): number | null {
  if (r.field === 'public_repos' || r.field === 'stargazers_count') {
    const v = (json as Record<string, unknown> | null)?.[r.field];
    return typeof v === 'number' ? v : null;
  }
  if (!Array.isArray(json)) return null;
  const repos = json as { fork?: boolean; stargazers_count?: number }[];
  const own = repos.filter((x) => !x.fork);
  if (r.field === 'originals') return own.length;
  if (r.field === 'forks') return repos.length - own.length;
  return own.reduce((sum, x) => sum + (x.stargazers_count ?? 0), 0);
}

/** Asks GitHub, from the visitor's browser, whether the receipt still holds. */
export async function checkReceipt(r: QuotedReceipt | ApiReceipt, fetchImpl: typeof fetch = fetch, cache?: FileCache): Promise<CheckResult> {
  if (r.kind === 'api') {
    const res = await getFile(r.url, fetchImpl, cache);
    if (res.status !== 'ok') return { state: 'offline' };
    let json: unknown;
    try {
      json = JSON.parse(res.text);
    } catch {
      return { state: 'offline' };
    }
    const now = fromApi(r, json);
    if (now === null) return { state: 'offline' };
    const was = expectedFor(r);
    return { state: now === was ? 'matches' : 'changed', now, was };
  }
  const main = await getFile(rawUrl(r, liveRef(r.repo)), fetchImpl, cache);
  if (main.status === 'ok') {
    const line = findQuote(main.text, r.quote);
    if (line !== null) return { state: 'found-main', line };
  }
  const sha = pinnedSha(r.repo);
  const pinned = sha ? await getFile(rawUrl(r, sha), fetchImpl, cache) : ({ status: 'missing' } as FileResult);
  if (pinned.status === 'ok') {
    const line = findQuote(pinned.text, r.quote);
    if (line !== null) return { state: 'found-pinned', line };
  }
  const anyError = main.status === 'error' || pinned.status === 'error';
  return { state: anyError && main.status !== 'ok' && pinned.status !== 'ok' ? 'offline' : 'missing' };
}

/** Runs `worker` over `items`, at most `limit` at a time. */
export async function pool<T>(items: T[], limit: number, worker: (item: T) => Promise<void>): Promise<void> {
  let next = 0;
  const lane = async () => {
    while (next < items.length) {
      const item = items[next++];
      await worker(item);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, lane));
}
