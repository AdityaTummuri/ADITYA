import { profile } from '@/content/profile';
import StatTile from '@/components/ui/StatTile';
import { projectsByGroup } from '@/content/projects';
import type { ProjectGroup } from '@/content/types';

const GROUP_LABELS: Record<ProjectGroup, string> = {
  'embedded-robotics': 'Embedded & robotics',
  'ai-ml': 'AI & ML',
  systems: 'Systems & tooling',
  experiments: 'Experiments',
  'products-analytics': 'Sports analytics',
};

/** About section body: focus areas, where the work sits, and school beside the numbers, toolkit and hackathon record. */
export default function AboutBlock() {
  const top = profile.languages[0];
  return (
    <div className="grid gap-lg lg:grid-cols-12 lg:gap-x-[var(--gutter)]">
      <ol className="border-t border-hairline lg:col-span-7">
        {profile.focusAreas.map((a, i) => (
          <li key={a.title} className="group grid grid-cols-[3.2rem_1fr] gap-xs border-b border-hairline py-sm transition-colors duration-300 hover:border-primary/60 md:grid-cols-[4.8rem_18rem_1fr]">
            <span className="text-body-sm text-primary">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="text-title-md font-medium transition-colors duration-300 group-hover:text-primary-soft">{a.title}</h3>
            <p className="col-start-2 text-body text-ink-muted md:col-start-3">{a.detail}</p>
          </li>
        ))}
        <li className="grid gap-xs border-b border-hairline py-sm md:grid-cols-[4.8rem_18rem_1fr]">
          <span className="text-body-sm text-primary md:col-span-2">Work by area</span>
          <ul className="grid gap-xxs text-body-sm sm:grid-cols-2 md:col-start-3">
            {(Object.keys(GROUP_LABELS) as ProjectGroup[]).map((g) => (
              <li key={g} className="flex justify-between gap-xs border-b border-hairline py-xxs">
                <span className="text-ink">{GROUP_LABELS[g]}</span>
                <span className="text-ink-muted">{projectsByGroup[g].length}</span>
              </li>
            ))}
          </ul>
        </li>
        <li className="grid gap-xs py-sm md:grid-cols-[4.8rem_18rem_1fr]">
          <span className="text-body-sm text-primary md:col-span-2">School</span>
          <p className="text-body text-ink md:col-start-3">
            {profile.degree} {profile.studying}, {profile.year}, {profile.university}. Based in {profile.location}.
          </p>
        </li>
        <li className="grid gap-xs border-t border-hairline py-sm md:grid-cols-[4.8rem_18rem_1fr]">
          <span className="text-body-sm text-primary md:col-span-2">Off the clock</span>
          <ul className="flex flex-wrap gap-xxs md:col-start-3">
            {profile.interests.map((i) => (
              <li key={i} className="rounded-xs border border-hairline px-xs py-[0.4rem] text-body-sm text-ink transition duration-300 ease-out-cubic hover:-translate-y-[2px] hover:border-primary/60">
                {i}
              </li>
            ))}
          </ul>
        </li>
      </ol>
      <div className="grid content-start gap-md lg:col-span-5">
        <div className="grid grid-cols-2 gap-xs">
          <StatTile value={String(profile.stats.original)} label="original projects" />
          <StatTile value={String(profile.stats.repos)} label="repositories on GitHub" />
          <StatTile value={String(profile.hackathons.length)} label="hackathons and research" />
          <StatTile value={`${top.share}%`} label={`${top.name}, the most-written language`} />
        </div>
        <div>
          <h3 className="text-body-sm text-ink-muted">Toolkit</h3>
          <ul className="mt-xxs flex flex-wrap gap-xxs">
            {profile.toolkit.map((t) => (
              <li key={t} className="rounded-xs border border-hairline px-xs py-[0.4rem] text-body-sm text-ink transition duration-300 ease-out-cubic hover:-translate-y-[2px] hover:border-primary/60">
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-body-sm text-ink-muted">Hackathons and research</h3>
          <ul className="mt-xxs border-t border-hairline">
            {profile.hackathons.map((h) => (
              <li key={`${h.event}-${h.project}`} className="grid grid-cols-[1fr_auto] gap-xs border-b border-hairline py-xxs text-body-sm">
                <span className="text-ink">{h.project}</span>
                <span className="text-right text-ink-muted">{h.event}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
