# 8bit.ai — full teardown (reference for the portfolio build)

Captured 2026-10-21 from `https://www.8bit.ai/` (Vercel edge cache, HTML last modified 2026-03-04).
Companion files: [`DESIGN.md`](../DESIGN.md) (tokens + voice, agent-readable), [`design-showcase.html`](../design-showcase.html) (visual render of the tokens), and the frames in [`docs/reference/8bit-ai/`](reference/8bit-ai/).

Every statement below is tagged **[observed]** (seen in a capture, bundle, stylesheet or REA evidence) or **[inferred]** (a reading of the evidence). Nothing here is from memory of the site.

---

## 0. How this was captured

| Source | What it gave | Reference |
|---|---|---|
| REA `list_browser_targets` → `inspect_web_page` (passive CDP, 1.5 s window, accessibility + console text) | DOM (1 454 nodes), full accessibility tree, resource inventory (5 fonts, 13 images, 13 scripts, 1 stylesheet), console warnings, storage (empty) | `ev_5a0477ade4f53f2fb6da0e968e5ea30d490d03d0b494739aff6023bcf49634c9`, trimmed copy in `reference/8bit-ai/rea-inspect-web-page-summary.json` |
| REA `capture_web_screenshot` | Hero frame at 1440×700 | `ev_92075b52f57cf592de1a4c7fa3b976831addbef752271e8d8dd02aa9a0c72477`, PNG sha256 `6db0e757…9a4` |
| REA `analyze_web_bundle` | **Failed** — the REA MCP server dropped the connection mid-call and did not reconnect this session. Bundle analysis was redone by downloading the chunks and reading them statically. | — |
| Static download | `index.html` (73 KB), the single CSS file (61 KB), `_app` (1.59 MB), `index`, `[...routes]`, framework/main, chunks 268/333/504/610/906, both Helvetica WOFFs, `__NEXT_DATA__` of `/`, `/neutrino/`, `/accelerated-cloud/`, `/contacts/`, `/blog/` | scratchpad only |
| Raw-CDP survey script (Node, no deps) against the same headless Chromium | Intro frames at 0.3/1.2/2.5/4.5/7 s, 34 wheel-driven steps, open menu, computed styles of every heading/button/link, inner pages at 1440×900, a partial mobile pass at 390×844 (loader + hero scene + computed styles; chapter walk could not be driven below `md`, see §8.1) | `reference/8bit-ai/*.jpg` |

Why wheel events: the homepage sets `body.home { overflow:hidden; touch-action:none }`, so `window.scrollTo` does nothing — navigation only responds to wheel/touch deltas **[observed]**.

---

## 1. At a glance

| Layer | What 8bit.ai uses | Evidence |
|---|---|---|
| Framework | Next.js **14.2.16**, Pages Router (`pages/_app`, `pages/index`, `pages/[...routes]`), React **18.2.0**, deployed on Vercel | `x-powered-by`, `server: Vercel`, version strings in `main`/`framework` chunks **[observed]** |
| CMS | Headless WordPress: `wp-json/wp/v2`, custom `wp-json/gusto/{routes,options,nav/menu-locations}`, ACF flexible content (`acf_fc_layout`), Yoast SEO head, Gravity Forms (`gf/v2/forms`) | `__NEXT_DATA__`, strings in `_app` **[observed]** |
| Styling | Tailwind **3.4.14** with a custom theme (semantic colour names, `spacing-*`, `text-d-h*`/`text-s-h*`), `html { font-size: 10px }` so `1rem = 10px` | CSS header comment, `:root` rules **[observed]** |
| Fonts | **Helvetica Neue** (self-hosted WOFF, weights 300/400/500/700; the 400 file is "HelveticaNeueCyr Roman", the 300 file "Helvetica Neue Light") for display; **Roboto Condensed** 400/500 via `next/font` (Google) for everything else | `@font-face` + WOFF `name` tables **[observed]** |
| Motion | GSAP 3 (+ **SplitText**, ScrollTrigger; ScrollSmoother code is bundled but no smoother wrapper was found in the DOM), **Lenis** (`html.lenis`), CSS transitions with two custom cubic-beziers | bundle strings, console warning "SplitText called before fonts loaded", DOM classes **[observed]** |
| 3D | **three.js** (r16x-era API: `KTX2Loader`, `DRACOLoader`, `GLTFLoader`, `PMREMGenerator`, `CubeCamera`, `InstancedMesh`, `Points`, `MeshPhysicalMaterial`, 43 `ShaderMaterial` + 11 `RawShaderMaterial` references) and **pmndrs `postprocessing`** (`EffectPass` with `BloomEffect`, `LUT3DEffect`, `NoiseEffect`, `SMAAEffect`, `ToneMappingEffect`) | console "THREE.WebGLRenderer: KHR_parallel_shader_compile…", class names in `_app`/chunk 906 **[observed]** |
| Carousels | **Swiper** (home cards: `swiper-slide`, `swiper-pagination-bullet`) and **Embla** (inner pages: `.embla` CSS + chunk in `[...routes]`) | DOM + CSS **[observed]** |
| State | A small global store created with a `create(devtools(subscribeWithSelector(…)))`-shaped factory: `{ menuOpen, scrollLocked, swiperActive, newsletterOpen, scrollDirLocked, needsAudioTrigger }` and an audio store `{ muted:true, played:false, progress:false, detune:0 }` | `_app` module 217 **[observed]**; zustand **[inferred]** |
| Transitions | `react-transition-group` `SwitchTransition` (`out-in` / `in-out` modes) around route changes | `_app` **[observed]** |
| Audio | `THREE.AudioListener` + `AudioLoader`; `/sounds/music.mp3` (2.08 MB, looped "ambient") and `/sounds/fx.mp3` (61 KB); starts **muted**; first `pointermove` on non-touch devices sets `needsAudioTrigger` which mounts a prompt component; fades out over 0.8 s | `_app` **[observed]** |
| Analytics / 3rd party | None observed in the 1.5 s REA window: no third-party scripts, storage empty, no cookies set (hence the footer line "This site uses technical cookies only") | REA resources + storage **[observed]** |
| Weight | JS ≈ 1.86 MB core + 0.54 MB lazy chunks; GLB models 2.34 MB (chip.glb alone 1.67 MB); textures ≈ 1.6 MB (KTX2 1.29 MB); music 2.08 MB; CSS 61 KB; fonts ≈ 5 × 20 KB | HEAD requests **[observed]** |

