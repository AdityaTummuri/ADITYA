// Fails when the gzipped client JavaScript grows past the budget, or when a page other than a room
// loads an exhibit chunk. Run after `next build`.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const BUDGET_KB = 650; // current build is about 590 KB; most of it is the lazy-loaded 3D scene
const dir = '.next/static/chunks';
const total = readdirSync(dir)
  .filter((f) => f.endsWith('.js'))
  .reduce((sum, f) => sum + gzipSync(readFileSync(join(dir, f))).length, 0);
const kb = Math.round(total / 1024);
console.log(`client JS: ${kb} KB gzipped (budget ${BUDGET_KB} KB)`);
let failed = false;
if (kb > BUDGET_KB) {
  console.error('over budget');
  failed = true;
}

// Each exhibit is its own chunk, imported with next/dynamic by the room page only.
function manifests(root) {
  const out = [];
  for (const name of readdirSync(root)) {
    const p = join(root, name);
    if (statSync(p).isDirectory()) out.push(...manifests(p));
    else if (name === 'page_client-reference-manifest.js') out.push(p);
  }
  return out;
}
const read = (p) => JSON.parse(readFileSync(p, 'utf8').match(/__RSC_MANIFEST\["[^"]+"\]\s*=\s*(\{.*\})\s*;?\s*$/s)[1]);
const all = manifests('.next/server/app').map((p) => ({ p, m: read(p), room: p.includes('/work/') }));
const exhibitKeys = (m) => Object.keys(m.clientModules).filter((k) => k.includes('/components/exhibits/'));
const chunksOf = (m) => new Set([...Object.values(m.clientModules).flatMap((c) => c.chunks), ...Object.values(m.entryJSFiles ?? {}).flat()]);
const shared = new Set(all.filter((x) => !x.room).flatMap((x) => [...chunksOf(x.m)]));
// chunks that hold exhibit code and nothing the other pages use
const exhibitChunks = new Set(
  all.filter((x) => x.room).flatMap((x) => exhibitKeys(x.m).flatMap((k) => x.m.clientModules[k].chunks)).filter((c) => !shared.has(c)),
);
if (!exhibitChunks.size) {
  console.error('exhibit check: no chunk of its own was found for the exhibits');
  failed = true;
}
for (const { p, m, room } of all) {
  if (room) continue;
  const leaked = [...exhibitChunks].filter((c) => chunksOf(m).has(c));
  if (exhibitKeys(m).length || leaked.length) {
    console.error(`${p} loads an exhibit: ${[...exhibitKeys(m), ...leaked].join(', ')}`);
    failed = true;
  }
}
console.log(`exhibit chunks: ${exhibitChunks.size}, kept out of ${all.filter((x) => !x.room).length} other routes`);
if (failed) process.exit(1);
