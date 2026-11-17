import ButtonPrimary from '@/components/ui/ButtonPrimary';
import SetLook from '@/components/work/SetLook';

export default function NotFound() {
  return (
    <section className="container-8bit flex min-h-svh flex-col justify-end gap-sm pb-[11.1rem] lg:pb-[13.6rem]">
      <SetLook />
      <h1 className="font-display font-normal">
        <span className="block text-display-sm text-primary md:text-display-lg">404</span>
        <span className="block text-display-sm leading-none md:text-display-xl">nothing here.</span>
      </h1>
      <p className="max-w-[48rem] text-title-md font-medium text-ink-muted">This page doesn’t exist, or it moved. The work is still where you left it.</p>
      <div className="mt-sm flex flex-wrap items-center gap-md">
        <ButtonPrimary href="/">back to start</ButtonPrimary>
        <ButtonPrimary href="/#work" variant="ghost">see the work</ButtonPrimary>
      </div>
    </section>
  );
}
