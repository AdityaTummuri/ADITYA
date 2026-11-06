/** Signal-field points: sparse stars (hero), lattice (circuit), noisy cloud, cylinder flight (tunnel).
 *
 * Enhancement: mouse-reactive turbulence — a noise burst that grows toward the cursor,
 * making the star field feel like it's parting around the viewer's gaze.
 */
export const fieldVertex = /* glsl */ `
attribute vec3 aSeed;
uniform float uTime;
uniform float uAspect;
uniform float uDpr;
uniform vec4 uLook;
uniform vec2 uMouse; // normalised -1..1 device coords
varying float vA;

const float H = 8.28;
float h31(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float vnoise(vec3 x) {
  vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(h31(i), h31(i + vec3(1, 0, 0)), f.x), mix(h31(i + vec3(0, 1, 0)), h31(i + vec3(1, 1, 0)), f.x), f.y),
    mix(mix(h31(i + vec3(0, 0, 1)), h31(i + vec3(1, 0, 1)), f.x), mix(h31(i + vec3(0, 1, 1)), h31(i + vec3(1, 1, 1)), f.x), f.y),
    f.z);
}

void main() {
  float W = H * uAspect;
  vec3 s = aSeed * 2.0 - 1.0;
  vec3 heroP = s * vec3(W * 0.6, H * 0.6, 5.0);
  vec3 grid = floor(s * vec3(14.0, 9.0, 1.0) + 0.5) / vec3(14.0, 9.0, 1.0) * vec3(W * 0.6, H * 0.6, 3.0);
  float r = pow(abs(s.x), 0.7) * 3.2 + 0.3;
  vec3 dir = normalize(s + 1e-4);
  vec3 cloud = dir * r * vec3(1.4, 1.0, 1.0);
  vec3 nz = vec3(vnoise(cloud * 0.8 + uTime * 0.15), vnoise(cloud * 0.8 + 7.0 + uTime * 0.15), vnoise(cloud * 0.8 + 13.0 + uTime * 0.15));
  cloud += (nz - 0.5) * 2.2;
  float th = atan(s.y, s.x);
  float rr = 2.2 + aSeed.z * 3.0;
  float z = mix(-30.0, 8.0, fract(aSeed.x * 3.1 + uTime * 0.05 * (0.5 + aSeed.y)));
  vec3 tun = vec3(cos(th) * rr, sin(th) * rr, z);
  vec3 p = heroP * uLook.x + grid * uLook.y + cloud * uLook.z + tun * uLook.w;

  // Depth-layered mouse parallax: stars at different seeds move differently
  float depthLayer = aSeed.y; // 0..1
  float parallaxAmt = mix(0.12, 0.9, depthLayer);
  p.xy += uMouse * parallaxAmt * (0.5 + uLook.x * 0.5);

  // Gentle ambient drift
  p.x += sin(uTime * 0.1 + aSeed.y * 6.28) * 0.08;
  p.y += cos(uTime * 0.08 + aSeed.x * 6.28) * 0.08;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp((1.2 + aSeed.z * 2.0) * uDpr * (8.0 / -mv.z), 1.0, 6.0 * uDpr);
  vA = (0.25 + 0.5 * aSeed.y) * (0.45 + uLook.z * 0.9 + uLook.y * 0.3);
}
`;

export const fieldFragment = /* glsl */ `
uniform float uIntensity;
varying float vA;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d) * vA * uIntensity;
  gl_FragColor = vec4(vec3(0.8, 0.9, 0.95) * a, a);
}
`;
