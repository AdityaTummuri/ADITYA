import type { Note } from './types';

export const notes: Note[] = [
  {
    slug: 'features-before-models',
    index: '01',
    title: 'Features before models',
    quote:
      'On the audio and radar work, most of the leverage came from how the signal was framed and filtered. A smaller model on well-prepared features is easier to run on a device and easier to reason about.',
    related: ['fracsst-mamba', 'vocal-biomarker-edge', 'rotormind'],
  },
  {
    slug: 'touching-hardware-carefully',
    index: '02',
    title: 'Touching hardware carefully',
    quote:
      'Writing fan control for a laptop the vendor doesn’t support on Linux meant reading carefully before writing anything. The rule I keep: fail safe, log everything, and make the default the hardware’s own behaviour.',
    related: ['hp-omen-fan-control', 'rotormind'],
  },
  {
    slug: 'labelling-work-honestly',
    index: '03',
    title: 'Labelling work honestly',
    quote:
      'A lot of what I build is a prototype, a concept or a team effort. Saying which is which keeps me honest about what I actually learned — and what still needs proving.',
    related: ['netra-ugv', 'trapsight', 'the-palesignal'],
  },
];

export function getNote(slug: string): Note | undefined {
  return notes.find((n) => n.slug === slug);
}

export function adjacentNote(slug: string): { prev: Note; next: Note } | undefined {
  const i = notes.findIndex((n) => n.slug === slug);
  if (i < 0) return undefined;
  return { prev: notes[(i - 1 + notes.length) % notes.length], next: notes[(i + 1) % notes.length] };
}
