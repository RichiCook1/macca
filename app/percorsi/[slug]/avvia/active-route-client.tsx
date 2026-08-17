"use client";

import { useState } from "react";
import Link from "next/link";
import { StylizedMap } from "@/components/stylized-map";
import { AccessBadge, FallbackNote } from "@/components/badges";
import { HatchImage } from "@/components/ui";
import { works } from "@/lib/collection";
import type { AccessState, MapPoint, Work } from "@/lib/types";

export interface ActiveStop {
  /** Stable local identity (the raw stop string). */
  key: string;
  title: string;
  artistName?: string;
  /** Only present when the stop resolves to a work. */
  accessState?: AccessState;
  accessRaw?: string;
  workSlug?: string;
  point?: MapPoint;
}

interface ActiveRouteClientProps {
  routeTitle: string;
  modeLabel: string; // e.g. "Walking · ~2h · 8 tappe"
  routeSlug: string;
  trace: MapPoint[];
  night?: boolean;
  /** Index of the stop the route starts from (initial value; advancing is local state). */
  currentIndex: number;
  stops: ActiveStop[];
  /** Real Google Maps multi-stop walking directions (built from seed addresses). */
  gmapsUrl?: string;
}

/**
 * Mobile active-route screen (frame A6). The upcoming-stops list is editable:
 * stops can be removed or added locally (inline picker over the collection),
 * and "Continua" advances through the stops until the route is completed.
 * This is local UI state only — it does not persist or mutate the route data.
 * Stops that don't resolve to a work still appear, using their raw label (no
 * fabricated artist/access data).
 */