---

## 2. Information architecture

### Routes (HTTP status on 2026-10-21)
| Path | Status | Template |
|---|---|---|
| `/` | 200 | `template/homepage.php` → the WebGL chapter experience |
| `/neutrino/`, `/accelerated-cloud/`, `/accelerated-cloud-platform/`, `/contacts/`, `/blog/`, `/careers/`, `/privacy-policy/`, `/cookie-policy/`, `/terms-and-conditions/` | 200 | `[...routes]` — ACF flexible-content builder pages |
| `/about-us/`, `/ai-as-a-service/`, `/white-glove-services/`, `/case-studies/`, `/basis/` | **500** | linked from menus/bundle but currently broken |
| `/data-studio/` | linked in the hamburger menu (not probed) | |

### Menus (from `wp-json/gusto/nav/menu-locations`, inlined in `_app`)
- **main_menu_01** (hamburger, "Services"): Accelerated Cloud → `/accelerated-cloud`, Neutrino™ → `/neutrino`, White Glove Services, AI as a service. The live menu actually renders: Home · *Services*: Neutrino™ / Accelerated Cloud Platform / Data Studio · Newsletter (`/#newsletter`) · Contacts **[observed, menu-open frame]**.
- **main_menu_02**: Case Studies, About Us. **main_menu_03**: Newsletter (`#newsletter`), Contacts.
- **legals_menu**: Cookie Policy, Privacy Policy, Terms & Conditions.
- **social_menu**: LinkedIn, X (`x.com/8bitai_Inc`), Instagram, YouTube — rendered as 16 px `<use href="#linkedin-icon">` sprites.
- Footer columns on inner pages: *GPU Usecases* (Inference, AI Development, Model Training, Fine Tuning, Private Cloud), *AI Solutions* (BFSI, Education, Govt. & Public Sector, Manufacturing & Industrial, Retail), *Resources* (Research, Blog, Videos, Book a demo) **[observed, frame 23]**.
- UI strings module: `brand "8Bit.ai"`, `scroll "Scroll Down To Continue"`, `discover "Discover More"`, `copyright "[YEAR] © Copyright 8bit.ai Inc. All Rights Reserved"`, newsletter title "Join Our Newsletter" (description still lorem ipsum), footer description "Accelerating Enterprise Superintelligence". Validation strings exist in English **and Italian** (incl. `codice_fiscale`) → the agency/boilerplate is Italian **[inferred]**.

