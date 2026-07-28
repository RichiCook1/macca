// ─────────────────────────────────────────────────────────────────────────────
// MACCA — single source of truth.
// The prototype is built dynamically from src/data/macca.collection.json.
// We DERIVE presentation fields (slug, coarse category, abstract map position,
// access/confidence classes) but NEVER invent missing content: descriptions,
// dimensions, GPS, images, artist biographies and access conditions are absent
// by design and surface as editorial fallback states.
// ─────────────────────────────────────────────────────────────────────────────

// CLIENT-SAFE seed subset (emitted by scripts/build-content-manifest.mjs).
// The full seed — asset_rights_register, verification_queue, internal build
// notes — is server-only via lib/governance.ts and never reaches the browser.
import seed from "@/src/data/macca.client.json";
import contentOverlay from "@/src/data/macca.content.json";
import generatedImages from "@/src/data/macca.images.generated.json";

// ---- Raw schema (mirrors the seed file) ----
export interface RawWork {
  work_id: string;
  title_it: string;
  artist: string;
  year: number;
  project: string;
  type: string;
  hamlet_area: string;
  address_or_site: string;
  access_type: string;
  map_status: string;
  priority: string;
  source_official: string;
  source_index: string;
  current_status: string;
  rights_status: string;
  data_confidence: string;
  notes: string;
  source_external_details?: string;
}

// ---- Enrichment overlay (the "content pack") ----
// Merged onto the seed by work_id. Everything here is OPTIONAL and only added
// when verified — it upgrades fallback states to real content. Images can also be
// auto-discovered from public/images/works via the prebuild manifest.
export interface WorkImage {
  src: string;
  credit?: string;
  source?: string;
  license?: string;
  caption?: string;
}
export interface WorkOverlay {
  description_it?: string;
  description_en?: string;
  materials?: string;
  dimensions?: string;
  coordinates?: { lat: number; lon: number; confidence?: "exact" | "verified" | "approximate" };
  images?: WorkImage[];
  credit?: string;
}
export interface RawLocation {
  location_id: string;
  display_name: string;
  area: string;
  address: string;
  lat: number | null;
  lon: number | null;
  coordinate_confidence: string;
  pin_policy: string;
  access: string;
  source_url: string;
  notes: string;
}
export interface RawRoute {
  route_id: string;
  title: string;
  type: string;
  duration: string;
  distance: string;
  access: string;
  stops: string;
  prototype_value: string;
  source_url: string;
  verification: string;
}
export interface RawFlagship {
  feature_id: string;
  work_id: string;
  title: string;
  artist: string;
  year: number;
  story_lens: string;
  prototype_page_modules: string;
  build_note: string;
  publication_state: string;
}
export interface RawRights {
  asset_id: string;
  related_work_or_cluster: string;
  public_source_url: string;
  asset_evidence: string;
  reproduction_rights: string;
  prototype_use: string;
  external_launch_status: string;
  credit_to_confirm: string;
  next_action: string;
}
export interface RawVerification {
  verification_id: string;
  priority: string;
  topic: string;
  scope: string;
  request: string;
  why: string;
  owner: string;
  status: string;
}

/** Client-safe flagship fields (full record lives server-side in governance.ts). */
export interface SlimFlagship {
  feature_id: string;
  work_id: string;
  story_lens: string;
  publication_state: string;
}

interface ClientSeed {
  schema_version: string;
  generated_at: string;
  works: RawWork[];
  locations: RawLocation[];
  routes: RawRoute[];
  flagship_content: SlimFlagship[];
}

const data = seed as unknown as ClientSeed;

export const collectionMeta = {
  schemaVersion: data.schema_version,
  generatedAt: data.generated_at,
};

// ---- Editorial fallback states (never invent content) ----
export const FALLBACK = {
  /** Archival text in preparation */
  story: "Testo d'archivio in preparazione",
  /** Location being verified */
  location: "Posizione in verifica",
  /** Image archive in preparation */
  image: "Archivio immagini in preparazione",
  /** Further information forthcoming */
  more: "Ulteriori informazioni in arrivo",
} as const;


// ---- Derived enums ----
export type AccessClass =
  | "public-exterior"
  | "dependent-hours"
  | "booking"
  | "church"
  | "semi-public"
  | "mixed"
  | "confirm";

/** Honest map confidence — none of the seed records is a verified exact pin. */
// "exact" only appears when an overlay supplies verified coordinates — the raw
// seed never claims it.
export type MapConfidence = "exact" | "site" | "address" | "cluster" | "area" | "external";

