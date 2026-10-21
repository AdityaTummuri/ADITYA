'use client';

import { useId, useState } from 'react';

/** Accordion row (DESIGN.md `accordion-row`): title button + panel; closed content is invisible and inert. */
export default function AccordionRow({ title, children, defaultOpen = false, meta }: { title: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean; meta?: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="border-b border-hairline">
      <h4>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-md py-sm text-left"
        >
          <span className="text-title-md font-medium">{title}</span>
          <span className="flex items-center gap-md">
            {meta ? <span className="text-body-sm text-ink-muted">{meta}</span> : null}
            <span aria-hidden className="font-display text-title-lg leading-none">{open ? '−' : '+'}</span>
          </span>
        </button>
      </h4>
      <div
        id={id}
        role="region"
        aria-hidden={!open}
        className={`grid transition-[grid-template-rows,visibility] duration-500 ease-out-cubic ${open ? 'visible grid-rows-[1fr]' : 'invisible grid-rows-[0fr] delay-0'}`}
      >
        <div className="overflow-hidden">
          <div className="pb-sm text-body">{children}</div>
        </div>
      </div>
    </div>
  );
}
