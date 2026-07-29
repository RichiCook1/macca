import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StylizedMap } from "@/components/stylized-map";
import { SaveButton } from "@/components/save-button";
import {
  AccessBadge,
  ConfidenceLabel,
  ProvisionalTag,
  NightTag,
  DataConfidenceTag,
  FallbackNote,
} from "@/components/badges";
import { Overline, Button } from "@/components/ui";
import { ShareButton } from "@/components/share-button";
import { WorkPhoto } from "@/components/work-image";
import { works, workBySlug, worksByArea, FALLBACK } from "@/lib/collection";
import { mapsDirectionsUrl, workQuery } from "@/lib/maps";
import { routeBySlug } from "@/lib/routes-data";
import { confidenceMeta } from "@/lib/constants";

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

/** Fact row — value falls back to a quiet verification note when unverified. */
function Fact({ label, value, fallback }: { label: string; value?: string; fallback?: string }) {
  const has = !!value;
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-hairline py-2.5 text-[13px] last:border-b-0">
      <span className="shrink-0 text-ink-60">{label}</span>
      <span className={has ? "text-right text-ink" : "text-right"}>
        {has ? value : <FallbackNote>{fallback ?? FALLBACK.more}</FallbackNote>}
      </span>
    </div>
  );
}

export default async function ArtworkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const work = workBySlug(slug);
  if (!work) notFound();

  const yearText = String(work.year);
  const nearby = worksByArea(work.area)
    .filter((w) => w.slug !== work.slug)
    .slice(0, 4);
  const firstRoute = work.routes[0] ? routeBySlug(work.routes[0]) : undefined;

  // In-app prev/next between works (seed order) — browse the whole collection
  // without leaving the artwork flow.
  const idx = works.findIndex((w) => w.slug === work.slug);
  const prevWork = idx > 0 ? works[idx - 1] : undefined;
  const nextWork = idx < works.length - 1 ? works[idx + 1] : undefined;

  const jumpPills = [
    { href: "#scheda", label: "Scheda" },
    { href: "#galleria", label: "Galleria" },
    { href: "#luogo", label: "In questo luogo" },
    { href: "#fonti", label: "Fonti" },
  ];

  return (
    <>
      <SiteHeader />
      <main>
        {/* Breadcrumb + jump pills (quick consultation) */}
        <div className="border-b border-ink/15">
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-2 px-5 py-2.5 md:px-8">
            <div className="font-mono text-[11px] text-ink-60">
              <Link href="/collezione" className="hover:text-ink focus-ring">
                Collezione
              </Link>
              <span className="px-1.5">›</span>
              <span>{work.hamletArea}</span>
              <span className="hidden px-1.5 sm:inline">›</span>
              <span className="hidden text-ink sm:inline">{work.title}</span>
            </div>
            <nav
              aria-label="Sezioni della scheda"
              className="no-scrollbar -mx-1 flex max-w-full gap-1.5 overflow-x-auto px-1"
            >
              {jumpPills.map((p) => (
                <a
                  key={p.href}
                  href={p.href}
                  className="whitespace-nowrap rounded-full border border-ink/25 px-3 py-1.5 text-[12px] text-ink-80 transition-colors hover:border-ink hover:text-ink focus-ring"
                >
                  {p.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* HERO */}
        <section className="border-b border-ink/80">
          <div className="mx-auto grid max-w-[1400px] md:grid-cols-[1.5fr_1fr]">
            <div className="relative min-h-[260px] border-b border-ink/15 md:min-h-[440px] md:border-b-0 md:border-r md:border-ink/80">
              {work.heroImage ? (
                <WorkPhoto image={work.heroImage} alt={work.title} className="h-full min-h-[260px] md:min-h-[440px]" />
              ) : (
                <div className={`flex h-full min-h-[260px] flex-col justify-end p-5 md:min-h-[440px] ${work.nightView ? "bg-night" : "hatch"}`}>
                  <FallbackNote className={work.nightView ? "text-night-tint/70" : ""}>
                    {FALLBACK.image}
                  </FallbackNote>
                </div>
              )}
              {work.isFlagship && (
                <span className="absolute left-4 top-4 rounded-full border border-ink bg-paper/90 px-3 py-1 font-mono text-[10px] uppercase tracking-overline">
                  Opera in evidenza
                </span>
              )}
              {work.nightView && <NightTag className="absolute right-4 top-4" />}
            </div>

            <div className="flex flex-col p-6 md:p-9">
              <Overline>
                {work.hamletArea} · {work.typeRaw}
              </Overline>
              <h1 className="mt-3 font-serif text-4xl leading-[1.04] md:text-5xl">{work.title}</h1>
              <p className="mt-2 text-[15px] text-ink-60">
                {work.artist} · {yearText}
              </p>

              <div className="mt-5 flex flex-col gap-2">
                <AccessBadge state={work.accessState} raw={work.accessRaw} />
                <ConfidenceLabel confidence={work.mapConfidence} />
                <DataConfidenceTag level={work.dataConfidence} className="mt-1" />
                {work.provisional && <ProvisionalTag />}
              </div>

              <div className="flex-1" />

              <div className="mt-7 flex items-center gap-3">
                <SaveButton slug={work.slug} variant="full" />
                <ShareButton title={work.title} />
                <Link
                  href={`/ar/${work.slug}`}
                  className="text-[13px] text-terracotta hover:underline focus-ring"
                >
                  Modalità AR ↗
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* INTERPRETATION — honest: flagship lens + archival-text fallback (no invented prose) */}
        <section className="border-b border-ink/80">
          <div className="mx-auto max-w-[1400px] px-5 py-10 md:px-8 md:py-12">
            {work.feature?.story_lens && (
              <div className="mb-4">
                <Overline>Chiave di lettura</Overline>
                <p className="mt-2 max-w-3xl font-serif text-xl leading-[1.4] md:text-[26px]">
                  {work.feature.story_lens}.
                </p>
              </div>
            )}
            {work.description ? (
              <div className="prose-editorial max-w-editorial text-[17px]">
                {work.description.split(/\n\n+/).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ) : (
              <p className="max-w-2xl text-[15px] leading-relaxed text-ink-60">
                <FallbackNote>{FALLBACK.story}</FallbackNote> — il testo curatoriale completo sarà
                pubblicato dopo la verifica delle fonti d'archivio.
                {work.feature?.publication_state ? ` Stato: ${work.feature.publication_state}.` : ""}
              </p>
            )}
          </div>
        </section>

        {/* FACTS + MAP */}
        <section id="scheda" className="scroll-mt-16 border-b border-ink/80">
          <div className="mx-auto grid max-w-[1400px] md:grid-cols-[0.85fr_1.15fr]">
            <div className="border-b border-ink/15 p-6 md:border-b-0 md:border-r md:border-ink/80 md:p-9">
              <Overline>Scheda</Overline>
              <div className="mt-4">
                <Fact label="Artista" value={work.artist} />
                <Fact label="Anno" value={yearText} />
                <Fact label="Tipo" value={work.typeRaw} />
                <Fact label="Progetto" value={work.project} />
                <Fact label="Luogo" value={`${work.place} · ${work.hamletArea}`} />
                <Fact label="Accesso" value={work.accessRaw} />
                <Fact label="Stato" value={work.currentStatus} />
                <Fact label="Materiali" value={work.materials} fallback={FALLBACK.more} />
                <Fact label="Dimensioni" value={work.dimensions} fallback={FALLBACK.more} />
                {work.coordinates && (
                  <Fact
                    label="Coordinate"
                    value={`${work.coordinates.lat.toFixed(5)}, ${work.coordinates.lon.toFixed(5)}${work.coordinates.confidence ? ` · ${work.coordinates.confidence}` : ""}`}
                  />
                )}
              </div>
              {work.notes && (
                <p className="mt-4 font-mono text-[11px] leading-relaxed text-ink-40">
                  Nota di lavorazione: {work.notes}
                </p>
              )}
            </div>

            {/* Map & arrive — respects map_status, never a false pin */}
            <div className="relative min-h-[320px] md:min-h-[420px]">
              <StylizedMap works={[work]} selectedSlug={work.slug} showLabels={false} className="absolute inset-0" />
              <div className="pointer-events-none absolute inset-x-5 bottom-5 md:inset-x-8">
                <div className="pointer-events-auto rounded-xl border border-ink bg-paper p-4 shadow-card">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[14px]">{work.place}</div>
                      <div className="mt-0.5 text-[12px] text-ink-60">
                        {confidenceMeta[work.mapConfidence].label} · {work.mapStatus}
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2">
                      <Link
                        href={`/esplora?opera=${work.slug}`}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-ink bg-terracotta px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-terracotta-dark focus-ring"
                      >
                        Vedi sulla mappa
                      </Link>
                      <a
                        href={mapsDirectionsUrl(workQuery(work))}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-ink bg-paper px-4 py-2.5 text-sm font-medium transition-colors hover:bg-ink/[0.04] focus-ring"
                      >
                        Indicazioni ↗
                      </a>
                    </div>
                  </div>
                  <div className="mt-3 border-t border-hairline pt-2">
                    <FallbackNote>{FALLBACK.location}</FallbackNote>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MEDIA / GALLERY — image archive in preparation + rights status */}
        <section id="galleria" className="scroll-mt-16 border-b border-ink/80">
          <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-8">
            <h2 className="font-serif text-2xl">Galleria</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {work.images.length > 0
                ? work.images.map((img, i) => (
                    <WorkPhoto
                      key={i}
                      image={img}
                      alt={`${work.title} — immagine ${i + 1}`}
                      rounded
                      className="h-40 border border-ink/20"
                    />
                  ))
                : [0, 1, 2].map((i) => (
                    <div key={i} className="relative flex h-40 items-end rounded-lg border border-ink/20 hatch p-3">
                      <FallbackNote>{FALLBACK.image}</FallbackNote>
                    </div>
                  ))}
            </div>
            <div className="mt-5 rounded-lg border border-sun/50 bg-sun-tint p-4 text-[13px] leading-relaxed text-sun-ink">
              <span className="font-mono text-[10px] uppercase tracking-overline">Diritti immagini</span>
              <p className="mt-1.5">{work.rightsStatus}</p>
            </div>
          </div>
        </section>

        {/* IN QUESTO LUOGO + ARTIST */}
        <section id="luogo" className="scroll-mt-16 border-b border-ink/80">
          <div className="mx-auto grid max-w-[1400px] md:grid-cols-[1.5fr_1fr]">
            <div className="border-b border-ink/15 p-6 md:border-b-0 md:border-r md:border-ink/80 md:p-9">
              <h2 className="font-serif text-2xl">In questo luogo</h2>
              {nearby.length ? (
                <>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {nearby.map((w) => (
                      <Link
                        key={w.slug}
                        href={`/opere/${w.slug}`}
                        className="group block overflow-hidden rounded-xl border border-ink/15 bg-paper shadow-card transition-shadow hover:shadow-raised focus-ring"
                      >
                        {w.heroImage ? (
                          <div className="h-20">
                            <WorkPhoto
                              image={w.heroImage}
                              alt={w.title}
                              className="zoom-media h-full w-full"
                              showCredit={false}
                            />
                          </div>
                        ) : (
                          <div className="flex h-20 items-end p-2 hatch">
                            <FallbackNote>archivio</FallbackNote>
                          </div>
                        )}
                        <div className="p-3">
                          <div className="font-serif text-[15px] leading-tight">{w.title}</div>
                          <div className="mt-0.5 text-[12px] text-ink-60">
                            {w.artist} · {w.hamletArea}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  {firstRoute && (
                    <Link
                      href={`/percorsi/${firstRoute.slug}`}
                      className="mt-5 inline-block text-[13px] text-terracotta hover:underline focus-ring"
                    >
                      Continua il percorso: {firstRoute.title} →
                    </Link>
                  )}
                </>
              ) : (
                <p className="mt-4 text-[14px] text-ink-60">
                  Al momento non ci sono altre opere registrate in quest'area.
                </p>
              )}
            </div>

            <div className="p-6 md:p-9">
              <h2 className="font-serif text-2xl">Artista</h2>
              <div className="mt-5 flex items-center gap-3">
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-ink map-surface font-serif text-lg"
                  aria-hidden
                >
                  {work.artist
                    .split(/[\s+]+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((p) => p[0])
                    .join("")
                    .toUpperCase()}
                </span>
                <div>
                  <div className="font-serif text-[17px]">{work.artist}</div>
                  <FallbackNote>{FALLBACK.more}</FallbackNote>
                </div>
              </div>
              <Link
                href={`/artisti/${work.artistSlug}`}
                className="mt-5 inline-block text-[13px] text-terracotta hover:underline focus-ring"
              >
                Profilo artista →
              </Link>
            </div>
          </div>
        </section>

        {/* SOURCES / CREDITS — real source links */}
        <section id="fonti" className="scroll-mt-16">
          <div className="mx-auto max-w-[1400px] bg-stone-100 px-5 py-6 md:px-8">
            <div className="flex flex-col gap-2 font-mono text-[11px] text-ink-60 md:flex-row md:items-center md:justify-between">
              <span className="uppercase tracking-overline">Fonti · crediti · riferimento d'archivio</span>
              <span className="flex flex-wrap gap-4">
                {work.sources.official && (
                  <a href={work.sources.official} target="_blank" rel="noopener noreferrer" className="hover:text-ink focus-ring">
                    Scheda ufficiale ↗
                  </a>
                )}
                {work.sources.index && (
                  <a href={work.sources.index} target="_blank" rel="noopener noreferrer" className="hover:text-ink focus-ring">
                    Indice MACCA ↗
                  </a>
                )}
                {work.sourceExternal && (
                  <a href={work.sourceExternal} target="_blank" rel="noopener noreferrer" className="hover:text-ink focus-ring">
                    Approfondimento ↗
                  </a>
                )}
              </span>
            </div>
            <p className="mt-3 text-[11px] text-ink-40">
              {work.rightsStatus} · Diritti immagine da verificare prima della pubblicazione.
            </p>
          </div>
        </section>

        {/* PREV / NEXT — browse the collection without leaving the flow */}
        <nav aria-label="Altre opere" className="border-t border-ink/80">
          <div className="mx-auto grid max-w-[1400px] grid-cols-2">
            {prevWork ? (
              <Link
                href={`/opere/${prevWork.slug}`}
                className="group flex min-h-[76px] flex-col justify-center gap-0.5 border-r border-ink/15 px-5 py-4 transition-colors hover:bg-ink/[0.03] focus-ring md:px-8"
              >
                <span className="font-mono text-[10px] uppercase tracking-overline text-ink-60">
                  ‹ Opera precedente
                </span>
                <span className="truncate font-serif text-[16px] group-hover:text-terracotta">
                  {prevWork.title}
                </span>
              </Link>
            ) : (
              <span aria-hidden className="border-r border-ink/15" />
            )}
            {nextWork ? (
              <Link
                href={`/opere/${nextWork.slug}`}
                className="group flex min-h-[76px] flex-col items-end justify-center gap-0.5 px-5 py-4 text-right transition-colors hover:bg-ink/[0.03] focus-ring md:px-8"
              >
                <span className="font-mono text-[10px] uppercase tracking-overline text-ink-60">
                  Opera successiva ›
                </span>
                <span className="max-w-full truncate font-serif text-[16px] group-hover:text-terracotta">
                  {nextWork.title}
                </span>
              </Link>
            ) : (
              <span aria-hidden />
            )}
          </div>
        </nav>
      </main>
      <SiteFooter />
    </>
  );
}
