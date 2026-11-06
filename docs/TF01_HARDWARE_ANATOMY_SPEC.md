# TF-01 FIELD INSTRUMENT & PORTFOLIO ENHANCEMENT
## Master Implementation Blueprint & Execution Checklist

> **Purpose:** This document serves as the persistent single source of truth for "The Dreaming Machine" portfolio enhancement. Any model or agent taking over this workspace must reference this document to execute and track progress.

---

## 1. Project Vision & Identity

* **Identity:** Aditya Tummuri — ECE student, hardware builder, and systems researcher.
* **Aesthetic Source:** 8bit.ai visual language — pitch black (`#000000`), glacier teal (`#8faab2` / `#cfe0e5`), white typography, muted gray (`#b2b2b2`), hair-thin lines (`rgba(207,224,229,0.16)`), film grain, and subtle bloom.
* **The Core Centerpiece:** **TF-01 — Experimental Field Instrument**. A fictional, technically credible handheld electronic instrument (portable oscilloscope + sensor acquisition platform + embedded compute device).
* **Guiding Principle:** **"I don't just write software. I build things that interact with the physical world."** Do not create abstract glowing sci-fi sculptures or energy reactors. The centerpiece must look like real, engineered electronics hardware.
* **Preservation Rule:** Keep existing Next.js 16 / React 19 pages, navigation, typography, and case studies completely intact. Enhance the central 3D canvas and interaction layers seamlessly.
* **Explicit Exclusion:** The Cybernetic Telemetry / Diagnostic HUD requested earlier is explicitly **paused / not implemented now**.

---

## 2. Architecture & File Layout

```text
ADITYA/
├── components/
│   ├── hero/                          # NEW: TF-01 Hardware Subsystem
│   │   ├── TF01Instrument.tsx         # Root assembly coordinating enclosure, PCB, & teardown
│   │   ├── InstrumentBody.tsx         # Front/back matte enclosure, buttons, encoder, bezel
│   │   ├── CircuitBoard.tsx           # Matte-black PCB with copper traces, solder pads, silkscreen
│   │   ├── ElectronicsComponents.tsx  # ESP32 MCU module, PMIC, ADC, crystal, capacitors, resistors
│   │   ├── SignalTraceShader.ts       # GLSL shader for dynamic pulse traveling along PCB traces
│   │   ├── OledScreen.tsx             # Interactive canvas/shader oscilloscope display with live waveform
│   │   ├── ComponentAnnotation.tsx    # Small engineering typography labels with lead-lines
│   │   └── types.ts                   # Teardown chapter transforms & component anchor data
│   ├── scene/
│   │   ├── SceneCanvas.tsx            # Main WebGL Canvas container
│   │   ├── Scene.tsx                  # Canvas setup, camera setup, lighting
│   │   ├── SignalScene.tsx            # Scene manager (holds TF-01 + background streaks/stars)
│   │   ├── Effects.tsx                # Post-processing (Bloom, Grade, Film Grain, SMAA)
│   │   └── shaders/                   # GLSL shaders (field.ts, streaks.ts, trace.ts)
│   ├── chrome/
│   │   ├── AudioButton.tsx            # Magnetic floating audio toggle button
│   │   └── Header.tsx / FooterHud.tsx # Existing UI chrome
│   └── home/
│       ├── Chapter.tsx                # Pinned chapter scroll controller (GSAP ScrollTrigger)
│       ├── ProjectCard.tsx            # 3D tilt + proximity border spotlight
│       └── FocusCard.tsx              # 3D tilt + proximity border spotlight
├── lib/
│   ├── audio-engine.ts                # Web Audio API singleton (synth drone, whoosh, chimes)
│   ├── audio-store.ts                 # Zustand audio state + localStorage persistence
│   ├── scroll-store.ts                # Bridge between GSAP ScrollTrigger and Three.js useFrame
│   └── smooth-scroll.tsx              # Lenis smooth scroll configuration
└── docs/
    └── TF01_HARDWARE_ANATOMY_SPEC.md   # This specification
```

---

## 2.5 Skills Matrix & Workflow Mapping

Every phase and subsystem is guided by specialized skills installed in `.agents/skills/` and `~/.gemini/config/skills/`. Any agent executing this specification must reference the corresponding skill:

| Subsystem / Task | Assigned Skill | Exact Guidelines & Techniques |
| :--- | :--- | :--- |
| **Procedural Meshes & Instancing** | `threejs-geometry` | • Build chamfered enclosure boxes and PCB substrate without bloated external CAD files.<br>• Use `InstancedMesh` for repeated SMD 0805 capacitors and resistors to keep draw calls $\le 15$. |
| **PBR Materials & Finishes** | `threejs-materials` | • Realistic FR-4 matte black solder mask (`roughness 0.72`), brushed metal RF shield (`roughness 0.28`, `metalness 0.85`), dark polycarbonate chassis.<br>• Avoid fake full-specular plastic looks. |
| **Signal Traces & Shader FX** | `threejs-shaders` | • Custom GLSL fragment shader animating glacier-teal pulses along PCB traces.<br>• Screen phosphor decay shader for the OLED oscilloscope. |
| **Studio Framing & Teardown Views**| `threejs-product-viewer` | • Cinematic product lighting rig (rim light, subtle key, low ambient).<br>• Camera aspect ratio compensation and three-quarter initial hero perspective. |
| **Technical Pin Callouts** | `threejs-html` | • Screen-space projection for component annotations (`ESP32-S3`, `16-BIT ADC`, `LDO REG`).<br>• Zero layout shift, auto-fade during fast scroll, occlusion handling. |
| **Cinematic Camera Postprocessing** | `threejs-postprocessing` | • Tuned bloom threshold (`0.45`) and smoothing (`0.25`) so glacier teal signals glow without blowing out the black canvas.<br>• Film grain noise blend mode. |
| **60 FPS Budget & Memory** | `threejs-performance` | • Explicit resource disposal (`geometry.dispose()`, `material.dispose()`) on unmount.<br>• Mutate Three.js uniforms and transforms imperatively in `useFrame`, zero React `setState` during scroll. |
| **Audio Engine & Reactivity** | `browser-audio` | • Web Audio API user-gesture unlock lifecycle.<br>• Connect `AnalyserNode` (`fftSize = 512`) to feed frequency bins into the 3D uniforms.<br>• Spatial 3D sound positioning for the instrument. |
| **Physical Motion & 3D Card Tilt** | `apple-design` & `design-motion-principles` | • Natural spring physics (`type: "spring", bounce: 0.15`).<br>• Perspective card tilt (`rotateX`, `rotateY`) and proximity radial border glow on hover. |
| **Scroll Scrub Choreography** | `oil-motion` | • Deterministic scrub mapping linking scroll progress to CAD teardown and reconstruction.<br>• Exact bidirectional frame-by-frame mechanical continuity. |
| **Verification & Quality Gate** | `verification-before-completion` | • Require `npx tsc --noEmit` and `npm test` verification before claiming complete.<br>• Performance audit on mobile and desktop viewports. |

---

## 3. The 3D Object Anatomy: TF-01

### 3.1 Dimensions & Physical Construction
* **Proportions:** 2.4 units (W) × 3.8 units (H) × 0.55 units (D) — ergonomic handheld aspect ratio.
* **Enclosure:**
  * **Front Chassis:** Dark graphite matte polycarbonate (`#0d1215`, roughness 0.65, metalness 0.15) with 0.1 unit corner radiuses.
  * **OLED Window:** Recessed glass bezel with 128×64 aspect canvas texture rendering an active glacier-teal oscilloscope trace.
  * **Controls:** 
    * 1× Knurled Rotary Encoder (dark anodized aluminum, top-right).
    * 3× Tactile Click Buttons (low-profile silicone/PBT keycaps).
    * 1× USB-C Port (bottom edge, realistic metallic shield & tongue).
    * 4× Sensor Terminal Pins / BNC-style coaxial sub-connectors (top edge).
  * **Fasteners:** 4× M2 hex-head screws recessed into corner standoffs.

### 3.2 The PCB (Printed Circuit Board)
* **Base Board:** FR-4 substrate with matte-black solder mask (`#080b0d`, roughness 0.72) and visible dielectric thickness (0.04 units).
* **Traces & Ground Planes:** Copper/gold finished traces rendered via custom shader or procedural normal/bump maps with glacier-teal signal routing paths.
* **Component Inventory:**
  1. **ESP32-S3 Microcontroller:** Rectangular metal RF shield with laser-engraved silkscreen text (`ESP32-S3 / DUAL-CORE / T-FIELD`).
  2. **Analog Front-End (AFE) & ADC:** 16-pin QFN package positioned directly adjacent to sensor input pins.
  3. **PMIC & LDO Voltage Regulators:** SOT-223 and QFN packages near USB-C power rail.
  4. **Crystal Oscillator:** 32.768 kHz and 40 MHz metal can crystals.
  5. **Passives:** 0603 and 0805 SMD ceramic capacitors and metal-film resistors grouped in realistic decoupling clusters.
  6. **Expansion Headers:** Gold-plated 0.1" pitch male pin headers along the lateral edges.

---

## 4. Teardown Sequence (Chapters 00 – 06)

Scroll progress smoothly animates the hardware transformation using GSAP ScrollTrigger coupled to Three.js `useFrame` via `MathUtils.damp`.

