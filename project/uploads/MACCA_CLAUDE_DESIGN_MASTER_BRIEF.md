# MACCA — Claude Design Master Brief
## Website + map-first visitor web app prototype

**Use this document as the single design brief for MACCA.** Design a complete, high-fidelity, responsive website and mobile web-app prototype. The result must feel like a contemporary cultural institution and a beautifully usable territorial guide — not a municipal tourism site, a generic museum template, or a technology dashboard.

---

## 0. What MACCA is

**MACCA — Museo d’Arte Contemporanea a Cielo Aperto** is a distributed contemporary-art museum across **Peccioli, Tuscany**, its historic centre, surrounding hamlets, landscape, public buildings, streets, churches, viewpoints and infrastructure.

The collection has developed through commissions and public-art projects over more than three decades. It includes sculpture, architecture, mural and colour interventions, light works, sound/voice works, installations, building-scale gestures and landscape-based commissions.

The core idea:

> **MACCA is not contained in a building. It is experienced across a territory.**

The digital platform must make the territory legible as a collection. It has three roles at once:

1. **Museum website** — identity, history, collection, artists, public programme, visits.
2. **Visitor guide** — map, routes, directions, nearby works, access information and QR-linked pages.
3. **Living archive** — a long-term collection system connecting works, artists, projects, places, media and sources.

---

## 1. The design task

Create an **editorial, map-led, mobile-first digital experience** for a cultural institution whose collection is distributed across real places.

Design it as a polished prototype suitable for:

- stakeholder presentation;
- public beta testing with visitors;
- translation into a real Next.js / MapLibre / headless-CMS product;
- future Italian / English rollout;
- future QR-code artwork pages and route use on location.

Do **not** design this as an ecommerce site, ticketing platform, social network, AI product or conventional “museum brochure” website.

The experience should express:

- discovery;
- movement;
- landscape;
- civic imagination;
- accumulated history;
- contemporary art without intimidation;
- precision and trust in visitor information.

---

## 2. Design north star

### The intended feeling

A visitor opens MACCA on their phone in Peccioli and immediately understands:

- *I am inside a museum, but it is spread throughout this place.*
- *I can begin from where I am, choose a route, or follow curiosity.*
- *Each work has a story and a relationship to its site.*
- *The design is serious, contemporary and generous — not academic, not touristy.*

### The central interface idea

**The territory is the interface.**

The map is not an auxiliary page. It is a recurring organising principle across homepage, collection, work pages, routes and visit planning.

---

## 3. Core product principles

1. **Map first, not menu first.**
   The visitor should always be able to return to the territory quickly.

2. **Editorial, not touristy.**
   Present artworks as cultural objects with clear context, not as generic attractions.

3. **Visitor clarity is part of the aesthetic.**
   Access state, opening conditions, mobility notes and route suitability must be effortless to read.

4. **No false certainty.**
   Some locations are exact public points; some are building/site anchors; some are route-based or need field verification. The interface must express that honestly.

5. **Images are important, but place is equally important.**
   A work must never feel detached from its street, architecture, landscape or local context.

6. **Mobile is not a smaller desktop.**
   The mobile experience is the primary visitor guide, especially after scanning a QR code in the territory.

7. **Bilingual from the start.**
   Default prototype language: Italian. The UI must visibly support an `IT / EN` switch without changing hierarchy or breaking layouts.

8. **A museum that keeps growing.**
   New commissions, temporary changes, access alerts and new routes must feel native to the design system.

---

## 4. Audience and key jobs to be done

### A. First-time visitor to Peccioli
**Needs:** understand what MACCA is, see a simple route, avoid planning friction.

**Primary actions:**
- explore map;
- choose “1 hour”, “half-day”, “historic centre” or “family-friendly” route;
- begin walking;
- see basic access conditions.

### B. Visitor already on site
**Needs:** discover what is near them and understand a work in under one minute.

**Primary actions:**
- open a QR-linked work page;
- see “you are here” or nearest works;
- listen/read a short interpretation;
- start directions or continue to nearby works.

