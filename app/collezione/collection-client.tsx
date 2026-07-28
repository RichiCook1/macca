"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { StylizedMap, MapLegend } from "@/components/stylized-map";
import { useModalBehavior } from "@/components/use-modal";
import { WorkCard, MapResultCard } from "@/components/work-card";
import { Chip, Overline } from "@/components/ui";
import { works, mapAreas } from "@/lib/collection";
import { accessMeta, decadeLabel } from "@/lib/constants";
import type { Work, AreaSlug, Category, AccessState } from "@/lib/types";
import { clsx } from "@/lib/clsx";

type View = "griglia" | "lista" | "mappa";

const areaName = (a: AreaSlug) => mapAreas.find((m) => m.slug === a)?.name ?? a;

// Facets are derived from the works actually present, so we never show an empty
// chip. Order is editorial, not alphabetical.
const facetOrder = {
  area: ["peccioli", "ghizzano", "legoli", "belvedere", "fabbrica", "le-serre", "cedri"] as AreaSlug[],
  tipo: ["Scultura", "Pittura/Colore", "Luce", "Voce/Suono", "Installazione", "Architettura", "Video"] as Category[],
  decade: ["1991-2000", "2001-2010", "2011-2020", "2021-oggi"] as Work["decade"][],
  accesso: ["public-exterior", "dependent-hours", "booking", "church", "semi-public", "mixed", "confirm"] as AccessState[],
};

interface Filters {
  area: Set<AreaSlug>;
  tipo: Set<Category>;
  decade: Set<string>;
  accesso: Set<AccessState>;
  /** Editorial quick filters. */
  landscape: boolean;
  night: boolean;
}

const emptyFilters = (): Filters => ({
  area: new Set(),
  tipo: new Set(),
  decade: new Set(),
  accesso: new Set(),
  landscape: false,
  night: false,
});

function countActive(f: Filters) {
  return (
    f.area.size +
    f.tipo.size +
    f.decade.size +
    f.accesso.size +
    (f.landscape ? 1 : 0) +
    (f.night ? 1 : 0)
  );
}

