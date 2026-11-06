'use client';

import { forwardRef, useMemo, useImperativeHandle, useRef, useEffect } from 'react';
import {
  BoxGeometry,
  Color,
  CylinderGeometry,
  Group,
  InstancedMesh,
  Matrix4,
  MeshStandardMaterial,
  PlaneGeometry,
} from 'three';

// ── Shared material colours ───────────────────────────────────────────────
const C_RF_SHIELD  = new Color('#1c2124');
const C_IC_BODY    = new Color('#111314');
const C_CRYSTAL    = new Color('#c8cdd0');
const C_GOLD       = new Color('#c8a860');
const C_CERAMIC    = new Color('#d4c89a');
const C_RESISTOR   = new Color('#2a2015');

function mat(color: Color, roughness = 0.6, metalness = 0.1) {
  return new MeshStandardMaterial({ color, roughness, metalness });
}

// ── Memoised geometries (module-level singletons) ─────────────────────────
const geo = {
  shieldBox:  new BoxGeometry(0.72, 0.9, 0.055),
  pinRow:     new BoxGeometry(0.65, 0.025, 0.025),
  labelPlane: new PlaneGeometry(0.65, 0.12),
  qfn:        new BoxGeometry(0.3, 0.3, 0.035),
  pad:        new BoxGeometry(0.045, 0.025, 0.012),
  sot223:     new BoxGeometry(0.22, 0.14, 0.055),
  sotTab:     new BoxGeometry(0.14, 0.055, 0.055),
  crystalCan: new CylinderGeometry(0.05, 0.05, 0.1, 12),
  soic16:     new BoxGeometry(0.26, 0.4, 0.035),
  headerPin:  new CylinderGeometry(0.012, 0.012, 0.11, 6),
  passive:    new BoxGeometry(0.065, 0.045, 0.028),
};

// ── Shared materials (module-level singletons) ────────────────────────────
const mats = {
  rfShield: mat(C_RF_SHIELD, 0.3, 0.75),
  goldPin:  mat(C_GOLD, 0.2, 0.9),
  label:    new MeshStandardMaterial({ color: new Color('#8faab2'), transparent: true, opacity: 0.4 }),
  ic:       mat(C_IC_BODY, 0.7, 0.05),
  sot:      mat(C_IC_BODY, 0.65, 0.05),
  sotTab:   mat(C_GOLD, 0.25, 0.85),
  crystal:  mat(C_CRYSTAL, 0.3, 0.75),
  ceramic:  mat(C_CERAMIC, 0.75, 0),
  resistor: mat(C_RESISTOR, 0.8, 0),
};

// ── Handle type the parent binds to ──────────────────────────────────────
export interface ElectronicsHandle {
  /** Set the world-space Y lift applied to individual component groups (chapter 03). */
  setLift(y: number): void;
}

/** ESP32-S3 RF-shielded module. */
function Esp32Module({ groupRef }: { groupRef: React.Ref<Group> }) {
  return (
    <group ref={groupRef} position={[0.1, 0.3, 0]}>
      <mesh geometry={geo.shieldBox} material={mats.rfShield} position={[0, 0, 0.025]} />
      <mesh geometry={geo.pinRow} material={mats.goldPin} position={[0, 0.44, 0.012]} />
      <mesh geometry={geo.pinRow} material={mats.goldPin} position={[0, -0.44, 0.012]} />
      <mesh geometry={geo.labelPlane} material={mats.label} position={[0, 0.05, 0.056]} />
    </group>
  );
}

/** Analog Front-End / ADC IC (QFN-16). */
function AfeAdcIc({ groupRef }: { groupRef: React.Ref<Group> }) {
  return (
    <group ref={groupRef} position={[-0.55, 0.0, 0]}>
      <mesh geometry={geo.qfn} material={mats.ic} position={[0, 0, 0.018]} />
      {[-0.12, 0, 0.12].map((x, i) => (
        <mesh key={i} geometry={geo.pad} material={mats.goldPin} position={[x, 0.16, 0.012]} />
      ))}
    </group>
  );
}

/** PMIC / LDO regulator (SOT-223). */
function PmicIc({ groupRef }: { groupRef: React.Ref<Group> }) {
  return (
    <group ref={groupRef} position={[0.5, -0.6, 0]}>
      <mesh geometry={geo.sot223} material={mats.sot} position={[0, 0, 0.028]} />
      <mesh geometry={geo.sotTab} material={mats.sotTab} position={[0, -0.1, 0.028]} />
    </group>
  );
}