### C. Art-interested visitor / researcher
**Needs:** browse by artist, year, medium, project phase, location and commission history.

**Primary actions:**
- filter collection;
- browse artists;
- use timeline;
- open long-form work context and sources.

### D. Local resident / repeat visitor
**Needs:** discover what changed, revisit familiar works, see new commissions or events.

**Primary actions:**
- view “new in the collection”;
- save works or routes locally;
- explore new seasonal/editorial content.

### E. Schools / groups / cultural professionals
**Needs:** understand group access, booked sites, teaching context and collection history.

**Primary actions:**
- view planning information;
- see accessibility and booking requirements;
- find selected thematic routes.

---

## 5. Existing content reality and honesty rules

The research pack currently covers a working collection of approximately **72 works**, with an official collection history running from the early 1990s to the present. The public-source research includes the collection index, project phases, location labels, route logic, official work-page sources and a staged geolocation audit.

There are approximately **20 flagship works** suitable for richer prototype storytelling. The complete collection should still be visible in a lighter archive state.

### Critical map rule

Do **not** draw a precise pin unless the location is explicitly verified.

Use four visible location states:

| State | UI treatment | Meaning |
|---|---|---|
| `Exact artwork location` | precise point marker | verified artwork position and safe visitor approach |
| `Site / entrance` | site anchor marker | work is inside a building, church, controlled site or complex area |
| `Area cluster` | clustered marker or shaded area | multiple works / a route / incomplete precise data |
| `Location being verified` | no false pin; textual area label | do not imply exact physical position |

### Important content constraints

- Do not fabricate exact coordinates, dimensions, artist biographies, commissioning dates, opening hours, ticketing rules or image licences.
- Do not use public web imagery as if it were cleared for production publication.
- Where real artwork photography is unavailable, use neutral image placeholders, approved low-risk image references, cropped abstract textures or layout placeholders labelled internally.
- In prototype work pages, factual copy should be concise and clearly modular so it can later be replaced by curated text.

---

## 6. Brand and art direction

### Desired visual personality

MACCA should feel like a cross between:

- a high-quality contemporary art publication;
- a civic/architectural wayfinding system;
- a field notebook for a place;
- a refined digital map interface;
- a collection archive that is calm, intelligent and alive.

### Avoid

- postcard Tuscany;
- rustic/folk visual clichés;
- beige luxury hotel styling;
- generic “museum black-and-white minimalism” without territorial character;
- over-saturated tourism imagery;
- playful childish icons;
- dense admin-dashboard UI;
- fake hand-drawn maps that are hard to navigate;
- excessive glassmorphism, gradients, floating cards or “startup” visual tropes.

### Recommended visual language

- **Typography:** a precise contemporary grotesk for all interface and data; a warm, editorial serif only for selected titles, quotations and long-form moments.
- **Tone:** legible, substantial, restrained, inquisitive, site-aware.
- **Grid:** strong, modular editorial grid; large image/territory moments; disciplined alignment; generous whitespace.
- **Material cues:** stone, sun-bleached surfaces, civic signage, shadows, road lines, topographic patterns, layered histories, bold contemporary interventions.
- **Photography:** large, cinematic crops; show work + environment; never use images merely as decorative thumbnails.
- **Maps:** clean vector map appearance with custom MACCA markers and low visual noise.

### Starting palette — use as a flexible prototype direction

| Token | Suggested use | Colour direction |
|---|---|---|
| `Stone` | default background | warm limestone / off-white |
| `Ink` | primary text and map linework | near-black charcoal |
| `Cypress` | map, navigation, institutional anchor | deep muted green |
| `Terracotta signal` | key CTA / selected route / important state | mineral red-orange |
| `Sky haze` | secondary surfaces / water / distance | pale blue-grey |
| `Sun` | small alert or discovery accent only | muted yellow-gold |
| `Night` | night-view modules and inverse surfaces | deep blue-black |

Do not use every colour at once. The base should remain quiet: stone, ink, white space and imagery. Use the accent colours structurally.

### Typography behaviour

