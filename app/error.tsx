'use client';

import { useEffect } from 'react';
import ButtonPrimary from '@/components/ui/ButtonPrimary';
import { errorPage } from '@/content/pages';

/** Runtime or network failure: calm, says what to do, offers a retry and a way home. */
export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section role="alert" className="relative flex min-h-svh flex-col justify-center overflow-clip pt-[var(--header-height)]">
      <div aria-hidden className="speedlines" />
      <div className="container-8bit relative grid gap-sm">
        <h1 tabIndex={-1} className="max-w-[18ch] text-display-lg outline-none">{errorPage.h1}</h1>
        <p className="max-w-[48rem] text-title-md text-ink-muted">{errorPage.p}</p>
        <div className="mt-xs flex flex-wrap items-center gap-md">
          <ButtonPrimary onClick={() => retry()}>{errorPage.primary}</ButtonPrimary>
          <ButtonPrimary href="/" variant="ghost" word="pon">{errorPage.secondary}</ButtonPrimary>
        </div>
      </div>
    </section>
  );
}
