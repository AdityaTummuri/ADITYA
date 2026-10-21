/** Accent-coloured status/label line. The brand never fills a pill (DESIGN.md Tags / Badges). */
export default function Overline({ children, size = 'lg', className = '' }: { children: React.ReactNode; size?: 'lg' | 'sm'; className?: string }) {
  const s = size === 'lg' ? 'font-display text-title-lg' : 'text-body-sm';
  return <span className={`block text-primary ${s} ${className}`}>{children}</span>;
}
