import type { Copy } from './types';

/**
 * Copy for the pages that are not rooms or the archive. `{receipt-id}` is a number you can pull;
 * `{date}`, `{best-date}` and `{opened}` are dates read from content/github.json.
 */
export const home = {
  kicker: 'Year two, ECE, Kerala',
  h1Lines: ['I don’t trust a number', 'until I can run it again.'],
  statement: 'Aditya Tummuri, engineering student and builder.',
  paragraph: 'I study electronics and communication engineering in Kerala, India. I build a checker for AI-written code, radar and robot vision models, and small tools. Press any underlined number on this site and you get the file it came from.',
  primary: 'See the four projects',
  secondary: 'All receipts',
  tapHint: 'Tap anywhere on the page. It reacts.',
  receiptLabel: 'This is what one looks like.',
  receiptTag: 'Press a number',
  receiptHeading: 'An example receipt',
  workKicker: 'The main arc',
  workHeading: 'Four projects, each with its working.',
  workMore: 'Everything else I’ve built',
  episode: 'Read the episode',
  sideKicker: 'Side quests',
  sideHeading: 'Everything I built on the way.',
  contactKicker: 'Next episode',
  contactHeading: 'Write to me.',
  contactParagraph: 'I’m open to collaborations. Email is quickest.',
  statsKicker: 'Player card',
  snapshot: 'As of {date} my GitHub holds {gh-repos}, {gh-originals} of them original.' as Copy,
  places: [
    { label: 'The archive', href: '/archive' },
    { label: 'About me', href: '/about' },
    { label: 'Every receipt', href: '/receipts' },
  ],
};

export const about = {
  h1: 'I’m Aditya Tummuri.',
  p1: 'I’m in the second year of a B.Tech in Electronics and Communication Engineering at Amrita Vishwa Vidyapeetham, Amritapuri, in Kerala, India. I like games, movies and anime, and I’m open to collaborations.',
  sections: [
    {
      heading: 'The habit in all of it',
      body: 'I don’t trust a number until I can run it again. QEDCode makes AI show its work. Saans {ar-saans-rule}. In Occasio a rules engine decides every rupee and the model only writes the words. FracSST-Mamba is split by person and reports {fs-acc}, where a leaky split would show {fs-leak}. In NETRA-UGV I asked for measured results to be kept apart from targets.' as Copy,
    },
    {
      heading: 'Working with other people',
      body: 'Several of these are team projects. Each one says near the top how many of its commits are mine.' as Copy,
    },
    {
      heading: 'On GitHub, as of {date}' as Copy,
      body: '{gh-repos}: {gh-originals} original and {gh-forks} forks, with {gh-stars} on the originals. {gh-contrib} in the last twelve months, {gh-private} of them private, across {gh-days}. My busiest day was {best-date}, with {gh-best}. The account opened on {opened}.' as Copy,
    },
  ],
  links: [
    { label: 'Write to me', href: 'mailto:adityafrom2007@gmail.com' },
    { label: 'The four projects', href: '/#work' },
    { label: 'The archive', href: '/archive' },
  ],
};

export const archivePage = {
  h1: 'Everything else I’ve built.',
  intro: 'One line and one number each. The repository name opens the code.',
  groups: ['On my own', 'With a team'],
  removed: 'Some projects that used to be listed here are gone, because I can no longer link them to a public source.',
};

export const receiptsPage = {
  h1: 'Every number on this site.',
  intro: 'Each one came from a file, a command, or GitHub itself. Press Check and your browser asks GitHub for the file and looks for the line. Nothing passes through me.',
  checkAll: 'Check every quoted line',
  noscript: 'Checking needs JavaScript. Each receipt links to its file on GitHub.',
};

export const notFound = {
  h1: 'This page isn’t here.',
  p: 'The address may have a typo, or the page went when I rebuilt the site.',
  primary: 'Back to the start',
  secondary: 'See the work',
};

export const errorPage = {
  h1: 'That didn’t load.',
  p: 'Check your connection and try again.',
  primary: 'Try again',
  secondary: 'Back to the start',
};

export const footer = {
  line: '© 2026 Aditya Tummuri. No cookies, no trackers. Checking a receipt asks GitHub directly from your browser.',
};

/** Every Copy string above that may hold tokens, for tests. */
export function pageCopy(): string[] {
  return [
    home.snapshot,
    about.p1,
    ...about.sections.flatMap((s) => [s.heading, s.body]),
  ];
}
