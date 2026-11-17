'use client';

import Loader from '@/components/chrome/Loader';
import RouteWipe from '@/components/chrome/RouteWipe';
import SmoothScroll from '@/lib/smooth-scroll';

/** Client-side runtime mounted once in the root layout: smooth scroll, loader, route wipe. */
export default function Providers() {
  return (
    <>
      <SmoothScroll />
      <Loader />
      <RouteWipe />
    </>
  );
}