- Work title: elegant, spacious, editorial; may use serif.
- Artist name / year / medium: clean sans-serif metadata.
- Navigation, filters, map labels and practical information: assertive sans-serif.
- Long reading: highly readable, not overly narrow.
- Avoid all-caps body copy. Small all-caps may be used for overlines, map labels and categorisation.

---

## 7. Information architecture

### Primary navigation

- **Esplora / Explore**
- **Collezione / Collection**
- **Percorsi / Routes**
- **Timeline**
- **Visita / Visit**
- **MACCA** (About)

Persistent utility actions:

- **Open map** — visually prominent on all pages;
- **Search**;
- **IT / EN**;
- **Saved** (local-only, no account required);
- **Menu** on mobile.

### Required routes/pages

| Route | Page | Role |
|---|---|---|
| `/` | Home | first impression, territorial statement, pathways into experience |
| `/explore` | Explore map | primary map and discovery interface |
| `/collection` | Collection | browse all works, filters and editorial cards |
| `/works/[slug]` | Artwork page | work story, facts, location, access and related content |
| `/artists/[slug]` | Artist page | bio, practice, MACCA works and related project links |
| `/routes` | Routes index | curated journeys by time, place, theme and access |
| `/routes/[slug]` | Route detail | ordered stops, map, timing and practical information |
| `/timeline` | Timeline | thirty-plus years of commissions and projects |
| `/locations/[slug]` | Location / site page | hamlet, building or site story plus associated works |
| `/visit` | Visit MACCA | access, arriving, mobility, booking, safety and practical notes |
| `/about` | About MACCA | mission, history and the distributed museum model |
| `/search` | Search | fast text and faceted search |
| `/saved` | Saved | local collection of works and routes |
| `/qr/[work-id]` | QR quick view | ultra-fast on-site version of work page |

---

## 8. The content model the design must support

Do not create isolated static pages. Every relevant screen should visibly anticipate relationships between these content types:

- **Work**
- **Artist**
- **Project / commission phase**
- **Location / site**
- **Route**
- **Media asset**
- **Access / visitor conditions**
- **Source / credits / rights record**
- **Timeline event**

### Work record — visible fields

Every artwork page must be able to present:

- title;
- artist or artist collective;
- year / date range;
- category or medium;
- short interpretive summary;
- long description / curatorial context;
- project or commission phase;
- location state;
- address or area;
- access state;
- practical visit note;
- map / directions;
- image or media gallery;
- credit line;
- related works;
- related route(s);
- related artist page;
- sources / archive reference (visually quiet, lower page).

### Artist record — visible fields

- artist name;
- concise biography;
- practice/themes;
- MACCA works;
- works on map;
- relevant project phase;
- external authoritative link(s), only where provided;
- image credit/rights state if portrait is used.

### Location / site record — visible fields

- place name;
- territory/hamlet;
- visual context;
- site story;
- all works at that place;
- arrival guidance;
- parking / walking / access notes;
- booking or opening conditions;
- route connections.

---

## 9. Prototype content examples

Use the following works as recognisable featured examples across the interface. Do not invent missing facts. Where a card needs data not in this brief, use credible placeholder formatting such as `Materiali e dimensioni in verifica` rather than false specifics.

### Suggested flagship works

