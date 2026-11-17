import FooterHud from '@/components/chrome/FooterHud';
import HudAutoHide from '@/components/chrome/HudAutoHide';
import ChapterKeys from '@/components/chrome/ChapterKeys';
import ProgressRail from '@/components/chrome/ProgressRail';
import ScrollHint from '@/components/chrome/ScrollHint';
import SiteFooter from '@/components/chrome/SiteFooter';
import AboutBlock from '@/components/home/AboutBlock';
import Chapter from '@/components/home/Chapter';
import ContactLinks from '@/components/home/ContactLinks';
import HeroTelemetry from '@/components/home/HeroTelemetry';
import ProjectRows from '@/components/home/ProjectRows';
import { chapters } from '@/content/chapters';
import type { ChapterSpec } from '@/content/types';

function bodyFor(spec: ChapterSpec): { aside?: React.ReactNode; body?: React.ReactNode } {
  switch (spec.id) {
    case 'hero':
      return { aside: <HeroTelemetry /> };
    case 'work':
      return { body: <ProjectRows /> };
    case 'about':
      return { body: <AboutBlock /> };
    case 'contact':
      return { body: <ContactLinks /> };
  }
}

export default function Home() {
  return (
    <>
      {chapters.map((spec) => {
        const { aside, body } = bodyFor(spec);
        return (
          <Chapter key={spec.id} spec={spec} aside={aside}>
            {body}
          </Chapter>
        );
      })}
      <SiteFooter />
      <ProgressRail />
      <HudAutoHide>
        <FooterHud hint={<ScrollHint />} />
      </HudAutoHide>
      <ChapterKeys />
    </>
  );
}
