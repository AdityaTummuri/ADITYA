import { expect, type Page } from '@playwright/test';

/** One place the legibility test looks at: a route plus how to put the page in the state to measure. */
export interface LegibilityState {
  name: string;
  url: string;
  /** Scrolls to, or opens, what the state is about. */
  setup?: (page: Page) => Promise<void>;
}

const scrollToSelector = (selector: string) => async (page: Page) => {
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: 'instant' });
  }, selector);
};

const scrollToBottom = async (page: Page) => {
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
};

const openMenu = async (page: Page) => {
  await page.locator('button[aria-label="Menu"]').click();
  await expect(page.getByRole('dialog', { name: 'Site menu' })).toBeVisible();
};

const rooms = ['qedcode', 'fracsst-mamba', 'netra-ugv', 'kavach-upi'];

/** Pages and positions of plan 6.4. */
export const STATES: LegibilityState[] = [
  { name: 'home start', url: '/' },
  { name: 'home work', url: '/', setup: scrollToSelector('#work') },
  { name: 'home contact', url: '/', setup: scrollToSelector('#contact') },
  ...rooms.flatMap((r) => [
    { name: `${r} top`, url: `/work/${r}` },
    { name: `${r} story`, url: `/work/${r}`, setup: scrollToSelector('#story') },
  ]),
  { name: 'archive', url: '/archive' },
  { name: 'archive end', url: '/archive', setup: scrollToBottom },
  { name: 'about', url: '/about' },
  { name: 'receipts', url: '/receipts' },
  { name: 'receipts end', url: '/receipts', setup: scrollToBottom },
  { name: '404', url: '/nope' },
  { name: 'menu open', url: '/', setup: openMenu },
];

export interface Finding { text: string; ratio: number; color: string }

/**
 * Plan 6.4. Reads every visible text node in the viewport with its colour and line boxes, makes
 * all glyphs transparent, takes `frames` screenshots 300 ms apart, and returns the lowest WCAG
 * contrast of each text colour against the pixels behind its line boxes, over every frame.
 */
export async function measure(page: Page, frames: number): Promise<Finding[]> {
  const rects = await page.evaluate(() => {
    const out: { text: string; color: string; boxes: { x: number; y: number; w: number; h: number }[] }[] = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const hidden = (el: Element | null): boolean => {
      for (let e = el; e; e = e.parentElement) {
        if (e.tagName === 'NOSCRIPT' || e.tagName === 'STYLE' || e.tagName === 'SCRIPT' || e.tagName === 'svg') return true;
        if (e.getAttribute('aria-hidden') === 'true' || e.classList.contains('sr-only')) return true;
        const cs = getComputedStyle(e);
        if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return true;
      }
      return false;
    };
    // an open menu covers the right of the page; what is behind it cannot be read, so it is not measured
    const menu = document.getElementById('site-menu');
    const menuBox = menu && getComputedStyle(menu).visibility === 'visible' ? menu.getBoundingClientRect() : null;
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const node = n as Text;
      if (!node.nodeValue?.trim()) continue;
      const el = node.parentElement;
      if (!el || hidden(el)) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      const boxes = [...range.getClientRects()]
        .map((r) => ({ x: r.left - 1, y: r.top - 1, w: r.width + 2, h: r.height + 2 }))
        .filter((b) => b.w > 3 && b.h > 3 && b.x + b.w > 0 && b.y + b.h > 0 && b.x < vw && b.y < vh);
      if (!boxes.length) continue;
      if (menu && menuBox && !menu.contains(el)) {
        const c = boxes[0];
        if (c.x + c.w / 2 >= menuBox.left && c.x + c.w / 2 <= menuBox.right) continue;
      }
      out.push({ text: node.nodeValue.trim().slice(0, 48), color: getComputedStyle(el).color, boxes });
    }
    return out;
  });

  await page.addStyleTag({
    content: '*{-webkit-text-fill-color:transparent!important;text-decoration-color:transparent!important;caret-color:transparent!important}',
  });
  const shots: string[] = [];
  for (let i = 0; i < frames; i++) {
    if (i) await page.waitForTimeout(300);
    shots.push((await page.screenshot({ type: 'png' })).toString('base64'));
  }

  const result = await page.evaluate(
    async ({ rects, shots }) => {
      const lin = new Float64Array(256).map((_, i) => {
        const c = i / 255;
        return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      });
      const parse = (css: string) => {
        const m = css.match(/rgba?\(([^)]+)\)/);
        const p = (m?.[1] ?? '255,255,255').split(/[ ,/]+/).filter(Boolean).map(Number);
        return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
      };
      const minima = rects.map(() => Infinity);
      for (const b64 of shots) {
        const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
        const bmp = await createImageBitmap(new Blob([bytes], { type: 'image/png' }));
        const cv = document.createElement('canvas');
        cv.width = bmp.width;
        cv.height = bmp.height;
        const ctx = cv.getContext('2d', { willReadFrequently: true })!;
        ctx.drawImage(bmp, 0, 0);
        const k = bmp.width / window.innerWidth;
        rects.forEach((t, ti) => {
          const col = parse(t.color);
          for (const box of t.boxes) {
            const x0 = Math.max(0, Math.floor(box.x * k));
            const y0 = Math.max(0, Math.floor(box.y * k));
            const x1 = Math.min(bmp.width, Math.ceil((box.x + box.w) * k));
            const y1 = Math.min(bmp.height, Math.ceil((box.y + box.h) * k));
            if (x1 <= x0 || y1 <= y0) continue;
            const data = ctx.getImageData(x0, y0, x1 - x0, y1 - y0).data;
            for (let i = 0; i < data.length; i += 4) {
              const pr = data[i], pg = data[i + 1], pb = data[i + 2];
              const r = col.a * col.r + (1 - col.a) * pr;
              const g = col.a * col.g + (1 - col.a) * pg;
              const bl = col.a * col.b + (1 - col.a) * pb;
              const lt = 0.2126 * lin[Math.round(r)] + 0.7152 * lin[Math.round(g)] + 0.0722 * lin[Math.round(bl)];
              const lp = 0.2126 * lin[pr] + 0.7152 * lin[pg] + 0.0722 * lin[pb];
              const ratio = (Math.max(lt, lp) + 0.05) / (Math.min(lt, lp) + 0.05);
              if (ratio < minima[ti]) minima[ti] = ratio;
            }
          }
        });
      }
      return rects.map((t, i) => ({ text: t.text, color: t.color, ratio: minima[i] }));
    },
    { rects, shots },
  );
  return result.filter((r) => Number.isFinite(r.ratio));
}

/** Waits for fonts and, when asked, for the scene to be drawing; then lets the entrance finish. */
export async function settle(page: Page, webgl: boolean, minFrames = 10) {
  await page.evaluate(() => document.fonts.ready);
  if (webgl) await page.waitForFunction((min) => ((window as Window & { __sceneFrames?: number }).__sceneFrames ?? 0) >= min, minFrames, { timeout: 30_000 });
  await page.waitForTimeout(1600);
}

export function report(route: string, findings: Finding[]): string[] {
  return findings.filter((f) => f.ratio < 4.5).map((f) => `${route}: "${f.text}" ${f.color} ${f.ratio.toFixed(2)}:1`);
}
