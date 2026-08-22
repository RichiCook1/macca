import Link from "next/link";
import type { Route } from "@/lib/types";
import { workBySlug } from "@/lib/collection";
import { WorkPhoto } from "./work-image";
import { clsx } from "@/lib/clsx";
import { RouteMapArt } from "./route-map";

export function routeIsBooking(route: Route): boolean {
  return /book|controll|prenot/i.test(route.access);
}
export function routeIsNight(route: Route): boolean {
  return route.stops.some((s) => (s.workSlug ? workBySlug(s.workSlug)?.nightView : false));
}

export function RouteCard({ route }: { route: Route }) {
  const night = routeIsNight(route);
  const booking = routeIsBooking(route);

  // Works on this route that carry a real cleared photograph.
  const routeWorks = route.stops
    .map((s) => (s.workSlug ? workBySlug(s.workSlug) : undefined))
    .filter((w): w is NonNullable<typeof w> => Boolean(w?.heroImage));
  const previewWorks = routeWorks.slice(0, 4);
  const remaining = routeWorks.length - previewWorks.length;
  const tags = [route.type, route.duration, `${route.stops.length} tappe`];
  if (route.flagshipCount > 0) tags.push(`${route.flagshipCount} in evidenza`);

  return (
    <Link
      href={`/percorsi/${route.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-ink/15 bg-paper shadow-card transition-shadow hover:shadow-raised focus-ring sm:flex-row"
    >
      <div className="relative h-32 w-full shrink-0 overflow-hidden border-b border-ink/10 sm:h-auto sm:w-40 sm:border-b-0 sm:border-r">
        <RouteMapArt route={route} variant="card" night={night} />
        {booking && (
          <span className="absolute left-2 top-2 rounded-full border border-ink bg-sun px-2 py-0.5 font-mono text-[8px] text-ink">
            Su prenotazione
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-4">
        <div className="font-serif text-[19px] leading-tight">{route.title}</div>
        <div className="mt-1.5 text-[13px] text-ink-60">{route.prototypeValue}</div>
        <div className="mt-3 flex flex-wrap gap-1.5 font-mono text-[10px] [&>span]:max-w-full">
          {tags.map((tg) => (
            <span key={tg} className="rounded-full border border-ink/25 px-2 py-0.5">
              {tg}
            </span>
          ))}
        </div>

        {/* Preview of the works on this route — the first few photographed
            stops, plus a count of what isn't shown. */}
        {previewWorks.length > 0 && (
          <div className="mt-auto flex min-w-0 items-center gap-2 pt-4">
            <div className="flex min-w-0 gap-1.5">
              {previewWorks.map((w) => (
                <div
                  key={w.slug}
                  title={`${w.title} · ${w.artist}`}
                  className="h-11 w-11 shrink-0 overflow-hidden rounded-md border border-ink/10 shadow-card"
                >
                  <WorkPhoto
                    image={w.heroImage!}
                    alt={w.title}
                    className="h-full w-full"
                    showCredit={false}
                  />
                </div>
              ))}
            </div>
            {remaining > 0 && (
              <span className="shrink-0 font-mono text-[10px] text-ink-40">+{remaining}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