| Work | Artist | Year | Area | Story lens |
|---|---|---:|---|---|
| **Colonna che scende** | Hidetoshi Nagasawa | 1992 | Peccioli | early commission / sculpture and gravity |
| **Welcome to Peccioli** | Giorgetto Giugiaro | 1999 | Peccioli | arrival as artwork |
| **Fessura e Contravvento II** | Federico De Leonardis | 2000 | Peccioli | urban threshold / site intervention |
| **Presenze** | Naturaliter Snc | 2011 | Peccioli / Legoli | multi-site encounter |
| **Azzurro** | Vittorio Corsini | 2017 | Peccioli | civic colour / visual interruption |
| **VOCI** | Vittorio Corsini + writers | 2018–2019 | multiple sites | distributed narrative / route work |
| **SolidSky** | Alicja Kwade | 2019 | Ghizzano | sculpture and perception |
| **Via di Mezzo** | David Tremlett | 2019 | Ghizzano | colour as architecture |
| **Elevatio corpus** | Patrick Tuttofuoco | 2019 | Ghizzano | body / verticality / village context |
| **Il silenzio delle piante** | Adrian Paci | 2019 | Peccioli | landscape / contemplation |
| **Endless Sunset** | Patrick Tuttofuoco | 2020 | Peccioli | horizon / public space |
| **Photo-souvenirs A 45°, 5 colori + nero e bianco** | Daniel Buren | 2021 | Peccioli | pattern / viewing / architecture |
| **Rotating Mirror IX** | Jeppe Hein | 2021 | Peccioli | movement / reflection |
| **Chiacchiere** | Vittorio Corsini | 2023 | Peccioli | social space / conversation |
| **We Rise by Lifting Others** | Marinella Senatore | 2023 | Le Serre | collective energy / civic language |
| **Benvenuti in città** | Vittorio Corsini | 2023 | Peccioli | welcome / threshold |
| **Dance First Think Later** | Marinella Senatore | 2024 | Le Serre | light / night experience |
| **Untitled / Germoglio** | David Tremlett / Remo Salvadori | 2024 | Legoli / Belvedere | art, infrastructure and controlled access |
| **Breath** | Emiliano Ponzi + Dario Spinelli | 2026* | Peccioli | kinetic / new commission / provisional record |

`*` Treat the 2026 Breath record as provisional until institutional data and rights are confirmed.

### Suggested routes

1. **Peccioli: art through the historic centre** — walking, about 2 hours; first-time visitor route.
2. **Ghizzano: colour, sculpture and village** — walking; strong visual route around Tremlett, Kwade and Tuttofuoco.
3. **Palazzo Senza Tempo and the valley** — architecture, interiors and view points; check access conditions.
4. **Legoli + Belvedere: art, landscape and infrastructure** — booking/site-dependent; explain access clearly.
5. **VOCI: seven sites, seven narratives** — multi-stop, route-led cultural experience; potentially bookable/site-dependent.

---

## 10. Screen-by-screen design requirements

Design the following screens in both desktop and mobile where relevant. The mobile screens are not optional — they are central to the product.

### 10.1 Home `/`

#### Main goal
Within 5–10 seconds, make the visitor understand that MACCA is a museum distributed across Peccioli and its territory.

#### Required composition

1. **Full-viewport hero**
   - topographic/territorial visual, aerial-feeling abstraction, image or map hybrid;
   - wordmark `MACCA` and descriptor `Museo d’Arte Contemporanea a Cielo Aperto`;
   - primary line: `Un museo diffuso nel paesaggio di Peccioli.`
   - CTA 1: `Esplora la mappa`
   - CTA 2: `Scegli un percorso`
   - optional live label: `72 opere · 30+ anni · 1 territorio` — clearly editable, not hard-coded brand copy.

2. **Map-as-collection section**
   - a large map fragment with dispersed markers;
   - no overloading; show several different marker types;
   - short explanatory copy: art across streets, hills, villages, buildings and infrastructure.

3. **Featured route selector**
   - 3–5 route cards with duration, mode, access and visual identity;
   - each route should feel like a designed editorial object, not a tourist tile.

4. **Featured work / new commission**
   - image-led spotlight; title, artist, year, short insight, map fragment.

5. **A museum built over time**
   - compact timeline/decades section, pulling toward `/timeline`.

6. **Explore by place**
   - Peccioli, Ghizzano, Legoli, Fabbrica, Le Serre, Belvedere etc.; treat as territory, not a boring category menu.

7. **Visit planning strip**
   - `Arrivare`, `Accessibilità`, `Luoghi su prenotazione`, `Salva la guida`.

8. **Footer**
   - institutional links, contacts, accessibility, privacy, credits, social, language, partner space.

#### Home interactions

- subtle map movement/parallax only if performance safe;
- hero action opens map seamlessly;
- hovering a route card may spotlight its trace/area on an adjacent map;
- featured work can reveal a pin / location clue;
- no auto-playing video with sound.

---

### 10.2 Explore map `/explore`

