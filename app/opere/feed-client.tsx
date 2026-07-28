"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SaveButton } from "@/components/save-button";
import { AccessBadge, NightTag, FallbackNote } from "@/components/badges";
import { Overline } from "@/components/ui";
import { works, FALLBACK } from "@/lib/collection";
import type { Work } from "@/lib/types";
import { clsx } from "@/lib/clsx";

// Type filter chips (A8 / D2). "Dopo il tramonto" is a flag, not a category.
type FilterKey = "tutte" | "Scultura" | "Pittura/Colore" | "Luce" | "Installazione" | "night";

const filterChips: { key: FilterKey; label: string }[] = [
  { key: "tutte", label: "Tutte" },
  { key: "Scultura", label: "Scultura" },
  { key: "Pittura/Colore", label: "Pittura / Colore" },
  { key: "Luce", label: "Luce" },
  { key: "Installazione", label: "Installazione" },
  { key: "night", label: "Dopo il tramonto" },
];

// Varying heights give the masonry its editorial rhythm; flagships run taller.
const heights = ["h-[300px]", "h-[210px]", "h-[260px]", "h-[230px]", "h-[290px]", "h-[200px]", "h-[250px]", "h-[280px]"];

function FeedCard({ work, h }: { work: Work; h: string }) {
  const meta = `${work.artist} · ${work.year} · ${work.hamletArea}`;
  const night = work.nightView;

  // No cleared images exist in the seed → every card is an honest "image archive
  // in preparation" placeholder. The catalog rhythm comes from typography + tone,
  // flagships get richer emphasis. Stretched-link pattern keeps the Save button valid.
  return (
    <div
      className={clsx(
        "group relative mb-5 break-inside-avoid overflow-hidden rounded-xl border shadow-card transition-shadow hover:shadow-raised",
        work.isFlagship ? "border-terracotta/50" : "border-ink/20"
      )}
    >
      <div className={clsx("relative w-full", h, night ? "bg-night" : "hatch")}>
        {work.heroImage && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={work.heroImage.src} alt={work.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className={clsx("absolute inset-0", night ? "bg-gradient-to-t from-night via-night/50 to-transparent" : "bg-gradient-to-t from-ink/60 to-transparent to-[55%]")} />
        <Link href={`/opere/${work.slug}`} className="absolute inset-0 z-10 focus-ring" aria-label={`${work.title} — ${meta}`} />

        <div className="absolute left-3 top-3 z-20 flex flex-col gap-1.5">
          {night ? (
            <NightTag />
          ) : (
            <span className="overline rounded-full bg-ink/50 px-2 py-1 text-paper">
              {work.hamletArea} · {work.category}
            </span>
          )}
          {work.isFlagship && (
            <span className="w-fit rounded-full border border-paper/70 bg-paper/15 px-2 py-0.5 font-mono text-[8px] uppercase tracking-overline text-paper">
              In evidenza
            </span>
          )}
        </div>

        <div className="absolute right-3 top-3 z-20">
          <SaveButton slug={work.slug} variant="icon" />
        </div>

        {!work.heroImage && (
          <FallbackNote className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-paper/50">
            {FALLBACK.image}
          </FallbackNote>
        )}

        <div className="absolute inset-x-3 bottom-3 z-20 text-paper">
          <div className="font-serif text-xl leading-tight">{work.title}</div>
          <div className="mt-0.5 text-[12px] opacity-90">{meta}</div>
        </div>
      </div>
    </div>
  );
}

export function FeedClient() {
  const [filter, setFilter] = useState<FilterKey>("tutte");

  const filtered = useMemo(() => {
    if (filter === "tutte") return works;
    if (filter === "night") return works.filter((w) => w.nightView);
    return works.filter((w) => w.category === filter);
  }, [filter]);

  return (
    <main className="mx-auto max-w-[1400px] px-5 py-10 md:px-8 md:py-12">
      <div className="flex flex-col gap-6 border-b border-ink/80 pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <h1 className="font-serif text-4xl leading-none md:text-5xl">Esplora le opere</h1>
          <p className="mt-3 text-[15px] text-ink-60">
            {works.length} opere nel territorio. Lasciati guidare dalle schede, poi apri l'opera o
            trovala sulla mappa. Le immagini sono in preparazione: i diritti vanno verificati prima
            della pubblicazione.
          </p>
        </div>
        <div className="flex items-center gap-3 text-[13px]">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-ink px-3 py-1.5">
            <span aria-hidden>▦</span> Feed
          </span>
          <Link href="/collezione" className="text-ink-60 hover:text-ink focus-ring">
            Griglia
          </Link>
          <Link href="/esplora" className="text-ink-60 hover:text-ink focus-ring">
            Mappa
          </Link>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Overline className="mr-1">Filtra</Overline>
        {filterChips.map((c) => {
          const isActive = filter === c.key;
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => setFilter(c.key)}
              aria-pressed={isActive}
              className={clsx(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] transition-colors focus-ring",
                isActive ? "border-ink bg-ink text-paper" : "border-ink/70 text-ink-80 hover:border-ink hover:text-ink"
              )}
            >
              {c.label}
            </button>
          );
        })}
        <span className="ml-1 font-mono text-[12px] text-ink-60">
          {filtered.length} {filtered.length === 1 ? "opera" : "opere"}
        </span>
      </div>

      <div className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3">
        {filtered.map((w, i) => (
          <FeedCard key={w.slug} work={w} h={heights[i % heights.length]} />
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-ink/15 pt-6 text-[13px] text-ink-60">
        <span>Accesso indicativo per opera:</span>
        <AccessBadge state="public-exterior" size="sm" />
        <AccessBadge state="booking" size="sm" />
        <AccessBadge state="dependent-hours" size="sm" />
      </div>
    </main>
  );
}
