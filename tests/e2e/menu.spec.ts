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

test('menu links use display-sm and the current page is dimmed', async ({ page, viewport }) => {
  test.skip((viewport?.width ?? 0) < 768, 'display-sm is 39.06px from md up');
  await page.goto('/');
  await page.locator('button[aria-label="Menu"]').click();
  const home = page.getByRole('dialog', { name: 'Site menu' }).getByRole('link', { name: 'Home' });
  const other = page.getByRole('dialog', { name: 'Site menu' }).getByRole('link', { name: 'Transmissions' });
  await expect(home).toBeVisible();
  expect(await other.evaluate((el) => getComputedStyle(el).fontSize)).toBe('39.06px');
  expect(await home.evaluate((el) => getComputedStyle(el).opacity)).toBe('0.2');
  expect(await other.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
});
