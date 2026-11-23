import Link from 'next/link';
import { footer } from '@/content/pages';
import { footerLinks, socials } from '@/content/nav';

const LINK = 'link text-body-sm';

/**
 * The last thing on every page. Pages other than the home also link to the five places (`links`).
 * Without JavaScript the menu cannot open, so this row carries every link.
 */
export default function SiteFooter({ links = false }: { links?: boolean }) {
  return (
    <footer className="relative z-10 border-t-[0.3rem] border-ink bg-ink px-[var(--margin)] py-md text-canvas">
      <div className="mx-auto grid max-w-[162rem] gap-xs">
        <p aria-hidden className="font-poster text-[clamp(4rem,12vw,15rem)] leading-[0.85] text-pink">ADITYA</p>
        <p className="max-w-[80rem] text-body-sm text-canvas/80">{footer.line}</p>
        <div className="flex flex-wrap items-center justify-between gap-x-lg gap-y-xxs [&_.link]:text-canvas">
          {links ? (
            <nav aria-label="Pages">
              <ul className="flex flex-wrap gap-x-md">
                {footerLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={LINK}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
          <nav aria-label="Elsewhere">
            <ul className="flex flex-wrap gap-x-md">
              {socials.map((s) => (
                <li key={s.href}>
                  <a href={s.href} className={LINK}>{s.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
