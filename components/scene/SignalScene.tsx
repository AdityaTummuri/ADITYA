'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { MathUtils, Vector2, type InstancedMesh, type PerspectiveCamera, type ShaderMaterial } from 'three';
import type { Look } from '@/content/types';
import { useScrollStore } from '@/lib/scroll-store';
import { applyUniforms, createField, createStreakGeometry, createStreakMaterial } from './scene-objects';

interface LookParams {
  w: [number, number, number, number]; density: number; intensity: number; camZ: number; fov: number;
  /** x0, x1, floor of the quiet zone under the text column (plan 6.2). */
  yield: [number, number, number];
}

const LOOKS: Record<Look, LookParams> = {
  streaks: { w: [1, 0, 0, 0], density: 0.85, intensity: 0.9, camZ: 10, fov: 45, yield: [0.35, 0.75, 0.15] },
  grid: { w: [0, 1, 0, 0], density: 0.55, intensity: 0.5, camZ: 11, fov: 42, yield: [0.3, 0.8, 0.35] },
  calm: { w: [1, 0, 0, 0], density: 0.3, intensity: 0.3, camZ: 10, fov: 45, yield: [0.3, 0.8, 0.35] },
  cloud: { w: [0, 0, 1, 0], density: 0.2, intensity: 0.7, camZ: 9, fov: 50, yield: [0.3, 0.8, 0.3] },
  tunnel: { w: [0, 0, 0, 1], density: 0.8, intensity: 0.7, camZ: 6, fov: 60, yield: [0.3, 0.8, 0.25] },
};

declare global {
  interface Window { __sceneFrames?: number }
}

/**
 * One scene whose look is blended by uniforms (never swapped). Reads the scroll store inside
 * useFrame, so scroll progress never triggers a React render.
 */
export default function SignalScene({ still, streaks, points, resScale = 1 }: { still: boolean; streaks: number; points: number; resScale?: number }) {
  const streakMesh = useRef<InstancedMesh>(null);
  const size = useMemo(() => new Vector2(), []);
  // travel: a push of speed on every route change that decays back to rest (plan 8.2)
  const boost = useRef(0);
  const flow = useRef(0);
  const seen = useRef(useScrollStore.getState().travel.n);
  const cur = useRef<LookParams>({ ...LOOKS.streaks, w: [...LOOKS.streaks.w], yield: [...LOOKS.streaks.yield] });

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
      if (s.look !== prev.look || s.preview !== prev.preview) invalidate();
    });
  }, [still, invalidate]);

  useFrame((state, delta) => {
    // a background tab or a long task must not jump the scene forward
    const dt = Math.min(delta, 0.05);
    const store = useScrollStore.getState();
    const look = LOOKS[store.preview ?? store.look];
    const p = cur.current;
    if (still) {
      // no easing: jump straight to the look
      for (let i = 0; i < 4; i++) p.w[i] = look.w[i];
      p.density = look.density;
      p.intensity = look.intensity;
      for (let i = 0; i < 3; i++) p.yield[i] = look.yield[i];
      p.camZ = look.camZ;
      p.fov = look.fov;
    } else {
      const k = 3;
      for (let i = 0; i < 4; i++) p.w[i] = MathUtils.damp(p.w[i], look.w[i], k, dt);
      p.density = MathUtils.damp(p.density, look.density, k, dt);
      p.intensity = MathUtils.damp(p.intensity, look.intensity, k, dt);
      for (let i = 0; i < 3; i++) p.yield[i] = MathUtils.damp(p.yield[i], look.yield[i], k, dt);
      p.camZ = MathUtils.damp(p.camZ, look.camZ, k, dt);
      p.fov = MathUtils.damp(p.fov, look.fov, k, dt);
    }

    let travelBoost = 0;
    if (!still) {
      const { travel } = store;
      if (travel.n !== seen.current) {
        seen.current = travel.n;
        boost.current = MathUtils.clamp(boost.current + travel.dir, -1.2, 1.2);
      }
      boost.current = MathUtils.damp(boost.current, 0, 3.2, dt);
      travelBoost = boost.current;
      flow.current += dt * (1 + travelBoost * 9);
    }
    const t = still ? 6 : flow.current;
    const aspect = state.size.width / state.size.height;

    // Smoothed mouse for deep parallax in the shaders
    const m = mouse.current;
    if (!still) {
      m.x = MathUtils.damp(m.x, target.current.x, 4, dt);
      m.y = MathUtils.damp(m.y, target.current.y, 4, dt);
    }
    const buf = state.gl.getDrawingBufferSize(size);
    applyUniforms(streakMat, field, p, t, aspect, state.gl.getPixelRatio(), m.x, m.y, buf.x * resScale, buf.y * resScale, 1 + Math.abs(travelBoost) * 1.6);

    const cam = state.camera as PerspectiveCamera;
    cam.position.z = p.camZ - travelBoost * 2.2;
    if (!still) {
      // camera parallax: the scene reads as genuinely 3D
      cam.position.x = MathUtils.damp(cam.position.x, m.x * 0.8, 2, dt);
      cam.position.y = MathUtils.damp(cam.position.y, m.y * 0.5, 2, dt);
    }
    const fov = p.fov + Math.abs(travelBoost) * 6;
    if (Math.abs(cam.fov - fov) > 0.01) { cam.fov = fov; cam.updateProjectionMatrix(); }

    if (process.env.NEXT_PUBLIC_E2E === '1') window.__sceneFrames = (window.__sceneFrames ?? 0) + 1;
  });

  return (
    <>
      <instancedMesh ref={streakMesh} args={[streakGeo, streakMat, streaks]} frustumCulled={false} />
      <primitive object={field} />
    </>
  );
}
