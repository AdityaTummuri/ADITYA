---
version: alpha
name: 8bit.ai
description: "8bit.ai's marketing site is a cinematic, scroll-jacked WebGL film with a brutally simple typographic system laid over it — a system that gets its mood from post-processing (bloom, a cool 3D LUT, film grain) rather than from CSS. The canvas is true black `{colors.canvas}` (#000000) and stays true black on every page; the only chromatic voltage is a desaturated glacier teal `{colors.primary}` (#8faab2) that is used as *text* (overlines, statements, stat numbers, link hover) and almost never as a fill. Display type is Helvetica Neue at weight 400 with −0.04 em tracking on a strict 1.25 modular scale from a 10 px root (76.29 / 61.04 / 48.83 / 39.06 px); everything else is Roboto Condensed 400/500 at 16–20 px with slightly positive tracking. The unmistakable signature: enormous light-weight Helvetica lockups in the bottom-left corner, a teal overline above a white title, over a black scene of streaking light — no cards with backgrounds, no shadows, no border radius above 8 px."

colors:
  # Brand voltage — one accent, used as text
  primary: "#8faab2"            # glacier teal: overlines, statements, stat numbers, link hover
  primary-soft: "#cfe0e5"       # hover lift of the accent (hover:bg / hover:text accent-light-dark)
  primary-deep: "#455d64"       # start of the only accent fill gradient (banner card)
  primary-bright: "#8bb4c0"     # end of that gradient
  on-primary: "#000000"         # ink on an accent fill
  gradient-from: "#5b949f"      # newsletter submit button gradient
  gradient-to: "#32555c"

  # Text
  ink: "#ffffff"                # headlines, body, labels
  ink-muted: "#b2b2b2"          # secondary labels, menu secondary links, stat labels
  ink-subtle: "#ffffff80"       # white @ 50% — legal row, copyright
  ink-tertiary: "#ffffff33"     # white @ 20% — disabled arrows, inactive dots, current menu item
  inverse-ink: "#1a1a1a"        # text on the white CTA
  inverse-ink-soft: "#333333"   # text inside white inputs
  inverse-ink-muted: "#4d4d4d"  # secondary text on white

  # Surface (page + rare lifts)
  canvas: "#000000"             # true black, every page, every state
  surface-1: "#111111"          # dark-scheme surface token (surface-primary-light in dark)
  surface-2: "#1a1a1a"          # button-dark / hover surfaces
  surface-3: "#292929"          # stat tiles on inner pages
  surface-edge-from: "#545454"  # 1px gradient "lit edge" wrapper around surface-3 tiles
  surface-edge-to: "#303030"
  inverse-canvas: "#ffffff"     # primary CTA, newsletter input, submit buttons

  # Hairlines (white at alpha — the brand never uses a solid grey border)
  hairline: "#ffffff33"         # 20%: input borders, accordion rules, feature-list rules
  hairline-strong: "#ffffff4d"  # 30%: menu dividers, progress-rail track
  hairline-focus: "#ffffffcc"   # 80%: focused input border

  # Semantic
  error: "#ef4444"
  scrim: "#000000bf"            # 45° gradient scrim between canvas and text

typography:
  display-xl:                   # d-h1 — chapter titles, inner-page hero titles
    fontFamily: "Helvetica Neue, HelveticaNeueCyr, Inter Tight, Arial, sans-serif"
    fontSize: 76.29
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: -3.05
  display-lg:                   # d-h2 — chapter overline (rendered in primary), closing CTA band title
    fontFamily: "Helvetica Neue, HelveticaNeueCyr, Inter Tight, Arial, sans-serif"
    fontSize: 61.04
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: -3.05
  display-md:                   # d-h3 — the "statement" sentence (rendered in primary)
    fontFamily: "Helvetica Neue, HelveticaNeueCyr, Inter Tight, Arial, sans-serif"
    fontSize: 48.83
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: -1.47
  display-sm:                   # d-h4 — menu items, inner-page section titles, case-study title
    fontFamily: "Helvetica Neue, HelveticaNeueCyr, Inter Tight, Arial, sans-serif"
    fontSize: 39.06
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: -1.17
  headline:                     # d-h5 — compact (pinned) chapter title, "Connect with us!", stat numbers
    fontFamily: "Helvetica Neue, HelveticaNeueCyr, Inter Tight, Arial, sans-serif"
    fontSize: 31.25
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: -0.94
  title-lg:                     # d-h6 — compact chapter overline (primary), menu secondary links (muted)
    fontFamily: "Helvetica Neue, HelveticaNeueCyr, Inter Tight, Arial, sans-serif"
    fontSize: 25
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: -0.75
  title-md:                     # text-large + font-medium — card titles, chapter paragraph, hero subtitle, feature-list titles
    fontFamily: "Roboto Condensed, Arial Narrow, sans-serif"
    fontSize: 20
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.2
  lead:                         # text-large at its base weight — footer column headings, light intro lines
    fontFamily: "Roboto Condensed, Arial Narrow, sans-serif"
    fontSize: 20
    fontWeight: 300
    lineHeight: 1.4
    letterSpacing: 0.2
  body:                         # text-regular — card body, inputs, footer links, button labels
    fontFamily: "Roboto Condensed, Arial Narrow, sans-serif"
    fontSize: 16
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.32
  body-sm:                      # text-small — legal row, "Scroll Down To Continue", consent text
    fontFamily: "Roboto Condensed, Arial Narrow, sans-serif"
    fontSize: 12.8
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.51
  caption:                      # text-caption
    fontFamily: "Roboto Condensed, Arial Narrow, sans-serif"
    fontSize: 10.24
    fontWeight: 500
    lineHeight: 1.7
    letterSpacing: 0.51
  eyebrow:                      # text-overline — tiny section taxonomy label
    fontFamily: "Roboto Condensed, Arial Narrow, sans-serif"
    fontSize: 8.19
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: 0.98
  button:                       # identical to body — buttons are not shouted
    fontFamily: "Roboto Condensed, Arial Narrow, sans-serif"
    fontSize: 16
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.32
  nav-link:                     # hamburger-menu primary items = display-sm
    fontFamily: "Helvetica Neue, HelveticaNeueCyr, Inter Tight, Arial, sans-serif"
    fontSize: 39.06
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: -1.17

