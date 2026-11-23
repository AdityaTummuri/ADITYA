import Link from 'next/link';

interface Props {
  href: string;
  children: string;
  className?: string;
  transitionTypes?: string[];
}

/** Text link with a drawn arrow after it; the arrow moves 6px on hover. */
export default function TextLinkArrow({ href, children, className = '', transitionTypes }: Props) {
  const cls = `press group inline-flex min-h-[4.4rem] items-center gap-xs py-xxs text-body font-medium text-ink hover:text-primary-soft ${className}`;
  const arrow = (
    <svg aria-hidden viewBox="0 0 16 10" className="h-[1rem] w-[1.6rem] shrink-0 transition-transform duration-200 ease-[var(--ease-out)] motion-safe:group-hover:translate-x-[0.6rem]">
      <path d="M0 5h14M11 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
  if (/^(https?:|mailto:)/.test(href)) {
    return <a href={href} className={cls}>{children}{arrow}</a>;
  }
  return <Link href={href} className={cls} transitionTypes={transitionTypes}>{children}{arrow}</Link>;
}
