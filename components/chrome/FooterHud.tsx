import { profile } from '@/content/profile';
import { socials } from '@/content/nav';

/** Home-only fixed bottom row (DESIGN.md `footer-hud`). */
export default function FooterHud({ hint }: { hint?: React.ReactNode }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-[var(--margin)] py-[2rem] text-body-sm lg:bottom-[4rem] lg:py-0">
      <span aria-hidden className="absolute inset-0 bg-canvas lg:hidden" />
      <div className="relative flex flex-wrap items-end justify-between gap-xs">
        <p className="pointer-events-auto text-ink-subtle">
          2026 © {profile.name}. No cookies, no trackers.
        </p>
        <div className="pointer-events-auto flex items-center gap-md text-ink">
          {hint}
          <ul className="flex gap-xs">
            {socials.map((s) => (
              <li key={s.href}>
                <a href={s.href} className="transition-opacity duration-300 ease-out-cubic hover:opacity-50">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
