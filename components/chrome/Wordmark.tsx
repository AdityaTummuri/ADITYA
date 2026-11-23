import Link from 'next/link';
import { profile } from '@/content/profile';

/** The name as a sticker: poster letters, a pink dot, a hard shadow that steps on hover. */
export default function Wordmark() {
  return (
    <div className="fixed left-[var(--margin)] top-[1.8rem] z-50 md:top-[2.4rem]" style={{ viewTransitionName: 'site-wordmark' }}>
      <Link
        href="/"
        data-fx="soft"
        className="press group inline-flex min-h-[4.8rem] items-center gap-xxs rounded-full border-[0.3rem] border-ink bg-surface-1 px-xs font-poster text-[1.6rem] leading-none tracking-[-0.01em] text-ink shadow-[0.3rem_0.4rem_0_var(--color-ink)] hover:-translate-x-[0.2rem] hover:-translate-y-[0.2rem] hover:shadow-[0.5rem_0.6rem_0_var(--color-ink)] md:text-[1.8rem]"
      >
        <span aria-hidden className="h-[1.2rem] w-[1.2rem] rounded-full border-2 border-ink bg-pink" />
        {profile.name}
      </Link>
    </div>
  );
}
