# Populating MACCA with real content

The prototype is data-driven. To replace the editorial fallback states
("Testo d'archivio in preparazione", "Archivio immagini in preparazione", …)
with real content, you edit **two** things — no code changes needed.

> Honesty rule: only add **verified** content. Anything you omit keeps its
> elegant fallback. Never publish a false coordinate, a fake credit, or an image
> whose reproduction rights aren't cleared.

---

## 1. Pictures

There are two ways to add an image for a work (`work_id` like `macca-010`):

**A. Drop a file (easiest)** — put it in `public/images/works/`:
```
public/images/works/macca-010.jpg        ← becomes the hero image
public/images/works/macca-010__2.jpg     ← extra gallery image (note the "__2")
public/images/works/macca-010__3.webp
```
Accepted: `.jpg .jpeg .png .webp .avif .svg`. Filenames must start with the
`work_id`; additional images use a `__N` suffix. The manifest is rebuilt
automatically on `npm run dev` / `npm run build` (or run `npm run content`).

**B. Reference it in the overlay (for credits / remote URLs)** — see below. Use
this when you need a credit line, source link, licence, or a hosted URL.

### Demonstration tiles
The repo ships labelled **demo tiles** (`public/images/works/<work_id>.svg`,
stamped "immagine dimostrativa · sostituire") so the demo looks populated. They
are NOT the artworks.
- Add a real `macca-010.jpg` → it automatically becomes the hero (the `.jpg`
  sorts before the `.svg`); delete `macca-010.svg` to drop the demo tile.
- Remove **all** demo tiles at once: `npm run demo:clear`.
- Regenerate them: `npm run demo:images`.

### Image rights
Each image shows its credit + a "diritti in verifica" badge unless its `license`
is openly licensed (CC/public-domain). The rights register and verification queue
live at **/cantiere**.

---

## 2. Descriptions, dimensions, coordinates — the content overlay

Edit `src/data/macca.content.json`. Add entries under `"works"`, keyed by
`work_id`. Every field is optional:

```json
{
  "works": {
    "macca-010": {
      "description_it": "Testo curatoriale verificato (60–120 parole).",
      "description_en": "Verified English text (optional).",
      "materials": "Acciaio verniciato",
      "dimensions": "300 × 120 × 120 cm",
      "coordinates": { "lat": 43.5481, "lon": 10.7203, "confidence": "exact" },
      "images": [
        {
          "src": "/images/works/macca-010.jpg",
          "credit": "© Fondazione Peccioliper · ph. Nome",
          "source": "https://www.fondarte.peccioli.net/opere/progetti.php?idView=6",
          "license": "Tutti i diritti riservati · uso prototipo",
          "caption": "Welcome to Peccioli, veduta d'insieme"
        }
      ]
    }
  }
}
```

What each field upgrades in the UI:
| field | effect |
|---|---|
| `description_it` | replaces the "Testo d'archivio in preparazione" body on the artwork page |
| `materials`, `dimensions` | fill the corresponding Scheda rows (otherwise fallback) |
| `coordinates` with `confidence: "exact"` or `"verified"` | the map marker becomes a precise **exact** pin (otherwise it stays approximate/site/area, honestly) |
| `images` | hero + gallery, with credit line and rights badge |

---

## 3. Locations & routes

`locations` and `routes` are read from `src/data/macca.collection.json`. To add a
verified coordinate or fix a route, edit that file directly (it's the seed /
single source of truth). Route `stops` are name strings; the app matches them to
works by title automatically.

---

## Quick workflow
```bash
# 1. add images
cp my-photo.jpg public/images/works/macca-010.jpg
# 2. add text/coords in src/data/macca.content.json
# 3. preview
npm run dev        # rebuilds the image manifest first
```
