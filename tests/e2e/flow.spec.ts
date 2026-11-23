import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('chapters flow in the document and none overlap', async ({ page }) => {
  const boxes = await page.locator('main > div > section, main > section').evaluateAll((els) =>
    els.map((e) => ({ t: e.getBoundingClientRect().top + window.scrollY, b: e.getBoundingClientRect().bottom + window.scrollY })),
  );
  expect(boxes.length).toBeGreaterThanOrEqual(4);
  for (let i = 1; i < boxes.length; i++) expect(boxes[i].t).toBeGreaterThanOrEqual(boxes[i - 1].b - 1);
});

test('the hero fills the first screen on its own', async ({ page, viewport }) => {
  const h = await page.locator('section#start').evaluate((el) => Math.round(el.getBoundingClientRect().height));
  expect(h).toBeGreaterThanOrEqual(viewport!.height - 2);
});

test('a hash lands the chapter just under the header', async ({ page }) => {
  await page.goto('/#work');
  await expect
    .poll(() => page.locator('section#work').evaluate((el) => Math.round(el.getBoundingClientRect().top)), { timeout: 5000 })
    .toBeLessThanOrEqual(100);
});

test('the hero button reaches the work chapter', async ({ page }) => {
  await page.getByRole('link', { name: 'See the four projects' }).evaluate((el: HTMLElement) => el.click());
  await expect.poll(() => page.locator('section#work').evaluate((el) => Math.round(el.getBoundingClientRect().top)), { timeout: 6000 }).toBeLessThanOrEqual(100);
});

test('reduced motion: nothing is hidden', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('#work ol li').first()).toBeVisible();
});

test('Tab order starts skip link, wordmark, menu button', async ({ page }) => {
  const names: string[] = [];
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('Tab');
    names.push(await page.evaluate(() => { const a = document.activeElement as HTMLElement; return (a.getAttribute('aria-label') || a.textContent || '').trim(); }));
  }
  expect(names).toEqual(['Skip to content', 'Aditya Tummuri', 'Menu']);
});

test('the side-quest strip links every archive project and its copy is hidden from readers', async ({ page }) => {
  const live = await page.locator('.marquee-track > li:not([aria-hidden])').count();
  const copies = await page.locator('.marquee-track > li[aria-hidden="true"]').count();
  expect(live).toBe(23);
  expect(copies).toBe(23);
});
