import type { Metadata, Viewport } from 'next';
import { Inter_Tight, Roboto_Condensed } from 'next/font/google';
import './globals.css';
import SkipLink from '@/components/chrome/SkipLink';
import Header from '@/components/chrome/Header';
import MenuPanel from '@/components/chrome/MenuPanel';
import SceneCanvas from '@/components/scene/SceneCanvas';
import { SITE_URL } from '@/lib/seo';
import Providers from './providers';

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-inter-tight',
  display: 'swap',
});
const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-roboto-condensed',
  display: 'swap',
});

export const viewport: Viewport = { themeColor: '#000000' };

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Aditya Tummuri — The Dreaming Machine',
  description:
    'An ECE student working where software runs into the physical world — sensors and signals, models small enough for the edge, robots that perceive terrain, and the Linux tools that hold it all together.',
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
          <style>{'[data-split]{visibility:visible!important}'}</style>
        </noscript>
        <main id="main" className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
