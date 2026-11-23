import { test, expect } from '@playwright/test';
import { BANNED } from '../unit/copy';

const ROUTES = ['/', '/work/qedcode', '/work/fracsst-mamba', '/work/netra-ugv', '/work/kavach-upi', '/archive', '/about', '/receipts', '/nope'];

for (const route of ROUTES) {
  test(`${route} holds nothing from the banned list and no em dash`, async ({ request }) => {
    const res = await request.get(route);
    const html = await res.text();
    const hits = BANNED.filter((b) => html.includes(b));
    expect(hits).toEqual([]);
    expect(html.includes('—')).toBe(false);
  });
}

test('every sitemap route is covered', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  expect(paths.sort()).toEqual(ROUTES.filter((r) => r !== '/nope').sort());
});
