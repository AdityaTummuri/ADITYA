import type { Metadata } from 'next';
import Contact from '@/components/home/Contact';
import Hero from '@/components/home/Hero';
import SideQuests from '@/components/home/SideQuests';
import WorkCards from '@/components/home/WorkCards';
import Page from '@/components/travel/Page';
import TextLinkArrow from '@/components/ui/TextLinkArrow';
import { home } from '@/content/pages';

export const metadata: Metadata = { alternates: { canonical: '/' } };

export default function Home() {
  return (
    <Page>
      <Hero />

      <section id="work" aria-labelledby="work-title" className="relative scroll-mt-0 py-xl md:py-2xl">
        <div className="container-8bit">
          <p className="sticker sticker-pink">{home.workKicker}</p>
          <h2 id="work-title" tabIndex={-1} data-fx-land data-word="zuza" className="mt-xs max-w-[18ch] text-display-md outline-none">{home.workHeading}</h2>
          <div className="mt-md">
            <WorkCards />
          </div>
        </div>
      </section>

      <section aria-labelledby="side-title" className="relative border-y-[0.3rem] border-ink bg-paper-2 py-xl">
        <div className="container-8bit">
          <p className="sticker sticker-sun">{home.sideKicker}</p>
          <h2 id="side-title" className="mt-xs text-display-md">{home.sideHeading}</h2>
        </div>
        <div className="mt-md">
          <SideQuests />
        </div>
        <div className="container-8bit mt-xs">
          <TextLinkArrow href="/archive">{home.workMore}</TextLinkArrow>
        </div>
      </section>

      <Contact />
    </Page>
  );
}
