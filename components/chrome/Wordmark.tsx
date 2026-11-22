import Link from 'next/link';

/** Typographic wordmark: the name alone, no logo (DESIGN.md `top-nav`). */
export default function Wordmark() {
  return (
    <div className="fixed left-[var(--margin)] top-[2.4rem] z-50 overflow-hidden md:top-[4rem]">
      <Link
        href="/"
        className="-m-xxs flex p-xxs font-display text-[1.7rem] leading-none tracking-[-0.02em] text-ink transition-colors duration-300 hover:text-primary-soft"
        data-motion="logo"
      >
        AdityaTummuri
      </Link>
    </div>
  );
}
