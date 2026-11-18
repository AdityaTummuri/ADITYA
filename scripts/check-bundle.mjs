// Fails when the gzipped client JavaScript grows past the budget. Run after `next build`.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const BUDGET_KB = 650; // current build is about 560 KB; most of it is the lazy-loaded 3D scene
const dir = '.next/static/chunks';
const total = readdirSync(dir)
  .filter((f) => f.endsWith('.js'))
  .reduce((sum, f) => sum + gzipSync(readFileSync(join(dir, f))).length, 0);
const kb = Math.round(total / 1024);
console.log(`client JS: ${kb} KB gzipped (budget ${BUDGET_KB} KB)`);
if (kb > BUDGET_KB) {
  console.error('over budget');
  process.exit(1);
}
