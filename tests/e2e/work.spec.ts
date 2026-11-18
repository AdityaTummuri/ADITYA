import { readdirSync } from 'node:fs';
import { test, expect } from '@playwright/test';

test('RotorMind case study shows its facts', async ({ page }) => {
  await page.goto('/work/rotormind');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveText('RotorMind / MotorSafe');
  await expect(page.getByText('Prototype', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('3×', { exact: true })).toBeVisible();
  await expect(page.getByText('faster anomaly detection vs. threshold-only baseline')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'The choice that shaped it' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What got in the way' })).toBeVisible();
  await expect(page.getByText('Can a motor tell you it’s unwell before it fails?')).toBeVisible();
  // RotorMind has no repository, so no repository button
  await expect(page.getByRole('link', { name: /repository/i })).toHaveCount(0);
  const prev = page.getByRole('link', { name: /^Previous/ });
  const next = page.getByRole('link', { name: /^Next/ });
  await expect(prev).toHaveAttribute('href', '/work/vocal-biomarker-edge');
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

test('every case study is prerendered at build time', async () => {
  const work = readdirSync('.next/server/app/work').filter((f) => f.endsWith('.html'));
  expect(work).toHaveLength(11);
});
