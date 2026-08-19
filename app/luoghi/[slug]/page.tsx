import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { GoogleTerritoryMap } from "@/components/google-map";
import { workMapPins } from "@/lib/maps";
import { WorkCard } from "@/components/work-card";
import { RouteCard } from "@/components/route-card";
import { FallbackNote } from "@/components/badges";
import { Overline } from "@/components/ui";
import {
  locations,
  locationBySlug,
  works,
  routes,
  slugifyName,
  FALLBACK,
} from "@/lib/collection";

export function generateStaticParams() {
  return locations.map((l) => ({ slug: l.slug }));
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const location = locationBySlug(slug);
  if (!location) notFound();

  // location.slug is a location_id (not an AreaSlug). Derive the works in this
  // location's area by matching on the raw area string — slugified for a robust
  // overlap between location.area and each work's hamletArea/area name.
  const areaKey = slugifyName(location.area);
  const areaWorks = works.filter((w) => {
    const wArea = slugifyName(w.hamletArea);
    return wArea === areaKey || wArea.includes(areaKey) || areaKey.includes(wArea);
  });
  const areaWorkSlugs = new Set(areaWorks.map((w) => w.slug));

  // Routes that touch this area (a stop here).
  const relatedRoutes = routes.filter((r) =>
    r.stops.some((s) => s.workSlug && areaWorkSlugs.has(s.workSlug))
  );

  return (
    <>
      <SiteHeader />
      <main>
        {/* Header — name + area, no invented story */}
        <section className="border-b border-ink/80">
          <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-8 md:py-14">
            <Overline>{location.area}</Overline>
            <h1 className="mt-3 font-serif text-4xl leading-[1.04] md:text-6xl">
              {location.name}
            </h1>
            {location.notes ? (
              <p className="mt-6 max-w-2xl prose-editorial">{location.notes}</p>
            ) : (
              <p className="mt-6">
                <FallbackNote>{FALLBACK.more}</FallbackNote>
              </p>
            )}
            <div className="mt-6 font-mono text-[12px] text-ink-60">
              {areaWorks.length} {areaWorks.length === 1 ? "opera" : "opere"} qui
            </div>
          </div>
        </section>

        {/* Broad map focused on this area */}
        <section className="border-b border-ink/80">
          <div className="relative h-[360px] md:h-[480px]">
            <GoogleTerritoryMap
              workPins={workMapPins(areaWorks)}
              sitePins={false}
              center={
                location.lat != null && location.lon != null
                  ? { lat: location.lat, lng: location.lon }
                  : undefined
              }
              zoom={15}
              footnote={false}
              className="absolute inset-0"
            />
          </div>
        </section>

        {/* Access + coordinate honesty cards */}
        <section className="border-b border-ink/80">
          <div className="mx-auto grid max-w-[1400px] gap-5 px-5 py-12 md:grid-cols-2 md:px-8">
            <div className="rounded-xl border border-ink/15 bg-paper p-6 shadow-card">
              <Overline>Accesso</Overline>
              {location.access ? (
                <p className="mt-3 text-[15px] leading-relaxed text-ink-80">
                  {location.access}
                </p>
              ) : (
                <p className="mt-3">
                  <FallbackNote>{FALLBACK.more}</FallbackNote>
                </p>
              )}
            </div>
            <div className="rounded-xl border border-ink/15 bg-paper p-6 shadow-card">
              <Overline>Coordinate</Overline>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-80">
                Posizione a livello di sito o area, non un punto esatto.
              </p>
              <p className="mt-3 font-mono text-[12px] text-ink-60">
                Affidabilità coordinate: {location.coordinateConfidence || "da verificare"}
                {" · "}
                {location.pinPolicy || FALLBACK.location}
              </p>
              {location.address && (
                <p className="mt-3 text-[13px] leading-relaxed text-ink-60">
                  {location.address}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Source link, where available */}
        {location.sourceUrl && (
          <section className="border-b border-ink/80">
            <div className="mx-auto max-w-[1400px] px-5 py-6 md:px-8">
              <a
                href={location.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block text-[13px] text-terracotta hover:underline focus-ring"
              >
                Fonte →
              </a>
            </div>
          </section>
        )}

        {/* Works here */}
        <section className="border-b border-ink/80">
          <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-8 md:py-16">
            <h2 className="font-serif text-2xl md:text-3xl">Opere qui</h2>
            {areaWorks.length ? (
              <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {areaWorks.map((w) => (
                  <WorkCard key={w.slug} work={w} />
                ))}
              </div>
            ) : (
              <p className="mt-5 text-[14px] text-ink-60">
                Nessuna opera registrata in quest&apos;area.
              </p>
            )}
          </div>
        </section>

        {/* Routes through this area */}
        {relatedRoutes.length > 0 && (
          <section className="border-b border-ink/80">
            <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-8 md:py-16">
              <h2 className="font-serif text-2xl md:text-3xl">Percorsi che passano di qui</h2>
              <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {relatedRoutes.map((r) => (
                  <RouteCard key={r.slug} route={r} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Back to map */}
        <section>
          <div className="mx-auto max-w-[1400px] px-5 py-10 md:px-8">
            <Link
              href="/esplora"
              className="inline-block text-[13px] text-terracotta hover:underline focus-ring"
            >
              Vedi tutto il territorio sulla mappa →
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
