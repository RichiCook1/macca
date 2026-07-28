import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Overline, Button, Card } from "@/components/ui";
import { AccessBadge } from "@/components/badges";
import { locationForArea } from "@/lib/collection";
import type { AreaSlug } from "@/lib/types";

/** /luoghi routes are keyed by location_id — resolve the area's location, or fall back to the map. */
function areaHref(area: AreaSlug): string {
  const loc = locationForArea(area);
  return loc ? `/luoghi/${loc.slug}` : "/esplora";
}

const infoCards: { title: string; body: string; muted?: boolean }[] = [
  {
    title: "Arrivare",
    body: "In auto da Pisa / Firenze · collegamenti pubblici da aggiornare.",
  },
  {
    title: "Parcheggio",
    body: "Aree all'ingresso dei borghi · breve cammino verso il centro.",
  },
  {
    title: "Accessibilità",
    body: "Accessibilità per opera in corso di rilevazione. Fondi misti.",
  },
  {
    title: "Orari",
    body: "Stagionali · placeholder da aggiornare prima della pubblicazione.",
    muted: true,
  },
];

const checklist = [
  "Scarpe comode — saliscendi e fondi diversi",
  "Salva opere e percorsi nel tuo browser",
  "Rispetta luoghi, abitanti e opere",
  "Controlla i siti su prenotazione",
];

export default function VisitPage() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* Header */}
        <section className="border-b border-ink/80">
          <div className="mx-auto max-w-[1400px] px-5 py-10 md:px-8 md:py-12">
            <Overline className="mb-3">Visita</Overline>
            <h1 className="font-serif text-4xl leading-[1.04] md:text-5xl">
              Prima di partire.
            </h1>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-60">
              MACCA si visita nello spazio pubblico. Alcuni luoghi richiedono
              prenotazione o accesso regolato: qui è tutto chiaro.
            </p>
          </div>
        </section>

        {/* THE KEY DISTINCTION — free public space vs booking / controlled */}
        <section className="border-b border-ink/80">
          <div className="mx-auto grid max-w-[1400px] md:grid-cols-2">
            {/* Free — cypress / green */}
            <div className="border-b border-ink/80 p-6 md:border-b-0 md:border-r md:border-ink/80 md:p-9">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-overline text-cypress">
                <span className="h-2.5 w-2.5 rounded-full bg-cypress" />
                Liberamente visitabili
              </div>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-80">
                La maggior parte delle opere è all&apos;aperto, nello spazio
                pubblico di Peccioli e delle frazioni. Nessuna prenotazione,
                nessun biglietto.
              </p>
              <ul className="mt-5 flex flex-col gap-2.5 text-[14px]">
                <li className="flex items-baseline gap-2">
                  <span className="text-cypress">·</span>
                  <Link href={areaHref("peccioli")} className="hover:text-terracotta focus-ring">
                    Centro storico di Peccioli
                  </Link>
                </li>
                <li className="flex items-baseline gap-2">
                  <span className="text-cypress">·</span>
                  <Link href={areaHref("ghizzano")} className="hover:text-terracotta focus-ring">
                    Ghizzano — colore e sculture
                  </Link>
                </li>
                <li className="flex items-baseline gap-2">
                  <span className="text-cypress">·</span>
                  <Link href={areaHref("le-serre")} className="hover:text-terracotta focus-ring">
                    Le Serre — opere civiche
                  </Link>
                </li>
              </ul>
              <div className="mt-6">
                <AccessBadge state="public-exterior" size="sm" />
              </div>
            </div>

            {/* Booking / controlled — sun / gold */}
            <div className="bg-sun-tint p-6 md:p-9">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-overline text-sun-ink">
                <span className="h-2.5 w-2.5 rounded-full bg-sun" />
                Su prenotazione / accesso regolato
              </div>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-80">
                Alcuni siti — interni, edifici controllati, Belvedere —
                richiedono appuntamento o orari verificati. Pianifica in
                anticipo.
              </p>
              <ul className="mt-5 flex flex-col gap-2.5 text-[14px]">
                <li className="flex items-baseline gap-2">
                  <span className="text-sun-ink">·</span>
                  <Link href={areaHref("belvedere")} className="hover:text-terracotta focus-ring">
                    Belvedere — accesso regolato
                  </Link>
                </li>
                <li className="flex items-baseline gap-2">
                  <span className="text-sun-ink">·</span>
                  <span>Palazzo Senza Tempo — orari da verificare</span>
                </li>
              </ul>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <AccessBadge state="booking" size="sm" />
                <AccessBadge state="dependent-hours" size="sm" />
              </div>
              <div className="mt-6">
                <Button href="/info" variant="primary">
                  Prenota una visita
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 4-card practical grid */}
        <section className="border-b border-ink/80">
          <div className="mx-auto max-w-[1400px] px-5 py-8 md:px-8 md:py-10">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {infoCards.map((c) => (
                <Card key={c.title} className="p-5">
                  <h2 className="font-serif text-lg">{c.title}</h2>
                  <p
                    className={
                      c.muted
                        ? "mt-2 text-[13px] leading-relaxed text-ink-40"
                        : "mt-2 text-[13px] leading-relaxed text-ink-60"
                    }
                  >
                    {c.body}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Before you go + group / school visits */}
        <section>
          <div className="mx-auto grid max-w-[1400px] gap-8 px-5 py-10 md:grid-cols-[1.5fr_1fr] md:px-8 md:py-12">
            <div>
              <h2 className="font-serif text-2xl">Da sapere prima</h2>
              <ul className="mt-5 flex flex-col gap-3 text-[14px] text-ink-80">
                {checklist.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border border-ink"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Card className="self-start bg-stone-200 p-6">
              <h2 className="font-serif text-lg">Visite di gruppo e scuole</h2>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-60">
                Contesto didattico, siti prenotabili e accessibilità su
                richiesta. Pianifichiamo insieme il percorso più adatto.
              </p>
              <Link
                href="/info"
                className="mt-4 inline-block text-[13px] text-terracotta hover:underline focus-ring"
              >
                Contatti →
              </Link>
            </Card>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
