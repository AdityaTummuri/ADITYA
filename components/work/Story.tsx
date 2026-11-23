import Rich from '@/components/receipt/Rich';
import type { Room } from '@/content/types';

/** The four story parts in a 2x2 grid; each heading and paragraph is plain reading. */
export default function Story({ room }: { room: Room }) {
  return (
    <div className="grid gap-x-[var(--gutter)] gap-y-[5.6rem] md:grid-cols-2 md:gap-x-[6rem]">
      {room.story.map((part) => (
        <section key={part.heading}>
          <h2 className="font-display text-title-lg">{part.heading}</h2>
          <p className="prose-measure mt-xs text-body text-ink-muted">
            <Rich>{part.body}</Rich>
          </p>
        </section>
      ))}
    </div>
  );
}
