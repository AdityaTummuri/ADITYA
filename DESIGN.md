---
version: alpha
name: Aditya Tummuri, show the work
description: "A black canvas with a live WebGL scene behind it, and on top of it a site whose one idea is that every number can be pulled. A number is an underlined link; press it and a receipt shows the claim, the repository, the file, the commit and the exact quoted line, with one button that asks GitHub from the visitor's own browser. The scene, the teal and the two typefaces stay; the scene learns to get out of the way of text, and to move when you travel."

colors:
  primary: "#8faab2"            # glacier teal: statements, values, the underline of a number, the current menu item
  primary-soft: "#cfe0e5"       # hover lift of the accent, focus ring
  ink: "#ffffff"                # headings, body on solid panels
  ink-muted: "#c5cdd0"          # paragraphs (10.8:1 on the scrim worst case)
  ink-subtle: "#9aa5a9"         # dates, footer line, captions (6.9:1 on the scrim worst case)
  inverse-canvas: "#ffffff"     # the primary button
  inverse-ink: "#1a1a1a"        # label on the primary button
  canvas: "#000000"             # true black on every page
  surface-1: "#0a0d0e"          # the one solid panel: the receipt, the exhibit
  surface-2: "#12171a"          # quoted lines, code, inline `code`
  hairline: "#ffffff33"         # 20%: rules, panel borders
  hairline-strong: "#ffffff4d"  # 30%: menu dividers
  hairline-focus: "#ffffffcc"
  error: "#ef4444"
  # no longer used for text: ink-tertiary. Deleted: surface-3, edge-from, edge-to.

typography:
  display-xl:                   # unused on the home
    fontFamily: "Inter Tight"
    fontSize: 76.29
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: -0.04em
  display-lg:                   # home h1, room h1; text-wrap balance
    fontFamily: "Inter Tight"
    fontSize: "clamp(36px, 4.25vw, 61.04px)"
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: -0.04em
  display-md:                   # division headings, page h1s
    fontFamily: "Inter Tight"
    fontSize: "clamp(32px, 3.4vw, 48.83px)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: -0.035em
  display-sm:                   # work row titles, menu items (34px at 1440)
    fontFamily: "Inter Tight"
    fontSize: "clamp(25px, 2.7vw, 34px)"
    fontWeight: 400
    lineHeight: 1.15
    letterSpacing: -0.03em
  headline:                     # figures, contact links, receipt values
    fontFamily: "Inter Tight"
    fontSize: 28
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.025em
  title-lg:                     # story headings, statements
    fontFamily: "Inter Tight"
    fontSize: 24
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: -0.02em
  title-md:                     # the lead paragraph, 48ch
    fontFamily: "Inter Tight"
    fontSize: 22
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: -0.005em
  body:                         # 17px below 768px
    fontFamily: "Inter Tight"
    fontSize: 18
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body-sm:
    fontFamily: "Inter Tight"
    fontSize: 15
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  meta:                         # source paths, commits, quoted lines, axis and slider labels, the division rail
    fontFamily: "Roboto Condensed"
    fontSize: 15
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.01em
  # caption is deleted

rounded:
  xs: 4px
  md: 8px

spacing:                        # 10px root; the Tailwind theme names are spacing-xxs … spacing-2xl
  xxs: 8px
  xs: 16px
  sm: 24px
  md: 32px
  lg: 40px
  xl: 56px
  xxl: 80px
  gutter: 30px
  margin: 100px                 # side margin at >=1280px (20 / 40 / 60px below)
  header: 61px

components:
  num:                          # a number you can pull
    textColor: "inherit"        # underline 1px, offset 0.18em, colour {colors.primary}; 2px on hover (fine pointer); tabular figures
  receipt-slip:                 # popover dialog, 40rem beside the number; a bottom sheet below 768px
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 24px               # 1px hairline, no shadow, no blur
  receipt-quote:
    backgroundColor: "{colors.surface-2}"
    typography: "{typography.meta}"
  exhibit-panel:                # the only panel on a room page, nothing nested inside it
    backgroundColor: "{colors.surface-1}"
    rounded: "{rounded.md}"
    padding: 32px
  quiet:                        # scrim behind any text not on a solid panel
    backgroundColor: "#000000"  # 0.9 under the content box, feathered to 0 outside it (6.4rem x 4.8rem; 2rem x 2.4rem on phones)
  division-rail:                # right edge, >=1280px with a fine pointer: Start, Work, Contact / Exhibit, Story, Next
    typography: "{typography.meta}"
    textColor: "{colors.ink-muted}"
  button-primary:               # white block, drawn arrow, press scale 0.97 in 140ms
    backgroundColor: "{colors.inverse-canvas}"
    textColor: "{colors.inverse-ink}"
    rounded: "{rounded.md}"
    padding: 24px 32px
  text-link-arrow:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
  menu-link:                    # display-sm, a hairline beneath each item
    textColor: "{colors.ink}"
    typography: "{typography.display-sm}"
  menu-link-current:            # teal, full opacity, "(you are here)" for screen readers
    textColor: "{colors.primary}"
    typography: "{typography.display-sm}"
  footer-row:                   # last thing on every page, solid canvas
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-subtle}"
    typography: "{typography.body-sm}"
  # removed with this redesign: footer-hud, progress-rail, scroll-hint, stat-tile, chapter-lockup, feature-card, banner-card-gradient
