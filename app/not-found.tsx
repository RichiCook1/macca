import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex min-h-[60vh] max-w-[1400px] flex-col items-center justify-center px-5 py-20 text-center md:px-8">
        <div className="overline">Errore 404</div>
        <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">
          Questa pagina non è sulla mappa.
        </h1>
        <p className="mt-4 max-w-md prose-editorial text-[15px]">
          Il contenuto che cerchi non esiste o è stato spostato. Torna al territorio: la mappa è
          sempre il punto di partenza.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button href="/esplora">Esplora la mappa</Button>
          <Button href="/" variant="secondary">
            Torna alla home
          </Button>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
