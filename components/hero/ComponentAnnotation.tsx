'use client';

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import {
  BufferGeometry,
  CanvasTexture,
  Line,
  LineBasicMaterial,
  MeshBasicMaterial,
  PlaneGeometry,
  RingGeometry,
  SRGBColorSpace,
  Vector3,
  type Vector3Tuple,
} from 'three';

export interface AnnotationHandle {
  setOpacity(v: number): void;
}

export interface AnnotationProps {
  label: string;
  sublabel: string;
  position: Vector3Tuple;
  flip?: boolean;
}

const W = 512;
const H = 128;
const CARD_W = 0.76;
const CARD_H = 0.20;

/**
 * Technical engineering callout annotation rendered directly in Three.js WebGL.
 * Avoids ReactDOM.createRoot / Drei <Html> issues with React 19 concurrent unmounts.
 * Opacity is controlled imperatively through the forwarded AnnotationHandle ref.
 */
const ComponentAnnotation = forwardRef<AnnotationHandle, AnnotationProps>(
  function ComponentAnnotation({ label, sublabel, position, flip = false }, ref) {
    const dotMatRef = useRef<MeshBasicMaterial>(null);
    const cardMatRef = useRef<MeshBasicMaterial>(null);

    // Anchor point ring
    const dotGeo = useMemo(() => new RingGeometry(0.012, 0.024, 16), []);

    // Technical dogleg lead-line
    const lineGeo = useMemo(() => {
      const dir = flip ? -1 : 1;
      const pts = [
        new Vector3(0, 0, 0.01),
        new Vector3(0.12 * dir, 0.07, 0.01),
        new Vector3(0.34 * dir, 0.07, 0.01),
      ];
      return new BufferGeometry().setFromPoints(pts);
    }, [flip]);

    const lineMat = useMemo(
      () =>
        new LineBasicMaterial({
          color: '#8faab2',
          transparent: true,
          opacity: 0,
          depthWrite: false,
        }),
      [],
    );

    const lineObj = useMemo(() => new Line(lineGeo, lineMat), [lineGeo, lineMat]);

    // CanvasTexture for crisp monospace label badge
    const texture = useMemo(() => {
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // High-contrast translucent dark telemetry badge
        ctx.fillStyle = 'rgba(8, 11, 13, 0.88)';
        ctx.strokeStyle = 'rgba(143, 170, 178, 0.40)';
        ctx.lineWidth = 2.5;

        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(8, 8, W - 16, H - 16, 16);
        } else {
          ctx.rect(8, 8, W - 16, H - 16);
        }
        ctx.fill();
        ctx.stroke();

        // Accent indicator bar on lead-line side
        ctx.fillStyle = '#8faab2';
        if (flip) {
          ctx.fillRect(W - 14, 28, 4, H - 56);
        } else {
          ctx.fillRect(10, 28, 4, H - 56);
        }

        // Text typography
        const textX = flip ? W - 28 : 28;
        ctx.textAlign = flip ? 'right' : 'left';

        // Primary title
        ctx.font = '600 32px monospace';
        ctx.fillStyle = '#cfe0e5';
        ctx.shadowColor = 'rgba(143, 170, 178, 0.6)';
        ctx.shadowBlur = 4;
        ctx.fillText(label, textX, 50);

        // Sublabel
        ctx.shadowBlur = 0;
        ctx.font = '500 20px monospace';
        ctx.fillStyle = '#8faab2';
        ctx.fillText(sublabel, textX, 86);
      }

      const tex = new CanvasTexture(canvas);
      tex.colorSpace = SRGBColorSpace;
      return tex;
    }, [label, sublabel, flip]);

    const cardGeo = useMemo(() => new PlaneGeometry(CARD_W, CARD_H), []);

    useImperativeHandle(ref, () => ({
      setOpacity(v: number) {
        const o = Math.max(0, Math.min(1, v));
        if (dotMatRef.current) dotMatRef.current.opacity = o;
        lineMat.opacity = o * 0.75;
        if (cardMatRef.current) cardMatRef.current.opacity = o;
      },
    }));

    // Clean up WebGL resources on unmount
    useEffect(() => {
      return () => {
        dotGeo.dispose();
        lineGeo.dispose();
        lineMat.dispose();
        cardGeo.dispose();
        texture.dispose();
      };
    }, [dotGeo, lineGeo, lineMat, cardGeo, texture]);

    const dir = flip ? -1 : 1;
    const cardX = 0.34 * dir + (CARD_W / 2) * dir;
    const cardY = 0.07;

    return (
      <group position={position}>
        {/* Anchor point ring */}
        <mesh geometry={dotGeo} position={[0, 0, 0.015]}>
          <meshBasicMaterial
            ref={dotMatRef}
            color="#8faab2"
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>

        {/* Lead line */}
        <primitive object={lineObj} />

        {/* Label Badge */}
        <mesh geometry={cardGeo} position={[cardX, cardY, 0.02]}>
          <meshBasicMaterial
            ref={cardMatRef}
            map={texture}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      </group>
    );
  },
);

export default ComponentAnnotation;
