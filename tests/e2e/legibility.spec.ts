import { test, expect } from '@playwright/test';
import { measure, report, settle, STATES } from './helpers/contrast';

// The CSS fallback (no WebGL): every text node in the viewport must keep 4.5:1 against the pixels behind it.
test.describe('legibility over the CSS fallback', () => {
  test.setTimeout(180_000);
  for (const state of STATES) {
    test(`${state.name}`, async ({ page }) => {
      await page.goto(state.url);
      await expect(page.locator('[data-webgl-fallback]')).toBeVisible({ timeout: 15_000 });
      await settle(page, false);
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
    await settle(page, false);
    expect(report('home start (reduced motion)', await measure(page, 2))).toEqual([]);
  });
});
