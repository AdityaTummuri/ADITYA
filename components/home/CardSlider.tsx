'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { Children, useCallback, useEffect, useState } from 'react';

/** Embla card slider (DESIGN.md card slider): arrows, 5px dots, one card per view from md up. */
export default function CardSlider({ children, label }: { children: React.ReactNode; label: string }) {
  const slides = Children.toArray(children);
  const [viewport, embla] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' });
  const [selected, setSelected] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(slides.length > 1);

  const sync = useCallback(() => {
    if (!embla) return;
    setSelected(embla.selectedScrollSnap());
    setCanPrev(embla.canScrollPrev());
    setCanNext(embla.canScrollNext());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    embla.on('select', sync).on('reInit', sync);
    return () => {
      embla.off('select', sync).off('reInit', sync);
    };
  }, [embla, sync]);

  const arrow = 'p-xs transition-opacity duration-300 ease-out-cubic disabled:opacity-20';
  return (
    <div role="group" aria-roledescription="carousel" aria-label={label} className="min-w-0">
      <div className="mb-sm flex gap-xxs">
        <button type="button" aria-label="Previous card" disabled={!canPrev} onClick={() => embla?.scrollPrev()} className={arrow}>
          <svg aria-hidden viewBox="0 0 19 18" className="h-[1.8rem] w-[1.9rem]" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L5 9l7 7" /></svg>
        </button>
        <button type="button" aria-label="Next card" disabled={!canNext} onClick={() => embla?.scrollNext()} className={arrow}>
          <svg aria-hidden viewBox="0 0 16 17" className="h-[1.7rem] w-[1.6rem]" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 2l7 6.5L5 15" /></svg>
        </button>
      </div>
      <div ref={viewport} className="overflow-hidden">
        <div className="flex touch-pan-y [margin-left:calc(var(--gutter)*-1)]">
          {slides.map((s, i) => (
            <div
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
              className="min-w-0 flex-[0_0_85%] pl-[var(--gutter)] md:flex-[0_0_100%]"
            >
              {s}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-md flex gap-xxs">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to card ${i + 1}`}
            aria-current={i === selected ? 'true' : undefined}
            onClick={() => embla?.scrollTo(i)}
            className="group flex p-[0.8rem]"
          >
            <span className={`h-[0.5rem] w-[0.5rem] rounded-full bg-ink transition-opacity duration-500 ease-out-cubic ${i === selected ? 'opacity-100' : 'opacity-20'}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
