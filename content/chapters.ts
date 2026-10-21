import type { ChapterSpec } from './types';

export const chapters: ChapterSpec[] = [
  {
    id: 'hero', index: 0, label: '00',
    overline: 'I build machines', title: ['that dream in', 'signals & motion.'],
    statement: 'An ECE student working where software runs into the physical world.',
    paragraph: 'Sensors and signals, models small enough for the edge, robots that perceive terrain, and the Linux tools that hold it all together.',
    cta: { label: 'Receive transmissions', href: '#transmissions' },
    look: 'streaks', pinViewports: 3, body: 'focus-cards',
  },
  {
    id: 'transmissions', index: 1, label: '01',
    overline: 'Selected', title: ['Transmissions'],
    statement: 'Four pieces of work, labelled for what they are.',
    paragraph: 'A motor that reports its own health, a ground vehicle that reads terrain, a radar that recognises movement, and the terminal that follows me between machines.',
    cta: { label: 'Open the index', href: '#index' },
    look: 'grid', pinViewports: 3, body: 'project-cards',
  },
  {
    id: 'index', index: 2, label: '02',
    overline: 'Labelled for', title: ['what it is.'],
    statement: 'Twenty projects, each with its status attached.',
    paragraph: 'Prototype, concept, tooling, collaborative, research, experiment — the label says what was proven and what still needs proving.',
    cta: { label: 'All repositories on GitHub', href: 'https://github.com/AdityaTummuri' },
    look: 'calm', pinViewports: 1, body: 'project-rows',
  },
  {
    id: 'notes', index: 3, label: '03',
    overline: 'Field notes', title: ['from the bench.'],
    statement: 'What the work taught me, in three lines.',
    paragraph: 'Short notes from the audio, radar and Linux work: where leverage comes from, how to touch hardware carefully, and why everything gets a label.',
    look: 'cloud', pinViewports: 2, body: 'notes',
  },
  {
    id: 'now', index: 4, label: '04',
    overline: 'A systems mind,', title: ['with a sense of wonder.'],
    statement: 'Embedded sensing, signal processing, edge ML — and the tools around them.',
    paragraph: 'Studying ECE at Amrita Vishwa Vidyapeetham, Amritapuri, in Kerala. Student and builder.',
    look: 'streaks', pinViewports: 2, body: 'now',
  },
  {
    id: 'contact', index: 5, label: '05',
    overline: 'Send a', title: ['signal back.'],
    statement: 'Email is the fastest way in.',
    paragraph: 'Field notes from Aditya Tummuri, Kerala, India.',
    cta: { label: 'Send a signal', href: 'mailto:adityafrom2007@gmail.com' },
    look: 'tunnel', pinViewports: 2, body: 'contact',
  },
];
