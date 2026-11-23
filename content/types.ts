export type Look = 'streaks' | 'grid' | 'calm' | 'cloud' | 'tunnel';
export type RoomSlug = 'qedcode' | 'fracsst-mamba' | 'netra-ugv' | 'kavach-upi';

interface ReceiptBase { id: string; value: string; claim: string; repo: string }
/** A line of a file. `quote` is matched with all whitespace removed on both sides. */
export interface QuotedReceipt extends ReceiptBase { kind: 'quoted'; path: string; quote: string }
/** A count anyone can repeat. */
export interface CountedReceipt extends ReceiptBase { kind: 'counted'; command: string; path?: string }
/** Arithmetic on other receipts. */
export interface ComputedReceipt extends ReceiptBase { kind: 'computed'; from: string[]; working: string }
/** A field of GitHub's public API, read from content/github.json. */
export interface ApiReceipt extends ReceiptBase { kind: 'api'; url: string; field: 'public_repos' | 'originals' | 'forks' | 'originalStars' | 'stargazers_count' }
/** Read by eye on the date shown; cannot be re-run from here. */
export interface ReadReceipt extends ReceiptBase { kind: 'read'; url: string; note: string }
export type Receipt = QuotedReceipt | CountedReceipt | ComputedReceipt | ApiReceipt | ReadReceipt;

/** Copy that may hold `{receipt-id}` tokens and `code` in backticks. Contains no typed digits (see 11.1). */
export type Copy = string;

export interface RoomLink { label: string; href: string }
export interface Room {
  slug: RoomSlug; title: string; look: Look;
  lead: Copy; meta: Copy; links: RoomLink[];
  row: { finding: Copy; figure: string /* receipt id */; figureLabel: Copy };
  exhibit: { title: string; intro: Copy; label: Copy };
  story: { heading: string; body: Copy }[];
  description: string;
}
export interface ArchiveItem { slug: string; title: string; repo: string; line: Copy; proof: Copy; live?: string; event?: string }

/** One home division: scroll position tells the scene which look to use. */
export interface DivisionSpec { id: 'start' | 'work' | 'contact'; label: string; look: Look; index: number }
