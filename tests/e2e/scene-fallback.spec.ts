import { test, expect } from '@playwright/test';

test('without WebGL the CSS fallback shows, the page stays readable', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-webgl-fallback]')).toBeVisible({ timeout: 10000 });
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.locator('h1')).toContainText('run it again');
});
