import Link from 'next/link';
import { ViewTransition } from 'react';
import Rich from '@/components/receipt/Rich';
import TextLinkArrow from '@/components/ui/TextLinkArrow';
import type { Room } from '@/content/types';

/**
 * Back link, title, lead, meta and the links out. The title is the room's shared element. With `wide`
 * the lead stays on the left and the meta and links move to a second column (for the wide exhibit).
 */
export default function RoomHead({ room, wide = false }: { room: Room; wide?: boolean }) {
  const lead = (
    <p className="mt-sm max-w-[48ch] text-title-md text-ink">
      <Rich>{room.lead}</Rich>
    </p>
  );
  const rest = (
    <>
      <p className="max-w-[62ch] text-body-sm text-ink-muted">
        <Rich>{room.meta}</Rich>
      </p>
      <ul className="mt-xs flex flex-wrap gap-x-md">
        {room.links.map((l) => (
          <li key={l.href}>
            <TextLinkArrow href={l.href}>{l.label}</TextLinkArrow>
          </li>
        ))}
      </ul>
    </>
  );
  return (
    <div className={wide ? 'grid gap-md lg:grid-cols-12 lg:gap-x-[var(--gutter)]' : undefined}>
      <div className={wide ? 'lg:col-span-7' : undefined}>
      <Link
        href="/#work"
        transitionTypes={['out']}
        className="press inline-flex min-h-[4.4rem] items-center gap-xxs font-cond text-meta text-ink-muted hover:text-ink"
      >
        <svg aria-hidden viewBox="0 0 16 10" className="h-[1rem] w-[1.6rem] rotate-180">
          <path d="M0 5h14M11 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        Back to the work
      </Link>
      <h1 tabIndex={-1} className="mt-xxs font-display outline-none">
        <ViewTransition name={`title-${room.slug}`} share="morph" default="none">
          <span className="block w-fit text-display-lg font-medium [text-wrap:balance]">{room.title}</span>
        </ViewTransition>
      </h1>
      {lead}
      {wide ? null : <div className="mt-xs">{rest}</div>}
      </div>
      {wide ? <div className="lg:col-span-5 lg:self-end">{rest}</div> : null}
    </div>
  );
}
