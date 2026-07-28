"use client";

import { clsx } from "@/lib/clsx";
import { mapAreas } from "@/lib/collection";
import type { MapPoint, Work } from "@/lib/types";
import { Marker } from "./map-marker";

export const MAP_W = 1000;
export const MAP_H = 640;

const pct = (p: MapPoint) => ({
  left: `${(p.x / MAP_W) * 100}%`,
  top: `${(p.y / MAP_H) * 100}%`,
});

interface StylizedMapProps {
  works?: Work[];
  selectedSlug?: string | null;
  onSelect?: (slug: string) => void;
  /** Ordered route trace + numbered stops. Stops may carry an explicit number
   *  (n) so map numbering can match an external list that includes unresolved
   *  stops; without n they are numbered sequentially. */
  trace?: MapPoint[];
  routeStops?: (MapPoint & { n?: number })[];
  /** Start marker (e.g. parcheggio). */
  start?: MapPoint;
  showLabels?: boolean;
  showHamlets?: boolean;
  night?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Custom stylized topographic map of the Peccioli territory.
 * Abstract by design (the brief asks for a clean vector look with low visual
 * noise and no fake hand-drawn geography). MapLibre-swappable later — the marker
 * family and confidence logic stay identical.
 */
export function StylizedMap({
  works = [],
  selectedSlug,
  onSelect,
  trace,
  routeStops,
  start,
  showLabels = true,
  showHamlets = true,
  night = false,
  className,
  children,
}: StylizedMapProps) {
  const stroke = night ? "rgba(223,228,238,0.28)" : "rgba(74,93,78,0.45)";
  const road = night ? "rgba(223,228,238,0.18)" : "#cdbfa6";

  return (
    <div
      className={clsx(
        "relative h-full w-full overflow-hidden",
        night ? "bg-night" : "map-surface",
        className
      )}
    >
      <svg
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        {/* Topographic contour rings */}
        <g fill="none" stroke={stroke} strokeWidth={1.4} strokeDasharray="2 6">
          <ellipse cx={520} cy={300} rx={360} ry={230} />
          <ellipse cx={540} cy={300} rx={250} ry={160} />
          <ellipse cx={560} cy={300} rx={150} ry={95} />
          <ellipse cx={690} cy={170} rx={120} ry={80} />
        </g>
        {/* Road / ridge lines */}
        <g stroke={road} strokeWidth={2.4} strokeLinecap="round">
          <line x1={-40} y1={360} x2={1040} y2={300} />
          <line x1={-40} y1={470} x2={1040} y2={520} />
          <line x1={300} y1={-20} x2={420} y2={660} />
        </g>
      </svg>

      {/* Route trace — its own SVG with preserveAspectRatio="none" so polyline
          coordinates map exactly like the CSS-percentage marker positions
          (the decorative contour svg above uses slice and may crop). */}
      {trace && trace.length > 1 && (
        <svg
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden
        >
          <polyline
            points={trace.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="#c0573a"
            strokeWidth={3.5}
            strokeDasharray="2 9"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      )}

      {/* Hamlet / area labels */}
      {showHamlets &&
        mapAreas.map((l) => (
            <div
              key={l.slug}
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
              style={pct(l.point)}
            >
              <span
                className={clsx(
                  "font-mono text-[10px] uppercase tracking-overline",
                  night ? "text-night-tint/70" : "text-ink-60"
                )}
              >
                {l.name}
              </span>
            </div>
          ))}

      {/* Work markers */}
      {works.map((w) => {
        const selected = w.slug === selectedSlug;
        return (
          <div
            key={w.slug}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ ...pct(w.point), zIndex: selected ? 30 : 10 }}
          >
            <Marker
              kind={w.locationConfidence}
              selected={selected}
              onClick={onSelect ? () => onSelect(w.slug) : undefined}
              label={`${w.title} — ${w.place}`}
            />
            {showLabels && selected && (
              <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-ink bg-paper px-2 py-1 text-[11px] shadow-card">
                {w.title}
              </div>
            )}
          </div>
        );
      })}

      {/* Start point */}
      {start && (
        <div className="absolute -translate-x-1/2 -translate-y-1/2" style={pct(start)}>
          <span className="flex h-6 w-6 items-center justify-center rounded-[7px] border border-ink bg-paper text-[11px] font-bold">
            P
          </span>
        </div>
      )}

      {/* Numbered route stops */}
      {routeStops?.map((p, i) => (
        <div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ ...pct(p), zIndex: 25 }}
        >
          <Marker kind="route-stop" n={p.n ?? i + 1} />
        </div>
      ))}

      {children}
    </div>
  );
}

/** Compact legend for the marker family. */
export function MapLegend({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "rounded-lg border border-ink bg-paper/95 p-3 font-mono text-[10px] leading-relaxed text-ink-80 shadow-card",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full border-2 border-terracotta bg-paper" />
        indirizzo · indicativa
      </div>
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-[2px] border border-ink bg-paper" />
        sito / ingresso
      </div>
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full border border-dashed border-ink bg-paper" />
        cluster di sito
      </div>
      <div className="flex items-center gap-2">
        <span className="h-2 w-3.5 rounded-[40%] border border-dashed border-ink-60" />
        area · in verifica
      </div>
    </div>
  );
}
