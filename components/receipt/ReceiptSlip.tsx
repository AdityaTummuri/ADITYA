'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { receipts } from '@/content/receipts';
import { useSlip } from '@/lib/slip-store';
import ReceiptBody from './ReceiptBody';

const GAP = 12;
const EDGE = 16;

/**
 * The slip: one popover dialog for every number on the site. Light dismiss, Escape and focus return
 * come from the Popover API. Beside the number on desktop, a bottom sheet below 768px.
 */
export default function ReceiptSlip() {
  const open = useSlip((s) => s.open);
  const close = useSlip((s) => s.close);
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const id = open?.anchor.dataset.receipt;
  const receipt = id ? receipts[id] : undefined;

  const place = () => {
    const el = ref.current;
    const cur = useSlip.getState().open;
    if (!el || !cur) return;
    if (window.matchMedia('(max-width: 767px)').matches) {
      el.style.left = el.style.top = '';
      return;
    }
    const rects = [...cur.anchor.getClientRects()];
    const rect = rects.find((r) => cur.y >= r.top - 2 && cur.y <= r.bottom + 2 && cur.x >= r.left - 2 && cur.x <= r.right + 2) ?? rects[0] ?? cur.anchor.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    if (rect.bottom < 0 || rect.top > vh) {
      el.hidePopover();
      return;
    }
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const left = Math.min(Math.max(rect.left, EDGE), Math.max(EDGE, vw - EDGE - w));
    let top = rect.bottom + GAP;
    if (top + h > vh - EDGE) top = rect.top - GAP - h;
    top = Math.min(Math.max(top, EDGE), Math.max(EDGE, vh - EDGE - h));
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
    // grow out of the number, not out of the middle of the slip
    el.style.transformOrigin = `${Math.round(rect.left + rect.width / 2 - left)}px ${top > rect.top ? '0' : '100%'}`;
  };

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !open) return;
    if (!el.matches(':popover-open')) el.showPopover();
    place();
    el.focus({ preventScroll: true });
  }, [open]);

  // the dismissal comes from the browser; keep the store and focus in step with it
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onToggle = (e: Event) => {
      if ((e as ToggleEvent).newState !== 'closed' || el.matches(':popover-open')) return;
      const cur = useSlip.getState().open;
      close();
      const a = document.activeElement;
      if (cur && (!a || a === document.body || el.contains(a))) cur.anchor.focus({ preventScroll: true });
    };
    el.addEventListener('toggle', onToggle);
    return () => el.removeEventListener('toggle', onToggle);
  }, [close]);

  // follow the number while the page scrolls or resizes
  useEffect(() => {
    if (!open) return;
    const on = () => requestAnimationFrame(place);
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
    };
  }, [open]);

  // a route change closes it
  const here = useRef(pathname);
  useEffect(() => {
    if (here.current === pathname) return;
    here.current = pathname;
    const el = ref.current;
    if (el?.matches(':popover-open')) el.hidePopover();
  }, [pathname]);

  return (
    <div
      ref={ref}
      popover="auto"
      role="dialog"
      aria-labelledby="slip-title"
      data-receipt-slip
      tabIndex={-1}
    >
      {receipt ? <ReceiptBody receipt={receipt} as="h2" headingId="slip-title" /> : null}
    </div>
  );
}
