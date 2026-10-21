import { profile } from '@/content/profile';
import StatTile from '@/components/ui/StatTile';
import FeatureRow from '@/components/ui/FeatureRow';
import Reveal from '@/components/ui/Reveal';

/** Now chapter body: the only boxes on the home (stat tiles), toolkit line and hackathon rows. */
export default function NowTiles() {
  const top = profile.languages[0];
  return (
    <div className="grid gap-xl">
      <Reveal className="grid gap-xs sm:grid-cols-2 lg:grid-cols-4">
        <StatTile value={String(profile.stats.original)} label="original projects" />
        <StatTile value={String(profile.stats.repos)} label="repositories on GitHub" />
        <StatTile value={String(profile.hackathons.length)} label="hackathons and research entries" />
        <StatTile value={`${top.share}%`} label={`${top.name}, the most-written language`} />
      </Reveal>
      <Reveal>
        <h3 className="mb-xs text-title-md font-medium">Toolkit</h3>
        <ul className="flex flex-wrap gap-x-md gap-y-xxs border-t border-hairline pt-sm text-body">
          {profile.toolkit.map((t) => (<li key={t}>{t}</li>))}
        </ul>
      </Reveal>
      <Reveal>
        <h3 className="mb-xs text-title-md font-medium">Hackathons and research</h3>
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
