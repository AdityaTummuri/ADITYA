import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-loader]')).toHaveCount(0, { timeout: 10000 });
});

test('one h1 carries the headline; lockup uses the display scale', async ({ page, viewport }) => {
  expect(await page.locator('h1').count()).toBe(1);
  await expect(page.locator('h1')).toContainText('that dream in');
  const overline = page.locator('#hero [data-overline]').first();
  expect(await overline.evaluate((el) => getComputedStyle(el).color)).toBe('rgb(143, 170, 178)');
  const wide = (viewport?.width ?? 0) >= 768;
  expect(await overline.evaluate((el) => getComputedStyle(el).fontSize)).toBe(wide ? '61.04px' : '39.06px');
});

test('six chapters exist with the planned ids', async ({ page }) => {
  const ids = await page.locator('section[data-chapter]').evaluateAll((els) => els.map((e) => e.id));
  expect(ids).toEqual(['hero', 'transmissions', 'index', 'notes', 'now', 'contact']);
});

test('transmissions lists four featured projects linking to their case studies', async ({ page }) => {
  const cards = page.locator('#transmissions article');
  await expect(cards).toHaveCount(4);
  const hrefs = await cards.locator('a[href^="/work/"]').evaluateAll((els) => els.map((e) => e.getAttribute('href')));
  expect(hrefs).toEqual(['/work/rotormind', '/work/netra-ugv', '/work/fracsst-mamba', '/work/my-terminal']);
});

test('index lists all 20 projects under five group headings', async ({ page }) => {
  await expect(page.locator('#index [data-group]')).toHaveCount(5);
  await expect(page.locator('#index [data-row]')).toHaveCount(20);
});

test('home has no serious or critical accessibility violations', async ({ page }) => {
  const results = await new AxeBuilder({ page }).analyze();
  const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  expect(bad.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
});
