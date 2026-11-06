'use client';

import { useRef } from 'react';
import {
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  type Group,
} from 'three';
import { useFrame } from '@react-three/fiber';
import { useScrollStore } from '@/lib/scroll-store';
import { getAudioFrequency } from '@/lib/audio-engine';
import { CHAPTER_TRANSFORMS, COMPONENT_DESCRIPTORS } from './types';
import InstrumentBody, { type OledHandle } from './InstrumentBody';
import CircuitBoard, { type TraceMaterial } from './CircuitBoard';
import ElectronicsComponents, { type ElectronicsHandle } from './ElectronicsComponents';
import ComponentAnnotation, { type AnnotationHandle } from './ComponentAnnotation';

/** Linearly interpolate between floor/ceil chapter transforms using progress (0..1). */
function getTarget(chapter: number, progress: number) {
  const max = CHAPTER_TRANSFORMS.length - 1;
  const c0  = Math.min(chapter, max);
  const c1  = Math.min(chapter + 1, max);
  const t0  = CHAPTER_TRANSFORMS[c0];
  const t1  = CHAPTER_TRANSFORMS[c1];
  const p   = Math.max(0, Math.min(1, progress));
  const L   = (a: number, b: number) => a + (b - a) * p;
  return {
    frontZ:       L(t0.frontShellZ,    t1.frontShellZ),
    backZ:        L(t0.backShellZ,     t1.backShellZ),
    pcbX:         L(t0.pcbOffset[0],   t1.pcbOffset[0]),
    pcbY:         L(t0.pcbOffset[1],   t1.pcbOffset[1]),
    pcbZ:         L(t0.pcbOffset[2],   t1.pcbOffset[2]),
    pcbRotY:      L(t0.pcbRotY,        t1.pcbRotY),
    shellOpacity: L(t0.shellOpacity,   t1.shellOpacity),
    liftY:        L(t0.componentLiftY, t1.componentLiftY),
    signalTarget: (p >= 0.5 ? t1 : t0).signalActive ? 1 : 0,
    mcuZoomTarget:(p >= 0.5 ? t1 : t0).mcuZoom      ? 2.6 : 1.0,
  };
}

/** Traverse a Group and fade all MeshStandardMaterial opacity. */
function setGroupOpacity(group: Group, opacity: number) {
  group.traverse((o) => {
    const mesh = o as Mesh;
    if (!mesh.isMesh) return;
    const m = mesh.material as MeshStandardMaterial;
    if (!m || !('opacity' in m)) return;
    m.transparent = true;
    m.opacity = Math.max(0.001, opacity);
  });
}

const ANNOT_FLIP = [false, true, false, true, true, false] as const;

/**
 * Root R3F group for TF-01.  All animation is driven inside useFrame via
 * imperative Three.js mutations — zero React setState calls per frame.
 */
