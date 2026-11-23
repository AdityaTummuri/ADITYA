import type { Metadata } from 'next';
import SiteFooter from '@/components/chrome/SiteFooter';
import Rich from '@/components/receipt/Rich';
import Page from '@/components/travel/Page';
import PageHead from '@/components/ui/PageHead';
import TextLinkArrow from '@/components/ui/TextLinkArrow';
import github from '@/content/github.json';
import { about } from '@/content/pages';
import { formatDay } from '@/content/receipt-links';

const DESCRIPTION = `Who Aditya Tummuri is, the habit behind the work, and the GitHub account as of ${formatDay(github.readOn)}.`;

export const metadata: Metadata = {
  title: 'About',
  description: DESCRIPTION,
  openGraph: { title: 'About', description: DESCRIPTION, url: '/about' },
  alternates: { canonical: '/about' },
};

const PAPER = ['bg-[#fff1c2]', 'bg-[#dff5fb]', 'bg-[#ffe1ee]'];

export default function AboutPage() {
  return (
    <Page>
      <PageHead kicker="Character sheet" title={about.h1} tone="sun">
        <p>{about.p1}</p>
      </PageHead>
      <div className="container-8bit grid gap-md pb-xl md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr] [&>*]:min-w-0">
        {about.sections.map((s, i) => (
          <section key={s.heading} className={`panel lift p-md ${PAPER[i % PAPER.length]}`}>
            <h2 className="text-title-lg">
              <Rich>{s.heading}</Rich>
            </h2>
            <p className="mt-xs text-body text-ink-muted">
              <Rich>{s.body}</Rich>
            </p>
          </section>
        ))}
      </div>
      <div className="container-8bit">
        <ul className="flex flex-wrap gap-x-md">
          {about.links.map((l) => (
            <li key={l.href}>
              <TextLinkArrow href={l.href}>{l.label}</TextLinkArrow>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-2xl">
        <SiteFooter links />
      </div>
    </Page>
  );
}
