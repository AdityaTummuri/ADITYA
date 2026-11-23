'use client';

import { useEffect } from 'react';
import ButtonPrimary from '@/components/ui/ButtonPrimary';
import SetLook from '@/components/work/SetLook';
import { errorPage } from '@/content/pages';

/** Runtime or network failure: calm, says what to do, offers a retry and a way home. */
export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section role="alert" className="container-8bit flex min-h-svh flex-col justify-end pb-[11.1rem] lg:pb-[13.6rem]">
      <SetLook />
      <div className="quiet grid gap-sm">
        <h1 tabIndex={-1} className="font-display text-display-lg font-medium outline-none [text-wrap:balance]">{errorPage.h1}</h1>
        <p className="prose-measure max-w-[48rem] text-title-md text-ink-muted">{errorPage.p}</p>
        <div className="mt-xs flex flex-wrap items-center gap-md">
          <ButtonPrimary onClick={() => retry()}>{errorPage.primary}</ButtonPrimary>
          <ButtonPrimary href="/" variant="ghost">{errorPage.secondary}</ButtonPrimary>
        </div>
      </div>
    </section>
  );
}
