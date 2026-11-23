import Link from 'next/link';
import { archive } from '@/content/archive';

const TINT = ['bg-sun', 'bg-pink', 'bg-sky', 'bg-mint', 'bg-surface-1'];

/** A strip of every other project as stickers. It drifts, stops under the pointer or focus, and rests under reduced motion. */
export default function SideQuests() {
  const items = archive.map((a, i) => ({ ...a, tint: TINT[i % TINT.length] }));
  const sticker = (a: (typeof items)[number], hidden: boolean) => (
    <li key={`${a.slug}${hidden ? '-b' : ''}`} aria-hidden={hidden || undefined}>
      <Link
        href={`/archive#${a.slug}`}
        tabIndex={hidden ? -1 : undefined}
        data-fx="peek"
        className={`press lift inline-flex min-h-[5.6rem] items-center gap-xxs rounded-full border-[0.3rem] border-ink px-sm font-display text-[2rem] font-extrabold tracking-[-0.03em] shadow-[0.4rem_0.5rem_0_var(--color-ink)] ${a.tint}`}
      >
        {a.title}
      </Link>
    </li>
  );
  return (
    <div className="marquee">
      <ul className="marquee-track">
        {items.map((a) => sticker(a, false))}
        {items.map((a) => sticker(a, true))}
      </ul>
    </div>
  );
}
