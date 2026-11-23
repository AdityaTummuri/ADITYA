import Link from 'next/link';
import { ViewTransition } from 'react';
import Num from '@/components/receipt/Num';
import Rich from '@/components/receipt/Rich';
import { home } from '@/content/pages';
import { rooms } from '@/content/rooms';

/** One paper colour and one burst colour per episode. */
const PAPER = ['bg-surface-1', 'bg-[#fff1c2]', 'bg-[#dff5fb]', 'bg-[#ffe1ee]'];
const BURST = ['bg-pink', 'bg-sun', 'bg-sky', 'bg-mint'];

/** The four projects as four episode cards: a hollow numeral, the title, what it found, and the number in an impact star. */
export default function WorkCards() {
  return (
    <ol className="grid gap-md">
      {rooms.map((r, i) => (
        <li key={r.slug}>
          <article
            data-fx="peek"
            className={`panel lift group relative grid gap-sm overflow-hidden p-sm md:grid-cols-[18rem_minmax(0,1fr)_auto] lg:grid-cols-[27rem_minmax(0,1fr)_auto] md:items-center md:gap-md md:p-md ${PAPER[i]}`}
          >
            <div aria-hidden className="tone pointer-events-none absolute -right-[4rem] -top-[4rem] h-[24rem] w-[24rem] rounded-full [--tone:rgb(23_20_46_/_0.2)] [mask-image:radial-gradient(circle,#000,transparent_70%)]" />
            <p aria-hidden className="outline-word relative text-[clamp(7rem,10.5vw,14rem)]">{String(i + 1).padStart(2, '0')}</p>
            <div className="relative">
              <p className="sticker sticker-white">Episode {['one', 'two', 'three', 'four'][i]}</p>
              <h3 className="mt-xxs text-display-sm">
                <ViewTransition name={`title-${r.slug}`} share="morph" default="none">
                  <Link
                    href={`/work/${r.slug}`}
                    transitionTypes={['into']}
                    data-fx="soft"
                    className="outline-offset-8 after:absolute after:inset-0 after:z-0 after:content-['']"
                  >
                    {r.title}
                  </Link>
                </ViewTransition>
              </h3>
              <p className="mt-xxs max-w-[46ch] text-title-md leading-snug text-ink-muted">{r.row.finding}</p>
              <p className="mt-xs inline-flex items-center gap-xxs font-bold">
                {home.episode}
                <svg aria-hidden viewBox="0 0 40 16" className="h-[1.2rem] w-[2.8rem] transition-transform duration-300 ease-[var(--ease-spring)] group-hover:translate-x-[0.6rem]">
                  <path d="M0 8h36M29 1l8 7-8 7" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </p>
            </div>
            <div className="relative flex items-center gap-xs md:flex-col md:items-center md:gap-xxs">
              <div className="relative grid h-[17rem] w-[17rem] shrink-0 place-items-center md:h-[21rem] md:w-[21rem]">
                <span aria-hidden className="absolute inset-0 bg-ink [clip-path:polygon(50%_0%,58.5%_13%,71.7%_5%,73.7%_20.3%,89.1%_18.8%,84.2%_33.5%,98.7%_38.9%,88%_50%,98.7%_61.1%,84.2%_66.5%,89.1%_81.2%,73.7%_79.7%,71.7%_95%,58.5%_87%,50%_100%,41.5%_87%,28.3%_95%,26.3%_79.7%,10.9%_81.2%,15.8%_66.5%,1.3%_61.1%,12%_50%,1.3%_38.9%,15.8%_33.5%,10.9%_18.8%,26.3%_20.3%,28.3%_5%,41.5%_13%)] [scale:1.03]" />
                <span aria-hidden className={`burst-badge absolute inset-0 ${BURST[i]} transition-transform duration-500 ease-[var(--ease-spring)] group-hover:rotate-[8deg] group-hover:scale-105`} />
                <p className="relative z-10 px-xs text-center font-display text-[2.6rem] font-extrabold leading-none tracking-[-0.04em] md:text-[3.4rem]">
                  <Num id={r.row.figure} />
                </p>
              </div>
              <p className="max-w-[18rem] text-body-sm font-medium leading-snug md:text-center">
                <Rich>{r.row.figureLabel}</Rich>
              </p>
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}