```text
Chapter 00 [The Machine]  ──► Floating complete device, live waveform
Chapter 01 [The Shell]    ──► Front & back shells separate along Z axis
Chapter 02 [The Board]    ──► PCB slides forward, camera pans & rotates
Chapter 03 [Components]   ──► Chips & passives lift off board with annotations
Chapter 04 [The Signal]   ──► Sensor In ──► Filter ──► ADC ──► MCU pulse trace
Chapter 05 [Intelligence] ──► Macro zoom into MCU die / silicon logic structure
Chapter 06 [Reconstruct]  ──► Reverse assembly back to sealed instrument
```

### Transformation Matrix Per Chapter:
| Chapter | Camera Position [X, Y, Z] | Enclosure Offset $\Delta Z$ | PCB Offset [X, Y, Z] | Component Lift $\Delta Y$ | Signal Path Active |
|---|---|---|---|---|---|
| **00: Machine** | `[0, 0, 7.5]` | `0.0` | `[0, 0, 0]` | `0.0` | Inactive (OLED only) |
| **01: Shell** | `[0, 0, 7.0]` | Front: `+1.4`, Back: `-1.4` | `[0, 0, 0]` | `0.0` | Idle |
| **02: Board** | `[0.5, 0, 5.2]` | Front: `+3.2`, Back: `-3.2` | `[0, 0, 0.4]` (rotated $15^\circ$) | `0.0` | Copper routing visible |
| **03: Components** | `[0.2, 0, 4.5]` | Hidden / Faded | `[0, 0, 0]` | Chips: `+0.35` to `+0.7` | Annotation lines visible |
| **04: Signal** | `[0, -0.2, 4.2]` | Hidden | `[0, 0, 0]` | `0.0` | Dynamic pulse flow |
| **05: Intelligence** | `[0.3, 0.4, 2.4]` | Hidden | Focus on MCU | Die level exposed | Logic pulses |
| **06: Reconstruct** | `[0, 0, 7.5]` | Back to `0.0` | Back to `[0, 0, 0]` | Back to `0.0` | Resealed instrument |

---

## 5. Technical Implementation Details ("How-To")

### 5.1 Three.js / R3F Frame Damping
In `SignalScene.tsx` / `TF01Instrument.tsx`, never set state on scroll. Mutate Three.js transforms imperatively inside `useFrame`:
```typescript
useFrame((state, dt) => {
  const { chapter, progress } = useScrollStore.getState();
  const targetTransform = getChapterTransforms(chapter, progress);
  
  // Smooth mechanical motion with spring-like damping
  groupRef.current.position.lerp(targetTransform.pos, Math.min(dt * 5, 1));
  groupRef.current.quaternion.slerp(targetTransform.rot, Math.min(dt * 5, 1));
  
  // Cursor parallax
  const mx = state.pointer.x * 0.4;
  const my = state.pointer.y * 0.25;
  groupRef.current.rotation.y += (mx - groupRef.current.rotation.y) * 0.08;
  groupRef.current.rotation.x += (-my - groupRef.current.rotation.x) * 0.08;
});
```

### 5.2 Live OLED Waveform Canvas
An off-screen HTML5 Canvas (256×128) renders a live sweep oscilloscope and is bound to a `CanvasTexture`:
```typescript
function drawWaveform(ctx: CanvasRenderingContext2D, time: number, audioFreq: number) {
  ctx.fillStyle = '#050708';
  ctx.fillRect(0, 0, 256, 128);
  
  // Grid lines
  ctx.strokeStyle = 'rgba(143, 170, 178, 0.12)';
  ctx.lineWidth = 1;
  // draw 16px grid...
  
  // Oscilloscope trace
  ctx.strokeStyle = '#cfe0e5';
  ctx.shadowColor = '#8faab2';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  for (let x = 0; x < 256; x++) {
    const y = 64 + Math.sin(x * 0.05 + time * 4) * (20 + audioFreq * 15)
                 + Math.cos(x * 0.12 - time * 2) * 8;
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
}
```

### 5.3 Web Audio Reactivity Hookup
Connect the existing `audio-engine.ts` Web Audio API singleton to Three.js:
1. Export `getAudioByteFrequency(): number` from `lib/audio-engine.ts` using `analyser.getByteFrequencyData()`.
2. In `useFrame`, read the low-frequency average (bass) and high-frequency shimmer.
3. Pass values to `uAudioBass` and `uAudioShimmer` uniforms to subtly breathe the oscilloscope trace and trace pulse intensity without jarring jitter.

### 5.4 3D Card Tilt & Border Spotlight
Add to `components/home/ProjectCard.tsx` and `FocusCard.tsx`:
* Card container gets `onPointerMove`: calculates mouse coordinate offset from card center in normalized `[-1, 1]`.
* Applies CSS transform: `transform: perspective(800px) rotateX(calc(var(--py) * -6deg)) rotateY(calc(var(--px) * 6deg));`.
* Masked border element draws a radial gradient at `(var(--mx)px, var(--my)px)` with `#8faab2` at center, creating the illuminated hairline effect.

