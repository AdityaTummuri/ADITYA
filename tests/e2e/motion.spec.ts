import { test, expect } from '@playwright/test';

test('a press on the hero button throws drawn effects on the shared canvas', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => !!window.SakugaFX);
  expect(await page.locator('canvas.sakuga-fx').count()).toBe(0);
  await page.getByRole('link', { name: 'See the four projects' }).click();
  await expect(page.locator('canvas.sakuga-fx')).toHaveCount(1);
});

test('a click on empty paper in the hero reacts too', async ({ page, viewport }) => {
  test.skip((viewport?.width ?? 0) < 1024, 'the empty stage is on wide screens');
  await page.goto('/');
  await page.waitForFunction(() => !!window.SakugaFX);
  await page.mouse.click(760, 790);
  await expect(page.locator('canvas.sakuga-fx')).toHaveCount(1);
});

test('reduced motion: the core draws nothing and the page still works', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.waitForFunction(() => !!window.SakugaFX);
  await page.getByRole('link', { name: 'All receipts' }).hover();
  await page.getByRole('button', { name: 'Menu' }).click();
  await expect(page.getByRole('dialog', { name: 'Site menu' })).toBeVisible();
  expect(await page.locator('canvas.sakuga-fx').count()).toBe(0);
  const anim = await page.locator('h1 .pop-in').first().evaluate((el) => getComputedStyle(el).animationName);
  expect(anim === 'none' || (await page.locator('h1').isVisible())).toBe(true);
});

test('the headline is readable without JavaScript', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('http://localhost:3000/');
  await expect(page.locator('h1')).toContainText('I don’t trust a number');
  await ctx.close();
});
