"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Overline, Button } from "@/components/ui";
import { WorkCard } from "@/components/work-card";
import { RouteCard } from "@/components/route-card";
import { useSaved } from "@/components/use-saved";
import { workBySlug } from "@/lib/works";
import { routeBySlug } from "@/lib/routes-data";

export default function SavedPage() {
  const { saved } = useSaved();

  // Resolve saved slugs against the current data set: stale slugs (works or
  // routes removed since they were saved) must not count towards content.
  const works = saved.works
    .map((slug) => workBySlug(slug))
    .filter((w): w is NonNullable<typeof w> => Boolean(w));
  const routes = saved.routes
    .map((slug) => routeBySlug(slug))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  const isEmpty = works.length === 0 && routes.length === 0;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1400px] px-5 py-10 md:px-8 md:py-12">
        <div className="border-b border-ink/80 pb-8">
          <Overline className="mb-3">Salvati · su questo dispositivo</Overline>
          <h1 className="font-serif text-4xl leading-[1.04] md:text-5xl">Salvati</h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-60">
            La tua lista personale di opere e percorsi. Nessun account richiesto:
            i salvataggi restano su questo dispositivo.
          </p>
        </div>

        {isEmpty ? (
          // Empty state — invites discovery, never blank.
          <div className="mt-12 flex flex-col items-center rounded-xl border border-dashed border-ink/25 bg-paper px-6 py-16 text-center">
            <span
              aria-hidden
              className="flex h-14 w-14 items-center justify-center rounded-full border border-ink bg-paper text-2xl"
            >
              ♡
            </span>
            <h2 className="mt-5 font-serif text-2xl">
              Ancora niente di salvato
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-60">
              Costruisci il tuo MACCA: salva le opere che vuoi vedere e i percorsi
              da seguire. Li ritroverai qui, pronti per la tua visita — anche
              offline.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Button href="/esplora" variant="primary" size="lg">
                Esplora la mappa
              </Button>
              <Button href="/opere" variant="secondary" size="lg">
                Sfoglia le opere
              </Button>
            </div>
            <p className="mt-6 font-mono text-[11px] text-ink-40">
              Nessun account richiesto
            </p>
          </div>
        ) : (
          <>
            {works.length > 0 && (
              <section className="mt-10">
                <h2 className="font-serif text-2xl">
                  Opere{" "}
                  <span className="text-ink-40">({works.length})</span>
                </h2>
                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {works.map((w) => (
                    <WorkCard key={w.slug} work={w} />
                  ))}
                </div>
              </section>
            )}

            {routes.length > 0 && (
              <section className="mt-12">
                <h2 className="font-serif text-2xl">
                  Percorsi{" "}
                  <span className="text-ink-40">({routes.length})</span>
                </h2>
                <div className="mt-5 grid gap-5 lg:grid-cols-2">
                  {routes.map((r) => (
                    <RouteCard key={r.slug} route={r} />
                  ))}
                </div>
              </section>
            )}

            <p className="mt-12 font-mono text-[11px] text-ink-40">
              Salvati su questo dispositivo · nessun account richiesto
            </p>
          </>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
