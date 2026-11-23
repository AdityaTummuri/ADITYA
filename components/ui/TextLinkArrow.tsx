import Link from 'next/link';

interface Props {
  href: string;
  children: string;
  className?: string;
  transitionTypes?: string[];
}

/** A text link whose pink underline floods on hover; the arrow springs forward. */
export default function TextLinkArrow({ href, children, className = '', transitionTypes }: Props) {
  const cls = `link text-body ${className}`;
  const arrow = (
    <svg aria-hidden viewBox="0 0 40 16" className="arrow h-[1.2rem] w-[2.8rem] shrink-0">
      <path d="M0 8h36M29 1l8 7-8 7" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (/^(https?:|mailto:)/.test(href)) {
    return <a href={href} className={cls}>{children}{arrow}</a>;
  }
  return <Link href={href} className={cls} transitionTypes={transitionTypes}>{children}{arrow}</Link>;
}
