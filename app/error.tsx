'use client';

import { useEffect } from 'react';
import ButtonPrimary from '@/components/ui/ButtonPrimary';
import SetLook from '@/components/work/SetLook';

/** Runtime or network failure: calm, says what to do, offers a retry and a way home. */
export default function ErrorPage({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section role="alert" className="container-8bit flex min-h-svh flex-col justify-end gap-sm pb-[11.1rem] lg:pb-[13.6rem]">
      <SetLook />
      <h1 className="font-display font-normal">
        <span className="block text-display-sm text-primary md:text-display-lg">connection dropped</span>
        <span className="block text-display-sm leading-none md:text-display-xl">that didn’t load.</span>
      </h1>
      <p className="max-w-[48rem] text-title-md font-medium text-ink-muted">Check your network and try again. Nothing on your side is broken.</p>
      <div className="mt-sm flex flex-wrap items-center gap-md">
        <ButtonPrimary onClick={() => retry()}>try again</ButtonPrimary>
        <ButtonPrimary href="/" variant="ghost">back to start</ButtonPrimary>
      </div>
    </section>
  );
}