This is the core product screen.

#### Desktop layout

- **Split-screen layout:** map approximately 55–65% of viewport, contextual content panel 35–45%.
- map remains persistent while results, cards and selection change;
- top map controls: search, current location, layer/filter toggle, reset view;
- left/right content panel may collapse to an artwork card, route card, filter drawer or location cluster;
- clear `Open in maps` / `Start route` affordance when appropriate.

#### Mobile layout

- full-screen map;
- compact top bar with search and filter;
- draggable bottom sheet with results;
- selected work opens as an expandable bottom sheet or full-page transition;
- make “near me” optional and permission-safe;
- quick `Map` / `List` segmented control;
- one-thumb interactions where possible.

#### Required filters

- area / hamlet;
- work type (sculpture, light, mural/colour, sound/voice, installation, architecture etc.);
- decade;
- artist;
- public exterior / indoor / booking required / site-dependent;
- “open now / access to check” state;
- route membership;
- distance / near me (only when location permission is granted).

#### Map marker language

Create a coherent visual system:

- standard individual artwork marker;
- selected artwork marker;
- clustered works marker;
- route stop marker with number;
- controlled/booking site marker;
- indoor/building marker;
- linear or multi-site work treatment;
- “location being verified” should not falsely appear as an exact point.

Markers should feel designed and recognisable, but remain highly legible at small sizes.

#### Required empty and edge states

- no filters match;
- location permission declined;
- map loading;
- selected work has only area-level location;
- selected site requires advance booking;
- route has a temporary access warning;
- visitor is offline/weak connectivity (visual concept only — no need to implement).

---

### 10.3 Collection `/collection`

#### Goal
Allow deep browsing without losing the territorial logic.

#### Layout

- editorial collection header: title, total count, active filters, short museum statement;
- grid/list toggle;
- layered filter controls, not heavy form controls;
- cards can be image-first, typography-first or map-first depending on available assets;
- on desktop: 3–4 column grid with breathing room;
- on mobile: 1–2 columns, clear filter drawer and persistent result count.

#### Each work card should support

- title;
- artist;
- year;
- location/area;
- type or access state;
- small map cue / route association;
- image or composed placeholder;
- saved action;
- “exact location / site / route” status subtly visible where relevant.

#### Editorial browsing modes

Provide visual hooks for:

- `Works in Peccioli`
- `Works in Ghizzano`
- `Works in the landscape`
- `Works after dark`
- `1991–2000`, `2001–2010`, `2011–2020`, `2021–today`
- `Sculpture`, `Light`, `Colour`, `Sound`, `Architecture`, `Landscape`
- `Commission projects`

---

### 10.4 Artwork page `/works/[slug]`

#### Goal
Make every work feel like a meeting between artwork, artist and site.

#### Recommended structure

1. **Hero**
   - large visual or artwork/territory composition;
   - title, artist, year;
   - location state and map cue;
   - prominent access label;
   - save and share actions.

2. **Short interpretation**
   - 60–110 words, generous typography;
   - a sentence that connects the work to place.

3. **Facts panel**
   - artist;
   - year;
   - type/medium;
   - commission/project;
   - location;
   - access;
   - duration / time to visit where relevant;
   - dimensions only where verified.

4. **Map and arrive panel**
   - location visualisation;
   - exact pin, site entrance or area cluster depending on record quality;
   - `Apri indicazioni` / directions CTA;
   - walking/parking/booking note;
   - never show false precision.

5. **Long story**
   - curatorial/archival context;
   - optional pull quote or source excerpt style;
   - reading experience should feel like an art publication.

6. **Media gallery**
   - full bleed or modular; image credit always visible;
   - support photo, audio, archival PDF, video or 360/ambient module later;
   - no assumption that all works have media.

7. **In this place**
   - nearby works;
   - related site/hamlet;
   - route CTA.

8. **Artist panel**
   - concise introduction and link to artist profile.

9. **Sources / credits / archive reference**
   - compact, quiet, truthful; not visually prominent but clearly accessible.

#### QR quick mode `/qr/[work-id]`