export function CollectionClient() {
  const [view, setView] = useState<View>("griglia");
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);
  const drawerRef = useModalBehavior(drawerOpen, closeDrawer);

  // Only surface facet values that exist in the data.
  const facets = useMemo(() => {
    const has = (sel: (w: Work) => unknown) => new Set(works.map(sel));
    const areaSet = has((w) => w.area);
    const tipoSet = has((w) => w.category);
    const decSet = has((w) => w.decade);
    const accSet = has((w) => w.accessState);
    return {
      area: facetOrder.area.filter((a) => areaSet.has(a)),
      tipo: facetOrder.tipo.filter((t) => tipoSet.has(t)),
      decade: facetOrder.decade.filter((d) => decSet.has(d)),
      accesso: facetOrder.accesso.filter((a) => accSet.has(a)),
    };
  }, []);

  // Filtering: AND across facet types, OR within a facet.
  const filtered = useMemo(() => {
    return works.filter((w) => {
      if (filters.area.size && !filters.area.has(w.area)) return false;
      if (filters.tipo.size && !filters.tipo.has(w.category)) return false;
      if (filters.decade.size && !filters.decade.has(w.decade)) return false;
      if (filters.accesso.size && !filters.accesso.has(w.accessState)) return false;
      if (filters.landscape && w.accessClass !== "public-exterior") return false;
      if (filters.night && !w.nightView) return false;
      return true;
    });
  }, [filters]);

  const n = filtered.length;
  const active = countActive(filters);

  function toggle<K extends "area" | "tipo" | "decade" | "accesso">(
    key: K,
    value: Filters[K] extends Set<infer U> ? U : never
  ) {
    setFilters((prev) => {
      const set = new Set(prev[key] as Set<unknown>);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      return { ...prev, [key]: set } as Filters;
    });
  }

  function toggleFlag(key: "landscape" | "night") {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setFilters(emptyFilters());
  }

  // Removable active-filter chips (label + remove handler).
  const activeChips: { id: string; label: string; remove: () => void }[] = [];
  filters.area.forEach((a) =>
    activeChips.push({
      id: `area-${a}`,
      label: areaName(a),
      remove: () => toggle("area", a),
    })
  );
  filters.tipo.forEach((t) =>
    activeChips.push({ id: `tipo-${t}`, label: t, remove: () => toggle("tipo", t) })
  );
  filters.decade.forEach((d) =>
    activeChips.push({
      id: `dec-${d}`,
      label: decadeLabel[d] ?? d,
      remove: () => toggle("decade", d),
    })
  );
  filters.accesso.forEach((a) =>
    activeChips.push({
      id: `acc-${a}`,
      label: accessMeta[a].label,
      remove: () => toggle("accesso", a),
    })
  );
  if (filters.landscape)
    activeChips.push({
      id: "q-landscape",
      label: "Opere nel paesaggio",
      remove: () => toggleFlag("landscape"),
    });
  if (filters.night)
    activeChips.push({
      id: "q-night",
      label: "Dopo il tramonto",
      remove: () => toggleFlag("night"),
    });

  // Shared chip groups, rendered both inline (desktop) and in the drawer (mobile).
  const FacetGroups = () => (
    <div className="space-y-4">
      <FacetRow label="Area">
        {facets.area.map((a) => (
          <Chip key={a} active={filters.area.has(a)} onClick={() => toggle("area", a)}>
            {areaName(a)}
          </Chip>
        ))}
      </FacetRow>
      <FacetRow label="Tipo">
        {facets.tipo.map((t) => (
          <Chip key={t} active={filters.tipo.has(t)} onClick={() => toggle("tipo", t)}>
            {t}
          </Chip>
        ))}
      </FacetRow>
      <FacetRow label="Decennio">
        {facets.decade.map((d) => (
          <Chip key={d} active={filters.decade.has(d)} onClick={() => toggle("decade", d)}>
            {decadeLabel[d] ?? d}
          </Chip>
        ))}
      </FacetRow>
      <FacetRow label="Accesso">
        {facets.accesso.map((a) => (
          <Chip key={a} active={filters.accesso.has(a)} onClick={() => toggle("accesso", a)}>
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: accessMeta[a].dot }}
              aria-hidden
            />
            {accessMeta[a].label}
          </Chip>
        ))}
      </FacetRow>
    </div>
  );

  return (
    <main className="mx-auto max-w-[1400px] px-5 py-10 md:px-8 md:py-12">
      {/* Editorial header */}
      <div className="flex flex-col gap-6 border-b border-ink/80 pb-7 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h1 className="font-serif text-4xl leading-none md:text-5xl">Collezione</h1>
          <p className="mt-3 text-[15px] text-ink-60">
            72 opere distribuite nel territorio di Peccioli. Sculture, colore, luce, voci e
            gesti alla scala dell'edificio.
          </p>
          <p className="mt-2 max-w-xl text-[14px] text-ink-60">
            Non un catalogo chiuso ma una mappa viva: ogni opera appartiene a un luogo. Sfoglia
            per area, tipo, decennio o accesso, senza perdere la logica del territorio.
          </p>
        </div>
        {/* View toggle */}
        <div className="flex w-fit shrink-0 overflow-hidden rounded-lg border border-ink text-[13px]">
          {(["griglia", "lista", "mappa"] as View[]).map((v, i) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              aria-pressed={view === v}
              className={clsx(
                "px-4 py-2 capitalize transition-colors focus-ring",
                i > 0 && "border-l border-ink",
                view === v ? "bg-ink text-paper" : "hover:bg-ink/[0.04]"
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Editorial quick chips */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Overline className="mr-1">Sfoglia</Overline>
        <Chip active={filters.landscape} onClick={() => toggleFlag("landscape")}>
          Opere nel paesaggio
        </Chip>
        <Chip active={filters.night} onClick={() => toggleFlag("night")}>
          Dopo il tramonto
        </Chip>
        {facets.decade.map((d) => (
          <Chip key={d} active={filters.decade.has(d)} onClick={() => toggle("decade", d)}>
            {decadeLabel[d] ?? d}
          </Chip>
        ))}
      </div>

      {/* Desktop inline facets */}
      <div className="mt-6 hidden md:block">
        <FacetGroups />
      </div>

      {/* Mobile: Filtri button + result count */}
      <div className="mt-6 flex items-center justify-between gap-3 md:hidden">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-ink bg-paper px-4 py-2.5 text-sm focus-ring"
        >
          Filtri
          {active > 0 && (
            <span className="rounded-full bg-ink px-1.5 text-[11px] text-paper">{active}</span>
          )}
        </button>
        <span className="font-mono text-[12px] text-ink-60">{n} opere</span>
      </div>

      {/* Active filters + persistent result count (desktop) */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="hidden font-mono text-[12px] text-ink-60 md:inline">
          {n} {n === 1 ? "opera" : "opere"}
        </span>
        {activeChips.length > 0 && (
          <span className="hidden h-4 w-px bg-ink/20 md:inline-block" aria-hidden />
        )}
        {activeChips.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={c.remove}
            className="inline-flex items-center gap-1.5 rounded-full border border-ink bg-stone-200 px-3 py-1 text-[13px] text-ink focus-ring"
          >
            {c.label}
            <span aria-hidden>✕</span>
            <span className="sr-only">Rimuovi filtro</span>
          </button>
        ))}
        {active > 0 && (
          <button
            type="button"
            onClick={reset}
            className="ml-1 text-[13px] text-terracotta hover:underline focus-ring"
          >
            Azzera
          </button>
        )}
      </div>

      {/* Results */}
      <div className="mt-8">
        {n === 0 ? (
          <div className="rounded-xl border border-dashed border-ink/30 bg-paper p-10 text-center">
            <p className="font-serif text-xl">Nessuna opera con questi filtri</p>
            <button
              type="button"
              onClick={reset}
              className="mt-3 text-[14px] text-terracotta hover:underline focus-ring"
            >
              Azzera i filtri
            </button>
          </div>
        ) : view === "griglia" ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {filtered.map((w) => (
              <WorkCard key={w.slug} work={w} />
            ))}
          </div>
        ) : view === "lista" ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((w) => (
              <MapResultCard key={w.slug} work={w} />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="h-[420px] overflow-hidden rounded-xl border border-ink/80 lg:h-[560px]">
              <StylizedMap
                works={filtered}
                onSelect={(slug) => {
                  window.location.href = `/opere/${slug}`;
                }}
              />
            </div>
            <div className="flex flex-col gap-3">
              <MapLegend />
              <div className="max-h-[520px] space-y-3 overflow-y-auto pr-1">
                {filtered.map((w) => (
                  <MapResultCard key={w.slug} work={w} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile filter drawer (A7) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Filtri collezione">
          <button
            type="button"
            aria-label="Chiudi"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-ink/30"
          />
          <div
            ref={drawerRef}
            className="absolute inset-x-0 bottom-0 max-h-[88%] overflow-y-auto rounded-t-[20px] border-t border-ink bg-paper px-5 pb-6 pt-3 shadow-sheet"
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-ink/25" />
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl">Filtri</h2>
              {active > 0 && (
                <button
                  type="button"
                  onClick={reset}
                  className="text-[14px] text-terracotta hover:underline focus-ring"
                >
                  Azzera
                </button>
              )}
            </div>
            <div className="mt-5">
              <FacetGroups />
            </div>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="mt-6 w-full rounded-lg border border-ink bg-terracotta py-3.5 text-center text-[15px] text-paper hover:bg-terracotta-dark focus-ring"
            >
              Mostra {n} {n === 1 ? "opera" : "opere"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function FacetRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Overline className="mb-2">{label}</Overline>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
