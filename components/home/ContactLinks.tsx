import { profile } from '@/content/profile';
import NoteBlock from './NoteBlock';

const row =
  'group flex items-baseline justify-between gap-xs border-b border-hairline py-md transition-colors duration-300 hover:border-primary/60';

/** Contact section body: the notes, then email, LinkedIn and GitHub as large links. */
export default function ContactLinks() {
  return (
    <div className="grid gap-lg">
      <NoteBlock />
      <div className="border-t border-hairline">
        <a href={`mailto:${profile.email}`} className={row}>
          <span className="font-display text-title-lg tracking-[-0.03em] text-primary [overflow-wrap:anywhere] transition-colors duration-300 group-hover:text-primary-soft md:text-headline">
            {profile.email}
          </span>
          <span aria-hidden className="text-title-md text-primary transition-transform duration-300 ease-out-cubic group-hover:-translate-y-[2px]">↗</span>
        </a>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className={row}>
          <span className="font-display text-title-lg tracking-[-0.03em] [overflow-wrap:anywhere] transition-colors duration-300 group-hover:text-primary-soft md:text-headline">
            linkedin.com/in/adityatummuri
          </span>
          <span aria-hidden className="text-title-md text-primary transition-transform duration-300 ease-out-cubic group-hover:-translate-y-[2px]">↗</span>
        </a>
        <a href={profile.github} target="_blank" rel="noopener noreferrer" className={row}>
          <span className="font-display text-title-lg tracking-[-0.03em] [overflow-wrap:anywhere] transition-colors duration-300 group-hover:text-primary-soft md:text-headline">
            github.com/AdityaTummuri
          </span>
          <span aria-hidden className="text-title-md text-primary transition-transform duration-300 ease-out-cubic group-hover:-translate-y-[2px]">↗</span>
        </a>
      </div>
    </div>
  );
}
