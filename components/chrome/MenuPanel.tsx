'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { menuLinks, socials } from '@/content/nav';
import { useUi } from '@/lib/ui-store';

/** Which menu item is "you are here": the page itself; a project page counts as Work. */
function isCurrent(href: string, pathname: string): boolean {
  if (href === '/') return pathname === '/';
  if (href === '/#work') return pathname.startsWith('/work/');
  return pathname === href;
}

/** Full-screen paper menu: big poster links, each with its episode number. Locks scroll, traps focus, Esc closes. */
export default function MenuPanel() {
  const open = useUi((s) => s.menuOpen);
  const setOpen = useUi((s) => s.setMenuOpen);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  // a route change (browser Back, a link elsewhere) always closes the menu
  useEffect(() => {
    setOpen(false);
  }, [pathname, setOpen]);

  useEffect(() => {
    if (!open) return;
    // lock the root: html's overflow-x:clip stops body overflow from propagating to the viewport
    document.body.setAttribute('data-scroll-locked', 'true');
    document.documentElement.style.overflow = 'hidden';
    const panel = panelRef.current;
    const toggle = document.querySelector<HTMLButtonElement>('button[aria-label="Menu"]');
    panel?.querySelector<HTMLElement>('a')?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggle?.focus();
        return;
      }
      if (e.key !== 'Tab' || !panel) return;
      // DOM order: the toggle precedes the panel
      const items = [...(toggle ? [toggle] : []), ...panel.querySelectorAll<HTMLElement>('a[href]')];
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
      else if (!items.includes(active as HTMLElement)) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.removeAttribute('data-scroll-locked');
      document.documentElement.style.overflow = '';
    };
  }, [open, setOpen]);

  return (
    <div
      ref={panelRef}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      // visibility flips instantly on open (so focus can move in) and after the slide on close
      style={{
        transitionProperty: 'clip-path, visibility',
        transitionDuration: '520ms, 0s',
        transitionDelay: open ? '0s, 0s' : '0s, 520ms',
        transitionTimingFunction: 'var(--ease-out)',
        viewTransitionName: 'site-menu',
        clipPath: open ? 'circle(150% at calc(100% - 7rem) 4.2rem)' : 'circle(0% at calc(100% - 7rem) 4.2rem)',
      }}
      className={`fixed inset-0 z-[45] overflow-y-auto bg-canvas px-[var(--margin)] pb-xl pt-[9rem] ${open ? 'visible' : 'invisible'}`}
    >
      <div aria-hidden className="tone pointer-events-none absolute inset-x-0 bottom-0 h-[50%] [--tone:rgb(255_79_154_/_0.35)] [mask-image:linear-gradient(to_top,#000,transparent)]" />
      <nav aria-label="Primary" className="relative mx-auto max-w-[110rem]">
        <ul>
          {menuLinks.map((l, i) => {
            const current = isCurrent(l.href, pathname);
            return (
              <li key={l.href} className="border-b-[0.3rem] border-ink">
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  aria-current={current ? 'page' : undefined}
                  data-fx="soft"
                  className="group flex min-h-[4.4rem] items-start gap-sm py-xxs font-display text-[clamp(3.6rem,7vw,8rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-ink transition-[padding,color] duration-300 ease-[var(--ease-spring)] hover:pl-sm hover:text-primary"
                >
                  <span aria-hidden className="mt-[1.4rem] w-[3.6rem] font-cond text-[1.4rem] font-medium tracking-[0.04em] text-ink-subtle md:w-[5rem] md:text-[1.6rem]">{String(i + 1).padStart(2, '0')}</span>
                  <span className={current ? 'marker' : undefined}>{l.label}</span>
                  {current ? <span className="sr-only"> (you are here)</span> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <ul className="relative mx-auto mt-lg flex max-w-[110rem] flex-wrap gap-xs">
        {socials.map((s) => (
          <li key={s.href}>
            <a href={s.href} data-fx="soft" className="btn btn-alt press text-[1.6rem]">{s.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
