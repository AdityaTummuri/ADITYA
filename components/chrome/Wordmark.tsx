import Link from 'next/link';
import { profile } from '@/content/profile';

/** Typographic wordmark: the name alone, no logo. */
export default function Wordmark() {
  return (
    <div className="fixed left-[var(--margin)] top-[2.4rem] z-50 -translate-y-[1.5rem] md:top-[4rem] md:-translate-y-[1.1rem]" style={{ viewTransitionName: 'site-wordmark' }}>
      <Link
        href="/"
        className="press -mx-xxs flex h-[4.4rem] items-center px-xxs font-display text-[1.8rem] font-medium leading-none tracking-[-0.02em] text-ink hover:text-primary-soft"
      >
        {profile.name}
      </Link>
    </div>
  );
}
