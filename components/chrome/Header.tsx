import Hamburger from './Hamburger';
import Wordmark from './Wordmark';

/**
 * Fixed chrome: wordmark top-left, hamburger top-right. A black gradient sits behind both at every
 * width (plan section 5), with a solid panel on phones. The gradient layer carries a view
 * transition name so page content never slides over it.
 */
export default function Header() {
  return (
    <header>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[11rem]"
        style={{
          viewTransitionName: 'site-header',
          background: 'linear-gradient(to bottom, #000 0, rgb(0 0 0 / 0.92) 6rem, transparent 11rem)',
        }}
      >
        <span className="absolute left-0 top-0 h-[var(--header-height)] w-full bg-canvas md:hidden" />
      </div>
      <Wordmark />
      <Hamburger />
    </header>
  );
}
