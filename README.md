# Aditya Tummuri

Portfolio site. Its one idea is that every number on it can be pulled: a number is an underlined link to a receipt with the repository, file, commit and exact quoted line, and a button that asks GitHub from the visitor's browser. Design source: `DESIGN.md`; copy source: `content/*.ts`.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm run start
npm run typecheck && npm run lint && npm test && npm run verify:receipts && npm run e2e
```

## Stats and receipts

- `npm run stats` refreshes the account figures in `content/github.json` (public repositories, originals, forks, stars) from GitHub's public API. It needs no token and writes nothing if GitHub does not answer 200. The `profile` block (contribution calendar) cannot be read from the API: update it by hand from the profile page, with its date.
- `npm run verify:receipts` fetches every quoted receipt's file at its pinned commit (`content/commits.ts`) and looks for the quote with whitespace ignored. It exits 1 on any miss. Run it after editing `content/receipts.ts`.
- Copy never holds a typed figure: write `{receipt-id}` and add the receipt. Unit tests fail on a digit in copy, an unknown id, or a receipt nobody uses.

## Deploy notes

- Set `NEXT_PUBLIC_SITE_URL` (for example `https://your-domain`) in the deployment so the sitemap, robots and social image use the real origin.
- Design tokens are in `app/globals.css` (`@theme`), taken from `DESIGN.md`.
- Fonts (Inter Tight, Roboto Condensed) are self-hosted by `next/font`.
- The only third party the page talks to is GitHub, and only after a visitor presses a check.