rounded:
  xs: 4px                       # contact-form inputs, contact submit
  md: 8px                       # CTA buttons, cards, stat tiles, newsletter input + submit, banner card
  pill: 360px                   # radius-full token (rarely used)
  full: 9999px                  # pagination dots, circular hit areas

spacing:                        # 10px root; the Tailwind theme names are spacing-xxs … spacing-2xl
  xxs: 8px
  xs: 16px
  sm: 24px
  md: 32px
  lg: 40px
  xl: 56px
  xxl: 80px
  gutter: 30px                  # column gap (10px below 768px)
  margin: 100px                 # page side margin at ≥1280px (20 / 40 / 60px at <768 / md / lg)
  header: 61px                  # --header-height
  section: 100px                # inner-page hero/contact padding (py-[10rem]); ACF spacers sm/md/lg/xxl

components:
  top-nav:                      # no bar at all — a fixed logo and a fixed hamburger over the scene
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    height: 61px
  hamburger:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    width: 44px
    height: 44px               # two 28×2px lines, 6px apart, origin-right
  menu-panel:                   # slides in from the right, covers ~45% of the viewport
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    padding: 180px 100px
  menu-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    padding: 16px 0             # 1px {colors.hairline-strong} rule beneath each item
  menu-link-current:
    backgroundColor: "transparent"
    textColor: "{colors.ink-tertiary}"
    typography: "{typography.nav-link}"
  menu-link-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    typography: "{typography.title-lg}"
  button-primary:               # white pill-less block with a long arrow
    backgroundColor: "{colors.inverse-canvas}"
    textColor: "{colors.inverse-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 24px 32px
    height: 49px
  button-primary-hover:         # same colours; label slides up through a mask, arrow slides in from the left (0.5s ease-out-cubic)
    backgroundColor: "{colors.inverse-canvas}"
    textColor: "{colors.inverse-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
  button-ghost:                 # blog "Read this blog"
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 24px 32px
  button-submit-wide:           # contact form submit — full width, label left, long arrow right
    backgroundColor: "{colors.inverse-canvas}"
    textColor: "{colors.inverse-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.xs}"
    padding: 16px 32px
    height: 44px
  button-submit-gradient:       # newsletter submit
    backgroundColor: "linear-gradient(to left, {colors.gradient-from}, {colors.gradient-to})"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 5px 32px
    height: 43px
  button-icon-arrow:            # slider prev / next chevrons
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: 12px
    height: 42px               # disabled → {colors.ink-tertiary} (opacity .2)
  text-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"   # underline; hover → {colors.primary} or opacity .5, 0.3s ease-out-cubic
  text-link-arrow:              # "Read More →"
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
  chapter-lockup:               # the signature: overline in primary above a 2-line title in ink, bottom-left
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.display-xl}"
    padding: 0 0 100px 100px
  chapter-lockup-overline:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.display-lg}"
  chapter-lockup-compact:       # the pinned version after the chapter advances
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
  statement:                    # one accent sentence, words kept on one line each
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.display-md}"
  feature-card:                 # home slider card — NO background, NO border
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "0px"
    padding: 0
    width: 25%                 # --slide-size: 100%/4 at ≥1024px
  feature-card-icon-frame:      # hexagon outline, 182×200, 1px ink stroke, icon centred
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    width: 208px
  stat-tile:                    # inner pages, 4-up
    backgroundColor: "{colors.surface-3}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 24px              # wrapped in a 1px linear-gradient({colors.surface-edge-from}, {colors.surface-edge-to}) edge
  stat-tile-number:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.headline}"
  banner-card-gradient:         # the single accent fill on the site
    backgroundColor: "linear-gradient(to right, {colors.primary-deep}, {colors.primary-bright})"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    rounded: "{rounded.md}"
    padding: 32px
  accordion-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    padding: 24px 0            # 1px {colors.hairline} rule; + / − glyph at the right
  feature-list-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.title-md}"
    padding: 24px 0            # 1px {colors.hairline} rule between rows
  text-input:                   # contact form
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xs}"
    padding: 9px 16px
    height: 44px               # 1px {colors.hairline} border; placeholder in {colors.ink}
  text-input-focused:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xs}"    # border → {colors.hairline-focus}
  text-input-error:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xs}"    # border → {colors.error} @ 50%
  text-input-inverse:           # newsletter email
    backgroundColor: "{colors.inverse-canvas}"
    textColor: "{colors.inverse-ink-soft}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 16px 16px
    height: 43px
  checkbox:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    width: 24px
    height: 24px               # 1px {colors.hairline} box, tick SVG fades to opacity 1 when checked
  pagination-dot:
    backgroundColor: "{colors.ink}"
    rounded: "{rounded.full}"
    width: 5px
    height: 5px                # inactive = opacity .2, 0.5s ease-out-cubic
  progress-rail:                # right edge of the home: dot · 1px track · dot, white fill grows with chapter progress
    backgroundColor: "{colors.hairline-strong}"
    textColor: "{colors.ink}"
    width: 1px
  scroll-hint:                  # 16px rotating arc + "Scroll Down To Continue"
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
  footer-hud:                   # home: fixed bottom row
    backgroundColor: "transparent"
    textColor: "{colors.ink-subtle}"
    typography: "{typography.body-sm}"
    padding: 20px 100px 40px
  footer:                       # inner pages
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: 56px 100px
  footer-column-title:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.lead}"
  loader:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"   # 69×17 wordmark + 2px rotating arc