---

## 6. Comprehensive Implementation Checklist

### Phase 1: Preparation & Base Setup
- [ ] Inspect existing `SceneCanvas.tsx`, `Scene.tsx`, and `SignalScene.tsx`.
- [ ] Create `components/hero/` module directory.
- [ ] Define shared hardware interfaces and types in `components/hero/types.ts`.
- [ ] Set up the `CanvasTexture` oscilloscope engine for the OLED screen.

### Phase 2: Procedural Geometry & Materials of TF-01
- [ ] **Enclosure (`InstrumentBody.tsx`)**:
  - [ ] Front shell with chamfered display cutout and button cavities.
  - [ ] Back shell with battery bay extrusion and grip ribs.
  - [ ] Rotary encoder mesh (knurled cylinder + indicator notch).
  - [ ] Silicone tactile buttons & USB-C metal port.
  - [ ] 4× M2 corner hex screws.
- [ ] **Circuit Board (`CircuitBoard.tsx`)**:
  - [ ] Matte-black substrate mesh with mounting holes.
  - [ ] Copper routing trace shader/texture with glacier-teal paths.
  - [ ] Ground plane pours and silkscreen technical markings (`TF-01 REV 2.4`, `GND`, `VCC`, `IN0`).
- [ ] **Components (`ElectronicsComponents.tsx`)**:
  - [ ] ESP32-S3 module with metallic RF shield.
  - [ ] QFN/SOIC analog front-end ICs and ADC.
  - [ ] Crystal oscillators (silver cans).
  - [ ] Instanced SMD capacitors and resistors (0805 packages).
  - [ ] Gold-plated 0.1" GPIO pin headers.

### Phase 3: Scroll-Driven Teardown Choreography
- [ ] Wire `useScrollStore` progress to chapter animation targets.
- [ ] Chapter 00: Assembled instrument with floating idle oscillation.
- [ ] Chapter 01: Enclosure separation along Z axis (`front: +Z`, `rear: -Z`).
- [ ] Chapter 02: PCB detachment, camera dolly-in, and 15° isometric rotation.
- [ ] Chapter 03: Component lift-off with individual $\Delta Y$ offsets.
- [ ] Chapter 04: Active signal path animation (`Sensor -> AFE -> ADC -> MCU`).
- [ ] Chapter 05: Microscopic zoom into MCU die geometry.
- [ ] Chapter 06: Deterministic reconstruction sequence back to sealed unit.
- [ ] Verify reverse scrolling reconstructs smoothly from 06 back to 00.

### Phase 4: Interactive Engineering Annotations
- [ ] Create `ComponentAnnotation.tsx` using Drei `<Html>` or SVG screen-space projection.
- [ ] Add technical labels: `ESP32-S3 / DUAL-CORE`, `ANALOG FRONT-END / 16-BIT ADC`, `POWER MGMT / LDO REG`, `SENSOR I/O`.
- [ ] Connect component hover events to trigger subtle glacier-teal edge highlighting.
- [ ] Ensure HTML annotations fade out under reduced-motion or during rapid scrolling.

### Phase 5: Audio Reactivity & UI Polish
- [ ] Connect `AnalyserNode` frequency bins from `lib/audio-engine.ts` into the OLED waveform.
- [ ] Implement tactile micro-click audio on card hover / button interaction.
- [ ] Implement 3D perspective tilt on `ProjectCard` and `FocusCard`.
- [ ] Implement cursor-proximity radial border glow on cards.
- [ ] Smooth footer boundary transition to cleanly loop back to Chapter 00.

### Phase 6: Verification & Performance
- [ ] Run `npx tsc --noEmit` and ensure 0 TypeScript errors.
- [ ] Run `npm test` and verify all existing unit tests pass.
- [ ] Verify 60 FPS performance on Chromium DevTools performance profiler.
- [ ] Test mobile viewport responsive layout and touch interaction.
- [ ] Verify `prefers-reduced-motion` renders an elegant static assembled view.

---

## 7. Acceptance Criteria

1. **Engineering Believability:** The object is instantly recognizable as an electronics instrument, not a fantasy sci-fi core.
2. **Deterministic Scroll:** Scrolling down dismantles the device into its physical anatomy; scrolling up puts every screw, chip, and case back together seamlessly.
3. **Palette Purity:** Strictly black (`#000000`), glacier teal (`#8faab2`), and white/gray. Zero neon purple/pink/green cliches.
4. **Non-Destructive Integration:** The rest of the site (work case studies, notes, profile, and footer) continues to render and function flawlessly.
5. **No Telemetry HUD:** As requested, the diagnostic HUD feature remains disabled.

