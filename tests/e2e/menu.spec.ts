import { test, expect } from '@playwright/test';

test('menu opens, locks scroll, traps focus and closes with Escape', async ({ page }) => {
  await page.goto('/');
  const btn = page.locator('button[aria-label="Menu"]');
  const panel = page.getByRole('dialog', { name: 'Site menu' });
  await expect(panel).toBeHidden();

  await btn.click();
  await expect(panel).toBeVisible();
  await expect(btn).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('body')).toHaveAttribute('data-scroll-locked', 'true');

  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    const contained = await page.evaluate(() => {
      const a = document.activeElement;
      return !!a && (!!a.closest('[role=dialog]') || a.getAttribute('aria-label') === 'Menu');
    });
    expect(contained).toBe(true);
  }

  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(btn).toBeFocused();
  await expect(page.locator('body')).not.toHaveAttribute('data-scroll-locked', 'true');
});

test('menu links are big, ink on paper, and the current page is marked', async ({ page, viewport }) => {
  await page.goto('/');
  await page.locator('button[aria-label="Menu"]').click();
  const menu = page.getByRole('dialog', { name: 'Site menu' });
  const here = menu.getByRole('link', { name: 'Start' });
  const other = menu.getByRole('link', { name: 'Work' });
  await expect(here).toBeVisible();
  await expect(here).toHaveAttribute('aria-current', 'page');
  await expect(here.locator('.marker')).toHaveCount(1);
  const size = parseFloat(await other.evaluate((el) => getComputedStyle(el).fontSize));
  expect(size).toBeGreaterThanOrEqual(viewport && viewport.width >= 768 ? 56 : 36);
  expect(await other.evaluate((el) => getComputedStyle(el).color)).toBe('rgb(23, 20, 46)');
  await expect(menu.getByRole('link', { name: 'Archive' })).toBeVisible();
  await expect(menu.getByRole('link', { name: 'Receipts' })).toBeVisible();
});
