import { describe, expect, it } from 'vitest';
import { checkReceipt, expectedFor, findQuote, pool } from '@/lib/receipt-check';
import { receipts } from '@/content/receipts';
import type { ApiReceipt, QuotedReceipt } from '@/content/types';

const quoted = receipts['qed-a'] as QuotedReceipt;
const stars = receipts['ar-ghostos'] as ApiReceipt;
const originals = receipts['gh-originals'] as ApiReceipt;

const reply = (status: number, body = '') => new Response(body, { status });
const doc = (line: number) => `${'x\n'.repeat(line - 1)}  ${quoted.quote.replace(/ /g, '\n  ')}\nafter`;
const stub = (fn: (url: string) => Promise<Response>) => fn as unknown as typeof fetch;

describe('findQuote', () => {
  it('ignores whitespace on both sides', () => {
    expect(findQuote('a  b\n  c', 'a b c')).toBe(1);
    expect(findQuote('86 of 89\ngrade A results\nwere right', '86 of 89 grade A results were right')).toBe(1);
  });
  it('returns the 1-based line the quote starts on', () => {
    expect(findQuote('one\ntwo\nthree four\nfive', 'three four')).toBe(3);
    expect(findQuote('one\ntwo\nthree\n  four', 'three four')).toBe(3);
  });
  it('returns null when the quote is missing', () => {
    expect(findQuote('nothing to see', 'something else')).toBeNull();
    expect(findQuote('anything', '   ')).toBeNull();
  });
});

describe('checkReceipt, quoted', () => {
  it('finds the line on main', async () => {
    const f = stub(async (url) => (url.includes('/main/') ? reply(200, doc(31)) : reply(404)));
    expect(await checkReceipt(quoted, f)).toEqual({ state: 'found-main', line: 31 });
  });
  it('falls back to the pinned commit', async () => {
    const f = stub(async (url) => (url.includes('/main/') ? reply(200, 'changed text') : reply(200, doc(12))));
    expect(await checkReceipt(quoted, f)).toEqual({ state: 'found-pinned', line: 12 });
  });
  it('says missing when neither has the line', async () => {
    expect((await checkReceipt(quoted, stub(async () => reply(200, 'nothing')))).state).toBe('missing');
    expect((await checkReceipt(quoted, stub(async () => reply(404)))).state).toBe('missing');
  });
  it('says offline when GitHub does not answer', async () => {
    expect((await checkReceipt(quoted, stub(async () => { throw new TypeError('network'); }))).state).toBe('offline');
    expect((await checkReceipt(quoted, stub(async () => reply(500)))).state).toBe('offline');
  });
  it('asks once per file when a cache is shared', async () => {
    let calls = 0;
    const f = stub(async () => { calls += 1; return reply(200, doc(3)); });
    const cache = new Map();
    await Promise.all([checkReceipt(quoted, f, cache), checkReceipt(quoted, f, cache)]);
    expect(calls).toBe(1);
  });
});

describe('checkReceipt, api', () => {
  it('matches when GitHub says the same number', async () => {
    const f = stub(async () => reply(200, JSON.stringify({ stargazers_count: expectedFor(stars) })));
    expect(await checkReceipt(stars, f)).toEqual({ state: 'matches', now: 5, was: 5 });
  });
  it('reports a change', async () => {
    const f = stub(async () => reply(200, JSON.stringify({ stargazers_count: 9 })));
    expect(await checkReceipt(stars, f)).toEqual({ state: 'changed', now: 9, was: 5 });
  });
  it('counts originals from the repository list', async () => {
    const list = [...Array(21).fill({ fork: false }), ...Array(16).fill({ fork: true })];
    expect((await checkReceipt(originals, stub(async () => reply(200, JSON.stringify(list))))).state).toBe('matches');
  });
  it('is offline on a bad answer', async () => {
    expect((await checkReceipt(stars, stub(async () => reply(403)))).state).toBe('offline');
  });
});

describe('pool', () => {
  it('never runs more than the limit at once and finishes every item', async () => {
    let live = 0;
    let peak = 0;
    const done: number[] = [];
    await pool([1, 2, 3, 4, 5, 6, 7, 8, 9], 4, async (n) => {
      live += 1;
      peak = Math.max(peak, live);
      await new Promise((r) => setTimeout(r, 5));
      live -= 1;
      done.push(n);
    });
    expect(peak).toBe(4);
    expect(done).toHaveLength(9);
  });
});
