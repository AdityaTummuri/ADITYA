import { ViewTransition } from 'react';

const TYPES = { into: 'into', out: 'out', side: 'side', default: 'swap' };

/**
 * Wraps each page's content so route changes animate it (plan 8.1). Which animation plays depends on
 * the `transitionTypes` of the link that was followed: into a room, back out, sideways between rooms.
 * Anything else, such as the browser's Back button, gets a short crossfade.
 */
export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter={TYPES} exit={TYPES} default="none">
      {children}
    </ViewTransition>
  );
}
