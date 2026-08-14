import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { RouteMapArt } from "@/components/route-map";
import { AccessBadge, NightTag, FallbackNote } from "@/components/badges";
import { SaveButton } from "@/components/save-button";
import { ShareButton } from "@/components/share-button";
import { Button, Overline } from "@/components/ui";
import { routeIsBooking, routeIsNight } from "@/components/route-card";
import {
  routes,
  routeBySlug,
  workBySlug,
  artistBySlug,
} from "@/lib/collection";
import { mapsRouteUrl, workQuery } from "@/lib/maps";

export function generateStaticParams() {
  return routes.map((r) => ({ slug: r.slug }));
}

export default async function RouteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const route = routeBySlug(slug);
  if (!route) notFound();

  // Resolve each stop to a work + artist where a workSlug exists. Stops without
  // a workSlug are real cluster/optional references — kept verbatim, never faked.
  const stops = route.stops.map((stop) => {
    const work = stop.workSlug ? workBySlug(stop.workSlug) : undefined;
    const artist = work ? artistBySlug(work.artistSlug) : undefined;
    return { stop, work, artist };
  });

  const night = routeIsNight(route);
  const booking = routeIsBooking(route);
  const distancePending = /tbd/i.test(route.distance);

  // Real multi-stop walking directions from the seed street addresses (Google
  // resolves them — we assert no coordinates ourselves).
  const stopQueries = stops
    .map(({ work }) => (work ? workQuery(work) : null))
    .filter((q): q is string => Boolean(q));
  const gmapsUrl = stopQueries.length >= 2 ? mapsRouteUrl(stopQueries) : null;

  return (
    <>
      <SiteHeader />
      <main>
        {/* Route hero — tall stylized map with trace + numbered stops */}
        <section className="border-b border-ink/80">
          <div className="mx-auto max-w-[1400px] px-5 pt-6 md:px-8">
            <nav className="font-mono text-[11px] text-ink-60">
              <Link href="/percorsi" className="hover:text-ink focus-ring">
                Percorsi
              </Link>{" "}
              › {route.title}
            </nav>
          </div>
          <div className="mx-auto mt-4 max-w-[1400px] px-5 md:px-8">
            <div className="h-[300px] overflow-hidden rounded-xl border border-ink/80 md:h-[420px]">
              <RouteMapArt route={route} variant="hero" night={night} />
            </div>
            <p className="mt-2 font-mono text-[10px] text-ink-40">
              Mappa illustrata dimostrativa · la cartografia definitiva è in preparazione
            </p>
          </div>
        </section>

        {/* Title + meta column */}
        <section className="border-b border-ink/15">
          <div className="mx-auto grid max-w-[1400px] gap-8 px-5 py-10 md:grid-cols-[1.4fr_1fr] md:px-8">
            <div>
              <Overline>Percorso · {route.type}</Overline>
              <h1 className="mt-3 font-serif text-4xl leading-tight md:text-[44px]">
                {route.title}
              </h1>
              <p className="mt-4 max-w-xl prose-editorial text-[15px]">
                {route.prototypeValue}
              </p>
            </div>

            {/* Meta chips */}
            <aside className="flex flex-col items-start gap-3 md:items-end">
              <div className="flex flex-wrap gap-2 font-mono text-[11px] md:justify-end">
                <span className="rounded-full border border-ink px-3 py-1.5">
                  {route.type} · {route.duration}
                </span>
                <span className="rounded-full border border-ink px-3 py-1.5">
                  {route.stops.length} tappe
                </span>
                <span className="rounded-full border border-ink px-3 py-1.5">
                  {distancePending ? "Distanza in verifica" : route.distance}
                </span>
              </div>
              {route.access && (
                <p className="max-w-xs text-[12px] text-ink-60 md:text-right">
                  {route.access}
                </p>
              )}
              <div className="flex flex-wrap gap-2 md:justify-end">
                {booking && (
                  <span className="inline-flex items-center rounded-full border border-ink bg-sun px-2.5 py-1 font-mono text-[10px] text-ink">
                    Su prenotazione
                  </span>
                )}
                {night && <NightTag />}
              </div>
              {distancePending && (
                <FallbackNote className="md:text-right">
                  Distanza in verifica · tracciato GPS in preparazione
                </FallbackNote>
              )}
            </aside>
          </div>
        </section>

        {/* Two columns: stops in order | note di verifica */}
        <div className="mx-auto grid max-w-[1400px] md:grid-cols-[1.2fr_1fr]">
          {/* Tappe in ordine */}
          <section className="border-b border-ink/15 px-5 py-10 md:border-b-0 md:border-r md:px-8">
            <Overline>Tappe in ordine</Overline>
            <ol className="mt-6 flex flex-col gap-5">
              {stops.map(({ stop, work, artist }, i) => {
                const inner = (
                  <>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-[13px] font-bold text-paper">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[15px] leading-snug">
                        {stop.raw}
                        {artist && (
                          <span className="text-ink-60"> · {artist.name}</span>
                        )}
                      </div>
                      {work ? (
                        <div className="mt-2">
                          <AccessBadge
                            state={work.accessState}
                            raw={work.accessRaw}
                            size="sm"
                          />
                        </div>
                      ) : (
                        <div className="mt-1">
                          <FallbackNote>Riferimento di sito · cluster</FallbackNote>
                        </div>
                      )}
                    </div>
                  </>
                );
                return (
                  <li key={`${stop.raw}-${i}`}>
                    {work ? (
                      <Link
                        href={`/opere/${work.slug}`}
                        className="flex items-start gap-4 rounded-lg p-1 transition-colors hover:bg-ink/[0.03] focus-ring"
                      >
                        {inner}
                      </Link>
                    ) : (
                      <div className="flex items-start gap-4 p-1">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ol>

            {/* Avvia il percorso CTA */}
            <Button
              href={`/percorsi/${route.slug}/avvia`}
              size="lg"
              className="mt-8 w-full"
            >
              Avvia il percorso →
            </Button>
            {gmapsUrl && (
              <a
                href={gmapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-ink px-6 py-3 text-base font-medium transition-colors hover:bg-ink/[0.04] focus-ring"
              >
                Apri il percorso in Google Maps ↗
              </a>
            )}
          </section>

          {/* Note di verifica */}
          <section className="px-5 py-10 md:px-8">
            <Overline>Note di verifica</Overline>
            <div className="mt-6 rounded-xl border border-dashed border-ink/40 bg-stone-50 p-5">
              <p className="text-[14px] leading-relaxed text-ink-80">
                {route.verification}
              </p>
              {route.sourceUrl && (
                <a
                  href={route.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block text-[13px] text-terracotta hover:underline focus-ring"
                >
                  Fonte →
                </a>
              )}
            </div>

            {/* Save / share row */}
            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-hairline pt-6">
              <SaveButton slug={route.slug} kind="route" variant="pill" />
              <ShareButton title={route.title} variant="icon" />
            </div>

            {/* Continue exploring */}
            <div className="mt-6 rounded-xl border border-ink/15 bg-stone-50 p-5">
              <div className="font-serif text-lg">Continua a esplorare</div>
              <p className="mt-2 text-[13px] text-ink-60">
                Hai poco tempo? Puoi seguire una versione ridotta fermandoti alle
                prime tappe, oppure scoprire altri modi di attraversare MACCA.
              </p>
              <Link
                href="/percorsi"
                className="mt-3 inline-block text-sm text-terracotta hover:underline focus-ring"
              >
                Tutti i percorsi →
              </Link>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
