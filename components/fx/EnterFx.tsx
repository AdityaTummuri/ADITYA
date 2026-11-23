'use client';

import { useEffect, useRef } from 'react';
import { loadFx, type Word } from '@/lib/sakuga';

/**
 * On arrival at a page, one impact goes off behind its title and a word lands beside it. Put it
 * inside the element the effect should centre on. Renders nothing; skipped under reduced motion
 * (the core draws nothing then).
 */
export default function EnterFx({ word = 'don' }: { word?: Word }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let off = false;
    const t = window.setTimeout(() => {
      loadFx().then((fx) => {
        const host = ref.current?.parentElement;
        if (off || !fx || !host) return;
        const c = fx.at(host, 0.18, 0.5);
        fx.burst(c.x, c.y, { r: 62, life: 0.4 });
        fx.ticks(c.x, c.y, { n: 7, r: 54, len: 16, dir: -Math.PI / 2, fan: 1.4, life: 0.5 });
        fx.later(120, () => fx.puff(c.x + 40, c.y + 30, { size: 10, n: 4, vx: 20, vy: -10, life: 0.7 }));
        fx.sfx(word, Math.min(window.innerWidth - 90, c.x + Math.min(c.w * 0.72, 420)), c.y - 38, { size: 128, ...fx.hollow() });
      });
    }, 420);
    return () => { off = true; window.clearTimeout(t); };
  }, [word]);
  return <span ref={ref} hidden />;
}
