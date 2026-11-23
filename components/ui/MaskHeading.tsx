/**
 * A headline that rises line by line out of a mask, once, on load. Pure CSS (`.line` in globals.css),
 * so it is in the server HTML and needs no script; reduced motion shows it at rest.
 */
export default function MaskHeading({ lines, className = '' }: { lines: string[]; className?: string }) {
  return (
    <span className={`block ${className}`}>
      {lines.map((l, i) => (
        <span key={l} className="line" style={{ '--i': i } as React.CSSProperties}>
          <span>{l}{i < lines.length - 1 ? ' ' : ''}</span>
        </span>
      ))}
    </span>
  );
}
