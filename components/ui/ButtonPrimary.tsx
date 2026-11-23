import Link from 'next/link';

type Variant = 'primary' | 'ghost';

interface Props {
  href?: string;
  onClick?: () => void;
  children: string;
  variant?: Variant;
  className?: string;
  type?: 'button' | 'submit';
  transitionTypes?: string[];
}

const base = 'press group relative inline-flex min-h-[4.4rem] items-center gap-xs px-md py-sm font-body text-body font-medium leading-none';
const variants: Record<Variant, string> = {
  primary: 'rounded-md bg-inverse-canvas text-inverse-ink hover:bg-primary-soft',
  ghost: 'rounded-md bg-transparent text-ink hover:text-primary-soft',
};

function Arrow() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 40 8"
      className="h-[0.8rem] w-[4rem] shrink-0 transition-transform duration-200 ease-[var(--ease-out)] motion-safe:group-hover:translate-x-[0.6rem]"
    >
      <path d="M0 4h38M34 1l4 3-4 3" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/** White block CTA: a press scale, a calm hover tint and the arrow nudge. No sliding label. */
export default function ButtonPrimary({ href, onClick, children, variant = 'primary', className = '', type = 'button', transitionTypes }: Props) {
  const cls = `${base} ${variants[variant]} ${className}`;
  const label = (
    <>
      <span>{children}</span>
      <Arrow />
    </>
  );
  if (!href) {
    return (
      <button type={type} onClick={onClick} className={cls}>
        {label}
      </button>
    );
  }
  const external = /^(https?:|mailto:)/.test(href);
  return external ? (
    <a href={href} className={cls}>{label}</a>
  ) : (
    <Link href={href} className={cls} transitionTypes={transitionTypes}>{label}</Link>
  );
}
