import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Overline } from "@/components/ui";
import {
  rightsRegister,
  verificationQueue,
  collectionMeta,
} from "@/lib/governance";

export const metadata = {
  title: "Cantiere · stato dei dati · MACCA",
  description:
    "Stato di verifica del prototipo MACCA: coda di verifica, registro diritti immagini e fonti.",
};

// Sources are structured records in the seed (title/url/publisher/role/…),
// not plain strings — render them as linked entries.
type SourceLike =
  | string
  | {
      source_id?: string;
      title?: string;
      url?: string;
      publisher?: string;
      role?: string;
      reliability?: string;
      accessed?: string;
    };

const sources = (collectionMeta.sources ?? []) as unknown as SourceLike[];

const priorityTone: Record<string, string> = {
  P0: "border-terracotta text-terracotta",
  P1: "border-sun text-sun-ink",
  P2: "border-ink/40 text-ink-60",
};

export default function CantierePage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1100px] px-5 py-12 md:px-8">
        {/* Intro */}
        <header className="border-b border-ink/15 pb-8">
          <Overline>Cantiere · stato dei dati</Overline>
          <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">
            Cantiere
          </h1>
          <p className="mt-4 max-w-2xl prose-editorial text-[15px] text-ink-80">
            {collectionMeta.scopeNote}
          </p>
          {collectionMeta.generatedAt && (
            <p className="mt-3 font-mono text-[11px] uppercase tracking-overline text-ink-40">
              Seed generato il {collectionMeta.generatedAt}
            </p>
          )}
        </header>

        {/* Coda di verifica */}
        <section className="border-b border-ink/15 py-10">
          <Overline>Coda di verifica</Overline>
          <p className="mt-2 max-w-2xl text-[13px] text-ink-60">
            Cosa va confermato sul campo prima della pubblicazione. Per priorità.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            {verificationQueue.map((v) => (
              <article
                key={v.verification_id}
                className="rounded-lg border border-ink/15 bg-paper p-4 font-mono text-[12px] leading-relaxed"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] ${
                      priorityTone[v.priority] ?? "border-ink/40 text-ink-60"
                    }`}
                  >
                    {v.priority}
                  </span>
                  <span className="uppercase tracking-overline text-ink-60">
                    {v.topic}
                  </span>
                  <span className="text-ink-40">· {v.scope}</span>
                  <span className="ml-auto rounded-full border border-dashed border-ink/40 px-2 py-0.5 text-[10px] text-ink-60">
                    {v.status}
                  </span>
                </div>
                <p className="mt-3 font-sans text-[14px] text-ink-80">
                  {v.request}
                </p>
                <p className="mt-2 text-ink-60">
                  <span className="text-ink-40">Perché · </span>
                  {v.why}
                </p>
                <p className="mt-1 text-ink-40">Owner · {v.owner}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Registro diritti immagini */}
        <section className="border-b border-ink/15 py-10">
          <Overline>Registro diritti immagini</Overline>
          <p className="mt-2 max-w-2xl text-[13px] text-ink-60">
            Nessuna immagine è riprodotta nel prototipo senza diritti confermati.
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {rightsRegister.map((a) => (
              <article
                key={a.asset_id}
                className="rounded-lg border border-ink/15 bg-paper p-4 text-[12px] leading-relaxed"
              >
                <div className="font-serif text-[16px] leading-snug">
                  {a.related_work_or_cluster}
                </div>
                <span className="mt-2 inline-flex items-center rounded-full border border-dashed border-ink/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-overline text-ink-60">
                  {a.external_launch_status}
                </span>
                <dl className="mt-3 flex flex-col gap-2 font-mono text-[11px] text-ink-80">
                  <div>
                    <dt className="text-ink-40">Diritti di riproduzione</dt>
                    <dd>{a.reproduction_rights}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-40">Credito da confermare</dt>
                    <dd>{a.credit_to_confirm}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-40">Prossima azione</dt>
                    <dd>{a.next_action}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        {/* Fonti */}
        <section className="py-10">
          <Overline>Fonti</Overline>
          <ul className="mt-6 flex flex-col gap-3 font-mono text-[12px]">
            {sources.map((s, i) => {
              if (typeof s === "string") {
                const isUrl = /^https?:\/\//.test(s);
                return (
                  <li key={i}>
                    {isUrl ? (
                      <a
                        href={s}
                        target="_blank"
                        rel="noreferrer"
                        className="text-terracotta hover:underline focus-ring"
                      >
                        {s}
                      </a>
                    ) : (
                      <span className="text-ink-80">{s}</span>
                    )}
                  </li>
                );
              }
              return (
                <li key={s.source_id ?? i} className="flex flex-col gap-0.5">
                  {s.url ? (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-terracotta hover:underline focus-ring"
                    >
                      {s.title ?? s.url}
                    </a>
                  ) : (
                    <span className="text-ink-80">{s.title}</span>
                  )}
                  <span className="text-ink-40">
                    {[s.publisher, s.reliability, s.accessed]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
