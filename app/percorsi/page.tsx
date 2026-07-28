import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { RouteCard } from "@/components/route-card";
import { Overline } from "@/components/ui";
import { routes } from "@/lib/collection";

const distancesPending = routes.some((r) => /tbd/i.test(r.distance));

export const metadata = {
  title: "Percorsi · MACCA",
  description:
    "Modi diversi di attraversare MACCA — per tempo, luogo, tema e accesso.",
};

export default function PercorsiPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1400px] px-5 py-12 md:px-8">
        {/* Header */}
        <header className="border-b border-ink/15 pb-8">
          <Overline>Percorsi</Overline>
          <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">
            Percorsi
          </h1>
          <p className="mt-4 max-w-xl prose-editorial text-[15px]">
            Modi diversi di attraversare MACCA — per tempo, luogo, tema e
            accesso. Non serve conoscere il mondo dell&apos;arte.
          </p>
          {distancesPending && (
            <p className="mt-4 font-mono text-[11px] uppercase tracking-overline text-ink-40">
              Distanze e tempi di sosta in verifica sul campo (tracciato GPS in
              preparazione).
            </p>
          )}
        </header>

        {/* Routes grid + build-your-own CTA */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {routes.map((route) => (
            <RouteCard key={route.slug} route={route} />
          ))}

          {/* Crea il tuo percorso */}
          <Link
            href="/percorsi/crea"
            className="group flex flex-col justify-between gap-6 rounded-xl border border-dashed border-ink/40 bg-stone-50 p-6 transition-colors hover:border-ink hover:bg-paper focus-ring"
          >
            <div>
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-ink bg-paper text-xl">
                ＋
              </span>
              <div className="mt-4 font-serif text-[22px] leading-tight">
                Crea il tuo percorso
              </div>
              <p className="mt-2 max-w-sm text-[14px] text-ink-60">
                Costruisci un percorso su misura selezionando le opere che vuoi
                vedere. Tempo, luogo e accesso a modo tuo.
              </p>
            </div>
            <span className="text-sm text-terracotta group-hover:underline">
              Inizia a comporre →
            </span>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
