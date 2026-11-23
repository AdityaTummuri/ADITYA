import { test, expect } from '@playwright/test';

const wide = (v?: { width: number } | null) => (v?.width ?? 0) >= 768;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('a menu anchor click scrolls the home to that division (synthetic click, Lenis stopped by the menu)', async ({ page, viewport }) => {
  test.skip(!wide(viewport), 'checked on wide screens');
  await page.locator('button[aria-label="Menu"]').click();
  await page.getByRole('dialog', { name: 'Site menu' }).getByRole('link', { name: 'Contact' }).evaluate((el: HTMLElement) => el.click());
  await expect.poll(() => page.locator('section#contact').evaluate((el) => Math.round(el.getBoundingClientRect().top)), { timeout: 6000 }).toBeLessThanOrEqual(1);
});

test('with the menu open, neither the wheel nor the keyboard scrolls the page behind it', async ({ page }) => {
  await page.locator('button[aria-label="Menu"]').click();
  await expect(page.getByRole('dialog', { name: 'Site menu' })).toBeVisible();
  await page.mouse.move(100, 400);
  await page.mouse.wheel(0, 900);
  await page.keyboard.press('PageDown');
  await page.keyboard.press('Space');
  await page.waitForTimeout(800);
  expect(await page.evaluate(() => Math.round(window.scrollY))).toBe(0);
});


test('case studies do not use an accent-filled banner', async ({ page }) => {
  await page.goto('/work/netra-ugv');
  await expect(page.locator('main [class*="from-[#455d64]"]')).toHaveCount(0);
});
