import Link from "next/link";
import type { Route } from "@/lib/types";
import { workBySlug } from "@/lib/collection";
import { clsx } from "@/lib/clsx";

export function routeIsBooking(route: Route): boolean {
  return /book|controll|prenot/i.test(route.access);
}
export function routeIsNight(route: Route): boolean {
  return route.stops.some((s) => (s.workSlug ? workBySlug(s.workSlug)?.nightView : false));
}

/** Mini route-trace graphic — distinct per route, part of one family. */
function MiniTrace({ route, night }: { route: Route; night: boolean }) {
  if (route.trace.length < 2) {
    return (
      <div className="flex h-full items-center justify-center font-mono text-[9px] text-ink-40">
        traccia in verifica
      </div>
    );
  }
  const xs = route.trace.map((p) => p.x);
  const ys = route.trace.map((p) => p.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const w = Math.max(...xs) - minX || 1;
  const h = Math.max(...ys) - minY || 1;
  const pts = route.trace
    .map((p) => `${20 + ((p.x - minX) / w) * 120},${30 + ((p.y - minY) / h) * 140}`)
    .join(" ");
  return (
    <svg viewBox="0 0 160 200" className="h-full w-full" aria-hidden>
      <polyline
        points={pts}
        fill="none"
        stroke={night ? "#e8c14e" : "#c0573a"}
        strokeWidth={3}
        strokeDasharray="2 6"
        strokeLinecap="round"
      />
      {route.trace.map((p, i) => (
        <circle
          key={i}
          cx={20 + ((p.x - minX) / w) * 120}
          cy={30 + ((p.y - minY) / h) * 140}
          r={4}
          fill={night ? "#e8c14e" : "#c0573a"}
        />
      ))}
    </svg>
  );
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
      <div
        className={clsx(
          "relative w-40 shrink-0 border-r border-ink/20",
          night ? "bg-night" : "map-surface"
        )}
      >
        <MiniTrace route={route} night={night} />
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
