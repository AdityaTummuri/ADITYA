import type { Metadata } from 'next';
import SiteFooter from '@/components/chrome/SiteFooter';
import Rich from '@/components/receipt/Rich';
import Page from '@/components/travel/Page';
import PageHead from '@/components/ui/PageHead';
import { archiveOwn, archiveTeam } from '@/content/archive';
import { archivePage } from '@/content/pages';
import { repoUrl } from '@/content/receipt-links';
import type { ArchiveItem } from '@/content/types';

const DESCRIPTION = 'Everything else Aditya Tummuri has built, one line and one number each.';

export const metadata: Metadata = {
  title: 'Archive',
  description: DESCRIPTION,
  openGraph: { title: 'Archive', description: DESCRIPTION, url: '/archive' },
  alternates: { canonical: '/archive' },
};

function Item({ item }: { item: ArchiveItem }) {
  return (
    <li
      id={item.slug}
      className="archive-item scroll-mt-[12rem] grid gap-xxs border-t-[0.2rem] border-ink px-xxs py-[1.6rem] md:grid-cols-[3fr_5fr_3fr_7rem] md:gap-x-[3rem]"
    >
      <h3 className="text-title-lg md:text-[2.2rem]">
        <a href={repoUrl(item.repo)} className="link">
          {item.title}
        </a>
      </h3>
      <p className="text-body text-ink-muted">
        <Rich>{item.line}</Rich>
      </p>
      <p className="text-body font-medium">
        <Rich>{item.proof}</Rich>
      </p>
      {item.live ? (
        <a href={item.live} data-fx="soft" className="press sticker sticker-pink min-h-[4.4rem] justify-self-start self-start no-underline">
          Live<span className="sr-only">{`, the live site of ${item.title}`}</span>
          <svg aria-hidden viewBox="0 0 12 12" className="h-[1.2rem] w-[1.2rem] shrink-0">
            <path d="M2.5 9.5l7-7M4 2.5h5.5V8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </a>
      ) : null}
    </li>
  );
}

function Group({ title, items, tone }: { title: string; items: ArchiveItem[]; tone: string }) {
  const id = title.toLowerCase().replace(/\s+/g, '-');
  return (
    <section aria-labelledby={id} className="mt-xl first-of-type:mt-0">
      <h2 id={id} className={`sticker ${tone} !text-[1.6rem]`}>{title}</h2>
      <ul className="mt-sm border-b-[0.2rem] border-ink">
        {items.map((i) => <Item key={i.slug} item={i} />)}
      </ul>
    </section>
  );
}

export default function ArchivePage() {
  return (
    <Page>
      <PageHead kicker="Side quests" title={archivePage.h1} tone="sky">
        <p>{archivePage.intro}</p>
      </PageHead>
      <div className="container-8bit">
        <Group title={archivePage.groups[0]} items={archiveOwn} tone="sticker-sun" />
        <Group title={archivePage.groups[1]} items={archiveTeam} tone="sticker-pink" />
        <p id="removed" className="mt-xl max-w-[62ch] scroll-mt-[12rem] text-body text-ink-subtle">{archivePage.removed}</p>
      </div>
      <div className="mt-2xl">
        <SiteFooter links />
      </div>
    </Page>
  );
}
