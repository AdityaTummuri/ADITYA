import type { Metadata } from 'next';
import { Inter_Tight, Roboto_Condensed } from 'next/font/google';
import './globals.css';

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

export const metadata: Metadata = {
  title: 'Aditya Tummuri — The Dreaming Machine',
  description:
    'An ECE student working where software runs into the physical world — sensors and signals, models small enough for the edge, robots that perceive terrain, and the Linux tools that hold it all together.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${interTight.variable} ${robotoCondensed.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-[var(--margin)] focus:top-4 focus:z-[100] focus:bg-inverse-canvas focus:px-4 focus:py-2 focus:text-inverse-ink"
        >
          Skip to content
        </a>
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
