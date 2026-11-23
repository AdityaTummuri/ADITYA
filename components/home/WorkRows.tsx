import Link from 'next/link';
import { ViewTransition } from 'react';
import Num from '@/components/receipt/Num';
import Rich from '@/components/receipt/Rich';
import { rooms } from '@/content/rooms';
import RowPreview from './RowPreview';

/** The four projects, one row each: title, what it does, and the number that backs it. */
export default function WorkRows() {
  return (
    <ol className="border-t border-hairline">
      {rooms.map((r) => (
        <RowPreview
          key={r.slug}
          look={r.look}
          className="group relative grid gap-xxs border-b border-hairline py-sm md:grid-cols-[5fr_5fr_3fr] lg:grid-cols-[4fr_5fr_3fr] md:items-start md:gap-x-[3rem]"
        >
          <h3 className="m-0">
            <ViewTransition name={`title-${r.slug}`} share="morph" default="none">
              <Link
                href={`/work/${r.slug}`}
                transitionTypes={['into']}
                className="inline-flex w-fit items-center gap-xs whitespace-nowrap font-display text-display-sm font-medium transition-colors duration-200 hover:text-primary-soft focus-visible:text-primary-soft group-hover:text-primary-soft group-focus-within:text-primary-soft after:absolute after:inset-0 after:content-['']"
              >
                {r.title}
                <svg aria-hidden viewBox="0 0 24 12" className="h-[1.2rem] w-[2.4rem] shrink-0 transition-transform duration-200 ease-[var(--ease-out)] motion-safe:group-hover:translate-x-[0.6rem] motion-safe:group-focus-within:translate-x-[0.6rem]">
                  <path d="M0 6h22M17 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </Link>
            </ViewTransition>
          </h3>
          <p className="max-w-[48ch] text-body text-ink-muted">{r.row.finding}</p>
          <div className="flex items-baseline gap-x-xs gap-y-0 max-md:flex-wrap md:block md:pt-[0.4rem]">
            <p className="font-display text-headline font-medium">
              <Num id={r.row.figure} />
            </p>
            <p className="text-body-sm text-ink-muted md:mt-1">
              <Rich>{r.row.figureLabel}</Rich>
            </p>
          </div>
        </RowPreview>
      ))}
    </ol>
  );
}