---

## Overview

8bit.ai is what happens when a motion studio designs an enterprise-AI brand: the *interface* is almost absent and the *scene* does the talking. The page floor is `{colors.canvas}` — true `#000000`, not the tinted near-blacks that Linear or Vercel use — because the WebGL layer behind every page is graded through a cool 3D LUT, bloomed and grained, and the CSS black simply disappears into it. There is no alternation of light and dark bands, no sections with their own backgrounds, no card surfaces on the home at all. Hierarchy is built from **size**, **position** and **one colour**.

That one colour is `{colors.primary}` (#8faab2), a greyed glacier teal that sits halfway between the scene's cyan highlights and the white ink. It is used as *text*: the overline above every chapter title, the big "statement" sentence, the number inside a stat tile, the hover colour of inline links. It becomes a fill in exactly one place (`{components.banner-card-gradient}`, a `{colors.primary-deep}` → `{colors.primary-bright}` gradient on inner pages) and a button in exactly one place (the newsletter submit). Everywhere else the call-to-action is a plain **white block** (`{components.button-primary}`) with `{colors.inverse-ink}` text and a long thin arrow — the inverse of the canvas, not an accent.

The typographic voice is **light, huge and quiet**. Helvetica Neue at weight 400 (never bolder) runs a disciplined 1.25 modular scale from a 10 px root — 76.29 → 61.04 → 48.83 → 39.06 → 31.25 → 25 px — with tracking that tightens as size grows (−0.04 em at `{typography.display-xl}`). The title sits in the **bottom-left corner** of the viewport, two lines, with the teal overline directly above it; when the chapter advances it shrinks into a compact lockup pinned in the same corner, so the eye always has an anchor. Body copy switches silently to Roboto Condensed — a narrow, slightly technical counter-voice at 16–20 px with *positive* tracking (+0.32 px) that reads like a HUD label next to the Helvetica display. Buttons use the body style unchanged: 16 px, weight 400, no uppercase.

Depth is never a CSS shadow. The only lifts are 1 px white-alpha hairlines (`{colors.hairline}` 20 %, `{colors.hairline-strong}` 30 %) and, on inner pages, the `{colors.surface-3}` stat tile with a 1 px gradient edge that fakes a lit top bevel. Glow belongs to the canvas (bloom), not to the UI.

**Key Characteristics:**
- Canvas is literally `#000000` on every page; the tint comes from the LUT-graded WebGL scene, not from CSS.
- One accent, `{colors.primary}` #8faab2, used as text (overline, statement, stat numbers, link hover) — fills are the exception, buttons are white.
- Display = Helvetica Neue **400**, 1.25 modular scale on a 10 px root, −0.03 to −0.05 em tracking, line-height 1.0 on the hero title.
- Body/UI = Roboto Condensed 400/500, 16–20 px, +0.2 to +0.5 px tracking, sentence case everywhere (no uppercase labels except nothing — even the eyebrow is sentence case).
- Lockups live bottom-left; paragraphs and cards live in the right half of a 12-column grid.
- No shadows, no card backgrounds on the home, no radius above 8 px, no borders except white-alpha hairlines.
- Motion is part of the identity: masked line reveals, a diagonal clip-path wipe between routes, 0.3/0.5 s `cubic-bezier(.215,.61,.355,1)` hovers, bloom + film grain on everything.
- It is NOT: a gradient-mesh AI site, a purple/blue SaaS palette, a bento-card grid, a rounded-pill UI.

## Colors

> Source pages: `/` (all four chapters, menu open), `/neutrino/`, `/contacts/`, `/blog/`; the compiled Tailwind stylesheet; computed styles via CDP. See `docs/8bit-ai-teardown.md` §6.

### Brand & Accent
- **Glacier Teal** (`{colors.primary}` — #8faab2): the only chromatic colour. Chapter overlines ("Accelerating", "Presenting"), the statement sentence ("On-demand Accelerated Compute & End-to-End AI Solutions"), stat numbers ("70 %", "6x"), link hover (`[&_a:hover]:text-text-accent-light`).
- **Glacier Soft** (`{colors.primary-soft}` — #cfe0e5): hover lift of accent-coloured elements (`hover:bg-text-accent-light-dark`, `text-text-accent-light-dark`).
- **Glacier Deep → Bright** (`{colors.primary-deep}` #455d64 → `{colors.primary-bright}` #8bb4c0): the single accent *fill*, a left-to-right gradient on the inner-page banner card.
- **Teal Submit** (`{colors.gradient-from}` #5b949f → `{colors.gradient-to}` #32555c): the newsletter submit button gradient — the only coloured button on the site.
- **On Primary** (`{colors.on-primary}` — #000000): use black ink if text ever sits on an accent fill (the site puts white on the dark gradient; black on `{colors.primary-soft}`).

### Surface
- **Canvas** (`{colors.canvas}` — #000000): the page floor, `body { background:#000 }`, also the loader, the menu panel and the mobile header/footer backdrops (`bg-black-dark`).
- **Surface 1** (`{colors.surface-1}` — #111111): the dark-scheme surface token; appears as fills in SVG icons and dark-mode surfaces, rarely as a panel.
- **Surface 2** (`{colors.surface-2}` — #1a1a1a): `bg-text-button-primary-dark` — a dark button/hover surface.
- **Surface 3** (`{colors.surface-3}` — #292929): stat tiles on `/neutrino/`, wrapped in a 1 px `{colors.surface-edge-from}` → `{colors.surface-edge-to}` gradient edge.
- **Inverse Canvas** (`{colors.inverse-canvas}` — #ffffff): the primary CTA, the newsletter email input and both submit buttons.
- **Hairline** (`{colors.hairline}` — white 20 %): contact inputs, accordion and feature-list rules, checkbox box.
- **Hairline Strong** (`{colors.hairline-strong}` — white 30 %): menu dividers, the progress-rail track.
- **Hairline Focus** (`{colors.hairline-focus}` — white 80 %): focused input border.
- **Scrim** (`{colors.scrim}` — black 75 %): mid-stop of the 45° gradient scrim between scene and text.

### Text
- **Ink** (`{colors.ink}` — #ffffff): titles, body, labels, card titles, inputs' typed text.
- **Ink Muted** (`{colors.ink-muted}` — #b2b2b2): "Services" label and Newsletter/Contacts in the menu, stat-tile labels, contact overline.
- **Ink Subtle** (`{colors.ink-subtle}` — white 50 %): copyright line, scroll-hint, legal links at rest.
- **Ink Tertiary** (`{colors.ink-tertiary}` — white 20 %): disabled slider arrows, inactive pagination dots, the current page in the menu ("Home" at opacity .2).
- **Inverse Ink** (`{colors.inverse-ink}` — #1a1a1a): label on the white CTA. **Inverse Ink Soft** (`{colors.inverse-ink-soft}` — #333333) inside white inputs; **Inverse Ink Muted** (`{colors.inverse-ink-muted}` — #4d4d4d) secondary on white.

### Semantic
- **Error** (`{colors.error}` — #ef4444): validation text and `border-error/50` on invalid inputs. No success/warning/info colours exist on the site.

## Typography

### Font Family

- **Helvetica Neue** — self-hosted WOFF (300 "Helvetica Neue Light", 400 "HelveticaNeueCyr Roman", 500, 700 — only 400 is used for display). Carries `display-xl` → `title-lg` and the menu. Fallback `Arial` with `size-adjust: 101.37%`.
- **Roboto Condensed** — Google font via `next/font`, weights 300 (base of `text-large`), 400, 500. Carries `title-md`, `lead`, `body`, `body-sm`, `caption`, `eyebrow`, `button`. Fallback `Arial` with `size-adjust: 88.83%`.
- **Mono** — none. Code/mono never appears on the marketing surface.

The two families are a deliberate contrast, not a continuum: wide, light, tightly-tracked Helvetica for anything that is *read as an image* (titles, overlines, statements, menu), and narrow, slightly loose Roboto Condensed for anything that is *read as information* (paragraphs, card copy, buttons, form fields, footer). A heading in Roboto Condensed only happens at `title-md` and below (card titles, feature-list titles); a paragraph in Helvetica never happens.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 76.29px | 400 | 1.0 | −3.05px (−0.04em) | Chapter title ("Enterprise Superintelligence"), inner-page hero title |
| `{typography.display-lg}` | 61.04px | 400 | 1.2 | −3.05px (−0.05em) | Chapter overline in `{colors.primary}`; closing CTA band title |
| `{typography.display-md}` | 48.83px | 400 | 1.2 | −1.47px (−0.03em) | Statement sentence in `{colors.primary}` |
| `{typography.display-sm}` / `{typography.nav-link}` | 39.06px | 400 | 1.2 | −1.17px | Menu items, section titles, case-study title, blog post title |
| `{typography.headline}` | 31.25px | 400 | 1.2 | −0.94px | Compact pinned chapter title, "Connect with us!", stat numbers |
| `{typography.title-lg}` | 25px | 400 | 1.2 | −0.75px | Compact chapter overline (primary), menu secondary links (muted) |
| `{typography.title-md}` | 20px | 500 | 1.4 | +0.2px | Card titles, chapter paragraph, hero subtitle, feature-list titles, accordion rows |
| `{typography.lead}` | 20px | 300 | 1.4 | +0.2px | Footer column headings, light intro lines |
| `{typography.body}` | 16px | 400 | 1.5 | +0.32px | Default body, card copy, input text, footer links |
| `{typography.button}` | 16px | 400 | 1.5 | +0.32px | Every button label (identical to body) |
| `{typography.body-sm}` | 12.8px | 400 | 1.4 | +0.51px | Legal row, scroll hint, consent text, menu "Services" label |
| `{typography.caption}` | 10.24px | 500 | 1.7 | +0.51px | Metadata |
| `{typography.eyebrow}` | 8.19px | 500 | 1.6 | +0.98px | Tiny taxonomy label (defined, rarely seen) |

Mobile (< 768px) display scale: `display-xl` 39.06px / 1.0 / −1.17px · `display-lg` 39.06px / 1.2 · `display-md` 39.06px / 1.2 / −1.17px · `display-sm` 31.25px / −0.94px · `headline` 25px / −0.75px · `title-lg` 20px / 1.8 / +0.2px. Everything below `title-md` is unchanged.

### Principles

- **Weight 400 is the display weight.** Nothing on the site is bolder than 500, and 500 only appears in Roboto Condensed at 20 px and below. A bold Helvetica headline would be a different brand.
- **Tracking flips sign with size**: negative on Helvetica (−0.03 → −0.05 em), positive on Roboto Condensed (+0.2 → +0.98 px). Do not track Helvetica positive or Roboto negative.
- **The scale is 10 × 1.25ⁿ.** If a size is not on the ladder (8.19 · 10.24 · 12.8 · 16 · 20 · 25 · 31.25 · 39.06 · 48.83 · 61.04 · 76.29), it is wrong.
- **Lockups are two-tone**: overline in `{colors.primary}`, title in `{colors.ink}`, overline one step smaller on the scale (`display-lg` over `display-xl`; `title-lg` over `headline`).
- **Sentence case everywhere.** No uppercase labels, no uppercase buttons.
- **Negative vertical trim**: every heading carries `-mt-[0.22em] -mb-[0.26em]` so the glyph box, not the line box, sets the rhythm; paragraphs carry `-my-[0.36em]`.
- Headings are split into masked lines (`.line { overflow:hidden }`) and words (`.word { white-space:nowrap }`) and animate in; design the layout so each line is a clean mask.

### Note on Font Substitutes

Helvetica Neue is a licensed Linotype face. Free substitutes that keep the wide, neutral-grotesk feel at weight 400: **Inter Tight** (closest in width at display sizes; use `font-feature-settings: "ss01"`-free defaults), **Instrument Sans**, or **Archivo**. If the budget allows, **Neue Haas Grotesk Display** is the faithful choice. Roboto Condensed is free (Google Fonts) — keep it. For a mono (the site has none) use **JetBrains Mono** or **Geist Mono** only inside code contexts.

## Layout

### Spacing System

- **Base unit:** 8 px on a 10 px root (`1rem = 10px`), so tokens read as `.8rem / 1.6rem / 2.4rem / 3.2rem / 4rem / 5.6rem / 8rem`.
- **Tokens:** `{spacing.xxs}` 8 · `{spacing.xs}` 16 · `{spacing.sm}` 24 · `{spacing.md}` 32 · `{spacing.lg}` 40 · `{spacing.xl}` 56 · `{spacing.xxl}` 80.
- **Page margin:** `{spacing.margin}` = `var(--margin)` → 20 px (< 768) · 40 px (md) · 60 px (lg) · 100 px (xl+). Gutter `{spacing.gutter}` = 10 px → 30 px (md).
- **Header height:** `{spacing.header}` 61 px (`--header-height`), used as top padding on inner-page heroes below md.
- **Button padding:** `{spacing.sm}` × `{spacing.md}` (24 × 32). **Card/tile padding:** `{spacing.sm}` 24. **Banner padding:** `{spacing.md}` 32. **Row rhythm (lists/accordions):** `{spacing.sm}` 24 top and bottom.
- **Vertical rhythm on inner pages** comes from ACF `spacer` blocks (`sm | md | lg | xxl`) between layouts rather than from section padding; heroes and the contact page use `py-[10rem]` (`{spacing.section}` 100 px).

### Grid & Container

- `.container` is **full width** with `padding: 0 var(--margin)`; max-width is the viewport (the Tailwind `max-width` steps exist but `max-w-full` overrides them).
- Columns: `grid-cols-4` (mobile) → `md:grid-cols-6` → `lg:grid-cols-12`, `gap-x-gutter`.
- Home text column: `lg:col-span-9 xl:col-span-8 2xl:col-span-7`; paragraph/cards start at `md:col-start-2` / `lg:col-start-6`; the banner spans all 12.
- Home card slider: `--slide-size = (100% − margin)/1.5` → `/3` (md) → `100%/4` (lg).
- Inner-page stat tiles 4-up, accordion 2-up, grid cards 2–3-up, footer 1 + 3 columns.

### Whitespace Philosophy

The home has no whitespace in the editorial sense — it has **empty scene**. Text occupies the bottom-left quadrant and the right third; the rest is canvas for the WebGL object. Inner pages are generous but not airy: 100 px heroes, 24 px row rhythm, and sections separated by spacer blocks rather than by background changes. Nothing is centred on the home; inner-page heroes, intro texts and CTA bands are centred.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | `{colors.canvas}`, no border, no shadow | Everything on the home: lockups, cards, paragraphs |
| 1 (hairline) | 1 px `{colors.hairline}` (20 %) | Inputs, accordion/list rules, checkbox |
| 2 (strong hairline) | 1 px `{colors.hairline-strong}` (30 %) | Menu dividers, progress-rail track |
| 3 (tile) | `{colors.surface-3}` fill + 1 px gradient edge `{colors.surface-edge-from}` → `{colors.surface-edge-to}` | Stat tiles |
| 4 (inverse) | `{colors.inverse-canvas}` block | Primary CTA, submit buttons, newsletter input |
| 5 (accent fill) | `{colors.primary-deep}` → `{colors.primary-bright}` gradient | Banner card — once per page at most |
| focus | border → `{colors.hairline-focus}` (80 %) | Focused inputs |

There is **no `box-shadow` anywhere in the stylesheet**. Glow exists, but it is rendered by the Bloom pass in WebGL. If a UI element needs to feel lifted, make it whiter (inverse) or give it a hairline — never a drop shadow.

### Decorative Depth

- The WebGL scene (streaking light, circuit board, particle "N", light tunnel) graded through a 3D LUT with film grain is the depth of the site; UI sits flat on top.
- A fixed 45° scrim `linear-gradient(45deg, transparent 10%, {colors.scrim} 25%, #000 50%, #000 65%, transparent)` can be faded in between scene and text to protect legibility.
- Stat tiles fake a bevel with the 1 px gradient edge — the only "lit edge" treatment.
- No atmospheric CSS gradients, no glassmorphism (`backdrop-blur-sm` exists in the CSS but is not used on the captured pages), no spotlight cards.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Contact-form inputs, textarea, contact submit |
| `{rounded.md}` | 8px | Primary CTA, ghost button, stat tiles, banner card, newsletter input + submit, grid cards |
| `{rounded.pill}` | 360px | `rounded-radius-full` token; reserve for pill tags |
| `{rounded.full}` | 9999px | Pagination dots, circular hit areas |

No 6 / 12 / 16 / 24 px rungs exist. Cards on the home have no radius because they have no box.

### Photography & Illustration Geometry

There is **no photography**. Imagery is (a) the real-time WebGL scene, full-bleed behind everything, and (b) a pair of flat white line icons (two fan/aperture glyphs) placed inside a 1 px **hexagon outline** (182 × 200, `max-w-[208px]`, aspect 1 : 1.1) — the only illustration motif, repeated on every card. Blog `media_banner` rows reserve a right-hand image column (16:9 / `object-cover`), square-cornered. Social icons are 16 px monochrome sprites. Avatars, screenshots and product mockups do not occur.

## Components

### Top Navigation

**`top-nav`** — There is no bar. A `{components.hamburger}` sits fixed top-right at `right: var(--margin); top: 40px` and the wordmark sits fixed top-left at the same offsets; both float over the scene. Below 768 px a solid `{colors.canvas}` panel of `{spacing.header}` height slides down behind them (`data-motion-panel`).
- Wordmark: inline SVG `#8bit-logo`, 69 × 17 at md+, 53 × 13 below.
- `hamburger`: 44 × 44 hit area; two 28 × 2 px `{colors.ink}` lines 6 px apart, `transform-origin: right`; they draw in with `scaleX 0 → 1` + `x 15 → 0` (GSAP, 1 s, `power3.inOut`, stagger 0.1) and cross into an ✕ when open.

**`menu-panel`** — Slides in from the right (≈ 45 % of the viewport wide), `{colors.canvas}`, `scrollLocked:true` while open.
- Items are `{typography.nav-link}` in `{colors.ink}` with a 1 px `{colors.hairline-strong}` rule beneath each; the current page uses `{colors.ink-tertiary}`; a `{typography.body-sm}` `{colors.ink-muted}` label ("Services") groups the primary items; secondary items (`menu-link-secondary`) are `{typography.title-lg}` in `{colors.ink-muted}`; legal links and 16 px social icons close the panel.
- Each `<li>` translates in over 0.5 s `ease-out-cubic` with `transition-delay` 300 ms + stagger; links fade to opacity .5 on hover.

### Buttons

**`button-primary`** — The CTA is the inverse of the page: a white block, not an accent.
- Background `{colors.inverse-canvas}`, text `{colors.inverse-ink}`, type `{typography.button}` (16 px / 400, sentence case), padding 24 px 32 px, height 49 px, rounded `{rounded.md}`; label left, a 40 × 8 px long arrow (`#arrow-right`) right with `{spacing.xxs}` gap.
- Hover (`button-primary-hover`): no colour change — the label slides up through an `overflow-hidden` mask (`translate-y 180% → 0`) and the arrow slides in from the left (`translate-x 2rem → 0`), both 0.5 s `cubic-bezier(.215,.61,.355,1)`.
- Variant: on inner pages the same button is 60 px tall when the label wraps to the 24 px line-height box.

**`button-ghost`** — Same metrics and type, transparent background, `{colors.ink}` text, no border ("Read this blog").

**`button-submit-wide`** — Contact form: full-width white block, `{rounded.xs}`, 44 px, label flush left, long arrow flush right.

**`button-submit-gradient`** — Newsletter: `linear-gradient(to left, {colors.gradient-from}, {colors.gradient-to})`, white label, 43 px, `{rounded.md}`. The one coloured button.

**`button-icon-arrow`** — Slider prev/next: 19 × 18 chevrons with 12 px padding, no background; disabled = opacity .2 (`{colors.ink-tertiary}`), 0.3 s transition.

**`text-link`** — Underlined `{typography.body}`; hover → `{colors.primary}` (0.3 s) in rich text, or opacity .5 in the footer/legal row. **`text-link-arrow`** ("Read More →") pairs the label with a 16 px arrow and no underline.

### Cards & Containers

**`chapter-lockup`** — The signature component. Bottom-left of the viewport (`left: var(--margin)`, `bottom ≈ 100 px`): `chapter-lockup-overline` in `{typography.display-lg}` `{colors.primary}` directly above a two-line `{typography.display-xl}` `{colors.ink}` title, both split into masked lines. When the chapter advances it collapses into `chapter-lockup-compact` (`{typography.title-lg}` primary over `{typography.headline}` ink) pinned in the same corner.

**`statement`** — A single sentence in `{typography.display-md}` `{colors.primary}`, left column, `.word { white-space:nowrap }`, followed in the next state by a `{typography.title-md}` `{colors.ink}` paragraph in the right half (`lg:col-start-6`).

**`feature-card`** — Home slider card: **no background, no border, no radius**. Stack: `feature-card-icon-frame` (1 px `{colors.ink}` hexagon outline 182 × 200 with the white icon centred) → prev/next `button-icon-arrow` → title `{typography.title-md}` → body `{typography.body}` → `pagination-dot` row → `button-primary`. Width one quarter of the grid at lg.

**`stat-tile`** — Inner pages, 4-up: `{colors.surface-3}` fill, `{rounded.md}`, 24 px padding, wrapped in a `p-[1px]` box filled with `linear-gradient({colors.surface-edge-from}, {colors.surface-edge-to})` so the top edge reads lit; `stat-tile-number` in `{typography.headline}` `{colors.primary}`, label in `{typography.body}` `{colors.ink-muted}`.

**`banner-card-gradient`** — 12-column card, `linear-gradient(to right, {colors.primary-deep}, {colors.primary-bright})`, `{rounded.md}`, 32 px padding, `{colors.ink}` text. The only accent fill — never more than one per page.

**`feature-list-row`** / **`accordion-row`** — `{typography.title-md}` title + `{typography.body}` text, 24 px vertical padding, 1 px `{colors.hairline}` rule; accordion rows add a + / − glyph at the far right and open on click.

**`case-study-row`** — `{typography.display-sm}` title left, 4 inline stats right (`{typography.title-md}` number + `{typography.body}` label), closed by a dotted 1 px rule with end dots.

### Inputs & Forms

**`text-input`** + **`text-input-focused`** + **`text-input-error`** — Ghost inputs on the canvas: transparent, 1 px `{colors.hairline}` border, `{rounded.xs}`, 9 px 16 px padding, 44 px tall (textarea 150 px), `{typography.body}` in `{colors.ink}`, placeholder also `{colors.ink}` ("Name *"); focus → `{colors.hairline-focus}`; error → `{colors.error}` at 50 % and a `{typography.body-sm}` message in `{colors.error}` positioned under the field. A custom `<select>` matches with a chevron at the right.

**`text-input-inverse`** — Newsletter email: `{colors.inverse-canvas}` fill, `{colors.inverse-ink-soft}` text, `{rounded.md}`, 43 px, placeholder `rgba(64,64,64,.5)`.

**`checkbox`** — 24 × 24 hairline box; the native input is `opacity-0` and a tick SVG fades to 1 when checked; consent copy in `{typography.body-sm}` with an underlined privacy link.

### Tags / Badges

None. The site has no pills, chips, status badges or tags. Project/status labelling (needed for the portfolio) should be done typographically: `{typography.title-lg}` or `{typography.body-sm}` in `{colors.primary}` as an overline, not as a filled pill.

### Status & Navigation Aids

**`progress-rail`** — Right edge of the home at `right: var(--margin)`: a 1 px `{colors.hairline-strong}` track between two dots, with a `{colors.ink}` segment that grows with the chapter progress.

**`scroll-hint`** — 16 px rotating arc (`@keyframes rotate`, 1 turn) + "Scroll Down To Continue" in `{typography.body-sm}` `{colors.ink}`, bottom-right.

**`pagination-dot`** — 5 px `{colors.ink}` dots, inactive at opacity .2, 0.5 s `ease-out-cubic`.

**`loader`** — Full-screen `{colors.canvas}`, centred wordmark, 2 px arc spinner; exits through the diagonal clip-path wipe (1.3 s `power2.inOut`).

### CTA / Footer

**`cta-band`** — Inner pages end with a centred `{typography.display-lg}` title ("Experience the impact") and one `button-primary`, on bare canvas.

**`footer-hud`** — Home: a fixed bottom row. Left: copyright in `{typography.body-sm}` `{colors.ink-subtle}` + "This site uses technical cookies only" + "Privacy Policy" (`{colors.ink}`, hover opacity .5). Right: `scroll-hint`, four 16 px social icons, a 24 × 16 waveform audio toggle.

**`footer`** — Inner pages: wordmark + tagline (`{typography.body}`) + socials on the left; three link columns (`footer-column-title` in `{typography.lead}` 300, links in `{typography.body}`) on the right; a legal row underneath. All on `{colors.canvas}`, no top border.

## Do's and Don'ts

### Do

- Set the page background to `{colors.canvas}` #000000 and keep it there — on every route, in every state, including menus and loaders.
- Use `{colors.primary}` as **text**: the overline above a title, the one statement sentence per section, a stat number, a link's hover. One accent moment per viewport.
- Make the primary CTA a **white block** (`{components.button-primary}`): `{colors.inverse-canvas}` fill, `{colors.inverse-ink}` label, 16 px weight 400 sentence case, 8 px radius, a long thin arrow — and animate the label/arrow through masks on hover instead of changing colour.
- Keep display type at **weight 400** in a wide grotesk, sizes only from the 1.25 ladder (76.29 / 61.04 / 48.83 / 39.06 / 31.25 / 25), tracking −0.03 to −0.05 em, line-height 1.0–1.2.
- Build every lockup as **overline + two-line title**, overline one step down the scale and in `{colors.primary}`, anchored bottom-left; collapse it to the compact pair when the section advances.
- Switch to Roboto Condensed (or an equally narrow grotesk) for everything 20 px and below, with *positive* tracking.
- Separate content with 1 px white-alpha hairlines (`{colors.hairline}` 20 %, `{colors.hairline-strong}` 30 %) and 24 px row rhythm, not with background bands.
- Let a full-bleed, LUT-graded, grainy scene (WebGL or video) provide atmosphere; keep the HTML layer flat on top of it.
- Reveal headings as masked lines (`overflow:hidden` per line, slide `yPercent` 100 → 0), hover at 0.3 s / 0.5 s with `cubic-bezier(.215,.61,.355,1)`, and wipe between routes with a diagonal clip-path (1.3 s `power2.inOut`).

### Don't

- Don't tint the canvas (`#0b0b0f`, `#111318`, navy, indigo). The brand is `#000000`; the colour lives in the scene.
- Don't use `{colors.primary}` as a button, a section background or an icon tint. Teal buttons make it a generic "AI blue" site; the only coloured fills allowed are the one banner gradient and the newsletter submit.
- Don't introduce a second chromatic accent (lime, cyan, peach, violet). Status and emphasis are carried by white-alpha opacity and size.
- Don't bold the display type. Helvetica Neue at 600/700 — or any geometric sans (Sora, Poppins, Montserrat) — is a different brand. Weight 400, wide, tight.
- Don't uppercase labels or buttons, and don't letter-space them out; every label on the site is sentence case at 16 px.
- Don't give home cards a background, a border or a radius; a card is an icon frame + title + copy on the canvas. Bento grids and glass cards are off-brand.
- Don't use `box-shadow`, `backdrop-filter` glass, or CSS glow halos — depth is a hairline, an inverse block, or bloom inside the scene.
- Don't exceed 8 px border radius (4 px on inputs); no pills on buttons.
- Don't centre text on the home experience; lockups are bottom-left, copy is right-of-centre. Centring is reserved for inner-page heroes and CTA bands.
- Don't ship a light mode. Nothing on the site anticipates one (`prefers-color-scheme: dark` only re-maps one surface token).

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| 2xl | ≥ 1800px | Text column narrows to `col-span-7`; margins stay 100 px |
| xl | ≥ 1280px | `--margin` 100 px; text column `col-span-8` |
| lg | ≥ 1024px | 12-column grid; `--margin` 60 px; slider 4-up; footer row lifts to `bottom: 40px`; progress rail visible (pointer devices) |
| md | ≥ 768px | Desktop type scale (`text-d-h*`) kicks in; `--margin` 40 px, `--gutter` 30 px; 6-column grid; slider 3-up; mobile header/footer panels hidden |
| sm | ≥ 640px | Container step only |
| base | < 768px | Mobile scale (max 39.06 px); 4-column grid; `--margin` 20 px, `--gutter` 10 px; slider 1.5-up; solid black header (61 px) and footer panels; swipe indicator replaces the rail; audio toggle + custom scrollbar hidden on touch |

### Touch Targets

- Hamburger 44 × 44; slider arrows ≥ 40 × 40 (12 px padding around 16–19 px glyphs); CTA 49 px tall; inputs 44 px; checkbox 24 px box with the full label clickable.
- `body.home { touch-action: none }` — the whole home is a gesture surface; everything interactive sits in the fixed HUD.

### Collapsing Strategy

- **Navigation** is a hamburger at every width; the panel goes full-width below md.
- **Lockup** stays bottom-left but collapses to one column and the 39 px scale; overline and title keep their two-tone pairing.
- **Paragraph / cards** move below the lockup; the slider shows 1.5 cards with `(100% − margin)/1.5` slide width.
- **Display type**: `{typography.display-xl}` 76.29 → 39.06 px, `{typography.display-md}` 48.83 → 39.06 px, `{typography.title-lg}` 25 → 20 px with line-height 1.8.
- **Inner pages**: 4-up tiles → 2-up → 1-up; 2-column accordion → 1; footer columns stack.

### Image Behavior

- The WebGL canvas is always full-viewport and fixed; the renderer scales its drawing buffer (≈ 0.92 × at 1440 × 900) rather than the layout.
- Blog media columns are 16:9 `object-cover`, moving below the text on mobile. Icons are fixed-size SVG/PNG inside the hexagon frame (`max-width: 208px`).

## Iteration Guide

1. Focus on ONE component at a time and reference it by its `components:` name (`chapter-lockup`, `button-primary`, `stat-tile`…).
2. Before adding a section, decide its *state in the chapter model*: lockup → statement → paragraph → cards → CTA. Portfolio sections (Transmissions, Index, Notes, Now) each get one lockup; projects become `feature-card`s.
3. Default body to `{typography.body}` (Roboto Condensed 16 / 400 / +0.32); use `{typography.title-md}` (20 / 500) for card titles and the one paragraph beside a statement.
4. Headings only from the Helvetica ladder; pick the token by *role* (overline = one step below its title), never by eyeballing a size.
5. Treat `{colors.primary}` as scarce: overline, statement, stat number, link hover. If you are about to fill something with it, use `{colors.inverse-canvas}` instead.
6. Variants live as separate entries (`button-primary-hover`, `text-input-focused`, `menu-link-current`); add new states the same way.
7. Depth decisions in order: nothing → `{colors.hairline}` → `{colors.hairline-strong}` → `{colors.surface-3}` + gradient edge → inverse block. Stop before shadows.
8. Motion is part of the spec: masked line reveal for headings, 0.3 s hover / 0.5 s slide with `cubic-bezier(.215,.61,.355,1)`, diagonal clip-path route wipe; add `prefers-reduced-motion` fallbacks that the source lacks.
9. Use `{token.refs}` everywhere — never inline hex in components or prose.

## Known Gaps

- **Fonts are proprietary** (Helvetica Neue, self-hosted). Substitutes named above; metrics in this file were measured with the real face.
- **Light mode**: not shipped by the source and not extracted.
- **Animation internals**: GSAP eases/durations were read from the minified bundle and from frames; the exact per-tween mapping inside the home timeline (which ease belongs to which element) is inferred. Lenis options beyond `smoothWheel:true` were not recovered.
- **WebGL look**: Bloom/LUT/Noise parameter values listed in the teardown are the library defaults found in the bundle, not confirmed per instance; the `.cube` LUT itself was not inspected.
- **Form states** beyond focus/error border were not captured (no submission attempted).
- **`spacer` block sizes** (`sm|md|lg|xxl`) on inner pages were not measured individually.
- **Hover states on the 3D object / cursor interactions** were not exercised (synthetic wheel only; no pointer movement over the scene).
- **Audio prompt UI** (the component mounted by `needsAudioTrigger`) was not rendered in headless capture and is undocumented.
- **Several inner routes 500 on the live site** (`/about-us/`, `/case-studies/`, `/ai-as-a-service/`, `/white-glove-services/`) so their layouts are unknown.
- **No `prefers-reduced-motion`, no success/warning/info colours, no mono font** exist on the source — the portfolio must add the first and may add the others.