The QR version should be immediately useful in bright sunlight and while standing outdoors:

- no large navigation burden;
- title, artist, year, short text and clear `Ascolta` / `Leggi` / `Mappa` controls;
- very large type and tap targets;
- current location / nearby works if available;
- compact visual; loads fast.

---

### 10.5 Artist profile `/artists/[slug]`

#### Goal
Turn artists into a coherent layer of the collection, not a database afterthought.

#### Composition

- artist name, years/nationality only where verified;
- concise biography;
- short practice statement;
- map of MACCA works;
- all works in collection, ordered chronologically or spatially;
- related project/commission phase;
- optional external links area;
- portrait only where cleared; otherwise use typography and work imagery rather than fake portraits.

Mobile should prioritise `Works in MACCA` directly after the short intro.

---

### 10.6 Routes index `/routes`

#### Goal
Help visitors choose a way to experience MACCA without requiring art-world knowledge.

#### Route card requirements

- route title;
- primary image or map route graphic;
- duration;
- distance (only when verified);
- mode: walk / bike / car / booked visit;
- difficulty / access profile;
- number of stops;
- required booking or indoor access state;
- mood/theme label: `Colour & village`, `Historic centre`, `Art + landscape`, `After dark`, `Stories & voices`.

Use a clear visual system so routes look distinct but part of one family.

---

### 10.7 Route detail `/routes/[slug]`

#### Required sections

1. Route hero with map trace/territory image.
2. Title, duration, mode, access alert, booking status.
3. Short narrative: why this route exists.
4. Start point / arrival information.
5. Ordered stop list with numerals, estimated dwell time and access conditions.
6. Interactive map with route line and stop selection.
7. `Start route` CTA.
8. Practical notes: hills, steps, indoor access, toilets/parking if later supplied.
9. Alternate/reduced route or “continue exploring” logic.
10. Save/share.

For multi-site or non-linear works, explain that the route itself may be part of the artwork.

---

### 10.8 Timeline `/timeline`

#### Goal
Make 30+ years of commissions feel visually alive and intellectually accessible.

#### Design directions

- horizontally scrollable desktop timeline and vertically progressive mobile timeline;
- years / project phases are structural anchors;
- works appear as typographic and image nodes;
- filter by place, artist, type and decade;
- transition from a timeline moment into work / project / site pages;
- use changes in visual density to suggest expansion of the collection over time.

Avoid a dense academic chronology. This should feel like an expanding cultural landscape.

---

### 10.9 Location / site page `/locations/[slug]`

Use for Peccioli, Ghizzano, Legoli, Le Serre, Fabbrica, Belvedere, Palazzo Senza Tempo or a church/site cluster.

#### Required content

- place name and territory context;
- broad map/aerial/territorial visual;
- “works here” list;
- access and arrival information;
- route links;
- stories / project context;
- separate building-hours or booking information;
- site-specific warnings where relevant;
- no false suggestion that every artwork in a site can be visited freely.

---

### 10.10 Visit `/visit`

#### Goal
Remove real-life friction without losing the artistic tone.

Required modules:

- how to arrive from nearby cities / by car / public transport (visual placeholders where data is not final);
- map of main areas;
- parking / walking / accessibility;
- works accessible without booking;
- indoor / controlled / booking-required places;
- opening hours / seasonal updates placeholder;
- group / school visits;
- contact and booking CTA;
- “before you go” practical checklist;
- etiquette / respect place and works;
- optional “download / save route” block.

The design must distinguish clearly between **free public-space works** and **works that require an appointment, timed entry or a controlled-access visit**.

---

### 10.11 About `/about`

The page should explain the museum model with conviction and restraint.

Required sections:

- what MACCA is;
- why Peccioli built a dispersed collection;
- historical timeline / commission logic;
- relationship between art, local community, landscape and infrastructure;
- institutional/partner space;
- links to collection, timeline and visit;
- contact / press / educational potential.

Avoid corporate rhetoric. Use concise, culturally confident language.

---

### 10.12 Search and saved states

#### Search

