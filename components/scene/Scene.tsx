'use client';

import { Canvas, useThree } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { useEffect, useState } from 'react';
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

export default function Scene({ still, tier }: { still: boolean; tier: Tier }) {
  const cfg = TIER_CONFIG[tier];
  const [dpr, setDpr] = useState<number | [number, number]>(cfg.dpr);
  return (
    <Canvas
      flat
      dpr={dpr}
      frameloop={still ? 'demand' : 'always'}
      gl={{ antialias: false, alpha: false, stencil: false, powerPreference: 'high-performance' }}
      camera={{ fov: 45, position: [0, 0, 10], near: 0.1, far: 80 }}
      onCreated={({ gl }) => {
        gl.setClearColor('#000000');
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault();
          useUi.getState().setSceneFallback(true);
        });
      }}
    >
      {/* Cinematic three-point lighting rig for TF-01 */}
      <ambientLight intensity={0.08} />
      {/* Key light — teal rim from upper-right front */}
      <directionalLight position={[3, 5, 3]} intensity={0.65} color="#cfe0e5" />
      {/* Fill light — soft teal-grey from left */}
      <directionalLight position={[-4, 2, -2]} intensity={0.28} color="#8faab2" />
      {/* Front accent — glacier glow from camera direction */}
      <pointLight position={[0, 0, 5]} intensity={0.45} color="#8faab2" decay={2} />
      {/* Under-bounce — very faint cold from below */}
      <pointLight position={[0, -3, 1]} intensity={0.1} color="#6a8a94" decay={2} />
      <SignalScene still={still} streaks={cfg.streaks} points={cfg.points} />
      <Effects tier={tier} />
      {still ? null : <Pauser />}
      {still ? null : <PerformanceMonitor onDecline={() => setDpr(1)} />}
    </Canvas>
  );
}
