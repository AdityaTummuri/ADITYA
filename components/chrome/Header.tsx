import Hamburger from './Hamburger';
import Wordmark from './Wordmark';

/**
 * Fixed chrome: the name as a sticker top-left, the menu pill top-right. A strip of paper fades
 * out under both so content never runs into them. The strip carries a view transition name so page
 * content never slides over it.
 */
export default function Header() {
  return (
    <header>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[11rem]"
        style={{
          viewTransitionName: 'site-header',
          background: 'linear-gradient(to bottom, var(--color-canvas) 0, rgb(247 240 224 / 0.94) 6.4rem, transparent 11rem)',
        }}
      />
      <Wordmark />
      <Hamburger />
    </header>
  );
}
