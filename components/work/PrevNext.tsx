import Link from 'next/link';

interface Item { href: string; title: string }

/** Previous / next pair separated by a dotted rule (DESIGN.md `case-study-row`). */
export default function PrevNext({ prev, next, noun }: { prev: Item; next: Item; noun: string }) {
  const cls = 'group flex flex-col gap-xxs py-sm transition-colors duration-300 ease-out-cubic hover:text-primary';
  return (
    <nav aria-label={`More ${noun}`} className="grid gap-xs border-t border-dashed border-hairline md:grid-cols-2 md:gap-lg">
      <Link href={prev.href} className={cls} aria-label={`Previous: ${prev.title}`}>
        <span className="text-body-sm text-ink-muted">Previous</span>
        <span className="font-display text-headline tracking-[-0.03em]">{prev.title}</span>
      </Link>
      <Link href={next.href} className={`${cls} md:items-end md:text-right`} aria-label={`Next: ${next.title}`}>
        <span className="text-body-sm text-ink-muted">Next</span>
        <span className="font-display text-headline tracking-[-0.03em]">{next.title}</span>
      </Link>
    </nav>
  );
}
