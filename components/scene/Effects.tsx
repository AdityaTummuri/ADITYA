'use client';

import { Bloom, EffectComposer, Noise, SMAA } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Suspense, useEffect } from 'react';
import { HalfFloatType } from 'three';
import type { Tier } from '@/lib/tier';
import { GradeEffect } from './GradeEffect';

/** Bloom -> grade -> film grain -> SMAA. SMAA is skipped on the low tier. */
export default function Effects({ tier }: { tier: Tier }) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_E2E === '1') {
      (window as Window & { __sceneEffects?: string[] }).__sceneEffects = ['bloom', 'grade', 'noise', ...(tier === 'low' ? [] : ['smaa'])];
    }
  }, [tier]);
  return (
    <Suspense fallback={null}>
      <EffectComposer multisampling={0} frameBufferType={HalfFloatType} enableNormalPass={false} resolutionScale={tier === 'low' ? 0.75 : 1}>
        <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.55} luminanceSmoothing={0.15} radius={0.7} />
        <GradeEffect />
        <Noise premultiply blendFunction={BlendFunction.SCREEN} opacity={0.06} />
        {tier === 'low' ? <></> : <SMAA />}
      </EffectComposer>
    </Suspense>
  );
}
