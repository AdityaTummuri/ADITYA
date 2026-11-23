import Rich from '@/components/receipt/Rich';
import SiteFooter from '@/components/chrome/SiteFooter';
import TextLinkArrow from '@/components/ui/TextLinkArrow';
import { home } from '@/content/pages';
import { profile } from '@/content/profile';

const CONTACTS = [
  { label: profile.email, href: `mailto:${profile.email}` },
  { label: 'linkedin.com/in/adityatummuri', href: profile.linkedin },
  { label: 'github.com/AdityaTummuri', href: profile.github },
];

function DrawnArrow() {
  return (
    <svg aria-hidden viewBox="0 0 40 20" className="h-[2rem] w-[4rem] shrink-0 transition-transform duration-200 ease-[var(--ease-out)] motion-safe:group-hover:translate-x-[0.6rem]">
      <path d="M0 10h37M29 2l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/** The contact division: how to write, the account snapshot, three places to go, and the footer row. */
export default function Contact() {
  return (
    <>
      <div className="container-8bit grid w-full flex-1 content-center gap-lg lg:grid-cols-12 lg:gap-x-[var(--gutter)] [&>*]:min-w-0">
        <div className="quiet lg:col-span-5">
          <h2 id="contact-title" tabIndex={-1} className="font-display text-display-md font-medium outline-none [text-wrap:balance]">{home.contactHeading}</h2>
          <p className="mt-xs max-w-[40ch] text-title-md text-ink-muted">{home.contactParagraph}</p>
        </div>
        <div className="quiet lg:col-span-7">
          <ul className="border-t border-hairline">
            {CONTACTS.map((c) => (
              <li key={c.href} className="border-b border-hairline">
                <a href={c.href} className="press group flex min-h-[4.4rem] items-center justify-between gap-xs py-sm font-display text-[2rem] font-medium tracking-[-0.02em] [overflow-wrap:anywhere] hover:text-primary-soft sm:text-title-lg md:text-headline">
                  {c.label}
                  <DrawnArrow />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="quiet grid gap-sm lg:col-span-12 lg:grid-cols-12 lg:gap-x-[var(--gutter)]">
          <p className="max-w-[60ch] text-body-sm text-ink-subtle lg:col-span-5">
            <Rich>{home.snapshot}</Rich>
          </p>
          <ul className="flex flex-wrap gap-x-md lg:col-span-7">
            {home.places.map((p) => (
              <li key={p.href}>
                <TextLinkArrow href={p.href}>{p.label}</TextLinkArrow>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-lg">
        <SiteFooter />
      </div>
    </>
  );
}
