/** The top of every inner page: a speed-line burst, a sticker, a big title, an optional lead. */
export default function PageHead({ kicker, title, children, tone = 'pink' }: { kicker: string; title: string; children?: React.ReactNode; tone?: 'pink' | 'sun' | 'sky' }) {
  return (
    <header className="relative overflow-clip pb-lg pt-[calc(var(--header-height)+4rem)] md:pt-[calc(var(--header-height)+6rem)]">
      <div aria-hidden className="speedlines" style={{ '--cx': '82%', '--cy': '40%', opacity: 0.09 } as React.CSSProperties} />
      <div className="container-8bit relative max-w-[150rem]">
        <p className={`sticker sticker-${tone} pop-in`}>{kicker}</p>
        <h1 tabIndex={-1} className="pop-in mt-xs max-w-[20ch] text-display-md outline-none md:text-display-lg" style={{ '--i': 1 } as React.CSSProperties}>{title}</h1>
        {children ? <div className="pop-in mt-sm max-w-[62ch] text-title-md text-ink-muted" style={{ '--i': 2 } as React.CSSProperties}>{children}</div> : null}
      </div>
    </header>
  );
}
