'use client';

import { forwardRef, useMemo } from 'react';
import {
  AdditiveBlending,
  BufferGeometry,
  CylinderGeometry,
  EdgesGeometry,
  Float32BufferAttribute,
  Line,
  LineBasicMaterial,
  ShaderMaterial,
  type Group,
} from 'three';

const rimVertex = /* glsl */ `
varying vec3 vN; varying vec3 vV;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vN = normalize(normalMatrix * normal);
  vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;
const rimFragment = /* glsl */ `
varying vec3 vN; varying vec3 vV;
void main() {
  float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.4);
  gl_FragColor = vec4(vec3(0.75, 0.88, 0.93) * f * 0.9, f * 0.55);
}`;

/** Glass hexagon (echoes the card frame) with a signal wave inside. Rotated by the scene's useFrame. */
const Mark = forwardRef<Group>(function Mark(_, ref) {
  const { edges, shell, wave } = useMemo(() => {
    const cyl = new CylinderGeometry(1.25, 1.25, 0.45, 6);
    const edgesGeo = new EdgesGeometry(cyl);
    const rim = new ShaderMaterial({ vertexShader: rimVertex, fragmentShader: rimFragment, transparent: true, depthWrite: false, blending: AdditiveBlending });
    const pts: number[] = [];
    for (let i = 0; i <= 80; i++) {
      const x = -0.95 + (1.9 * i) / 80;
      pts.push(x, Math.sin(x * 6.0) * 0.28 * (1 - Math.abs(x) * 0.5), 0.26);
    }
    const waveGeo = new BufferGeometry();
    waveGeo.setAttribute('position', new Float32BufferAttribute(pts, 3));
    const waveLine = new Line(waveGeo, new LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.95, blending: AdditiveBlending, depthWrite: false }));
    return { edges: edgesGeo, shell: { geometry: cyl, material: rim }, wave: waveLine };
  }, []);

  return (
    <group ref={ref}>
      <group rotation={[Math.PI / 2, 0, 0]}>
        <lineSegments geometry={edges}>
          <lineBasicMaterial color="#dfe9ec" transparent opacity={0.9} blending={AdditiveBlending} depthWrite={false} />
        </lineSegments>
        <mesh geometry={shell.geometry} material={shell.material} />
      </group>
      <primitive object={wave} />
    </group>
  );
});

export default Mark;
