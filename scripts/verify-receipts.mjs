// Fetches every quoted receipt's file at its pinned commit and looks for the quote. Exits 1 on any miss.
// Run through `npm run verify:receipts` (Node strips the types of the TypeScript content files).
import { commits } from '../content/commits.ts';
import { rawUrl } from '../content/receipt-links.ts';
import { receipts } from '../content/receipts.ts';
import { findQuote } from '../lib/receipt-check.ts';

const quoted = Object.values(receipts).filter((r) => r.kind === 'quoted');
const files = new Map();

async function text(url) {
  if (!files.has(url)) {
    files.set(url, fetch(url, { headers: { 'User-Agent': 'portfolio-verify' } }).then(async (res) => (res.status === 200 ? { text: await res.text() } : { status: res.status })));
  }
  return files.get(url);
}

const rows = [];
let misses = 0;
for (let i = 0; i < quoted.length; i += 6) {
  const batch = quoted.slice(i, i + 6);
  const done = await Promise.all(
    batch.map(async (r) => {
      const sha = commits[r.repo];
      if (!sha) return { id: r.id, result: 'no pinned commit' };
      const res = await text(rawUrl(r, sha));
      if (!res.text) return { id: r.id, result: `HTTP ${res.status}` };
      const line = findQuote(res.text, r.quote);
      return { id: r.id, result: line === null ? 'MISSING' : `line ${line}` };
    }),
  );
  rows.push(...done.map((d, k) => ({ ...d, repo: batch[k].repo, path: batch[k].path, sha: commits[batch[k].repo]?.slice(0, 7) })));
}

const w = Math.max(...rows.map((r) => r.id.length));
for (const r of rows) {
  const ok = r.result.startsWith('line');
  if (!ok) misses += 1;
  console.log(`${ok ? 'found  ' : 'MISSING'} ${r.id.padEnd(w)}  ${r.result.padEnd(10)} ${r.repo}@${r.sha} ${r.path}`);
}
console.log(`\n${quoted.length - misses} of ${quoted.length} quoted receipts found at their pinned commits.`);
if (misses) process.exit(1);
