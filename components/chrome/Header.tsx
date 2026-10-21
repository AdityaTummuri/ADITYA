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
      <Wordmark />
      <Hamburger />
    </header>
  );
}
