import ChapterKeys from '@/components/chrome/ChapterKeys';
import HudAutoHide from '@/components/chrome/HudAutoHide';
import FooterHud from '@/components/chrome/FooterHud';
import ProgressRail from '@/components/chrome/ProgressRail';
import ScrollHint from '@/components/chrome/ScrollHint';
import SiteFooter from '@/components/chrome/SiteFooter';
import Chapter from '@/components/home/Chapter';
import CardSlider from '@/components/home/CardSlider';
import ContactLinks from '@/components/home/ContactLinks';
import FocusCard from '@/components/home/FocusCard';
import NoteBlock from '@/components/home/NoteBlock';
import NowTiles from '@/components/home/NowTiles';
import ProjectCard from '@/components/home/ProjectCard';
import ProjectRows from '@/components/home/ProjectRows';
import CardTilt from '@/components/ui/CardTilt';
import { chapters } from '@/content/chapters';
import { featuredProjects } from '@/content/projects';
import { profile } from '@/content/profile';
import type { ChapterSpec } from '@/content/types';
function bodyFor(spec: ChapterSpec): { layer?: React.ReactNode; flow?: React.ReactNode } {
  switch (spec.body) {
    case 'focus-cards':
      return {
        layer: (
          <CardSlider label="Focus areas">
            {profile.focusAreas.map((a, i) => (
              <CardTilt key={a.title}>
                <FocusCard area={a} index={i} />
              </CardTilt>
            ))}
          </CardSlider>
        ),
      };
    case 'project-cards':
      return {
        layer: (
          <CardSlider label="Featured projects">
            {featuredProjects.map((p) => (
              <CardTilt key={p.slug}>
                <ProjectCard project={p} />
              </CardTilt>
            ))}
          </CardSlider>
        ),
      };
    case 'project-rows':
      return { flow: <ProjectRows /> };
    case 'notes':
      return { flow: <NoteBlock /> };
    case 'now':
      return { flow: <NowTiles /> };
    case 'contact':
      return { flow: <ContactLinks /> };
  }
}

export default function Home() {
  return (
    <>
      {chapters.map((spec) => {
        const b = bodyFor(spec);
        return <Chapter key={spec.id} spec={spec} layerBody={b.layer} flowBody={b.flow} />;
      })}
      <SiteFooter />
      <HudAutoHide>
        <ProgressRail />
        <FooterHud hint={<ScrollHint />} />
      </HudAutoHide>
      <ChapterKeys />
    </>
  );
}
