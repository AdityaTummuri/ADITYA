import type { Metadata } from 'next';
import DivisionRail from '@/components/chrome/DivisionRail';
import Contact from '@/components/home/Contact';
import Division from '@/components/home/Division';
import HeroReceipt from '@/components/home/HeroReceipt';
import HomeRuntime from '@/components/home/HomeRuntime';
import WorkRows from '@/components/home/WorkRows';
import ButtonPrimary from '@/components/ui/ButtonPrimary';
import MaskHeading from '@/components/ui/MaskHeading';
import TextLinkArrow from '@/components/ui/TextLinkArrow';
import { divisions } from '@/content/divisions';
import { home } from '@/content/pages';
import Page from '@/components/travel/Page';

export const metadata: Metadata = { alternates: { canonical: '/' } };

const [start, work, contact] = divisions;
const RAIL = divisions.map((d) => ({ id: d.id, label: d.label }));

export default function Home() {
  return (
    <Page>
      <Division spec={start} labelledBy="start-title" className="max-md:!pt-[calc(var(--header-height)+5.6rem)]">
        <div className="container-8bit grid w-full flex-1 content-center items-center gap-lg lg:grid-cols-12 lg:gap-x-[var(--gutter)] [&>*]:min-w-0">
          <div className="quiet lg:col-span-7">
            <h1 id="start-title" tabIndex={-1} className="font-display outline-none">
              <MaskHeading lines={home.h1Lines} className="text-display-lg font-medium" />
            </h1>
            <p className="mt-sm font-display text-title-lg text-primary">{home.statement}</p>
            <p className="prose-measure mt-xs max-w-[56ch] text-body text-ink-muted">{home.paragraph}</p>
            <div className="mt-md flex flex-col items-start gap-xs max-md:items-stretch sm:flex-row sm:flex-wrap sm:items-center sm:gap-md">
              <ButtonPrimary href="#work" className="max-sm:w-full max-sm:justify-between">{home.primary}</ButtonPrimary>
              <TextLinkArrow href="/receipts">{home.secondary}</TextLinkArrow>
            </div>
          </div>
          <div className="lg:col-span-5 lg:justify-self-end">
            <HeroReceipt />
          </div>
        </div>
      </Division>

      <Division spec={work} labelledBy="work-title">
        <div className="container-8bit grid w-full flex-1 content-center gap-md">
          <div className="quiet">
            <h2 id="work-title" tabIndex={-1} className="font-display text-display-md font-medium outline-none [text-wrap:balance]">{home.workHeading}</h2>
            <div className="mt-md">
              <WorkRows />
            </div>
            <div className="mt-xs">
              <TextLinkArrow href="/archive">{home.workMore}</TextLinkArrow>
            </div>
          </div>
        </div>
      </Division>

      <Division spec={contact} labelledBy="contact-title" className="!pb-0">
        <Contact />
      </Division>
      <DivisionRail items={RAIL} />
      <HomeRuntime />
    </Page>
  );
}
