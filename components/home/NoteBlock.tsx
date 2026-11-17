import Link from 'next/link';
import { notes } from '@/content/notes';

/** Field notes: three short notes, each linking to its page. */
export default function NoteBlock() {
  return (
    <div id="notes" className="grid scroll-mt-[8rem] gap-sm md:grid-cols-3">
      {notes.map((n) => (
        <Link
          key={n.slug}
          href={`/notes/${n.slug}`}
          className="group flex h-full flex-col gap-xs rounded-md border border-hairline bg-canvas/60 p-md backdrop-blur-md transition duration-300 ease-out-cubic hover:-translate-y-[2px] hover:border-primary/60"
        >
          <span className="text-body-sm text-primary">note {n.index}</span>
          <h3 className="text-title-md font-medium transition-colors duration-300 group-hover:text-primary-soft">{n.title}</h3>
          <p className="line-clamp-4 text-body-sm text-ink-muted">{n.quote}</p>
        </Link>
      ))}
    </div>
  );
}
