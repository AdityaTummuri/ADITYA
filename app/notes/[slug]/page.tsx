import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SiteFooter from '@/components/chrome/SiteFooter';
import PrevNext from '@/components/work/PrevNext';
import SetLook from '@/components/work/SetLook';
import FeatureRow from '@/components/ui/FeatureRow';
import Overline from '@/components/ui/Overline';
import TextLinkArrow from '@/components/ui/TextLinkArrow';
import { adjacentNote, getNote, notes } from '@/content/notes';
import { getProject } from '@/content/projects';

export const dynamicParams = false;

export function generateStaticParams() {
  return notes.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const n = getNote(slug);
  if (!n) return {};
  return { title: `${n.title} — Aditya Tummuri`, description: n.quote, openGraph: { title: n.title, description: n.quote } };
}

export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = getNote(slug);
  const adj = adjacentNote(slug);
  if (!note || !adj) notFound();
  const related = note.related.map(getProject).filter((p) => p !== undefined);
  return (
    <>
      <SetLook look="cloud" />
      <article className="container-8bit mx-auto max-w-[96rem] pb-xl pt-[calc(var(--header-height)+10rem)]">
        <Overline>{`Note ${note.index}`}</Overline>
        <h1 className="mt-xs font-display text-display-sm font-normal tracking-[-0.05em] md:text-display-lg">{note.title}</h1>
        <blockquote className="mt-lg max-w-[72rem] text-title-md font-medium">{note.quote}</blockquote>
        <section aria-labelledby="related" className="mt-xl">
          <h2 id="related" className="mb-xs text-body-sm text-ink-muted">Related work</h2>
          <div className="border-t border-hairline">
            {related.map((p) => (
              <FeatureRow key={p.slug} title={p.title} aside={p.status}>
                <p>{p.summary}</p>
                <div className="mt-xs">
                  {p.tradeoff ? <TextLinkArrow href={`/work/${p.slug}`}>Read the transmission</TextLinkArrow> : p.repo ? <TextLinkArrow href={p.repo}>Repository</TextLinkArrow> : null}
                </div>
              </FeatureRow>
            ))}
          </div>
        </section>
        <div className="mt-xl">
          <PrevNext
            noun="notes"
            prev={{ href: `/notes/${adj.prev.slug}`, title: adj.prev.title }}
            next={{ href: `/notes/${adj.next.slug}`, title: adj.next.title }}
          />
        </div>
      </article>
      <SiteFooter />
    </>
  );
}
