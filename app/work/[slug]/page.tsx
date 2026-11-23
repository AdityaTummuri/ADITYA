import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import SiteFooter from '@/components/chrome/SiteFooter';
import Rich from '@/components/receipt/Rich';
import Page from '@/components/travel/Page';
import RoomKeys from '@/components/travel/RoomKeys';
import { RoomLead, RoomTitle } from '@/components/work/RoomHead';
import RoomNav from '@/components/work/RoomNav';
import Story from '@/components/work/Story';
import { kavachCopy, matrixCopy } from '@/content/exhibits';
import { adjacentRooms, getRoom, rooms } from '@/content/rooms';
import type { Room } from '@/content/types';
import type { KavachMessage } from '@/lib/kavach';

// Each exhibit is its own chunk, loaded only by its own room.
const QedLadder = dynamic(() => import('@/components/exhibits/QedLadder'));
const ConfusionMatrix = dynamic(() => import('@/components/exhibits/ConfusionMatrix'));
const TerrainSlider = dynamic(() => import('@/components/exhibits/TerrainSlider'));
const KavachSwitches = dynamic(() => import('@/components/exhibits/KavachSwitches'));

export const dynamicParams = false;

export function generateStaticParams() {
  return rooms.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const room = getRoom(slug);
  if (!room) return {};
  return {
    title: room.title,
    description: room.description,
    openGraph: { title: room.title, description: room.description, url: `/work/${room.slug}` },
    alternates: { canonical: `/work/${room.slug}` },
  };
}

function Exhibit({ room }: { room: Room }) {
  switch (room.slug) {
    case 'qedcode':
      return <QedLadder />;
    case 'fracsst-mamba':
      return <ConfusionMatrix f1={<Rich>{matrixCopy.f1}</Rich>} />;
    case 'netra-ugv':
      return <TerrainSlider />;
    case 'kavach-upi': {
      const messages = Object.fromEntries(Object.entries(kavachCopy.states).map(([k, v]) => [k, <Rich key={k}>{v}</Rich>])) as Record<KavachMessage, React.ReactNode>;
      return <KavachSwitches messages={messages} spoken={<Rich>{kavachCopy.spoken}</Rich>} />;
    }
  }
}

export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const room = getRoom(slug);
  const adj = adjacentRooms(slug);
  if (!room || !adj) notFound();
  const wide = room.slug === 'netra-ugv';
  const index = rooms.findIndex((r) => r.slug === room.slug);

  const panel = (
    <div className={`panel p-[2rem] ${wide ? 'md:p-sm' : 'md:p-md'}`}>
      <div className={wide ? 'grid gap-xxs lg:grid-cols-12 lg:gap-x-[var(--gutter)]' : undefined}>
        <h2 className={`text-title-lg ${wide ? 'lg:col-span-5' : ''}`}>{room.exhibit.title}</h2>
        <p className={`max-w-[62ch] text-body text-ink-muted ${wide ? 'lg:col-span-7' : 'mt-xxs'}`}>
          <Rich>{room.exhibit.intro}</Rich>
        </p>
      </div>
      <div className="mt-sm">
        <Exhibit room={room} />
      </div>
      <p className="mt-sm max-w-[70ch] text-body-sm text-ink-muted">
        <Rich>{room.exhibit.label}</Rich>
      </p>
    </div>
  );

  return (
    <Page>
      <section id="exhibit" aria-label="Exhibit" className="container-8bit relative overflow-clip pb-xl pt-[calc(var(--header-height)+2rem)] md:pt-[calc(var(--header-height)+4rem)]">
        <div aria-hidden className="speedlines" style={{ '--cx': '80%', '--cy': '30%', opacity: 0.09 } as React.CSSProperties} />
        <div className="relative grid gap-md [&>*]:min-w-0">
          <RoomTitle room={room} index={index} />
          {wide ? (
            <>
              <RoomLead room={room} wide />
              {panel}
            </>
          ) : (
            <div className="grid gap-lg lg:grid-cols-12 lg:gap-x-[var(--gutter)] lg:items-start">
              <div className="lg:col-span-5">
                <RoomLead room={room} />
              </div>
              <div className="lg:col-span-7">{panel}</div>
            </div>
          )}
        </div>
      </section>
      <section id="story" aria-label="Story" className="container-8bit scroll-mt-[8rem] py-xl">
        <Story room={room} />
      </section>
      <div id="next" className="container-8bit scroll-mt-[8rem] pb-xl">
        <RoomNav prev={adj.prev} next={adj.next} />
      </div>
      <SiteFooter links />
      <RoomKeys />
    </Page>
  );
}
