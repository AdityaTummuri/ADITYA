import { test, expect } from '@playwright/test';

const wide = (v?: { width: number } | null) => (v?.width ?? 0) >= 768;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('divisions flow in the document: nothing is pinned and none overlap', async ({ page }) => {
  expect(await page.locator('.pin-spacer').count()).toBe(0);
  const boxes = await page.locator('section[data-division]').evaluateAll((els) => els.map((e) => ({ t: e.getBoundingClientRect().top + window.scrollY, b: e.getBoundingClientRect().bottom + window.scrollY })));
  expect(boxes).toHaveLength(3);
  for (let i = 1; i < boxes.length; i++) expect(boxes[i].t).toBeGreaterThanOrEqual(boxes[i - 1].b - 1);
});

test('each home division is at most 1.02 screens and the document at most 3.05', async ({ page, viewport }) => {
  test.skip(!wide(viewport), 'screen heights are checked on wide screens');
  const vh = viewport!.height;
  const heights = await page.locator('section[data-division]').evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().height)));
  for (const h of heights) expect(h).toBeLessThanOrEqual(1.02 * vh);
  const doc = await page.evaluate(() => document.documentElement.scrollHeight);
  expect(doc).toBeLessThanOrEqual(3.05 * vh);
});

test('on a phone the home is at most 4.6 screens', async ({ page, viewport }) => {
  test.skip(wide(viewport), 'phone limit');
  const doc = await page.evaluate(() => document.documentElement.scrollHeight);
  expect(doc).toBeLessThanOrEqual(4.6 * viewport!.height);
});

test('a hash lands the division at the top of the viewport', async ({ page, viewport }) => {
  test.skip(!wide(viewport), 'checked on wide screens');
  await page.goto('/#work');
  await expect
    .poll(() => page.locator('section#work').evaluate((el) => Math.round(el.getBoundingClientRect().top)), { timeout: 5000 })
    .toBeLessThanOrEqual(1);
});

test('the hero button reaches the work division', async ({ page }) => {
  await page.getByRole('link', { name: 'See the four projects' }).evaluate((el: HTMLElement) => el.click());
  await expect.poll(() => page.locator('section#work').evaluate((el) => Math.round(el.getBoundingClientRect().top)), { timeout: 6000 }).toBeLessThanOrEqual(1);
});

test('reduced motion: nothing is hidden', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('#work ol li').first()).toBeVisible();
});

test('Tab order starts skip link, wordmark, menu button', async ({ page }) => {
  const names: string[] = [];
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('Tab');
    names.push(await page.evaluate(() => { const a = document.activeElement as HTMLElement; return (a.getAttribute('aria-label') || a.textContent || '').trim(); }));
  }
  expect(names).toEqual(['Skip to content', 'Aditya Tummuri', 'Menu']);
});

test('the division rail follows the screen and its links travel', async ({ page, viewport }) => {
  test.skip((viewport?.width ?? 0) < 1280, 'the rail is for wide screens');
  const rail = page.getByRole('navigation', { name: 'On this page' });
  await expect(rail.getByRole('link')).toHaveText(['Start', 'Work', 'Contact']);
  await expect(rail.getByRole('link', { name: 'Start' })).toHaveAttribute('aria-current', 'location');
  await rail.getByRole('link', { name: 'Work' }).click();
  await expect(rail.getByRole('link', { name: 'Work' })).toHaveAttribute('aria-current', 'location', { timeout: 6000 });
  await expect(rail.getByRole('link', { name: 'Start' })).not.toHaveAttribute('aria-current', 'location');
});

test('the rail is not shown on a phone', async ({ page, viewport }) => {
  test.skip(wide(viewport), 'phone only');
  await expect(page.getByRole('navigation', { name: 'On this page' })).toBeHidden();
});
