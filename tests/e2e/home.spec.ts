import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('one h1 carries the headline; lockup uses the display scale', async ({ page, viewport }) => {
  expect(await page.locator('h1').count()).toBe(1);
  await expect(page.locator('h1')).toContainText('listen first');
  const overline = page.locator('#hero [data-overline]').first();
  await expect(overline).toHaveText('AdityaTummuri');
  expect(await overline.evaluate((el) => getComputedStyle(el).color)).toBe('rgb(143, 170, 178)');
  const wide = (viewport?.width ?? 0) >= 768;
  expect(await overline.evaluate((el) => getComputedStyle(el).fontSize)).toBe(wide ? '61.04px' : '39.06px');
});

test('four sections exist with the planned ids', async ({ page }) => {
  const ids = await page.locator('section[data-chapter]').evaluateAll((els) => els.map((e) => e.id));
  expect(ids).toEqual(['hero', 'work', 'about', 'contact']);
});

test('work lists four featured projects linking to their case studies', async ({ page }) => {
  const cards = page.locator('#work article');
  await expect(cards).toHaveCount(4);
  const hrefs = await cards.locator('a[href^="/work/"]').evaluateAll((els) => els.map((e) => e.getAttribute('href')));
  expect(hrefs).toEqual(['/work/rotormind', '/work/netra-ugv', '/work/fracsst-mamba', '/work/vocal-biomarker-edge']);
});

test('work lists the other sixteen projects under the four flagships', async ({ page }) => {
  await expect(page.locator('#work ul li')).toHaveCount(16);
});

test('home has no serious or critical accessibility violations', async ({ page }) => {
  const results = await new AxeBuilder({ page }).analyze();
  const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  expect(bad.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
});
