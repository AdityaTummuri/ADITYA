import type { Metadata, Viewport } from 'next';
import { Bricolage_Grotesque, Dela_Gothic_One, DM_Mono } from 'next/font/google';
import './globals.css';
import SkipLink from '@/components/chrome/SkipLink';
import Header from '@/components/chrome/Header';
import MenuPanel from '@/components/chrome/MenuPanel';
import FxRuntime from '@/components/fx/FxRuntime';
import SlipLoader from '@/components/receipt/SlipLoader';
import TravelListener from '@/components/travel/TravelListener';
import { SITE_URL } from '@/lib/seo';

const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage', display: 'swap' });
const dela = Dela_Gothic_One({ subsets: ['latin'], weight: '400', variable: '--font-dela', display: 'swap' });
const mono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' });

export const viewport: Viewport = { themeColor: '#f7f0e0' };

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
    <html lang="en" className={`${bricolage.variable} ${dela.variable} ${mono.variable}`}>
      <body>
        <SkipLink />
        <Header />
        <MenuPanel />
        <noscript>
          <style>{'[data-needs-js]{display:none!important}'}</style>
        </noscript>
        <main id="main" className="relative z-10">{children}</main>
        <SlipLoader />
        <TravelListener />
        <FxRuntime />
      </body>
    </html>
  );
}