### Homepage content model (ACF `acf` object of page 239 "Homepage")
Four identical blocks — `hero_section`, `chip_section`, `neutrino_section`, `tunnel_section` — each with:
```
section_1: { overline, title }                       # the big lockup
section_2: { title, paragraph, secondary_button }    # the statement + paragraph
section_3: { slides:[{title, paragraph, icon}], button:{title,url} }  # 4–5 cards + CTA
```
Copy (verbatim):
| Chapter | Overline / Title | Statement | Cards | CTA |
|---|---|---|---|---|
| hero | Accelerating / Enterprise ⏎ Superintelligence | On-demand Accelerated Compute & End-to-End AI Solutions | Sovereign GPU Infrastructure · Neutrino™ – Enterprise AI that Ships · AI-as-a-Service for Enterprise · White Glove AI Operations | View Services → `/accelerated-cloud-platform/` |
| chip | Accelerated / Computing Cloud | Supercomputing Foundations for Superintelligent Enterprise Transformations. | Rack-Scale GPU Clusters · RDMA Networking & Petabyte-Scale Storage · Kubernetes & SLURM Orchestration · End-to-End MLOps & LLMOps Pipelines · White Glove Infrastructure & 24/7 Support | View Services |
| neutrino | Presenting / Neutrino™ | Multi-agentic AI Operations Platform for the Superintelligent Enterprise. | Any LLM, One Unified Interface · Agentic RAG That Actually Works · SOP-Driven Multi-Agent Workflows · Enterprise Voice AI & IVR Automation · Full Observability Into Every AI Decision | Explore Neutrino → `/contacts/` |
| tunnel | AI-as-a-Service / Bespoke Solutions ⏎ for Enterprise. | Architect your Superintelligent Enterprise with Personalized Solutions. | Custom Enterprise AI Solutions · Professional AI Consulting · Data Engineering & Lakehouse Architecture · End-to-End GenAI Implementation | (none) |

Card icons are two PNGs reused everywhere (`icon-gpu.png` 208², `icon-lock.png` 208²) drawn inside a hexagon outline (`<use href="#shape-outline">`, 182×200, `max-w-[208px] pb-[110%]`).

### Inner-page builder layouts (ACF `builder[]`, `acf_fc_layout`)
`hero {alignment, title, text, primary_button}` · `spacer {variant: sm|md|lg|xxl}` · `intro_text {title, subtitle, text_alignment}` · `grid {columns, cards[]}` · `card_slider {title, subtitle, cards[]}` · `banner {title, text, buttons}` · `media_banner {title, subtitle, text, media{image|video}}` (blog) · `contact_form {intro, overline, title, subtitle, form}` (Gravity Forms: Name, Email, Company, Country, requirement select, Message, consent checkbox).

---

## 3. The homepage experience (what you actually feel)

### 3.1 Sequence
1. **Loader** (`z-loader: 99`): pure black, 69×17 "8bit.ai" wordmark centred, a 2 px arc spinner rotating around it (`@keyframes rotate 1turn` on the group + `spin` dash-offset keyframes on the circle). Frame `00-loader.jpg`. **[observed]**
2. **Reveal**: the whole page sits in a `fixed inset-0 z-20` wrapper clipped by an SVG `clipPath#landing-mask` (`objectBoundingBox`). GSAP morphs the path `d` with keyframes — on `/` it opens to `M0 0 L1 0 L1 1 L0 1z`; on route changes it collapses through `L1 0 L0 1` (a **diagonal wipe**) to `L1 0 L0 0`. Timeline: two 1 s keyframes overlapped by −0.5 s, total `duration: 1.3`, `ease: "power2.inOut"`. **[observed in `_app`]**
3. **Chrome enters** (one GSAP timeline, `contextSafe`): mobile header panel `yPercent −100 → 0` 1.2 s `power3.inOut` at 0; logo `yPercent 110, autoAlpha 0 → 0/1` 1 s `power3.inOut` at 0.2 s; the two hamburger lines `scaleX 0, x 15 → 1/0` 1 s `power3.inOut`, `stagger 0.1`, at 0.3 s. **[observed]**
4. **Hero lockup types in**: SplitText splits headings into `.line` (overflow-hidden mask, `py-[0.1em] -mt-[0.1em]`) and `.word` (`white-space:nowrap`); lines slide up through their masks with a visible **shear/rotation** during the move (frames `02-hero-transition.jpg`, `06-chip-lockup.jpg` show the baseline tilted mid-flight). Eases used across the home timeline: `power3.inOut` ×3, `power3.out` ×2, `power2.inOut` ×2, `power4`, `expo`, `none`; durations 0.5–1.3 s. **[observed strings + frames; exact per-tween mapping inferred]**

