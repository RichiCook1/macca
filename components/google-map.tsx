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

/** Extra work pin (only for overlay-verified coordinates). */
export interface WorkPin {
  id: string;
  title: string;
  lat: number;
  lng: number;
  confidence?: string;
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
  footnote = true,
}: {
  workPins?: WorkPin[];
  className?: string;
  zoom?: number;
  /** Map centre — defaults to Peccioli. */
  center?: { lat: number; lng: number };
  /** Show the in-map Mappa/Satellite switch. */
  satelliteToggle?: boolean;
  /** Show the "pin = verified coordinates" footnote (hidden on tight previews). */
  footnote?: boolean;
}) {
  const holder = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [state, setState] = useState<LoadState>(MAPS_API_KEY ? "loading" : "idle");
  const [mapType, setMapType] = useState<"roadmap" | "hybrid">("roadmap");
  const { lat, lng } = center;

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

        // Verified site anchors from the seed (never per-work false pins).
        for (const p of verifiedPins()) {
          const m = new google.maps.Marker({
            map,
            position: { lat: p.lat, lng: p.lng },
            title: p.name,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 9,
              fillColor: "#c0573a",
              fillOpacity: 1,
              strokeColor: "#34322d",
              strokeWeight: 2,
            },
          });
          m.addListener("click", () => {
            info.setContent(
              `<div style="font-family:system-ui;max-width:230px"><strong>${p.name}</strong><br/><span style="font-size:12px;color:#56524a">${p.confidence}</span><br/><span style="font-size:11px;color:#7a7669">${p.pinPolicy}</span></div>`
            );
            info.open({ map, anchor: m });
          });
        }

        for (const w of workPins) {
          const m = new google.maps.Marker({
            map,
            position: { lat: w.lat, lng: w.lng },
            title: w.title,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 7,
              fillColor: "#4a5d4e",
              fillOpacity: 1,
              strokeColor: "#f6f4ee",
              strokeWeight: 2,
            },
          });
          m.addListener("click", () => {
            info.setContent(
              `<div style="font-family:system-ui"><strong>${w.title}</strong>${w.confidence ? `<br/><span style="font-size:12px;color:#56524a">${w.confidence}</span>` : ""}</div>`
            );
            info.open({ map, anchor: m });
          });
        }

        setState("ready");
      })
      .catch(() => !cancelled && setState("error"));

    return () => {
      cancelled = true;
    };
    // mapType is applied by the effect below without rebuilding the map.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng, zoom, workPins]);

  // Switch roadmap ⇄ satellite without recreating the map (markers persist).
  useEffect(() => {
    const m = mapRef.current;
    if (!m) return;
    m.setMapTypeId(mapType);
    m.setOptions({ styles: mapType === "roadmap" ? MACCA_MAP_STYLE : [] });
  }, [mapType, state]);

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
        <div className="absolute right-2 top-2 z-10 flex overflow-hidden rounded-full border border-ink bg-paper text-[11px] shadow-card">
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
