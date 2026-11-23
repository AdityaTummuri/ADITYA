import { branches, commits } from './commits.ts';
import type { Receipt } from './types';

// Kept apart from the receipt table so a page that only checks one receipt does not ship all of them.
export const OWNER = 'AdityaTummuri';
export const PROFILE_URL = `https://github.com/${OWNER}`;

/** `2026-11-23` as `23 Nov 2026`. */
export function formatDay(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1]} ${y}`;
}

function branch(repo: string): string {
  return branches[repo] ?? 'main';
}

export function repoUrl(repo: string): string {
  return repo ? `https://github.com/${OWNER}/${repo}` : PROFILE_URL;
}

/** Where the receipt's file lives on GitHub (the repository when it has no file). */
export function fileUrl(r: Receipt): string {
  switch (r.kind) {
    case 'read':
      return r.url;
    case 'api':
    case 'computed':
      return repoUrl(r.repo);
    default:
      return r.path ? `${repoUrl(r.repo)}/blob/${branch(r.repo)}/${r.path}` : repoUrl(r.repo);
  }
}

export function rawUrl(r: { repo: string; path: string }, ref: string): string {
  return `https://raw.githubusercontent.com/${OWNER}/${r.repo}/${ref}/${r.path}`;
}

/** The ref a receipt's file is fetched at on the live branch. */
export function liveRef(repo: string): string {
  return branch(repo);
}

/** Pinned commit of a receipt's repository, or undefined for account receipts. */
export function pinnedSha(repo: string): string | undefined {
  return commits[repo];
}
