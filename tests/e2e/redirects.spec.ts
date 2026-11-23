import { test, expect } from '@playwright/test';

const MOVED: [string, string][] = [
  ['/work', '/#work'],
  ['/work/rotormind', '/archive#removed'],
  ['/work/lumina', '/archive#removed'],
  ['/work/the-palesignal', '/archive#removed'],
  ['/work/vocal-biomarker-edge', '/archive#vocal-biomarker-edge'],
  ['/work/my-terminal', '/archive#omen-terminal'],
  ['/work/hp-omen-fan-control', '/archive#hp-omen-fan-control'],
  ['/work/ghostos-x', '/archive#ghostos-x'],
  ['/work/trapsight', '/archive#trapsight'],
];

for (const [source, destination] of MOVED) {
  test(`${source} moves permanently to ${destination}`, async ({ request, page }) => {
    const res = await request.get(source, { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers()['location']).toBe(destination);
    const followed = await page.goto(source);
    expect(followed?.status()).toBe(200);
    const hash = destination.split('#')[1];
    await expect(page.locator(`#${hash}`)).toHaveCount(1);
  });
}

test('the archive has the elements the redirects point at', async ({ page }) => {
  await page.goto('/archive#omen-terminal');
  await expect(page.locator('#omen-terminal')).toHaveCount(1);
  await expect(page.locator('#removed')).toContainText('Some projects that used to be listed here are gone');
});
