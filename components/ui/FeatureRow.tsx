/** Hairline-separated list row (DESIGN.md `feature-list-row`). */
export default function FeatureRow({ title, children, aside }: { title: React.ReactNode; children?: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <div className="grid gap-xs border-b border-hairline py-sm md:grid-cols-[1fr_auto] md:gap-md">
      <div>
        <h3 className="text-title-md font-medium">{title}</h3>
        {children ? <div className="mt-xxs text-body text-ink">{children}</div> : null}
      </div>
      {aside ? <div className="text-body-sm text-ink-muted md:text-right">{aside}</div> : null}
    </div>
  );
}
