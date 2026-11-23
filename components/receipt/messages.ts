import { formatDay, pinnedSha } from '@/content/receipt-links';
import github from '@/content/github.json';
import type { ApiReceipt, QuotedReceipt } from '@/content/types';
import type { CheckStatus } from '@/lib/check-store';

/** The line under the buttons for a receipt's current check. Copy from plan 3.5. */
export function statusText(r: QuotedReceipt | ApiReceipt, s: CheckStatus | undefined): string {
  if (!s) return '';
  switch (s.state) {
    case 'checking':
      return 'Asking GitHub…';
    case 'found-main':
      return `Found on line ${s.line} of ${r.kind === 'quoted' ? r.path : ''}, on the main branch, just now.`;
    case 'found-pinned':
      return `The main branch has changed since I read it. Found on line ${s.line} at commit ${(pinnedSha(r.repo) ?? '').slice(0, 7)}.`;
    case 'missing':
      return 'Not found in either version. Please tell me and I will fix it.';
    case 'offline':
      return 'GitHub did not answer. The link above opens the file.';
    case 'matches':
      return `GitHub says ${s.now} right now. Same as here.`;
    case 'changed':
      return `GitHub says ${s.now} right now. I read ${s.was} on ${formatDay(github.readOn)}.`;
  }
}

/** True for outcomes that need the reader's attention. */
export function isProblem(s: CheckStatus | undefined): boolean {
  return s?.state === 'missing' || s?.state === 'offline' || s?.state === 'changed';
}
