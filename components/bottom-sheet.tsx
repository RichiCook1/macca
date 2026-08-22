"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { clsx } from "@/lib/clsx";

type Snap = "collapsed" | "half" | "full";

const ORDER: Snap[] = ["collapsed", "half", "full"];

/** Snap positions as a translateY percentage of the sheet's own height.
 *  The sheet is always rendered at its full height and pushed down, so the
 *  gesture animates `transform` (compositor-only) instead of `height`. */
const OFFSET: Record<Snap, number> = { full: 0, half: 41, collapsed: 75 };

const SNAP_LABEL: Record<Snap, string> = {
  collapsed: "ridotto",
  half: "a metà",
  full: "esteso",
};

/**
 * Draggable bottom sheet: collapsed → half → full. The map stays underneath,
 * always present (brief: "Il territorio è l'interfaccia").
 *
 * The sheet tracks the finger 1:1 while dragging, then settles on the nearest
 * snap — or throws past it when the gesture is a flick (velocity-based), so a
 * fast swipe can go collapsed → full in one motion. Dragging works from the
 * whole header, and from the list itself while it is scrolled to the top.
 */
export function BottomSheet({
  children,
  initial = "half",
  className,
}: {
  children: React.ReactNode;
  initial?: Snap;
  className?: string;
}) {
  const [snap, setSnap] = useState<Snap>(initial);
  const [dragging, setDragging] = useState(false);

  const sheetRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Live gesture state (refs — no re-render per frame).
  const drag = useRef<{
    id: number;
    startY: number;
    lastY: number;
    lastT: number;
    velocity: number; // px/ms, + = downward
    basePx: number;
    fromScroll: boolean;
  } | null>(null);
  const dyRef = useRef(0);

  const heightPx = () => sheetRef.current?.offsetHeight || 1;
  const pxFor = (s: Snap) => (OFFSET[s] / 100) * heightPx();

  const settle = useCallback((endPx: number, velocity: number) => {
    const h = heightPx();
    // A decisive flick throws to the next snap in that direction.
    if (Math.abs(velocity) > 0.5) {
      const idx = ORDER.indexOf(
        ORDER.reduce((best, s) =>
          Math.abs(pxFor(s) - endPx) < Math.abs(pxFor(best) - endPx) ? s : best
        )
      );
      const dir = velocity > 0 ? -1 : 1; // down = smaller snap
      const next = ORDER[Math.min(ORDER.length - 1, Math.max(0, idx + dir))];
      setSnap(next);
      return;
    }
    // Otherwise settle on whichever snap is nearest where the finger let go.
    let best: Snap = "half";
    let bestD = Infinity;
    for (const s of ORDER) {
      const d = Math.abs((OFFSET[s] / 100) * h - endPx);
      if (d < bestD) {
        bestD = d;
        best = s;
      }
    }
    setSnap(best);
  }, []);

  const onPointerDown = (e: React.PointerEvent, fromScroll = false) => {
    if (drag.current) return;
    // From the list, only start a drag when it is already at the top and the
    // user pulls down — otherwise the list must scroll normally.
    if (fromScroll && (scrollRef.current?.scrollTop ?? 0) > 0) return;
    drag.current = {
      id: e.pointerId,
      startY: e.clientY,
      lastY: e.clientY,
      lastT: e.timeStamp,
      velocity: 0,
      basePx: pxFor(snap),
      fromScroll,
    };
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const delta = e.clientY - d.startY;

    // A pull that begins in the list only takes over when it heads downward.
    if (d.fromScroll && delta < 0) return;

    const dt = e.timeStamp - d.lastT;
    if (dt > 0) d.velocity = (e.clientY - d.lastY) / dt;
    d.lastY = e.clientY;
    d.lastT = e.timeStamp;

    if (!(e.currentTarget as HTMLElement).hasPointerCapture?.(e.pointerId)) {
      (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    }

    // Clamp to the travel range, with a little rubber-band past the ends.
    const min = pxFor("full");
    const max = pxFor("collapsed");
    let next = d.basePx + delta;
    if (next < min) next = min + (next - min) * 0.35;
    if (next > max) next = max + (next - max) * 0.35;
    dyRef.current = next - d.basePx;
    // Paint straight to the node: a setState here would re-render React on
    // every frame of the drag, which is what makes a sheet feel sticky.
    if (sheetRef.current) {
      sheetRef.current.style.transform = `translateY(calc(${OFFSET[snap]}% + ${dyRef.current}px))`;
    }
  };

  const endDrag = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const endPx = d.basePx + dyRef.current;
    drag.current = null;
    dyRef.current = 0;
    // Hand the transform back to React/CSS for the settle animation.
    if (sheetRef.current) sheetRef.current.style.transform = "";
    setDragging(false);
    settle(endPx, d.velocity);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const idx = ORDER.indexOf(snap);
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSnap(ORDER[(idx + 1) % ORDER.length]);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (idx < ORDER.length - 1) setSnap(ORDER[idx + 1]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (idx > 0) setSnap(ORDER[idx - 1]);
    }
  };

  // Collapsing should also return the list to the top.
  useEffect(() => {
    if (snap === "collapsed" && scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [snap]);

  const transform = `translateY(${OFFSET[snap]}%)`;

  return (
    <div
      ref={sheetRef}
      className={clsx(
        "absolute inset-x-0 bottom-0 z-40 flex h-[88%] flex-col rounded-t-sheet border-t border-ink bg-paper shadow-sheet will-change-transform",
        // Only animate on release — while dragging the sheet is under the finger.
        !dragging && "transition-transform duration-[380ms] ease-[cubic-bezier(0.22,0.61,0.21,1)] motion-reduce:transition-none",
        className
      )}
      style={{ transform }}
    >
      {/* Grab area — the whole header band, not just the bar */}
      <div
        className="flex shrink-0 cursor-grab touch-none flex-col items-center px-5 pb-1 pt-2.5 active:cursor-grabbing"
        onPointerDown={(e) => onPointerDown(e)}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        role="button"
        aria-expanded={snap !== "collapsed"}
        aria-label={`Pannello risultati: ${SNAP_LABEL[snap]} — Invio per cambiare, frecce su/giù per espandere o ridurre`}
        tabIndex={0}
      >
        <span
          className={clsx(
            "h-1 w-10 rounded-full transition-colors",
            dragging ? "bg-ink/50" : "bg-ink/25"
          )}
        />
      </div>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 pt-2"
        onPointerDown={(e) => onPointerDown(e, true)}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {children}
      </div>
    </div>
  );
}
