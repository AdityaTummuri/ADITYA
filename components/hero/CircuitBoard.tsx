'use client';

import { forwardRef, useEffect, useMemo } from 'react';
import {
  AdditiveBlending,
  BoxGeometry,
  Color,
  CylinderGeometry,
  MeshStandardMaterial,
  PlaneGeometry,
  ShaderMaterial,
} from 'three';

// PCB substrate colour — matte black solder mask
const C_PCB = new Color('#080b0d');

// ---- Copper trace shader (glacier-teal signal pulse) ----
const traceVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const traceFrag = /* glsl */ `
  uniform float uTime;
  uniform float uSignalActive;
  varying vec2 vUv;

  // Signed-distance line segment
  float traceLine(vec2 uv, vec2 a, vec2 b, float w) {
    vec2 d = b - a;
    float t = clamp(dot(uv - a, d) / dot(d, d), 0.0, 1.0);
    return 1.0 - smoothstep(0.0, w, length(uv - (a + t * d)));
  }

  // Animated teal pulse travelling along a segment
  float tracePulse(vec2 uv, vec2 a, vec2 b, float w, float speed, float phase) {
    vec2 d = b - a;
    float len2 = dot(d, d);
    float t = clamp(dot(uv - a, d) / len2, 0.0, 1.0);
    vec2 closest = a + t * d;
    float distToLine = length(uv - closest);
    if (distToLine > w * 3.0) return 0.0;
    float pos = mod(uTime * speed + phase, 1.0);
    float distAlong = abs(t - pos);
    return exp(-distAlong * 120.0) * exp(-distToLine * 180.0);
  }

  void main() {
    vec2 uv = vUv;

    // ── Static copper trace network (believable PCB layout) ────────────────
    float tr = 0.0;
    // Power bus — wide horizontal runs
    tr += traceLine(uv, vec2(0.08, 0.50), vec2(0.92, 0.50), 0.0045);
    tr += traceLine(uv, vec2(0.08, 0.42), vec2(0.92, 0.42), 0.003);
    // Vertical trunk lines
    tr += traceLine(uv, vec2(0.50, 0.08), vec2(0.50, 0.92), 0.004);
    tr += traceLine(uv, vec2(0.35, 0.10), vec2(0.35, 0.90), 0.0025);
    tr += traceLine(uv, vec2(0.65, 0.10), vec2(0.65, 0.90), 0.0025);
    // Sensor input routing (left side)
    tr += traceLine(uv, vec2(0.08, 0.72), vec2(0.35, 0.72), 0.003);
    tr += traceLine(uv, vec2(0.08, 0.62), vec2(0.25, 0.62), 0.0025);
    tr += traceLine(uv, vec2(0.25, 0.62), vec2(0.25, 0.50), 0.0025);
    // ADC → MCU routing
    tr += traceLine(uv, vec2(0.35, 0.50), vec2(0.50, 0.50), 0.003);
    tr += traceLine(uv, vec2(0.35, 0.72), vec2(0.35, 0.50), 0.003);
    // USB / UART routing (right side)
    tr += traceLine(uv, vec2(0.65, 0.22), vec2(0.92, 0.22), 0.0025);
    tr += traceLine(uv, vec2(0.65, 0.18), vec2(0.92, 0.18), 0.002);
    tr += traceLine(uv, vec2(0.65, 0.22), vec2(0.65, 0.50), 0.0025);
    // MCU to GPIO headers
    tr += traceLine(uv, vec2(0.08, 0.30), vec2(0.35, 0.30), 0.002);
    tr += traceLine(uv, vec2(0.08, 0.26), vec2(0.35, 0.26), 0.002);
    tr += traceLine(uv, vec2(0.65, 0.30), vec2(0.92, 0.30), 0.002);
    tr += traceLine(uv, vec2(0.65, 0.26), vec2(0.92, 0.26), 0.002);
    // Crystal routing
    tr += traceLine(uv, vec2(0.35, 0.65), vec2(0.50, 0.65), 0.002);
    tr += traceLine(uv, vec2(0.50, 0.65), vec2(0.50, 0.50), 0.002);
    tr = clamp(tr, 0.0, 1.0);

    // ── Static trace colour: warm copper ───────────────────────────────────
    vec3 copperCol = vec3(0.72, 0.45, 0.20);

    // ── Animated glacier-teal signal pulses (chapter 04 signal path) ───────
    float pulse = 0.0;
    if (uSignalActive > 0.1) {
      // Sensor → AFE
      pulse += tracePulse(uv, vec2(0.08, 0.72), vec2(0.35, 0.72), 0.003, 0.28, 0.0);
      pulse += tracePulse(uv, vec2(0.35, 0.72), vec2(0.35, 0.50), 0.003, 0.22, 0.1);
      // AFE → ADC → MCU
      pulse += tracePulse(uv, vec2(0.35, 0.50), vec2(0.50, 0.50), 0.003, 0.32, 0.2);
      // MCU output
      pulse += tracePulse(uv, vec2(0.50, 0.50), vec2(0.65, 0.50), 0.003, 0.26, 0.4);
      pulse += tracePulse(uv, vec2(0.65, 0.50), vec2(0.65, 0.22), 0.003, 0.20, 0.6);
      pulse *= uSignalActive;
    }
    pulse = clamp(pulse, 0.0, 1.0);

    vec3 pulseCol = vec3(0.81, 0.88, 0.90); // glacier teal
    vec3 col = copperCol * tr * (1.0 - pulse * 0.5) + pulseCol * pulse;

    float alpha = max(tr * 0.68, pulse * 1.0);
    gl_FragColor = vec4(col, alpha);
  }
`;

