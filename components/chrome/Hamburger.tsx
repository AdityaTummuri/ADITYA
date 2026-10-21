'use client';

import { forwardRef } from 'react';
import { useUi } from '@/lib/ui-store';

/** 44x44 hit area, two 28x2 lines that cross into an X (DESIGN.md `hamburger`). */
const Hamburger = forwardRef<HTMLButtonElement>(function Hamburger(_, ref) {
  const open = useUi((s) => s.menuOpen);
  const setOpen = useUi((s) => s.setMenuOpen);
  const line =
    'absolute left-1/2 top-1/2 -ml-[1.4rem] h-[0.2rem] w-[2.8rem] bg-ink transition-transform duration-300 ease-out-cubic';
  return (
    <button
      ref={ref}
      type="button"
      aria-label="Menu"
      aria-expanded={open}
      aria-controls="site-menu"
      onClick={() => setOpen(!open)}
      className="fixed right-[var(--margin)] top-[2.4rem] z-[60] h-[4.4rem] w-[4.4rem] translate-x-[0.8rem] -translate-y-[1.5rem] md:top-[4rem] md:-translate-y-[1.1rem]"
    >
      <span data-motion="hamb-line" className="absolute inset-0">
        <span className={`${line} ${open ? 'translate-y-0 rotate-45' : '-translate-y-[0.4rem]'}`} />
      </span>
      <span data-motion="hamb-line" className="absolute inset-0">
        <span className={`${line} delay-75 ${open ? 'translate-y-0 -rotate-45' : 'translate-y-[0.2rem]'}`} />
      </span>
    </button>
  );
});

export default Hamburger;
