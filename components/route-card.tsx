import Link from "next/link";
import type { Route } from "@/lib/types";
import { workBySlug } from "@/lib/collection";
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
  const tags = [route.type, route.duration, `${route.stops.length} tappe`];
  if (route.flagshipCount > 0) tags.push(`${route.flagshipCount} in evidenza`);

  return (
    <Link
      href={`/percorsi/${route.slug}`}
      className="group flex overflow-hidden rounded-xl border border-ink/20 bg-paper shadow-card transition-shadow hover:shadow-raised focus-ring"
    >
      <div className="relative w-40 shrink-0 overflow-hidden border-r border-ink/20">
        <RouteMapArt route={route} variant="card" night={night} />
        {booking && (
          <span className="absolute left-2 top-2 rounded-full border border-ink bg-sun px-2 py-0.5 font-mono text-[8px] text-ink">
            Su prenotazione
          </span>
        )}
      </div>
      <div className="flex-1 p-4">
        <div className="font-serif text-[19px] leading-tight">{route.title}</div>
        <div className="mt-1.5 text-[13px] text-ink-60">{route.prototypeValue}</div>
        <div className="mt-3 flex flex-wrap gap-1.5 font-mono text-[10px]">
          {tags.map((tg) => (
            <span key={tg} className="rounded-full border border-ink px-2 py-0.5">
              {tg}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
