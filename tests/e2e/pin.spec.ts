import { test, expect } from '@playwright/test';
import { LABELS } from '@/lib/chapter-timeline';

const wide = (v?: { width: number } | null) => (v?.width ?? 0) >= 768;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-loader]')).toHaveCount(0, { timeout: 10000 });
});

test('hero stays pinned while the statement fades in and the rail fills', async ({ page, viewport }) => {
  test.skip(!wide(viewport), 'pinning is a wide-screen behaviour');
  const vh = viewport!.height;
  const stageTop = () => page.locator('#hero [data-stage]').evaluate((el) => Math.round(el.getBoundingClientRect().top));
  const railFill = () => page.locator('[data-rail-fill]').evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).d);

  await page.mouse.move(700, 400);
  await page.mouse.wheel(0, 0.9 * vh);
  await page.waitForTimeout(1200);
  const first = await railFill();
  await page.mouse.wheel(0, 0.6 * vh);
  await page.waitForTimeout(1500);

  expect(await stageTop()).toBe(0);
  await expect
    .poll(() => page.locator('#hero [data-layer="statement"]').evaluate((el) => +getComputedStyle(el).opacity))
    .toBeGreaterThan(0.9);
  expect(await railFill()).toBeGreaterThan(first);
});

test('ArrowDown advances exactly one sub-state', async ({ page, viewport }) => {
  test.skip(!wide(viewport), 'pinning is a wide-screen behaviour');
  const vh = viewport!.height;
  await page.keyboard.press('ArrowDown');
  const expected = LABELS.handoff * 3 * vh;
  await expect.poll(() => page.evaluate(() => Math.round(window.scrollY)), { timeout: 5000 }).toBeGreaterThan(expected - 8);
  await page.waitForTimeout(600);
  const y = await page.evaluate(() => window.scrollY);
  expect(Math.abs(y - expected)).toBeLessThanOrEqual(8);
});

test('a hash lands the chapter at the top of the viewport', async ({ page, viewport }) => {
  test.skip(!wide(viewport), 'checked on wide screens');
  await page.goto('/#transmissions');
  await expect(page.locator('[data-loader]')).toHaveCount(0, { timeout: 10000 });
  await expect
    .poll(() => page.locator('section#transmissions').evaluate((el) => Math.round(el.getBoundingClientRect().top)), { timeout: 5000 })
    .toBeLessThanOrEqual(1);
});

test('narrow screens do not pin: sections flow normally', async ({ page, viewport }) => {
  test.skip(wide(viewport), 'narrow only');
  expect(await page.locator('.pin-spacer').count()).toBe(0);
  const tops = await page.locator('section[data-chapter]').evaluateAll((els) => els.map((e) => ({ t: e.getBoundingClientRect().top + window.scrollY, b: e.getBoundingClientRect().bottom + window.scrollY })));
  for (let i = 1; i < tops.length; i++) expect(tops[i].t).toBeGreaterThanOrEqual(tops[i - 1].b - 1);
});

test('resizing from wide to narrow mid-pin leaves no overlapping chapters', async ({ page, viewport }) => {
  test.skip(!wide(viewport), 'starts wide');
  await page.mouse.wheel(0, 1200);
  await page.waitForTimeout(800);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(900);
  const boxes = await page.locator('section[data-chapter]').evaluateAll((els) => els.map((e) => ({ t: e.getBoundingClientRect().top + window.scrollY, b: e.getBoundingClientRect().bottom + window.scrollY })));
  for (let i = 1; i < boxes.length; i++) expect(boxes[i].t).toBeGreaterThanOrEqual(boxes[i - 1].b - 1);
  expect(await page.locator('.pin-spacer').count()).toBe(0);
});

test('reduced motion: no pins and every layer is visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('[data-loader]')).toHaveCount(0);
  expect(await page.locator('.pin-spacer').count()).toBe(0);
  const opacities = await page.locator('[data-chapter] [data-layer]:not([data-layer="compact"])').evaluateAll((els) => els.map((e) => getComputedStyle(e).opacity));
  expect(opacities.length).toBeGreaterThan(10);
  expect(opacities.every((o) => o === '1')).toBe(true);
});

test('Tab order starts skip link, wordmark, menu button', async ({ page }) => {
  const names: string[] = [];
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('Tab');
    names.push(await page.evaluate(() => { const a = document.activeElement as HTMLElement; return (a.getAttribute('aria-label') || a.textContent || '').trim(); }));
  }
  expect(names).toEqual(['Skip to content', 'aditya tummuri', 'Menu']);
});
