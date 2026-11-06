'use client';

import { forwardRef, useEffect, useMemo, useRef, useImperativeHandle } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';
import { useFrame } from '@react-three/fiber';

const W = 256;
const H = 128;

function drawWaveform(ctx: CanvasRenderingContext2D, time: number, freq: number) {
  // ── Background — OLED pitch black ────────────────────────────────────────
  ctx.fillStyle = '#050708';
  ctx.fillRect(0, 0, W, H);

  // ── Graticule grid ────────────────────────────────────────────────────────
  ctx.strokeStyle = 'rgba(143,170,178,0.08)';
  ctx.lineWidth = 0.5;
  for (let x = 0; x <= W; x += 32) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y <= H; y += 32) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Centre graticule hairlines (brighter)
  ctx.strokeStyle = 'rgba(207,224,229,0.07)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke();

  // ── Phosphor ghost — previous frame at reduced opacity ────────────────────
  ctx.strokeStyle = 'rgba(143,170,178,0.16)';
  ctx.lineWidth = 1.5;
  ctx.shadowColor = 'rgba(143,170,178,0.2)';
  ctx.shadowBlur = 3;
  ctx.beginPath();
  for (let x = 0; x < W; x++) {
    const y =
      H / 2 +
      Math.sin(x * 0.05 + (time - 0.1) * 4) * (16 + freq * 11) +
      Math.cos(x * 0.12 - (time - 0.1) * 2) * 6;
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();

  // ── Live trace — bright glacier teal ─────────────────────────────────────
  ctx.strokeStyle = '#cfe0e5';
  ctx.lineWidth = 2;
  ctx.shadowColor = '#8faab2';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  for (let x = 0; x < W; x++) {
    const y =
      H / 2 +
      Math.sin(x * 0.05 + time * 4) * (20 + freq * 15) +
      Math.cos(x * 0.12 - time * 2) * 8 +
      Math.sin(x * 0.3 + time * 7) * freq * 5;
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();

  // ── Trigger indicator tick ────────────────────────────────────────────────
  ctx.strokeStyle = 'rgba(207,224,229,0.5)';
  ctx.lineWidth = 1;
  ctx.shadowBlur = 0;
  ctx.beginPath(); ctx.moveTo(W / 2, H / 2 - 5); ctx.lineTo(W / 2, H / 2 + 5); ctx.stroke();

  // ── Oscilloscope readout label ────────────────────────────────────────────
  ctx.fillStyle = 'rgba(143,170,178,0.55)';
  ctx.font = '8px monospace';
  ctx.shadowBlur = 0;
  ctx.fillText('CH1  10ms/div  2V/div', 4, H - 4);
}

export interface OledHandle {
  /** Set the audio frequency amplitude [0, 1]. Called imperatively from TF01Instrument's useFrame. */
  setFreq(v: number): void;
}

/** Off-screen canvas oscilloscope texture for the TF-01 OLED display. */
const OledScreen = forwardRef<OledHandle>(function OledScreen(_, ref) {
  const canvasRef  = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<CanvasTexture | null>(null);
  const freqRef    = useRef(0); // imperative frequency value — no React state

  useImperativeHandle(ref, () => ({
    setFreq(v: number) { freqRef.current = v; },
  }));

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width  = W;
    canvas.height = H;
    canvasRef.current = canvas;
    const tex = new CanvasTexture(canvas);
    tex.colorSpace = SRGBColorSpace;
    textureRef.current = tex;
    return tex;
  }, []);

  useEffect(() => () => { texture.dispose(); }, [texture]);

  useFrame(({ clock }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawWaveform(ctx, clock.elapsedTime, freqRef.current);
    texture.needsUpdate = true;
  });

  return (
    <mesh position={[0, 0.38, 0.141]}>
      <planeGeometry args={[1.5, 0.75]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
});

export default OledScreen;
