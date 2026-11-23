import { test, expect } from '@playwright/test';

test('hero heading splits into masked lines and ends visible', async ({ page }) => {
  await page.goto('/');
  await expect.poll(() => page.locator('h1 .line').count(), { timeout: 8000 }).toBeGreaterThanOrEqual(2);
  await expect(page.locator('h1')).toBeVisible();
  expect(await page.locator('h1').evaluate((el) => getComputedStyle(el).visibility)).toBe('visible');
});

test('reduced motion: no line animates, heading fully visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const h1 = page.locator('h1');
  expect(await h1.evaluate((el) => el.getAnimations({ subtree: true }).length)).toBe(0);
  expect(await h1.locator('.line > span').evaluateAll((els) => els.map((e) => getComputedStyle(e).transform))).toEqual(['none', 'none']);
  expect(await h1.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  expect(await h1.evaluate((el) => getComputedStyle(el).visibility)).toBe('visible');
});

test('the headline is readable without JavaScript', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/');
  await page.waitForTimeout(1200);
  const line = page.locator('h1 .line').first();
  const inner = line.locator('span');
  const [a, b] = [await line.boundingBox(), await inner.boundingBox()];
  expect(b!.y).toBeGreaterThanOrEqual(a!.y - 1);
  expect(b!.y + b!.height).toBeLessThanOrEqual(a!.y + a!.height + 1);
  await ctx.close();
});
