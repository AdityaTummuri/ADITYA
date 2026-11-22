'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { MathUtils, type InstancedMesh, type PerspectiveCamera, type ShaderMaterial } from 'three';
import type { Look } from '@/content/types';
import { useScrollStore } from '@/lib/scroll-store';
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
  const streakMesh = useRef<InstancedMesh>(null);
  const cur = useRef<LookParams>({ ...LOOKS.streaks, w: [...LOOKS.streaks.w] });

  const streakGeo = useMemo(() => createStreakGeometry(streaks), [streaks]);
  const streakMat = useMemo(() => createStreakMaterial(), []);
  const field = useMemo(() => createField(points), [points]);

  useEffect(() => () => { streakGeo.dispose(); streakMat.dispose(); field.geometry.dispose(); (field.material as ShaderMaterial).dispose(); }, [streakGeo, streakMat, field]);

  // The canvas sits behind <main>, so it never receives pointer events and R3F's `state.pointer`
  // stays at 0,0. Track the mouse on the window instead (normalised -1..1, y up). Mouse only:
  // a touch would teleport the field. Off under reduced motion.
  const target = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (still) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    // drift back to centre when the cursor leaves the window
    const leave = (e: MouseEvent) => {
      if (!e.relatedTarget) target.current.x = target.current.y = 0;
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('mouseout', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('mouseout', leave);
    };
  }, [still]);

  // A still (reduced-motion) scene renders on demand: redraw once when the section's look changes.
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (!still) return;
    return useScrollStore.subscribe((s, prev) => {
      if (s.look !== prev.look) invalidate();
    });
  }, [still, invalidate]);

  useFrame((state, dt) => {
    const look = LOOKS[useScrollStore.getState().look];
    const p = cur.current;
    if (still) {
      // no easing: jump straight to the look
      for (let i = 0; i < 4; i++) p.w[i] = look.w[i];
      p.density = look.density;
      p.intensity = look.intensity;
      p.mark = look.mark;
      p.camZ = look.camZ;
      p.fov = look.fov;
    } else {
      const k = 3;
      for (let i = 0; i < 4; i++) p.w[i] = MathUtils.damp(p.w[i], look.w[i], k, dt);
      p.density = MathUtils.damp(p.density, look.density, k, dt);
      p.intensity = MathUtils.damp(p.intensity, look.intensity, k, dt);
      p.mark = MathUtils.damp(p.mark, look.mark, k, dt);
      p.camZ = MathUtils.damp(p.camZ, look.camZ, k, dt);
      p.fov = MathUtils.damp(p.fov, look.fov, k, dt);
    }

    const t = still ? 6 : state.clock.elapsedTime;
    const aspect = state.size.width / state.size.height;

    // Smoothed mouse for deep parallax in the shaders
    const m = mouse.current;
    if (!still) {
      m.x = MathUtils.damp(m.x, target.current.x, 4, dt);
      m.y = MathUtils.damp(m.y, target.current.y, 4, dt);
    }
    applyUniforms(streakMat, field, p, t, aspect, state.gl.getPixelRatio(), m.x, m.y);

    const cam = state.camera as PerspectiveCamera;
    cam.position.z = p.camZ;
    if (!still) {
      // camera parallax: the scene reads as genuinely 3D
      cam.position.x = MathUtils.damp(cam.position.x, m.x * 0.8, 2, dt);
      cam.position.y = MathUtils.damp(cam.position.y, m.y * 0.5, 2, dt);
    }
    if (Math.abs(cam.fov - p.fov) > 0.01) { cam.fov = p.fov; cam.updateProjectionMatrix(); }

    if (process.env.NEXT_PUBLIC_E2E === '1') window.__sceneFrames = (window.__sceneFrames ?? 0) + 1;
  });

  return (
    <>
      <instancedMesh ref={streakMesh} args={[streakGeo, streakMat, streaks]} frustumCulled={false} />
      <primitive object={field} />
    </>
  );
}