export type DataConfidence = "High" | "Medium" | "Low";

export type Category =
  | "Scultura"
  | "Pittura/Colore"
  | "Luce"
  | "Voce/Suono"
  | "Installazione"
  | "Architettura"
  | "Video";

// ---- Classifiers (map raw seed strings → UI classes) ----
function classifyAccess(raw: string): { cls: AccessClass; night: boolean } {
  const s = raw.toLowerCase();
  const night = s.includes("night");
  let cls: AccessClass = "confirm";
  // "confirm" is checked FIRST: "Public / confirm access" must classify as
  // to-confirm, not free access (honesty over optimism).
  if (s.includes("confirm")) cls = "confirm";
  else if (s.includes("bookable") || s.includes("controlled")) cls = "booking";
  else if (s.includes("church") || s.includes("oratory")) cls = "church";
  else if (s.includes("semi-public")) cls = "semi-public";
  else if (s.includes("mixed")) cls = "mixed";
  else if (
    s.includes("dependent") ||
    s.includes("museum") ||
    s.includes("palazzo") ||
    s.includes("building")
  )
    cls = "dependent-hours";
  else if (s.includes("public exterior") || s.includes("publicly visible") || s.includes("public /"))
    cls = "public-exterior";
  return { cls, night };
}

function classifyMap(raw: string): MapConfidence {
  const s = raw.toLowerCase();
  if (s.includes("verified site")) return "site";
  if (s.includes("site-level")) return "site";
  if (s.includes("cluster")) return "cluster";
  if (s.includes("address-level")) return "address";
  if (s.includes("external")) return "external";
  if (s.includes("area") || s.includes("viewpoint")) return "area";
  return "area";
}

function classifyCategory(type: string): Category {
  const s = type.toLowerCase();
  if (/(light|neon|luminaria|led|plexiglass)/.test(s) && !/video/.test(s)) return "Luce";
  if (/video/.test(s)) return "Video";
  if (/(sound|audio)/.test(s)) return "Voce/Suono";
  if (/(painting|mural|wall painting|wall drawing|drawing|image-based|interior decoration)/.test(s))
    return "Pittura/Colore";
  // Sculpture wins over architecture context words ("Gateway sculpture",
  // "Sculpture integrated with parking structure" are sculptures).
  if (/(sculpture|bronze|stone|kinetic|mirror|cor-ten|ceramics|iron)/.test(s)) return "Scultura";
  if (/(architect|passage|parking|pedestrian|gateway)/.test(s)) return "Architettura";
  if (/installation|street|distributed|environmental/.test(s)) return "Installazione";
  return "Installazione";
}

export type AreaSlug =
  | "peccioli"
  | "ghizzano"
  | "legoli"
  | "belvedere"
  | "fabbrica"
  | "le-serre"
  | "cedri";

const AREA_ANCHOR: Record<AreaSlug, { x: number; y: number; name: string }> = {
  peccioli: { x: 500, y: 320, name: "Peccioli" },
  ghizzano: { x: 660, y: 150, name: "Ghizzano" },
  legoli: { x: 800, y: 380, name: "Legoli" },
  belvedere: { x: 610, y: 440, name: "Belvedere" },
  fabbrica: { x: 300, y: 250, name: "Fabbrica" },
  "le-serre": { x: 460, y: 470, name: "Le Serre" },
  cedri: { x: 770, y: 540, name: "Cedri" },
};

/** Hamlet/area anchors for stylized-map labels. */
export const mapAreas = (Object.keys(AREA_ANCHOR) as AreaSlug[]).map((slug) => ({
  slug,
  name: AREA_ANCHOR[slug].name,
  point: { x: AREA_ANCHOR[slug].x, y: AREA_ANCHOR[slug].y },
}));

function areaSlug(hamlet: string): AreaSlug {
  const s = hamlet.toLowerCase();
  if (s.includes("ghizzano")) return "ghizzano";
  if (s.includes("belvedere")) return "belvedere";
  if (s.includes("legoli")) return "legoli";
  if (s.includes("fabbrica")) return "fabbrica";
  if (s.includes("serre")) return "le-serre";
  if (s.includes("cedri")) return "cedri";
  return "peccioli";
}

