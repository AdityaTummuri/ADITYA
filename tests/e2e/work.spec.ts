import { readdirSync } from 'node:fs';
import { test, expect } from '@playwright/test';

test('the QEDCode room shows its facts', async ({ page }) => {
  await page.goto('/work/qedcode');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveText('QEDCode');
  await expect(page.getByRole('link', { name: 'Back to the work' })).toHaveAttribute('href', '/#work');
  await expect(page.getByRole('heading', { name: 'The task that fooled it' })).toBeVisible();
  for (const h of ['Why a grade', 'What the runs showed', 'What got in the way', 'What it can’t claim']) await expect(page.getByRole('heading', { name: h })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Open QEDCode on GitHub' })).toHaveAttribute('href', 'https://github.com/AdityaTummuri/QEDCode');
  await expect(page.getByRole('link', { name: /^Previous room/ })).toHaveAttribute('href', '/work/kavach-upi');
  await expect(page.getByRole('link', { name: /^Next room/ })).toHaveAttribute('href', '/work/fracsst-mamba');
});

test('the NETRA-UGV room links the repository, the team dashboard and the fork it came from', async ({ page }) => {
  await page.goto('/work/netra-ugv');
  await expect(page.getByRole('link', { name: 'Open NETRA-UGV on GitHub' })).toHaveAttribute('href', 'https://github.com/AdityaTummuri/Netra-UGV');
  await expect(page.getByRole('link', { name: 'The team’s live dashboard' })).toHaveAttribute('href', 'https://netraugv.vercel.app');
  await expect(page.getByRole('link', { name: 'Lochan-B-07/Netra-UGV' })).toHaveAttribute('href', 'https://github.com/Lochan-B-07/Netra-UGV');
  await expect(page.locator('main img')).toHaveCount(2);
});

test('rooms follow the fixed cycle', async ({ page }) => {
  await page.goto('/work/kavach-upi');
  await expect(page.getByRole('link', { name: /^Next room/ })).toHaveAttribute('href', '/work/qedcode');
  await expect(page.getByRole('link', { name: /^Previous room/ })).toHaveAttribute('href', '/work/netra-ugv');
});

test('unknown slugs are 404', async ({ page }) => {
  const res = await page.goto('/work/does-not-exist');
  expect(res?.status()).toBe(404);
});

test('exactly four rooms are prerendered at build time', async () => {
  const work = readdirSync('.next/server/app/work').filter((f) => f.endsWith('.html'));
  expect(work).toHaveLength(4);
});
