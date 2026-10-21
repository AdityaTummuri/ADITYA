# The Dreaming Machine — Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Aditya Tummuri's portfolio — a premium, cinematic single-home + case-study site in the 8bit.ai visual language, from `information.md` content and `DESIGN.md` tokens.

**Architecture:** Next.js 16 App Router (static export-friendly, deployed on Vercel). One fixed React-Three-Fiber canvas renders a single generative scene (light streaks + signal particles + glass mark) behind the page; its look is blended by a `chapterProgress` store that GSAP ScrollTrigger writes while native Lenis-smoothed scroll pins each home chapter and scrubs its sub-states. Content is typed TS data; inner pages are static.

**Tech Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 (`@theme` tokens) · GSAP 3.15 (ScrollTrigger, SplitText, ScrollToPlugin — all free since 3.13) + `@gsap/react` · Lenis (`lenis/react`) · three + `@react-three/fiber` 9 + `@react-three/drei` + `@react-three/postprocessing` · zustand · Embla carousel · Vitest + Playwright · npm.

**Spec:** `DESIGN.md` (tokens + voice), `docs/8bit-ai-teardown.md` (§3 chapter model, §5 motion numbers, §7 components, §10 recommendations), `information.md` (content). This plan file carries the experience "story" in §1 so the executor has the intent, not only the parts.

---

## Context

Aditya (ECE student, Amrita Amritapuri; embedded sensing, signal processing, edge ML, Linux tooling, 3D web) wants a new portfolio that feels like **8bit.ai** — a black, cinematic, light-streaked WebGL site with enormous weight-400 Helvetica lockups, one glacier-teal accent, white block CTAs, and a chapter-by-chapter reveal — but applied to *his* story ("The Dreaming Machine": machines that dream in signals & motion). On 2026-10-21 we reverse-engineered 8bit.ai into `DESIGN.md` + `docs/8bit-ai-teardown.md`; `information.md` is his authored content. The previous site (`my-showcase`, TanStack Start, navy canvas, lime/cyan/peach accents) is being replaced, not migrated.

Decisions already made by Aditya (do not re-open):
1. **Stack:** Next.js (current major, 16) + R3F + GSAP + Lenis + Tailwind v4, Vercel.
2. **Scroll model:** native scroll (Lenis) with **pinned chapters** scrubbed by ScrollTrigger — *not* 8bit's infinite wheel-jacked loop. Has an end, anchor/keyboard navigable.
3. **Scope:** one cinematic home + `/work/[slug]` case studies + `/notes/[slug]`.
4. **WebGL:** **one generative scene**, no GLB models, < 300 KB of 3D assets; bloom + LUT + grain + SMAA.

Calls made by the planner (Aditya can override): free font substitutes (Inter Tight display, Roboto Condensed body) via `next/font`; no audio; typographic wordmark (no logo yet); content as TS data (no CMS); Embla for card sliders; zustand for the frame-rate store; Vitest + Playwright for verification.

---

## 1. The story — what a visitor experiences

Read this before building anything. Every task below exists to produce one beat of this.

**0 · Arrival (0–1.5 s).** Black. A small typographic wordmark `aditya tummuri` sits centred with a thin rotating arc around it. When fonts + scene are ready the page is revealed through a **diagonal clip-path wipe** (1.3 s, `power2.inOut`) — the same curtain that will later play between routes. The wordmark slides into the top-left corner, the hamburger's two 28 × 2 px lines draw in top-right (stagger 0.1 s), the legal row fades in bottom-left, the scroll hint + socials bottom-right.

**1 · Hero — "I build machines / that dream in signals & motion."** Behind everything, diagonal streaks of light rush from bottom-left to top-right through film grain; a glass wireframe mark (the "signal" glyph — a sine wave fused into an **A**) rotates slowly at centre. Bottom-left, the lockup types in line by line through masks: overline **I build machines** in glacier teal (`display-lg`), title **that dream in / signals & motion.** in white (`display-xl`, 76 px). The right edge carries the progress rail. As the visitor scrolls (Lenis-smoothed, the section is pinned for 3 viewports), the big lockup collapses into the **compact lockup** pinned in the same corner, the **statement** rises in teal — *"An ECE student working where software runs into the physical world."* — then a paragraph settles into the right half: sensors and signals, models small enough for the edge, robots that perceive terrain, the Linux tools that hold it together. Finally five **focus-area cards** slide in on the right (Embedded sensing · Signal processing · Computer vision & ML · Developer experience · Interface craft), each with a thin hexagon icon frame, followed by the white CTA **Receive transmissions →**, which scrolls to chapter 2. The streaks slow and thin as the chapter ends.

**2 · Transmissions (§01) — the four featured works.** Lockup: overline **Selected**, title **Transmissions**. The streaks straighten into orthogonal light rails — a circuit-board feel — and the particle field tightens into a grid. Statement: *"Four pieces of work, labelled for what they are."* Cards (Embla slider, 4): **RotorMind / MotorSafe**, **NETRA-UGV**, **FracSST-Mamba**, **MY_TERMINAL**. Each card: status overline in teal (`Prototype`, `Collaborative`, `Research prototype`, `Tooling`), title, the project's *question* in `title-md` (e.g. "Can a motor tell you it's unwell before it fails?"), the outcome stat (e.g. "3× faster anomaly detection"), and **Read the transmission →** (to `/work/[slug]`). CTA: **Open the index →**.

**3 · Index (§02) — everything, labelled for what it is.** Lockup: overline **Labelled for**, title **what it is.** The scene calms (particles dim, streaks fade to a few). The section un-pins into a long **feature-list**: all 20 projects as rows grouped by category (Embedded & Robotics · AI/ML · Systems · Experiments · Hackathons & apps), each row = title · status overline · one-line summary · outcome · repo link; rows with a trade-off/footnote expand (accordion) to show "Architecture trade-off" and "Engineering footnote". Hairlines between rows, 24 px rhythm, no boxes.

