"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { GoogleTerritoryMap } from "@/components/google-map";
import { WorkPhoto } from "@/components/work-image";
import { Overline } from "@/components/ui";
import { useItinerary } from "@/components/use-itinerary";
import { NavigationClient } from "./navigation-client";
import { works, workBySlug } from "@/lib/collection";
import {
  PECCIOLI_CENTER,
  workMapPins,
  workMapCenter,
  orderFromStart,
  formatDistance,
  mapsRouteUrl,
  workQuery,
} from "@/lib/maps";
import { clsx } from "@/lib/clsx";

type Start = { kind: "me" } | { kind: "peccioli" } | { kind: "work"; slug: string };

export default function ItineraryPage() {
  const { slugs, remove, clear } = useItinerary();
  const items = useMemo(
    () => slugs.map((s) => workBySlug(s)).filter((w): w is NonNullable<typeof w> => Boolean(w)),
    [slugs]
  );

  const [start, setStart] = useState<Start>({ kind: "peccioli" });
  const [navigating, setNavigating] = useState(false);
  const [me, setMe] = useState<{ lat: number; lng: number } | null>(null);
  const [geoBusy, setGeoBusy] = useState(false);
  const [geoErr, setGeoErr] = useState<string | null>(null);

  const locate = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoErr("Geolocalizzazione non disponibile su questo dispositivo.");
      return;
    }
    setGeoBusy(true);
    setGeoErr(null);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setMe({ lat: p.coords.latitude, lng: p.coords.longitude });
        setStart({ kind: "me" });
        setGeoBusy(false);
      },
      () => {
        setGeoErr("Non riesco a leggere la tua posizione. Controlla i permessi.");
        setGeoBusy(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Resolve the start point + the first (fixed) stop, if the start is a work.
  const startWork = start.kind === "work" ? workBySlug(start.slug) : undefined;
  const startPoint =
    start.kind === "me" && me
      ? me
      : startWork
      ? workMapCenter(startWork)
      : PECCIOLI_CENTER;

  const toOrder = startWork ? items.filter((w) => w.slug !== startWork.slug) : items;
  const ordered = orderFromStart(startPoint, toOrder);
  const totalMeters = ordered.length ? ordered[ordered.length - 1].total : 0;

  // Display stops with the leg distance from the previous LISTED stop.
  const displayStops: { work: typeof items[number]; leg: number | null }[] = startWork
    ? [{ work: startWork, leg: null }, ...ordered.map((o) => ({ work: o.work, leg: o.leg }))]
    : ordered.map((o, i) => ({ work: o.work, leg: i === 0 ? null : o.leg }));
  const orderedWorks = displayStops.map((s) => s.work);
  const gmapsUrl = orderedWorks.length ? mapsRouteUrl(orderedWorks.map((w) => workQuery(w))) : undefined;

  const pins = useMemo(() => workMapPins(items), [items]);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="border-b border-ink/80">
          <div className="mx-auto max-w-[1100px] px-5 py-10 md:px-8">
            <Overline>Il mio itinerario</Overline>
            <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">Itinerario personalizzato</h1>
            <p className="mt-4 max-w-xl text-[15px] text-ink-60">
              Le opere che hai aggiunto, ordinate a piedi dal punto di partenza che scegli — la tua posizione,
              il centro di Peccioli o una delle opere.
            </p>
          </div>
        </section>

        {items.length === 0 ? (
          <section className="mx-auto max-w-[1100px] px-5 py-16 text-center md:px-8">
            <p className="text-[15px] text-ink-60">
              Il tuo itinerario è vuoto. Aggiungi opere con “＋ Aggiungi all’itinerario” dalle schede.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/esplora" className="rounded-lg border border-ink bg-terracotta px-5 py-2.5 text-sm text-paper hover:bg-terracotta-dark focus-ring">
                Esplora la mappa →
              </Link>
              <Link href="/collezione" className="rounded-lg border border-ink bg-paper px-5 py-2.5 text-sm hover:bg-ink/[0.04] focus-ring">
                Sfoglia la collezione
              </Link>
            </div>
          </section>
        ) : (
          <section className="mx-auto grid max-w-[1100px] gap-8 px-5 py-10 md:grid-cols-[1fr_0.9fr] md:px-8">
            {/* Left: start + ordered stops */}
            <div>
              <Overline>Partenza</Overline>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={locate}
                  aria-pressed={start.kind === "me"}
                  className={clsx(
                    "rounded-full border border-ink px-3.5 py-1.5 text-[13px] transition-colors focus-ring",
                    start.kind === "me" ? "bg-ink text-paper" : "bg-paper hover:bg-ink/[0.04]"
                  )}
                >
                  {geoBusy ? "Localizzo…" : "◉ La mia posizione"}
                </button>
                <button
                  onClick={() => setStart({ kind: "peccioli" })}
                  aria-pressed={start.kind === "peccioli"}
                  className={clsx(
                    "rounded-full border border-ink px-3.5 py-1.5 text-[13px] transition-colors focus-ring",
                    start.kind === "peccioli" ? "bg-ink text-paper" : "bg-paper hover:bg-ink/[0.04]"
                  )}
                >
                  Centro di Peccioli
                </button>
                <select
                  value={start.kind === "work" ? start.slug : ""}
                  onChange={(e) => e.target.value && setStart({ kind: "work", slug: e.target.value })}
                  className="rounded-full border border-ink bg-paper px-3.5 py-1.5 text-[13px] focus-ring"
                  aria-label="Parti da un'opera"
                >
                  <option value="">Da un’opera…</option>
                  {items.map((w) => (
                    <option key={w.slug} value={w.slug}>
                      {w.title}
                    </option>
                  ))}
                </select>
              </div>
              {geoErr && <p className="mt-2 text-[12px] text-terracotta">{geoErr}</p>}

              <div className="mt-6 flex items-center justify-between">
                <Overline>Tappe · {orderedWorks.length}</Overline>
                <span className="font-mono text-[11px] text-ink-60">totale ≈ {formatDistance(totalMeters)}</span>
              </div>

              <ol className="mt-3 flex flex-col gap-2">
                {displayStops.map(({ work: w, leg }, i) => {
                  return (
                    <li key={w.slug} className="flex items-center gap-3 rounded-xl border border-ink/20 bg-paper p-2.5 shadow-card">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-ink font-mono text-[12px]">
                        {i + 1}
                      </span>
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md border border-ink/20">
                        {w.heroImage ? (
                          <WorkPhoto image={w.heroImage} alt={w.title} className="h-full w-full" showCredit={false} />
                        ) : (
                          <div className="h-full w-full hatch" />
                        )}
                      </div>
                      <Link href={`/opere/${w.slug}`} className="min-w-0 flex-1 focus-ring">
                        <div className="truncate font-serif text-[15px] leading-tight">{w.title}</div>
                        <div className="truncate text-[12px] text-ink-60">
                          {w.artist} · {w.hamletArea}
                          {leg != null && ` · +${formatDistance(leg)}`}
                        </div>
                      </Link>
                      <button
                        onClick={() => remove(w.slug)}
                        aria-label={`Rimuovi ${w.title}`}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink text-[15px] focus-ring"
                      >
                        −
                      </button>
                    </li>
                  );
                })}
              </ol>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  onClick={() => setNavigating(true)}
                  className="rounded-lg border border-ink bg-terracotta px-4 py-2.5 text-sm font-medium text-paper hover:bg-terracotta-dark focus-ring"
                >
                  ▶ Avvia navigazione
                </button>
                {gmapsUrl && (
                  <a
                    href={gmapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-ink bg-paper px-4 py-2.5 text-sm font-medium hover:bg-ink/[0.04] focus-ring"
                  >
                    Google Maps ↗
                  </a>
                )}
                <button
                  onClick={clear}
                  className="rounded-lg border border-ink bg-paper px-4 py-2.5 text-sm hover:bg-ink/[0.04] focus-ring"
                >
                  Svuota
                </button>
              </div>
            </div>

            {/* Right: map */}
            <div className="relative min-h-[360px] overflow-hidden rounded-xl border border-ink/80 md:sticky md:top-4 md:h-[70vh]">
              <GoogleTerritoryMap
                workPins={pins}
                sitePins={false}
                footnote={false}
                center={startPoint}
                zoom={15}
                className="absolute inset-0"
              />
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
      {navigating && orderedWorks.length > 0 && (
        <NavigationClient stops={orderedWorks} onExit={() => setNavigating(false)} />
      )}
    </>
  );
}