### 3.2 The chapter loop
- 4 chapters × 5 sub-states, driven by accumulated wheel/touch delta. With synthetic wheel events of 6×120 px per step the state advanced exactly once per step and the chapter every 5 steps; after chapter 4 it **wraps to chapter 1** (step 20 = step 0) — the home is an **infinite loop**, there is no "end of page". **[observed]**
- Sub-states of every chapter (frames 01→05, 06→08, 09→11, 12→13):
  1. **Lockup** — overline (`display-lg`, accent `#8faab2`) + title (`display-xl`, white) bottom-left; 3D hero object centred.
  2. **Hand-off** — lockup shrinks to the **compact lockup** (`title-lg` accent + `headline` white) pinned bottom-left; the **statement** (`display-md`, accent, `.word` nowrap) rises from the bottom of the left column; the 3D object zooms/rotates.
  3. **Statement + paragraph** — statement scrolls up, paragraph (`title-md`, Roboto Condensed 500, white) sits in the right half (columns 6–12 of a 12-col grid).
  4. **Cards** — right column becomes a Swiper: hexagon icon frame, prev/next chevrons (12 px padding hit-areas, disabled = `opacity .2`), card title (`title-md` 500), body (`body` 16 px), 5 px pagination dots (white 20 % → 100 %, 0.5 s `ease-out-cubic`), then the white CTA button.
  5. **Cards (cont.)** — the slider is the only thing that still changes; wheel keeps advancing the chapter.
- The **progress rail** (right edge, `right: var(--margin)`): a dot above, a dot below, a 1 px track at white 30 %, and a white filled segment that grows with progress inside the chapter (`data-motion-dot-top/bar/dot-bottom`). **[observed]**
- Persistent **HUD** (all `fixed`): logo top-left (`left: var(--margin)`, `top: 40px`), hamburger top-right (44×44 hit area, two 28×2 px lines 6 px apart), footer row bottom (`lg:bottom-[4rem]`): copyright at 50 % opacity + "This site uses technical cookies only" + "Privacy Policy" on the left; spinner icon + "Scroll Down To Continue" + 4 social icons + a waveform audio toggle (`polyline` in a 10×10 viewBox, 24×16 px, hidden on touch) on the right. Z-order tokens: `z-10 gradient scrim`, `z-20 page`, `z-menu 40`, `z-header/z-logo/z-hamb/z-scrollbar 50`, `z-audio 60`, `z-loader 99`, `z-grid 100`. **[observed]**
- DOM shape of the home: `#__next > #stage > div > canvas` (the WebGL layer), then the `z-loader` overlay, `header`, and a `fixed inset-0 z-20` page layer holding the progress rail (`absolute right-margin top-0 h-full w-[0.2rem]`: two 2 px dots and a track capped at `max-h-[27.8rem]` with `my-spacing-sm`) and the four `<section>`s. Each section stacks four absolutely-positioned full-height layers: the lockup (`container mt-auto mb-[11.1rem] lg:mb-[13.6rem]` → the title sits 111 px / 136 px above the bottom edge), a hidden spare, and two vertically-centred layers (`my-auto`) for statement + paragraph and for the card slider. Sections toggle between `opacity-0` and `opacity-100` (1 s `ease-in-out-cubic`) as the chapter changes. **[observed]**
- A `fixed inset-0 z-10` **scrim** with `linear-gradient(45deg, transparent 10%, rgba(0,0,0,.75) 25%, #000 50%, #000 65%, transparent)` sits between canvas and text at `opacity:0` in the captured states — presumably faded in behind text when the scene gets too bright. **[observed element; use inferred]**

### 3.3 Menu
Click the hamburger → `menuOpen:true, scrollLocked:true`. A panel slides in from the **right covering ~45 % of the viewport** (x ≥ 788 px at 1440), pure black. Items stagger in: each `<li>` `translate-x` 0.5 s `ease-out-cubic` with `transition-delay` 300 ms + n, inner span `translate-y`. Content: "Home" (`display-sm`, `opacity-20` because current), label "Services" (`body-sm`, muted), then Neutrino™ / Accelerated Cloud Platform / Data Studio in `display-sm` (39 px Helvetica) separated by 1 px white-30 % rules, then Newsletter / Contacts in `title-lg` muted `#b2b2b2`, legal links, socials. The hamburger morphs into an ✕. Frame `14-menu-open.jpg`. **[observed]**

