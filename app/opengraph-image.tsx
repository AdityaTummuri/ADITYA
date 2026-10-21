import { ImageResponse } from 'next/og';

export const alt = 'Aditya Tummuri — The Dreaming Machine';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Inter Tight 400 from Google Fonts at build time; falls back to the default font if the fetch fails. */
async function loadFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await (await fetch('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400', { headers: { 'User-Agent': 'Mozilla/5.0' } })).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

export default async function Image() {
  const font = await loadFont();
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', background: '#000', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '80px', fontFamily: 'Inter Tight' }}>
        <div style={{ fontSize: 44, color: '#8faab2', letterSpacing: '-0.04em' }}>The Dreaming Machine</div>
        <div style={{ fontSize: 120, letterSpacing: '-0.05em', lineHeight: 1 }}>Aditya Tummuri</div>
        <div style={{ fontSize: 30, color: '#b2b2b2', marginTop: 24 }}>ECE · Embedded Systems · Signal Processing · Edge ML</div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: 'Inter Tight', data: font, weight: 400, style: 'normal' }] : undefined },
  );
}
