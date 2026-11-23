import { ImageResponse } from 'next/og';

export const alt = 'Aditya Tummuri. I don’t trust a number until I can run it again.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Inter Tight from Google Fonts at build time; falls back to the default font if the fetch fails. */
async function loadFont(weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Inter+Tight:wght@${weight}`, { headers: { 'User-Agent': 'Mozilla/5.0' } })).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function Image() {
  const regular = await loadFont(400);
  const fonts = regular ? [{ name: 'Inter Tight', data: regular, weight: 400 as const, style: 'normal' as const }] : undefined;
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', background: '#000', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '80px', fontFamily: 'Inter Tight' }}>
        <div style={{ fontSize: 40, color: '#8faab2', letterSpacing: '-0.02em' }}>Aditya Tummuri</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', fontSize: 84, letterSpacing: '-0.04em', lineHeight: 1.05, marginTop: 24 }}>
          <span style={{ marginRight: 24 }}>I don’t trust a number</span>
          <span style={{ display: 'flex', borderBottom: '2px solid #8faab2', paddingBottom: 10 }}>until I can run it again.</span>
        </div>
        <div style={{ fontSize: 30, color: '#9aa5a9', marginTop: 40 }}>QEDCode, FracSST-Mamba, NETRA-UGV, Kavach-UPI</div>
      </div>
    ),
    { ...size, fonts },
  );
}
