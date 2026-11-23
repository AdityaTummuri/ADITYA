'use client';

import { useEffect } from 'react';
import { loadFx, WORDS, type SakugaFX, type Word } from '@/lib/sakuga';

/**
 * Wires the Sakuga effects to the page by attributes, so server components stay plain HTML:
 *   data-fx="hit"   a click throws an impact, wedges, smoke and a lettered word (data-word)
 *   data-fx="soft"  a click throws a small puff and wedges
 *   data-fx="peek"  a mouse arriving throws a glint (once a second at most)
 *   data-fx-stage   a click on empty space inside throws a burst and a random word
 *   data-fx-land    the first time it is on screen a word lands beside it (data-word)
 * Nothing the visitor needs depends on an effect, and the core draws none under reduced motion.
 */
const INTERACTIVE = 'a, button, input, select, textarea, summary, [role=button], [data-receipt]';

const near = (el: Element) => (el.closest('[data-fx]') as HTMLElement | null);

function hit(fx: SakugaFX, el: HTMLElement) {
  const c = fx.at(el, 0.5, 0.5);
  const r = Math.min(70, Math.max(34, c.w * 0.28));
  const word = (el.dataset.word as Word) || 'don';
  fx.burst(c.x, c.y, { r, life: 0.36 });
  fx.ticks(c.x, c.y, { n: 6, r: r * 0.8, len: 14, dir: -Math.PI / 2, fan: 0.9, life: 0.5 });
  fx.later(110, () => {
    fx.puff(c.x - c.w * 0.42, c.y + c.h * 0.3, { size: 9, n: 4, vx: -22, vy: -12, life: 0.7 });
    fx.puff(c.x + c.w * 0.42, c.y + c.h * 0.3, { size: 9, n: 4, vx: 22, vy: -12, life: 0.7 });
  });
  const cap = Math.min(window.innerWidth - 60, c.x + c.w * 0.5 + 40);
  fx.sfx(word, Math.max(70, Math.min(cap, c.x + c.w * 0.38)), c.y - c.h * 0.7 - 20, { size: 110, ...fx.hollow() });
}

function soft(fx: SakugaFX, el: HTMLElement) {
  const c = fx.at(el, 0.5, 0.5);
  fx.puff(c.x, c.y, { size: 10, n: 4, life: 0.5 });
  fx.ticks(c.x, c.y, { n: 4, r: Math.min(40, c.w * 0.3), len: 10, dir: -Math.PI / 2, fan: 1.2, life: 0.4 });
}

function stage(fx: SakugaFX, x: number, y: number) {
  const word = WORDS[Math.floor(fx.rnd(WORDS.length))];
  fx.burst(x, y, { r: fx.rnd(34, 58), life: 0.34 });
  fx.ticks(x, y, { n: 5, r: 36, len: 12, dir: fx.rnd(-2.4, -0.7), fan: 1.1, life: 0.45 });
  fx.later(90, () => fx.puff(x + fx.rnd(-30, 30), y + 16, { size: 8, n: 3, vy: -10, life: 0.6 }));
  fx.sfx(word, Math.min(window.innerWidth + scrollX - 80, x + 54), y - 56, { size: 92, ...(Math.random() > 0.5 ? fx.hollow() : fx.dotted()) });
}

export default function FxRuntime() {
  useEffect(() => {
    let fx: SakugaFX | null = null;
    let off = false;
    const lastPeek = new WeakMap<Element, number>();
    const fine = matchMedia('(hover: hover) and (pointer: fine)');

    const onClick = (e: MouseEvent) => {
      if (!fx || e.defaultPrevented && !(e.target as Element)?.closest?.('[data-fx]')) return;
      const t = e.target as Element;
      const el = near(t);
      if (el) {
        if (el.dataset.fx === 'hit') hit(fx, el);
        else if (el.dataset.fx === 'soft') soft(fx, el);
        return;
      }
      const st = t.closest('[data-fx-stage]');
      if (st && !t.closest(INTERACTIVE) && !getSelection()?.toString()) stage(fx, e.pageX, e.pageY);
    };
    const onEnter = (e: PointerEvent) => {
      if (!fx || e.pointerType !== 'mouse' || !fine.matches) return;
      const el = (e.target as Element).closest?.('[data-fx="peek"]');
      if (!el) return;
      const from = e.relatedTarget as Node | null;
      if (from && el.contains(from)) return;
      const now = performance.now();
      if (now - (lastPeek.get(el) ?? -9999) < 1000) return;
      lastPeek.set(el, now);
      const c = fx.at(el, 0.94, 0.14);
      fx.kira(c.x, c.y, { r: 11 });
      fx.ticks(c.x, c.y, { n: 3, r: 12, len: 8, dir: -0.9, fan: 0.6, life: 0.35 });
    };

    let io: IntersectionObserver | null = null;
    let raf = 0;
    const watch = () => {
      raf = 0;
      if (!fx) return;
      io ??= new IntersectionObserver((entries) => {
        for (const en of entries) {
          if (!en.isIntersecting || !fx) continue;
          const el = en.target as HTMLElement;
          io?.unobserve(el);
          el.dataset.landed = '1';
          const c = fx.at(el, 0.5, 0.5);
          const word = (el.dataset.word as Word) || 'zuza';
          fx.puff(c.x - c.w * 0.5, c.y + c.h * 0.4, { size: 10, n: 4, vx: -14, vy: -8, life: 0.7 });
          fx.sfx(word, Math.min(window.innerWidth - 70, c.x + Math.min(c.w * 0.5, 260)), c.y - c.h * 0.35, { size: 96, ...fx.hollow() });
        }
      }, { threshold: 0.9 });
      document.querySelectorAll('[data-fx-land]:not([data-landed])').forEach((el) => io!.observe(el));
    };
    // pages are swapped client-side, so look again when the DOM changes (once a frame at most)
    const mo = new MutationObserver(() => { if (!raf) raf = requestAnimationFrame(watch); });

    loadFx().then((f) => {
      if (off || !f) return;
      fx = f;
      watch();
      mo.observe(document.body, { childList: true, subtree: true });
    });
    document.addEventListener('click', onClick);
    document.addEventListener('pointerover', onEnter);
    return () => {
      off = true;
      cancelAnimationFrame(raf);
      io?.disconnect();
      mo.disconnect();
      document.removeEventListener('click', onClick);
      document.removeEventListener('pointerover', onEnter);
    };
  }, []);
  return null;
}
