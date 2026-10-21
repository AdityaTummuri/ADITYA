import Link from 'next/link';
import { featuredProjects } from '@/content/projects';
import { notes } from '@/content/notes';
import { profile } from '@/content/profile';

/** Closing footer for inner pages and the end of the home (DESIGN.md `footer`). */
export default function SiteFooter() {
  const col = 'flex flex-col gap-xs';
  const link = 'text-body text-ink transition-opacity duration-300 ease-out-cubic hover:opacity-50';
  return (
    <footer className="container-8bit grid gap-xl bg-canvas py-xl md:grid-cols-[1fr_auto]">
      <div>
        <p className="font-display text-headline tracking-[-0.03em]">{profile.name}</p>
        <p className="mt-xs text-ink-muted">{profile.phrases.identity}</p>
      </div>
      <div className="grid gap-lg sm:grid-cols-3">
        <div className={col}>
          <h2 className="text-[2rem] font-light leading-[1.4]">Work</h2>
          {featuredProjects.map((p) => (
            <Link key={p.slug} href={`/work/${p.slug}`} className={link}>{p.title}</Link>
          ))}
        </div>
        <div className={col}>
          <h2 className="text-[2rem] font-light leading-[1.4]">Notes</h2>
          {notes.map((n) => (
            <Link key={n.slug} href={`/notes/${n.slug}`} className={link}>{n.title}</Link>
          ))}
        </div>
        <div className={col}>
          <h2 className="text-[2rem] font-light leading-[1.4]">Elsewhere</h2>
          <a href={profile.github} className={link}>GitHub</a>
          <a href={`mailto:${profile.email}`} className={link}>Email</a>
        </div>
      </div>
      <p className="text-body-sm text-ink-subtle md:col-span-2">
        2026 © {profile.name}. No cookies, no trackers.
      </p>
    </footer>
  );
}
