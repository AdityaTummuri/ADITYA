'use client';

import { useEffect, useState } from 'react';

export interface RailItem { id: string; label: string }

/**
 * The division rail: text links on the right edge, wide screens with a fine pointer only. The one
 * whose division holds the middle of the screen is marked with aria-current.
 */
export default function DivisionRail({ items }: { items: RailItem[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const mid = window.innerHeight * 0.45;
      let current = items[0]?.id;
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.getBoundingClientRect().top <= mid) current = it.id;
      }
      setActive(current);
    };
    const on = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, [items]);

  return (
    <nav
      aria-label="On this page"
      className="quiet fixed right-[2.4rem] top-1/2 z-30 hidden -translate-y-1/2 [--qx:1.6rem] [--qy:1.6rem] [@media(min-width:1280px)_and_(pointer:fine)]:block"
    >
      <ul className="grid gap-xxs">
        {items.map((it) => {
          const on = it.id === active;
          return (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                aria-current={on ? 'location' : undefined}
                className={`press flex min-h-[3.2rem] items-center justify-end font-cond text-meta ${on ? 'text-primary' : 'text-ink-muted hover:text-ink'}`}
              >
                <span className={on ? 'border-b border-primary' : 'border-b border-transparent'}>{it.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
