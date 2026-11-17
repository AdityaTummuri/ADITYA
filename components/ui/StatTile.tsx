/** Number tile with a 1px lit edge and hover state (DESIGN.md `stat-tile`). */
export default function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="group rounded-md bg-gradient-to-b from-edge-from to-edge-to p-px transition-all duration-300 hover:from-primary/60 hover:to-primary/20">
      <div className="flex h-full flex-col justify-between gap-xs rounded-[0.7rem] bg-surface-3 p-sm transition-colors duration-300 group-hover:bg-[#0c1013]">
        <span className="font-display text-headline tracking-[-0.03em] text-primary transition-all duration-300 group-hover:text-primary-soft group-hover:translate-x-1">
          {value}
        </span>
        <span className="text-body text-ink-muted transition-colors duration-200 group-hover:text-ink">
          {label}
        </span>
      </div>
    </div>
  );
}
