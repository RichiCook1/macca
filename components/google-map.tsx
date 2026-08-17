"use client";

import { useEffect, useRef, useState } from "react";
import {
  MAPS_API_KEY,
  MACCA_MAP_STYLE,
  PECCIOLI_CENTER,
  verifiedPins,
  mapsSearchUrl,
} from "@/lib/maps";
import { clsx } from "@/lib/clsx";

type LoadState = "idle" | "loading" | "ready" | "error";

let loaderPromise: Promise<void> | null = null;
function loadMapsApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps) return Promise.resolve();
  if (loaderPromise) return loaderPromise;
  loaderPromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(MAPS_API_KEY)}&v=weekly&language=it&region=IT`;
    s.async = true;
    s.onerror = () => reject(new Error("Google Maps script failed to load"));
    s.onload = () => resolve();
    document.head.appendChild(s);
  });
  return loaderPromise;
}

/** A work plotted on the map, with the bits its preview card needs. */
export interface WorkPin {
  id: string;
  title: string;
  lat: number;
  lng: number;
  confidence?: string;
  /** Hero photo src for the click preview. */
  image?: string;
  /** e.g. "Artist · Year". */
  subtitle?: string;
  /** e.g. hamlet/area. */
  hamlet?: string;
  /** Work detail link. */
  href?: string;
  /** Optional number/letter shown inside the pin (navigation stops). */
  label?: string;
}

/**
 * Real territory map (Google Maps), palette-styled to sit inside the MACCA
 * design system. Honesty rule: only records with real coordinates become pins —
 * the two seed site anchors plus any overlay-verified work coordinates.
 * Without an API key (or if the script cannot load) it renders an honest
 * fallback that explains how to enable it, so the feature degrades gracefully.
 */
export function GoogleTerritoryMap({
  workPins = [],
  className,
  zoom = 13,
  center = PECCIOLI_CENTER,
  satelliteToggle = true,
  toggleClassName,
  footnote = true,
  focus,
  sitePins = true,
  onSelectPin,
  selectedId,
  routeLine,
  userPosition,
  followUser = false,
}: {
  workPins?: WorkPin[];
  className?: string;
  zoom?: number;
  /** Called with a work id when its pin is clicked (e.g. to open a panel). */
  onSelectPin?: (id: string) => void;
  /** Work id whose pin is drawn highlighted (different colour, on top). */
  selectedId?: string;
  /** Ordered points for a walking route line (in-app navigation). */
  routeLine?: { lat: number; lng: number }[];
  /** Live "you are here" position dot. */
  userPosition?: { lat: number; lng: number } | null;
  /** Pan the map to the user's position as it updates (navigation). */
  followUser?: boolean;
  /** Map centre — defaults to Peccioli (overridden by `focus` when present). */
  center?: { lat: number; lng: number };
  /** Show the in-map Mappa/Satellite switch. */
  satelliteToggle?: boolean;
  /** Position override for the Mappa/Satellite switch (default top-right). */
  toggleClassName?: string;
  /** Show the "pin = verified coordinates" footnote (hidden on tight previews). */
  footnote?: boolean;
  /** Highlight a single place: a prominent marker + an honest "approximate
   *  area" circle (radiusM) sized to the location's confidence. */
  focus?: { lat: number; lng: number; title: string; radiusM?: number };
  /** Draw the 17 verified site anchors. Off when focusing a single work. */
  sitePins?: boolean;
}) {
  const holder = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const infoRef = useRef<google.maps.InfoWindow | null>(null);
  const markersRef = useRef<(google.maps.Marker | google.maps.Polyline)[]>([]);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const routePolyRef = useRef<google.maps.Polyline | null>(null);
  const dirServiceRef = useRef<google.maps.DirectionsService | null>(null);
  const [state, setState] = useState<LoadState>(MAPS_API_KEY ? "loading" : "idle");
  const [mapType, setMapType] = useState<"roadmap" | "hybrid">("roadmap");
  const onSelectRef = useRef(onSelectPin);
  onSelectRef.current = onSelectPin;
  const lat = focus?.lat ?? center.lat;
  const lng = focus?.lng ?? center.lng;

  useEffect(() => {
    if (!MAPS_API_KEY || !holder.current) return;
    let cancelled = false;

    loadMapsApi()
      .then(() => {
        if (cancelled || !holder.current || !window.google?.maps) return;
        const map = new google.maps.Map(holder.current, {
          center: { lat, lng },
          zoom,
          mapTypeId: mapType,
          styles: mapType === "roadmap" ? MACCA_MAP_STYLE : [],
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "cooperative",
          backgroundColor: "#ece8dd",
        });
        mapRef.current = map;

        const info = new google.maps.InfoWindow();
        infoRef.current = info;

        // Focused place — an "approximate area" disc + a prominent marker.
        if (focus) {
          const circle = new google.maps.Circle({
            map,
            center: { lat: focus.lat, lng: focus.lng },
            radius: focus.radiusM ?? 130,
            strokeColor: "#c0573a",
            strokeOpacity: 0.5,
            strokeWeight: 1.5,
            fillColor: "#c0573a",
            fillOpacity: 0.12,
          });
          // Frame the area with breathing room (extra room at the bottom for
          // the overlaid location card) so the disc never fills the viewport.
          const b = circle.getBounds();
          if (b) map.fitBounds(b, { top: 34, right: 34, bottom: 96, left: 34 });
          const fm = new google.maps.Marker({
            map,
            position: { lat: focus.lat, lng: focus.lng },
            title: focus.title,
            zIndex: 999,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#c0573a",
              fillOpacity: 1,
              strokeColor: "#f6f4ee",
              strokeWeight: 3,
            },
          });
          fm.addListener("click", () => {
            info.setContent(
              `<div style="font-family:system-ui;max-width:230px"><strong>${focus.title}</strong><br/><span style="font-size:11px;color:#7a7669">posizione a livello di area · in verifica</span></div>`
            );
            info.open({ map, anchor: fm });
          });
        }

        setState("ready");
      })
      .catch(() => !cancelled && setState("error"));

    return () => {
      cancelled = true;
    };
    // mapType/markers are handled by the effects below without rebuilding.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng, zoom, focus?.title, focus?.radiusM]);

  // Switch roadmap ⇄ satellite without recreating the map (markers persist).
  useEffect(() => {
    const m = mapRef.current;
    if (!m) return;
    m.setMapTypeId(mapType);
    m.setOptions({ styles: mapType === "roadmap" ? MACCA_MAP_STYLE : [] });
  }, [mapType, state]);

  // Draw/refresh markers (site anchors + work pins) without recreating the map,
  // so panning/zoom survives filter changes.
  const pinKey = workPins.map((p) => `${p.id}${p.label ? ":" + p.label : ""}`).join(",");
  const routeKey = (routeLine ?? []).map((p) => `${p.lat.toFixed(5)},${p.lng.toFixed(5)}`).join("|");
  useEffect(() => {
    const map = mapRef.current;
    const info = infoRef.current;
    if (state !== "ready" || !map || !window.google?.maps) return;

    for (const m of markersRef.current) m.setMap(null);
    markersRef.current = [];

    // Luoghi — secondary, hollow, so works read as the primary pins.
    if (sitePins) {
      for (const p of verifiedPins()) {
        const m = new google.maps.Marker({
          map,
          position: { lat: p.lat, lng: p.lng },
          title: p.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 6,
            fillColor: "#f6f4ee",
            fillOpacity: 1,
            strokeColor: "#4a5d4e",
            strokeWeight: 2,
          },
        });
        m.addListener("click", () => {
          info?.setContent(
            `<div style="font-family:system-ui;max-width:230px"><strong>${p.name}</strong><br/><span style="font-size:12px;color:#56524a">${p.confidence}</span><br/><span style="font-size:11px;color:#7a7669">${p.pinPolicy}</span></div>`
          );
          info?.open({ map, anchor: m });
        });
        markersRef.current.push(m);
      }
    }

    // Works — primary terracotta pins with a photo preview on click.
    const esc = (s: string) => s.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    for (const w of workPins) {
      const isSel = w.id === selectedId;
      const hasLabel = !!w.label;
      const m = new google.maps.Marker({
        map,
        position: { lat: w.lat, lng: w.lng },
        title: w.title,
        zIndex: isSel ? 998 : undefined,
        label: hasLabel
          ? { text: w.label as string, color: "#f6f4ee", fontSize: "11px", fontWeight: "700" }
          : undefined,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: hasLabel ? (isSel ? 14 : 12) : isSel ? 11 : 7,
          fillColor: isSel ? "#2f6f4e" : "#c0573a",
          fillOpacity: 1,
          strokeColor: "#f6f4ee",
          strokeWeight: isSel ? 3 : 2,
        },
      });
      m.addListener("click", () => {
        const sub = [w.subtitle, w.hamlet].filter(Boolean).map((s) => esc(s as string)).join(" · ");
        info?.setContent(
          `<div style="width:196px;font-family:system-ui">${
            w.image
              ? `<img src="${w.image}" alt="" style="width:100%;height:104px;object-fit:cover;border-radius:6px;display:block;margin-bottom:6px"/>`
              : ""
          }<div style="font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.15;color:#34322d">${esc(
            w.title
          )}</div>${
            sub ? `<div style="font-size:11.5px;color:#7a7669;margin-top:2px">${sub}</div>` : ""
          }${
            w.href
              ? `<a href="${w.href}" style="display:inline-block;margin-top:7px;font-size:12px;color:#c0573a;text-decoration:none">Apri scheda →</a>`
              : ""
          }</div>`
        );
        info?.open({ map, anchor: m });
        onSelectRef.current?.(w.id);
      });
      markersRef.current.push(m);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, pinKey, sitePins, selectedId]);

  // Walking route line — follows real pedestrian paths via the Directions
  // service, falling back to straight segments if it can't be reached (e.g.
  // the Directions API isn't enabled).
  useEffect(() => {
    const map = mapRef.current;
    if (state !== "ready" || !map || !window.google?.maps) return;
    let cancelled = false;

    const clear = () => {
      routePolyRef.current?.setMap(null);
      routePolyRef.current = null;
    };
    const draw = (path: google.maps.LatLngLiteral[] | google.maps.LatLng[]) => {
      clear();
      routePolyRef.current = new google.maps.Polyline({
        map,
        path,
        strokeColor: "#c0573a",
        strokeOpacity: 0.9,
        strokeWeight: 4,
      });
    };

    if (!routeLine || routeLine.length < 2) {
      clear();
      return;
    }

    const stops = routeLine.slice(0, 25); // Directions waypoint ceiling
    dirServiceRef.current ??= new google.maps.DirectionsService();
    dirServiceRef.current.route(
      {
        origin: stops[0],
        destination: stops[stops.length - 1],
        waypoints: stops.slice(1, -1).map((p) => ({ location: p, stopover: true })),
        travelMode: google.maps.TravelMode.WALKING,
      },
      (res, status) => {
        if (cancelled) return;
        if (status === google.maps.DirectionsStatus.OK && res?.routes[0]) {
          draw(res.routes[0].overview_path);
        } else {
          // Fallback: honest straight segments between stops.
          draw(routeLine);
        }
      }
    );

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, routeKey]);

  // Live "you are here" dot — updated in place, without redrawing the markers.
  useEffect(() => {
    const map = mapRef.current;
    if (state !== "ready" || !map || !window.google?.maps) return;
    if (!userPosition) {
      userMarkerRef.current?.setMap(null);
      userMarkerRef.current = null;
      return;
    }
    if (!userMarkerRef.current) {
      userMarkerRef.current = new google.maps.Marker({
        map,
        zIndex: 1000,
        title: "La tua posizione",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#2f6df0",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 3,
        },
      });
    }
    userMarkerRef.current.setPosition(userPosition);
    if (followUser) map.panTo(userPosition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPosition?.lat, userPosition?.lng, followUser, state]);

  if (!MAPS_API_KEY || state === "error") {
    return (
      <div
        className={clsx(
          "flex h-full w-full flex-col items-center justify-center gap-3 map-surface p-8 text-center",
          className
        )}
      >
        <span className="font-mono text-[10px] uppercase tracking-overline text-ink-60">
          Mappa reale · Google Maps
        </span>
        <p className="max-w-sm text-[14px] leading-relaxed text-ink-80">
          {state === "error"
            ? "La mappa non è raggiungibile in questo ambiente."
            : "Per attivare la mappa reale imposta la variabile"}{" "}
          {state !== "error" && (
            <code className="rounded bg-ink/10 px-1.5 py-0.5 font-mono text-[12px]">
              NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
            </code>
          )}
        </p>
        <a
          href={mapsSearchUrl("MACCA Peccioli PI, Italia")}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-ink bg-paper px-4 py-2 text-[13px] hover:bg-ink/[0.04] focus-ring"
        >
          Apri il territorio su Google Maps ↗
        </a>
        <p className="font-mono text-[10px] text-ink-40">
          Solo i siti con coordinate verificate diventano pin · mai un pin falso
        </p>
      </div>
    );
  }

  return (
    <div className={clsx("relative h-full w-full", className)}>
      <div ref={holder} className="h-full w-full" />
      {state === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center map-surface">
          <span className="font-mono text-[11px] text-ink-60">Caricamento mappa…</span>
        </div>
      )}
      {satelliteToggle && state === "ready" && (
        <div
          className={clsx(
            "absolute z-10 flex overflow-hidden rounded-full border border-ink bg-paper text-[11px] shadow-card",
            toggleClassName ?? "right-2 top-2"
          )}
        >
          {(["roadmap", "hybrid"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setMapType(t)}
              aria-pressed={mapType === t}
              className={clsx(
                "px-3 py-1 transition-colors focus-ring",
                mapType === t ? "bg-ink text-paper" : "text-ink-80 hover:text-ink"
              )}
            >
              {t === "hybrid" ? "Satellite" : "Mappa"}
            </button>
          ))}
        </div>
      )}
      {footnote && (
        <div className="pointer-events-none absolute bottom-2 left-2 rounded-md bg-paper/90 px-2 py-1 font-mono text-[9px] text-ink-60">
          pin = coordinate verificate · opere in verifica sulla mappa stilizzata
        </div>
      )}
    </div>
  );
}
