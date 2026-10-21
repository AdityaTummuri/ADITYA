'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/a11y';

/** One-shot reveal for flow content: fades up once when it enters the viewport. Static under reduced motion. */
export default function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  useGSAP(
    () => {
      if (reduce || !ref.current) return;
      gsap.from(ref.current, {
        autoAlpha: 0,
        y: 24,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true },
      });
    },
    { scope: ref, dependencies: [reduce] },
  );
  return (
    <div ref={ref} data-reveal className={className}>
      {children}
    </div>
  );
}