/** 40 MHz metal-can crystal oscillator. */
function CrystalOsc({ groupRef }: { groupRef: React.Ref<Group> }) {
  return (
    <group ref={groupRef} position={[-0.2, -0.5, 0]}>
      <mesh geometry={geo.crystalCan} material={mats.crystal} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.055]} />
    </group>
  );
}

/** USB-to-serial bridge (SOIC-16). */
function UsbBridgeIc({ groupRef }: { groupRef: React.Ref<Group> }) {
  return (
    <group ref={groupRef} position={[0.6, -1.1, 0]}>
      <mesh geometry={geo.soic16} material={mats.ic} position={[0, 0, 0.018]} />
    </group>
  );
}

/** Sensor I/O cluster (grouped passives near sensor headers). */
function SensorIo({ groupRef }: { groupRef: React.Ref<Group> }) {
  return (
    <group ref={groupRef} position={[-0.7, 0.9, 0]}>
      {[0, 0.07, 0.14].map((x, i) => (
        <mesh key={i} geometry={geo.passive} material={mats.ceramic} position={[x - 0.07, 0, 0.014]} />
      ))}
    </group>
  );
}

/** GPIO expansion headers — always stay on board (not lifted). */
function GpioHeaders() {
  return (
    <>
      {(['left', 'right'] as const).map((side) => {
        const x = side === 'left' ? -0.95 : 0.95;
        return Array.from({ length: 10 }, (_, i) => (
          <mesh key={`${side}${i}`} geometry={geo.headerPin} material={mats.goldPin}
            position={[x, -0.9 + i * 0.1, 0.055]} />
        ));
      })}
    </>
  );
}

/** Instanced SMD 0805 passives distributed across the board. */
function SmdPassives() {
  const capMesh = useMemo(() => {
    const m = new InstancedMesh(geo.passive, mats.ceramic, 24);
    const mx = new Matrix4();
    for (let i = 0; i < 24; i++) {
      mx.setPosition(-0.9 + (i % 8) * 0.26, 0.85 - Math.floor(i / 8) * 0.22, 0.014);
      m.setMatrixAt(i, mx);
    }
    m.instanceMatrix.needsUpdate = true;
    return m;
  }, []);

  const resMesh = useMemo(() => {
    const m = new InstancedMesh(geo.passive, mats.resistor, 12);
    const mx = new Matrix4();
    for (let i = 0; i < 12; i++) {
      mx.setPosition(-0.75 + (i % 6) * 0.26, -0.1 - Math.floor(i / 6) * 0.22, 0.014);
      m.setMatrixAt(i, mx);
    }
    m.instanceMatrix.needsUpdate = true;
    return m;
  }, []);

  // Dispose InstancedMesh objects (geometry/material are module singletons, skip those)
  useEffect(() => () => { capMesh.dispose(); resMesh.dispose(); }, [capMesh, resMesh]);

  return (
    <>
      <primitive object={capMesh} />
      <primitive object={resMesh} />
    </>
  );
}

// Per-component lift multipliers (chapter 03 staggering)
const LIFT_SCALE = [0.70, 0.50, 0.40, 0.35, 0.30, 0.45] as const;

/**
 * All electronic components positioned on the PCB.
 * Exposes a handle so the parent's useFrame can set lift imperatively.
 */
const ElectronicsComponents = forwardRef<ElectronicsHandle>(
  function ElectronicsComponents(_, ref) {
    const mcuRef    = useRef<Group>(null!);
    const afeRef    = useRef<Group>(null!);
    const pmicRef   = useRef<Group>(null!);
    const xtalRef   = useRef<Group>(null!);
    const usbRef    = useRef<Group>(null!);
    const sensorRef = useRef<Group>(null!);

    const groups = [mcuRef, afeRef, pmicRef, xtalRef, usbRef, sensorRef] as const;

    useImperativeHandle(ref, () => ({
      setLift(y: number) {
        groups.forEach((r, i) => {
          if (r.current) r.current.position.z = y * LIFT_SCALE[i];
        });
      },
    }));

    return (
      <group position={[0, 0, 0.023]}>
        <Esp32Module  groupRef={mcuRef} />
        <AfeAdcIc     groupRef={afeRef} />
        <PmicIc       groupRef={pmicRef} />
        <CrystalOsc   groupRef={xtalRef} />
        <UsbBridgeIc  groupRef={usbRef} />
        <SensorIo     groupRef={sensorRef} />
        <GpioHeaders />
        <SmdPassives />
      </group>
    );
  },
);

export default ElectronicsComponents;
