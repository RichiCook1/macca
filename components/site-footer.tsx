"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LangSwitch } from "./lang-switch";

const cols: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Collezione",
    links: [
      { label: "Opere", href: "/opere" },
      { label: "Collezione", href: "/collezione" },
      { label: "Percorsi", href: "/percorsi" },
      { label: "Timeline", href: "/timeline" },
    ],
  },
  {
    title: "Visita",
    links: [
      { label: "Esplora la mappa", href: "/esplora" },
      { label: "Visita", href: "/visita" },
      { label: "Accessibilità", href: "/visita" },
      { label: "Contatti", href: "/info" },
    ],
  },
  {
    title: "Istituzione",
    links: [
      { label: "MACCA", href: "/info" },
      { label: "Sistema di design", href: "/sistema" },
      { label: "Salvati", href: "/salvati" },
      { label: "Crediti", href: "/info" },
    ],
  },
];

export function SiteFooter() {
  // Parallax reveal: the footer is pinned behind the page (fixed, z-0) while
  // the content (main, z-10, opaque) scrolls away above it — the dark panel is
  // uncovered rather than scrolled in. A spacer keeps the document height
  // honest; its height mirrors the real footer via ResizeObserver, with a CSS
  // fallback so no-JS users still get a scroll-past reveal.
  const footRef = useRef<HTMLElement | null>(null);
  const [h, setH] = useState<number | null>(null);

  useEffect(() => {
    const el = footRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => setH(el.offsetHeight));
    ro.observe(el);
    setH(el.offsetHeight);
    return () => ro.disconnect();
  }, []);

  return (
    <>
    <div
      aria-hidden
      className="mt-20 h-[640px] md:h-[520px]"
      style={h != null ? { height: h } : undefined}
    />
    <footer ref={footRef} className="fixed inset-x-0 bottom-0 z-0 bg-ink pb-[var(--bnav)] text-stone-200">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-12 md:grid-cols-[1.5fr_2fr] md:px-8">
        <div>
          <div className="font-serif text-3xl font-semibold text-paper">MACCA</div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone-300/80">
            Museo d'Arte Contemporanea a Cielo Aperto. Un museo diffuso nel paesaggio di
            Peccioli, in Toscana.
          </p>
          <div className="mt-5">
            <LangSwitch className="border-stone-300/40 text-stone-200" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {cols.map((c) => (
            <div key={c.title}>
              <div className="font-mono text-[10px] uppercase tracking-overline text-stone-300/60">
                {c.title}
              </div>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-stone-300/90">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="hover:text-paper focus-ring">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      {/* Oversized wordmark — the museum signs the page like the land signs the map */}
      <div aria-hidden className="select-none overflow-hidden px-5 md:px-8">
        <div className="mx-auto max-w-[1400px] translate-y-[0.18em] font-serif text-[22vw] font-semibold leading-none tracking-tight text-stone-300/[0.08] md:text-[200px]">
          MACCA
        </div>
      </div>
      <div className="border-t border-stone-300/15">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-1 px-5 py-5 font-mono text-[11px] text-stone-300/60 md:flex-row md:items-center md:justify-between md:px-8">
          <span>© {new Date().getFullYear()} MACCA · Peccioli</span>
          <span>Prototipo · diritti immagine da verificare prima della pubblicazione</span>
        </div>
      </div>
    </footer>
    </>
  );
}
