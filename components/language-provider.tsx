"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Lang = "it" | "en";

// UI chrome dictionary. Editorial / artwork body copy stays Italian-first in this
// prototype (clearly modular so curated EN text can replace it later); the switch
// proves the bilingual system without changing hierarchy or breaking layouts.
const dict = {
  "nav.explore": { it: "Esplora", en: "Explore" },
  "nav.collection": { it: "Collezione", en: "Collection" },
  "nav.works": { it: "Opere", en: "Works" },
  "nav.routes": { it: "Percorsi", en: "Routes" },
  "nav.timeline": { it: "Timeline", en: "Timeline" },
  "nav.visit": { it: "Visita", en: "Visit" },
  "nav.about": { it: "MACCA", en: "MACCA" },
  "cta.openMap": { it: "Apri mappa", en: "Open map" },
  "cta.exploreMap": { it: "Esplora la mappa", en: "Explore the map" },
  "cta.chooseRoute": { it: "Scegli un percorso", en: "Choose a route" },
  "cta.exploreWorks": { it: "Esplora le opere", en: "Explore the works" },
  "cta.directions": { it: "Apri indicazioni", en: "Get directions" },
  "cta.save": { it: "Salva", en: "Save" },
  "cta.saved": { it: "Salvato", en: "Saved" },
  "cta.share": { it: "Condividi", en: "Share" },
  "cta.startRoute": { it: "Avvia il percorso", en: "Start route" },
  "cta.book": { it: "Prenota una visita", en: "Book a visit" },
  "util.search": { it: "Cerca", en: "Search" },
  "util.saved": { it: "Salvati", en: "Saved" },
  "util.menu": { it: "Menu", en: "Menu" },
  "label.nearby": { it: "Nelle vicinanze", en: "Nearby" },
  "label.continueRoute": { it: "Continua il percorso", en: "Continue the route" },
  "label.map": { it: "Mappa", en: "Map" },
  "label.list": { it: "Lista", en: "List" },
  "label.grid": { it: "Griglia", en: "Grid" },
  "label.feed": { it: "Feed", en: "Feed" },
  "label.filters": { it: "Filtri", en: "Filters" },
  "label.reset": { it: "Azzera", en: "Reset" },
  "hero.descriptor": {
    it: "Museo d'Arte Contemporanea a Cielo Aperto",
    en: "Open-air Museum of Contemporary Art",
  },
  "hero.line": {
    it: "Un museo diffuso nel paesaggio di Peccioli.",
    en: "A museum dispersed across the landscape of Peccioli.",
  },
} as const;

export type DictKey = keyof typeof dict;

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: DictKey) => string;
}

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("it");

  useEffect(() => {
    const stored = window.localStorage.getItem("macca:lang") as Lang | null;
    if (stored === "it" || stored === "en") {
      setLangState(stored);
      document.documentElement.lang = stored;
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("macca:lang", l);
    document.documentElement.lang = l;
  }, []);

  const toggle = useCallback(() => setLang(lang === "it" ? "en" : "it"), [lang, setLang]);
  const t = useCallback((key: DictKey) => dict[key][lang], [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
