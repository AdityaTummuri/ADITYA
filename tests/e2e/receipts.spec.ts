import { test, expect, type Page } from '@playwright/test';
import { receipts } from '@/content/receipts';
import type { QuotedReceipt } from '@/content/types';

const CORS = { 'access-control-allow-origin': '*' };
const qed = receipts['qed-a'] as QuotedReceipt;
/** A file with the quote on line 31. */
const FIXTURE = [...Array(30).fill('filler line'), qed.quote, 'after'].join('\n');

async function openSlip(page: Page) {
  await page.goto('/');
  await page.waitForSelector('html[data-slip-ready]');
  const number = page.locator('#work a[data-receipt="qed-a"]');
  await number.click();
  const slip = page.getByRole('dialog', { name: 'Results QEDCode graded A that were right' });
  await expect(slip).toBeVisible();
  return { number, slip };
}

test('a number opens its receipt with the exact quote; Escape closes it and returns focus', async ({ page }) => {
  const { number, slip } = await openSlip(page);
  await expect(slip).toContainText('86 of 89');
  await expect(slip).toContainText('QEDCode / docs/results.md');
  await expect(slip.locator('blockquote')).toHaveText(qed.quote);
  await expect(slip).toContainText('Read on 23 Nov 2026 at commit 0c97194');
  await expect(slip.getByRole('link', { name: /Open the file on GitHub/ })).toHaveAttribute('target', '_blank');
  await expect(slip.getByRole('link', { name: 'Permalink' })).toHaveAttribute('href', '/receipts#qed-a');
  await page.keyboard.press('Escape');
  await expect(slip).toBeHidden();
  await expect(number).toBeFocused();
  expect(new URL(page.url()).pathname).toBe('/');
});

test('Check it now finds the line on GitHub', async ({ page }) => {
  await page.route('https://raw.githubusercontent.com/**', (route) => route.fulfill({ status: 200, headers: CORS, contentType: 'text/plain', body: FIXTURE }));
  const { slip } = await openSlip(page);
  await slip.getByRole('button', { name: 'Check it now' }).click();
  await expect(slip.getByRole('status')).toHaveText('Found on line 31 of docs/results.md, on the main branch, just now.');
});

test('Check it now says so when GitHub does not have the line', async ({ page }) => {
  await page.route('https://raw.githubusercontent.com/**', (route) => route.fulfill({ status: 404, headers: CORS, contentType: 'text/plain', body: '404: Not Found' }));
  const { slip } = await openSlip(page);
  await slip.getByRole('button', { name: 'Check it now' }).click();
  await expect(slip.getByRole('status')).toContainText('Not found in either version.');
});

test('Check it now says so when GitHub does not answer', async ({ page }) => {
  await page.route('https://raw.githubusercontent.com/**', (route) => route.abort());
  const { slip } = await openSlip(page);
  await slip.getByRole('button', { name: 'Check it now' }).click();
  await expect(slip.getByRole('status')).toContainText('GitHub did not answer.');
});

test('the inline receipt on the start division checks too', async ({ page }) => {
  await page.route('https://raw.githubusercontent.com/**', (route) => route.fulfill({ status: 200, headers: CORS, contentType: 'text/plain', body: FIXTURE }));
  await page.goto('/');
  const body = page.locator('#start [data-receipt-scope="qed-a"]');
  await body.getByRole('button', { name: 'Check it now' }).click();
  await expect(body.getByRole('status')).toContainText('Found on line 31');
});

test('/receipts lists every receipt and Check every quoted line reports N of N', async ({ page }) => {
  const quoted = Object.values(receipts).filter((r) => r.kind === 'quoted');
  const everyQuote = quoted.map((r) => (r as QuotedReceipt).quote).join('\n');
  await page.route('https://raw.githubusercontent.com/**', (route) => route.fulfill({ status: 200, headers: CORS, contentType: 'text/plain', body: everyQuote }));
  await page.goto('/receipts');
  const ids = await page.locator('li.receipt-item').evaluateAll((els) => els.map((e) => e.id));
  expect(ids.sort()).toEqual(Object.keys(receipts).sort());
  await page.getByRole('button', { name: 'Check every quoted line' }).click();
  await expect(page.getByText(`${quoted.length} of ${quoted.length} lines found on GitHub, just now.`)).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole('button', { name: 'Check again' }).first()).toBeVisible();
});

test('Check every quoted line marks the ones that could not be found', async ({ page }) => {
  const quoted = Object.values(receipts).filter((r) => r.kind === 'quoted');
  await page.route('https://raw.githubusercontent.com/**', (route) => route.fulfill({ status: 200, headers: CORS, contentType: 'text/plain', body: 'nothing here' }));
  await page.goto('/receipts');
  await page.getByRole('button', { name: 'Check every quoted line' }).click();
  await expect(page.getByText(`0 of ${quoted.length} lines found on GitHub, just now. ${quoted.length} could not be found. They are marked below.`)).toBeVisible({ timeout: 15_000 });
  await expect(page.locator('#qed-a').getByRole('status')).toContainText('Not found in either version.');
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('a number still leads to its receipt', async ({ page }) => {
    await page.goto('/');
    await page.locator('a[data-receipt="qed-a"]').first().click();
    await expect(page).toHaveURL(/\/receipts#qed-a$/);
    await expect(page.locator('#qed-a')).toContainText('86 of 89 grade A results were right');
  });
});
