import { test, expect } from '@playwright/test';

test('sitemap lists the home, 11 case studies and 3 notes', async ({ request }) => {
  const res = await request.get('/sitemap.xml');
  expect(res.status()).toBe(200);
  const locs = [...(await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  expect(locs.filter((p) => p.startsWith('/work/'))).toHaveLength(11);
  expect(locs.filter((p) => p.startsWith('/notes/'))).toHaveLength(3);
  expect(locs).toContain('/');
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

test('an unknown route shows the 404 lockup with a way home', async ({ page }) => {
  const res = await page.goto('/nope');
  expect(res?.status()).toBe(404);
  await expect(page.getByText('Signal lost', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Nothing on this frequency/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Back to the start/ })).toHaveAttribute('href', '/');
});

test('pages declare a title, description and theme colour', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Aditya Tummuri — The Dreaming Machine');
  expect(await page.locator('meta[name="description"]').getAttribute('content')).toContain('ECE student');
  expect(await page.locator('meta[name="theme-color"]').getAttribute('content')).toBe('#000000');
});
