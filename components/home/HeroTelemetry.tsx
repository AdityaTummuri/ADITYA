import { profile } from '@/content/profile';

/**
 * The hero's right-hand panel: the real numbers behind the work (project and repository counts,
 * what the code is written in), not a drawing. Replaces the hexagon-and-sine-wave mark.
 */
export default function HeroTelemetry() {
  const top = profile.languages[0].share;
  const stats = [
    { value: profile.stats.original, label: 'original projects' },
    { value: profile.stats.repos, label: 'repositories' },
    { value: profile.hackathons.length, label: 'hackathons and research' },
  ];
  return (
    <section
      aria-label="The numbers"
      className="rounded-md border border-hairline bg-canvas/60 p-md backdrop-blur-md transition-transform duration-300 ease-out-cubic hover:-translate-y-[2px]"
    >
      <div className="flex items-baseline justify-between gap-xs border-b border-hairline pb-xs text-body-sm text-ink-muted">
        <span className="text-primary">the numbers</span>
        <span>{profile.location} · 2026</span>
      </div>
      <dl className="mt-sm grid grid-cols-3 gap-xs">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col">
            <dt className="order-2 text-body-sm text-ink-muted">{s.label}</dt>
            <dd className="font-display text-headline tracking-[-0.03em] text-ink">{s.value}</dd>
          </div>
        ))}
      </dl>
      <h2 className="mt-md text-body-sm text-ink-muted">written in</h2>
      <ul className="mt-xxs grid gap-xxs">
        {profile.languages.map((l) => (
          <li key={l.name} className="grid grid-cols-[8rem_1fr_4.4rem] items-center gap-xs text-body-sm">
            <span className="text-ink">{l.name}</span>
            <span className="h-[0.4rem] bg-ink-tertiary">
              <span className="block h-full bg-primary" style={{ width: `${(l.share / top) * 100}%` }} />
            </span>
            <span className="text-right text-ink-muted">{l.share}%</span>
          </li>
        ))}
      </ul>
      <p className="mt-md border-t border-hairline pt-xs text-body-sm text-ink-muted">{profile.roleLine}</p>
    </section>
  );
}
