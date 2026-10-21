import type { ChapterSpec } from '@/content/types';
import ButtonPrimary from '@/components/ui/ButtonPrimary';
import SplitHeading from '@/components/ui/SplitHeading';

interface Props {
  spec: ChapterSpec;
  /** Body layer content (cards, rows, tiles...), server-rendered by the page. */
  body?: React.ReactNode;
}

/**
 * One home chapter (DESIGN.md `chapter-lockup`, `statement`). Layers are plain flow blocks for now;
 * the pin/scrub engine arrives in Task 7 and positions them as absolute layers on wide screens.
 */
export default function Chapter({ spec, body }: Props) {
  const Heading = spec.index === 0 ? 'h1' : 'h2';
  return (
    <section id={spec.id} data-chapter={spec.index} aria-labelledby={`${spec.id}-title`} className="relative py-2xl">
      <div className="container-8bit grid gap-xl lg:grid-cols-12 lg:gap-x-[var(--gutter)] [&>*]:min-w-0">
        <div data-layer="lockup" className="lg:col-span-12">
          <Heading id={`${spec.id}-title`} className="font-display font-normal">
            <SplitHeading
              as="span"
              data-overline
              lines={[spec.overline]}
              gate={spec.index === 0}
              className="block text-display-sm text-primary md:text-display-lg"
            />
            <SplitHeading
              as="span"
              lines={spec.title}
              gate={spec.index === 0}
              delay={0.15}
              className="block text-display-sm leading-none md:text-display-xl"
            />
          </Heading>
        </div>
        <p data-layer="statement" className="font-display text-display-sm text-primary tracking-[-0.03em] md:text-display-md lg:col-span-6">
          {spec.statement}
        </p>
        {spec.paragraph ? (
          <p data-layer="paragraph" className="text-title-md font-medium lg:col-span-7 lg:col-start-6">
            {spec.paragraph}
          </p>
        ) : null}
        {body ? <div data-layer="body" className="lg:col-span-12">{body}</div> : null}
        {spec.cta ? (
          <div data-layer="cta" className="lg:col-span-12">
            <ButtonPrimary href={spec.cta.href}>{spec.cta.label}</ButtonPrimary>
          </div>
        ) : null}
      </div>
    </section>
  );
}
