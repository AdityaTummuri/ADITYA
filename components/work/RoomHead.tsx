import Link from 'next/link';
import { ViewTransition } from 'react';
import EnterFx from '@/components/fx/EnterFx';
import Rich from '@/components/receipt/Rich';
import TextLinkArrow from '@/components/ui/TextLinkArrow';
import type { Room } from '@/content/types';

const EPISODE = ['one', 'two', 'three', 'four'];
const TONE = ['sticker-pink', 'sticker-sun', 'sticker-sky', 'sticker-pink'];

/** Back link, episode sticker and the title in poster letters. The title is the room's shared element. */
export function RoomTitle({ room, index }: { room: Room; index: number }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-xs gap-y-0">
        <Link href="/#work" transitionTypes={['out']} data-fx="soft" className="link font-cond text-meta">
          <svg aria-hidden viewBox="0 0 40 16" className="h-[1.2rem] w-[2.8rem] rotate-180">
            <path d="M0 8h36M29 1l8 7-8 7" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to the work
        </Link>
        <p className={`sticker ${TONE[index]}`}>Episode {EPISODE[index]}</p>
      </div>
      <h1 tabIndex={-1} className="relative mt-xs outline-none">
        <EnterFx word={(['don', 'kachi', 'shu', 'pon'] as const)[index]} />
        <ViewTransition name={`title-${room.slug}`} share="morph" default="none">
          <span className="block w-fit font-poster text-[clamp(3rem,8.4vw,11rem)] font-normal leading-[0.92] tracking-[-0.03em] [overflow-wrap:anywhere]">{room.title}</span>
        </ViewTransition>
      </h1>
    </div>
  );
}

/** The lead, the meta line and the links out. With `wide` the lead stays on the left and the meta and links move to a second column. */
export function RoomLead({ room, wide = false }: { room: Room; wide?: boolean }) {
  const lead = (
    <p className="max-w-[48ch] text-title-md text-ink">
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
  return wide ? (
    <div className="grid gap-md lg:grid-cols-12 lg:gap-x-[var(--gutter)]">
      <div className="lg:col-span-7">{lead}</div>
      <div className="lg:col-span-5 lg:self-end">{rest}</div>
    </div>
  ) : (
    <div>
      {lead}
      <div className="mt-xs">{rest}</div>
    </div>
  );
}
