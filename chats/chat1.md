# On-site visitor guide design

_Started 2026-06-28 14:02 UTC_

---

## User

<system-info comment="Only acknowledge these if relevant">
Project title is now "Untitled"
What `list_files` on the project root returns right now (dotfiles, if any, are not shown here):
📁 uploads
Current date is now June 28, 2026
</system-info>

<default aesthetic_system_instructions>
The user has not attached a design system. If they have ALSO not attached references or art direction, and the project is empty, you must ASK the user what visual aesthetic they want. Use the questions_v2 tool to ask about preferred vibe, audience, colors, type, mood, etc. Do NOT just pick your own visual aesthetic without getting the user's aesthetic input -- this is how you get slop!

Once answered, use this guidance when creating designs:
- Choose a type pairing from web-safe set or Google Fonts. Helvetica is a good choice. Avoid hard-to-read or overly stylized fonts. Use 1-3 fonts only.
- Foreground and background: choose a color tone (warm, cool, neutral, something in-between). Use subtly-toned whites and blacks; avoid saturations above 0.02 for whites.
- Accents: choose 0-2 additional accent colors using oklch. All accents should share same chroma and lightness; vary hue.
- NEVER write out an SVG yourself that's more complicated than a square, circle, diamond, etc.
- For imagery, never hand-draw SVGs; use subtly-striped SVG placeholders instead with monospace explainers for what should be dropped there (e.g. “product shot”)

CRITICAL: ignore default aesthetic entirely if given other aesthetic instructions like reference images, design systems or guidance, or if there are files in the project already.
</default aesthetic_system_instructions>

<attached_files>
- uploads/MACCA_CLAUDE_DESIGN_MASTER_BRIEF.md
</attached_files>

