/** Hairline-separated list row with interactive hover state (DESIGN.md `feature-list-row`). */
export default function FeatureRow({ title, children, aside, titleAs: Title = 'h4' }: { title: React.ReactNode; children?: React.ReactNode; aside?: React.ReactNode; titleAs?: 'h2' | 'h3' | 'h4' }) {
  return (
    <div className="group -mx-xxs grid gap-xs rounded-xs border-b border-hairline px-xxs py-sm transition-all duration-200 hover:border-primary/50 hover:bg-white/[0.02] md:grid-cols-[1fr_auto] md:gap-md">
      <div>
        <Title className="text-title-md font-medium transition-colors duration-200 group-hover:text-primary-soft">{title}</Title>
        {children ? <div className="mt-xxs text-body text-ink-muted transition-colors duration-200 group-hover:text-ink">{children}</div> : null}
      </div>
      {aside ? <div className="text-body-sm text-ink-subtle transition-colors duration-200 group-hover:text-ink-muted md:text-right">{aside}</div> : null}
    </div>
  );
}