export type TraceMaterial = ShaderMaterial & {
  uniforms: { uTime: { value: number }; uSignalActive: { value: number } };
};

/** FR-4 PCB substrate with copper trace shader and silkscreen ground pour. */
const CircuitBoard = forwardRef<TraceMaterial>(function CircuitBoard(_, ref) {
  const boardGeo = useMemo(() => new BoxGeometry(2.2, 3.5, 0.045), []);
  const boardMat = useMemo(
    () => new MeshStandardMaterial({ color: C_PCB, roughness: 0.72, metalness: 0.02 }),
    [],
  );

  // Trace overlay
  const traceGeo = useMemo(() => new PlaneGeometry(2.2, 3.5), []);
  const traceMat = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: traceVert,
        fragmentShader: traceFrag,
        uniforms: { uTime: { value: 0 }, uSignalActive: { value: 0 } },
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }) as TraceMaterial,
    [],
  );

  // Ground pour
  const groundGeo = useMemo(() => new PlaneGeometry(2.0, 3.3), []);
  const groundMat = useMemo(
    () =>
      new MeshStandardMaterial({
        color: new Color('#0a0e11'),
        roughness: 0.65,
        metalness: 0.08,
        transparent: true,
        opacity: 0.55,
      }),
    [],
  );

  // Mounting holes
  const holeGeo = useMemo(() => new CylinderGeometry(0.055, 0.055, 0.06, 12), []);
  const holeMat = useMemo(
    () => new MeshStandardMaterial({ color: new Color('#000'), roughness: 0.6, metalness: 0 }),
    [],
  );
  const holePositions: [number, number, number][] = [
    [-0.95, 1.6, 0], [0.95, 1.6, 0], [-0.95, -1.6, 0], [0.95, -1.6, 0],
  ];

  // Dispose local geometries and ShaderMaterial on unmount
  useEffect(() => () => {
    boardGeo.dispose(); traceGeo.dispose(); groundGeo.dispose(); holeGeo.dispose();
    boardMat.dispose(); traceMat.dispose(); groundMat.dispose(); holeMat.dispose();
  }, [boardGeo, traceGeo, groundGeo, holeGeo, boardMat, traceMat, groundMat, holeMat]);

  return (
    <group>
      <mesh geometry={boardGeo} material={boardMat} />
      <mesh geometry={groundGeo} material={groundMat} position={[0, 0, 0.023]} />
      {/* Copper trace overlay — ref exposes uniforms to parent useFrame */}
      <mesh ref={ref as React.Ref<any>} geometry={traceGeo} material={traceMat} position={[0, 0, 0.0245]} />
      {holePositions.map((pos, i) => (
        <mesh key={i} geometry={holeGeo} material={holeMat} position={pos} rotation={[Math.PI / 2, 0, 0]} />
      ))}
    </group>
  );
});

export default CircuitBoard;