export default function TF01Instrument({ audioFreq = 0, still = false }: { audioFreq?: number; still?: boolean }) {
  // ── Object refs ──────────────────────────────────────────────────────────
  const rootRef       = useRef<Group>(null!);
  const frontShellRef = useRef<Group>(null!);
  const backShellRef  = useRef<Group>(null!);
  const pcbGroupRef   = useRef<Group>(null!);
  // CircuitBoard is a forwardRef that places the trace Mesh (ShaderMaterial) on ref
  const traceMeshRef  = useRef<Mesh & { material: TraceMaterial }>(null!);
  const componentsRef = useRef<ElectronicsHandle>(null!);
  const annotRefs     = useRef<(AnnotationHandle | null)[]>([]);
  const oledRef       = useRef<OledHandle>(null!);

  // ── Smooth state (never triggers re-render) ───────────────────────────────
  const sm = useRef({
    frontZ: 0,       backZ: 0,
    pcbX: 0,         pcbY: 0,         pcbZ: 0,
    pcbRotY: 0,
    shellOpacity: 1,
    liftY: 0,
    signal: 0,
    pcbScale: 1,
    rotX: 0,         rotY: 0,
    annotOp: 0,
  });

  // ── Frame loop ─────────────────────────────────────────────────────────────
  useFrame((state, dt) => {
    const { chapter, progress } = useScrollStore.getState();
    const tgt = getTarget(chapter, progress);
    const k   = 4.5; // damping spring — mechanical, not rubbery
    const r   = sm.current;

    // Damp all scalars
    r.frontZ       = MathUtils.damp(r.frontZ,       tgt.frontZ,       k, dt);
    r.backZ        = MathUtils.damp(r.backZ,         tgt.backZ,         k, dt);
    r.pcbX         = MathUtils.damp(r.pcbX,          tgt.pcbX,          k, dt);
    r.pcbY         = MathUtils.damp(r.pcbY,          tgt.pcbY,          k, dt);
    r.pcbZ         = MathUtils.damp(r.pcbZ,          tgt.pcbZ,          k, dt);
    r.pcbRotY      = MathUtils.damp(r.pcbRotY,       tgt.pcbRotY,       k, dt);
    r.shellOpacity = MathUtils.damp(r.shellOpacity,  tgt.shellOpacity,  k, dt);
    r.liftY        = MathUtils.damp(r.liftY,         tgt.liftY,         k, dt);
    r.signal       = MathUtils.damp(r.signal,        tgt.signalTarget,  3, dt);
    r.pcbScale     = MathUtils.damp(r.pcbScale,      tgt.mcuZoomTarget, 3, dt);

    const annotTarget = (chapter >= 3 && chapter <= 5) ? 1 : 0;
    r.annotOp = MathUtils.damp(r.annotOp, annotTarget, 3, dt);

    // ── Cursor parallax ───────────────────────────────────────────────────
    if (rootRef.current) {
      const targetRotY = still ? 0 : state.pointer.x * 0.42;
      const targetRotX = still ? 0 : -state.pointer.y * 0.26;
      r.rotY = MathUtils.damp(r.rotY, targetRotY, 3, dt);
      r.rotX = MathUtils.damp(r.rotX, targetRotX, 3, dt);
      rootRef.current.rotation.y = r.rotY;
      rootRef.current.rotation.x = r.rotX;
      // Idle float — fades out as teardown progresses past chapter 0; suppressed in still mode
      const floatAmount = still ? 0 : Math.max(0, 1 - chapter - progress) * 0.045;
      rootRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * floatAmount;
    }

    // ── Shell positions ────────────────────────────────────────────────────
    if (frontShellRef.current) {
      frontShellRef.current.position.z = r.frontZ + 0.14;
      setGroupOpacity(frontShellRef.current, r.shellOpacity);
    }
    if (backShellRef.current) {
      backShellRef.current.position.z = r.backZ - 0.14;
      setGroupOpacity(backShellRef.current, r.shellOpacity);
    }

    // ── PCB group transform ────────────────────────────────────────────────
    if (pcbGroupRef.current) {
      pcbGroupRef.current.position.set(r.pcbX, r.pcbY, r.pcbZ);
      pcbGroupRef.current.rotation.y = r.pcbRotY;
      pcbGroupRef.current.scale.setScalar(r.pcbScale);
    }

    // ── Signal trace shader uniforms ───────────────────────────────────────
    if (traceMeshRef.current) {
      const mat = traceMeshRef.current.material;
      mat.uniforms.uTime.value         = state.clock.elapsedTime;
      mat.uniforms.uSignalActive.value = r.signal;
    }

    // ── Component lift ─────────────────────────────────────────────────────
    componentsRef.current?.setLift(r.liftY);

    // ── Annotation opacity ─────────────────────────────────────────────────
    annotRefs.current.forEach((a) => a?.setOpacity(r.annotOp));

    // ── Audio → OLED reactivity ────────────────────────────────────────────
    // getAudioFrequency is zero-alloc (reuses a module-level Uint8Array)
    oledRef.current?.setFreq(getAudioFrequency());
  });

  return (
    <group ref={rootRef}>
      {/* Enclosure — oledRef wires audio frequency into OledScreen imperatively */}
      <InstrumentBody
        ref={oledRef}
        frontShellRef={frontShellRef}
        backShellRef={backShellRef}
      />

      {/* PCB assembly */}
      <group ref={pcbGroupRef}>
        {/*
          CircuitBoard is forwardRef → the ref lands on the trace Mesh.
          We cast via `as any` because forwardRef<TraceMaterial> diverges from
          Mesh's own ref type, but the runtime object is the Mesh we need.
        */}
        <CircuitBoard ref={traceMeshRef as any} />
        <ElectronicsComponents ref={componentsRef} />

        {/* Engineering callout annotations */}
        {COMPONENT_DESCRIPTORS.map((desc, i) => (
          <ComponentAnnotation
            key={desc.id}
            ref={(el) => { annotRefs.current[i] = el; }}
            label={desc.label}
            sublabel={desc.sublabel}
            position={desc.anchorPos}
            flip={ANNOT_FLIP[i]}
          />
        ))}
      </group>
    </group>
  );
}
