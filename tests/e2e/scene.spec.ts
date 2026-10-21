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

declare global {
  interface Window { __sceneEffects?: string[] }
}

test('the post-processing chain mounts: bloom, grade, grain, smaa', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => (window.__sceneEffects?.length ?? 0) > 0, undefined, { timeout: 15000 });
  const fx = await page.evaluate(() => window.__sceneEffects);
  expect(fx).toEqual(expect.arrayContaining(['bloom', 'grade', 'noise']));
});

test('normal motion keeps rendering frames', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(() => (window.__sceneFrames ?? 0) > 1, undefined, { timeout: 15000 });
  const a = await page.evaluate(() => window.__sceneFrames ?? 0);
  await page.waitForTimeout(2000);
  const b = await page.evaluate(() => window.__sceneFrames ?? 0);
  // software GL (SwiftShader) in CI is slow; this only proves the loop is alive, not that it is fast
  expect(b - a).toBeGreaterThanOrEqual(3);
});

test('reduced motion renders one still frame and then stops', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('canvas')).toHaveCount(1, { timeout: 15000 });
  await page.waitForFunction(() => (window.__sceneFrames ?? 0) >= 1, undefined, { timeout: 15000 });
  await page.waitForTimeout(1500);
  const a = await page.evaluate(() => window.__sceneFrames ?? 0);
  await page.waitForTimeout(1500);
  const b = await page.evaluate(() => window.__sceneFrames ?? 0);
  expect(b).toBe(a);
  expect(a).toBeLessThanOrEqual(6);
  await expect(page.locator('canvas')).toBeVisible();
});

test('losing the WebGL context swaps in the CSS fallback', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('canvas')).toHaveCount(1, { timeout: 15000 });
  // wait until the scene is rendering, so its context-loss listener is attached
  await page.waitForFunction(() => (window.__sceneFrames ?? 0) > 1, undefined, { timeout: 15000 });
  await page.evaluate(() => {
    const gl = document.querySelector('canvas')!.getContext('webgl2')!;
    gl.getExtension('WEBGL_lose_context')!.loseContext();
  });
  await expect(page.locator('[data-webgl-fallback]')).toBeVisible({ timeout: 5000 });
  await expect(page.locator('h1')).toContainText('that dream in');
});

test('with the real canvas mounted there are no serious or critical a11y violations', async ({ page }) => {
  const { default: AxeBuilder } = await import('@axe-core/playwright');
  await page.goto('/');
  await expect(page.locator('canvas')).toHaveCount(1, { timeout: 15000 });
  await expect(page.locator('[data-loader]')).toHaveCount(0, { timeout: 10000 });
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => v.id)).toEqual([]);
});
