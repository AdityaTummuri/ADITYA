import { BlendFunction, Effect } from 'postprocessing';
import { wrapEffect } from '@react-three/postprocessing';

const fragment = /* glsl */ `
void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec3 c = inputColor.rgb;
  // tint toward the glacier teal and desaturate 10% (the 3D-LUT look, procedural). No black lift:
  // the canvas must stay true #000000 (DESIGN.md).
  c = mix(c, c * vec3(0.86, 0.97, 1.0), 0.65);
  float l = dot(c, vec3(0.299, 0.587, 0.114));
  c = mix(vec3(l), c, 0.9);
  outputColor = vec4(c, inputColor.a);
}`;

class GradeEffectImpl extends Effect {
  constructor() {
    super('GradeEffect', fragment, { blendFunction: BlendFunction.NORMAL });
  }
}

/** Procedural colour grade (stands in for a .cube LUT; swap for `<LUT lut={...}/>` later). */
export const GradeEffect = wrapEffect(GradeEffectImpl);
