import { test, expect } from '@playwright/test';
import { archive } from '@/content/archive';
import { fileUrl, repoUrl } from '@/content/receipt-links';
import { receipts } from '@/content/receipts';
import { rooms } from '@/content/rooms';

const LIVE = [
  'https://occasio-zeta.vercel.app',
  'https://lease-lens-ten.vercel.app',
  'https://fifa-nexus-matrix.vercel.app',
  'https://scopecreep-ai.vercel.app',
  'https://moneyball-2.streamlit.app',
  'https://netraugv.vercel.app',
];
const ALLOWED = new Set<string>([
  ...Object.values(receipts).map(fileUrl),
  ...archive.map((a) => repoUrl(a.repo)),
  ...archive.flatMap((a) => (a.live ? [a.live] : [])),
  ...rooms.flatMap((r) => r.links.map((l) => l.href)),
  ...LIVE,
  'https://www.linkedin.com/in/adityatummuri',
  'https://github.com/AdityaTummuri',
  'https://github.com/Lochan-B-07/Netra-UGV',
  'mailto:adityafrom2007@gmail.com',
]);
const ROUTES = ['/', '/work/qedcode', '/work/fracsst-mamba', '/work/netra-ugv', '/work/kavach-upi', '/archive', '/about', '/receipts', '/nope'];

test('the allowlist holds the six live sites and nothing from the dead links', () => {
  expect(LIVE).toHaveLength(6);
  for (const u of ALLOWED) expect(u).not.toMatch(/pypi\.org|github\.io/);
});

for (const route of ROUTES) {
  test(`every external link on ${route} is on the allowlist`, async ({ page }) => {
    await page.goto(route);
    const hrefs = await page.locator('a[href^="http"], a[href^="mailto:"]').evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).getAttribute('href')!));
    const outside = [...new Set(hrefs)].filter((h) => !ALLOWED.has(h));
    expect(outside).toEqual([]);
  });
}
