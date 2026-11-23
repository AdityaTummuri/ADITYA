import { test, expect } from '@playwright/test';

test('sitemap lists the home, 4 rooms, the archive, about and receipts', async ({ request }) => {
  const res = await request.get('/sitemap.xml');
  expect(res.status()).toBe(200);
  const locs = [...(await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  expect(locs.filter((p) => p.startsWith('/work/'))).toHaveLength(4);
  expect(locs).toEqual(expect.arrayContaining(['/', '/archive', '/about', '/receipts']));
  expect(locs).toHaveLength(8);
});

test('robots allows crawling and points at the sitemap', async ({ request }) => {
  const body = await (await request.get('/robots.txt')).text();
  expect(body).toMatch(/Allow: \//);
  expect(body).toMatch(/Sitemap: .*\/sitemap\.xml/);
});

test('the social image is a 1200x630 png', async ({ request }) => {
  const res = await request.get('/opengraph-image');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('image/png');
  const buf = await res.body();
  // PNG IHDR: width at bytes 16..19, height at 20..23
  expect(buf.readUInt32BE(16)).toBe(1200);
  expect(buf.readUInt32BE(20)).toBe(630);
});

test('an unknown route shows the 404 page with a way home', async ({ page }) => {
  const res = await page.goto('/nope');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'This page isn’t here.' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Back to the start/ })).toHaveAttribute('href', '/');
  await expect(page.getByRole('link', { name: /See the work/ })).toHaveAttribute('href', '/#work');
  await expect(page).toHaveTitle('Page not found | Aditya Tummuri');
});

test('pages declare a title, description, canonical, open graph and theme colour', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Aditya Tummuri');
  expect(await page.locator('meta[name="description"]').getAttribute('content')).toContain('electronics and communication engineering student');
  expect(await page.locator('meta[name="theme-color"]').getAttribute('content')).toBe('#f7f0e0');
  expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toMatch(/^http:\/\/localhost:3000\/?$/);
  for (const [path, title] of [['/archive', 'Archive | Aditya Tummuri'], ['/about', 'About | Aditya Tummuri'], ['/receipts', 'Receipts | Aditya Tummuri'], ['/work/qedcode', 'QEDCode | Aditya Tummuri']] as const) {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toContain(path);
    expect(await page.locator('meta[property="og:title"]').getAttribute('content')).toBeTruthy();
    expect(await page.locator('meta[property="og:description"]').getAttribute('content')).toBeTruthy();
  }
});