// Deterministic per-area spread so clustered works never pile up. Works are laid
// on a golden-angle (phyllotaxis) spiral around their area anchor, indexed by
// their order within the area — guaranteeing a minimum spacing between any two
// markers, regardless of how similar the work_ids are (a naive hash jitter
// degenerated: sequential ids hashed to near-identical offsets and 53 Peccioli
// works stacked within ~13px). This is a presentational spread on the ABSTRACT
// map only — markers always render with the non-precise treatment dictated by
// map_status (we never imply a verified pin).
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5)); // ≈ 2.39996
function spiralOffset(indexInArea: number, areaCount: number): { dx: number; dy: number } {
  if (areaCount === 1) return { dx: 0, dy: 0 };
  // Radius grows with sqrt(i) for even density; scaled so large clusters
  // (Peccioli: 53 works) still fit the 1000×640 canvas.
  const r = 16 + 12.5 * Math.sqrt(indexInArea);
  const t = indexInArea * GOLDEN_ANGLE;
  // Slightly elliptical to match the map's landscape aspect.
  return { dx: Math.cos(t) * r * 1.25, dy: Math.sin(t) * r * 0.85 };
}

// Pre-pass: index of each work within its area (seed order = stable).
const areaCounters = new Map<AreaSlug, number>();
const areaTotals = new Map<AreaSlug, number>();
for (const w of data.works) {
  const a = areaSlug(w.hamlet_area);
  areaTotals.set(a, (areaTotals.get(a) ?? 0) + 1);
}
function nextAreaIndex(a: AreaSlug): number {
  const i = areaCounters.get(a) ?? 0;
  areaCounters.set(a, i + 1);
  return i;
}

// Locations keep a smaller hash-free offset too.
function locationOffset(index: number): { dx: number; dy: number } {
  const r = 10 + 9 * Math.sqrt(index);
  const t = index * GOLDEN_ANGLE + 1.7;
  return { dx: Math.cos(t) * r, dy: Math.sin(t) * r };
}

export function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const decadeOf = (year: number): "1991-2000" | "2001-2010" | "2011-2020" | "2021-oggi" =>
  year <= 2000 ? "1991-2000" : year <= 2010 ? "2001-2010" : year <= 2020 ? "2011-2020" : "2021-oggi";

// ---- Flagship lookup ----
const flagshipByWorkId = new Map(data.flagship_content.map((f) => [f.work_id, f]));

// ---- Derived Work ----
export interface Work {
  workId: string;
  slug: string;
  title: string;
  artist: string;
  artistSlug: string;
  year: number;
  decade: "1991-2000" | "2001-2010" | "2011-2020" | "2021-oggi";
  project: string;
  typeRaw: string;
  category: Category;
  hamletArea: string;
  area: AreaSlug;
  place: string;
  accessRaw: string;
  accessClass: AccessClass;
  nightView: boolean;
  mapStatus: string;
  mapConfidence: MapConfidence;
  point: { x: number; y: number };
  dataConfidence: DataConfidence;
  currentStatus: string;
  rightsStatus: string;
  sources: { official?: string; index?: string };
  notes: string;
  /** Flagship feature record (richer treatment + route promotion), if any. */
  feature?: SlimFlagship;
  isFlagship: boolean;
  /** Future-dated / not-yet-realised record. */
  provisional: boolean;

  // ── Enrichment (from the content overlay / image manifest; undefined until provided) ──
  /** Verified visitor-facing description (overlay). Falls back when absent. */
  description?: string;
  descriptionEn?: string;
  materials?: string;
  dimensions?: string;
  coordinates?: { lat: number; lon: number; confidence?: string };
  images: WorkImage[];
  heroImage?: WorkImage;
  /** True once at least one cleared/credited image is provided. */
  hasPhoto: boolean;
  sourceExternal?: string;

  // ── Compatibility aliases for the shared UI (same field names it already uses) ──
  accessState: AccessClass; // = accessClass
  locationConfidence: MapConfidence; // = mapConfidence
  flagship: boolean; // = isFlagship
  /** Rights status surfaced as the credit/rights line (real data, not invented). */
  credit: string;
  /** Route slugs whose stops include this work (filled after routes build). */
  routes: string[];
}

const overlayWorks: Record<string, WorkOverlay> =
  (contentOverlay as { works?: Record<string, WorkOverlay> }).works ?? {};
const genImages: Record<string, string[]> = (generatedImages as Record<string, string[]>) ?? {};

function mergeImages(workId: string, ov: WorkOverlay, rightsStatus: string): WorkImage[] {
  const explicit = ov.images ?? [];
  const discovered = (genImages[workId] ?? [])
    .filter((src) => !explicit.some((e) => e.src === src))
    .map<WorkImage>((src) => ({ src }));
  // Default each image's credit/rights note from the work's rights status.
  return [...explicit, ...discovered].map((img) => ({
    ...img,
    credit: img.credit ?? rightsStatus,
  }));
}

