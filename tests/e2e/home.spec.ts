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

test('the RotorMind row expands to show its trade-off and footnote', async ({ page }) => {
  const row = page.locator('#index [data-row]').filter({ hasText: 'RotorMind' }).first();
  const toggle = row.getByRole('button', { name: /RotorMind/ });
  // revealed rows stay hidden until scrolled to, so scroll the flow body first
  await page.locator('#index [data-flow]').evaluate((el) => el.scrollIntoView());
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(row.getByText(/running baseline correction/)).toBeVisible();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(row.getByText(/running baseline correction/)).toBeHidden();
});

test('the transmissions slider advances its current dot', async ({ page, viewport }) => {
  const vh = viewport!.height;
  if ((viewport?.width ?? 0) >= 768) {
    // body layer is a pinned layer: scroll until it has faded in (transmissions body label ~0.72)
    const top = await page.locator('#transmissions').evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
    await page.evaluate((y) => window.scrollTo(0, y), top + 0.9 * 3 * vh);
    await page.waitForTimeout(1200);
  } else {
    await page.locator('#transmissions').scrollIntoViewIfNeeded();
  }
  const dots = page.locator('#transmissions button[aria-label^="Go to card"]');
  await expect(dots.nth(0)).toHaveAttribute('aria-current', 'true');
  await page.locator('#transmissions button[aria-label="Next card"]').click();
  await expect(dots.nth(1)).toHaveAttribute('aria-current', 'true');
  await expect(dots.nth(0)).not.toHaveAttribute('aria-current', 'true');
});

test('contact links and Now numbers are real', async ({ page }) => {
  await expect(page.locator('#contact a[href="mailto:adityafrom2007@gmail.com"]').first()).toBeAttached();
  const now = page.locator('#now');
  for (const v of ['20', '41', '7', '39.7%']) {
    await expect(now.getByText(v, { exact: true }).first()).toBeAttached();
  }
});

test('flow bodies reveal as they scroll into view and end fully visible', async ({ page }) => {
  const first = page.locator('#index [data-reveal]').first();
  await page.locator('#index [data-flow]').evaluate((el) => el.scrollIntoView());
  await expect.poll(() => first.evaluate((el) => +getComputedStyle(el).opacity), { timeout: 5000 }).toBe(1);
});
