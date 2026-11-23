import AxeBuilder from '@axe-core/playwright';
import { test, expect, type Locator } from '@playwright/test';
import { candidates } from '@/content/exhibits';
import { CLASSES, cellSentence } from '@/lib/matrix';

test('QedLadder: the arrow keys walk the four candidates and their verdicts', async ({ page }) => {
  await page.goto('/work/qedcode');
  const radios = page.getByRole('radio');
  await expect(radios).toHaveCount(4);
  const verdict = page.locator('#exhibit [role="status"]');
  // the server default is the candidate that fooled it
  await expect(verdict).toContainText('Grade A, proven, and wrong.');
  await page.getByText('Keeps existing dashes', { exact: true }).click();
  await expect(verdict).toContainText('Grade A, proven.');
  for (let i = 1; i < 4; i++) {
    await page.keyboard.press('ArrowDown');
    await expect(verdict).toContainText(candidates[i].verdict);
    await expect(radios.nth(i)).toBeChecked();
  }
  const withState = (word: string) => page.locator('#exhibit ol li').filter({ has: page.getByText(word, { exact: true }) });
  await expect(withState('not run')).toHaveCount(1);
  await page.keyboard.press('ArrowUp');
  await expect(verdict).toContainText('Rejected at scope.');
  await expect(withState('failed')).toHaveCount(1);
  await expect(withState('not run')).toHaveCount(5);
});

test('QedLadder: a mouse click picks a candidate too', async ({ page }) => {
  await page.goto('/work/qedcode');
  await page.getByText('Brings no test', { exact: true }).click();
  await expect(page.locator('#exhibit [role="status"]')).toContainText('Grade B, tested.');
});

test('ConfusionMatrix: arrow keys move focus and Enter shows the sentence for every cell', async ({ page }) => {
  await page.goto('/work/fracsst-mamba');
  const cells = page.locator('#exhibit table button');
  await expect(cells).toHaveCount(9);
  const status = page.locator('#exhibit [role="status"]');
  await expect(status).toHaveText(cellSentence(2, 1));
  await cells.nth(0).focus();
  await page.keyboard.press('ArrowRight');
  await expect(cells.nth(1)).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(cells.nth(4)).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(cells.nth(3)).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(cells.nth(0)).toBeFocused();
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      await cells.nth(r * 3 + c).focus();
      await page.keyboard.press('Enter');
      await expect(status).toHaveText(cellSentence(r, c));
      await expect(cells.nth(r * 3 + c)).toHaveAttribute('aria-pressed', 'true');
    }
  }
  await expect(page.locator('#exhibit th[scope="col"]').filter({ hasText: CLASSES[0] })).toHaveCount(1);
});

test('TerrainSlider: arrow keys, Home and End move the handle', async ({ page }) => {
  await page.goto('/work/netra-ugv');
  const slider = page.getByRole('slider', { name: 'Show more of the camera frame' });
  await expect(slider).toHaveAttribute('aria-valuetext', '50 percent camera frame');
  await slider.focus();
  await page.keyboard.press('ArrowRight');
  await expect(slider).toHaveAttribute('aria-valuetext', '51 percent camera frame');
  await page.keyboard.press('Home');
  await expect(slider).toHaveAttribute('aria-valuetext', '0 percent camera frame');
  await page.keyboard.press('End');
  await expect(slider).toHaveAttribute('aria-valuetext', '100 percent camera frame');
  const x = await page.locator('#exhibit figure').evaluate((el) => (el as HTMLElement).style.getPropertyValue('--x'));
  expect(x).toBe('100%');
});

/** The status line as a sighted visitor reads it (the hidden ", see the receipt" of each number removed). */
const said = (status: Locator) => async () => (await status.innerText()).replace(/, see the receipt/g, '').replace(/\s+/g, ' ').replace(/ ([.,])/g, '$1').trim();

test('KavachSwitches: the shield follows the rule and the real timings', async ({ page }) => {
  await page.clock.install({ time: 0 });
  await page.goto('/work/kavach-upi');
  await page.clock.pauseAt(2000);
  const upi = page.getByRole('switch', { name: 'A payment app is open' });
  const share = page.getByRole('switch', { name: 'The screen is being shared' });
  const status = page.locator('#exhibit [role="status"]');
  await expect.poll(said(status)).toBe('Idle. It checks every 3,000 ms.');

  await upi.click();
  await expect.poll(said(status)).toBe('Payment open, nothing shared. It checks every 1,000 ms.');
  await share.click();
  // sharing changes nothing until the next check
  await expect.poll(said(status)).toBe('Payment open, nothing shared. It checks every 1,000 ms.');
  await page.clock.runFor(1000);
  await expect.poll(said(status)).toBe('Shield up. Touches are blocked.');
  await expect(page.getByText('Attention! Kavach security shield is active.', { exact: false }).first()).toBeVisible();
  await expect(page.locator('#exhibit [lang="hi"]')).toBeVisible();

  await share.click();
  await page.clock.runFor(1000);
  await expect.poll(said(status)).toBe('Sharing stopped. Clean check 1 of 2, the shield stays up.');
  await page.clock.runFor(1000);
  await expect.poll(said(status)).toBe('Two clean checks. The shield drops.');
  await expect(page.locator('#exhibit [lang="hi"]')).toHaveCount(0);

  await share.click();
  await page.clock.runFor(1000);
  await expect.poll(said(status)).toBe('Shield up. Touches are blocked.');
  await upi.click();
  await expect.poll(said(status)).toBe('Payment closed. The shield drops at once.');
  await share.click();
  await expect.poll(said(status)).toBe('Idle. It checks every 3,000 ms.');
  await share.click();
  await expect.poll(said(status)).toBe('Screen shared, no payment open. Nothing is blocked.');
});

for (const route of ['/work/qedcode', '/work/fracsst-mamba', '/work/netra-ugv', '/work/kavach-upi', '/archive', '/about', '/receipts']) {
  test(`${route} has no serious or critical accessibility violations`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(bad.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([]);
  });
}