<!-- The user explicitly selected the following skills for this project, as attachments to their message. These are not optional context — they define how you work. Use them. -->
<attached-skill name="Design Components">
This project uses Design Components: every design is a single streaming `Name.dc.html` file. The full authoring spec is in your system prompt under "Writing code — Design Components" — follow it. Author and edit `.dc.html` content with the `dc_write`, `dc_html_str_replace`, `dc_js_str_replace`, and `dc_set_props` tools (not `write_file`; `str_replace_edit` works but won't stream); template edits stream into the live preview as you type.
</attached-skill>

<attached-skill name="Wireframe">
Help the user explore design ideas quickly. Interview them, then generate multiple rough wireframes to map out the design space before committing to a direction. Prioritize breadth over polish: show 3-5 distinctly different approaches for each idea. Use simple shapes, placeholder text, and minimal color to keep the focus on structure and flow. Use a sketchy vibe -- handwritten but readable fonts; b&w with some color; low-fi and simple. Lay the wireframes out on a pannable canvas:

Use a pannable canvas to present multiple design options, explorations, or screens side-by-side — each option lives in its own absolutely-positioned frame on an infinite gray surface the user pans and zooms. Use this built-in canvas mode instead of rolling your own pan/zoom, unless the user explicitly asks you to.

**What the host recognizes:**
- `<meta name="design_doc_mode" content="canvas">` inside `<helmet>` — arms host pan/zoom, a gray backdrop, and `position:relative` on the root so your absolutely-positioned frames anchor to it. (Either `content=` or `value=` works.)
- `data-drags-parent="N"` on any element — in edit mode, grabbing that element drags its Nth ancestor instead (capped at the template boundary). Put it on a frame's label with `N=1` so dragging the label moves the whole frame.
- The (0,0) origin — frames at negative `left`/`top` are outside the exportable area (edit mode marks that region with a diagonal hatch). Keep every frame's `left` and `top` ≥ 0.

**How to write it:** each frame is a `<div>` that is a **direct child of the root** — right after `</helmet>`, NOT wrapped in any container. Give it `position:absolute` with explicit pixel `left`/`top`/`width`. Inside: a small label positioned just above (with `data-drags-parent="1"`) and a white card with a slight shadow holding the design. Lay frames on a loose grid with generous gaps (~80px). Do NOT add your own wrapper, background, scroll container, zoom controls, or centering — the host owns all of that.

```html
<helmet><meta name="design_doc_mode" content="canvas">…</helmet>
<div style="position:absolute;left:80px;top:80px;width:360px">
<div data-drags-parent="1" style="position:absolute;top:-22px;font:500 11px system-ui;color:rgba(60,50,40,.7)">Variant A</div>
<div style="background:#fff;border-radius:2px;box-shadow:0 1px 3px rgba(0,0,0,.08);padding:16px">…design…</div>
</div>
<div style="position:absolute;left:520px;top:80px;width:360px">…Variant B…</div>
```

Section headers and post-it annotations are just more absolutely-positioned root children: a section header is a larger text label at a group's top-left; a post-it is a small sticky-note card (`background:#fef4a8;padding:12px;font:12px/1.4 system-ui;box-shadow:0 1px 3px rgba(0,0,0,.08);transform:rotate(-1deg)`). Neither needs `data-drags-parent` — they drag as themselves.
</attached-skill>


<system-reminder>Auto-injected reminder (ignore if not relevant): do not recreate copyrighted or branded UI unless the user's email domain matches that company. Create original designs instead.</system-reminder>

## Assistant

_[tool: read_file]_

This is a rich, detailed brief. Before I start, a few questions so I build the right thing at the right fidelity.

_[tool: questions_v2]_

## User

Questions answered:
- fidelity: Low-fi wireframes first — explore structure & flow across many screens
- priority_screens: Collection index + filters, Artwork detail page, Explore map — desktop split-screen, Explore map — mobile full-screen + bottom sheet, Home (desktop), QR quick view (on-site mobile), Routes index + route detail, Timeline, Visit page, Decide for me
- variations: No — pick one strong direction from the brief and run with it
- device: Mobile-first — the on-site visitor guide is the priority
- map_approach: Stylized abstract map (custom topographic/vector look, placeholder geography)
- language: Italian-first (as brief specifies), with visible IT/EN switch
- imagery: Abstract textured fills evoking stone/landscape, no literal placeholders

## Assistant

This is a meaty brief. I'll build a single pannable wireframe canvas — Italian-first, mobile flow as the spine (your priority), then desktop editorial screens, plus a small system sheet (markers, access badges, tokens). Low-fi sketch vocabulary throughout.

_[tool: update_todos]_

I'll build incrementally so the canvas streams cleanly. Starting with the scaffold + mobile Home.

_[tool: dc_write]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

Let me check progress visually before continuing.

_[tool: show_html]_

_[tool: show_html]_

The sketch vocabulary is reading well — handwritten labels, hatch placeholders, marker system. Continuing with B4 and the rest.

_[tool: dc_html_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: update_todos]_

_[tool: ready_for_verification]_

Done. The wireframe canvas is built — pan/zoom around it.

**01 · Mobile (your priority)** — Home, Map (default + selected work with bottom sheet), Artwork page, QR quick-view, active Route, and the Collection filter drawer. The map-first logic, draggable bottom sheet, and 56px+ QR tap targets are all expressed.

**02 · Desktop** — Home (full editorial scroll), Explore split-screen, Collection grid, Artwork detail, Routes index, Route detail, Timeline (density grows over the decades), and Visit (free vs. booking-required clearly split).

**03 · System** — marker family (4 honesty states, no false pins), access badges, and color/type tokens.

Italian-first throughout, stylized topographic map, abstract textured placeholders, IT/EN switch visible everywhere. Sticky-note annotations call out the key principles.

Next step when you're ready: pick the direction and I'll take 2–3 key screens (Home, Map, Artwork) into high fidelity.

## User

add an interface to select or deselect the opere. then from there you can generate a route around peccioli customised for the selection

## Assistant

Great idea — I'll add an interactive route builder: tap opere to select/deselect, then "Genera percorso" computes an optimised walking order around Peccioli and draws it on the map live.

First the logic:

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

Now the interactive frame on the canvas:

_[tool: dc_html_str_replace]_

_[tool: eval_js]_

_[tool: show_html]_

_[tool: eval_js]_

_[tool: eval_js]_

Everything renders. Let me test the generate interaction:

_[tool: eval_js]_

_[tool: eval_js]_

Works perfectly — the route line threads start→selected works in optimised order with numbered stops and live stats. Completing verification.

_[tool: update_todos]_

_[tool: update_todos]_

_[tool: ready_for_verification]_

Added **section 04 · Crea il tuo percorso** — an interactive route builder at the bottom of the canvas:

- Tap any opera in the Peccioli list to select/deselect it (4 come preselected).
- Hit **Genera percorso** and it computes an optimised walking order (nearest-neighbour from the parcheggio) and draws the dashed route line with numbered stops on the map.
- A live stats bar shows tappe / tempo a piedi / distanza, plus the ordered stop list and Salva / Avvia actions.
- Changing the selection clears the route so it always reflects the current picks.

Two sticky notes capture the mobile pattern (bottom-sheet checklist → full-screen map) and the honesty rule (works without exact positions stay selectable but flagged, no false precision).

## User

put aggiungi e rimuovi to a list of the of the destinations on the percorse attivo

## Assistant

_[tool: grep]_

_[tool: read_file]_

_[tool: str_replace_edit]_

Added to the **A6 · Percorso attivo** stop list: a "Prossime tappe" subheader with a **＋ Aggiungi** action, a **−** rimuovi button on each upcoming destination, and a dashed **＋ Aggiungi una tappa al percorso** row at the bottom — so the active route's destinations can be edited on the fly.

## User

make a catalog of the artwork with large pictures like a social media feed. put a cta for "esplora le opere" on home, also this takes you to the artwork feed.

## Assistant

I'll add a social-feed artwork catalog plus the "Esplora le opere" CTA on home. First let me locate the home hero CTAs.

_[tool: grep]_

_[tool: read_file]_

Now I'll add the CTAs on both homes and build the feed frames.

_[tool: str_replace_edit]_

Now the mobile social feed (A8) and a desktop catalog feed, appended to the canvas:

_[tool: dc_html_str_replace]_

_[tool: ready_for_verification]_

Done. Added:

- **Esplora le opere** CTA on both the mobile home (A1) and desktop home (B1) heroes — it routes into the artwork feed.
- **A8 · Feed opere** (mobile) — a social-style vertical feed with full-bleed image cards, title/artist overlaid on the image, access badge, and like / share / map actions.
- **05 · Catalogo — feed opere → D2** (desktop) — a large-image masonry feed with a Feed / Griglia / Mappa view toggle and type filters.

A sticky note marks the CTA→feed link, and the feed keeps the honesty rule (works without photos fall back to a text card, e.g. VOCI).

