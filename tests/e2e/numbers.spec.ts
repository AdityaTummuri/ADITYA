import { test, expect } from '@playwright/test';
import { DATE_PATTERNS, EXEMPT } from '../unit/copy';

const ROUTES = ['/', '/work/qedcode', '/work/fracsst-mamba', '/work/netra-ugv', '/work/kavach-upi', '/archive', '/about', '/receipts', '/nope'];

for (const route of ROUTES) {
  test(`every number on ${route} is a receipt, code or a date`, async ({ page }) => {
    await page.goto(route);
    const bad = await page.evaluate(
      ({ exempt, dates }) => {
        const patterns = dates.map((d) => new RegExp(d, 'g'));
        const out: string[] = [];
        const walker = document.createTreeWalker(document.querySelector('main')!, NodeFilter.SHOW_TEXT);
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          const el = n.parentElement!;
          if (el.closest('script, style, noscript, [aria-hidden="true"], [data-receipt], [data-receipt-scope], [data-receipt-slip], code, time')) continue;
          let t = n.nodeValue ?? '';
          for (const name of exempt) t = t.split(name).join('');
          for (const re of patterns) t = t.replace(re, '');
          if (/\d/.test(t)) out.push(t.trim().slice(0, 80));
        }
        return out;
      },
      { exempt: [...EXEMPT, 'adityafrom2007@gmail.com'], dates: DATE_PATTERNS.map((r) => r.source) },
    );
    expect(bad).toEqual([]);
  });
}

test('no request leaves the site before a press', async ({ page, baseURL }) => {
  const origin = new URL(baseURL!).origin;
  const foreign: string[] = [];
  page.on('request', (r) => {
    const u = r.url();
    if (u.startsWith('data:') || u.startsWith('blob:')) return;
    if (new URL(u).origin !== origin) foreign.push(u);
  });
  for (const route of ['/', '/work/qedcode', '/work/kavach-upi', '/archive', '/about', '/receipts']) {
    await page.goto(route);
    await page.waitForTimeout(600);
  }
  expect(foreign).toEqual([]);
});
