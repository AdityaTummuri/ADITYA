---
version: alpha
name: Aditya Tummuri, show the work (sakuga)
description: "A cream manga page with deep ink, hot pink and sun yellow. The site's one idea is unchanged: every number can be pulled. What changed is the world around it. Controls are plain at rest and react like an anime cut when used: they squash and overshoot on springs and throw drawn impacts, smoke, wedges and lettered sound effects onto one canvas above the page. The effects come from Sakuga VFX (MIT, finktheartist/sakuga-vfx), vendored at public/sakuga/core.js."

colors:
  canvas: "#f7f0e0"         # paper, with a faint screentone dot grid on the body
  paper-2: "#efe5cb"        # the side-quest band
  ink: "#17142e"            # the line colour and the text colour; 3px outlines and hard shadows
  ink-muted: "#46425f"      # paragraphs, 8.6:1 on paper
  ink-subtle: "#615d7b"     # dates, hints, 5.4:1 on paper
  primary: "#c20f5d"        # pink for text (values, hover), 5.4:1 on paper
  pink: "#ff4f9a"           # pink for fills, wedges, the marker swash, effects
  sun: "#ffd86b"            # yellow: stickers, code, the shade tone of effects
  sky: "#8fdcf0"
  mint: "#b9f0cf"
  surface-1: "#fffdf6"      # the white of a panel
  surface-2: "#f0e7cf"      # quoted lines
  error: "#c4202b"

typography:
  display:                  # Bricolage Grotesque 800: headings, buttons, menu
    fontFamily: "Bricolage Grotesque"
    fontWeight: 800
    letterSpacing: -0.04em
  poster:                   # Dela Gothic One: episode numerals (outlined), project titles, the name
    fontFamily: "Dela Gothic One"
  body:                     # Bricolage Grotesque 400 to 500
    fontFamily: "Bricolage Grotesque"
    fontSize: 18
    lineHeight: 1.55
  meta:                     # DM Mono: stickers, paths, commits, quoted lines
    fontFamily: "DM Mono"
    fontSize: 13.5

rounded:
  xs: 6px
  md: 14px
  panel: 20px
  pill: 99px

components:
  panel: "3px ink outline, 20px radius, hard 5px/6px ink shadow, surface-1 fill. Lifts 3px/4px on hover."
  sticker: "mono caps in a pill, 2px ink outline, sun fill (pink, sky and white variants)."
  button: "ink pill with a pink hard shadow; squashes on press and throws an impact (data-fx=hit)."
  burst-badge: "a 14-point impact star that holds a figure on each project card."
  marker: "a highlighter swash behind a phrase."
---

# The look

Cream paper, ink line, flat colour, hard offset shadows. Nothing blurs, nothing gradients except the paper fade under the header. Colour is dealt by card: pink, sun, sky, mint.

# Motion

- Hero lines pop in once (spring overshoot). Under reduced motion everything rests and nothing stays hidden.
- Pressable things squash on press and overshoot on release (`--ease-spring`, a `linear()` curve).
- `FxRuntime` reads attributes: `data-fx="hit"` throws an impact, wedges, smoke and a word (`data-word`: don, kachi, shu, pon, zuza); `soft` a small puff; `peek` a glint on mouse arrival; `data-fx-stage` makes empty paper in it react to a click; `data-fx-land` lands a word when a heading first scrolls into view.
- The core draws nothing under `prefers-reduced-motion`; no information depends on an effect.

# Rules

- Every number is still an underlined link to its receipt. The pink underline is the signal.
- Never a gradient, blur or glow on a drawn shape. Things leave by shrinking.
- Pink is for accents and figures; paragraphs are ink.
