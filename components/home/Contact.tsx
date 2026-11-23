import Rich from '@/components/receipt/Rich';
import SiteFooter from '@/components/chrome/SiteFooter';
import ButtonPrimary from '@/components/ui/ButtonPrimary';
import TextLinkArrow from '@/components/ui/TextLinkArrow';
import { home } from '@/content/pages';
import { profile } from '@/content/profile';

const CONTACTS = [
  { label: 'linkedin.com/in/adityatummuri', href: profile.linkedin },
  { label: 'github.com/AdityaTummuri', href: profile.github },
];

/** The last episode: how to write, the account snapshot, three places to go, and the footer. */
export default function Contact() {
  return (
    <>
      <section id="contact" aria-labelledby="contact-title" className="relative overflow-clip py-xl md:py-2xl">
        <div aria-hidden className="speedlines" style={{ '--cx': '50%', '--cy': '30%', opacity: 0.08 } as React.CSSProperties} />
        <div className="container-8bit relative grid gap-lg lg:grid-cols-12 lg:gap-x-[var(--gutter)] [&>*]:min-w-0">
          <div className="lg:col-span-7">
            <p className="sticker sticker-sky">{home.contactKicker}</p>
            <h2 id="contact-title" tabIndex={-1} data-fx-land data-word="don" className="mt-xs text-display-lg outline-none">
              <span className="marker [--m:var(--color-sun)]">{home.contactHeading}</span>
            </h2>
            <p className="mt-sm max-w-[40ch] text-title-md text-ink-muted">{home.contactParagraph}</p>
            <div className="mt-md flex flex-col items-start gap-xs max-sm:[&>a]:w-full">
              <ButtonPrimary href={`mailto:${profile.email}`} word="kachi">{profile.email}</ButtonPrimary>
            </div>
            <ul className="mt-sm flex flex-wrap gap-x-md">
              {CONTACTS.map((c) => (
                <li key={c.href}>
                  <a href={c.href} className="link [overflow-wrap:anywhere]">{c.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5 lg:self-end">
            <div className="panel bg-sun p-md">
              <p className="sticker sticker-white">{home.statsKicker}</p>
              <p className="mt-sm font-display text-title-lg font-extrabold leading-tight"><Rich>{home.snapshot}</Rich></p>
              <ul className="mt-sm grid gap-0">
                {home.places.map((p) => (
                  <li key={p.href}>
                    <TextLinkArrow href={p.href}>{p.label}</TextLinkArrow>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
