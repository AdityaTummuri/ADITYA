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

test('menu links use display-sm and the current page is teal at full opacity', async ({ page, viewport }) => {
  test.skip((viewport?.width ?? 0) < 768, 'display-sm is 34px from md up at 1440');
  await page.goto('/');
  await page.locator('button[aria-label="Menu"]').click();
  const menu = page.getByRole('dialog', { name: 'Site menu' });
  const here = menu.getByRole('link', { name: 'Start' });
  const other = menu.getByRole('link', { name: 'Work' });
  await expect(here).toBeVisible();
  if (viewport?.width === 1440) expect(await other.evaluate((el) => getComputedStyle(el).fontSize)).toBe('34px');
  expect(await here.evaluate((el) => getComputedStyle(el).color)).toBe('rgb(143, 170, 178)');
  expect(await here.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  expect(await other.evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  const ratio = await here.evaluate((el) => {
    const [r, g, b] = getComputedStyle(el).color.match(/\d+/g)!.map((n) => {
      const c = Number(n) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return (0.2126 * r + 0.7152 * g + 0.0722 * b + 0.05) / 0.05;
  });
  expect(ratio).toBeGreaterThanOrEqual(4.5);
  await expect(menu.getByRole('link', { name: 'Archive' })).toBeVisible();
  await expect(menu.getByRole('link', { name: 'Receipts' })).toBeVisible();
});
