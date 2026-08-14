import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { GoogleTerritoryMap } from "@/components/google-map";
import { workMapCenter } from "@/lib/maps";
import { WorkCard } from "@/components/work-card";
import { FallbackNote } from "@/components/badges";
import { Overline } from "@/components/ui";
import { artists, artistBySlug, worksByArtist, FALLBACK } from "@/lib/collection";

export function generateStaticParams() {
  return artists.map((a) => ({ slug: a.slug }));
}

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artist = artistBySlug(slug);
  if (!artist) notFound();

  const artistWorks = worksByArtist(slug);

  // Distinct commission phases / projects across this artist's works — real
  // `work.project` values only (never invented).
  const projects = Array.from(
    new Set(artistWorks.map((w) => w.project).filter((p): p is string => Boolean(p)))
  );

  return (
    <>
      <SiteHeader />
      <main>
        {/* Header — typography-first, no fake portrait, no invented bio */}
        <section className="border-b border-ink/80">
          <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-8 md:py-16">
            <Overline>Artista</Overline>
            <h1 className="mt-3 font-serif text-4xl leading-[1.04] md:text-6xl">
              {artist.name}
            </h1>
            <div className="mt-6 font-mono text-[12px] text-ink-60">
              {artist.workCount}{" "}
              {artist.workCount === 1 ? "opera in MACCA" : "opere in MACCA"}
            </div>
            {/* Verified biography from the content overlay when present; the
                editorial fallback (never invented) otherwise. */}
            <div className="mt-5">
              {artist.bio ? (
                <p className="max-w-2xl text-[15px] leading-relaxed text-ink-80">
                  {artist.bio}
                </p>
              ) : (
                <FallbackNote>{FALLBACK.more}</FallbackNote>
              )}
            </div>
          </div>
        </section>

        {/* Works grid */}
        <section className="border-b border-ink/80">
          <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-8 md:py-16">
            <h2 className="font-serif text-2xl md:text-3xl">Opere in MACCA</h2>
            {artistWorks.length ? (
              <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {artistWorks.map((w) => (
                  <WorkCard key={w.slug} work={w} />
                ))}
              </div>
            ) : (
              <p className="mt-5 text-[14px] text-ink-60">
                Nessuna opera registrata al momento.
              </p>
            )}
          </div>
        </section>

        {/* Map of this artist's works + related projects */}
        <section className="border-b border-ink/80">
          <div className="mx-auto grid max-w-[1400px] md:grid-cols-[1.15fr_0.85fr]">
            <div className="relative min-h-[320px] border-b border-ink/15 md:min-h-[420px] md:border-b-0 md:border-r md:border-ink/80">
              <GoogleTerritoryMap
                center={artistWorks[0] ? workMapCenter(artistWorks[0]) : undefined}
                zoom={13}
                footnote={false}
                className="absolute inset-0"
              />
            </div>
            <div className="p-6 md:p-9">
              <Overline>Dove nel territorio</Overline>
              <p className="mt-3 max-w-md text-[14px] leading-relaxed text-ink-80">
                Le opere di {artist.name} nel paesaggio di Peccioli. La mappa è
                astratta: la posizione esatta è indicata solo dove verificata.
              </p>

              {projects.length > 0 && (
                <div className="mt-7">
                  <Overline>Fasi e progetti</Overline>
                  <ul className="mt-3 flex flex-col gap-2">
                    {projects.map((p) => (
                      <li
                        key={p}
                        className="rounded-lg border border-ink/15 bg-paper px-3.5 py-2.5 text-[13px] shadow-card"
                      >
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Link
                href="/collezione"
                className="mt-7 inline-block text-[13px] text-terracotta hover:underline focus-ring"
              >
                Tutta la collezione →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
