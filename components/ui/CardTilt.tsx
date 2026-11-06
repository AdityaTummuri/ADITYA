'use client';

import { useRef, useCallback } from 'react';

/**
 * Wraps any card-like content with:
 *  1. Perspective 3D tilt on pointer move (rotateX / rotateY).
 *  2. Proximity radial border glow that tracks the cursor position.
 *
 * Both effects reset smoothly on pointer leave.
 * Fully CSS-variable-driven — no JS animation frame needed.
 */
export default function CardTilt({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // Normalised coordinates [-1, 1]
    const nx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
    const ny = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    // Cursor position in px for the radial gradient
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    el.style.setProperty('--px', String(nx));
    el.style.setProperty('--py', String(ny));
    el.style.setProperty('--mx', `${mx}px`);
    el.style.setProperty('--my', `${my}px`);
    el.style.setProperty('--over', '1');
  }, []);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--px', '0');
    el.style.setProperty('--py', '0');
    el.style.setProperty('--over', '0');
  }, []);

  return (
    <div
      ref={ref}
      className={`card-tilt ${className}`}
      style={{
        // CSS variables consumed by :before pseudo or inline transform
        ['--px' as string]: '0',
        ['--py' as string]: '0',
        ['--mx' as string]: '50%',
        ['--my' as string]: '50%',
        ['--over' as string]: '0',
        position: 'relative',
        transformStyle: 'preserve-3d',
        transform: `perspective(800px) rotateX(calc(var(--py) * -5deg)) rotateY(calc(var(--px) * 5deg))`,
        transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        willChange: 'transform',
      }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {/* Radial border spotlight */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          border: '1px solid transparent',
          background: `
            radial-gradient(
              180px circle at var(--mx) var(--my),
              rgba(143,170,178,calc(var(--over) * 0.55)),
              transparent 70%
            ) border-box
          `,
          WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'destination-out',
          maskComposite: 'exclude',
          transition: 'opacity 0.4s ease',
          opacity: 'var(--over)',
        }}
      />
      {children}
    </div>
  );
}

