import type { Route } from "@/lib/types";
import { workBySlug } from "@/lib/collection";
import { workMapCenter } from "@/lib/maps";

/**
 * Editorial route-map illustration — a designed *placeholder* built from each
 * route's real geography (stop coordinates projected from the seed locations),
 * drawn in the language of a printed trail map: soft paper, contour hills, a
 * valley river, and a flowing dashed line threading numbered stops. It is not a
 * survey map — the styling is deliberately illustrative — so it fills the
 * "designed map coming" gap without implying precision the data doesn't have.
 *
 * Two variants: `card` (compact, chrome-free) and `hero` (adds compass + scale).
 */

type Pt = { x: number; y: number };

const PALETTE = {
  paper: "#efe9db",
  paperDeep: "#e6dfcd",
  ink: "#34322d",
  contour: "#d8cfb8",
  water: "#bcccce",
  waterLine: "#9fb3b6",
  road: "#ded4bd",
  route: "#c0573a",
  routeNight: "#e8c14e",
  night: "#2b3242",
  nightPaper: "#333c50",
  nightContour: "#3d4860",
  nightInk: "#e9e3d4",
};

/** Ordered real coordinates for a route's matchable stops. */
function routePoints(route: Route): { lat: number; lng: number }[] {
  const out: { lat: number; lng: number }[] = [];
  for (const s of route.stops) {
    if (!s.workSlug) continue;
    const w = workBySlug(s.workSlug);
    if (!w) continue;
    out.push(workMapCenter(w));
  }
  return out;
}

/** Fit lat/lng into the frame; if the real spread is tiny (a tight old-town
 *  loop), lay the stops along a designed S-curve instead — legibility first. */
function layout(geo: { lat: number; lng: number }[], W: number, H: number, pad: number): Pt[] {
  const n = geo.length;
  if (n === 0) return [];
  const lats = geo.map((g) => g.lat);
  const lngs = geo.map((g) => g.lng);
  let minLat = Math.min(...lats),
    maxLat = Math.max(...lats),
    minLng = Math.min(...lngs),
    maxLng = Math.max(...lngs);
  const spanLat = maxLat - minLat;
  const spanLng = maxLng - minLng;
  const iw = W - 2 * pad;
  const ih = H - 2 * pad;

  // Geographic spread big enough to read? Project it (aspect-corrected).
  const geoWide = spanLat > 0.01 || spanLng > 0.01;
  if (geoWide) {
    const cos = Math.cos(((minLat + maxLat) / 2) * (Math.PI / 180));
    const gw = Math.max(spanLng * cos, 1e-6);
    const gh = Math.max(spanLat, 1e-6);
    const scale = Math.min(iw / gw, ih / gh) * 0.86;
    const ox = pad + (iw - gw * scale) / 2;
    const oy = pad + (ih - gh * scale) / 2;
    return geo.map((g) => ({
      x: ox + (g.lng - minLng) * cos * scale,
      y: oy + (maxLat - g.lat) * scale,
    }));
  }

  // Clustered → designed winding path across the frame.
  return geo.map((_, i) => {
    const t = n === 1 ? 0.5 : i / (n - 1);
    return {
      x: pad + t * iw,
      y: pad + ih * (0.5 + 0.34 * Math.sin(t * Math.PI * 2.2 - 0.6)),
    };
  });
}

