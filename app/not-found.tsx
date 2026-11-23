import type { Metadata } from 'next';
import ButtonPrimary from '@/components/ui/ButtonPrimary';
import { notFound } from '@/content/pages';

export const metadata: Metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <section data-fx-stage className="relative flex min-h-svh flex-col justify-center overflow-clip pt-[var(--header-height)]">
      <div aria-hidden className="speedlines" />
      <div className="container-8bit relative grid gap-sm">
        <p aria-hidden className="outline-word text-[34vw] md:text-[24vw]">404</p>
        <h1 tabIndex={-1} className="max-w-[18ch] text-display-md outline-none">{notFound.h1}</h1>
        <p className="max-w-[48rem] text-title-md text-ink-muted">{notFound.p}</p>
        <div className="mt-xs flex flex-wrap items-center gap-md">
          <ButtonPrimary href="/">{notFound.primary}</ButtonPrimary>
          <ButtonPrimary href="/#work" variant="ghost" word="pon">{notFound.secondary}</ButtonPrimary>
        </div>
      </div>
    </section>
  );
}
