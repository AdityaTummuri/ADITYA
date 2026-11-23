import { test, expect } from '@playwright/test';

const ROUTES = ['/', '/work/qedcode', '/work/fracsst-mamba', '/work/netra-ugv', '/work/kavach-upi', '/archive', '/about', '/receipts', '/nope'];

for (const width of [320, 390, 768, 820, 1024, 1280, 1920]) {
  test(`nothing scrolls sideways at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ROUTES) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready.then(() => undefined));
      expect(await page.evaluate(() => { window.scrollTo(200, 0); return window.scrollX; }), route).toBe(0);
    }
  });
}
