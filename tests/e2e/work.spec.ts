import { readdirSync } from 'node:fs';
import { test, expect } from '@playwright/test';

test('RotorMind case study shows its facts', async ({ page }) => {
  await page.goto('/work/rotormind');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveText('RotorMind / MotorSafe');
  await expect(page.getByText('Prototype', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('3×', { exact: true })).toBeVisible();
  await expect(page.getByText('faster anomaly detection vs. threshold-only baseline')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Architecture trade-off' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Engineering footnote' })).toBeVisible();
  await expect(page.getByText('Can a motor tell you it’s unwell before it fails?')).toBeVisible();
  // RotorMind has no repository, so no repository button
  await expect(page.getByRole('link', { name: /repository/i })).toHaveCount(0);
  const prev = page.getByRole('link', { name: /^Previous/ });
  const next = page.getByRole('link', { name: /^Next/ });
  await expect(prev).toHaveAttribute('href', '/work/my-terminal');
  await expect(next).toHaveAttribute('href', '/work/netra-ugv');
});

test('a case study with a repository links to it', async ({ page }) => {
  await page.goto('/work/netra-ugv');
  await expect(page.getByRole('link', { name: /repository/i }).first()).toHaveAttribute('href', 'https://github.com/AdityaTummuri/Netra-UGV');
});

test('unknown slugs are 404', async ({ page }) => {
  const res = await page.goto('/work/does-not-exist');
  expect(res?.status()).toBe(404);
});

test('a note renders its quote and related work', async ({ page }) => {
  await page.goto('/notes/features-before-models');
  await expect(page.locator('h1')).toHaveText('Features before models');
  await expect(page.getByText(/most of the leverage came from how the signal was framed/)).toBeVisible();
  await expect(page.getByRole('link', { name: /FracSST-Mamba/ }).first()).toBeVisible();
});

test('every case study and note is prerendered at build time', async () => {
  const work = readdirSync('.next/server/app/work').filter((f) => f.endsWith('.html'));
  const notes = readdirSync('.next/server/app/notes').filter((f) => f.endsWith('.html'));
  expect(work).toHaveLength(11);
  expect(notes).toHaveLength(3);
});

test('navigating between routes plays the diagonal wipe', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-loader]')).toHaveCount(0, { timeout: 10000 });
  await page.evaluate(() => {
    const el = document.getElementById('route-wipe')!;
    (window as unknown as { __wipeStates: string[] }).__wipeStates = [];
    new MutationObserver(() => (window as unknown as { __wipeStates: string[] }).__wipeStates.push(el.dataset.wipe ?? '')).observe(el, { attributes: true, attributeFilter: ['data-wipe'] });
  });
  await page.evaluate(() => document.querySelector<HTMLAnchorElement>('a[href="/work/rotormind"]')!.click());
  await expect(page).toHaveURL(/\/work\/rotormind$/);
  await expect.poll(() => page.evaluate(() => (window as unknown as { __wipeStates: string[] }).__wipeStates.join(','))).toContain('running');
  await expect.poll(() => page.locator('#route-wipe').getAttribute('data-wipe'), { timeout: 5000 }).toBe('idle');
});
