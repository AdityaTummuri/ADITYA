/** Pure-CSS stand-in for the scene: streak gradients plus SVG grain. Used when WebGL is unavailable. */
export default function WebGLFallback() {
  const grain =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='120' height='120' filter='url(%23n)' opacity='.18'/></svg>\")";
  return (
    <div data-webgl-fallback className="absolute inset-0 overflow-hidden bg-canvas">
      <div
        className="absolute -inset-[40%]"
        style={{
          background:
            'repeating-linear-gradient(115deg,transparent 0 46px,rgba(255,255,255,.07) 46px 48px,transparent 48px 120px),repeating-linear-gradient(115deg,transparent 0 83px,rgba(207,224,229,.3) 83px 84px,transparent 84px 210px),radial-gradient(60% 50% at 50% 50%,rgba(143,170,178,.16),transparent 70%)',
        }}
      />
      <div className="absolute inset-0 mix-blend-screen" style={{ backgroundImage: grain }} />
    </div>
  );
}
