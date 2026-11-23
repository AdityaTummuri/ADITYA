'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { menuLinks, socials } from '@/content/nav';
import { useScrollStore } from '@/lib/scroll-store';
import { useUi } from '@/lib/ui-store';

const HOME_DIVISION: Record<string, number> = { '/': 0, '/#work': 1, '/#contact': 2 };

/** Which menu item is "you are here": the page, or on the home the division on screen. */
function isCurrent(href: string, pathname: string, division: number): boolean {
  if (href in HOME_DIVISION) {
    if (pathname === '/') return HOME_DIVISION[href] === division;
    return href === '/#work' && pathname.startsWith('/work/');
  }
  return pathname === href;
}

/** Right-hand black panel (DESIGN.md `menu-panel`). Locks scroll, traps focus, Esc closes. */
export default function MenuPanel() {
  const open = useUi((s) => s.menuOpen);
  const setOpen = useUi((s) => s.setMenuOpen);
  const pathname = usePathname();
  const division = useScrollStore((s) => s.chapter);
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
      data-lenis-prevent
      // visibility flips instantly on open (so focus can move in) and after the slide on close
      style={{
        transitionProperty: 'transform, visibility',
        transitionDuration: '400ms, 0s',
        transitionDelay: open ? '0s, 0s' : '0s, 400ms',
        transitionTimingFunction: 'var(--ease-out)',
        viewTransitionName: 'site-menu',
      }}
      className={`fixed inset-y-0 right-0 z-[45] w-full overflow-y-auto bg-canvas px-[var(--margin)] pb-xl pt-[14rem] md:w-[45vw] md:pt-[18rem] ${
        open ? 'visible translate-x-0' : 'invisible translate-x-full'
      }`}
    >
      <nav aria-label="Primary">
        <ul>
          {menuLinks.map((l) => {
            const current = isCurrent(l.href, pathname, division);
            return (
              <li key={l.href} className="border-b border-hairline-strong">
                <Link
                  href={l.href}
                  // same-page targets are scrolled by the capture listener in lib/smooth-scroll
                  onClick={() => setOpen(false)}
                  aria-current={current ? 'page' : undefined}
                  className={`press flex min-h-[4.4rem] items-center py-xs font-display text-title-lg font-normal hover:text-primary-soft md:text-display-sm ${
                    current ? 'text-primary' : 'text-ink'
                  }`}
                >
                  {l.label}
                  {current ? <span className="sr-only"> (you are here)</span> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <ul className="mt-xl flex gap-md text-body-sm text-ink-muted">
        {socials.map((s) => (
          <li key={s.href}>
            <a href={s.href} className="press inline-flex min-h-[4.4rem] items-center hover:text-ink">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