### 3.4 Inner pages (`[...routes]`)
- Same HUD (logo + hamburger), but **normal document scroll via Lenis** (`new Lenis({ smoothWheel:true, wrapper, content })` ticked by `gsap.ticker`), custom 12 px-wide scrollbar on the right (`z-scrollbar`, hidden on touch). `body` is still `overflow:hidden` on fine pointers — Lenis owns the scroll. **[observed]**
- The WebGL canvas persists behind every page (faint diagonal light streaks), text is centred: hero `display-xl` + `title-md` subtitle + white CTA (`Talk to an expert`, 60 px tall here) — frame 20.
- Section catalogue seen on `/neutrino/`: intro text (centred `display-sm` + `title-md`), **feature list** (title `title-md` 500 + body, 1 px hairline rules), **stat tiles** (4-up, `bg #292929`, 8 px radius, 24 px padding, wrapped in a `p-[1px]` gradient `#545454 → #303030` that reads as a lit top edge; number in accent `headline`, label muted body), **case-study row** (title `display-sm` + 4 inline stats + a dotted 1 px rule with end dots), **accordion** (2 columns, rows `py-24px`, + / − glyph, hairline dividers), a **gradient banner card** (`bg-gradient-to-r from-[#455D64] to-[#8BB4C0]`, 8 px radius, 32 px padding — the only place the accent becomes a fill), closing **CTA band** ("Experience the impact" in `display-lg`, centred button), then the **site footer** (logo, tagline, socials + waveform, 3 link columns with `title-md` 300 headings, legal row). Frames 21–23. **[observed]**
- `/contacts/`: two-column, left = big wordmark + overline (`body`, muted) + "Connect with us!" (`headline`) + address; right = **ghost inputs** (transparent, 1 px white-20 % border, 4 px radius, 9 px 16 px padding, 44 px tall, focus border white-80 %), custom select, 150 px textarea, 24 px custom checkbox, full-width white submit with a long arrow at the far right. Frame 24. **[observed]**
- `/blog/`: `media_banner` rows — title `display-sm`, bold subtitle `title-md`, body, "Read More →" text-link; image column on the right (image URLs are broken on the live site — the `<img>` renders empty). Frame 25. **[observed]**

---

## 4. The WebGL layer

- One full-viewport `<canvas>` (1324×827 drawing buffer at 1440×900 → `devicePixelRatio` capped / renderer scaled to ~0.92) behind everything, `position: fixed` wrapper. **[observed]**
- **Asset manifest** (`ez()` in `_app`), loaded through a loader with types `texture | gltf | ktx2 | lut`:
  | name | file | size |
  |---|---|---|
  | hero-scene | `/models/hero.glb` | 208 KB |
  | chip-scene | `/models/chip.glb` | 1.67 MB |
  | neutrino-scene | `/models/neutrino.glb` | 18 KB |
  | tunnel-scene | `/models/tunnel.glb` | 312 KB |
  | section-1…4-scene | `/models/sections.glb` (shared) | 126 KB |
  | lines-medium / lines-bold / lines-thin | `/textures/hero-lines-{medium,bold,thin}-min.jpg` | 15 KB each |
  | tunnel-circles / tunnel-circuits / tunnel-lines | `/textures/tunnel-*-min.jpg` | ≤ 70 KB |
  | perlin-noise | `/textures/perlin-datatexture.png` | 3.5 KB |
  | simplex-noise | `/textures/noise.png` | 22 KB |
  | advect-noise | `/textures/advect.png` | 27 KB |
  | tech-noise | `/textures/tech-datatexture.ktx2` | 1.29 MB |
  | lut-cube | `/textures/lut-R04.cube` | 111 KB |
  | lut | `/textures/lut.png` | 25 KB |
- **Post-processing chain** (pmndrs): `BloomEffect` (defaults seen: `luminanceThreshold .9`, `luminanceSmoothing .025`, `intensity 1`, `radius .85`), `LUT3DEffect` fed by `lut-R04.cube` (this is what gives the whole site its cool, slightly cyan-shifted blacks), `NoiseEffect` (film grain — clearly visible in every frame), `SMAAEffect`, `ToneMappingEffect` (ACES / AgX code paths present). **[observed names; parameter values are the library defaults found in the bundle, not confirmed per-pass]**
- **Per-chapter scenes** (what the frames show):
  - *hero*: dozens of diagonal light streaks (the `lines-*` textures on long quads/`InstancedMesh`) rushing bottom-left → top-right, star-like `Points`, and a glass/chrome **"8" outline** (two stacked rounded rectangles, `MeshPhysicalMaterial` with transmission/`CubeCamera` reflections) that rotates and un-twists as you advance.
  - *chip*: an isometric circuit board with glowing bus lines (the "chip" GLB, 1.67 MB, `tunnel-circuits` texture) — camera orbits as the statement appears.
  - *neutrino*: a particle cloud (`Points`, perlin/simplex noise displacement) that forms a faint **"N"**, plus a glowing shard; the brightest, sparsest chapter.
  - *tunnel*: the camera flies **into a tube** of light rails with circuit-pattern walls (`tunnel.glb` + `tunnel-lines/circles/circuits`).
  The `advect.png` + "advect" strings suggest a small fluid-advection pass for the streak trails. **[inferred]**
