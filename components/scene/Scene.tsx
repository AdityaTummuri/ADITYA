'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import { TIER_CONFIG, type Tier } from '@/lib/tier';
import { useUi } from '@/lib/ui-store';
import Effects from './Effects';
import SignalScene from './SignalScene';

/** Pause rendering while the tab is hidden. */
function Pauser() {
  const setFrameloop = useThree((s) => s.setFrameloop);
  useEffect(() => {
    const on = () => setFrameloop(document.hidden ? 'never' : 'always');
    document.addEventListener('visibilitychange', on);
    return () => document.removeEventListener('visibilitychange', on);
  }, [setFrameloop]);
  return null;
}

/** Calls `onReady` once, after the first frame has been drawn (shaders compiled, composer warm). */
function FirstFrame({ onReady }: { onReady: () => void }) {
  const done = useRef(false);
  useFrame(() => {
    if (done.current) return;
    done.current = true;
    requestAnimationFrame(onReady);
  });
  return null;
}

export default function Scene({ still, tier }: { still: boolean; tier: Tier }) {
  const cfg = TIER_CONFIG[tier];
  const [dpr, setDpr] = useState<number | [number, number]>(cfg.dpr);
  // Fade in once the first frame is up, so the scene eases in instead of popping (and the
  // first-frame shader compile hitch happens while it is still transparent).
  const [ready, setReady] = useState(false);
  return (
    <div
      className="absolute inset-0"
      style={{ opacity: ready || still ? 1 : 0, transition: 'opacity 1.2s var(--ease-out-cubic)' }}
    >
      <Canvas
        flat
        dpr={dpr}
        frameloop={still ? 'demand' : 'always'}
        gl={{ antialias: false, alpha: false, stencil: false, depth: false, powerPreference: 'high-performance' }}
        camera={{ fov: 45, position: [0, 0, 10], near: 0.1, far: 80 }}
        onCreated={({ gl }) => {
          gl.setClearColor('#000000');
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            useUi.getState().setSceneFallback(true);
          });
        }}
      >
        {/* Everything in the scene is an unlit additive ShaderMaterial, so no lights. */}
        <SignalScene still={still} streaks={cfg.streaks} points={cfg.points} />
        <Effects tier={tier} />
        {still ? null : <FirstFrame onReady={() => setReady(true)} />}
        {still ? null : <Pauser />}
        {still ? null : <PerformanceMonitor onDecline={() => setDpr(1)} />}
      </Canvas>
    </div>
  );
}
