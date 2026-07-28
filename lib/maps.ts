// Google Maps integration helpers — honest by construction.
// We never invent coordinates: pins are plotted only for records that carry
// lat/lon in the seed or verified overlay coordinates. For everything else we
// delegate to Google's own geocoding via *search/directions links* built from
// the street addresses in the seed (address_or_site + hamlet), which asserts
// nothing about exact position on our side.

import type { Work } from "./collection";
import { locations } from "./collection";

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
