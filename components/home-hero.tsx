"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "./language-provider";
import { COLLECTION_TOTAL } from "@/lib/constants";
import { clsx } from "@/lib/clsx";

/** Flagship photographs that carry the opening — real, cleared imagery only. */
const HERO_SHOTS = [
  { src: "/images/works/macca-072.jpg", title: "Breath", artist: "Emiliano Ponzi & Dario Spinelli" },
  { src: "/images/works/macca-045.jpg", title: "SolidSky", artist: "Alicja Kwade" },
  { src: "/images/works/macca-063.jpg", title: "We Rise by Lifting Others", artist: "Marinella Senatore" },
  { src: "/images/works/macca-002.jpg", title: "Colonna che scende", artist: "Hidetoshi Nagasawa" },
];

export function HomeHero() {
  const { t, lang } = useLang();
  const [i, setI] = useState(0);

  // Slow, calm crossfade — paused when the user prefers reduced motion.
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((n) => (n + 1) % HERO_SHOTS.length), 7000);
    return () => clearInterval(id);
  }, []);

  const shot = HERO_SHOTS[i];

  return (
    <section className="relative isolate flex min-h-[86svh] flex-col justify-end overflow-hidden">
      {/* Photographic stage */}
      <div className="absolute inset-0 -z-10">
        {HERO_SHOTS.map((s, n) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={s.src}
            src={s.src}
            alt=""
            aria-hidden
            className={clsx(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ease-in-out",
              n === i ? "opacity-100 kenburns" : "opacity-0"
            )}
          />
        ))}
        {/* Scrim: dark enough for type, light enough to keep the photograph. */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/45 to-ink/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/55 via-transparent to-transparent" />
        {/* Dedicated top scrim so the header stays legible over bright skies. */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ink/60 to-transparent" />
      </div>

      <div className="relative mx-auto w-full max-w-[1400px] px-5 pb-12 pt-28 md:px-8 md:pb-16 md:pt-36">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-overline text-paper/70">
            <span className="inline-block h-px w-10 bg-paper/40" aria-hidden />
            {t("hero.descriptor")}
          </div>
          <h1 className="mt-5 font-serif text-[46px] leading-[0.98] tracking-[-0.022em] text-paper md:text-[82px]">
            {lang === "it" ? (
              <>
                Un museo diffuso nel{" "}
                <em className="italic text-paper [font-variation-settings:'SOFT'_60]">paesaggio</em>{" "}
                di Peccioli.
              </>
            ) : (
              <>
                A museum dispersed across the{" "}
                <em className="italic text-paper [font-variation-settings:'SOFT'_60]">landscape</em>{" "}
                of Peccioli.
              </>
            )}
          </h1>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/esplora"
              className="group inline-flex items-center gap-2 rounded-xl bg-terracotta px-6 py-3.5 text-[15px] text-paper shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:bg-terracotta-dark hover:shadow-raised focus-ring"
            >
              {t("cta.exploreMap")}
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              href="/percorsi"
              className="group inline-flex items-center gap-2 rounded-xl border border-paper/30 bg-paper/10 px-6 py-3.5 text-[15px] text-paper backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-paper/60 hover:bg-paper/20 focus-ring"
            >
              {t("cta.chooseRoute")}
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        {/* Baseline: facts on the left, the credit for what you're looking at on the right */}
        <div className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t border-paper/20 pt-5">
          <dl className="flex gap-8">
            {[
              { n: String(COLLECTION_TOTAL), l: "opere" },
              { n: "30+", l: "anni" },
              { n: "7", l: "frazioni" },
            ].map((s) => (
              <div key={s.l}>
                <dt className="sr-only">{s.l}</dt>
                <dd className="font-serif text-[26px] leading-none text-paper">{s.n}</dd>
                <dd className="mt-1.5 font-mono text-[10px] uppercase tracking-overline text-paper/60">
                  {s.l}
                </dd>
              </div>
            ))}
          </dl>
          <div className="font-mono text-[10px] uppercase tracking-overline text-paper/55">
            <span className="text-paper/80">{shot.title}</span> · {shot.artist}
          </div>
        </div>
      </div>
    </section>
  );
}