- Materials observed in the bundle: 16× `MeshPhysicalMaterial`, 17× `MeshStandardMaterial`, 43× `ShaderMaterial`, 11× `RawShaderMaterial`, 19× `InstancedMesh`, 64× `Points`; GLSL helpers `fbm`, `simplex`, `fresnel`/rim lighting. Env lighting via `PMREMGenerator`. **[observed]**

---

## 5. Motion system (numbers you can copy)

| Thing | Value | Where |
|---|---|---|
| Standard ease | `cubic-bezier(.215,.61,.355,1)` = `ease-out-cubic` (16 uses) | hover/opacity/transform transitions |
| Symmetric ease | `cubic-bezier(.645,.045,.355,1)` = `ease-in-out-cubic` (6 uses) | page opacity fade, prev button |
| Durations (CSS) | 200 / **300** / **500** / 1000 ms, `delay-75` for the second hamburger line | |
| GSAP eases | `power3.inOut` (chrome in), `power2.inOut` (mask wipe), `power3.out`, `power4`, `expo`, `none` (audio fade, scrubbed) | `_app` |
| GSAP durations | 0.5, 0.6, 0.8, 1, 1.2, 1.3 s | `_app` |
| Mask wipe | 1.3 s `power2.inOut`, two 1 s keyframes overlapped −0.5 s | landing-mask |
| Logo in | `yPercent 110 → 0`, `autoAlpha`, 1 s, +0.2 s | header timeline |
| Hamburger in | `scaleX 0→1, x 15→0`, 1 s, stagger 0.1, +0.3 s | header timeline |
| Audio fade-out | 0.8 s `none` on a volume proxy | audio provider |
| Button hover | `.label` `translate-y 180% → 0` and `.icon` `translate-x 2rem → 0` / `translate-y 150% → 0`, 0.5 s `ease-out-cubic`; outer `[&>*]:overflow-hidden` masks | CTA |
| Link hover | `opacity .5` (0.3 s) **or** colour → accent `#8faab2` (0.3 s) | footer / rich text |
| Dots | `opacity .2 → 1`, 0.5 s | Swiper bullets |
| Menu items | `translate-x` 0.5 s with 300 ms + stagger `transition-delay` | hamburger menu |
| Page fade | `transition-opacity duration-1000 ease-in-out-cubic` on the page wrapper | route change |
| Text reveal | SplitText lines in overflow-hidden `.line` masks, words `nowrap`; `yPercent` ±100/110 slides; `autoSplit` on font load | all headings |
| `data-motion-*` hooks | `panel, logo, hamb, hamb-line-top/bot, dot-top, bar, dot-bottom, overline, title, paragraph, icons, nav, body, dots, button, copy, legal, swipe, line, scroll, social, audio` | selectors GSAP targets via `gsap.context` |
| Reduced motion | **No `prefers-reduced-motion` rule exists in the CSS** and none was found in the bundle | gap to fix in the portfolio |

---

## 6. Design tokens (summary — the full, agent-ready version is `DESIGN.md`)

