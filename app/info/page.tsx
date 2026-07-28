import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Overline, Card } from "@/components/ui";
import { COLLECTION_TOTAL } from "@/lib/constants";

function Section({
  overline,
  title,
  children,
}: {
  overline?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-ink/15 py-12 md:py-16">
      <div className="grid gap-8 md:grid-cols-[1fr_1.6fr]">
        <div>
          {overline && <Overline className="mb-2">{overline}</Overline>}
          <h2 className="font-serif text-2xl leading-tight md:text-3xl">{title}</h2>
        </div>
        <div className="prose-editorial max-w-editorial">{children}</div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* Intro */}
        <section className="border-b border-ink/80">
          <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-8 md:py-16">
            <Overline className="mb-4">Cos&apos;è MACCA</Overline>
            <h1 className="max-w-3xl font-serif text-4xl leading-[1.06] md:text-5xl">
              Un museo che non ha ingresso, perché comincia nel paesaggio.
            </h1>
            <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-80">
              MACCA — Museo d&apos;Arte Contemporanea a Cielo Aperto — è una
              collezione diffusa nel territorio di Peccioli, in Toscana. Non un
              edificio, ma un paese: vie, piazze, edifici pubblici e frazioni
              collinari dove l&apos;arte contemporanea vive accanto alla vita
              quotidiana.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-[1400px] px-5 md:px-8">
          {/* North-star quote */}
          <section className="border-b border-ink/15 py-14 md:py-20">
            <blockquote className="mx-auto max-w-4xl border-l-2 border-terracotta pl-6 font-serif text-3xl leading-[1.25] text-ink md:pl-8 md:text-4xl">
              «L&apos;arte non comincia all&apos;ingresso. È già nel paesaggio.»
            </blockquote>
          </section>

          <Section overline="Il modello" title="Cos&apos;è MACCA">
            <p>
              MACCA raccoglie oltre {COLLECTION_TOTAL} opere commissionate a
              artisti italiani e internazionali nell&apos;arco di trent&apos;anni.
              Le opere non sono raccolte in una sede unica: sono installate dove
              hanno senso, nello spazio condiviso del borgo e delle sue frazioni.
            </p>
            <p>
              Visitare MACCA significa camminare. La collezione si incontra
              percorrendo il territorio: una scultura sul margine della valle,
              una parete dipinta lungo una via, una voce che attraversa più
              luoghi.
            </p>
          </Section>

          <Section
            overline="Una scelta"
            title="Perché Peccioli ha costruito una collezione diffusa"
          >
            <p>
              Peccioli ha scelto di investire nella cultura come strumento di
              comunità, non come vetrina. Distribuire le opere nello spazio
              pubblico significa rifiutare la separazione tra arte e vita: non
              c&apos;è una soglia da varcare, non c&apos;è un biglietto che
              divide chi entra da chi resta fuori.
            </p>
            <p>
              Il risultato è un museo che appartiene al paese prima che ai
              visitatori — un luogo dove l&apos;opera convive con gli abitanti,
              le stagioni, il lavoro e il paesaggio agricolo.
            </p>
          </Section>

          <Section overline="Logica delle commissioni" title="Come è cresciuta nel tempo">
            <p>
              Dalla prima commissione del 1992 a oggi, la collezione si è
              infittita decennio dopo decennio. Ogni opera nasce in dialogo con
              un luogo preciso: non viene collocata, ma pensata per quel punto
              del territorio.
            </p>
            <p>
              <Link href="/timeline" className="text-terracotta hover:underline focus-ring">
                Trent&apos;anni di commissioni →
              </Link>{" "}
              raccontano un paesaggio culturale che si espande: la densità cresce
              con il tempo.
            </p>
          </Section>

          <Section
            overline="Relazioni"
            title="Arte, comunità, paesaggio e infrastruttura"
          >
            <p>
              A Peccioli l&apos;arte non è isolata dal resto: convive con le
              infrastrutture del territorio, con i servizi e con la vita civica.
              Alcune opere nascono proprio nel punto in cui paesaggio e
              infrastruttura si incontrano.
            </p>
            <p>
              Questa relazione è il cuore del progetto: l&apos;arte come parte
              dell&apos;ecosistema di un luogo, non come elemento decorativo
              aggiunto. La comunità è insieme committente, custode e pubblico.
            </p>
          </Section>

          <Section overline="Istituzione" title="Promotori e partner">
            <div className="rounded-xl border border-dashed border-ink/30 bg-stone-100 p-6">
              <p className="text-[14px] text-ink-60">
                Spazio istituzionale e partner — placeholder. I crediti completi,
                gli enti promotori e le partnership saranno pubblicati dopo la
                verifica delle informazioni.
              </p>
            </div>
          </Section>
        </div>

        {/* Wayfinding links */}
        <section className="border-t border-ink/80 bg-paper">
          <div className="mx-auto max-w-[1400px] px-5 py-12 md:px-8">
            <Overline className="mb-5">Continua</Overline>
            <div className="grid gap-4 sm:grid-cols-3">
              <Link href="/collezione" className="block focus-ring rounded-xl">
                <Card className="h-full p-6 transition-shadow hover:shadow-raised">
                  <h3 className="font-serif text-xl">Collezione</h3>
                  <p className="mt-2 text-[13px] text-ink-60">
                    Tutte le opere, per luogo, artista e tipo.
                  </p>
                </Card>
              </Link>
              <Link href="/timeline" className="block focus-ring rounded-xl">
                <Card className="h-full p-6 transition-shadow hover:shadow-raised">
                  <h3 className="font-serif text-xl">Timeline</h3>
                  <p className="mt-2 text-[13px] text-ink-60">
                    Trent&apos;anni di commissioni, decennio per decennio.
                  </p>
                </Card>
              </Link>
              <Link href="/visita" className="block focus-ring rounded-xl">
                <Card className="h-full p-6 transition-shadow hover:shadow-raised">
                  <h3 className="font-serif text-xl">Visita</h3>
                  <p className="mt-2 text-[13px] text-ink-60">
                    Come arrivare, cosa è libero, cosa va prenotato.
                  </p>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* Contatti / press */}
        <section className="bg-stone-100">
          <div className="mx-auto grid max-w-[1400px] gap-8 px-5 py-12 md:grid-cols-2 md:px-8">
            <div>
              <Overline className="mb-2">Contatti</Overline>
              <h2 className="font-serif text-2xl">Scrivici</h2>
              <p className="mt-3 max-w-md text-[14px] leading-relaxed text-ink-60">
                Per informazioni, prenotazioni di gruppo e accessibilità.
                Recapiti completi in aggiornamento.
              </p>
            </div>
            <div>
              <Overline className="mb-2">Press &amp; didattica</Overline>
              <h2 className="font-serif text-2xl">Stampa e scuole</h2>
              <p className="mt-3 max-w-md text-[14px] leading-relaxed text-ink-60">
                Materiali per la stampa e progetti educativi su richiesta —
                placeholder da completare prima della pubblicazione.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
