import { test, expect } from '@playwright/test';

test('home has one h1, paper canvas and a 10px root', async ({ page }) => {
  await page.goto('/');
  expect(await page.locator('h1').count()).toBe(1);
  expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe('rgb(247, 240, 224)');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).fontSize)).toBe('10px');
});