**4 · Field notes (§03).** Lockup: overline **Field notes**, title **from the bench.** The scene becomes a particle cloud (the neutrino chapter's feel). The three notes appear as statement-sized teal titles with their quote beneath in `title-md`: *Features before models* · *Touching hardware carefully* · *Labelling work honestly*. Each links to `/notes/[slug]`.

**5 · Now (§04) — toolkit, numbers, person.** Lockup: overline **A systems mind,** title **with a sense of wonder.** Right column: a short bio paragraph (Amrita, Kerala; ECE; student · builder), then **stat tiles** (the only boxes on the home): `20` original projects · `41` repos · `7` hackathons & research entries · `39.7 %` Kotlin / `17.5 %` Python / `10.3 %` TypeScript as a "language distribution" row; then the toolkit as a hairline row of labels (Python · PyTorch · Linux · Shell · Android · TypeScript · React · Three.js).

**6 · Contact (§05) — "Send a signal back."** Lockup: overline **Send a**, title **signal back.** The camera flies into a light tunnel. Two huge text-link rows: `adityafrom2007@gmail.com` and `github.com/AdityaTummuri`, then the white CTA **Send a signal →** (mailto). Below, the **site footer** (wordmark + "The Dreaming Machine" tagline + socials; columns: Work / Notes / Elsewhere; legal row with © year).

**Inner pages.** `/work/[slug]`: calm, centred builder layout over the same faint scene — status overline + title (`display-xl`) + question (`title-md`), outcome stat tiles, "Summary", then "Architecture trade-off" and "Engineering footnote" as feature-list rows, tags, repo button, prev/next project. `/notes/[slug]`: editorial single column, the quote as statement, related projects. Routes change behind the diagonal wipe.

**Menu.** Hamburger → black panel slides in from the right (45 % width, full-width on mobile): Home (dimmed when current) · *Work*: Transmissions, Index · *Writing*: Notes · Now · Contact (`display-sm` 39 px, hairline-separated) · legal + socials.

**Everything respects `prefers-reduced-motion`:** no pins, no SplitText motion, a static scene frame; and works without WebGL (CSS gradient + grain fallback).

---

## 2. Global Constraints

(The spec's project-wide rules; every task inherits them.)

- Canvas is `#000000` on every page and state (`{colors.canvas}`); accent `#8faab2` (`{colors.primary}`) is used as **text** only — never as a button or background (exceptions: none on this site; the newsletter/banner gradient from 8bit is not used).
- Display type: weight **400**, sizes only from the 10 px × 1.25ⁿ ladder (76.29 / 61.04 / 48.83 / 39.06 / 31.25 / 25 px), tracking −0.04 em (xl, lg) / −0.03 em (md and below), line-height 1.0 (xl) / 1.2. Mobile (< 768 px): 39.06 / 39.06 / 39.06 / 31.25 / 25 / 20.
- Body/UI: Roboto Condensed 16 px / 1.5 / +0.32 px; `title-md` 20 px / 500 / 1.4 / +0.2 px; `body-sm` 12.8 px / +0.51 px. Buttons = body style, sentence case, never uppercase.
- `html { font-size: 10px }`; spacing tokens 8/16/24/32/40/56/80 px; page margin 20 → 40 → 60 → 100 px at base/md/lg/xl; gutter 10 → 30 px; header 61 px.
- Radius: 4 px inputs, 8 px buttons/tiles; nothing larger except circles. **No `box-shadow`, no backdrop blur**; hairlines are `rgba(255,255,255,.2)` / `.3`.
- Motion: hovers 0.3 s / slides 0.5 s with `cubic-bezier(.215,.61,.355,1)`; page/route wipe 1.3 s `power2.inOut`; heading reveals = SplitText `lines` with `mask: "lines"`, `yPercent: 100 → 0`.
- Versions (checked against the npm registry on 2026-10-21): `next@16.4.2` (**Next 16 is current — the option label said "15"; the App Router/`next/font`/async-`params` APIs used here are identical, Turbopack is the default dev/build bundler**), `react@19.3.1` + `react-dom@19.3.1` (inside R3F 9's `>=19 <19.4` peer range), `three@0.186.1`, `@react-three/fiber@9.8.2`, `@react-three/drei@10.7.9`, `@react-three/postprocessing@3.2.2`, `postprocessing@6.39.5`, `gsap@3.15.0`, `@gsap/react@2.1.2`, `lenis@1.3.27`, `tailwindcss@4.3.3` + `@tailwindcss/postcss@4.3.3`, `zustand@5.0.15`, `embla-carousel-react@8.6.0`, dev: `vitest@5.0.5`, `@playwright/test@1.64.1`, `@axe-core/playwright@4.14.0`, `@types/three`. Pin exact versions (`npm install --save-exact`).
- Package manager: **npm** (Node 24.22 is installed, pnpm is not; do not install global tooling). Scripts: `dev`, `build`, `start`, `lint`, `typecheck` (`tsc --noEmit`), `test` (vitest), `e2e` (playwright).
- Budgets: 3D assets < 300 KB; first-load JS for `/` < 450 KB gzipped (R3F chunk lazy); Lighthouse mobile perf ≥ 85, a11y ≥ 95, CLS < 0.05; 60 fps desktop / ≥ 40 fps mid-range phone with DPR capped at 1.5 (desktop) / 1 (mobile).
- Accessibility: exactly one `<h1>` per page; skip link; focus-visible rings (1 px `{colors.hairline-focus}`); keyboard chapter navigation (↑/↓, PageUp/PageDown, Home/End); `prefers-reduced-motion` honoured; all icon buttons labelled.
- No external requests at runtime (fonts self-hosted via `next/font`; no analytics in v1).
- Commit after every task with conventional messages; author `AdityaTummuri <adityafrom2007@gmail.com>`; no AI attribution trailers.

## 3. Review Focus

(Failure modes the spec implies but no happy-path test exercises — each has a pinned test in the owning task.)

1. **Fonts load after SplitText splits** → lines re-flow and masks clip words. Pin: `autoSplit: true` + animations created in `onSplit` (Task 5 test (a) checks headings have `.line` children *after* `document.fonts.ready`).
2. **Resize / orientation change while a chapter is pinned** → stale pin heights and overlapping sections. Pin: `ScrollTrigger.refresh()` on `resize` debounce and after fonts; Playwright test resizes 1440 → 390 mid-scroll and asserts no section overlaps the next (Task 7).
3. **WebGL unavailable or context lost** (old iGPU, battery saver, headless) → black page with no fallback. Pin: `WebGLFallback` renders when `WebGL2RenderingContext` is missing or `webglcontextlost` fires; test with `--disable-gpu`/`--use-gl=disabled` (Task 9).
4. **prefers-reduced-motion** → pins + scrubbed timelines must not run, yet all content must be visible. Pin: Playwright `emulateMedia({reducedMotion:'reduce'})` asserts every chapter's text has `opacity: 1` without scrolling and `document.body` has no pin spacers (Task 7; scene static frame in Task 10).
5. **Keyboard-only visitor** → scroll-jacked-feeling pins without focus order. Pin: Tab reaches skip link → hamburger → hero CTA in that order; ↓ arrow advances exactly one chapter label (Task 7).

---

## 4. File structure (what each file owns)

```
app/
  layout.tsx                 # html/body, next/font variables, <Providers>, chrome (Header, MenuPanel, FooterHud), <SceneCanvas/>, <RouteWipe/>, skip link
  page.tsx                   # Home: renders chapters from content/chapters.ts
  work/[slug]/page.tsx       # case study (generateStaticParams from projects with a `tradeoff`)
  notes/[slug]/page.tsx      # note page
  opengraph-image.tsx · sitemap.ts · robots.ts · not-found.tsx
  globals.css                # @import "tailwindcss"; @theme tokens (DESIGN.md); base + .line/.word mask rules
components/
  chrome/   Header.tsx, Wordmark.tsx, Hamburger.tsx, MenuPanel.tsx, FooterHud.tsx, SiteFooter.tsx, ProgressRail.tsx, ScrollHint.tsx, Loader.tsx, RouteWipe.tsx, SkipLink.tsx
  home/     Chapter.tsx (pin + scrub timeline), ChapterLockup.tsx, Statement.tsx, CardSlider.tsx, FocusCard.tsx, ProjectCard.tsx, ProjectRows.tsx, NoteBlock.tsx, NowTiles.tsx, ContactLinks.tsx
  ui/       ButtonPrimary.tsx, TextLinkArrow.tsx, HexFrame.tsx, SplitHeading.tsx, Overline.tsx, StatTile.tsx, AccordionRow.tsx, FeatureRow.tsx
  scene/    SceneCanvas.tsx (dynamic import + WebGLFallback), Scene.tsx, Streaks.tsx, SignalField.tsx, Mark.tsx, Effects.tsx, GradeEffect.ts, shaders/{streaks,field}.ts
  work/     CaseStudyHero.tsx, CaseStudyBody.tsx, PrevNext.tsx
content/    types.ts, profile.ts, projects.ts, notes.ts, chapters.ts, nav.ts
lib/        gsap.ts (registerPlugin once, exported eases), smooth-scroll.tsx (ReactLenis + ticker sync), scroll-store.ts (zustand), ui-store.ts (menuOpen, loaded), motion.ts (constants), seo.ts
tests/      unit/content.test.ts · e2e/{home,menu,motion,work}.spec.ts
public/     favicon.svg, og fallback — no 3D assets (everything procedural)
```

Conventions: `"use client"` only in `components/chrome/*`, `components/home/Chapter.tsx`, `components/ui/SplitHeading.tsx`, `components/ui/ButtonPrimary.tsx` (hover is CSS, but it reads `prefers-reduced-motion`), `components/scene/*`, `lib/smooth-scroll.tsx`. Pages and content stay server components. Every component maps to a `components:` name in `DESIGN.md` and documents it in a one-line header comment.

## 5. Content model (`content/types.ts`)

```ts
export type ProjectGroup = 'embedded-robotics' | 'ai-ml' | 'systems' | 'experiments' | 'products-analytics';
export type ProjectStatus = 'Prototype' | 'Collaborative' | 'Research prototype' | 'Tooling' | 'Concept' | 'Experiment' | 'Hackathon' | 'Released' | 'Open source' | 'Project';
export interface Project {
  slug: string; title: string; group: ProjectGroup; category: string; status: ProjectStatus;
  summary: string; tags: string[]; tech?: string[]; outcome?: string;
  tradeoff?: string; footnote?: string; question?: string; repo?: string;
  featured: boolean; order: number;
}
export interface Note { slug: string; index: '01'|'02'|'03'; title: string; quote: string; related: string[] /* project slugs */ }
export interface Profile { name; email; github; university; location; mode; studying; siteTitle; roleLine; headline: [string,string,string]; subheadline; focusAreas: {title; detail}[]; toolkit: string[]; languages: {name; share: number}[]; hackathons: {event; project; domain}[]; stats: {repos: 41; original: 20; forks: 21}; phrases: Record<string,string> }
export interface ChapterSpec { id: string; index: number; label: string /* §01 */; overline: string; title: string[] /* lines */; statement: string; paragraph?: string; cta?: {label: string; href: string}; look: 'streaks'|'grid'|'calm'|'cloud'|'tunnel'; pinViewports: number; body: 'focus-cards'|'project-cards'|'project-rows'|'notes'|'now'|'contact' }
```

Data rules (from `information.md`, verbatim copy): featured = `rotormind`, `netra-ugv`, `fracsst-mamba`, `my-terminal` (order 1–4). Groups: embedded-robotics = RotorMind, NETRA-UGV, ArmMimic; ai-ml = FracSST-Mamba, Vocal Biomarker Edge, LeaseLens, FIFA NexusMatrix; systems = Kavach-UPI, MY_TERMINAL, HP OMEN Fan Control, GhostOS-X, Multiboot Toolkit; experiments = TrapSight, 3d-website/Lumina, The-PaleSignal, SUDO_SHOOT, ASCII_CAM; products-analytics = Moneyball 2.0, RosterResilience, ScopeCreep.ai. `/work/[slug]` exists for every project with a `tradeoff` (projects 1–11); the rest link to their repo. Notes: `features-before-models`, `touching-hardware-carefully`, `labelling-work-honestly`.

## 6. Home chapter engine

- `content/chapters.ts` holds the six `ChapterSpec`s from §1 (`hero`, `transmissions`, `index`, `notes`, `now`, `contact`) with `pinViewports` 3 / 3 / 1 / 2 / 2 / 2.
- `Chapter.tsx` renders `<section id={id} data-chapter={index} class="relative h-[100svh]">` with four absolutely-positioned layers (lockup, statement+paragraph, body, CTA) and one `useGSAP` call that builds **one scrubbed timeline per chapter** inside `gsap.matchMedia()`:
  - `(min-width: 768px) and (prefers-reduced-motion: no-preference)`: `scrollTrigger: { trigger: section, start: 'top top', end: () => '+=' + pinViewports * innerHeight, pin: true, scrub: 0.6, anticipatePin: 1, onUpdate: st => scrollStore.set(index, st.progress) }`, labels `lockup 0 → handoff 0.25 → statement 0.4 → paragraph 0.6 → body 0.75 → out 1`. Lockup lines: `yPercent 0 → -110` out while compact lockup `yPercent 110 → 0` in; statement lines `yPercent 100 → 0`; paragraph `autoAlpha 0 → 1, y 24 → 0`; body cards `x 40 → 0, autoAlpha` with `stagger 0.08`; CTA `autoAlpha`.
  - `(max-width: 767px)` or `reduce`: no pin; the four layers render stacked in flow; headings still SplitText-reveal on enter (`ScrollTrigger` `once: true`), or appear static under `reduce`.
- `index` chapter: pin only its lockup for 1 viewport, then `ProjectRows` flows normally below.
- `lib/scroll-store.ts` (zustand, no React subscriptions in hot paths): `useScrollStore` = `{ chapter: number; progress: number; look: Look; set(chapter: number, progress: number, look: Look): void }` where `type Look = 'streaks'|'grid'|'calm'|'cloud'|'tunnel'` — written by ScrollTrigger `onUpdate` (and set to `calm` by inner pages on mount), read by `ProgressRail` (via `useScrollStore` with a selector, throttled to ~30 Hz) and by the scene in `useFrame` through `useScrollStore.getState()`. This is the only bridge between scroll and WebGL.
- Lenis: `lib/smooth-scroll.tsx` = `<ReactLenis root options={{ autoRaf: false, lerp: 0.1, smoothWheel: true }}>` + effect: `lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0)`; cleanup removes both. `ScrollTrigger.refresh()` after `document.fonts.ready` and on debounced resize (150 ms).
- Keyboard (`lib/use-chapter-keys.ts`): `↓/PageDown/→` → next label, `↑/PageUp/←` → previous, `Home/End` → first/last chapter, implemented with `gsap.to(window, { scrollTo: y, duration: 0.8, ease: 'power3.inOut' })` (ScrollToPlugin) where `y = st.start + fraction(label) * (st.end - st.start)`; ignored while `menuOpen` or when focus is in an input/button. Tab order stays the DOM order: skip link → wordmark → hamburger → hero CTA → … (chapter layers are never `aria-hidden` while pinned; the CTA of a chapter is reachable once its timeline passes `body`).
- Anchors: menu items link to `/#transmissions` etc.; on load with a hash, scroll via Lenis `scrollTo` after `ScrollTrigger.refresh()`.
- `ProgressRail`: 1 px `{colors.hairline-strong}` track, white fill height = `progress` of the current chapter; dots top/bottom; hidden on touch.

## 7. WebGL scene

- `SceneCanvas.tsx` (client): `dynamic(() => import('./Scene'), { ssr: false })` inside a `fixed inset-0 -z-10` div; before mounting, feature-detect `WebGL2RenderingContext` + `prefers-reduced-motion`; render `<WebGLFallback/>` (CSS: `#000` + two `repeating-linear-gradient(115deg …)` streak layers + inline-SVG `feTurbulence` grain, exactly as `design-showcase.html` `.scene`) when WebGL is missing; under `reduce` render the canvas with `frameloop="never"` after one `invalidate()` (static frame).
- `Canvas` props: `dpr={[1, 1.5]}` (mobile `[1, 1]`), `gl={{ antialias: false, powerPreference: 'high-performance', alpha: false }}`, `camera={{ fov: 45, position: [0, 0, 8] }}`, `frameloop` toggled to `'never'` on `visibilitychange` hidden; drei `<PerformanceMonitor onDecline={() => setDpr(1)}>`.
- Scene graph (all procedural, zero assets):
  - `Streaks`: `InstancedMesh` of 360 thin planes (`PlaneGeometry(0.02, 1)`), custom `ShaderMaterial` (additive, depthWrite off): per-instance attributes `aPhase, aSpeed, aLength, aOffset`; uniforms `uTime, uAngle (45° streaks → 0°/90° rails), uDensity, uRadial (tunnel)`; vertex shader moves instances along the angle and wraps; fragment = soft-edged line with head glow.
  - `SignalField`: `Points` of 12 000 vertices, `ShaderMaterial` with `uSpread`, `uGridSnap`, `uNoiseAmp`, simplex noise displacement (inline GLSL), size attenuation, additive.
  - `Mark`: the "signal-A" glyph — a `TubeGeometry` along a sine-wave `CatmullRomCurve3` fused with two straight strokes forming an A, `MeshBasicMaterial({ wireframe: false, color: '#dfe9ec' })` with slight emissive so Bloom lifts it; slow rotation, scale eased per look.
  - Looks (blended, never swapped): `uniforms` lerped in `useFrame` toward targets per `scene look` of the active chapter (`streaks`: angle 45°, density 1, spread 1.2, mark 1; `grid`: angle 0/90 alternating, density .7, gridSnap 1, mark .4; `calm`: density .25, spread .6, mark 0; `cloud`: density .1, spread 2, noiseAmp 1.4, mark 0; `tunnel`: radial 1, density 1.2, camera z 8 → 3). Progress inside a chapter nudges `uTime` speed and camera drift.
- `Effects.tsx`: `<Suspense><EffectComposer multisampling={0}><Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.55} luminanceSmoothing={0.15} radius={0.7} /><GradeEffect/><Noise premultiply opacity={0.14} blendFunction={BlendFunction.SCREEN}/><SMAA/></EffectComposer></Suspense>`. `GradeEffect.ts` is a 20-line custom `postprocessing.Effect` (wrapped with `wrapEffect`) that lifts shadows toward `#0b1216`, adds slight cyan to highlights and desaturates 10 % — the 3D-LUT look without shipping a `.cube` (planner's call; a real LUT can replace it later via `<LUT lut={texture}/>`).
- Inner pages reuse the same canvas with look `calm` so route changes never re-create the WebGL context.

---

## 8. Tasks (ordered; each ends deployable and verified)

### Task 1: Scaffold, tokens, fonts, test harness

**Files:** Create `package.json`, `next.config.ts`, `postcss.config.mjs`, `tsconfig.json`, `app/layout.tsx`, `app/page.tsx` (placeholder h1), `app/globals.css`, `lib/motion.ts`, `vitest.config.ts`, `playwright.config.ts`, `tests/e2e/smoke.spec.ts`, `.gitignore`, `README.md` (replace the one-line stub).
**Produces:** Tailwind `@theme` tokens; CSS vars `--font-display`, `--font-body`; `lib/motion.ts` exports `EASE_OUT = 'cubic-bezier(.215,.61,.355,1)'`, `EASE_IN_OUT = 'cubic-bezier(.645,.045,.355,1)'`, `DUR = { hover: .3, slide: .5, wipe: 1.3 }`.

- [ ] Step 1: `npx create-next-app@latest . --ts --app --tailwind --eslint --no-src-dir --import-alias "@/*" --use-npm --turbopack` (the repo already has `README.md`, `LICENSE`, `information.md`, `DESIGN.md`, `design-showcase.html`, `docs/` — keep them; if the scaffolder refuses a non-empty directory, scaffold into a temp dir and move the files in). Then `npm install --save-exact gsap@3.15.0 @gsap/react@2.1.2 lenis@1.3.27 three@0.186.1 @react-three/fiber@9.8.2 @react-three/drei@10.7.9 @react-three/postprocessing@3.2.2 postprocessing@6.39.5 zustand@5.0.15 embla-carousel-react@8.6.0` and `npm install --save-exact -D @types/three vitest@5.0.5 @vitejs/plugin-react jsdom @playwright/test@1.64.1 @axe-core/playwright@4.14.0`, then `npx playwright install chromium`.
- [ ] Step 2: `app/globals.css` — `@import "tailwindcss";` then `@theme { --color-canvas:#000; --color-primary:#8faab2; --color-primary-soft:#cfe0e5; --color-ink:#fff; --color-ink-muted:#b2b2b2; --color-ink-subtle:rgb(255 255 255/.5); --color-ink-tertiary:rgb(255 255 255/.2); --color-inverse-ink:#1a1a1a; --color-surface-3:#292929; --color-edge-from:#545454; --color-edge-to:#303030; --color-hairline:rgb(255 255 255/.2); --color-hairline-strong:rgb(255 255 255/.3); --color-hairline-focus:rgb(255 255 255/.8); --color-error:#ef4444; --font-display:var(--font-inter-tight); --font-body:var(--font-roboto-condensed); --text-display-xl:7.629rem; --text-display-xl--line-height:1; --text-display-xl--letter-spacing:-.04em; --text-display-lg:6.104rem; --text-display-lg--line-height:1.2; --text-display-lg--letter-spacing:-.05em; --text-display-md:4.883rem; --text-display-md--line-height:1.2; --text-display-md--letter-spacing:-.03em; --text-display-sm:3.906rem; …; --text-headline:3.125rem; --text-title-lg:2.5rem; --text-title-md:2rem; --text-title-md--line-height:1.4; --text-title-md--letter-spacing:.02rem; --text-body:1.6rem; --text-body--line-height:1.5; --text-body--letter-spacing:.032rem; --text-body-sm:1.28rem; --text-caption:1.024rem; --spacing-xxs:.8rem; --spacing-xs:1.6rem; --spacing-sm:2.4rem; --spacing-md:3.2rem; --spacing-lg:4rem; --spacing-xl:5.6rem; --spacing-2xl:8rem; --radius-xs:.4rem; --radius-md:.8rem; --ease-out-cubic:cubic-bezier(.215,.61,.355,1); --ease-in-out-cubic:cubic-bezier(.645,.045,.355,1); --breakpoint-2xl:112.5rem; }`, plus base: `html{font-size:10px} body{background:var(--color-canvas);color:var(--color-ink);font-family:var(--font-body);font-size:1.6rem;letter-spacing:.032rem;-webkit-font-smoothing:antialiased}`, `:root{--margin:2rem;--gutter:1rem;--header-height:6.1rem}` with `@media(min-width:768px){--margin:4rem;--gutter:3rem}` / `1024px → 6rem` / `1280px → 10rem`, `.container{padding-inline:var(--margin)}`, `.line{overflow:hidden;padding-block:.1em;margin-top:-.1em}`, `.word{white-space:nowrap}`, `:focus-visible{outline:1px solid var(--color-hairline-focus);outline-offset:4px}`, and `@media (prefers-reduced-motion: reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}`.
- [ ] Step 3: `app/layout.tsx` — `Inter_Tight({ subsets:['latin'], weight:['400'], variable:'--font-inter-tight', display:'swap' })` and `Roboto_Condensed({ subsets:['latin'], weight:['300','400','500'], variable:'--font-roboto-condensed', display:'swap' })` from `next/font/google`; `<html lang="en" className={`${interTight.variable} ${robotoCondensed.variable}`}>`; metadata `title: 'Aditya Tummuri — The Dreaming Machine'`, `description` = `profile.subheadline`; `<body>` contains `<a href="#main" class="sr-only focus:not-sr-only …">Skip to content</a>` and `<main id="main">{children}</main>`.
- [ ] Step 4: `tests/e2e/smoke.spec.ts` — `test('home has one h1 and black canvas')`: `expect(await page.locator('h1').count()).toBe(1)`; `expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe('rgb(0, 0, 0)')`; `expect(await page.evaluate(() => getComputedStyle(document.documentElement).fontSize)).toBe('10px')`. `playwright.config.ts` runs `npm run build && npm run start` on port 3000 with projects `desktop` (1440×900) and `mobile` (Pixel 7 ≈ 412×915).
- [ ] Step 5: Run `npm run lint && npm run build && npx playwright test tests/e2e/smoke.spec.ts` → all PASS. Commit `chore: scaffold next16 + tailwind v4 tokens + test harness`.

### Task 2: Content model and data

**Files:** Create `content/types.ts` (§5), `content/profile.ts`, `content/projects.ts`, `content/notes.ts`, `content/chapters.ts`, `content/nav.ts`, `tests/unit/content.test.ts`.
**Produces:** `projects: Project[]` (20, `order` 1–20 in `information.md` order), `featuredProjects` (4), `projectsByGroup: Record<ProjectGroup, Project[]>`, `getProject(slug)`, `caseStudyProjects` (those with `tradeoff`), `notes: Note[]`, `profile: Profile`, `chapters: ChapterSpec[]`, `nav` (menu + footer link groups).

- [ ] Step 1: Write `tests/unit/content.test.ts`: slugs unique; `featuredProjects.map(p=>p.slug)` equals `['rotormind','netra-ugv','fracsst-mamba','my-terminal']`; every project has `group` and `status` from the unions; `caseStudyProjects.length === 11`; `notes.length === 3` and each `related` slug exists; `profile.headline` equals `['I build machines','that dream in','signals & motion.']`; `chapters.map(c=>c.id)` equals `['hero','transmissions','index','notes','now','contact']` and `chapters[0].pinViewports === 3`.
- [ ] Step 2: Run `npx vitest run tests/unit/content.test.ts` → FAIL (modules missing).
- [ ] Step 3: Implement the data files by transcribing `information.md` verbatim (summary, outcome, tradeoff, footnote, question, repo, tech, status; hackathon table; identity phrases into `profile.phrases`). `chapters.ts` copy exactly as §1 of this plan.
- [ ] Step 4: Run the unit tests → PASS. Commit `feat(content): typed content model from information.md`.

### Task 3: Chrome — wordmark, hamburger, menu panel, footers

**Files:** Create `lib/ui-store.ts` (`{ menuOpen, setMenuOpen, loaded, setLoaded }`), `components/chrome/{Wordmark,Header,Hamburger,MenuPanel,FooterHud,SiteFooter,SkipLink}.tsx`, `tests/e2e/menu.spec.ts`; modify `app/layout.tsx` to mount `Header` + `MenuPanel` (every page); `app/page.tsx` mounts `FooterHud`; inner pages (Task 11) mount `SiteFooter`.
**Spec:** `DESIGN.md` → `top-nav`, `hamburger`, `menu-panel`, `menu-link*`, `footer-hud`, `footer`, `footer-column-title`.

- [ ] Step 1: `tests/e2e/menu.spec.ts` — opens with click on `button[aria-label="Menu"]`; panel `[role=dialog][aria-label="Site menu"]` visible, `aria-expanded` true, body `data-scroll-locked="true"`; `Escape` closes and returns focus to the button; Tab cycles inside the panel while open; menu links have `font-size` `39.06px` at 1440 (`display-sm`) and the current page link has `opacity` `0.2`.
- [ ] Step 2: Run → FAIL. Step 3: Implement. Hamburger: 44×44 fixed `right-[var(--margin)] top-[2.4rem] md:top-[4rem]`, two spans 28×2 px `origin-right` crossing to ✕ (CSS transitions `0.3s var(--ease-out-cubic)`, second line `delay-75`). MenuPanel: fixed right, `w-full md:w-[45vw]`, `bg-canvas`, items from `content/nav.ts`, `<li>` `translate-x` stagger `transition-delay: calc(300ms + var(--i) * 60ms)`, hairline rules, legal + socials; locks Lenis (`lenis.stop()` / `start()`) and traps focus. FooterHud (home only): fixed bottom row per §1 with copyright `opacity-50`, legal links, ScrollHint slot, socials. SiteFooter: per §1 "Contact".
- [ ] Step 4: Run → PASS; `npm run build`. Commit `feat(chrome): header, hamburger menu panel, footers`.

### Task 4: UI primitives

**Files:** Create `components/ui/{ButtonPrimary,TextLinkArrow,HexFrame,Overline,StatTile,AccordionRow,FeatureRow}.tsx`. No dedicated test page — the primitives are exercised by the Task 6 and Task 8 e2e tests where they appear.
**Produces:** `ButtonPrimary({ href, children, variant?: 'primary'|'ghost'|'wide' })` (white block, 24×32 padding, radius 8, masked label + 40×8 arrow slide on hover, 0.5 s ease-out-cubic; `prefers-reduced-motion` → opacity only), `TextLinkArrow`, `HexFrame({ children })` (182×200 polygon, 1 px stroke), `Overline` (teal, `title-lg` or `body-sm`), `StatTile({ value, label })` (surface-3, 1 px `edge-from→edge-to` gradient wrapper, radius 8, padding 24), `AccordionRow({ title, children, defaultOpen })` (button in `h3`, `aria-expanded`, hairline, +/−), `FeatureRow`.

- [ ] Step 1: Implement components exactly per `DESIGN.md` `components:` values (no shadows, no radius > 8 px, sentence case). Step 2: Type-check `npm run typecheck`; visual check in Task 6. Commit `feat(ui): 8bit primitives (button, hex frame, tiles, rows)`.

### Task 5: Motion runtime — GSAP, Lenis, SplitHeading, Loader, RouteWipe

**Files:** Create `lib/gsap.ts`, `lib/smooth-scroll.tsx`, `lib/scroll-store.ts`, `components/ui/SplitHeading.tsx`, `components/chrome/{Loader,RouteWipe}.tsx`, `app/providers.tsx`; modify `app/layout.tsx`; `tests/e2e/motion.spec.ts`.
**Produces:** `lib/scroll-store.ts` → `useScrollStore` exactly as §6; `lib/gsap.ts` → `gsap` with `ScrollTrigger, SplitText, ScrollToPlugin, useGSAP` registered once (`import { SplitText } from 'gsap/SplitText'`, `import { ScrollToPlugin } from 'gsap/ScrollToPlugin'`); `SplitHeading({ as, className, lines: string[] | string, delay? })` → renders the heading, `SplitText.create(el, { type: 'lines', mask: 'lines', autoSplit: true, onSplit: self => gsap.from(self.lines, { yPercent: 100, duration: 1, ease: 'power3.out', stagger: 0.08, delay }) })` inside `useGSAP`, static under `reduce`; `RouteWipe` = fixed SVG `clipPath#route-wipe` (objectBoundingBox) morphed with the exact 8bit keyframes (`M0 0 L1 0 L1 1 L0 1z` ↔ `M0 0 L1 0 L1 0 L0 1z` ↔ `M0 0 L1 0 L1 0 L0 0z`, 1.3 s, `power2.inOut`) on `usePathname()` change; `Loader` = canvas-black overlay with wordmark + rotating arc, removed when `document.fonts.ready` **and** `uiStore.loaded` (set by the scene or after 2.5 s timeout), then plays the wipe + header timeline (logo `yPercent 110→0` 1 s, hamburger lines `scaleX 0→1, x 15→0` 1 s stagger .1 at +0.3 s).

- [ ] Step 1: `tests/e2e/motion.spec.ts`: (a) after load, `h1 .line` count ≥ 2 and the heading is visible; (b) with `emulateMedia({ reducedMotion: 'reduce' })` the loader is gone within 3 s and `h1` has `opacity 1` with **no** `.line` wrappers; (c) navigating `/` → `/work/rotormind` shows `#route-wipe` path `d` change (assert `data-wipe="running"` toggles) — (c) activates in Task 11.
- [ ] Step 2: FAIL → implement → PASS. Commit `feat(motion): gsap+lenis runtime, split headings, loader and route wipe`.

### Task 6: Home — static chapters with real content (deployable skeleton)

**Files:** Create `components/home/{ChapterLockup,Statement,FocusCard,ProjectCard,CardSlider,ProjectRows,NoteBlock,NowTiles,ContactLinks}.tsx`, `components/home/Chapter.tsx` (layout only, no pin yet); modify `app/page.tsx` to map `chapters` → `<Chapter spec body=…/>`; `tests/e2e/home.spec.ts`.
**Spec:** §1 beats; `DESIGN.md` `chapter-lockup`, `statement`, `feature-card`, `feature-list-row`, `stat-tile`, `cta-band`.

- [ ] Step 1: `tests/e2e/home.spec.ts`: exactly one `h1` whose text is `that dream in signals & motion.`; overline `I build machines` has color `rgb(143, 170, 178)` and font-size `61.04px` at 1440 / `39.06px` at 412; each of the six `section[data-chapter]` exists with ids `hero…contact`; Transmissions shows 4 `article` cards whose links point to `/work/rotormind` etc.; Index lists 20 rows grouped under 5 `h3` group headings; `axe` (`@axe-core/playwright`) reports 0 serious/critical violations.
- [ ] Step 2: FAIL → implement (lockup bottom-left: `container mt-auto mb-[11.1rem] lg:mb-[13.6rem]`; paragraph/cards in `lg:col-start-6 lg:col-span-7` of a 12-col grid; CardSlider = Embla with `align: 'start', containScroll: 'trimSnaps'`, prev/next icon buttons `disabled:opacity-20`, 5 px dots) → PASS. `npm run build` size check: `/` first-load JS < 250 KB before the scene.
- [ ] Step 3: Commit `feat(home): six chapters with content, no pinning yet`. (This commit is a shippable, readable site.)

### Task 7: Chapter pin + scrub engine, progress rail, keyboard navigation

**Files:** Modify `components/home/Chapter.tsx`; create `components/chrome/{ProgressRail,ScrollHint}.tsx`, `lib/use-chapter-keys.ts`; extend `tests/e2e/motion.spec.ts`.
**Consumes:** `lib/scroll-store.ts`, `SplitHeading`, `lib/gsap.ts`.

- [ ] Step 1: Tests: at 1440, after `page.mouse.wheel(0, 1.2 * innerHeight)` the hero section is still at `top: 0` (pinned) and `[data-chapter="0"] [data-layer="statement"]` has `opacity > 0.9`; `ProgressRail` fill height grows between two wheel steps; pressing `ArrowDown` from top scrolls to a `scrollY` within ±8 px of the computed `handoff` label position; loading `/#transmissions` lands with `section#transmissions` at `top ≤ 1px`; at 412 (mobile project) `document.querySelector('.pin-spacer')` is `null` and all six sections are in normal flow; **Review-Focus #2**: `setViewportSize(1440→390)` mid-pin, `ScrollTrigger.refresh()`, assert no two `section[data-chapter]` bounding boxes overlap; **#4** under `reduce`: no `.pin-spacer`, every `[data-layer]` has `opacity: 1`; **#5**: pressing `Tab` three times from page load focuses, in order, the skip link, the wordmark link, the hamburger button.
- [ ] Step 2: FAIL → implement per §6 (timeline labels, `gsap.matchMedia` conditions, `onUpdate` → store incl. `look`, `refresh` on fonts/resize, hash scroll after refresh, keys hook mounted in `app/page.tsx`) → PASS. Commit `feat(home): pinned scrubbed chapters, progress rail, keyboard nav`.

### Task 8: Chapter bodies' transitions and the Index accordion

**Files:** Modify `ProjectCard`, `CardSlider`, `ProjectRows` (AccordionRow per project with `tradeoff`/`footnote`), `NoteBlock`, `NowTiles`, `ContactLinks`; extend `tests/e2e/home.spec.ts`.
- [ ] Step 1: Tests: clicking the RotorMind row toggles `aria-expanded` and reveals text containing `running baseline correction`; the slider `next` button advances `aria-current` dot; `ContactLinks` mailto `href` equals `mailto:adityafrom2007@gmail.com`; NowTiles shows values `20`, `41`, `7`, `39.7%`.
- [ ] Step 2: FAIL → implement (cards `x 40→0 + autoAlpha` staggered inside the chapter timeline's `body` label; rows reveal `once`) → PASS. Commit `feat(home): transmissions slider, index accordion, notes, now, contact`.

### Task 9: WebGL scene — canvas, fallback, streaks, field, mark

**Files:** Create `components/scene/{SceneCanvas,Scene,Streaks,SignalField,Mark,WebGLFallback}.tsx`, `components/scene/shaders/{streaks,field}.ts`; modify `app/layout.tsx` (mount `<SceneCanvas/>` fixed behind `main`); `tests/e2e/scene.spec.ts`. **Consumes:** `useScrollStore` (`chapter`, `progress`, `look`) from Task 5/7 — the scene never subscribes with hooks, it reads `getState()` in `useFrame`.
- [ ] Step 1: Tests: desktop project → `canvas` exists, `getContext('webgl2')` is non-null, drawing-buffer width ≤ `innerWidth * 1.5`; with `launchOptions.args: ['--disable-gpu','--use-gl=disabled']` project → `[data-webgl-fallback]` is visible and no `canvas` (**Review-Focus #3**); after `page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')))` with `document.hidden` stubbed true, `useFrame` counter stops incrementing (expose `window.__sceneFrames` only when `process.env.NEXT_PUBLIC_E2E === '1'`).
- [ ] Step 2: FAIL → implement per §7 (looks blended in `useFrame` reading `useScrollStore.getState()`; `uiStore.setLoaded(true)` after first frame) → PASS. Check bundle: scene chunk < 220 KB gzipped (`npm run build` output). Commit `feat(scene): generative streak/field/mark scene with fallback`.

### Task 10: Post-processing, grading, performance, reduced motion

**Files:** Create `components/scene/{Effects,GradeEffect}.ts(x)`; modify `SceneCanvas` (DPR policy, `PerformanceMonitor`, `reduce` → static frame).
- [ ] Step 1: Tests: under `reduce`, `window.__sceneFrames` stays ≤ 2 after 2 s while the canvas is still visible (static frame); default: ≥ 100 frames in 2 s at 1440 in headless (sanity, not a perf claim). Manual: run `npx lighthouse http://localhost:3000 --preset=desktop` and mobile; record scores in `README.md` (targets §2).
- [ ] Step 2: Implement `Effects` chain exactly as §7; `GradeEffect` fragment: `color = mix(color, color*vec3(.86,.97,1.0) + vec3(.025,.045,.055), .65); color = mix(vec3(dot(color, vec3(.299,.587,.114))), color, .9);`. → PASS. Commit `feat(scene): bloom + grade + grain + smaa, dpr policy`.

### Task 11: Case-study and note pages

**Files:** Create `app/work/[slug]/page.tsx`, `app/notes/[slug]/page.tsx`, `components/work/{CaseStudyHero,CaseStudyBody,PrevNext}.tsx`; `tests/e2e/work.spec.ts`.
- [ ] Step 1: Tests: `/work/rotormind` has one `h1` = `RotorMind / MotorSafe`, an overline `Prototype`, a `StatTile` with `3× faster anomaly detection vs. threshold-only baseline`, rows titled `Architecture trade-off` and `Engineering footnote`, a repo button when `repo` exists (RotorMind has none → no button), prev/next links to `my-terminal`/`netra-ugv`; `/work/unknown` → 404; `/notes/features-before-models` renders the quote; `generateStaticParams` yields 11 work + 3 notes (assert via `npm run build` output listing).
- [ ] Step 2: FAIL → implement (calm look; `SiteFooter`; `metadata` per page with `openGraph` title/description) → PASS. Commit `feat(pages): case studies and notes`.

### Task 12: SEO, OG image, sitemap, 404, polish

**Files:** Create `app/opengraph-image.tsx` (static at build: black, teal overline "The Dreaming Machine", white title `Aditya Tummuri`, `body-sm` role line; `ImageResponse` with Inter Tight 400 TTF fetched from Google Fonts at build time — planner's call; if the fetch fails, fall back to the default font rather than failing the build), `app/sitemap.ts`, `app/robots.ts`, `app/not-found.tsx`; final `README.md` (run/build/test, token source, content editing guide).
- [ ] Step 1: Tests: `/sitemap.xml` lists `/`, 11 `/work/*`, 3 `/notes/*`; `/opengraph-image` returns `image/png` 1200×630; `/nope` renders the 404 lockup (overline `Signal lost`, title `Nothing on this frequency.`) with a `ButtonPrimary` back home.
- [ ] Step 2: Implement → PASS. Run the full suite: `npm run lint && npm run typecheck && npx vitest run && npx playwright test` → all green; Lighthouse ≥ targets. Commit `feat: seo, og image, sitemap, 404`.

### Task 13: Visual QA pass against the reference

- [ ] Step 1: Capture Playwright screenshots of `/` at the six chapter label positions (1440×900) and at 412×915, plus `/work/rotormind`; compare side-by-side with `docs/reference/8bit-ai/*.jpg` for: lockup position (bottom-left, 111/136 px up), overline/title pairing, hairline weights, CTA shape, grain visibility.
- [ ] Step 2: Fix deviations against `DESIGN.md` Do/Don't (no shadows, no radius > 8, accent as text only, weight 400). Re-run suite. Commit `style: visual parity pass against 8bit reference`.

## 9. Verification (end-to-end)

1. `npm run build` succeeds with zero type/lint errors; route list shows `/`, 11 `/work/*`, 3 `/notes/*`, `/opengraph-image`, `/sitemap.xml`.
2. `npx playwright test` (desktop + mobile projects) all green, including reduced-motion and no-WebGL projects.
3. Lighthouse (mobile): Performance ≥ 85, Accessibility ≥ 95, CLS < 0.05; desktop Performance ≥ 90.
4. Manual: open `npm run start` at 1440 — loader → wipe → hero reveal; scroll through all six chapters with the mouse wheel, then with ↓/↑ keys; open/close the menu with mouse and keyboard; toggle OS reduced-motion and reload (static, fully readable); DevTools → Rendering → emulate `prefers-reduced-motion` and `WebGL disabled`; check CPU ≤ ~40 % on a 4-core laptop while idle on a chapter.
5. Visual parity against `docs/reference/8bit-ai/` (Task 13 screenshots).

## 10. Out of scope (v1)

Audio, a custom logo mark (typographic wordmark for now), CMS, blog/MDX notes beyond the three quotes, analytics, contact form (mailto only), light mode, per-chapter GLB models, real project imagery.
