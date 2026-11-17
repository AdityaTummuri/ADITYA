import { test, expect } from '@playwright/test';

const wide = (v?: { width: number } | null) => (v?.width ?? 0) >= 768;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-loader]')).toHaveCount(0, { timeout: 10000 });
});

test('a menu anchor click scrolls the home to that section (synthetic click, Lenis stopped by the menu)', async ({ page, viewport }) => {
  test.skip(!wide(viewport), 'checked on wide screens');
  await page.locator('button[aria-label="Menu"]').click();
  await page.getByRole('dialog', { name: 'Site menu' }).getByRole('link', { name: 'About' }).evaluate((el: HTMLElement) => el.click());
  await expect.poll(() => page.locator('section#about').evaluate((el) => Math.round(el.getBoundingClientRect().top)), { timeout: 6000 }).toBeLessThanOrEqual(1);
});

test('with the menu open, neither the wheel nor the keyboard scrolls the page behind it', async ({ page }) => {
  await page.locator('button[aria-label="Menu"]').click();
  await expect(page.getByRole('dialog', { name: 'Site menu' })).toBeVisible();
  await page.mouse.move(100, 400);
  await page.mouse.wheel(0, 900);
  await page.keyboard.press('PageDown');
  await page.keyboard.press('Space');
  await page.waitForTimeout(800);
  expect(await page.evaluate(() => Math.round(window.scrollY))).toBe(0);
});

test('the new route is never painted uncovered', async ({ page, viewport }) => {
  test.skip(!wide(viewport), 'checked on wide screens');
  await page.evaluate(() => {
    const w = window as unknown as { __frames: { h1: string; clip: string }[]; __stop: boolean };
    w.__frames = [];
    const el = document.getElementById('route-wipe')!;
    const tick = () => {
      w.__frames.push({ h1: document.querySelector('h1')?.textContent ?? '', clip: getComputedStyle(el).clipPath });
      if (!w.__stop) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  await page.evaluate(() => document.querySelector<HTMLAnchorElement>('a[href="/work/rotormind"]')!.click());
  await expect(page).toHaveURL(/\/work\/rotormind$/);
  await page.waitForTimeout(2200);
  const frames = await page.evaluate(() => { (window as unknown as { __stop: boolean }).__stop = true; return (window as unknown as { __frames: { h1: string; clip: string }[] }).__frames; });
  const first = frames.findIndex((f) => f.h1.includes('RotorMind'));
  expect(first).toBeGreaterThan(-1);
  const gone = 'polygon(0px 0px, 100% 0px, 100% 0px, 0px 0px)';
  expect(frames[first].clip).not.toBe(gone);
});

test('case studies do not use an accent-filled banner', async ({ page }) => {
  await page.goto('/work/netra-ugv');
  await expect(page.locator('main [class*="from-[#455d64]"]')).toHaveCount(0);
});
