'use client';

import { useEffect, useRef, useState } from 'react';
import { useAudioStore } from '@/lib/audio-store';

/**
 * Magnetic floating audio toggle button.
 * - Follows the cursor with spring damping (transforms only, no layout).
 * - Shows "CLICK FOR AUDIO" hint until the user has ever clicked.
 * - Waveform icon pulses when audio is ON.
 * - Fades in 2 seconds after mount.
 * - Uses Web Audio API safely (user-gesture unlock only).
 */
export default function AudioButton() {
  const { enabled, everEnabled, toggle } = useAudioStore();
  const btnRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);

  // Delayed entrance — don't compete with the loader
  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), 2200);
    return () => window.clearTimeout(t);
  }, []);

  // Magnetic mouse-follow effect
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    let mx = 0, my = 0;
    let cx = 0, cy = 0;
    let raf = 0;

    // btn natural center in viewport
    const getCenter = () => {
      const r = btn.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };

    const ATTRACT_RADIUS = 120;
    const STRENGTH = 0.38;

    const tick = () => {
      const center = getCenter();
      const dx = mx - center.x;
      const dy = my - center.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const target = dist < ATTRACT_RADIUS
        ? { x: dx * STRENGTH, y: dy * STRENGTH }
        : { x: 0, y: 0 };

      cx += (target.x - cx) * 0.12;
      cy += (target.y - cy) * 0.12;

      btn.style.transform = `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px)`;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-10 right-10 z-50 flex flex-col items-end gap-2"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
      }}
    >
      {/* Hint label — shown before first interaction */}
      {!everEnabled && (
        <span
          className="pointer-events-none font-body text-caption text-ink-muted tracking-widest uppercase"
          aria-hidden
        >
          Click for audio
        </span>
      )}

      <button
        ref={btnRef}
        onClick={toggle}
        aria-label={enabled ? 'Mute audio' : 'Enable audio'}
        aria-pressed={enabled}
        className="pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-full border border-hairline bg-canvas/80 backdrop-blur-sm transition-colors duration-300 hover:border-primary hover:bg-surface-3"
        style={{ willChange: 'transform' }}
      >
        {/* Waveform bars icon */}
        <WaveIcon active={enabled} />
        {/* Ripple ring when enabled */}
        {enabled && <RippleRing />}
      </button>
    </div>
  );
}

function WaveIcon({ active }: { active: boolean }) {
  const bars = [0.4, 0.7, 1.0, 0.7, 0.4];
  return (
    <svg
      width="22"
      height="18"
      viewBox="0 0 22 18"
      fill="none"
      aria-hidden
      className="overflow-visible"
    >
      {bars.map((h, i) => {
        const barH = h * 14;
        const y = (18 - barH) / 2;
        const x = i * 4.5 + 1;
        return (
          <rect
            key={i}
            x={x}
            y={active ? y : 7}
            width={2.5}
            height={active ? barH : 4}
            rx={1.25}
            fill={active ? 'var(--color-primary)' : 'var(--color-ink-muted)'}
            style={{
              transition: `height ${120 + i * 30}ms cubic-bezier(0.23,1,0.32,1), y ${120 + i * 30}ms cubic-bezier(0.23,1,0.32,1)`,
              transformOrigin: 'center',
              animation: active ? `wave-bar-${i} ${0.8 + i * 0.15}s ease-in-out infinite alternate` : 'none',
            }}
          />
        );
      })}

      <style>{`
        @keyframes wave-bar-0 { to { height: 6px; y: 6px; } }
        @keyframes wave-bar-1 { to { height: 10px; y: 4px; } }
        @keyframes wave-bar-2 { to { height: 6px; y: 6px; } }
        @keyframes wave-bar-3 { to { height: 10px; y: 4px; } }
        @keyframes wave-bar-4 { to { height: 6px; y: 6px; } }
        @media (prefers-reduced-motion: reduce) {
          rect { animation: none !important; }
        }
      `}</style>
    </svg>
  );
}

function RippleRing() {
  return (
    <span
      aria-hidden
      className="absolute inset-0 animate-ping rounded-full border border-primary/40"
      style={{ animationDuration: '2.4s' }}
    />
  );
}

