import Link from 'next/link';

/** Text link with a trailing arrow (DESIGN.md `text-link-arrow`). */
export default function TextLinkArrow({ href, children, className = '' }: { href: string; children: string; className?: string }) {
  const cls = `group inline-flex items-center gap-xs text-body text-ink transition-colors duration-300 ease-out-cubic hover:text-primary ${className}`;
  const arrow = (
    <svg aria-hidden viewBox="0 0 16 10" className="h-[1rem] w-[1.6rem] transition-transform duration-300 ease-out-cubic motion-safe:group-hover:translate-x-[0.4rem]">
      <path d="M0 5h14M11 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
  return /^(https?:|mailto:)/.test(href) ? (
    <a href={href} className={cls}>{children}{arrow}</a>
  ) : (
    <Link href={href} className={cls}>{children}{arrow}</Link>
  );
}
