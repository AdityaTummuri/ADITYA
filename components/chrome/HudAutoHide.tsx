'use client';

import { useEffect, useRef } from 'react';
import { useScrollStore } from '@/lib/scroll-store';

/**
 * Fades its fixed children out once the page has left the hero (they would lie on the flowing
 * sections) and over the site footer, and back in on the hero. While hidden it is inert, so its
 * invisible links can't be clicked, hovered or tabbed to over the content beneath.
 */
export default function HudAutoHide({ children }: { children: React.ReactNode }) {
  const el = useRef<HTMLDivElement>(null);
  const state = useRef({ flow: useScrollStore.getState().chapter > 0, footer: false, hidden: false });

  useEffect(() => {
    const apply = () => {
      const node = el.current;
      const hidden = state.current.flow || state.current.footer;
      if (!node || hidden === state.current.hidden) return;
      state.current.hidden = hidden;
      node.style.opacity = hidden ? '0' : '1';
      node.inert = hidden;
    };
    state.current.hidden = false;
    apply();
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
