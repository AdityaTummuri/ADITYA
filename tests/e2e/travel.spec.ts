import { test, expect } from '@playwright/test';

test('home row, room, browser Back: lands on the home with the row in view', async ({ page }) => {
  await page.goto('/');
  const row = page.locator('#work ol > li').nth(2).getByRole('link', { name: /NETRA-UGV/ });
  await row.click();
  await expect(page).toHaveURL(/\/work\/netra-ugv$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(row).toBeInViewport({ timeout: 8000 });
});

test('Escape in a room goes to the work list', async ({ page }) => {
  await page.goto('/work/qedcode');
  await page.waitForSelector('html[data-slip-ready]');
  await page.keyboard.press('Escape');
  await expect(page).toHaveURL(/\/#work$/);
});

test('Escape with a receipt open only closes the receipt', async ({ page }) => {
  await page.goto('/work/qedcode');
  await page.waitForSelector('html[data-slip-ready]');
  await page.locator('#exhibit a[data-receipt="qed-commits"]').click();
  const slip = page.locator('[data-receipt-slip]');
  await expect(slip).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(slip).toBeHidden();
  await page.waitForTimeout(600);
  expect(new URL(page.url()).pathname).toBe('/work/qedcode');
});

test('Escape with the menu open only closes the menu', async ({ page }) => {
  await page.goto('/work/qedcode');
  await page.locator('button[aria-label="Menu"]').click();
  await expect(page.getByRole('dialog', { name: 'Site menu' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Site menu' })).toBeHidden();
  await page.waitForTimeout(600);
  expect(new URL(page.url()).pathname).toBe('/work/qedcode');
});

test('Escape does nothing while a switch has focus', async ({ page }) => {
  await page.goto('/work/kavach-upi');
  await page.getByRole('switch', { name: 'A payment app is open' }).focus();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);
  expect(new URL(page.url()).pathname).toBe('/work/kavach-upi');
});

test('reduced motion sets every view transition duration to zero', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const rule = await page.evaluate(() => {
    for (const sheet of [...document.styleSheets]) {
      for (const r of [...sheet.cssRules]) {
        if (r instanceof CSSMediaRule && r.conditionText.includes('prefers-reduced-motion')) {
          for (const inner of [...r.cssRules]) {
            if (inner instanceof CSSStyleRule && inner.selectorText.includes('::view-transition-group(*)')) {
              return { duration: inner.style.getPropertyValue('animation-duration'), priority: inner.style.getPropertyPriority('animation-duration') };
            }
          }
        }
      }
    }
    return null;
  });
  expect(rule).toEqual({ duration: '0s', priority: 'important' });
});

test('the next room link travels sideways and rooms keep their order', async ({ page }) => {
  await page.goto('/work/qedcode');
  await page.getByRole('link', { name: /^Next episode/ }).click();
  await expect(page).toHaveURL(/\/work\/fracsst-mamba$/);
  await expect(page.locator('h1')).toHaveText('FracSST-Mamba');
});
