"use client";

import Link from "next/link";
import { useLang } from "./language-provider";
import { StylizedMap } from "./stylized-map";
import { flagshipWorks } from "@/lib/works";
import { COLLECTION_TOTAL } from "@/lib/constants";

export function HomeHero() {
  const { t, lang } = useLang();

  return (
    <section className="relative overflow-hidden border-b border-ink/80">
      {/* Territorial backdrop — the map is the identity */}
      <div className="absolute inset-0 opacity-[0.45]">
        <StylizedMap works={flagshipWorks} showLabels={false} showHamlets={false} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone via-stone/75 to-stone/25" />

      <div className="relative mx-auto max-w-[1400px] px-5 pb-14 pt-16 md:px-8 md:pb-24 md:pt-28">
        <div className="max-w-3xl">
          <div className="overline flex items-center gap-3">
            <span className="inline-block h-px w-10 bg-ink-40" aria-hidden />
            {t("hero.descriptor")}
          </div>
          <h1 className="mt-5 font-serif text-[44px] leading-[1.0] tracking-[-0.01em] md:text-[76px]">
            {lang === "it" ? (
              <>
                Un museo diffuso nel{" "}
                <em className="text-terracotta [font-variation-settings:'SOFT'_60]">paesaggio</em>{" "}
                di Peccioli.
              </>
            ) : (
              <>
                A museum dispersed across the{" "}
                <em className="text-terracotta [font-variation-settings:'SOFT'_60]">landscape</em>{" "}
                of Peccioli.
              </>
            )}
          </h1>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/esplora"
              className="group inline-flex items-center gap-2 rounded-xl bg-terracotta px-6 py-3.5 text-[15px] text-paper shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:bg-terracotta-dark hover:shadow-raised focus-ring"
            >
              {t("cta.exploreMap")}
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/percorsi"
              className="group inline-flex items-center gap-2 rounded-xl border border-ink/15 bg-paper/80 px-6 py-3.5 text-[15px] backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/35 hover:bg-paper hover:shadow-raised focus-ring"
            >
              {t("cta.chooseRoute")}
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/opere"
              className="group inline-flex items-center gap-2 rounded-xl border border-ink/15 bg-paper/80 px-6 py-3.5 text-[15px] backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-ink/35 hover:bg-paper hover:shadow-raised focus-ring"
            >
              {t("cta.exploreWorks")} <span aria-hidden>▦</span>
            </Link>
          </div>

          {/* Fact blocks — data as design, hairline-separated */}
          <dl className="mt-12 flex w-fit divide-x divide-ink/25 rounded-lg border border-ink/25 bg-paper/70 backdrop-blur">
            {[
              { n: String(COLLECTION_TOTAL), l: "opere" },
              { n: "30+", l: "anni" },
              { n: "1", l: "territorio" },
            ].map((s) => (
              <div key={s.l} className="px-6 py-3 text-center first:pl-6 last:pr-6">
                <dt className="sr-only">{s.l}</dt>
                <dd className="font-serif text-2xl leading-none">{s.n}</dd>
                <dd className="mt-1 font-mono text-[10px] uppercase tracking-overline text-ink-60">
                  {s.l}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