export function ActiveRouteClient({
  routeTitle,
  modeLabel,
  routeSlug,
  trace,
  night = false,
  currentIndex: initialIndex,
  stops,
  gmapsUrl,
}: ActiveRouteClientProps) {
  const [list, setList] = useState(stops);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [completed, setCompleted] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const total = list.length;
  // Clamp in case local edits shrank the list below the current index.
  const idx = Math.min(currentIndex, Math.max(total - 1, 0));
  const current = list[idx];
  const upcoming = list.slice(idx + 1);

  // Markers for every stop with a resolvable point, each numbered by its
  // position in the FULL list so map numbers match the visible stop numbers
  // even when cluster/optional stops don't resolve to a point.
  const routeStops: (MapPoint & { n: number })[] = list
    .map((s, i) => (s.point ? { ...s.point, n: i + 1 } : null))
    .filter((p): p is MapPoint & { n: number } => Boolean(p));

  // The trace follows the CURRENT (locally edited) list, so removed/added
  // stops stay in sync; fall back to the route's static trace when too few
  // stops resolve to a point.
  const liveTrace = routeStops.length >= 2 ? routeStops : trace;

  const remove = (key: string) =>
    setList((prev) => prev.filter((s) => s.key !== key));

  const advance = () => {
    if (idx >= total - 1) setCompleted(true);
    else setCurrentIndex(idx + 1);
  };

  // Add-a-stop candidates: works not already in the route, preferring the
  // same areas as the route's resolvable stops.
  const inList = new Set(
    list.map((s) => s.workSlug).filter((s): s is string => Boolean(s))
  );
  const routeAreas = new Set(
    works.filter((w) => inList.has(w.slug)).map((w) => w.area)
  );
  const notInRoute = works.filter((w) => !inList.has(w.slug));
  const sameArea = notInRoute.filter((w) => routeAreas.has(w.area));
  const candidates = (sameArea.length ? sameArea : notInRoute).slice(0, 8);

  const addStop = (w: Work) => {
    setList((prev) => [
      ...prev,
      {
        key: w.slug,
        title: w.title,
        artistName: w.artist,
        accessState: w.accessState,
        accessRaw: w.accessRaw,
        workSlug: w.slug,
        point: w.point,
      },
    ]);
    setShowAdd(false);
    setCompleted(false);
  };

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-[420px] flex-col border-x border-ink/15 bg-paper">
      {/* Top bar */}
      <header className="flex items-center gap-3 border-b border-ink/80 px-4 py-3">
        <a
          href="../"
          aria-label="Torna al percorso"
          className="text-xl leading-none text-ink focus-ring"
        >
          ‹
        </a>
        <div className="min-w-0">
          <div className="truncate font-serif text-[17px] leading-tight">
            {routeTitle}
          </div>
          <div className="mt-0.5 font-mono text-[10px] text-ink-60">
            {modeLabel}
          </div>
        </div>
      </header>

      {/* Map band */}
      <div className="h-[180px] shrink-0 border-b border-ink/80">
        <StylizedMap
          trace={liveTrace}
          routeStops={routeStops}
          selectedSlug={null}
          night={night}
          showLabels={false}
          showHamlets={false}
        >
          {/* Highlight the current stop with a selected route-stop marker. */}
          {current?.point && (
            <div
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${(current.point.x / 1000) * 100}%`,
                top: `${(current.point.y / 640) * 100}%`,
                zIndex: 40,
              }}
            >
              <span className="flex h-[28px] w-[28px] items-center justify-center rounded-full border-2 border-paper bg-terracotta text-xs font-bold text-paper shadow-[0_0_0_2px_#34322d]">
                {idx + 1}
              </span>
            </div>
          )}
        </StylizedMap>
      </div>

      {/* CTA — directly under the map */}
      <div className="flex shrink-0 border-b border-ink/80">
        {completed ? (
          <div className="flex h-[54px] flex-1 items-center justify-center gap-3 bg-ink text-[15px] text-paper">
            Percorso completato ✓
            <Link
              href={`/percorsi/${routeSlug}`}
              className="text-[13px] text-paper/80 underline underline-offset-2 hover:text-paper focus-ring"
            >
              Torna al percorso
            </Link>
          </div>
        ) : (
          <button
            type="button"
            onClick={advance}
            className="flex h-[54px] flex-1 items-center justify-center bg-terracotta text-[15px] text-paper transition-colors hover:bg-terracotta-dark focus-ring"
          >
            {idx >= total - 1 ? "Concludi il percorso ✓" : "Continua il percorso →"}
          </button>
        )}
        {gmapsUrl && (
          <a
            href={gmapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Apri il percorso in Google Maps"
            className="flex h-[54px] w-[92px] items-center justify-center border-l border-ink bg-paper font-mono text-[10px] uppercase tracking-overline text-ink transition-colors hover:bg-ink/[0.04] focus-ring"
          >
            Maps ↗
          </a>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-3">
        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="overline">
            Tappa {idx + 1} di {total} · {completed ? "completato" : "in corso"}
          </span>
        </div>

        {/* Current stop card */}
        {current && (
          <div className="flex overflow-hidden rounded-lg border border-ink/80">
            <HatchImage
              label={`${current.title} — segnaposto`}
              className="w-[70px] shrink-0 border-r border-ink/80"
            />
            <div className="flex-1 p-3">
              <div className="text-[14px] leading-snug">{current.title}</div>
              {current.artistName && (
                <div className="mt-0.5 text-[11px] text-ink-60">
                  {current.artistName}
                </div>
              )}
              <div className="mt-2">
                {current.accessState ? (
                  <AccessBadge
                    state={current.accessState}
                    raw={current.accessRaw}
                    size="sm"
                  />
                ) : (
                  <FallbackNote>Riferimento di sito · cluster</FallbackNote>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Prossime tappe header + add action */}
        <div className="mt-1 flex items-center justify-between">
          <span className="overline">Prossime tappe</span>
          <button
            type="button"
            onClick={() => setShowAdd((v) => !v)}
            aria-expanded={showAdd}
            className="flex items-center gap-1 text-[12px] text-terracotta focus-ring"
          >
            ＋ Aggiungi
          </button>
        </div>

        {/* Editable upcoming list */}
        <ul className="flex flex-col gap-2.5">
          {upcoming.map((s, i) => (
            <li key={s.key} className="flex items-center gap-3">
              <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 border-ink text-[11px] font-bold">
                {idx + 2 + i}
              </span>
              <span className="min-w-0 flex-1 truncate text-[13px] text-ink-80">
                {s.title}
                {s.artistName ? ` · ${s.artistName}` : ""}
              </span>
              <button
                type="button"
                onClick={() => remove(s.key)}
                aria-label={`Rimuovi ${s.title} dal percorso`}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink text-[15px] focus-ring"
              >
                −
              </button>
            </li>
          ))}

          {/* Add a stop row */}
          <li>
            <button
              type="button"
              onClick={() => setShowAdd((v) => !v)}
              aria-expanded={showAdd}
              className="flex w-full items-center gap-3 rounded-lg border border-dashed border-ink px-3 py-2.5 text-left text-ink-80 focus-ring"
            >
              <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border border-dashed border-ink text-[15px]">
                ＋
              </span>
              <span className="text-[13px]">
                Aggiungi una tappa al percorso
              </span>
            </button>

            {/* Minimal inline picker — works not already in the route. */}
            {showAdd && (
              <div className="mt-2 overflow-hidden rounded-lg border border-ink/20">
                {candidates.length === 0 ? (
                  <div className="px-3 py-2.5 text-[12px] text-ink-60">
                    Nessuna altra opera disponibile
                  </div>
                ) : (
                  <ul className="divide-y divide-ink/10">
                    {candidates.map((w) => (
                      <li key={w.slug}>
                        <button
                          type="button"
                          onClick={() => addStop(w)}
                          className="flex w-full items-baseline justify-between gap-3 px-3 py-2.5 text-left transition-colors hover:bg-ink/[0.03] focus-ring"
                        >
                          <span className="min-w-0 flex-1 truncate text-[13px]">
                            {w.title}
                          </span>
                          <span className="shrink-0 text-[11px] text-ink-60">
                            {w.artist}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </li>
        </ul>
      </div>

    </div>
  );
}
