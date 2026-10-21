/** Number tile with a 1px lit edge (DESIGN.md `stat-tile`). */
export default function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-md bg-gradient-to-b from-edge-from to-edge-to p-px">
      <div className="flex h-full flex-col gap-xs rounded-[0.7rem] bg-surface-3 p-sm">
        <span className="font-display text-headline tracking-[-0.03em] text-primary">{value}</span>
        <span className="text-body text-ink-muted">{label}</span>
      </div>
    </div>
  );
}