function buildWork(raw: RawWork): Work {
  const { cls, night } = classifyAccess(raw.access_type);
  const area = areaSlug(raw.hamlet_area);
  const anchor = AREA_ANCHOR[area];
  const j = spiralOffset(nextAreaIndex(area), areaTotals.get(area) ?? 1);
  const flagship = flagshipByWorkId.get(raw.work_id);
  const ov = overlayWorks[raw.work_id] ?? {};
  const images = mergeImages(raw.work_id, ov, raw.rights_status);

  // Verified coordinates upgrade the marker to an exact pin (honest: we now have one).
  let mapConfidence = classifyMap(raw.map_status);
  if (ov.coordinates && (ov.coordinates.confidence === "exact" || ov.coordinates.confidence === "verified")) {
    mapConfidence = "exact";
  }

  return {
    workId: raw.work_id,
    slug: raw.work_id,
    title: raw.title_it,
    artist: raw.artist,
    artistSlug: slugifyName(raw.artist),
    year: raw.year,
    decade: decadeOf(raw.year),
    project: raw.project,
    typeRaw: raw.type,
    category: classifyCategory(raw.type),
    hamletArea: raw.hamlet_area,
    area,
    place: raw.address_or_site,
    accessRaw: raw.access_type,
    accessClass: cls,
    nightView: night,
    mapStatus: raw.map_status,
    mapConfidence,
    point: { x: Math.round(anchor.x + j.dx), y: Math.round(anchor.y + j.dy) },
    dataConfidence: (raw.data_confidence as DataConfidence) || "High",
    currentStatus: raw.current_status,
    rightsStatus: raw.rights_status,
    sources: { official: raw.source_official || undefined, index: raw.source_index || undefined },
    notes: raw.notes,
    feature: flagship,
    isFlagship: !!flagship,
    provisional: raw.year > 2025,
    description: ov.description_it,
    descriptionEn: ov.description_en,
    materials: ov.materials,
    dimensions: ov.dimensions,
    coordinates: ov.coordinates,
    images,
    heroImage: images[0],
    hasPhoto: images.length > 0,
    sourceExternal: raw.source_external_details,
    accessState: cls,
    locationConfidence: mapConfidence,
    flagship: !!flagship,
    credit: ov.credit ?? raw.rights_status,
    routes: [],
  };
}

export const works: Work[] = data.works.map(buildWork);
export const workBySlug = (slug: string) => works.find((w) => w.slug === slug);
export const worksByArtist = (artistSlug: string) =>
  works.filter((w) => w.artistSlug === artistSlug);
export const worksByArea = (area: string) => works.filter((w) => w.area === area);

// ---- Artists (derived; no biographies in the seed) ----
export interface Artist {
  slug: string;
  name: string;
  workCount: number;
}
export const artists: Artist[] = (() => {
  const map = new Map<string, Artist>();
  for (const w of works) {
    const ex = map.get(w.artistSlug);
    if (ex) ex.workCount++;
    else map.set(w.artistSlug, { slug: w.artistSlug, name: w.artist, workCount: 1 });
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, "it"));
})();
export const artistBySlug = (slug: string) => artists.find((a) => a.slug === slug);

// ---- Locations ----
export interface Location {
  slug: string;
  name: string;
  area: string;
  areaSlug: AreaSlug;
  address: string;
  hasCoordinates: boolean;
  /** Real geographic coordinates — present only when the seed provides them. */
  lat?: number;
  lon?: number;
  coordinateConfidence: string;
  pinPolicy: string;
  access: string;
  sourceUrl: string;
  notes: string;
  point: { x: number; y: number };
}
export const locations: Location[] = data.locations.map((l, i) => {
  const area = areaSlug(l.area);
  const anchor = AREA_ANCHOR[area];
  const j = locationOffset(i);
  return {
    slug: l.location_id,
    name: l.display_name,
    area: l.area,
    areaSlug: area,
    address: l.address,
    hasCoordinates: l.lat != null && l.lon != null,
    lat: l.lat ?? undefined,
    lon: l.lon ?? undefined,
    coordinateConfidence: l.coordinate_confidence,
    pinPolicy: l.pin_policy,
    access: l.access,
    sourceUrl: l.source_url,
    notes: l.notes,
    point: { x: Math.round(anchor.x + j.dx * 0.4), y: Math.round(anchor.y + j.dy * 0.4) },
  };
});
export const locationBySlug = (slug: string) => locations.find((l) => l.slug === slug);

