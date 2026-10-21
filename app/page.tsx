import FooterHud from '@/components/chrome/FooterHud';
import SplitHeading from '@/components/ui/SplitHeading';

export default function Home() {
  return (
    <>
      <div className="container-8bit min-h-svh flex items-end pb-[11.1rem]">
        <SplitHeading as="h1" gate lines={['that dream in', 'signals & motion.']} className="font-display font-normal text-display-xl" />
      </div>
      <FooterHud />
    </>
  );
}
