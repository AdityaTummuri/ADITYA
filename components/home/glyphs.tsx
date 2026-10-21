/** Thin 1.2px line glyphs that sit inside the hexagon frame. Decorative (aria-hidden). */
const svg = { viewBox: '0 0 48 48', fill: 'none', stroke: 'currentColor', strokeWidth: 1.2, className: 'h-[4.8rem] w-[4.8rem]', 'aria-hidden': true } as const;

export type GlyphName = 'wave' | 'sine' | 'grid' | 'prompt' | 'cube';

export function Glyph({ name }: { name: GlyphName }) {
  switch (name) {
    case 'wave':
      return <svg {...svg}><path d="M4 24h6l4-14 6 28 5-22 4 8h15" /></svg>;
    case 'sine':
      return <svg {...svg}><path d="M4 24c5-14 9-14 14 0s9 14 14 0 7-10 12-4" /></svg>;
    case 'grid':
      return <svg {...svg}><rect x="8" y="8" width="32" height="32" /><path d="M8 24h32M24 8v32" /></svg>;
    case 'prompt':
      return <svg {...svg}><path d="M10 14l10 10-10 10M24 36h14" /></svg>;
    case 'cube':
      return <svg {...svg}><path d="M24 6l16 9v18L24 42 8 33V15zM8 15l16 9 16-9M24 24v18" /></svg>;
  }
}
