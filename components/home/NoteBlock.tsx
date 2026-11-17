import Link from 'next/link';
import { notes } from '@/content/notes';
import Reveal from '@/components/ui/Reveal';
import CardTilt from '@/components/ui/CardTilt';

/**
 * Chapter 03 Field Dispatches:
 * Curated, reactive cards with 3D tilt, cursor spotlight,
 * telemetry header, and hover micro-interactions.
 */
export default function NoteBlock() {
  return (
    <div className="grid gap-md md:grid-cols-3">
      {notes.map((n, idx) => (
        <Reveal key={n.slug}>
          <CardTilt className="h-full">
            <Link
              href={`/notes/${n.slug}`}
              className="group flex h-full flex-col justify-between rounded-sm border border-hairline/60 bg-[#080b0d]/80 p-md backdrop-blur-md transition-all duration-300 hover:border-primary/60 hover:bg-[#0c1013]"
            >
              <div>
                {/* Header telemetry badge */}
                <div className="mb-xs flex items-center justify-between border-b border-hairline/40 pb-xxs text-[1.05rem] font-mono">
                  <div className="flex items-center gap-xxs">
                    <span className="h-[0.55rem] w-[0.55rem] rounded-full bg-primary animate-pulse" />
                    <span className="text-primary-soft">DISPATCH // {n.index}</span>
                  </div>
                  <span className="text-ink-subtle">03.{idx + 1}</span>
                </div>

                {/* Dispatch Title */}
                <h3 className="mb-xs flex items-center justify-between font-display text-title-lg tracking-[-0.03em] text-primary transition-colors duration-200 group-hover:text-primary-soft md:text-headline">
                  <span>{n.title}</span>
                  <span className="shrink-0 text-primary transition-transform duration-300 ease-out-cubic group-hover:translate-x-1.5" aria-hidden="true">
                    →
                  </span>
                </h3>

                {/* Quote / Preview */}
                <p className="text-[1.35rem] leading-relaxed text-ink-muted transition-colors duration-200 group-hover:text-ink">
                  {n.quote}
                </p>
              </div>

              {/* Related tags */}
              <div className="mt-md pt-xs border-t border-hairline/40 flex flex-wrap gap-xxs">
                {n.related.map((rel) => (
                  <span
                    key={rel}
                    className="rounded-xs bg-white/[0.03] px-xxs py-[0.15rem] font-mono text-[0.95rem] text-ink-subtle border border-hairline/30 transition-colors group-hover:border-primary/40 group-hover:text-ink-muted"
                  >
                    #{rel}
                  </span>
                ))}
              </div>
            </Link>
          </CardTilt>
        </Reveal>
      ))}
    </div>
  );
}