---

## Overview

The site argues one thing: **every number can be pulled.** A number is never plain text. It is an underlined link (`num`), and pressing it opens a receipt with the claim, the repository, the file, the commit and the exact quoted line. The receipt has one button, *Check it now*: the visitor's own browser asks GitHub for the file and reports the line it found the sentence on, or says it could not. `/receipts` lists every number on the site and can check them all in one press.

That removes decoration. There are no tiles, no pills, no section numbers and no eyebrow labels. The canvas is true black. The scene (WebGL with a CSS fallback, a static version on phones) stays, but it yields: a quiet zone in the shader dims it under the text column and a feathered black scrim sits behind every block of text.

## Colour

One accent, `primary`, used as text (statements, receipt values, the underline of every number, the current menu item). Buttons are white. The only panels are `surface-1` (the receipt and the exhibit). Body text is `ink-muted` and secondary text `ink-subtle`; both are tuned so they keep 4.5:1 against the brightest pixel the scene can put behind the scrim.

## Typography

Inter Tight for everything that is read, weights 400 and 500. Roboto Condensed only where width is scarce: source paths, commits, quoted lines, axis and slider labels, the division rail (weights 400 and 500). Sentence case everywhere, first person, no em dashes or en dashes in prose. Prose measure 62ch, lead 48ch. Headings take 1.6rem below and at least 4rem above. `code` is Roboto Condensed 500 on `surface-2`. Browser surfaces are themed: selection is teal on black, scrollbars `#455d64` on black, focus is a 2px `primary-soft` outline at a 4px offset.

## Legibility

Three layers, strongest first. (1) `.quiet`: a black layer at 0.9 behind every block of text that is not on a solid panel, feathered entirely outside the content box, so every glyph sits on the full 0.9. Against the brightest possible scene pixel white becomes `#1a1a1a`, which keeps white text at 17.4:1, `ink-muted` at 10.8:1 and `ink-subtle` at 6.9:1. (2) A shader quiet zone (`uYield`) that dims the scene under the text column for each look. (3) Calmer post: bloom 0.9 at threshold 0.6, grain 0.035. Nothing behind text is ever blurred. The legibility specs measure every text node in the viewport against the pixels behind it, on the WebGL scene and on the CSS fallback, and fail under 4.5:1.

## Motion

One entrance (the home h1), one travel motion, no scroll reveals. Curves: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`, `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)`. Pressable things scale to 0.97 for 140ms. Route changes use view transitions for the page content and the shared room title (the root layer holding the canvas is never captured), and the scene stretches and speeds up in the direction of travel. Reduced motion: a still scene, no travel, no view transitions, no previews, no stagger.

## Layout

Container padding is `--margin` (20 / 40 / 60 / 100px), 12 columns with a 30px gutter. The home is three divisions of exactly one screen each on desktop (Start, Work, Contact), never pinned. A room has `#exhibit` (left columns on the scrim, the exhibit on the one solid panel) and `#story` (four parts in a 2x2 grid). The archive is one line and one number per project. Heights at 1440x900: home at most 3.05 screens, rooms and archive at most 2.6, about at most 1.4.

## Components

- **Receipt slip** a popover: light dismiss, Escape and focus return from the browser, placed beside the number or as a bottom sheet on phones. A check says what it found in a `role="status"` line two lines tall, so nothing jumps.
- **Exhibits** one per room, each from real data or a direct port of real code: a four-candidate ladder through QEDCode's eight checks, the FracSST-Mamba confusion matrix, the NETRA-UGV camera frame against the model's output, and Kavach-UPI's two switches and one rule. They render a sensible default without JavaScript.
- **Division rail** text links on the right edge on wide screens with a fine pointer.
- **Menu** a right-hand black panel at 400ms with no item delays; the current item is teal.

## Do and don't

Do keep a number a link. Do put any text that is not on a solid panel inside `.quiet`. Do give a status message `role="status"` and never rely on colour alone. Don't print a number that cannot be reproduced from a public source. Don't blur anything behind text. Don't add a tile, a pill, a section number or an eyebrow.
