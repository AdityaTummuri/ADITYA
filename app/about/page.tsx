import type { Metadata } from 'next';
import SiteFooter from '@/components/chrome/SiteFooter';
import Rich from '@/components/receipt/Rich';
import Page from '@/components/travel/Page';
import TextLinkArrow from '@/components/ui/TextLinkArrow';
import SetLook from '@/components/work/SetLook';
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

export default function AboutPage() {
  return (
    <Page>
      <SetLook look="calm" />
      <div className="container-8bit grid pt-[calc(var(--header-height)+4rem)] md:pt-[16rem] lg:grid-cols-12 lg:gap-x-[var(--gutter)]">
        <div className="quiet lg:col-span-7">
          <h1 tabIndex={-1} className="font-display text-display-md font-medium outline-none [text-wrap:balance]">{about.h1}</h1>
          <p className="prose-measure mt-xs text-body text-ink-muted">{about.p1}</p>
          {about.sections.map((s) => (
            <section key={s.heading} className="mt-lg">
              <h2 className="font-display text-title-lg">
                <Rich>{s.heading}</Rich>
              </h2>
              <p className="prose-measure mt-xxs text-body text-ink-muted">
                <Rich>{s.body}</Rich>
              </p>
            </section>
          ))}
          <ul className="mt-lg flex flex-wrap gap-x-md">
            {about.links.map((l) => (
              <li key={l.href}>
                <TextLinkArrow href={l.href}>{l.label}</TextLinkArrow>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-2xl">
        <SiteFooter links />
      </div>
    </Page>
  );
}
