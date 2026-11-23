import Link from 'next/link';
import type { Room } from '@/content/types';

function Side({ room, label, align }: { room: Room; label: string; align: 'left' | 'right' }) {
  return (
    <Link
      href={`/work/${room.slug}`}
      transitionTypes={['side']}
      className={`press group block min-h-[4.4rem] border-t border-hairline py-sm hover:text-primary-soft ${align === 'right' ? 'md:text-right' : ''}`}
    >
      <span className="block font-cond text-meta text-ink-muted">{label}</span>
      <span className="mt-1 block font-display text-headline font-medium">{room.title}</span>
    </Link>
  );
}

/** Previous and next room, in the fixed cycle. */
export default function RoomNav({ prev, next }: { prev: Room; next: Room }) {
  return (
    <nav aria-label="Rooms" className="grid gap-x-[var(--gutter)] md:grid-cols-2 md:gap-x-[6rem]">
      <Side room={prev} label="Previous room" align="left" />
      <Side room={next} label="Next room" align="right" />
    </nav>
  );
}
