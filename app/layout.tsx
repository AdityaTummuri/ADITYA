import type { Metadata, Viewport } from 'next';
import { Inter_Tight, Roboto_Condensed } from 'next/font/google';
import './globals.css';
import SkipLink from '@/components/chrome/SkipLink';
import Header from '@/components/chrome/Header';
import MenuPanel from '@/components/chrome/MenuPanel';
import SlipLoader from '@/components/receipt/SlipLoader';
import SceneCanvas from '@/components/scene/SceneCanvas';
import TravelListener from '@/components/travel/TravelListener';
import { SITE_URL } from '@/lib/seo';
import Providers from './providers';

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter-tight',
  display: 'swap',
});
const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-roboto-condensed',
  display: 'swap',
});

export const viewport: Viewport = { themeColor: '#000000' };

const DESCRIPTION =
  'Aditya Tummuri is an electronics and communication engineering student in Kerala, India. Projects in AI code checking, radar and robot vision, with every number linked to its source.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Aditya Tummuri', template: '%s | Aditya Tummuri' },
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: { title: 'Aditya Tummuri', description: DESCRIPTION, url: '/' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${interTight.variable} ${robotoCondensed.variable}`}>
      <body>
        <SkipLink />
        <Header />
        <MenuPanel />
        <Providers />
        <SceneCanvas />
        <noscript>
          <style>{'[data-needs-js]{display:none!important}'}</style>
        </noscript>
        <main id="main" className="relative z-10">{children}</main>
        <SlipLoader />
        <TravelListener />
      </body>
    </html>
  );
}
