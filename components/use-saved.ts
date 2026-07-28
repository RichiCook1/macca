"use client";

import { useCallback, useEffect, useState } from "react";

// Local-only saved items — no account required (brief §10.12 / §18 localStorage).
const KEY = "macca:saved";

type Saved = { works: string[]; routes: string[] };
const empty: Saved = { works: [], routes: [] };

// Simple cross-component sync via a window event.
const EVENT = "macca:saved-change";

function read(): Saved {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw);
    return { works: parsed.works ?? [], routes: parsed.routes ?? [] };
  } catch {
    return empty;
  }
}

function write(next: Saved) {
  window.localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EVENT));
}

export function useSaved() {
  const [saved, setSaved] = useState<Saved>(empty);

  useEffect(() => {
    setSaved(read());
    const sync = () => setSaved(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggleWork = useCallback((slug: string) => {
    const cur = read();
    const has = cur.works.includes(slug);
    write({
      ...cur,
      works: has ? cur.works.filter((s) => s !== slug) : [...cur.works, slug],
    });
  }, []);

  const toggleRoute = useCallback((slug: string) => {
    const cur = read();
    const has = cur.routes.includes(slug);
    write({
      ...cur,
      routes: has ? cur.routes.filter((s) => s !== slug) : [...cur.routes, slug],
    });
  }, []);

  return {
    saved,
    isWorkSaved: (slug: string) => saved.works.includes(slug),
    isRouteSaved: (slug: string) => saved.routes.includes(slug),
    toggleWork,
    toggleRoute,
    count: saved.works.length + saved.routes.length,
  };
}
