import Rich from '@/components/receipt/Rich';
import type { Room } from '@/content/types';

const PAPER = ['bg-surface-1', 'bg-[#fff1c2]', 'bg-[#dff5fb]', 'bg-[#ffe1ee]'];
const BEAT = ['one', 'two', 'three', 'four'];

/** The four story parts as four cuts: a sticker, a heading and a paragraph on coloured paper. */
export default function Story({ room }: { room: Room }) {
  return (
    <div className="grid gap-md md:grid-cols-2 [&>*]:min-w-0">
      {room.story.map((part, i) => (
        <section key={part.heading} className={`panel lift p-md ${PAPER[i % PAPER.length]}`}>
          <p className="sticker sticker-white">Cut {BEAT[i]}</p>
          <h2 className="mt-xs text-title-lg">{part.heading}</h2>
          <p className="prose-measure mt-xxs text-body text-ink-muted">
            <Rich>{part.body}</Rich>
          </p>
        </section>
      ))}
    </div>
  );
}
