'use client';

import { forwardRef } from 'react';
import { useUi } from '@/lib/ui-store';

/** A pill that says what it does: Menu, then Close. The lines cross into an X. */
const Hamburger = forwardRef<HTMLButtonElement>(function Hamburger(_, ref) {
  const open = useUi((s) => s.menuOpen);
  const setOpen = useUi((s) => s.setMenuOpen);
  const line = 'absolute left-0 h-[0.3rem] w-[2rem] rounded-full bg-current transition-transform duration-[360ms] ease-[var(--ease-spring)]';
  return (
    <button
      ref={ref}
      type="button"
      aria-label="Menu"
      aria-expanded={open}
      aria-controls="site-menu"
      data-fx="soft"
      onClick={() => setOpen(!open)}
      style={{ viewTransitionName: 'site-menu-button' }}
      className="press fixed right-[var(--margin)] top-[1.8rem] z-[60] inline-flex min-h-[4.8rem] items-center gap-xxs rounded-full border-[0.3rem] border-ink bg-ink px-xs font-display text-[1.7rem] font-extrabold leading-none text-canvas shadow-[0.3rem_0.4rem_0_var(--color-pink)] hover:-translate-x-[0.2rem] hover:-translate-y-[0.2rem] hover:shadow-[0.5rem_0.6rem_0_var(--color-pink)] md:top-[2.4rem]"
    >
      <span aria-hidden className="relative block h-[1.4rem] w-[2rem]">
        <span className={`${line} top-0 ${open ? 'translate-y-[0.55rem] rotate-45' : ''}`} />
        <span className={`${line} bottom-0 ${open ? '-translate-y-[0.55rem] -rotate-45' : ''}`} />
      </span>
      <span aria-hidden>{open ? 'Close' : 'Menu'}</span>
    </button>
  );
});

export default Hamburger;
