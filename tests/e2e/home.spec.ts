import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('one h1 carries the headline and the statement line is ink', async ({ page }) => {
  expect(await page.locator('h1').count()).toBe(1);
  await expect(page.locator('h1')).toContainText('I don’t trust a number');
  await expect(page.locator('h1')).toContainText('run it again.');
  const statement = page.getByText('Aditya Tummuri, engineering student and builder.');
  expect(await statement.evaluate((el) => getComputedStyle(el).color)).toBe('rgb(23, 20, 46)');
});

test('the story has its three anchored chapters', async ({ page }) => {
  const ids = await page.locator('main section[id]').evaluateAll((els) => els.map((e) => e.id));
  expect(ids).toEqual(['start', 'work', 'contact']);
});

test('work lists the four rooms', async ({ page }) => {
  const rows = page.locator('#work ol > li');
  await expect(rows).toHaveCount(4);
  const hrefs = await rows.locator('a[href^="/work/"]').evaluateAll((els) => els.map((e) => e.getAttribute('href')));
  expect(hrefs).toEqual(['/work/qedcode', '/work/fracsst-mamba', '/work/netra-ugv', '/work/kavach-upi']);
});

test('no other project link on home', async ({ page }) => {
  const hrefs = await page.locator('main a[href^="/work/"]').evaluateAll((els) => [...new Set(els.map((e) => e.getAttribute('href')))]);
  expect(hrefs).toHaveLength(4);
  // the only repository links on home belong to the open receipt
  const repoLinks = await page.locator('main a[href*="github.com/AdityaTummuri/"]').evaluateAll((els) => els.filter((e) => !e.closest('[data-receipt-scope]')).map((e) => e.getAttribute('href')));
  expect(repoLinks).toEqual([]);
});

test('the open receipt on the start division is a real, checkable receipt', async ({ page }) => {
  const body = page.locator('#start [data-receipt-scope="qed-a"]');
  await expect(body).toContainText('Results QEDCode graded A that were right');
  await expect(body).toContainText('86 of 89 grade A results were right');
  await expect(body.getByRole('button', { name: 'Check it now' })).toBeVisible();
});

test('home has no serious or critical accessibility violations', async ({ page }) => {
  const results = await new AxeBuilder({ page }).analyze();
  const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  expect(bad.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
});