- **Root**: `html { font-size: 10px }` → every `rem` is 10 px. Breakpoints: 640 / **768** (`md`) / **1024** (`lg`) / **1280** (`xl`) / 1800 (`2xl`). CSS vars: `--gutter 10px → 30px (md)`, `--margin 20 → 40 (md) → 60 (lg) → 100 px (xl)`, `--header-height 61px`. `.container` = full width with `padding: 0 var(--margin)`.
- **Palette**: canvas `#000000` (true black, by design — the LUT'd WebGL supplies the tint); ink `#ffffff`; secondary ink `#b2b2b2`; white at 50 / 30 / 20 / 10 % for legal text, rails, hairlines, hovers; **one accent `#8faab2`** (overlines, statements, stat numbers, link hover) with `#cfe0e5` hover and the deeper `#455d64 → #8bb4c0` gradient; surfaces `#111`, `#1a1a1a`, `#292929` (+ `#545454→#303030` edge gradient); inverse surface `#fff` with `#1a1a1a` / `#333` ink; error `#ef4444`; newsletter submit gradient `#5b949f → #32555c`.
- **Type scale**: a strict **1.25 (major-third) modular scale on 10 px**: 8.19 · 10.24 · 12.8 · 16 · 20 · 25 · 31.25 · 39.06 · 48.83 · 61.04 · 76.29. Desktop headings `d-h1…d-h6` = 76.29 / 61.04 / 48.83 / 39.06 / 31.25 / 25 px; mobile `s-h1…s-h6` = 39.06 / 39.06 / 39.06 / 31.25 / 25 / 20 px. Tracking: −0.04 em on h1, −0.05 em on h2, −0.03 em on h3–h6; line-height 100 % on h1, 120 % elsewhere; **weight 400 everywhere in display**. Text styles: `text-large` 20/140 %/+0.2 px/**300**, `text-regular` 16/150 %/+0.32 px/400, `text-small` 12.8/140 %/+0.51 px, `text-caption` 10.24/170 %/500, `text-overline` 8.19/160 %/+0.98 px/500.
- **Spacing**: `spacing-xxs 8 · xs 16 · sm 24 · md 32 · lg 40 · xl 56 · 2xl 80 px`; card padding 24; button padding 24 × 32; grid `grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-x-gutter`.
- **Radius**: 4 px (inputs), **8 px** (buttons, cards, tiles), 360 px (`radius-full`), 9999 (dots). No 12/16 px rungs anywhere.
- **Depth**: no box-shadows at all. Hierarchy = bloom/glow in the canvas + 1 px hairlines + the one gradient edge on stat tiles.

---

## 7. Component inventory (desktop values)

| Component | Spec |
|---|---|
| Wordmark | inline SVG symbol `#8bit-logo`, 69×17 viewBox, rendered 53×13 (mobile) / 69×17 (md+), white |
| Hamburger | 44×44 button, 2 lines 28×2 px, `origin-right`, close = ✕ |
| CTA `button-primary` | `bg #fff`, text `#1a1a1a`, Roboto Condensed 16 px/400, padding 24 px 32 px, height 49 px, radius 8 px, label + 40×8 long arrow; hover = masked slide of label/icon |
| Ghost button (blog "Read this blog") | same metrics, transparent bg, white text, no border |
| Text link | underline, hover → accent; "Read More →" variant with 16 px arrow |
| Icon buttons prev/next | transparent, 12 px padding, 19×18 / 16×17 chevrons, disabled `opacity .2` |
| Card (home) | no background; hexagon outline 182×200 containing a 2-fan PNG icon; title `title-md` 500; body 16 px; width = 1 of 4 columns (`--slide-size: 100%/4` at lg) |
| Stat tile | `#292929`, 8 px, 24 px padding, 1 px `#545454→#303030` edge, number accent 25–31 px, label `#b2b2b2` |
| Gradient banner | `#455D64 → #8BB4C0`, 8 px, 32 px padding, 12-col span |
| Accordion row | `py 24px`, hairline `rgba(255,255,255,.2)`, + / − |
| Input (contact) | transparent, 1 px white-20 %, 4 px radius, 9 px 16 px, h 44, placeholder white, focus border white-80 % |
| Input (newsletter) | white bg, `#333` text, 8 px radius, h 43, placeholder `rgba(64,64,64,.5)`; submit gradient `#5B949F→#32555C`, white, 8 px, px 32 |
| Checkbox | 24×24 custom box, tick SVG fades in |
| Progress rail | 1 px track white-30 %, white fill, 2 dots |
| Scroll hint | 16 px spinner (`animate-rotate`) + "Scroll Down To Continue" `body-sm` |
| Pagination dots | 5 px, white, `opacity .2` → 1 |
| Footer (home HUD) | fixed, `py 20px` (lg: bottom 40 px), copyright 50 % |
| Footer (inner) | logo + tagline `body`, socials 16 px + waveform, 3 columns (`title-md` 300 headings, `body` links), legal row |
| Loader | black, wordmark + arc spinner |
| Audio toggle | 24×16 waveform polyline, `touch:hidden` |

---

## 8. Responsive behaviour
- Below 768 px the display scale collapses to 39 px max; the lockup becomes a single column; `--margin` 20 px; header gets a solid black panel (`data-motion-panel`, `md:hidden`) and the footer a black backdrop (`lg:hidden`); the vertical progress rail turns into a swipe indicator (`data-motion-swipe`, `pointer:hidden`); audio toggle and custom scrollbar are hidden on touch (`touch:hidden`). `body.home { touch-action:none }` — the whole home is a touch-gesture surface. **[observed in CSS/DOM]**
- Card slider: `--slide-size = (100% − margin)/1.5` (mobile) → `/3` (md) → `100%/4` (lg).
- Grid: 4 → 6 → 12 columns; text column `lg:col-span-9 xl:col-span-8 2xl:col-span-7`.
- Mobile measurements (390 × 844, CDP `setDeviceMetricsOverride`): `html { font-size: 10px }` unchanged; `--vh` is set by script to `innerHeight/100` (`8.44px`) and drives `h-lvh-vh` heights; every chapter `h1` computes to **39.06 px / −1.17 px** (title line-height 39.06 px = 100 %, overline 46.87 px = 120 %); the WebGL canvas renders at 448 × 970 for a 390 × 844 viewport (≈ 1.15 × — the renderer *oversamples* on small screens instead of under-sampling as on desktop); the solid black header panel (`fixed top-0 h-[var(--header-height)] md:hidden`) is present; the hamburger stays 44 × 44 at `right: 4rem; top: 2.4rem`. Frames `30-mobile-390-hero-scene.jpg`, `31-mobile-390-loader.jpg`.

### 8.1 Mobile capture caveat
Two attempts to drive the chapters at 390 px with synthetic wheel events stalled after the intro: the CDP `Input.dispatchMouseEvent(mouseWheel)` call never returned once the viewport was below `md`, and a third reload sat in the loader for 10 s+. On real phones the experience is advanced by touch (`touchstart/touchmove/touchend` listeners with `touchMultiplier: 1`, `body.home { touch-action: none }`), so the mobile chapter frames in this folder show only the loader and the hero scene before text reveal. Mobile layout rules above come from the stylesheet and computed styles, not from frames of each sub-state. **[observed limitation]**

---

## 9. Accessibility & SEO notes
- Good: semantic `h1/h2/h3/h6`, `sr-only` brand text, `aria-label`s on icon buttons (`toggle-audio`, `prev`, `next`), real `<button>`s, focus borders on inputs.
- Weak: four `<h1>` pairs on one page (each chapter re-declares h1s, duplicated by the compact lockups), no skip link, no `prefers-reduced-motion`, scroll-jacked home with no keyboard path to advance chapters observed, `user-select:none` on `body`, headings animate in with `autoAlpha 0` (invisible to screen-readers until animated).
- SEO: Yoast graph, `og:*`, `theme-color #000000`, `canonical https://8bit.ai/`, `robots.txt` → `sitemap_index.xml` (returned non-XML during capture).

---

## 10. What to carry into Aditya's portfolio (recommendations, not observations)

Keep:
- The **10 px root + 1.25 modular scale**, weight-400 display type with tight negative tracking, one cool accent on black. It is cheap to implement and is 80 % of the look.
- The **chapter model**: overline + 2-line title → statement → paragraph → cards → CTA. It maps 1:1 onto `information.md`: hero = "I build machines / that dream in / signals & motion." (overline = line 1, title = lines 2–3); chapters = Transmissions (featured projects) · Index · Notes · Now/About; cards = projects with `status` as the overline.
- The HUD: fixed logo, hamburger → right-side black panel, bottom legal row, scroll hint, progress rail.
- Motion vocabulary: masked line reveals, 0.3/0.5 s `ease-out-cubic` hovers, diagonal clip-path wipe between routes, masked label/arrow slide on buttons.

Change:
- Do **not** scroll-jack an infinite loop for a portfolio — recruiters need to land on "Projects". Use native scroll + Lenis and let the chapters be pinned ScrollTrigger sections; keep the wheel-stepped feel only inside the card slider.
- Replace the 2.3 MB GLB stack with one lightweight scene (your `3d-website` skills: instanced streaks + a particle "signal" field + bloom/LUT/grain postprocessing) — the grain + LUT is what makes it feel like 8bit, not the models.
- Ship `prefers-reduced-motion`, keyboard chapter navigation (↑/↓, PageDown), one `<h1>`.
- Audio: optional, off by default, never autoplay prompts.
- Fonts: Helvetica Neue is not freely licensable — use **Inter Tight** or **Neue Haas Grotesk Display** (paid) for display, **Roboto Condensed** (free) stays for body.

---

## 11. Evidence & raw files
- REA evidence: `ev_a5d7d924…63ee` (target list), `ev_5a0477ad…34c9` (page inspection), `ev_92075b52…2477` (screenshot). Limitations reported by REA: observation started at attach (no prior network), raw headers/bodies not retained, source maps not fetched, two resources excluded as `unsupported_url`, 13 script sources `not_approved` (we did not request them).
- Session scratch (not committed): `/tmp/claude-1000/-home-aditya-projects-ADITYA/e3d29287-11be-444f-9021-6c2266454a77/scratchpad/` → `dl/` (HTML, CSS, JS chunks, fonts, `next_data.json`, inner-page HTML), `shots-desktop/`, `shots-mobile/`, `shots-pages/`, `cdp-survey.mjs`, `cdp-pages.mjs`.
