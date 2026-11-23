import Link from 'next/link';

type Variant = 'primary' | 'ghost' | 'sun';

interface Props {
  href?: string;
  onClick?: () => void;
  children: string;
  variant?: Variant;
  className?: string;
  type?: 'button' | 'submit';
  transitionTypes?: string[];
  /** The sound-effect word that lands on a click: don, kachi, shu, pon or zuza. */
  word?: 'don' | 'kachi' | 'shu' | 'pon' | 'zuza';
}

const variants: Record<Variant, string> = {
  primary: 'btn press',
  ghost: 'btn btn-alt press',
  sun: 'btn btn-sun press',
};

function Arrow() {
  return (
    <svg aria-hidden viewBox="0 0 40 16" className="arrow h-[1.4rem] w-[3.4rem] shrink-0">
      <path d="M0 8h36M29 1l8 7-8 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A pill that squashes when pressed, then throws an impact and a lettered word (FxRuntime). */
export default function ButtonPrimary({ href, onClick, children, variant = 'primary', className = '', type = 'button', transitionTypes, word = 'don' }: Props) {
  const cls = `${variants[variant]} ${className}`;
  const label = (
    <>
      <span>{children}</span>
      <Arrow />
    </>
  );
  const fx = { 'data-fx': 'hit', 'data-word': word } as const;
  if (!href) {
    return (
      <button type={type} onClick={onClick} className={cls} {...fx}>
        {label}
      </button>
    );
  }
  const external = /^(https?:|mailto:)/.test(href);
  const hash = href.startsWith('#');
  return external || hash ? (
    <a href={href} className={cls} {...fx}>{label}</a>
  ) : (
    <Link href={href} className={cls} transitionTypes={transitionTypes} {...fx}>{label}</Link>
  );
}
