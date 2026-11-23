import { archive } from '@/content/archive';
import { exhibitCopy } from '@/content/exhibits';
import { about, archivePage, errorPage, footer, home, notFound, pageCopy, receiptsPage } from '@/content/pages';
import { rooms } from '@/content/rooms';

/** Names and dates that contain digits and are allowed to be typed (plan 11.1). */
export const EXEMPT = [
  'RTX 4050', 'ROS 2', 'RELLIS-3D', 'BiSeNetV2', 'SIH26126', 'Smart India Hackathon 2026', 'Apache-2.0', 'Moneyball 2.0',
  '4B', 'PromptWars Virtual 2026', 'Next Byte Hacks V2', 'FIFA', 'Lochan-B-07', 'SWE-bench', '01:21 IST',
  // exhibit copy the plan writes with a digit: the metric's name and the "1 of 2" of the shield's waiting line
  'F1', 'Clean check 1 of 2',
];
export const DATE_PATTERNS = [/\d{1,2} [A-Z][a-z]{2} to \d{1,2} [A-Z][a-z]{2} \d{4}/g, /\d{1,2}( to \d{1,2})? [A-Z][a-z]{2} \d{4}/g, /\b20\d\d\b/g];
export const TOKEN = /\{([a-z0-9-]+)\}/g;
/** Tokens that are dates read from content/github.json, not receipts. */
export const DATE_TOKENS = ['date', 'best-date', 'opened'];

export const BANNED = [
  'RotorMind', 'MotorSafe', 'ArmMimic', 'Exo-Mimic', 'ASCII_CAM', 'Lumina', '3d-website', 'PaleSignal', 'LSTM', '92%', '15 fps', '10W',
  '2.6 ms', 'Keystore', '<80', '15°C', '<2s', 'faster anomaly', '120ms', 'listen first', 'the rest, quietly', 'pypi.org',
  'adityatummuri.github.io', '41 repos', 'Kotlin 39', '1,143',
];

/** Every string of copy that may hold receipt tokens. */
export function allCopy(): string[] {
  const out: string[] = [];
  for (const r of rooms) {
    out.push(r.lead, r.meta, r.row.finding, r.row.figureLabel, r.exhibit.title, r.exhibit.intro, r.exhibit.label, r.description);
    for (const s of r.story) out.push(s.heading, s.body);
    for (const l of r.links) out.push(l.label);
  }
  for (const a of archive) out.push(a.title, a.line, a.proof);
  out.push(...pageCopy(), ...exhibitCopy());
  out.push(
    ...home.h1Lines, home.statement, home.paragraph, home.primary, home.secondary, home.receiptLabel, home.receiptHeading, home.workHeading, home.workMore,
    home.contactHeading, home.contactParagraph, ...home.places.map((p) => p.label),
    about.h1, ...about.links.map((l) => l.label),
    archivePage.h1, archivePage.intro, archivePage.removed, ...archivePage.groups,
    receiptsPage.h1, receiptsPage.intro, receiptsPage.checkAll, receiptsPage.noscript,
    notFound.h1, notFound.p, notFound.primary, notFound.secondary,
    errorPage.h1, errorPage.p, errorPage.primary, errorPage.secondary,
    footer.line,
  );
  return out;
}

/** Copy with tokens, exempt names and dates removed. */
export function withoutAllowed(s: string): string {
  let t = s.replace(TOKEN, '');
  for (const name of EXEMPT) t = t.split(name).join('');
  for (const re of DATE_PATTERNS) t = t.replace(re, '');
  return t;
}
