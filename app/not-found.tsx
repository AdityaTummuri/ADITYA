import ButtonPrimary from '@/components/ui/ButtonPrimary';
import SetLook from '@/components/work/SetLook';

export default function NotFound() {
  return (
    <section className="container-8bit flex min-h-svh flex-col justify-end gap-sm pb-[11.1rem] lg:pb-[13.6rem]">
      <SetLook />
      <h1 className="font-display font-normal">
        <span className="block text-display-sm text-primary md:text-display-lg">Signal lost</span>
        <span className="block text-display-sm leading-none md:text-display-xl">Nothing on this frequency.</span>
      </h1>
      <div className="mt-sm">
        <ButtonPrimary href="/">Back to the start</ButtonPrimary>
      </div>
    </section>
  );
}
