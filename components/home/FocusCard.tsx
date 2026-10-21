import type { FocusArea } from '@/content/types';
import HexFrame from '@/components/ui/HexFrame';
import { Glyph, type GlyphName } from './glyphs';

const GLYPHS: GlyphName[] = ['wave', 'sine', 'grid', 'prompt', 'cube'];

/** Focus-area card (DESIGN.md `feature-card`): hexagon frame, title, detail. No box. */
export default function FocusCard({ area, index }: { area: FocusArea; index: number }) {
  return (
    <article className="flex flex-col gap-sm">
      <HexFrame className="max-w-[14rem]"><Glyph name={GLYPHS[index % GLYPHS.length]} /></HexFrame>
      <h3 className="text-title-md font-medium">{area.title}</h3>
      <p className="text-body">{area.detail}</p>
    </article>
  );
}
