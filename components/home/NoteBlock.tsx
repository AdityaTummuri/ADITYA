import Link from 'next/link';
import { notes } from '@/content/notes';

/** The three field notes: statement-sized teal titles with their quote beneath. */
export default function NoteBlock() {
  return (
    <ol className="grid gap-lg">
      {notes.map((n) => (
        <li key={n.slug}>
          <article className="grid gap-xs border-t border-hairline pt-sm">
            <h3 className="font-display text-display-sm tracking-[-0.03em] text-primary md:text-headline">
              <Link href={`/notes/${n.slug}`} className="transition-opacity duration-300 ease-out-cubic hover:opacity-50">
                {n.title}
              </Link>
            </h3>
            <p className="text-title-md font-medium">{n.quote}</p>
          </article>
        </li>
      ))}
    </ol>
  );
}
