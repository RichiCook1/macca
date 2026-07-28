"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Overline } from "@/components/ui";
import { Marker } from "@/components/map-marker";
import { AccessBadge, ConfidenceLabel, DataConfidenceTag } from "@/components/badges";
import { accessMeta, confidenceMeta, dataConfidenceMeta } from "@/lib/constants";
import type { AccessClass, MapConfidence, DataConfidence } from "@/lib/collection";

/** Section shell for the component sheet. */
function Sheet({
  letter,
  title,
  children,
}: {
  letter: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-ink/15 py-12">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[11px] text-ink-40">{letter}</span>
        <h2 className="font-serif text-2xl md:text-3xl">{title}</h2>
      </div>
      <div className="mt-7">{children}</div>
    </section>
  );
}

/** A row in the marker family — glyph + name + description. */
function MarkerRow({
  glyph,
  name,
  desc,
}: {
  glyph: React.ReactNode;
  name: string;
  desc: string;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-hairline py-4 last:border-b-0">
      <div className="flex w-12 shrink-0 justify-center">{glyph}</div>
      <div>
        <div className="text-[15px]">{name}</div>
        <div className="text-[12px] text-ink-60">{desc}</div>
      </div>
    </div>
  );
}

const swatches: { name: string; token: string; usage: string; cls: string; hatch?: boolean }[] = [
  { name: "Stone", token: "bg-stone", usage: "sfondo", cls: "bg-stone" },
  { name: "Ink", token: "text-ink", usage: "testo · linee", cls: "bg-ink" },
  { name: "Cypress", token: "text-cypress", usage: "mappa · libero accesso", cls: "bg-cypress" },
  { name: "Terracotta", token: "bg-terracotta", usage: "CTA · selezione · segnale", cls: "bg-terracotta" },
  { name: "Sky haze", token: "bg-sky", usage: "superfici · acqua · distanza", cls: "bg-sky" },
  { name: "Sun", token: "bg-sun", usage: "avviso · scoperta · prenotazione", cls: "bg-sun" },
  { name: "Night", token: "bg-night", usage: "notturna · superfici inverse", cls: "bg-night" },
  { name: "Placeholder", token: ".hatch", usage: "immagine assente", cls: "hatch", hatch: true },
];

// Real map-confidence enum (MapConfidence) — none of these is a verified exact pin.
const markerKinds: { kind: MapConfidence; name: string }[] = [
  { kind: "site", name: "Sito / ingresso" },
  { kind: "address", name: "Indirizzo (approssimato)" },
  { kind: "cluster", name: "Cluster di sito" },
  { kind: "area", name: "Solo a livello di area" },
  { kind: "external", name: "Coordinate da fonte esterna" },
];

// Real access enum (AccessClass).
const accessOrder: AccessClass[] = [
  "public-exterior",
  "dependent-hours",
  "booking",
  "church",
  "semi-public",
  "mixed",
  "confirm",
];

const confidenceOrder: MapConfidence[] = ["site", "address", "cluster", "area", "external"];

const dataLevels: DataConfidence[] = ["High", "Medium", "Low"];

