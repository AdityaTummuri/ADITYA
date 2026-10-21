'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { MathUtils, type Group, type InstancedMesh, type PerspectiveCamera, type ShaderMaterial } from 'three';
import type { Look } from '@/content/types';
import { useScrollStore } from '@/lib/scroll-store';
import { useUi } from '@/lib/ui-store';
import Mark from './Mark';
import { applyUniforms, createField, createStreakGeometry, createStreakMaterial } from './scene-objects';

interface LookParams { w: [number, number, number, number]; density: number; intensity: number; mark: number; camZ: number; fov: number }

const LOOKS: Record<Look, LookParams> = {
  streaks: { w: [1, 0, 0, 0], density: 1, intensity: 1, mark: 1, camZ: 10, fov: 45 },
  grid: { w: [0, 1, 0, 0], density: 0.7, intensity: 0.9, mark: 0.5, camZ: 11, fov: 42 },
  calm: { w: [1, 0, 0, 0], density: 0.3, intensity: 0.35, mark: 0, camZ: 10, fov: 45 },
  cloud: { w: [0, 0, 1, 0], density: 0.2, intensity: 0.9, mark: 0, camZ: 9, fov: 50 },
  tunnel: { w: [0, 0, 0, 1], density: 1, intensity: 1.1, mark: 0, camZ: 6, fov: 60 },
};

declare global {
  interface Window { __sceneFrames?: number }
}

/**
 * One scene whose look is blended by uniforms (never swapped). Reads the scroll store inside
 * useFrame, so scroll progress never triggers a React render.
 */
export default function SignalScene({ still, streaks, points }: { still: boolean; streaks: number; points: number }) {
  const markRef = useRef<Group>(null);
  const streakMesh = useRef<InstancedMesh>(null);
  const cur = useRef<LookParams>({ ...LOOKS.streaks, w: [...LOOKS.streaks.w] });
  const announced = useRef(false);

  const streakGeo = useMemo(() => createStreakGeometry(streaks), [streaks]);
  const streakMat = useMemo(() => createStreakMaterial(), []);
  const field = useMemo(() => createField(points), [points]);

  useEffect(() => () => { streakGeo.dispose(); streakMat.dispose(); field.geometry.dispose(); (field.material as ShaderMaterial).dispose(); }, [streakGeo, streakMat, field]);

  useFrame((state, dt) => {
    const target = LOOKS[useScrollStore.getState().look];
    const p = cur.current;
    const k = still ? 100 : 3;
    for (let i = 0; i < 4; i++) p.w[i] = MathUtils.damp(p.w[i], target.w[i], k, dt);
    p.density = MathUtils.damp(p.density, target.density, k, dt);
    p.intensity = MathUtils.damp(p.intensity, target.intensity, k, dt);
    p.mark = MathUtils.damp(p.mark, target.mark, k, dt);
    p.camZ = MathUtils.damp(p.camZ, target.camZ, k, dt);
    p.fov = MathUtils.damp(p.fov, target.fov, k, dt);

    const t = still ? 6 : state.clock.elapsedTime;
    const aspect = state.size.width / state.size.height;
    const progress = useScrollStore.getState().progress;
    applyUniforms(streakMat, field, p, t, aspect, state.gl.getPixelRatio());

    const mark = markRef.current;
    if (mark) {
      mark.scale.setScalar(Math.max(p.mark, 0.001));
      mark.rotation.x = 1.0 + progress * 0.35;
      mark.rotation.y = t * 0.12;
      mark.rotation.z = Math.sin(t * 0.2) * 0.2;
    }
    const cam = state.camera as PerspectiveCamera;
    cam.position.z = p.camZ;
    if (!still) {
      cam.position.x = MathUtils.damp(cam.position.x, state.pointer.x * 0.25, 2, dt);
      cam.position.y = MathUtils.damp(cam.position.y, state.pointer.y * 0.15, 2, dt);
    }
    if (Math.abs(cam.fov - p.fov) > 0.01) { cam.fov = p.fov; cam.updateProjectionMatrix(); }

    if (process.env.NEXT_PUBLIC_E2E === '1') window.__sceneFrames = (window.__sceneFrames ?? 0) + 1;
    if (!announced.current) { announced.current = true; useUi.getState().setLoaded(true); }
  });

  return (
    <>
      <instancedMesh ref={streakMesh} args={[streakGeo, streakMat, streaks]} frustumCulled={false} />
      <primitive object={field} />
      <Mark ref={markRef} />
    </>
  );
}
