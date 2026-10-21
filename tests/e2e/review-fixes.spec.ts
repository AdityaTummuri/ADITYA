import { test, expect } from '@playwright/test';

const wide = (v?: { width: number } | null) => (v?.width ?? 0) >= 768;

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-loader]')).toHaveCount(0, { timeout: 10000 });
});

test('a menu anchor click scrolls the home to that chapter (synthetic click, Lenis stopped by the menu)', async ({ page, viewport }) => {
  test.skip(!wide(viewport), 'pinned chapters are wide-screen');
  await page.locator('button[aria-label="Menu"]').click();
  await page.getByRole('dialog', { name: 'Site menu' }).getByRole('link', { name: 'Index' }).evaluate((el: HTMLElement) => el.click());
  await expect.poll(() => page.locator('section#index').evaluate((el) => Math.round(el.getBoundingClientRect().top)), { timeout: 6000 }).toBeLessThanOrEqual(1);
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

test('chapter headings and CTAs stay in the accessibility tree and Tab reaches them', async ({ page, viewport }) => {
  test.skip(!wide(viewport), 'pinned layers are wide-screen');
  await expect(page.getByRole('heading', { name: /that dream in/ })).toHaveCount(1);
  await page.evaluate(() => window.scrollTo(0, 1500));
  await page.waitForTimeout(700);
  // mid-chapter the lockup has faded out, but the heading must remain exposed
  await expect(page.getByRole('heading', { name: /that dream in/ })).toHaveCount(1);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  let reached = false;
  for (let i = 0; i < 40 && !reached; i++) {
    await page.keyboard.press('Tab');
    reached = await page.evaluate(() => document.activeElement?.getAttribute('href') === '#transmissions');
  }
  expect(reached).toBe(true);
  // focusing a layer that is not yet revealed brings its sub-state into view
  await expect.poll(() => page.evaluate(() => Math.round(window.scrollY)), { timeout: 4000 }).toBeGreaterThan(1000);
  await expect.poll(() => page.locator('#hero [data-layer="cta"]').evaluate((el) => +getComputedStyle(el).opacity), { timeout: 4000 }).toBeGreaterThan(0.9);
});

for (const size of [{ width: 1366, height: 768 }, { width: 1280, height: 720 }]) {
  test(`transmissions cards keep arrows, dots and link inside the pinned layer at ${size.width}x${size.height}`, async ({ page, viewport }) => {
    test.skip(!wide(viewport), 'pinned layers are wide-screen');
    await page.setViewportSize(size);
    await page.waitForTimeout(600);
    const top = await page.locator('#transmissions').evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
    await page.evaluate((y) => window.scrollTo(0, y), top + 0.95 * 3 * size.height);
    await page.waitForTimeout(1200);
    for (let i = 0; i < 4; i++) {
      const fits = await page.evaluate(() => {
        const layer = document.querySelector('#transmissions [data-layer="body"]')!.getBoundingClientRect();
        const pick = (sel: string) => document.querySelector(sel)!.getBoundingClientRect();
        const next = pick('#transmissions button[aria-label="Next card"]');
        const dots = [...document.querySelectorAll('#transmissions button[aria-label^="Go to card"]')].map((d) => d.getBoundingClientRect());
        const slides = [...document.querySelectorAll('#transmissions [aria-roledescription="slide"]')];
        const cur = slides.find((s) => { const r = s.getBoundingClientRect(); const c = r.left + r.width / 2; return c > layer.left && c < layer.right; });
        const link = cur?.querySelector('a')?.getBoundingClientRect();
        const inside = (r?: DOMRect) => !!r && r.top >= layer.top - 1 && r.bottom <= layer.bottom + 1;
        return { next: inside(next), dots: dots.every(inside), link: inside(link) };
      });
      expect(fits).toEqual({ next: true, dots: true, link: true });
      if (i < 3) {
        await page.locator('#transmissions button[aria-label="Next card"]').click();
        await page.waitForTimeout(500);
      }
    }
  });
}

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