- keyboard-first on desktop, fast and touch-friendly on mobile;
- search works, artists, places, routes and project phases;
- display mixed result types with clear labels;
- allow fast filtered exploration.

#### Saved

- no account required;
- local list of saved works/routes;
- capability to create a personal day plan later;
- empty state should invite discovery, not look blank.

---

## 11. Core components to design once and reuse everywhere

Create a coherent component library for the prototype:

- wordmark/header/navigation;
- language switcher;
- map CTA;
- primary / secondary / tertiary buttons;
- filter chips;
- route tag;
- access-state badge;
- location-confidence label;
- work card: image-first;
- work card: typography-first;
- map result card;
- route card;
- artist card;
- timeline node;
- map marker family;
- map legend;
- selected-map-point panel;
- bottom sheet;
- booking/controlled-access notice;
- saved toggle;
- share control;
- source/credit component;
- empty state;
- loading/skeleton state;
- error/offline state.

### Access badges — suggested hierarchy

- `All’aperto · libero accesso` / Public exterior
- `Interno · orari da verificare` / Indoor
- `Su prenotazione` / Booking required
- `Accesso regolato` / Controlled access
- `Percorso / più luoghi` / Multi-site
- `Posizione in verifica` / Location being verified

Do not make warnings visually alarming unless safety-critical. They should be direct and useful.

---

## 12. Interaction and motion rules

Motion should help orientation, not create spectacle.

### Use

- map pan/zoom transitions;
- marker selection;
- route highlight;
- bottom-sheet elevation;
- card-to-detail continuity;
- subtle timeline reveal;
- image crossfades;
- restrained hover states.

### Avoid

- dramatic page transitions;
- animation that delays access to directions;
- auto-playing video/audio;
- excessive cursor effects;
- map motion without user intent;
- bouncing markers or gamification.

Respect reduced-motion preferences.

---

## 13. Accessibility and inclusive design requirements

The prototype must demonstrate an accessibility-minded direction:

- high enough colour contrast;
- obvious focus states;
- 44px+ tap targets on mobile;
- scalable typography;
- text alternatives for images;
- labels never communicated by colour alone;
- map has a list alternative;
- visual location may also be explained in text;
- language switch visible and unambiguous;
- printable or shareable route summary concept;
- avoid requiring location permissions to use core experience.

For routes, reserve space for future structured metadata:

- steps/slope;
- seating/rest points;
- wheelchair suitability;
- buggy suitability;
- lighting / after-dark suitability;
- parking distance;
- accessible toilet proximity;
- seasonal restrictions.

---

## 14. Responsive behaviour

### Desktop

- desktop is editorial and spatial;
- use wide imagery, structured grid, split map/content views;
- persistent utility navigation;
- maps can coexist with cards and long copy.

### Tablet

- preserve map priority;
- collapse secondary navigation intelligently;
- use adaptable 2-column content patterns.

### Mobile

- map-first and route-first;
- sticky `Open map` or `Explore nearby` action when appropriate;
- full-screen map + bottom sheet;
- route stop list readable while walking;
- QR quick view ultra-fast;
- no tiny UI and no dependence on hover;
- ensure route/action choices are achievable with one hand.

---

## 15. Prototype data/state examples to show visually

Please include at least one visual example for each of these conditions:

1. **Verified work pin** — public sculpture with exact location.
2. **Site-anchor work** — work inside Palazzo / building; direct visitor to entrance not object position.
3. **Booking-required / controlled site** — Belvedere-style access module with clear call to action.
4. **Multi-site route work** — `VOCI` / distributed narrative represented as a route or multiple points.
5. **Linear work** — a street/lighting intervention represented by a line or area rather than an inaccurate dot.
6. **No exact coordinate yet** — work visible in archive/list with area label but no fake map marker.
7. **Night-view work** — visual and access state that communicates best time of day without turning the app into nightlife branding.
8. **New/provisional work** — present in editorial state, clearly marked pending verification.

---

## 16. Copy tone and sample UI language

### Voice

- direct;
- quietly poetic but not vague;
- cultured without art-world jargon;
- practical when visitor needs practical information;
- Italian-first.

### Sample headings