/** Catmull-Rom → cubic-bezier smooth path through the points. */
function smoothPath(p: Pt[]): string {
  if (p.length < 2) return "";
  if (p.length === 2) return `M${p[0].x} ${p[0].y} L${p[1].x} ${p[1].y}`;
  let d = `M${p[0].x} ${p[0].y}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

export function RouteMapArt({
  route,
  variant = "card",
  night = false,
  className,
}: {
  route: Route;
  variant?: "card" | "hero";
  night?: boolean;
  className?: string;
}) {
  const hero = variant === "hero";
  const W = 800;
  const H = hero ? 460 : 520;
  const pad = hero ? 64 : 44;
  const uid = route.slug; // stable, unique per route (no random — deterministic ids)

  const pts = layout(routePoints(route), W, H, pad);
  const path = smoothPath(pts);
  const accent = night ? PALETTE.routeNight : PALETTE.route;
  const paper = night ? PALETTE.nightPaper : PALETTE.paper;
  const paper2 = night ? PALETTE.night : PALETTE.paperDeep;
  const contour = night ? PALETTE.nightContour : PALETTE.contour;
  const ink = night ? PALETTE.nightInk : PALETTE.ink;

  const medallion = hero ? 15 : 11;
  const fontStop = hero ? 15 : 11;

  // Deterministic contour "hills" — nested loops around two centres.
  const hills = [
    { cx: W * 0.32, cy: H * 0.4, r: 1 },
    { cx: W * 0.68, cy: H * 0.62, r: 0.8 },
  ];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className ?? "h-full w-full"}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Mappa illustrata del percorso ${route.title}`}
    >
      <defs>
        <filter id={`grain-${uid}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.04 0" />
        </filter>
        <radialGradient id={`vig-${uid}`} cx="50%" cy="46%" r="72%">
          <stop offset="60%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity={night ? 0.32 : 0.1} />
        </radialGradient>
      </defs>

      {/* Paper */}
      <rect width={W} height={H} fill={paper} />

      {/* Contour hills */}
      <g fill="none" stroke={contour} strokeWidth={1.4} opacity={0.85}>
        {hills.map((hl, hi) =>
          [0, 1, 2, 3].map((ring) => {
            const rr = (28 + ring * 24) * hl.r;
            return (
              <ellipse
                key={`${hi}-${ring}`}
                cx={hl.cx}
                cy={hl.cy}
                rx={rr * 1.35}
                ry={rr}
                transform={`rotate(${hi ? -12 : 16} ${hl.cx} ${hl.cy})`}
              />
            );
          })
        )}
      </g>

      {/* River valley */}
      <g fill="none" strokeLinecap="round">
        <path
          d={`M${-10} ${H * 0.74} C ${W * 0.28} ${H * 0.62}, ${W * 0.4} ${H * 0.95}, ${W * 0.64} ${H * 0.8} S ${W * 0.92} ${H * 0.66}, ${W + 10} ${H * 0.72}`}
          stroke={night ? "#3a4a52" : PALETTE.water}
          strokeWidth={hero ? 16 : 12}
          opacity={0.7}
        />
        <path
          d={`M${-10} ${H * 0.74} C ${W * 0.28} ${H * 0.62}, ${W * 0.4} ${H * 0.95}, ${W * 0.64} ${H * 0.8} S ${W * 0.92} ${H * 0.66}, ${W + 10} ${H * 0.72}`}
          stroke={night ? "#4a5d64" : PALETTE.waterLine}
          strokeWidth={1}
          opacity={0.6}
        />
      </g>

      {/* Suggested roads */}
      <g fill="none" stroke={night ? "#3a4152" : PALETTE.road} strokeWidth={hero ? 6 : 4} strokeLinecap="round" opacity={0.9}>
        <path d={`M${W * 0.1} ${-10} C ${W * 0.3} ${H * 0.3}, ${W * 0.2} ${H * 0.6}, ${W * 0.42} ${H + 10}`} />
        <path d={`M${-10} ${H * 0.3} C ${W * 0.4} ${H * 0.2}, ${W * 0.6} ${H * 0.5}, ${W + 10} ${H * 0.4}`} />
      </g>

      {/* Frame inset (map border) */}
      <rect
        x={hero ? 14 : 8}
        y={hero ? 14 : 8}
        width={W - (hero ? 28 : 16)}
        height={H - (hero ? 28 : 16)}
        fill="none"
        stroke={ink}
        strokeOpacity={0.55}
        strokeWidth={1}
      />

      {/* Route line: casing + accent + dashes */}
      {path && (
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d={path} stroke={paper2} strokeWidth={hero ? 10 : 8} opacity={0.9} />
          <path d={path} stroke={accent} strokeWidth={hero ? 4.5 : 3.5} />
          <path d={path} stroke={paper} strokeWidth={hero ? 4.5 : 3.5} strokeDasharray={hero ? "1 12" : "1 9"} opacity={0.9} />
        </g>
      )}

      {/* Numbered stop medallions */}
      {pts.map((p, i) => {
        const isFirst = i === 0;
        const isLast = i === pts.length - 1;
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={medallion + 2} fill={paper} opacity={0.85} />
            <circle
              cx={p.x}
              cy={p.y}
              r={medallion}
              fill={isFirst || isLast ? accent : paper}
              stroke={ink}
              strokeWidth={1.5}
            />
            <text
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={fontStop}
              fontFamily="Georgia, 'Times New Roman', serif"
              fill={isFirst || isLast ? paper : ink}
              fontStyle="italic"
            >
              {i + 1}
            </text>
          </g>
        );
      })}

      {/* Hero-only cartographic chrome */}
      {hero && (
        <>
          {/* Compass rose */}
          <g transform={`translate(${W - 58} 56)`} opacity={0.8}>
            <circle r="20" fill={paper} stroke={ink} strokeOpacity={0.5} />
            <path d="M0 -16 L4 0 L0 16 L-4 0 Z" fill={accent} />
            <path d="M0 -16 L4 0 L0 0 Z" fill={ink} />
            <text x="0" y="-22" textAnchor="middle" fontSize="9" fontFamily="Georgia, serif" fill={ink}>
              N
            </text>
          </g>
          {/* Scale bar */}
          <g transform={`translate(44 ${H - 40})`} opacity={0.75}>
            <line x1="0" y1="0" x2="90" y2="0" stroke={ink} strokeWidth="2" />
            <line x1="0" y1="-4" x2="0" y2="4" stroke={ink} strokeWidth="2" />
            <line x1="45" y1="-3" x2="45" y2="3" stroke={ink} strokeWidth="1.5" />
            <line x1="90" y1="-4" x2="90" y2="4" stroke={ink} strokeWidth="2" />
            <text x="0" y="16" fontSize="9" fontFamily="Georgia, serif" fill={ink}>
              scala indicativa
            </text>
          </g>
          {/* Label */}
          <text x="44" y="42" fontSize="11" letterSpacing="2" fontFamily="Georgia, serif" fill={ink} opacity={0.7}>
            MACCA · PERCORSO · PECCIOLI
          </text>
        </>
      )}

      {/* Paper grain + vignette on top */}
      <rect width={W} height={H} filter={`url(#grain-${uid})`} />
      <rect width={W} height={H} fill={`url(#vig-${uid})`} />
    </svg>
  );
}
