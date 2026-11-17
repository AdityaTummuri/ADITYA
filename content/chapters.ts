import type { ChapterSpec } from './types';

export const chapters: ChapterSpec[] = [
  {
    id: 'hero', index: 0, label: '00',
    overline: 'AdityaTummuri',
    title: ['machines that', 'listen first.'],
    statement: 'b.tech ece, 2nd year. i make hardware and software meet.',
    paragraph: 'sensors, signals, small models, quiet tools. this is where the work lives, and i’m open to collaborations.',
    cta: { label: 'see the work', href: '#work' },
    look: 'streaks',
  },
  {
    id: 'work', index: 1, label: '01',
    overline: 'selected work',
    title: ['four builds.', 'the rest, quietly.'],
    statement: 'start here. each build began with a question.',
    cta: { label: 'all repositories on github', href: 'https://github.com/AdityaTummuri' },
    look: 'grid',
  },
  {
    id: 'about', index: 2, label: '02',
    overline: 'about',
    title: ['calm mind.', 'curious hands.'],
    statement: 'b.tech ece, 2nd year. kerala.',
    paragraph: 'i like signals, small models and tools that stay out of the way. off the clock it’s games, movies and anime.',
    look: 'calm',
  },
  {
    id: 'contact', index: 3, label: '03',
    overline: 'collaborate',
    title: ['let’s build', 'something.'],
    statement: 'open to collaborations. the work is the pitch.',
    paragraph: 'a few notes on how i work, then the quickest ways to reach me.',
    look: 'tunnel',
  },
];
