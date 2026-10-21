# Aditya Tummuri — The Dreaming Machine

Portfolio site in the 8bit.ai visual language. Design source: `DESIGN.md`; content source: `information.md`; plan: `docs/superpowers/plans/2026-10-22-portfolio.md`.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm run start
npm run typecheck && npm run lint && npm test && npm run e2e
```

## Deploy notes

- Set `NEXT_PUBLIC_SITE_URL` (for example `https://your-domain`) in the deployment so the sitemap, robots and social image use the real origin.
- Content lives in `content/*.ts` (typed, copied from `information.md`). Edit there; pages regenerate at build.
- Design tokens are in `app/globals.css` (`@theme`), taken from `DESIGN.md`.
- Fonts (Inter Tight, Roboto Condensed) are self-hosted by `next/font`; swap Inter Tight for a licensed grotesk by changing `app/layout.tsx`.
