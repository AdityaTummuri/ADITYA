/** Visually hidden until focused; first tab stop on every page. */
export default function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-[var(--margin)] focus:top-4 focus:z-[100] focus:bg-inverse-canvas focus:px-4 focus:py-2 focus:text-inverse-ink"
    >
      Skip to content
    </a>
  );
}
