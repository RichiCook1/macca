// Google Maps integration helpers — honest by construction.
// We never invent coordinates: pins are plotted only for records that carry
// lat/lon in the seed or verified overlay coordinates. For everything else we
// delegate to Google's own geocoding via *search/directions links* built from
// the street addresses in the seed (address_or_site + hamlet), which asserts
// nothing about exact position on our side.

import type { Work, AreaSlug } from "./collection";
import { locations, locationForArea } from "./collection";

/** Territory centre — Peccioli (seed: loc-breath-external, pending confirmation). */
export const PECCIOLI_CENTER = { lat: 43.5479523, lng: 10.7207695 };

export const MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

/** Human query for a work: street/site + hamlet, always suffixed with the comune. */
export function workQuery(work: Pick<Work, "place" | "hamletArea">): string {
  const hamlet = work.hamletArea.replace(/Peccioli historic centre/i, "Peccioli");
  return `${work.place}, ${hamlet}, Peccioli PI, Italia`;
}

/** Open the place in Google Maps (search — Google resolves the address). */
export function mapsSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Walking directions to a single destination. */
export function mapsDirectionsUrl(query: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}&travelmode=walking`;
}

/**
 * Multi-stop walking route. The route's REAL final stop is always the
 * destination; Google caps waypoints at 9, so on longer routes intermediate
 * stops beyond the first 9 are omitted (never the destination).
 */
export function mapsRouteUrl(queries: string[]): string {
  if (queries.length === 0) return mapsSearchUrl("Peccioli PI, Italia");
  const destination = queries[queries.length - 1];
  const waypoints = queries.slice(0, -1).slice(0, 9);
  const wp = waypoints.length
    ? `&waypoints=${encodeURIComponent(waypoints.join("|"))}`
    : "";
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}${wp}&travelmode=walking`;
}

/**
 * Best-effort map centre for a single work, from real location coordinates only
 * (never invented): match a location named in the work's site text, else fall
 * back to the work's area anchor, else the territory centre. Used to centre the
 * Google preview on the relevant place — the pins themselves stay site-level.
 */
export function workMapCenter(work: Pick<Work, "place" | "area" | "mapCoord">): { lat: number; lng: number } {
  // 1. Per-work geocoded position — only when it's genuinely specific
  //    (address/street/source). Coarse "area" geocodes fall through to the
  //    named-site match below, which is often better for the historic centre.
  if (work.mapCoord && ["address", "street", "source"].includes(work.mapCoord.precision)) {
    return { lat: work.mapCoord.lat, lng: work.mapCoord.lon };
  }
  const place = (work.place || "").toLowerCase();
  const byName = locations.find(
    (l) =>
      l.lat != null &&
      l.lon != null &&
      (place.includes(l.name.toLowerCase()) ||
        (l.address && place.includes(l.address.toLowerCase().split(",")[0].trim())))
  );
  if (byName) return { lat: byName.lat as number, lng: byName.lon as number };
  const area = locationForArea(work.area as AreaSlug);
  if (area && area.lat != null && area.lon != null) return { lat: area.lat, lng: area.lon };
  return PECCIOLI_CENTER;
}

/**
 * Works as map pins. Since many works share one site (address-level), works at
 * the same coordinate are fanned out on a small golden-angle spiral (a few tens
 * of metres) so they're individually clickable — an honest presentational
 * spread within the site, never a claim of surveyed position.
 */
export function workMapPins(
  works: Work[]
): { id: string; title: string; lat: number; lng: number; image?: string; subtitle?: string; hamlet?: string; href: string }[] {
  const groups = new Map<string, Work[]>();
  for (const w of works) {
    const c = workMapCenter(w);
    const key = `${c.lat.toFixed(4)},${c.lng.toFixed(4)}`;
    const arr = groups.get(key);
    if (arr) arr.push(w);
    else groups.set(key, [w]);
  }
  const GOLDEN = Math.PI * (3 - Math.sqrt(5));
  const out: ReturnType<typeof workMapPins> = [];
  for (const [key, ws] of groups) {
    const [lat, lng] = key.split(",").map(Number);
    const cos = Math.cos((lat * Math.PI) / 180) || 1;
    ws.forEach((w, i) => {
      let dLat = 0,
        dLng = 0;
      if (ws.length > 1) {
        const r = 0.00013 * Math.sqrt(i + 0.4); // ~14 m per unit
        const t = i * GOLDEN;
        dLat = Math.sin(t) * r;
        dLng = (Math.cos(t) * r) / cos;
      }
      out.push({
        id: w.slug,
        title: w.title,
        lat: lat + dLat,
        lng: lng + dLng,
        image: w.heroImage?.src,
        subtitle: `${w.artist} · ${w.year}`,
        hamlet: w.hamletArea,
        href: `/opere/${w.slug}`,
      });
    });
  }
  return out;
}

/** Great-circle distance in metres between two lat/lng points. */
export function distanceMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/** Human distance label: "120 m", "1,2 km". */
export function formatDistance(m: number): string {
  if (m < 950) return `${Math.max(10, Math.round(m / 10) * 10)} m`;
  return `${(m / 1000).toFixed(1).replace(".", ",")} km`;
}

/**
 * Nearest works to a given work, by real (geocoded) coordinates, with distance.
 * Used by the "nelle vicinanze" panel.
 */
export function nearestWorks(work: Work, all: Work[], limit = 6): { work: Work; meters: number }[] {
  const here = workMapCenter(work);
  return all
    .filter((w) => w.slug !== work.slug)
    .map((w) => ({ work: w, meters: distanceMeters(here, workMapCenter(w)) }))
    .sort((a, b) => a.meters - b.meters)
    .slice(0, limit);
}

/**
 * Order works into a walking sequence from a start point via nearest-neighbour,
 * returning each work with its leg distance (metres from the previous point) and
 * the running total. Simple, deterministic, good enough for a short town route.
 */
export function orderFromStart(
  start: { lat: number; lng: number },
  works: Work[]
): { work: Work; leg: number; total: number }[] {
  const remaining = works.slice();
  const out: { work: Work; leg: number; total: number }[] = [];
  let cur = start;
  let total = 0;
  while (remaining.length) {
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const d = distanceMeters(cur, workMapCenter(remaining[i]));
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    const w = remaining.splice(best, 1)[0];
    total += bestD;
    out.push({ work: w, leg: bestD, total });
    cur = workMapCenter(w);
  }
  return out;
}

/** Only records with real coordinates ever become pins. */
export function verifiedPins() {
  return locations
    .filter((l) => l.lat != null && l.lon != null)
    .map((l) => ({
      id: l.slug,
      name: l.name,
      lat: l.lat as number,
      lng: l.lon as number,
      confidence: l.coordinateConfidence,
      pinPolicy: l.pinPolicy,
      access: l.access,
    }));
}

/**
 * Palette-matched Google Maps style (stone landscape, cypress parks, sky water,
 * quiet roads) so the real map reads as part of the MACCA design system.
 */
export const MACCA_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#ece8dd" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#56524a" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f6f4ee" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#c9c2b2" }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: "#e7e2d4" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#d6dcd2", visibility: "on" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#f6f4ee" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#d9d2c1" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#7a7669" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#efe9da" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#c9d6d9" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#5b7790" }] },
];
