import { test, expect } from '@playwright/test';
import { measure, report, settle, STATES } from './helpers/contrast';

// The live WebGL scene (bloom, grain and all): the same measurement as legibility.spec.ts.
test.describe('legibility over the WebGL scene', () => {
  test.setTimeout(180_000);
  for (const state of STATES) {
    test(`${state.name}`, async ({ page }) => {
      await page.goto(state.url);
      await expect(page.locator('canvas')).toHaveCount(1, { timeout: 20_000 });
      await settle(page, true);
      await state.setup?.(page);
      await page.waitForTimeout(900);
      const findings = await measure(page, 6);
      expect(findings.length, `no text found on ${state.name}`).toBeGreaterThan(0);
      expect(report(state.name, findings)).toEqual([]);
    });
  }

  test('reduced motion: home start', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.locator('canvas')).toHaveCount(1, { timeout: 20_000 });
    // a still scene draws once and stops
    await settle(page, true, 1);
    expect(report('home start (reduced motion)', await measure(page, 2))).toEqual([]);
  });
});
