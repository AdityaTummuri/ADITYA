'use client';

import { forwardRef, useMemo, useImperativeHandle, useRef } from 'react';
import {
  BackSide,
  BoxGeometry,
  Color,
  CylinderGeometry,
  FrontSide,
  MeshStandardMaterial,
  type Group,
} from 'three';
import OledScreen, { type OledHandle } from './OledScreen';

// --- Shared material colours (design tokens) ----
const C_ENCLOSURE = new Color('#0d1215'); // dark graphite chassis
const C_BUTTON = new Color('#1a1a1a');    // PBT keycap
const C_METAL = new Color('#2a2e31');     // anodized metal trim
const C_DISPLAY_FRAME = new Color('#070a0c'); // OLED bezel
const C_SCREW = new Color('#111416');

function useMat(color: Color, roughness = 0.65, metalness = 0.15) {
  return useMemo(
    () => new MeshStandardMaterial({ color, roughness, metalness }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
}

/** Four M2 hex-head screws in the corners of the front panel. */
function CornerScrews() {
  const positions: [number, number, number][] = [
    [-0.95, 1.65, 0],
    [0.95, 1.65, 0],
    [-0.95, -1.65, 0],
    [0.95, -1.65, 0],
  ];
  const mat = useMemo(
    () => new MeshStandardMaterial({ color: C_SCREW, roughness: 0.5, metalness: 0.7 }),
    [],
  );
  const geo = useMemo(() => new CylinderGeometry(0.055, 0.055, 0.025, 6), []);
  return (
    <>
      {positions.map((pos, i) => (
        <mesh key={i} geometry={geo} material={mat} position={pos} rotation={[Math.PI / 2, 0, 0]} />
      ))}
    </>
  );
}

/** Rotary encoder knob on the top-right of the front panel. */
function RotaryEncoder() {
  const shaftMat = useMemo(
    () => new MeshStandardMaterial({ color: C_METAL, roughness: 0.35, metalness: 0.75 }),
    [],
  );
  const bodyGeo = useMemo(() => new CylinderGeometry(0.11, 0.11, 0.09, 24), []);
  const shaftGeo = useMemo(() => new CylinderGeometry(0.035, 0.035, 0.065, 12), []);
  // Indicator notch
  const notchGeo = useMemo(() => new BoxGeometry(0.015, 0.09, 0.02), []);
  return (
    <group position={[0.72, 1.45, 0.14]}>
      <mesh geometry={bodyGeo} material={shaftMat} rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={shaftGeo} material={shaftMat} position={[0, 0, 0.055]} rotation={[Math.PI / 2, 0, 0]} />
      {/* White indicator dot */}
      <mesh geometry={notchGeo} position={[0, 0, 0.065]}>
        <meshBasicMaterial color="#cfe0e5" />
      </mesh>
    </group>
  );
}

/** Three tactile push buttons. */
function TactileButtons() {
  const positions: [number, number, number][] = [
    [-0.3, 1.5, 0.14],
    [0.0, 1.5, 0.14],
    [0.3, 1.5, 0.14],
  ];
  const bodyGeo = useMemo(() => new BoxGeometry(0.15, 0.1, 0.055), []);
  const capGeo = useMemo(() => new CylinderGeometry(0.055, 0.055, 0.025, 12), []);
  const bodyMat = useMemo(
    () => new MeshStandardMaterial({ color: C_BUTTON, roughness: 0.9, metalness: 0.0 }),
    [],
  );
  const capMat = useMemo(
    () => new MeshStandardMaterial({ color: new Color('#141618'), roughness: 0.85, metalness: 0 }),
    [],
  );
  return (
    <>
      {positions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh geometry={bodyGeo} material={bodyMat} />
          <mesh geometry={capGeo} material={capMat} position={[0, 0, 0.034]} rotation={[Math.PI / 2, 0, 0]} />
        </group>
      ))}
    </>
  );
}

/** USB-C port on the bottom edge. */
function UsbCPort() {
  const outerGeo = useMemo(() => new BoxGeometry(0.22, 0.095, 0.085), []);
  const tongueGeo = useMemo(() => new BoxGeometry(0.16, 0.055, 0.07), []);
  const shellMat = useMemo(
    () => new MeshStandardMaterial({ color: new Color('#1e2224'), roughness: 0.3, metalness: 0.9 }),
    [],
  );
  const tongueMat = useMemo(
    () => new MeshStandardMaterial({ color: new Color('#c0c8cc'), roughness: 0.25, metalness: 0.95 }),
    [],
  );
  return (
    <group position={[0, -1.75, 0.08]}>
      <mesh geometry={outerGeo} material={shellMat} />
      <mesh geometry={tongueGeo} material={tongueMat} position={[0, 0, 0.005]} />
    </group>
  );
}

