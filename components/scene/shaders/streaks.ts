/**
 * Streak shaders. One instanced quad per streak; four layouts (hero diagonal, circuit lanes,
 * cloud = hidden, tunnel = radial flight) are computed per vertex and blended by `uLook`.
 * World height at z=0 for the default camera (z=10, fov 45) is 8.28.
 */
export const streaksVertex = /* glsl */ `
attribute vec4 aSeed; // x seed, y lane, z length, w speed
uniform float uTime;
uniform float uAspect;
uniform float uDensity;
uniform vec4 uLook; // hero, circuit, cloud, tunnel
varying vec2 vUv;
varying float vFade;

const float H = 8.28;
float hash(float n) { return fract(sin(n * 127.1) * 43758.5453); }

vec3 hero(vec4 s, vec2 q) {
  float W = H * uAspect;
  float a = 1.05;
  vec2 d = vec2(cos(a), sin(a));
  vec2 n = vec2(-d.y, d.x);
  float span = W + H;
  float u = (s.y - 0.5) * span;
  float t = fract(s.x * 3.7 + uTime * s.w * 0.06);
  float along = (t - 0.5) * span * 1.5;
  float len = s.z * 2.2;
  vec2 head = d * along + n * u;
  vec2 pos = head + d * ((q.x - 0.5) * len) + n * (q.y * 0.018 * (0.5 + s.w * 0.6));
  return vec3(pos, -s.z * 1.5);
}

vec3 circuit(vec4 s, vec2 q) {
  float W = H * uAspect;
  bool horiz = hash(s.x * 9.1) > 0.5;
  vec2 d = horiz ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec2 n = vec2(-d.y, d.x);
  float ext = horiz ? H : W;
  float u = (floor(s.y * 18.0) / 18.0 - 0.5) * ext * 1.05;
  float span = horiz ? W : H;
  float t = fract(s.x * 5.3 + uTime * s.w * 0.05);
  float along = (t - 0.5) * span * 1.3;
  float len = s.z * 1.1;
  vec2 head = d * along + n * u;
  vec2 pos = head + d * ((q.x - 0.5) * len) + n * (q.y * 0.014);
  return vec3(pos, -2.0);
}

vec3 tunnel(vec4 s, vec2 q) {
  float th = s.x * 6.2831;
  float r = 1.4 + s.y * 3.6;
  float z = mix(-34.0, 9.0, fract(s.x * 11.7 + uTime * s.w * 0.12));
  vec2 d = vec2(cos(th), sin(th));
  vec2 n = vec2(-d.y, d.x);
  float prox = smoothstep(-34.0, 9.0, z);
  float len = s.z * (0.4 + prox * 2.2);
  vec2 pos = d * r + d * ((q.x - 0.5) * len) + n * (q.y * 0.02);
  return vec3(pos, z);
}

void main() {
  vec2 q = position.xy;
  vec3 p = hero(aSeed, q) * (uLook.x + uLook.z) + circuit(aSeed, q) * uLook.y + tunnel(aSeed, q) * uLook.w;
  float on = step(aSeed.x, uDensity);
  vUv = uv;
  vFade = on * (uLook.x + uLook.y + uLook.w * 1.2);
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
}
`;

export const streaksFragment = /* glsl */ `
uniform float uIntensity;
varying vec2 vUv;
varying float vFade;
void main() {
  float head = pow(vUv.x, 2.2);
  float edge = pow(max(1.0 - abs(vUv.y - 0.5) * 2.0, 0.0), 1.5);
  float a = head * edge * vFade * uIntensity;
  vec3 col = mix(vec3(0.56, 0.67, 0.70), vec3(1.0), head * 0.8);
  gl_FragColor = vec4(col * a * 2.0, a);
}
`;
