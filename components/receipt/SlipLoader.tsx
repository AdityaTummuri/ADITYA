'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSlip } from '@/lib/slip-store';

const loadSlip = () => import('./ReceiptSlip');
const ReceiptSlip = dynamic(loadSlip, { ssr: false });

/**
 * Mounted once in the layout. Loads the slip on the first pointer or focus on a number, or when the
 * browser is idle, and turns an unmodified click on a number into "open the slip" (capture phase, so
 * it runs before the router). Where the Popover API is missing it does nothing and the link navigates.
 */
export default function SlipLoader() {
  const pathname = usePathname();
  const [load, setLoad] = useState(false);
  const onReceipts = pathname === '/receipts';

  useEffect(() => {
    if (load) return;
    const warm = (e: Event) => {
      if ((e.target as Element | null)?.closest?.('[data-receipt]')) setLoad(true);
    };
    document.addEventListener('pointerover', warm, { passive: true });
    document.addEventListener('focusin', warm);
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    let idle: number | undefined;
    let timer: number | undefined;
    if (w.requestIdleCallback) idle = w.requestIdleCallback(() => setLoad(true), { timeout: 4000 });
    else timer = window.setTimeout(() => setLoad(true), 2500);
    return () => {
      document.removeEventListener('pointerover', warm);
      document.removeEventListener('focusin', warm);
      if (idle !== undefined) w.cancelIdleCallback?.(idle);
      window.clearTimeout(timer);
    };
  }, [load]);

  useEffect(() => {
    if (onReceipts || typeof HTMLElement === 'undefined' || typeof HTMLElement.prototype.showPopover !== 'function') return;
    // a click before this runs follows the link to /receipts, which is the no-script behaviour
    document.documentElement.dataset.slipReady = 'true';
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[data-receipt]');
      if (!(a instanceof HTMLAnchorElement)) return;
      e.preventDefault();
      setLoad(true);
      useSlip.getState().show(a, e.clientX, e.clientY);
    };
    document.addEventListener('click', onClick, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      delete document.documentElement.dataset.slipReady;
    };
  }, [onReceipts]);

  return load ? <ReceiptSlip /> : null;
}
