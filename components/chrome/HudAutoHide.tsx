'use client';

import { useEffect, useRef } from 'react';
import { useScrollStore } from '@/lib/scroll-store';

/**
 * Fades its fixed children out while the page is over flowing content (a pinned chapter that has
 * finished and has a flow body below it) or the site footer, and back in during pinned stages.
 */
export default function HudAutoHide({ children }: { children: React.ReactNode }) {
  const el = useRef<HTMLDivElement>(null);
  const state = useRef({ flow: false, footer: false });

  useEffect(() => {
    const apply = () => {
      if (el.current) el.current.style.opacity = state.current.flow || state.current.footer ? '0' : '1';
    };
    const unsub = useScrollStore.subscribe((s) => {
      const flow = s.chapter >= 2 && s.progress >= 0.995;
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
