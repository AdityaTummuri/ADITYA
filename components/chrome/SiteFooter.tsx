import Link from 'next/link';
import { footer } from '@/content/pages';
import { footerLinks, socials } from '@/content/nav';

const LINK = 'press inline-flex min-h-[4.4rem] items-center text-body-sm text-ink hover:text-primary-soft';

/**
 * The last thing on every page: one row on solid canvas. Pages other than the home also link to the
 * five places (`links`). Without JavaScript the menu cannot open, so this row carries every link.
 */
export default function SiteFooter({ links = false }: { links?: boolean }) {
  return (
    <footer className="relative z-10 bg-canvas px-[var(--margin)] py-xs">
      <div className="grid gap-xxs">
        <p className="max-w-[80rem] text-body-sm text-ink-subtle">{footer.line}</p>
        <div className="flex flex-wrap items-center justify-between gap-x-lg gap-y-0">
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
