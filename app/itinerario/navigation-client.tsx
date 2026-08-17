"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { GoogleTerritoryMap } from "@/components/google-map";
import { WorkPhoto } from "@/components/work-image";
import type { Work } from "@/lib/types";
import { workMapCenter, distanceMeters, formatDistance } from "@/lib/maps";
import { clsx } from "@/lib/clsx";

/** In-app guided walking: live position, route line, numbered stops, progress. */
export function NavigationClient({ stops, onExit }: { stops: Work[]; onExit: () => void }) {
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);
  const [geoErr, setGeoErr] = useState<string | null>(null);
  const [targetIdx, setTargetIdx] = useState(0);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoErr("Geolocalizzazione non disponibile.");
      return;
    }
    const id = navigator.geolocation.watchPosition(
      (p) => {
        setPos({ lat: p.coords.latitude, lng: p.coords.longitude });
        setGeoErr(null);
      },
      () => setGeoErr("Attiva i permessi di posizione per la navigazione."),
      { enableHighAccuracy: true, maximumAge: 4000, timeout: 12000 }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  const target = stops[targetIdx];
  const targetPoint = target ? workMapCenter(target) : null;
  const distToTarget = pos && targetPoint ? distanceMeters(pos, targetPoint) : null;
  const arrived = distToTarget != null && distToTarget < 30;
  const isLast = targetIdx >= stops.length - 1;

  const routeLine = useMemo(() => stops.map((w) => workMapCenter(w)), [stops]);
  const pins = useMemo(
    () =>
      stops.map((w, i) => {
        const c = workMapCenter(w);
        return {
          id: w.slug,
          title: w.title,
          lat: c.lat,
          lng: c.lng,
          image: w.heroImage?.src,
          subtitle: `${w.artist} · ${w.year}`,
          hamlet: w.hamletArea,
          href: `/opere/${w.slug}`,
          label: String(i + 1),
        };
      }),
    [stops]
  );

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-paper">
      {/* Top bar */}
      <header className="flex items-center gap-3 border-b border-ink/80 px-4 py-3">
        <button onClick={onExit} aria-label="Termina navigazione" className="text-xl leading-none text-ink focus-ring">
          ✕
        </button>
        <div className="min-w-0 flex-1">
          <div className="truncate font-serif text-[16px] leading-tight">Navigazione · Tappa {targetIdx + 1} di {stops.length}</div>
          <div className="mt-0.5 font-mono text-[10px] text-ink-60">
            {geoErr ? geoErr : distToTarget != null ? `a ~${formatDistance(distToTarget)} dalla tappa` : "in attesa della posizione…"}
          </div>
        </div>
      </header>

      {/* Map */}
      <div className="relative min-h-0 flex-1">
        <GoogleTerritoryMap
          className="absolute inset-0"
          workPins={pins}
          sitePins={false}
          footnote={false}
          selectedId={target?.slug}
          routeLine={routeLine}
          userPosition={pos}
          followUser
          center={pos ?? targetPoint ?? undefined}
          zoom={16}
          toggleClassName="right-3 top-3"
        />
      </div>

      {/* Bottom panel — current target */}
      <div className="border-t border-ink/80 p-4">
        {target && (
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-ink/20">
              {target.heroImage ? (
                <WorkPhoto image={target.heroImage} alt={target.title} className="h-full w-full" showCredit={false} />
              ) : (
                <div className="h-full w-full hatch" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <Link href={`/opere/${target.slug}`} className="truncate font-serif text-[16px] leading-tight focus-ring">
                {target.title}
              </Link>
              <div className="truncate text-[12px] text-ink-60">
                {target.artist} · {target.hamletArea}
              </div>
            </div>
            {arrived && (
              <span className="shrink-0 rounded-full border border-cypress bg-cypress/10 px-2.5 py-1 font-mono text-[10px] text-cypress">
                sei arrivato
              </span>
            )}
          </div>
        )}

        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setTargetIdx((i) => Math.max(0, i - 1))}
            disabled={targetIdx === 0}
            className="shrink-0 rounded-lg border border-ink bg-paper px-3.5 py-2.5 text-sm disabled:opacity-40 focus-ring"
          >
            ‹ Tappa precedente
          </button>
          {isLast ? (
            <button
              onClick={onExit}
              className={clsx(
                "flex-1 rounded-lg border border-ink px-4 py-2.5 text-sm font-medium text-paper focus-ring",
                arrived ? "bg-cypress" : "bg-ink"
              )}
            >
              Concludi il percorso ✓
            </button>
          ) : (
            <button
              onClick={() => setTargetIdx((i) => Math.min(stops.length - 1, i + 1))}
              className={clsx(
                "flex-1 rounded-lg border border-ink px-4 py-2.5 text-sm font-medium text-paper transition-colors focus-ring",
                arrived ? "bg-cypress hover:bg-cypress/90" : "bg-terracotta hover:bg-terracotta-dark"
              )}
            >
              {arrived ? "Prossima tappa ✓ →" : "Prossima tappa →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
