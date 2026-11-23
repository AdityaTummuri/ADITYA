import Link from 'next/link';
import type { Room } from '@/content/types';

function Side({ room, label, align }: { room: Room; label: string; align: 'left' | 'right' }) {
  return (
    <Link
      href={`/work/${room.slug}`}
      transitionTypes={['side']}
      data-fx="hit"
      data-word={align === 'right' ? 'shu' : 'zuza'}
      className={`panel lift press group block min-h-[4.4rem] p-sm ${align === 'right' ? 'bg-sun md:text-right' : 'bg-surface-1'}`}
    >
      <span className="block font-cond text-meta text-ink-muted">{label}</span>
      <span className="mt-1 block font-poster text-[clamp(2.4rem,3.4vw,4rem)] leading-tight">{room.title}</span>
    </Link>
  );
}

/** Previous and next episode, in the fixed cycle. */
export default function RoomNav({ prev, next }: { prev: Room; next: Room }) {
  return (
    <nav aria-label="Episodes" className="grid gap-md md:grid-cols-2">
      <Side room={prev} label="Previous episode" align="left" />
      <Side room={next} label="Next episode" align="right" />
    </nav>
  );
}
