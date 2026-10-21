import { test, expect } from '@playwright/test';

test('hero heading splits into masked lines and ends visible', async ({ page }) => {
  await page.goto('/');
  await expect.poll(() => page.locator('h1 .line').count(), { timeout: 8000 }).toBeGreaterThanOrEqual(2);
  await expect(page.locator('[data-loader]')).toHaveCount(0, { timeout: 8000 });
  await expect(page.locator('h1')).toBeVisible();
  expect(await page.locator('h1').evaluate((el) => getComputedStyle(el).visibility)).toBe('visible');
});

test('reduced motion: no loader, no split wrappers, heading fully visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('[data-loader]')).toHaveCount(0, { timeout: 3000 });
  expect(await page.locator('h1 .line').count()).toBe(0);
  const h1 = page.locator('h1');
  expect(await h1.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  expect(await h1.evaluate((el) => getComputedStyle(el).visibility)).toBe('visible');
});