export default function SystemPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1100px] px-5 py-10 md:px-8 md:py-12">
        <div className="border-b border-ink/80 pb-8">
          <Overline className="mb-3">03 · Sistema</Overline>
          <h1 className="font-serif text-4xl leading-[1.04] md:text-5xl">
            Marcatori, badge, token
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-60">
            Componenti da disegnare una volta e riusare ovunque. Onestà della
            posizione e accesso sempre leggibili.
          </p>
          <p className="mt-4 max-w-xl text-[13px] leading-relaxed text-ink-60">
            Nessun record del seed è un pin esatto verificato: ogni marcatore
            comunica approssimazione o ancoraggio a livello di sito/area, mai una
            posizione precisa.
          </p>
        </div>

        {/* (a) Marker family — real MapConfidence kinds + route-stop */}
        <Sheet letter="C1" title="Famiglia di marcatori">
          <div className="max-w-2xl rounded-xl border border-ink/15 bg-paper p-5 shadow-card md:p-6">
            {markerKinds.map((m) => (
              <MarkerRow
                key={m.kind}
                glyph={<Marker kind={m.kind} n={m.kind === "cluster" ? 5 : undefined} label={m.name} />}
                name={m.name}
                desc={confidenceMeta[m.kind].hint}
              />
            ))}
            <MarkerRow
              glyph={<Marker kind="site" selected label="Marcatore selezionato" />}
              name="Marcatore selezionato"
              desc="Stato attivo, alone evidente"
            />
            <MarkerRow
              glyph={<Marker kind="route-stop" n={2} label="Tappa di percorso" />}
              name="Tappa di percorso"
              desc="Numerata, in sequenza"
            />
          </div>
        </Sheet>

        {/* (b) Access badges */}
        <Sheet letter="C2" title="Badge di accesso">
          <div className="max-w-2xl rounded-xl border border-ink/15 bg-paper p-5 shadow-card md:p-6">
            <div className="flex flex-col gap-3">
              {accessOrder.map((state) => (
                <AccessBadge key={state} state={state} />
              ))}
            </div>
            <p className="mt-5 border-t border-hairline pt-4 text-[13px] leading-relaxed text-ink-60">
              Mai allarmanti se non per sicurezza. Lo stato non è comunicato dal
              colore soltanto: c&apos;è sempre il testo, e dove disponibile la
              stringa esatta di <span className="font-mono">access_type</span>.
            </p>
          </div>
        </Sheet>

        {/* (b2) Confidence labels — one per MapConfidence */}
        <Sheet letter="C2b" title="Etichette di affidabilità della posizione">
          <div className="max-w-2xl rounded-xl border border-ink/15 bg-paper p-5 shadow-card md:p-6">
            <div className="flex flex-col gap-3">
              {confidenceOrder.map((c) => (
                <ConfidenceLabel key={c} confidence={c} />
              ))}
            </div>
            <p className="mt-5 border-t border-hairline pt-4 text-[13px] leading-relaxed text-ink-60">
              Nessuna di queste è una posizione esatta: comunicano sempre il
              livello reale di verifica.
            </p>
          </div>
        </Sheet>

        {/* (b3) Data-confidence tags */}
        <Sheet letter="C2c" title="Affidabilità dei dati">
          <div className="max-w-2xl rounded-xl border border-ink/15 bg-paper p-5 shadow-card md:p-6">
            <div className="flex flex-col gap-3">
              {dataLevels.map((level) => (
                <DataConfidenceTag key={level} level={level} />
              ))}
            </div>
            <p className="mt-5 border-t border-hairline pt-4 text-[13px] leading-relaxed text-ink-60">
              Indicatore quieto su ogni scheda: {dataConfidenceMeta.High.label.split(":")[0]} ad
              alta, media o bassa affidabilità.
            </p>
          </div>
        </Sheet>

        {/* (c) Colour & type tokens */}
        <Sheet letter="C3" title="Colore &amp; tipografia">
          <Overline className="mb-4">Palette · base quieta, accenti strutturali</Overline>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {swatches.map((s) => (
              <div key={s.name}>
                <div
                  className={`h-14 rounded-lg border border-ink ${s.cls}`}
                  aria-hidden
                />
                <div className="mt-2 text-[13px]">{s.name}</div>
                <div className="font-mono text-[10px] text-ink-60">{s.token}</div>
                <div className="font-mono text-[10px] text-ink-40">{s.usage}</div>
              </div>
            ))}
          </div>

          <Overline className="mb-4 mt-10">Tipografia</Overline>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-ink/15 bg-paper p-6 shadow-card">
              <div className="font-serif text-3xl leading-none">Serif editoriale</div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-overline text-ink-40">
                font-serif · Fraunces
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-60">
                Titoli delle opere, citazioni e momenti editoriali lunghi.
              </p>
            </div>
            <div className="rounded-xl border border-ink/15 bg-paper p-6 shadow-card">
              <div className="font-sans text-2xl font-medium leading-none">Grotesk UI</div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-overline text-ink-40">
                font-sans · Inter
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-60">
                Navigazione, dati, filtri ed etichette di mappa.
              </p>
            </div>
          </div>
          <p className="mt-5 font-mono text-[12px] text-ink-60">
            <span className="overline">overline in maiuscoletto</span> · mai corpo
            in maiuscolo.
          </p>
        </Sheet>
      </main>
      <SiteFooter />
    </>
  );
}
