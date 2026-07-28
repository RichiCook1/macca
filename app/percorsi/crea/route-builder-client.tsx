"use client";

import { useMemo, useState } from "react";
import { works } from "@/lib/works";
import { artistBySlug } from "@/lib/artists";
import type { MapPoint, Work } from "@/lib/types";
import { StylizedMap } from "@/components/stylized-map";
import { mapsRouteUrl, workQuery } from "@/lib/maps";
import { clsx } from "@/lib/clsx";

// Parcheggio / partenza — entrance of Peccioli.
const START: MapPoint = { x: 440, y: 360 };

// Walkable selection: works around Peccioli and its near frazioni.
const selectable = works.filter((w) =>
  ["peccioli", "ghizzano", "le-serre"].includes(w.area)
);

// Default pre-selection: a few flagship works to seed the builder.
const DEFAULT = new Set(
  (selectable.filter((w) => w.isFlagship).slice(0, 4).length
    ? selectable.filter((w) => w.isFlagship).slice(0, 4)
    : selectable.slice(0, 4)
  ).map((w) => w.slug)
);

const M_PER_PX = 3.2; // abstract scale → metres
const WALK_M_PER_MIN = 70;
const DWELL_MIN = 6;

function optimise(start: MapPoint, picks: Work[]): Work[] {
  const remaining = [...picks];
  let cur = start;
  const order: Work[] = [];
  while (remaining.length) {
    let best = 0;
    let bestD = Infinity;
    remaining.forEach((p, i) => {
      const d = (p.point.x - cur.x) ** 2 + (p.point.y - cur.y) ** 2;
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    order.push(remaining[best]);
    cur = remaining[best].point;
    remaining.splice(best, 1);
  }
  return order;
}

export function RouteBuilderClient() {
  const [selected, setSelected] = useState<Set<string>>(new Set(DEFAULT));
  const [generated, setGenerated] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggle = (slug: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
    setGenerated(false);
  };

  const picks = selectable.filter((w) => selected.has(w.slug));

  const { order, trace, stops, meters, mins } = useMemo(() => {
    const order = optimise(START, picks);
    const pts = [START, ...order.map((o) => o.point)];
    let distPx = 0;
    for (let i = 1; i < pts.length; i++) {
      distPx += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    }
    const meters = Math.round((distPx * M_PER_PX) / 10) * 10;
    const stops = order.length;
    const mins = stops ? Math.round(meters / WALK_M_PER_MIN) + DWELL_MIN * stops : 0;
    return { order, trace: pts, stops, meters, mins };
  }, [picks]);

  const show = generated && stops > 0;

  const saveRoute = () => {
    try {
      localStorage.setItem(
        "macca:custom-route",
        JSON.stringify({ slugs: order.map((w) => w.slug), savedAt: Date.now() })
      );
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch {
      // localStorage unavailable (private mode) — fail quietly.
    }
  };

  const hasVerifying = picks.some((w) => w.mapConfidence === "area" || w.mapConfidence === "external");
  const distLabel = meters >= 1000 ? `${(meters / 1000).toFixed(1)} km*` : `${meters} m*`;

  return (
    <div className="overflow-hidden rounded-xl border border-ink/80 bg-paper shadow-raised">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-ink/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-serif text-xl leading-none">Costruttore di percorso</div>
          <div className="mt-1 font-mono text-[11px] text-ink-60">
            {selected.size} {selected.size === 1 ? "opera selezionata" : "opere selezionate"}
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setSelected(new Set());
              setGenerated(false);
            }}
            className="rounded-lg border border-ink px-4 py-2.5 text-sm hover:bg-ink/[0.04] focus-ring"
          >
            Azzera
          </button>
          <button
            onClick={() => stops && setGenerated(true)}
            disabled={!stops}
            className={clsx(
              "rounded-lg border border-ink px-5 py-2.5 text-sm focus-ring",
              stops ? "bg-terracotta text-paper hover:bg-terracotta-dark" : "cursor-not-allowed bg-stone-200 text-ink-40"
            )}
          >
            Genera percorso →
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,46%)_1fr]">
        {/* Selection list */}
        <div className="flex flex-col border-b border-ink/80 lg:border-b-0 lg:border-r">
          <div className="overline border-b border-ink/15 px-5 py-3">
            Opere · tocca per selezionare
          </div>
          <div className="flex max-h-[420px] flex-col gap-2 overflow-y-auto p-4">
            {selectable.map((w) => {
              const on = selected.has(w.slug);
              const artist = artistBySlug(w.artistSlug);
              return (
                <button
                  key={w.slug}
                  onClick={() => toggle(w.slug)}
                  aria-pressed={on}
                  className={clsx(
                    "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors focus-ring",
                    on ? "border-l-4 border-terracotta bg-terracotta-tint" : "border-ink/30 bg-paper hover:border-ink"
                  )}
                >
                  <span
                    className={clsx(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-[13px]",
                      on ? "border-ink bg-terracotta text-paper" : "border-ink/60 bg-paper text-transparent"
                    )}
                  >
                    ✓
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm">{w.title}</span>
                    <span className="block text-[11px] text-ink-60">
                      {w.artist} · {w.year}
                    </span>
                  </span>
                  {(w.mapConfidence === "area" || w.mapConfidence === "external") && (
                    <span className="shrink-0 font-mono text-[8px] text-ink-40">in verifica</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Map + stats */}
        <div className="flex flex-col">
          <div className="relative h-[360px] lg:h-[420px]">
            <StylizedMap
              works={picks}
              trace={show ? trace : undefined}
              routeStops={show ? order.map((o) => o.point) : undefined}
              start={START}
              showLabels={false}
            />
            {!show && (
              <div className="absolute inset-x-0 bottom-4 flex justify-center">
                <span className="rounded-full border border-ink bg-paper/95 px-4 py-2 text-[12px]">
                  Seleziona le opere e genera il percorso →
                </span>
              </div>
            )}
          </div>

          {show && (
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-ink/80 bg-terracotta-tint px-5 py-3.5">
              <div className="flex gap-6 font-mono">
                <Stat label="Tappe" value={`${stops}`} />
                <Stat label="A piedi (stima)" value={`${mins} min*`} />
                <Stat label="Distanza" value={distLabel} />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={saveRoute}
                  className="rounded-lg border border-ink bg-paper px-3 py-2 text-[13px] transition-colors hover:bg-ink/[0.04] focus-ring"
                >
                  {saved ? "Salvato ✓" : "♡ Salva"}
                </button>
                <a
                  href={mapsRouteUrl(order.map((w) => workQuery(w)))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-ink bg-terracotta px-3 py-2 text-[13px] text-paper transition-colors hover:bg-terracotta-dark focus-ring"
                >
                  Avvia →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ordered list */}
      {show && (
        <div className="border-t border-ink/80 px-5 py-5">
          <div className="overline">Il tuo percorso · in ordine</div>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {order.map((w, i) => {
              const artist = artistBySlug(w.artistSlug);
              return (
                <div
                  key={w.slug}
                  className="flex items-center gap-2.5 rounded-lg border border-ink/30 bg-paper px-3 py-2"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-[12px] font-bold text-paper">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block text-[13px]">{w.title}</span>
                    <span className="block text-[10px] text-ink-60">{artist?.name}</span>
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 font-mono text-[10px] text-ink-40">
            * tempi e distanze sono stime dimostrative su mappa astratta — non misurazioni reali ·
            ordine ottimizzato a piedi dal parcheggio · da verificare sul campo
            {hasVerifying && " · alcune opere senza posizione esatta sono segnalate ma incluse"}
          </p>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="overline">{label}</div>
      <div className="mt-0.5 text-[17px]">{value}</div>
    </div>
  );
}
