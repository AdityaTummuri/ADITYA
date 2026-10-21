'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useLenis } from 'lenis/react';
import { menuLinks, socials } from '@/content/nav';
import { useUi } from '@/lib/ui-store';

/** Right-hand black panel (DESIGN.md `menu-panel`). Locks scroll, traps focus, Esc closes. */
export default function MenuPanel() {
  const open = useUi((s) => s.menuOpen);
  const setOpen = useUi((s) => s.setMenuOpen);
  const pathname = usePathname();
  const lenis = useLenis();
  const panelRef = useRef<HTMLDivElement>(null);

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
        transitionDuration: '600ms, 0s',
        transitionDelay: open ? '0s, 0s' : '0s, 600ms',
        transitionTimingFunction: 'var(--ease-out-cubic)',
      }}
      className={`fixed inset-y-0 right-0 z-[45] w-full overflow-y-auto bg-canvas px-[var(--margin)] pb-xl pt-[14rem] md:w-[45vw] md:pt-[18rem] ${
        open ? 'visible translate-x-0' : 'invisible translate-x-full'
      }`}
    >
      <nav aria-label="Primary">
        <ul>
          {menuLinks.map((l, i) => {
            const current = l.href === '/' && pathname === '/';
            return (
              <li
                key={l.href}
                style={{ transitionDelay: open ? `${300 + i * 60}ms` : '0ms' }}
                className={`border-b border-hairline-strong transition-transform duration-500 ease-out-cubic ${
                  open ? 'translate-x-0' : 'translate-x-[2rem]'
                }`}
              >
                <Link
                  href={l.href}
                  onClick={(e) => {
                    setOpen(false);
                    const hash = l.href.split('#')[1];
                    if (pathname === '/' && l.href.startsWith('/#') && hash) {
                      const el = document.getElementById(hash);
                      if (el) {
                        e.preventDefault();
                        window.history.pushState(null, '', l.href);
                        const y = el.getBoundingClientRect().top + window.scrollY;
                        if (lenis) {
                          // the menu stopped Lenis; wake it so the scroll (and its easing) actually runs
                          lenis.start();
                          lenis.scrollTo(y, { duration: 1.1, force: true });
                        }
                        else window.scrollTo(0, y);
                      }
                    }
                  }}
                  aria-current={current ? 'page' : undefined}
                  className={`block py-xs font-display text-title-lg font-normal tracking-[-0.03em] text-ink transition-opacity duration-300 ease-out-cubic hover:opacity-50 md:text-display-sm ${
                    current ? 'opacity-20' : ''
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <ul className="mt-xl flex gap-md text-body-sm text-ink-subtle">
        {socials.map((s) => (
          <li key={s.href}>
            <a href={s.href} className="transition-opacity duration-300 ease-out-cubic hover:opacity-50">
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
