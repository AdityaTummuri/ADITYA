import Hamburger from './Hamburger';
import Wordmark from './Wordmark';

/** Fixed chrome: wordmark top-left, hamburger top-right, solid panel behind both below md. */
export default function Header() {
  return (
    <header>
      <span
        aria-hidden
        data-motion="panel"
        className="fixed left-0 top-0 z-40 h-[var(--header-height)] w-full bg-canvas md:hidden"
      />
      <span aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-40 hidden h-[11rem] bg-gradient-to-b from-canvas/70 to-transparent md:block" />
      <Wordmark />
      <Hamburger />
    </header>
  );
}
