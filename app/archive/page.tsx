import type { Metadata } from 'next';
import SiteFooter from '@/components/chrome/SiteFooter';
import Rich from '@/components/receipt/Rich';
import Page from '@/components/travel/Page';
import SetLook from '@/components/work/SetLook';
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
      className="archive-item scroll-mt-[12rem] grid gap-xxs border-b border-hairline py-[1.2rem] md:grid-cols-[3fr_5fr_3fr_6.4rem] md:gap-x-[3rem]"
    >
      <h3 className="text-body font-medium">
        <a href={repoUrl(item.repo)} className="press inline-flex min-h-[4.4rem] items-center hover:text-primary-soft md:min-h-0">
          {item.title}
        </a>
      </h3>
      <p className="text-body text-ink-muted">
        <Rich>{item.line}</Rich>
      </p>
      <p className="text-body text-ink">
        <Rich>{item.proof}</Rich>
      </p>
      {item.live ? (
        <a
          href={item.live}
          className="press group inline-flex min-h-[4.4rem] items-center gap-1 justify-self-start text-body font-medium text-primary hover:text-primary-soft max-md:mt-1 md:min-h-0 md:items-baseline"
        >
          Live<span className="sr-only">{`, the live site of ${item.title}`}</span>
          <svg aria-hidden viewBox="0 0 12 12" className="h-[1.2rem] w-[1.2rem] shrink-0 translate-y-[0.1rem] transition-transform duration-200 ease-[var(--ease-out)] motion-safe:group-hover:translate-x-[0.2rem] motion-safe:group-hover:-translate-y-[0.1rem]">
            <path d="M2.5 9.5l7-7M4 2.5h5.5V8" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </a>
      ) : null}
    </li>
  );
}

function Group({ title, items }: { title: string; items: ArchiveItem[] }) {
  const id = title.toLowerCase().replace(/\s+/g, '-');
  return (
    <section aria-labelledby={id} className="mt-xl first-of-type:mt-lg">
      <h2 id={id} className="font-display text-title-lg">{title}</h2>
      <ul className="mt-xs border-t border-hairline">
        {items.map((i) => <Item key={i.slug} item={i} />)}
      </ul>
    </section>
  );
}

export default function ArchivePage() {
  return (
    <Page>
      <SetLook look="grid" />
      <div className="container-8bit pt-[calc(var(--header-height)+4rem)] md:pt-[16rem]">
        <div className="quiet">
          <h1 tabIndex={-1} className="font-display text-display-md font-medium outline-none [text-wrap:balance]">{archivePage.h1}</h1>
          <p className="mt-xs max-w-[62ch] text-title-md text-ink-muted">{archivePage.intro}</p>
          <Group title={archivePage.groups[0]} items={archiveOwn} />
          <Group title={archivePage.groups[1]} items={archiveTeam} />
          <p id="removed" className="mt-xl max-w-[62ch] scroll-mt-[12rem] text-body text-ink-subtle">{archivePage.removed}</p>
        </div>
      </div>
      <div className="mt-2xl">
        <SiteFooter links />
      </div>
    </Page>
  );
}
