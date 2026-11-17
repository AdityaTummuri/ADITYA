import { profile } from '@/content/profile';
import StatTile from '@/components/ui/StatTile';
import FeatureRow from '@/components/ui/FeatureRow';
import Reveal from '@/components/ui/Reveal';
import CardTilt from '@/components/ui/CardTilt';

/** Now chapter body: interactive stat tiles with tilt, reactive toolkit chips, and research rows. */
export default function NowTiles() {
  const top = profile.languages[0];
  return (
    <div className="grid gap-xl">
      <Reveal className="grid gap-xs sm:grid-cols-2 lg:grid-cols-4">
        <CardTilt>
          <StatTile value={String(profile.stats.original)} label="original projects" />
        </CardTilt>
        <CardTilt>
          <StatTile value={String(profile.stats.repos)} label="repositories on GitHub" />
        </CardTilt>
        <CardTilt>
          <StatTile value={String(profile.hackathons.length)} label="hackathons and research entries" />
        </CardTilt>
        <CardTilt>
          <StatTile value={`${top.share}%`} label={`${top.name}, the most-written language`} />
        </CardTilt>
      </Reveal>
      <Reveal>
        <div className="flex items-center justify-between mb-xs">
          <h3 className="text-title-md font-medium">Toolkit & Core Technologies</h3>
          <span className="font-mono text-[1.05rem] text-ink-subtle">// {profile.toolkit.length} ACTIVE MODULES</span>
        </div>
        <ul className="flex flex-wrap gap-xs border-t border-hairline/60 pt-sm">
          {profile.toolkit.map((t) => (
            <li
              key={t}
              className="cursor-default select-none rounded-xs border border-hairline/60 bg-white/[0.03] px-xs py-[0.35rem] font-mono text-[1.1rem] text-ink-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/80 hover:bg-primary/10 hover:text-primary-soft hover:shadow-[0_0_12px_rgba(143,170,178,0.2)]"
            >
              {t}
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal>
        <div className="flex items-center justify-between mb-xs">
          <h3 className="text-title-md font-medium">Hackathons and Research</h3>
          <span className="font-mono text-[1.05rem] text-ink-subtle">// RECOGNITIONS</span>
        </div>
        <div className="border-t border-hairline">
          {profile.hackathons.map((h) => (
            <FeatureRow key={`${h.event}-${h.project}`} title={h.project} aside={h.event}>
              {h.domain}
            </FeatureRow>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
