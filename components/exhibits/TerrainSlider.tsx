'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { terrainCopy } from '@/content/exhibits';

const SWATCHES = ['#b48c5a', '#2ecc71', '#e67e22', '#e74c3c'];
const ALT_FRAME = 'Camera frame: a grassy field with two muddy ruts, a person walking on the left, bare trees on the right, under a cloudy sky.';
const ALT_OUTPUT = 'The same frame with the model’s output over it: grass in green as pliant vegetation, the ruts in orange as mud, the person, trees and most of the sky in red as rigid obstacle, and one bright cloud partly orange and tan.';
const SIZES = '(min-width:1280px) 970px, 100vw';

/**
 * The robot's camera frame against the model's output, behind a handle. The slider is a native
 * range input laid over the picture, so keyboard, touch and screen readers get it for free; the
 * value is written straight to a CSS variable, with no React render per move.
 */
export default function TerrainSlider() {
  const fig = useRef<HTMLElement>(null);
  const input = useRef<HTMLInputElement>(null);

  const update = (v: number) => {
    fig.current?.style.setProperty('--x', `${v}%`);
    input.current?.setAttribute('aria-valuetext', `${v} percent camera frame`);
  };

  return (
    <div className="grid gap-xs">
      <figure ref={fig} className="relative m-0 overflow-hidden rounded-xs bg-surface-2" style={{ '--x': '50%' } as React.CSSProperties}>
        <div className="relative aspect-[904/500] w-full">
          <Image src="/work/netra-output.webp" loading="eager" alt={ALT_OUTPUT} width={904} height={500} sizes={SIZES} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ clipPath: 'inset(0 calc(100% - var(--x)) 0 0)' }}>
            <Image src="/work/netra-frame.webp" loading="eager" fetchPriority="high" alt={ALT_FRAME} width={904} height={500} sizes={SIZES} className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <span className="absolute left-xxs top-xxs rounded-xs bg-black/90 px-xxs py-1 font-cond text-meta text-ink">{terrainCopy.frameLabel}</span>
          <span className="absolute right-xxs top-xxs rounded-xs bg-black/90 px-xxs py-1 font-cond text-meta text-ink">{terrainCopy.outputLabel}</span>
          <input
            ref={input}
            type="range"
            min={0}
            max={100}
            defaultValue={50}
            aria-label={terrainCopy.sliderLabel}
            aria-valuetext="50 percent camera frame"
            onInput={(e) => update(Number(e.currentTarget.value))}
            className="peer absolute inset-0 z-10 m-0 h-full w-full cursor-ew-resize touch-pan-y opacity-0"
          />
          <span aria-hidden className="pointer-events-none absolute inset-y-0 w-[2px] -translate-x-1/2 bg-white" style={{ left: 'var(--x)' }} />
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 flex h-[4.4rem] w-[4.4rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-black/60 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-primary-soft"
            style={{ left: 'var(--x)' }}
          >
            <svg viewBox="0 0 24 12" className="h-[1.2rem] w-[2.4rem] text-white">
              <path d="M7 1L2 6l5 5M17 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </span>
        </div>
      </figure>
      <ul className="m-0 flex list-none flex-wrap gap-x-md gap-y-1 p-0 text-body-sm text-ink-muted">
        {terrainCopy.legend.map((name, i) => (
          <li key={name} className="flex items-center gap-xxs">
            <span aria-hidden className="h-[1.2rem] w-[1.2rem] shrink-0" style={{ background: SWATCHES[i] }} />
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}
