/** 1px hexagon outline with centred content (DESIGN.md `feature-card-icon-frame`). */
export default function HexFrame({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={`relative aspect-[182/200] w-full max-w-[20.8rem] ${className}`}>
      <svg aria-hidden viewBox="0 0 182 200" className="absolute inset-0 h-full w-full">
        <polygon points="91,1 181,50 181,150 91,199 1,150 1,50" fill="none" stroke="currentColor" strokeWidth="1" className="text-ink" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-ink">{children}</div>
    </div>
  );
}
