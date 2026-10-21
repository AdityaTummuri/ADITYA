import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteFooter from '@/components/chrome/SiteFooter';
import SetLook from '@/components/work/SetLook';
import CaseStudyBody from '@/components/work/CaseStudyBody';
import CaseStudyHero from '@/components/work/CaseStudyHero';
import PrevNext from '@/components/work/PrevNext';
import ButtonPrimary from '@/components/ui/ButtonPrimary';
import { adjacentProject, caseStudyProjects, getProject } from '@/content/projects';
import { profile } from '@/content/profile';

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudyProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: `${p.title} — Aditya Tummuri`,
    description: p.summary,
    openGraph: { title: `${p.title} — Aditya Tummuri`, description: p.summary },
  };
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  const adj = adjacentProject(slug);
  if (!project || !project.tradeoff || !adj) notFound();
  return (
    <>
      <SetLook />
      <CaseStudyHero project={project} />
      <CaseStudyBody project={project} />
      <div className="container-8bit pb-xl">
        <PrevNext
          noun="work"
          prev={{ href: `/work/${adj.prev.slug}`, title: adj.prev.title }}
          next={{ href: `/work/${adj.next.slug}`, title: adj.next.title }}
        />
      </div>
      <section aria-labelledby="work-cta" className="container-8bit flex flex-col items-center gap-sm pb-2xl text-center">
        <h2 id="work-cta" className="font-display text-display-sm font-normal tracking-[-0.05em] md:text-display-lg">Send a signal back.</h2>
        <ButtonPrimary href={`mailto:${profile.email}`}>Send a signal</ButtonPrimary>
      </section>
      <SiteFooter />
    </>
  );
}
