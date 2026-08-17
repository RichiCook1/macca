"use client";

import Link from "next/link";
import { useItinerary } from "./use-itinerary";
import { clsx } from "@/lib/clsx";

/** Add/remove a work from the personal itinerary, with a link to /itinerario. */
export function ItineraryButton({ slug, className }: { slug: string; className?: string }) {
  const { has, toggle, count } = useItinerary();
  const inIt = has(slug);

  return (
    <div className={clsx("flex items-center gap-2", className)}>
      <button
        type="button"
        onClick={() => toggle(slug)}
        aria-pressed={inIt}
        className={clsx(
          "inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-ink px-4 py-2.5 text-sm font-medium transition-colors focus-ring",
          inIt ? "bg-ink text-paper hover:bg-ink/90" : "bg-paper text-ink hover:bg-ink/[0.04]"
        )}
      >
        {inIt ? "Nell'itinerario ✓" : "＋ Aggiungi all'itinerario"}
      </button>
      {count > 0 && (
        <Link
          href="/itinerario"
          className="inline-flex items-center gap-1.5 rounded-lg border border-ink bg-paper px-3 py-2.5 text-sm text-ink transition-colors hover:bg-ink/[0.04] focus-ring"
          aria-label={`Vai al mio itinerario (${count})`}
        >
          Itinerario
          <span className="rounded-full bg-terracotta px-1.5 text-[11px] text-paper">{count}</span>
        </Link>
      )}
    </div>
  );
}
