'use client';

import Link from 'next/link';
import LogoA from '@/components/ui/LogoA';

/** Typographic wordmark with geometric letter 'A' logo mark (DESIGN.md `top-nav`). */
export default function Wordmark() {
  return (
    <div className="fixed left-[var(--margin)] top-[2.4rem] z-50 overflow-hidden md:top-[4rem]">
      <Link
        href="/"
        className="group -m-xxs flex items-center gap-xs p-xxs font-display text-[1.7rem] leading-none tracking-[-0.02em] text-ink transition-colors duration-300 hover:text-primary-soft"
        data-motion="logo"
      >
        <LogoA className="h-[2.4rem] w-[2.4rem] drop-shadow-[0_0_8px_rgba(143,170,178,0.4)]" />
        <span>AdityaTummuri</span>
      </Link>
    </div>
  );
}
