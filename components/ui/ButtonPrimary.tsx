import Link from 'next/link';

type Variant = 'primary' | 'ghost' | 'wide';

interface Props {
  href?: string;
  onClick?: () => void;
  children: string;
  variant?: Variant;
  className?: string;
  type?: 'button' | 'submit';
}

const base =
  'group relative inline-flex items-center gap-xs overflow-hidden px-md py-sm font-body text-body leading-none transition-colors';
const variants: Record<Variant, string> = {
  primary: 'rounded-md bg-inverse-canvas text-inverse-ink',
  ghost: 'rounded-md bg-transparent text-ink',
  wide: 'w-full justify-between rounded-xs bg-inverse-canvas text-inverse-ink',
};

function Arrow() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 40 8"
      className="h-[0.8rem] w-[4rem] shrink-0 transition-transform duration-500 ease-out-cubic motion-safe:group-hover:translate-x-[0.6rem]"
    >
      <path d="M0 4h38M34 1l4 3-4 3" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/** White block CTA (DESIGN.md `button-primary`): the label slides up through a mask on hover. */
export default function ButtonPrimary({ href, onClick, children, variant = 'primary', className = '', type = 'button' }: Props) {
  const cls = `${base} ${variants[variant]} ${className}`;
  const label = (
    <>
      <span className="relative inline-flex overflow-hidden">
        <span className="block transition-transform duration-500 ease-out-cubic motion-safe:group-hover:-translate-y-[180%]">
          {children}
        </span>
        <span
          aria-hidden
          className="absolute left-0 top-0 block translate-y-[180%] transition-transform duration-500 ease-out-cubic motion-safe:group-hover:translate-y-0"
        >
          {children}
        </span>
      </span>
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
    <Link href={href} className={cls}>{label}</Link>
  );
}
