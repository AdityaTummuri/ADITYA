'use client';

import { useEffect, useRef } from 'react';
import { useScrollStore } from '@/lib/scroll-store';

/**
 * Fades its fixed children out once the page has left the hero (they would lie on the flowing
 * sections) and over the site footer, and back in on the hero.
 */
export default function HudAutoHide({ children }: { children: React.ReactNode }) {
  const el = useRef<HTMLDivElement>(null);
  const state = useRef({ flow: false, footer: false });

  useEffect(() => {
    const apply = () => {
      if (el.current) el.current.style.opacity = state.current.flow || state.current.footer ? '0' : '1';
    };
    const unsub = useScrollStore.subscribe((s) => {
      const flow = s.chapter > 0;
      if (flow !== state.current.flow) {
        state.current.flow = flow;
        apply();
      }
    });
    const footer = document.querySelector('footer');
    let io: IntersectionObserver | undefined;
    if (footer) {
      io = new IntersectionObserver(([e]) => {
        state.current.footer = e.isIntersecting;
        apply();
      });
      io.observe(footer);
    }
    return () => {
      unsub();
      io?.disconnect();
    };
  }, []);

  return (
    <div ref={el} data-hud className="transition-opacity duration-300 ease-out-cubic" style={{ opacity: 1 }}>
      {children}
    </div>
  );
}
