/** Visually hidden until focused; first tab stop on every page. */
export default function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-[var(--margin)] focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-sm focus:py-xxs focus:font-bold focus:text-canvas"
    >
      Skip to content
    </a>
  );
}
