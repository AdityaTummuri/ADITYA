import ReceiptBody from '@/components/receipt/ReceiptBody';
import ButtonPrimary from '@/components/ui/ButtonPrimary';
import TextLinkArrow from '@/components/ui/TextLinkArrow';
import { home } from '@/content/pages';
import { receipts } from '@/content/receipts';

const pop = (i: number) => ({ '--i': i }) as React.CSSProperties;

/** The cold open: the one line, the name, and a real receipt on a paper card. Tap the stage and it reacts. */
export default function Hero() {
  return (
    <section
      id="start"
      aria-labelledby="start-title"
      data-fx-stage
      className="relative flex min-h-svh scroll-mt-0 flex-col overflow-clip pt-[calc(var(--header-height)+1.6rem)]"
    >
      <div aria-hidden className="speedlines enter" />
      <div className="container-8bit relative z-10 grid flex-1 content-center items-center gap-lg pb-[30vw] lg:grid-cols-12 lg:gap-x-[var(--gutter)] lg:pb-[14vw] [&>*]:min-w-0">
        <div className="lg:col-span-7">
          <p className="sticker sticker-pink pop-in" style={pop(0)}>{home.kicker}</p>
          <h1 id="start-title" tabIndex={-1} className="mt-xs text-[clamp(4rem,5.7vw,8.2rem)] leading-[0.98] tracking-[-0.04em] outline-none">
            <span className="pop-in block" style={pop(1)}>{home.h1Lines[0]}</span>
            <span className="pop-in block" style={pop(2)}>
              <span className="marker [--m:var(--color-pink)]">{home.h1Lines[1]}</span>
            </span>
          </h1>
          <p className="pop-in mt-sm font-display text-title-lg font-extrabold" style={pop(3)}>{home.statement}</p>
          <p className="pop-in mt-xs max-w-[54ch] text-title-md text-ink-muted" style={pop(3)}>{home.paragraph}</p>
          <div className="pop-in mt-md flex flex-col items-start gap-xs sm:flex-row sm:flex-wrap sm:items-center sm:gap-md max-sm:[&>a]:w-full" style={pop(4)}>
            <ButtonPrimary href="#work" word="don">{home.primary}</ButtonPrimary>
            <TextLinkArrow href="/receipts">{home.secondary}</TextLinkArrow>
          </div>
          <p className="pop-in mt-sm font-cond text-meta text-ink-subtle" style={pop(5)}>{home.tapHint}</p>
        </div>
        <div className="pop-in lg:col-span-5 lg:justify-self-end" style={pop(4)}>
          <div className="relative w-full max-w-[46rem] lg:rotate-[1.4deg]">
            <h2 className="sr-only">{home.receiptHeading}</h2>
            <p className="sticker sticker-sun absolute -top-[1.8rem] left-sm z-10 -rotate-3">{home.receiptTag}</p>
            <div className="panel p-sm pt-md">
              <p className="mb-xxs font-cond text-meta text-ink-muted">{home.receiptLabel}</p>
              <ReceiptBody receipt={receipts['qed-a']} permalink={false} />
            </div>
          </div>
        </div>
      </div>
      <p aria-hidden className="outline-word pointer-events-none absolute -bottom-[2.6vw] left-[var(--margin)] z-0 whitespace-nowrap text-[27vw] lg:text-[21vw]">ADITYA</p>
    </section>
  );
}
