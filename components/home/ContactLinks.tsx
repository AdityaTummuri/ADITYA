import { profile } from '@/content/profile';
import Reveal from '@/components/ui/Reveal';

/** Interactive direct contact channels with hover micro-interactions. */
export default function ContactLinks() {
  return (
    <Reveal>
      <div className="grid gap-xs">
        <a
          href={`mailto:${profile.email}`}
          className="group block rounded-xs border-t border-hairline py-md transition-all duration-300 hover:border-primary/60 hover:bg-white/[0.02] px-xs -mx-xs"
        >
          <div className="flex items-center justify-between font-mono text-[1.05rem] text-ink-subtle mb-xxs">
            <span className="flex items-center gap-xxs">
              <span className="h-[0.5rem] w-[0.5rem] rounded-full bg-primary" />
              DIRECT TRANSMISSION CHANNEL
            </span>
            <span className="transition-transform duration-300 ease-out-cubic group-hover:translate-x-1 group-hover:-translate-y-1 text-primary">
              ↗
            </span>
          </div>
          <span className="block font-display text-title-lg tracking-[-0.03em] [overflow-wrap:anywhere] text-primary transition-colors duration-300 group-hover:text-primary-soft md:text-headline">
            {profile.email}
          </span>
        </a>

        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-xs border-y border-hairline py-md transition-all duration-300 hover:border-primary/60 hover:bg-white/[0.02] px-xs -mx-xs"
        >
          <div className="flex items-center justify-between font-mono text-[1.05rem] text-ink-subtle mb-xxs">
            <span className="flex items-center gap-xxs">
              <span className="h-[0.5rem] w-[0.5rem] rounded-full bg-primary" />
              PUBLIC WORKSPACE & REPOSITORIES
            </span>
            <span className="transition-transform duration-300 ease-out-cubic group-hover:translate-x-1 group-hover:-translate-y-1 text-primary">
              ↗
            </span>
          </div>
          <span className="block font-display text-title-lg tracking-[-0.03em] [overflow-wrap:anywhere] text-ink transition-colors duration-300 group-hover:text-primary-soft md:text-headline">
            github.com/AdityaTummuri
          </span>
        </a>
      </div>
    </Reveal>
  );
}
