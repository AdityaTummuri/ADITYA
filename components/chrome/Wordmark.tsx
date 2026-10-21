import Link from 'next/link';

/** Typographic wordmark (DESIGN.md `top-nav`): fixed top-left, no bar behind it. */
export default function Wordmark() {
  return (
    <div className="fixed left-[var(--margin)] top-[2.4rem] z-50 overflow-hidden md:top-[4rem]">
      <Link
        href="/"
        className="-m-xxs flex p-xxs font-display text-[1.7rem] leading-none tracking-[-0.02em] text-ink"
        data-motion="logo"
      >
        aditya tummuri
      </Link>
    </div>
  );
}
