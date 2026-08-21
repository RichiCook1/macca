import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HomeHero } from "@/components/home-hero";
import { MapLegend } from "@/components/stylized-map";
import { GoogleTerritoryMap } from "@/components/google-map";
import { RouteCard } from "@/components/route-card";
import { WorkPhoto } from "@/components/work-image";
import { Overline, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/reveal";
import { ProvisionalTag, FallbackNote } from "@/components/badges";
import { works, flagshipWorks } from "@/lib/works";
import { routes } from "@/lib/routes-data";
import { locations, mapAreas, FALLBACK } from "@/lib/collection";
import { workMapPins } from "@/lib/maps";
import { decades, decadeLabel } from "@/lib/constants";

export default function HomePage() {
  // New commission = the provisional / future-dated record (Breath, 2026).
  const featured = works.find((w) => w.provisional) ?? flagshipWorks[flagshipWorks.length - 1];

  // Decade density derived from the real 72-work collection.
  const decadeCounts = decades.map((d) => ({
    decade: d,
    count: works.filter((w) => w.decade === d).length,
  }));
  const maxCount = Math.max(...decadeCounts.map((d) => d.count), 1);

  // Every work as a map pin — the homepage map shows the collection itself,
  // not the site anchors (those are a filter inside Esplora).
  const homePins = workMapPins(works);

  // Representative location per area for the "esplora per luogo" tiles.
  const repLocation = (areaName: string) =>
    locations.find((l) => l.area.toLowerCase().includes(areaName.toLowerCase()));

  // Representative photo per area — prefer a flagship work with a real photo,
  // else any work in the area with one. Never a demo tile (.svg).
  const areaImage = (areaSlug: string) => {
    const inArea = works.filter(
      (w) => w.area === areaSlug && w.heroImage?.src.endsWith(".jpg")
    );
    const pick = inArea.find((w) => w.isFlagship) ?? inArea[0];
    return pick?.heroImage?.src;
  };

  return (
    <>
      <SiteHeader transparent overlay />
      <main>
        <HomeHero />

        {/* Map as collection */}
        <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
          <div className="grid gap-10 md:grid-cols-[0.85fr_1.15fr] md:items-center lg:gap-16">
            <Reveal>
              <Overline>La collezione è una mappa</Overline>
              <h2 className="mt-3 font-serif text-3xl leading-tight md:text-4xl">
                L'arte non comincia all'ingresso. È già nel paesaggio.
              </h2>
              <p className="mt-4 max-w-md prose-editorial text-[15px]">
                {works.length} opere tra strade, colline, frazioni, chiese, edifici pubblici e
                infrastrutture. La mappa è il modo principale per leggere la collezione — con la
                posizione di ogni opera indicata al livello di affidabilità verificato, mai un pin
                falso.
              </p>
              <div className="mt-6">
                <MapLegend className="inline-block" />
              </div>
            </Reveal>
            <Reveal delay={120} className="relative h-[340px] overflow-hidden rounded-2xl border border-ink/10 shadow-card md:h-[460px]">
              <GoogleTerritoryMap
                workPins={homePins}
                sitePins={false}
                zoom={13}
                footnote={false}
                className="absolute inset-0"
              />
            </Reveal>
          </div>

          {/* Density over time — a quiet footnote to the collection, not a section of its own */}
          <Reveal className="mt-14 border-t border-ink/10 pt-6">
            <div className="flex items-baseline justify-between gap-4">
              <Overline>Un museo costruito nel tempo</Overline>
              <Link href="/timeline" className="font-mono text-[11px] text-ink-60 hover:text-ink focus-ring">
                Timeline →
              </Link>
            </div>
            <div className="mt-4 flex items-end gap-3">
              {decadeCounts.map((d, i) => (
                <div key={d.decade} className="flex flex-1 flex-col gap-2">
                  <span
                    className={`w-full rounded-sm ${
                      i === decadeCounts.length - 1 ? "bg-terracotta" : "bg-ink/15"
                    }`}
                    style={{ height: Math.max(4, Math.round((d.count / maxCount) * 40)) }}
                  />
                  <span className="font-mono text-[10px] text-ink-40">
                    {decadeLabel[d.decade]} · {d.count}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* Featured routes */}
        <section className="bg-stone-50">
          <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-24">
            <Reveal>
            <SectionHeading
              title="Percorsi in evidenza"
              action={
                <Link href="/percorsi" className="text-sm text-ink-60 hover:text-ink focus-ring">
                  Tutti i percorsi →
                </Link>
              }
            />
            </Reveal>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {routes.slice(0, 3).map((r, i) => (
                <Reveal key={r.slug} delay={i * 80}>
                  <RouteCard route={r} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Featured work / new commission */}
        <section className="border-t border-ink/10">
          <div className="mx-auto grid max-w-[1400px] md:grid-cols-2">
            <div className="relative min-h-[280px] border-b border-ink/15 md:border-b-0 md:border-r">
              {featured.heroImage ? (
                <WorkPhoto
                  image={featured.heroImage}
                  alt={featured.title}
                  className="absolute inset-0 h-full w-full"
                />
              ) : (
                <div className="absolute inset-0 hatch">
                  <FallbackNote className="absolute bottom-3 left-4">{FALLBACK.image}</FallbackNote>
                </div>
              )}
            </div>
            <Reveal className="flex flex-col justify-center p-8 md:p-14">
              <Overline>Nuova commissione</Overline>
              <h2 className="mt-3 font-serif text-3xl leading-tight md:text-4xl">{featured.title}</h2>
              <div className="mt-1.5 text-sm text-ink-60">
                {featured.artist} · {featured.year} · {featured.hamletArea}
              </div>
              <div className="mt-3">
                <ProvisionalTag />
              </div>
              {featured.feature?.story_lens ? (
                <p className="mt-5 max-w-md font-serif text-xl leading-snug text-ink-80">
                  {featured.feature.story_lens}.
                </p>
              ) : null}
              {featured.description ? (
                <p className="mt-3 max-w-md text-[14px] leading-relaxed text-ink-80">
                  {featured.description}
                </p>
              ) : (
                <p className="mt-3 max-w-md text-[14px] text-ink-60">
                  <FallbackNote>{FALLBACK.story}</FallbackNote> — scheda in attesa di firma curatoriale,
                  posizione e diritti.
                </p>
              )}
              <Link
                href={`/opere/${featured.slug}`}
                className="mt-6 w-fit text-sm text-terracotta hover:underline focus-ring"
              >
                Scopri l'opera · indizio sulla mappa →
              </Link>
            </Reveal>
          </div>
        </section>

        {/* Explore by place */}
        <section className="border-t border-ink/10">
          <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-24">
            <Reveal>
              <SectionHeading title="Esplora per luogo" />
            </Reveal>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
              {mapAreas.map((a, i) => {
                const loc = repLocation(a.name);
                const count = works.filter((w) => w.area === a.slug).length;
                const img = areaImage(a.slug);
                return (
                  <Reveal key={a.slug} delay={i * 60}>
                  <Link
                    href={loc ? `/luoghi/${loc.slug}` : "/esplora"}
                    className={`group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl border border-ink/10 p-4 shadow-card transition-shadow duration-300 hover:shadow-raised focus-ring sm:aspect-[3/4] lg:aspect-square ${
                      img ? "" : "hatch"
                    }`}
                  >
                    {img && (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt=""
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/5" />
                      </>
                    )}
                    <span className={`relative font-serif text-[20px] leading-tight md:text-[22px] ${img ? "text-paper" : ""}`}>
                      {a.name}
                    </span>
                    <span
                      className={`relative mt-1 font-mono text-[10px] uppercase tracking-overline ${img ? "text-paper/75" : "text-ink-60"}`}
                    >
                      {count} opere
                    </span>
                  </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Visit planning strip */}
        <section className="bg-stone-50">
          <div className="mx-auto grid max-w-[1400px] gap-4 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4 md:px-8">
            {[
              { t: "Arrivare", d: "In auto da Pisa / Firenze · trasporti", href: "/visita" },
              { t: "Accessibilità", d: "Pendenze e gradini segnalati per opera", href: "/visita" },
              { t: "Luoghi su prenotazione", d: "Siti interni e accesso regolato", href: "/visita" },
              { t: "Stato dei dati", d: "Verifiche, diritti immagini e fonti", href: "/cantiere" },
            ].map((c, i) => (
              <Reveal key={c.t} delay={i * 60}>
              <Link
                href={c.href}
                className="rounded-xl border border-ink/20 bg-paper p-5 transition-shadow hover:shadow-card focus-ring"
              >
                <div className="font-serif text-lg">{c.t}</div>
                <div className="mt-2 text-[13px] text-ink-60">{c.d}</div>
              </Link>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