- `Un museo da attraversare.`
- `L’arte non comincia all’ingresso. È già nel paesaggio.`
- `Esplora opere, luoghi e percorsi.`
- `Dove l’opera incontra il luogo.`
- `Un percorso nel centro storico.`
- `Prima di partire.`
- `Opera visitabile liberamente.`
- `Accesso su prenotazione.`
- `Posizione esatta in verifica.`
- `Nelle vicinanze.`
- `Continua il percorso.`

### Avoid copy like

- “Experience the magic of Tuscany.”
- “Discover hidden gems.”
- “Immersive world-class journey.”
- “A unique must-see attraction.”
- “Buy tickets now” unless the real service has been confirmed.

---

## 17. Design outputs requested from Claude Design

Produce a cohesive prototype with:

### Desktop frames

1. Homepage.
2. Explore map — default state.
3. Explore map — selected work state.
4. Explore map — filters / area cluster / site-required state.
5. Collection index.
6. Artwork detail page.
7. Artist profile.
8. Routes index.
9. Route detail.
10. Timeline.
11. Location/site page.
12. Visit page.
13. About page.
14. Search / results page.
15. Saved / empty state.

### Mobile frames

1. Mobile homepage.
2. Full-screen map + bottom sheet.
3. Selected work quick card.
4. Artwork page.
5. QR quick view.
6. Route detail / active route.
7. Booking-required site state.
8. Collection filter drawer.

### Supporting artefacts

- mini design system / component sheet;
- map marker legend;
- responsive type and spacing guidance;
- colour and state tokens;
- interaction notes for map, bottom sheet, route start and saved items.

---

## 18. Engineering awareness — design for a real build

The final product is likely to use:

- Next.js / React;
- TypeScript;
- Tailwind CSS;
- MapLibre GL JS or similar;
- initially local JSON seed data;
- later a headless CMS or Supabase/Postgres;
- QR short URLs that resolve to dynamic work pages;
- localStorage for saved works/routes;
- privacy-conscious analytics.

Do not force UI patterns that depend on unavailable data. The design must gracefully support fields that are pending verification.

### Useful entity relationships to show in the interface

```text
Work → Artist
Work → Project / commission phase
Work → Location / site
Work → Route(s)
Work → Access state
Work → Media / credits
Work → Source / archive reference
Artist → All MACCA works
Location → All works at this place
Route → Ordered works / sites
Timeline event → Project / works / locations
```

---

## 19. Research source notes — for reference only

The design should be based on the existing public research pack, but not display source URLs in prominent UI except in the low-priority sources/credits area.

Primary research sources include:

- Official MACCA collection index: `https://www.fondarte.peccioli.net/opere/index.php?lang=en`
- Peccioli MACCA overview: `https://www.peccioli.net/m-a-c-c-a-2/`
- Official territory art-map PDF: `https://www.peccioli.net/wp-content/uploads/sites/3/2021/06/MappaPeccioliTLTlow.pdf`
- Official Belvedere contact/site reference: `https://belvedere.peccioli.net/en/contacts/`

Related local project pages and individual official work records exist in the research pack. Treat all artwork imagery as **rights to verify before external launch**.

---

## 20. Final quality bar

The result should make a stakeholder say:

> “This is not simply a website for a collection. It is the interface through which MACCA becomes understandable as a museum across a whole territory.”

It should feel distinctive enough to become MACCA’s future visual digital language, while flexible enough to accept real collection data, verified coordinates, approved imagery, multilingual editorial content and future commissions.

### Non-negotiables

- Map is central.
- Mobile visitor guide is excellent.
- Work pages connect art to place.
- Routes are genuinely useful.
- Access conditions are honest and clear.
- Full collection can grow beyond the first flagship works.
- No fabricated pins, facts or image-rights claims.
- No generic tourism aesthetic.

---

## 21. One-sentence prompt summary

Design MACCA as a **map-first, editorially sophisticated digital museum for contemporary art dispersed across Peccioli’s streets, villages, landscape and infrastructure — equally useful as a visitor guide, collection archive and cultural identity platform.**