/** Four sensor terminal pins along the top edge. */
function SensorTerminals() {
  const pinGeo = useMemo(() => new CylinderGeometry(0.038, 0.038, 0.12, 8), []);
  const pinMat = useMemo(
    () => new MeshStandardMaterial({ color: new Color('#c8d2d6'), roughness: 0.25, metalness: 0.9 }),
    [],
  );
  const labelsX = [-0.6, -0.2, 0.2, 0.6];
  return (
    <>
      {labelsX.map((x, i) => (
        <mesh key={i} geometry={pinGeo} material={pinMat} position={[x, 1.84, 0.12]} />
      ))}
    </>
  );
}

/** OLED display bezel with recessed glass surface. */
function DisplayBezel({ oledRef }: { oledRef: React.Ref<OledHandle> }) {
  const bezelGeo = useMemo(() => new BoxGeometry(1.68, 0.92, 0.025), []);
  const insetGeo = useMemo(() => new BoxGeometry(1.56, 0.80, 0.02), []);
  const bezelMat = useMemo(
    () => new MeshStandardMaterial({ color: C_DISPLAY_FRAME, roughness: 0.8, metalness: 0.05 }),
    [],
  );
  const glassMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: new Color('#030507'),
        roughness: 0.05,
        metalness: 0.1,
        transparent: true,
        opacity: 0.92,
      }),
    [],
  );
  return (
    <group position={[0, 0.38, 0.14]}>
      <mesh geometry={bezelGeo} material={bezelMat} />
      {/* Recessed glass surface */}
      <mesh geometry={insetGeo} material={glassMat} position={[0, 0, -0.002]} />
      {/* Live canvas texture waveform */}
      <OledScreen ref={oledRef} />
    </group>
  );
}

/** Ventilation slot details on the back shell. */
function VentSlots() {
  const slotGeo = useMemo(() => new BoxGeometry(0.6, 0.025, 0.02), []);
  const slotMat = useMemo(
    () => new MeshStandardMaterial({ color: new Color('#050709'), roughness: 0.9, metalness: 0 }),
    [],
  );
  return (
    <>
      {[-0.2, -0.08, 0.04, 0.16, 0.28].map((y, i) => (
        <mesh key={i} geometry={slotGeo} material={slotMat} position={[0, y - 0.9, -0.14]} />
      ))}
    </>
  );
}

interface Props {
  frontShellRef: React.Ref<Group>;
  backShellRef: React.Ref<Group>;
}

export type { OledHandle };

/**
 * TF-01 instrument body — front/back shells with all physical controls.
 * Shells are exposed as refs so the parent TF01Instrument can animate them independently.
 * forwardRef exposes an OledHandle so the parent can drive audio reactivity imperatively.
 */
export default forwardRef<OledHandle, Props>(function InstrumentBody(
  { frontShellRef, backShellRef },
  ref,
) {
  const oledRef = useRef<OledHandle>(null!);

  useImperativeHandle(ref, () => ({
    setFreq(v: number) { oledRef.current?.setFreq(v); },
  }));

  const frontGeo = useMemo(() => new BoxGeometry(2.4, 3.8, 0.28), []);
  const backGeo  = useMemo(() => new BoxGeometry(2.4, 3.8, 0.28), []);
  const chassisMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: C_ENCLOSURE,
        roughness: 0.65,
        metalness: 0.15,
        side: FrontSide,
      }),
    [],
  );
  const backMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: new Color('#0a0d10'),
        roughness: 0.7,
        metalness: 0.12,
        side: BackSide,
      }),
    [],
  );

  return (
    <group>
      {/* FRONT SHELL */}
      <group ref={frontShellRef} position={[0, 0, 0.14]}>
        <mesh geometry={frontGeo} material={chassisMat} />
        <DisplayBezel oledRef={oledRef} />
        <TactileButtons />
        <RotaryEncoder />
        <CornerScrews />
        <UsbCPort />
        <SensorTerminals />
      </group>

      {/* BACK SHELL */}
      <group ref={backShellRef} position={[0, 0, -0.14]}>
        <mesh geometry={backGeo} material={backMat} />
        <VentSlots />
      </group>
    </group>
  );
});