/**
 * Representative location record for an area — bridges the two slug namespaces
 * (AreaSlug like "peccioli" vs seed location_ids like "loc-peccioli-historic-centre"),
 * so area-level links always resolve. Prefers the location whose name/area text
 * best matches the hamlet.
 */
export function locationForArea(area: AreaSlug): Location | undefined {
  const candidates = locations.filter((l) => l.areaSlug === area);
  if (candidates.length === 0) return undefined;
  // Prefer cluster/centre records over single buildings where available.
  return (
    candidates.find((l) => /centre|centro|village|cluster/i.test(l.name)) ?? candidates[0]
  );
}

// ---- Routes (stops are name-strings; match to works where possible) ----
export interface RouteStop {
  raw: string;
  workSlug?: string;
}
export interface Route {
  slug: string;
  title: string;
  type: string;
  duration: string;
  distance: string;
  access: string;
  stops: RouteStop[];
  prototypeValue: string;
  sourceUrl: string;
  verification: string;
  trace: { x: number; y: number }[];
  flagshipCount: number;
}

// Multimap of title-slug → works. Duplicate titles (four works are "Senza
// titolo") stay ambiguous and are never matched — better an honest cluster
// label than a link to the wrong work.
const titleIndex = (() => {
  const m = new Map<string, Work[]>();
  for (const w of works) {
    const k = slugifyName(w.title);
    const arr = m.get(k);
    if (arr) arr.push(w);
    else m.set(k, [w]);
  }
  return m;
})();
const allTitleSlugs = [...titleIndex.keys()];

function uniqueMatch(key: string): Work | undefined {
  if (!key) return undefined;
  // 1. Exact title match (only when unambiguous).
  const exact = titleIndex.get(key);
  if (exact?.length === 1) return exact[0];
  if (exact && exact.length > 1) return undefined; // ambiguous — refuse
  // 2. Prefix match either way (handles truncated stops like
  //    "Photo-souvenirs A 45°" and ellipses like "Dai su fammi un sorriso…"),
  //    accepted only when exactly ONE work qualifies.
  if (key.length >= 8) {
    const hits = allTitleSlugs.filter(
      (t) => t.startsWith(key) || (key.startsWith(t) && t.length >= 8)
    );
    if (hits.length === 1) {
      const works = titleIndex.get(hits[0])!;
      if (works.length === 1) return works[0];
    }
  }
  return undefined;
}

function matchStop(rawStop: string): RouteStop {
  // Strip trailing qualifiers ("(optional)", "cluster: …") for matching.
  const cleaned = rawStop
    .replace(/\(.*?\)/g, "")
    .replace(/cluster.*/i, "")
    .trim();
  let w = uniqueMatch(slugifyName(cleaned));
  // Compound stops ("Ospiti / Tra (optional)"): try the first segment alone.
  if (!w && cleaned.includes("/")) {
    w = uniqueMatch(slugifyName(cleaned.split("/")[0].trim()));
  }
  return { raw: rawStop.trim(), workSlug: w?.slug };
}

export const routes: Route[] = data.routes.map((r) => {
  const stops = r.stops
    .split(/→|->/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map(matchStop);
  const tracePts = stops
    .map((s) => (s.workSlug ? workBySlug(s.workSlug)?.point : undefined))
    .filter(Boolean) as { x: number; y: number }[];
  const flagshipCount = stops.filter((s) => s.workSlug && workBySlug(s.workSlug)?.isFlagship).length;
  return {
    slug: r.route_id,
    title: r.title,
    type: r.type,
    duration: r.duration,
    distance: r.distance,
    access: r.access,
    stops,
    prototypeValue: r.prototype_value,
    sourceUrl: r.source_url,
    verification: r.verification,
    trace: tracePts,
    flagshipCount,
  };
});
export const routeBySlug = (slug: string) => routes.find((r) => r.slug === slug);

// Flagship slim records (full register + governance arrays live in lib/governance.ts).
export const flagshipContent = data.flagship_content;

export const flagshipWorks = works.filter((w) => w.isFlagship);

// Back-reference: which routes pass through each work.
for (const r of routes) {
  for (const s of r.stops) {
    if (s.workSlug) {
      const w = workBySlug(s.workSlug);
      if (w && !w.routes.includes(r.slug)) w.routes.push(r.slug);
    }
  }
}

export const COLLECTION_TOTAL = works.length; // 72
