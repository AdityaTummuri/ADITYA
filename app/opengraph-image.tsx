import { ImageResponse } from 'next/og';

export const alt = 'Aditya Tummuri. I don’t trust a number until I can run it again.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Bricolage Grotesque from Google Fonts at build time; falls back to the default font if the fetch fails. */
async function loadFont(weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@${weight}`, { headers: { 'User-Agent': 'Mozilla/5.0' } })).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function Image() {
  const bold = await loadFont(800);
  const fonts = bold ? [{ name: 'Bricolage Grotesque', data: bold, weight: 800 as const, style: 'normal' as const }] : undefined;
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', background: '#f7f0e0', color: '#17142e', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '72px', fontFamily: 'Bricolage Grotesque', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 56, right: 72, display: 'flex', fontSize: 30, background: '#ffd86b', border: '4px solid #17142e', borderRadius: 99, padding: '8px 26px' }}>QEDCode, FracSST-Mamba, NETRA-UGV, Kavach-UPI</div>
        <div style={{ display: 'flex', fontSize: 40, letterSpacing: '-0.02em' }}>Aditya Tummuri</div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 100, letterSpacing: '-0.045em', lineHeight: 1.0, marginTop: 20 }}>
          <span style={{ display: 'flex' }}>I don’t trust a number</span>
          <span style={{ display: 'flex', alignSelf: 'flex-start', background: '#ff4f9a', padding: '0 14px' }}>until I can run it again.</span>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
