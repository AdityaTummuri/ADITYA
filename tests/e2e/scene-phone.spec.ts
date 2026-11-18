import { test, expect } from '@playwright/test';

test('phones get the static CSS scene and never create a WebGL canvas', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-webgl-fallback]')).toHaveCount(1);
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.locator('h1')).toBeVisible();
});
