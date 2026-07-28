"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { works, mapAreas, FALLBACK } from "@/lib/collection";
import { categories, accessMeta } from "@/lib/constants";
import type { AccessClass, AreaSlug, Category, Work } from "@/lib/types";
import { StylizedMap, MapLegend } from "@/components/stylized-map";
import { MapResultCard } from "@/components/work-card";
import {
  AccessBadge,
  ConfidenceLabel,
  NightTag,
  ProvisionalTag,
  DataConfidenceTag,
  FallbackNote,
} from "@/components/badges";
import { SaveButton } from "@/components/save-button";
import { WorkPhoto } from "@/components/work-image";
import { BottomSheet } from "@/components/bottom-sheet";
import { GoogleTerritoryMap } from "@/components/google-map";
import { Button, Chip } from "@/components/ui";
import { useModalBehavior } from "@/components/use-modal";
import { mapsDirectionsUrl, workQuery } from "@/lib/maps";
import { clsx } from "@/lib/clsx";

export function ExploreClient() {
  // In-app deep link: /esplora?opera=<slug> opens with that work selected
  // (used by "Vedi sulla mappa" on artwork pages).
  const params = useSearchParams();
  const initial = params.get("opera");
  const [selected, setSelected] = useState<string | null>(
    initial && works.some((w) => w.slug === initial) ? initial : null
  );
  const [query, setQuery] = useState("");
  const [areas, setAreas] = useState<Set<AreaSlug>>(new Set());
  const [cats, setCats] = useState<Set<Category>>(new Set());
  const [access, setAccess] = useState<Set<AccessClass>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [mobileView, setMobileView] = useState<"map" | "list">("map");
  const [mapMode, setMapMode] = useState<"stilizzata" | "reale">("stilizzata");
  const filterDrawerRef = useModalBehavior(showFilters, () => setShowFilters(false));

  const toggle = <T,>(set: Set<T>, val: T, setter: (s: Set<T>) => void) => {
    const next = new Set(set);
    next.has(val) ? next.delete(val) : next.add(val);
    setter(next);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return works.filter((w) => {
      if (areas.size && !areas.has(w.area)) return false;
      if (cats.size && !cats.has(w.category)) return false;
      if (access.size && !access.has(w.accessClass)) return false;
      if (q) {
        const hay = `${w.title} ${w.artist} ${w.place} ${w.hamletArea}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [query, areas, cats, access]);

  const activeFilterCount = areas.size + cats.size + access.size;
  const selectedWork = selected ? works.find((w) => w.slug === selected) ?? null : null;

  const reset = () => {
    setAreas(new Set());
    setCats(new Set());
    setAccess(new Set());
    setQuery("");
  };

  const filterPanel = (
    <div className="space-y-4">
      <div>
        <div className="overline mb-2">Area</div>
        <div className="flex flex-wrap gap-2">
          {mapAreas.map((a) => (
            <Chip key={a.slug} active={areas.has(a.slug)} onClick={() => toggle(areas, a.slug, setAreas)}>
              {a.name}
            </Chip>
          ))}
        </div>
      </div>
      <div>
        <div className="overline mb-2">Tipo</div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Chip key={c} active={cats.has(c)} onClick={() => toggle(cats, c, setCats)}>
              {c}
            </Chip>
          ))}
        </div>
      </div>
      <div>
        <div className="overline mb-2">Accesso</div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(accessMeta) as AccessClass[]).map((s) => (
            <Chip key={s} active={access.has(s)} onClick={() => toggle(access, s, setAccess)}>
              <span className="h-2 w-2 rounded-full" style={{ background: accessMeta[s].dot }} />
              {accessMeta[s].label.split(" · ")[0].split(" / ")[0]}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );

  const resultList = (
    <div className="space-y-3">
      {filtered.length === 0 ? (
        <EmptyState onReset={reset} />
      ) : (
        filtered.map((w) => (
          <MapResultCard
            key={w.slug}
            work={w}
            active={w.slug === selected}
            onSelect={() => setSelected(w.slug)}
          />
        ))
      )}
    </div>
  );

  return (
    <div className="flex h-full">
      {/* ===== Desktop split ===== */}
      <aside className="hidden w-[40%] max-w-[460px] shrink-0 flex-col border-r border-ink/80 lg:flex">
        <div className="border-b border-ink/80 p-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca opere, artisti, luoghi…"
            aria-label="Cerca opere, artisti, luoghi"
            className="w-full rounded-full border border-ink bg-paper px-4 py-2.5 text-sm placeholder:text-ink-40 focus-ring"
          />
          <div className="mt-3 flex items-center justify-between">
            <div className="overline">{filtered.length} opere · {works.length} in collezione</div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className="font-mono text-[11px] text-ink-60 hover:text-ink focus-ring"
            >
              {showFilters ? "Nascondi filtri" : `Filtri${activeFilterCount ? ` · ${activeFilterCount}` : ""}`}
            </button>
          </div>
          {showFilters && <div className="mt-4">{filterPanel}</div>}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {selectedWork ? (
            <SelectedPanel work={selectedWork} onClose={() => setSelected(null)} />
          ) : (
            resultList
          )}
        </div>
      </aside>

      <div className="relative hidden min-w-0 flex-1 lg:block">
        {mapMode === "reale" ? (
          <GoogleTerritoryMap />
        ) : (
          <StylizedMap works={filtered} selectedSlug={selected} onSelect={setSelected} />
        )}
        {/* Map mode toggle */}
        <div className="absolute left-1/2 top-3 z-20 flex -translate-x-1/2 overflow-hidden rounded-full border border-ink bg-paper text-xs shadow-card">
          {(["stilizzata", "reale"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMapMode(m)}
              aria-pressed={mapMode === m}
              className={clsx(
                "px-4 py-1.5 capitalize transition-colors focus-ring",
                mapMode === m ? "bg-ink text-paper" : "text-ink-80 hover:text-ink"
              )}
            >
              {m === "reale" ? "Reale · Google" : "Stilizzata"}
            </button>
          ))}
        </div>
        {mapMode === "stilizzata" && <MapLegend className="absolute bottom-3 left-3" />}
      </div>

      {/* ===== Mobile: full-screen map + bottom sheet ===== */}
      <div className="relative h-full w-full lg:hidden">
        <StylizedMap works={filtered} selectedSlug={selected} onSelect={setSelected} />

        <div className="absolute inset-x-0 top-0 z-30 flex items-center gap-2 p-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca opere, artisti, luoghi…"
            aria-label="Cerca opere, artisti, luoghi"
            className="flex-1 rounded-full border border-ink bg-paper/95 px-4 py-2.5 text-sm placeholder:text-ink-40 focus-ring"
          />
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-1.5 rounded-lg border border-ink bg-paper px-4 py-2.5 text-sm focus-ring"
          >
            Filtri
            {activeFilterCount > 0 && (
              <span className="rounded-full bg-ink px-1.5 text-[11px] text-paper">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="absolute left-1/2 top-16 z-30 flex -translate-x-1/2 overflow-hidden rounded-full border border-ink bg-paper text-xs">
          {(["map", "list"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setMobileView(v)}
              aria-pressed={mobileView === v}
              className={clsx("px-4 py-1.5", mobileView === v ? "bg-ink text-paper" : "text-ink-80")}
            >
              {v === "map" ? "Mappa" : "Lista"}
            </button>
          ))}
        </div>

        {mobileView === "map" ? (
          <BottomSheet initial={selectedWork ? "half" : "collapsed"}>
            {selectedWork ? (
              <SelectedPanel work={selectedWork} onClose={() => setSelected(null)} />
            ) : (
              <>
                <div className="mb-3 font-serif text-lg">{filtered.length} opere nelle vicinanze</div>
                {resultList}
              </>
            )}
          </BottomSheet>
        ) : (
          <div className="absolute inset-x-0 bottom-0 top-28 z-40 overflow-y-auto rounded-t-[20px] border-t border-ink bg-paper p-4 shadow-sheet">
            <div className="mb-3 font-serif text-lg">{filtered.length} opere</div>
            {resultList}
          </div>
        )}

        {showFilters && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end">
            <button aria-label="Chiudi filtri" onClick={() => setShowFilters(false)} className="absolute inset-0 bg-ink/30" />
            <div
              ref={filterDrawerRef}
              className="relative max-h-[85%] overflow-y-auto rounded-t-[20px] border-t border-ink bg-paper p-5 shadow-sheet"
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-ink/25" />
              <div className="mb-4 flex items-center justify-between">
                <div className="font-serif text-xl">Filtri</div>
                <button onClick={reset} className="text-sm text-terracotta focus-ring">
                  Azzera
                </button>
              </div>
              {filterPanel}
              <Button onClick={() => setShowFilters(false)} className="mt-6 w-full">
                Mostra {filtered.length} opere
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="rounded-xl border border-dashed border-ink/40 p-6 text-center">
      <div className="font-serif text-lg">Nessuna opera con questi filtri</div>
      <p className="mt-2 text-sm text-ink-60">
        Prova ad allargare l'area o il tipo. La mappa resta sempre disponibile.
      </p>
      <button onClick={onReset} className="mt-4 text-sm text-terracotta hover:underline focus-ring">
        Azzera i filtri
      </button>
    </div>
  );
}

/** First ~2 sentences of a description (full text when it's that short). */
function excerpt(text: string): string {
  const sentences = text.match(/[^.!?]+[.!?]+/g);
  if (!sentences || sentences.length <= 2) return text;
  return sentences.slice(0, 2).join(" ").trim();
}

function SelectedPanel({ work, onClose }: { work: Work; onClose: () => void }) {
  const nearby = works.filter((w) => w.area === work.area && w.slug !== work.slug).slice(0, 1);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button onClick={onClose} className="font-mono text-[11px] text-ink-60 hover:text-ink focus-ring">
          ‹ Tutte le opere
        </button>
        <SaveButton slug={work.slug} variant="icon" />
      </div>

      {work.heroImage ? (
        <WorkPhoto image={work.heroImage} alt={work.title} rounded className="h-32 border border-ink" />
      ) : (
        <div className={clsx("relative flex h-32 items-end rounded-lg border border-ink p-2.5", work.nightView ? "bg-night" : "hatch")}>
          <FallbackNote className={work.nightView ? "text-night-tint/70" : ""}>{FALLBACK.image}</FallbackNote>
        </div>
      )}

      <h2 className="mt-3 font-serif text-2xl leading-tight">{work.title}</h2>
      <div className="mt-1 text-[13px] text-ink-60">
        {work.artist} · {work.year} · {work.hamletArea}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <AccessBadge state={work.accessState} raw={work.accessRaw} size="sm" />
        <ConfidenceLabel confidence={work.mapConfidence} />
        {work.nightView && <NightTag />}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <DataConfidenceTag level={work.dataConfidence} />
        {work.provisional && <ProvisionalTag />}
      </div>

      {work.description ? (
        <p className="mt-3 text-[13px] leading-relaxed text-ink-80">
          {excerpt(work.description)}
        </p>
      ) : (
        <p className="mt-3 text-[13px] leading-relaxed text-ink-60">
          <FallbackNote>{FALLBACK.story}</FallbackNote>
        </p>
      )}

      {/* Contextual honesty notices */}
      {(work.mapConfidence === "area" || work.mapConfidence === "external") && (
        <Notice tone="sun">Posizione a livello di area: il punto esatto non è ancora confermato.</Notice>
      )}
      {work.mapConfidence === "cluster" && (
        <Notice tone="sky">Opera in un cluster di sito: il pin indica il sito, non la singola opera.</Notice>
      )}
      {(work.accessClass === "booking" || work.accessClass === "dependent-hours") && (
        <Notice tone="sun">Accesso da verificare: controlla orari o prenotazione prima di partire.</Notice>
      )}

      <div className="mt-4 flex gap-2">
        <Link
          href={`/opere/${work.slug}`}
          className="inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium bg-terracotta text-paper border border-ink hover:bg-terracotta-dark transition-colors focus-ring px-4 py-2.5 flex-[2]"
        >
          Apri scheda
        </Link>
        <a
          href={mapsDirectionsUrl(workQuery(work))}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium bg-transparent text-ink border border-ink hover:bg-ink/[0.04] transition-colors focus-ring px-4 py-2.5 flex-1"
        >
          Indicazioni ↗
        </a>
      </div>

      {nearby.length > 0 && (
        <div className="mt-5">
          <div className="overline mb-2">Nelle vicinanze</div>
          {nearby.map((w) => (
            <MapResultCard key={w.slug} work={w} />
          ))}
        </div>
      )}
    </div>
  );
}

function Notice({ children, tone }: { children: React.ReactNode; tone: "sun" | "sky" }) {
  return (
    <div
      className={clsx(
        "mt-3 rounded-lg border px-3 py-2 text-[12px] leading-relaxed",
        tone === "sun" ? "border-sun/60 bg-sun-tint text-sun-ink" : "border-sky-ink/40 bg-sky/30 text-ink-80"
      )}
    >
      {children}
    </div>
  );
}
