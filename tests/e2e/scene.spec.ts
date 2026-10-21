import { test, expect } from '@playwright/test';

declare global {
  interface Window { __sceneFrames?: number }
}

test('a single WebGL2 canvas renders with a capped drawing buffer', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('canvas')).toHaveCount(1, { timeout: 15000 });
  const info = await page.locator('canvas').evaluate((c: HTMLCanvasElement) => ({
    gl2: !!c.getContext('webgl2'),
    w: c.width,
    iw: window.innerWidth,
  }));
  expect(info.gl2).toBe(true);
  expect(info.w).toBeLessThanOrEqual(Math.ceil(info.iw * 1.5));
  await expect(page.locator('[data-loader]')).toHaveCount(0, { timeout: 10000 });
});

test('frames stop while the tab is hidden and resume when visible', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => (window.__sceneFrames ?? 0) > 10, undefined, { timeout: 15000 });
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.waitForTimeout(400);
  const a = await page.evaluate(() => window.__sceneFrames ?? 0);
  await page.waitForTimeout(600);
  const b = await page.evaluate(() => window.__sceneFrames ?? 0);
  expect(b).toBe(a);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => window.__sceneFrames ?? 0)).toBeGreaterThan(b);
});
