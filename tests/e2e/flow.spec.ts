import { test, expect } from '@playwright/test';

const wide = (v?: { width: number } | null) => (v?.width ?? 0) >= 768;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('sections flow in the document: nothing is pinned and none overlap', async ({ page }) => {
  expect(await page.locator('.pin-spacer').count()).toBe(0);
  const boxes = await page.locator('section[data-chapter]').evaluateAll((els) => els.map((e) => ({ t: e.getBoundingClientRect().top + window.scrollY, b: e.getBoundingClientRect().bottom + window.scrollY })));
  for (let i = 1; i < boxes.length; i++) expect(boxes[i].t).toBeGreaterThanOrEqual(boxes[i - 1].b - 1);
});

test('the hero fills the first screen alone and every section is at most two screens tall', async ({ page, viewport }) => {
  test.skip(!wide(viewport), 'screen heights are checked on wide screens');
  const vh = viewport!.height;
  const heights = await page.locator('section[data-chapter]').evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().height)));
  expect(heights[0]).toBeGreaterThanOrEqual(vh - 1);
  expect(heights[0]).toBeLessThanOrEqual(vh + 1);
  for (const h of heights) expect(h).toBeLessThanOrEqual(2 * vh + 1);
});

test('the hero panel shows real figures, not a drawing', async ({ page, viewport }) => {
  test.skip(!wide(viewport), 'the panel is wide-screen');
  const panel = page.getByRole('region', { name: 'The numbers' });
  await expect(panel).toContainText('original projects');
  await expect(panel).toContainText('Kotlin');
  await expect(page.locator('#hero svg polygon')).toHaveCount(0);
});

test('a hash lands the section at the top of the viewport', async ({ page, viewport }) => {
  test.skip(!wide(viewport), 'checked on wide screens');
  await page.goto('/#work');
  await expect
    .poll(() => page.locator('section#work').evaluate((el) => Math.round(el.getBoundingClientRect().top)), { timeout: 5000 })
    .toBeLessThanOrEqual(1);
});

test('the hero CTA reaches the work section', async ({ page }) => {
  await page.getByRole('link', { name: 'see the work' }).evaluate((el: HTMLElement) => el.click());
  await expect.poll(() => page.locator('section#work').evaluate((el) => Math.round(el.getBoundingClientRect().top)), { timeout: 6000 }).toBeLessThanOrEqual(1);
});

test('reduced motion: nothing is hidden', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('#work article').first()).toBeVisible();
});

test('Tab order starts skip link, wordmark, menu button', async ({ page }) => {
  const names: string[] = [];
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('Tab');
    names.push(await page.evaluate(() => { const a = document.activeElement as HTMLElement; return (a.getAttribute('aria-label') || a.textContent || '').trim(); }));
  }
  expect(names).toEqual(['Skip to content', 'AdityaTummuri', 'Menu']);
});

test('the footer row shows on the hero and hides over the sections below', async ({ page, viewport }) => {
  test.skip(!wide(viewport), 'the HUD is wide-screen');
  const hud = page.locator('[data-hud]');
  await expect(hud).toHaveCSS('opacity', '1');
  await page.evaluate(() => document.getElementById('work')!.scrollIntoView());
  await expect.poll(() => hud.evaluate((el) => +getComputedStyle(el).opacity), { timeout: 5000 }).toBe(0);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(() => hud.evaluate((el) => +getComputedStyle(el).opacity), { timeout: 5000 }).toBe(1);
});
