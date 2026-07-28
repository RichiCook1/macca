"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Overline, Chip } from "@/components/ui";
import { works, artists, artistBySlug, routes, locations } from "@/lib/collection";

type ResultKind = "Opera" | "Artista" | "Percorso" | "Luogo";

interface Result {
  kind: ResultKind;
  href: string;
  title: string;
  meta: string;
}

const kindAccent: Record<ResultKind, string> = {
  Opera: "border-terracotta text-terracotta",
  Artista: "border-ink text-ink",
  Percorso: "border-sky-ink text-sky-ink",
  Luogo: "border-cypress text-cypress",
};

// Normalize for matching: lowercase, strip accents/diacritics (NFD + combining
// marks) and fold typographic apostrophes to straight ones, on both query and
// haystack, so "dell'opera" / "perche" match Italian titles.
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u2018\u2019]/g, "'")
    .trim();

function buildResults(query: string): Result[] {
  const q = norm(query);
  if (!q) return [];
  const out: Result[] = [];

  for (const w of works) {
    const artist = artistBySlug(w.artistSlug);
    const hay = norm(`${w.title} ${artist?.name ?? ""} ${w.place}`);
    if (hay.includes(q)) {
      out.push({
        kind: "Opera",
        href: `/opere/${w.slug}`,
        title: w.title,
        meta: `${artist?.name ?? ""} · ${w.year} · ${w.place}`,
      });
    }
  }

  for (const a of artists) {
    if (norm(a.name).includes(q)) {
      out.push({
        kind: "Artista",
        href: `/artisti/${a.slug}`,
        title: a.name,
        meta: `${a.workCount} ${a.workCount === 1 ? "opera" : "opere"}`,
      });
    }
  }

  for (const r of routes) {
    const hay = norm(r.title);
    if (hay.includes(q)) {
      out.push({
        kind: "Percorso",
        href: `/percorsi/${r.slug}`,
        title: r.title,
        meta: `${r.type || r.prototypeValue} · ${r.duration}`,
      });
    }
  }

  for (const l of locations) {
    const hay = norm(`${l.name} ${l.area}`);
    if (hay.includes(q)) {
      out.push({
        kind: "Luogo",
        href: `/luoghi/${l.slug}`,
        title: l.name,
        meta: l.area,
      });
    }
  }

  return out;
}

const suggestions = [
  "Corsini",
  "Kwade",
  "Tremlett",
  "Senatore",
  "Ghizzano",
  "Peccioli",
  "Le Serre",
  "Centro storico",
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => buildResults(query), [query]);
  const hasQuery = norm(query).length > 0;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[900px] px-5 py-10 md:px-8 md:py-12">
        <Overline className="mb-3">Cerca</Overline>
        <h1 className="font-serif text-4xl leading-[1.04] md:text-5xl">Cerca</h1>

        <div className="mt-6">
          <label htmlFor="macca-search" className="sr-only">
            Cerca opere, artisti, percorsi e luoghi
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-ink bg-paper px-4 py-3 shadow-card focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-terracotta">
            <span aria-hidden className="text-ink-60">
              ⌕
            </span>
            <input
              id="macca-search"
              type="search"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Opere, artisti, percorsi, luoghi…"
              className="h-7 w-full bg-transparent text-[16px] text-ink placeholder:text-ink-40 focus:outline-none"
            />
          </div>
        </div>

        {!hasQuery ? (
          // Initial / empty state — suggests popular searches.
          <div className="mt-10">
            <Overline className="mb-3">Suggerimenti</Overline>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <Chip key={s} onClick={() => setQuery(s)}>
                  {s}
                </Chip>
              ))}
            </div>
            <p className="mt-8 max-w-md text-[14px] leading-relaxed text-ink-60">
              Cerca tra opere, artisti, percorsi e luoghi della collezione. I
              risultati sono mostrati insieme, etichettati per tipo.
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-ink/25 bg-paper px-6 py-12 text-center">
            <p className="font-serif text-xl">Nessun risultato per «{query}»</p>
            <p className="mt-2 text-[14px] text-ink-60">
              Prova con un nome d&apos;artista, un titolo o un luogo.
            </p>
          </div>
        ) : (
          <div className="mt-8">
            <Overline className="mb-3">
              {results.length} risultat{results.length === 1 ? "o" : "i"}
            </Overline>
            <ul className="flex flex-col divide-y divide-hairline overflow-hidden rounded-xl border border-ink/15 bg-paper shadow-card">
              {results.map((r) => (
                <li key={`${r.kind}-${r.href}`}>
                  <Link
                    href={r.href}
                    className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-ink/[0.03] focus-ring"
                  >
                    <span
                      className={`shrink-0 rounded-full border bg-paper px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-overline ${kindAccent[r.kind]}`}
                    >
                      {r.kind}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-serif text-[16px] leading-tight">
                        {r.title}
                      </span>
                      <span className="block truncate text-[12px] text-ink-60">
                        {r.meta}
                      </span>
                    </span>
                    <span aria-hidden className="text-ink-40">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
