# MACCA — implemented app

This repo now contains a high-fidelity implementation of the MACCA designs
(see the original Claude Design handoff notes below).

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS. The
map is a custom stylized SVG component (MapLibre-swappable later).

**Data — single source of truth:** `src/data/macca.collection.json` (72 works,
locations, routes, flagship content, asset-rights register, verification queue).
Everything is derived from it via `lib/collection.ts` — no content is invented.
The seed has no descriptions, dimensions, GPS, images or artist bios, so those
surface as editorial fallback states ("Testo d'archivio in preparazione",
"Posizione in verifica", "Archivio immagini in preparazione", "Ulteriori
informazioni in arrivo"). `map_status`, `rights_status`, `data_confidence` and
`access_type` are respected throughout; `/cantiere` surfaces the rights register
and verification queue.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (84 static pages)
```

**Layout**
- `app/` — routes: `/` home · `/esplora` map · `/collezione` · `/opere` feed ·
  `/opere/[slug]` artwork · `/artisti/[slug]` · `/luoghi/[slug]` · `/percorsi`,
  `/percorsi/[slug]`, `/percorsi/[slug]/avvia` (active route), `/percorsi/crea`
  (interactive route builder) · `/timeline` · `/visita` · `/info` · `/qr/[slug]`
  (QR quick view) · `/sistema` (design system) · `/salvati` · `/cerca`.
- `components/` — header/footer, stylized map + marker family, access/confidence
  badges, work/route cards, bottom sheet, language switch, save button.
- `lib/` — `works`, `artists`, `routes-data`, `locations`, `timeline`, `constants`, `types`.

Italian-first with a working IT/EN switch. Location-honesty states (exact / site
/ area / verifying) and access states are first-class throughout. No fabricated
coordinates, dimensions or image-rights claims — unverified fields read "in verifica".

---

# CODING AGENTS: READ THIS FIRST

This is a **handoff bundle** from Claude Design (claude.ai/design).

A user mocked up designs in HTML/CSS/JS using an AI design tool, then exported this bundle so a coding agent can implement the designs for real.

## What you should do — IMPORTANT

**Read the chat transcripts first.** There are 1 chat transcript(s) in `chats/`. The transcripts show the full back-and-forth between the user and the design assistant — they tell you **what the user actually wants** and **where they landed** after iterating. Don't skip them. The final HTML files are the output, but the chat is where the intent lives.

**Read `project/MACCA Wireframes.dc.html` in full.** The user had this file open when they triggered the handoff, so it's almost certainly the primary design they want built. Read it top to bottom — don't skim. Then **follow its imports**: open every file it pulls in (shared components, CSS, scripts) so you understand how the pieces fit together before you start implementing.

**If anything is ambiguous, ask the user to confirm before you start implementing.** It's much cheaper to clarify scope up front than to build the wrong thing.

## About the design files

The design medium is **HTML/CSS/JS** — these are prototypes, not production code. Your job is to **recreate them pixel-perfectly** in whatever technology makes sense for the target codebase (React, Vue, native, whatever fits). Match the visual output; don't copy the prototype's internal structure unless it happens to fit.

**Don't render these files in a browser or take screenshots unless the user asks you to.** Everything you need — dimensions, colors, layout rules — is spelled out in the source. Read the HTML and CSS directly; a screenshot won't tell you anything they don't.

## Bundle contents

- `README.md` — this file
- `chats/` — conversation transcripts (read these!)
- `project/` — the `MACCA design master brief` project files (HTML prototypes, assets, components)
