import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Overline } from "@/components/ui";
import { RouteBuilderClient } from "./route-builder-client";

export const metadata = { title: "Crea il tuo percorso — MACCA" };

export default function CreateRoutePage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1400px] px-5 py-10 md:px-8">
        <Overline>04 · Interattivo</Overline>
        <h1 className="mt-2 font-serif text-3xl leading-tight md:text-4xl">Crea il tuo percorso</h1>
        <p className="mt-3 max-w-xl prose-editorial text-[15px]">
          Seleziona le opere, poi genera un percorso a piedi su misura attorno a Peccioli. L'ordine è
          ottimizzato dal parcheggio. Le distanze sono stime, da verificare sul campo.
        </p>
        <div className="mt-8">
          <RouteBuilderClient />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
