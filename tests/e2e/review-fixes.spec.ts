import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('a menu link to a chapter takes the visitor there', async ({ page }) => {
  await page.locator('button[aria-label="Menu"]').click();
  await page.getByRole('dialog', { name: 'Site menu' }).getByRole('link', { name: 'Contact' }).evaluate((el: HTMLElement) => el.click());
  await expect.poll(() => page.locator('section#contact').evaluate((el) => Math.round(el.getBoundingClientRect().top)), { timeout: 6000 }).toBeLessThanOrEqual(100);
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
