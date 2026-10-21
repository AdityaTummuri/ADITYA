import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, InstancedBufferAttribute, PlaneGeometry, Points, ShaderMaterial, Vector4 } from 'three';
import { fieldFragment, fieldVertex } from './shaders/field';
import { streaksFragment, streaksVertex } from './shaders/streaks';

/** Small deterministic PRNG so scene buffers are pure functions of their size. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createStreakGeometry(count: number): PlaneGeometry {
  const r = rng(1337);
  const g = new PlaneGeometry(1, 1);
  const seed = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    seed[i * 4] = (i + r()) / count; // seed, also drives density culling
    seed[i * 4 + 1] = r(); // lane
    seed[i * 4 + 2] = 0.8 + r() * 2.4; // length
    seed[i * 4 + 3] = 0.4 + r() * 1.4; // speed
  }
  g.setAttribute('aSeed', new InstancedBufferAttribute(seed, 4));
  return g;
}

export function createStreakMaterial(): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader: streaksVertex,
    fragmentShader: streaksFragment,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uAspect: { value: 1 }, uDensity: { value: 1 }, uIntensity: { value: 1 }, uLook: { value: new Vector4(1, 0, 0, 0) } },
  });
}

export function createField(count: number): Points {
  const r = rng(4242);
  const g = new BufferGeometry();
  const seed = new Float32Array(count * 3);
  for (let i = 0; i < seed.length; i++) seed[i] = r();
  g.setAttribute('position', new Float32BufferAttribute(new Float32Array(count * 3), 3));
  g.setAttribute('aSeed', new Float32BufferAttribute(seed, 3));
  const m = new ShaderMaterial({
    vertexShader: fieldVertex,
    fragmentShader: fieldFragment,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uAspect: { value: 1 }, uDpr: { value: 1 }, uIntensity: { value: 1 }, uLook: { value: new Vector4(1, 0, 0, 0) } },
  });
  const pts = new Points(g, m);
  pts.frustumCulled = false;
  return pts;
}

export interface Blend { w: [number, number, number, number]; density: number; intensity: number }

/** Writes the per-frame uniforms. Lives outside React on purpose: three.js uniforms are mutated imperatively. */
export function applyUniforms(streak: ShaderMaterial, field: Points, b: Blend, t: number, aspect: number, dpr: number) {
  const su = streak.uniforms;
  su.uTime.value = t;
  su.uAspect.value = aspect;
  su.uDensity.value = b.density;
  su.uIntensity.value = b.intensity;
  (su.uLook.value as Vector4).set(b.w[0], b.w[1], b.w[2], b.w[3]);
  const fu = (field.material as ShaderMaterial).uniforms;
  fu.uTime.value = t;
  fu.uAspect.value = aspect;
  fu.uDpr.value = dpr;
  fu.uIntensity.value = b.intensity;
  (fu.uLook.value as Vector4).set(b.w[0], b.w[1], b.w[2], b.w[3]);
}
