import type { Metadata } from 'next';
import ButtonPrimary from '@/components/ui/ButtonPrimary';
import SetLook from '@/components/work/SetLook';
import { notFound } from '@/content/pages';

export const metadata: Metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <section className="container-8bit flex min-h-svh flex-col justify-end pb-[11.1rem] lg:pb-[13.6rem]">
      <SetLook />
      <div className="quiet grid gap-sm">
        <h1 tabIndex={-1} className="font-display text-display-lg font-medium outline-none [text-wrap:balance]">{notFound.h1}</h1>
        <p className="prose-measure max-w-[48rem] text-title-md text-ink-muted">{notFound.p}</p>
        <div className="mt-xs flex flex-wrap items-center gap-md">
          <ButtonPrimary href="/">{notFound.primary}</ButtonPrimary>
          <ButtonPrimary href="/#work" variant="ghost">{notFound.secondary}</ButtonPrimary>
        </div>
      </div>
    </section>
  );
}
