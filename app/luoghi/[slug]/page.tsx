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
import { Reveal } from "@/components/reveal";
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

  // Representative photograph for the header — a real cleared photo, never a
  // demo tile; prefer a flagship work from this place.
  const photographed = areaWorks.filter((w) => w.heroImage?.src.endsWith(".jpg"));
  const cover = (photographed.find((w) => w.isFlagship) ?? photographed[0])?.heroImage?.src;

  const hasCoords = location.lat != null && location.lon != null;

  return (
    <>
      <SiteHeader transparent overlay={!!cover} />
      <main>
        {/* Photographic header — the place, led by its art */}
        <section className="relative isolate flex min-h-[62svh] flex-col justify-end overflow-hidden">
          {cover ? (
            <div className="absolute inset-0 -z-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cover} alt="" aria-hidden className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/45 to-ink/20" />
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/60 to-transparent" />
            </div>
          ) : (
            <div className="absolute inset-0 -z-10 hatch" />
          )}

          <div className="mx-auto w-full max-w-[1400px] px-5 pb-10 pt-28 md:px-8 md:pb-14 md:pt-36">
            <nav className={`font-mono text-[11px] ${cover ? "text-paper/60" : "text-ink-60"}`}>
              <Link href="/esplora" className="hover:underline focus-ring">
                Territorio
              </Link>{" "}
              › {location.area}
            </nav>
            <h1
              className={`mt-4 font-serif text-[40px] leading-[1.02] tracking-[-0.02em] md:text-[68px] ${
                cover ? "text-paper" : ""
              }`}
            >
              {location.name}
            </h1>

            {/* Facts on a hairline baseline */}
            <dl
              className={`mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t pt-5 ${
                cover ? "border-paper/20" : "border-ink/15"
              }`}
            >
              {[
                { l: "opere qui", v: String(areaWorks.length) },
                { l: "percorsi", v: String(relatedRoutes.length) },
                { l: "area", v: location.area },
              ].map((f) => (
                <div key={f.l}>
                  <dt className="sr-only">{f.l}</dt>
                  <dd className={`font-serif text-[24px] leading-none ${cover ? "text-paper" : ""}`}>
                    {f.v}
                  </dd>
                  <dd
                    className={`mt-1.5 font-mono text-[10px] uppercase tracking-overline ${
                      cover ? "text-paper/60" : "text-ink-60"
                    }`}
                  >
                    {f.l}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Where it is + what to know */}
        <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-24">
          <div className="grid gap-10 md:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <Reveal className="relative h-[340px] overflow-hidden rounded-2xl border border-ink/10 shadow-card md:h-[460px]">
              <GoogleTerritoryMap
                workPins={workMapPins(areaWorks)}
                sitePins={false}
                center={hasCoords ? { lat: location.lat as number, lng: location.lon as number } : undefined}
                zoom={15}
                footnote={false}
                className="absolute inset-0"
              />
            </Reveal>

            <Reveal delay={100} className="flex flex-col justify-center">
              <Overline>Il luogo</Overline>
              {location.notes ? (
                <p className="mt-3 max-w-md prose-editorial text-[15px]">{location.notes}</p>
              ) : (
                <p className="mt-3">
                  <FallbackNote>{FALLBACK.more}</FallbackNote>
                </p>
              )}

              <dl className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
                <div className="grid grid-cols-[100px_1fr] gap-4 py-3.5">
                  <dt className="font-mono text-[10px] uppercase tracking-overline text-ink-40">Accesso</dt>
                  <dd className="text-[14px] leading-relaxed text-ink-80">
                    {location.access || <FallbackNote>{FALLBACK.more}</FallbackNote>}
                  </dd>
                </div>
                {location.address && (
                  <div className="grid grid-cols-[100px_1fr] gap-4 py-3.5">
                    <dt className="font-mono text-[10px] uppercase tracking-overline text-ink-40">Indirizzo</dt>
                    <dd className="text-[14px] leading-relaxed text-ink-80">{location.address}</dd>
                  </div>
                )}
                <div className="grid grid-cols-[100px_1fr] gap-4 py-3.5">
                  <dt className="font-mono text-[10px] uppercase tracking-overline text-ink-40">Posizione</dt>
                  <dd className="text-[13px] leading-relaxed text-ink-60">
                    Livello di sito o area, non un punto esatto ·{" "}
                    {location.coordinateConfidence || "affidabilità da verificare"}
                  </dd>
                </div>
              </dl>

              {location.sourceUrl && (
                <a
                  href={location.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-block w-fit text-[13px] text-terracotta hover:underline focus-ring"
                >
                  Fonte ↗
                </a>
              )}
            </Reveal>
          </div>
        </section>

        {/* Works here */}
        <section className="bg-stone-50">
          <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-24">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-serif text-2xl md:text-3xl">Opere qui</h2>
              <Link href="/collezione" className="text-sm text-ink-60 hover:text-ink focus-ring">
                Tutta la collezione →
              </Link>
            </div>
            {areaWorks.length ? (
              <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {areaWorks.map((w, i) => (
                  <Reveal key={w.slug} delay={(i % 3) * 70}>
                    <WorkCard work={w} />
                  </Reveal>
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
          <section className="border-t border-ink/10">
            <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-8 md:py-24">
              <div className="flex items-end justify-between gap-4">
                <h2 className="font-serif text-2xl md:text-3xl">Percorsi che passano di qui</h2>
                <Link href="/percorsi" className="text-sm text-ink-60 hover:text-ink focus-ring">
                  Tutti i percorsi →
                </Link>
              </div>
              <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {relatedRoutes.map((r, i) => (
                  <Reveal key={r.slug} delay={(i % 3) * 70}>
                    <RouteCard route={r} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Back to map */}
        <section className="bg-stone-50">
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
