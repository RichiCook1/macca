"use client";

import { useRef, useState } from "react";
import { clsx } from "@/lib/clsx";

type Snap = "collapsed" | "half" | "full";

/**
 * Draggable bottom sheet: collapsed → half → full. The map stays underneath,
 * always present (brief: "Il territorio è l'interfaccia").
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
  const startY = useRef<number | null>(null);

  const heights: Record<Snap, string> = {
    collapsed: "22%",
    half: "52%",
    full: "88%",
  };

  const order: Snap[] = ["collapsed", "half", "full"];

  const onPointerDown = (e: React.PointerEvent) => {
    startY.current = e.clientY;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (startY.current === null) return;
    const dy = e.clientY - startY.current;
    startY.current = null;
    const idx = order.indexOf(snap);
    if (dy < -30 && idx < order.length - 1) setSnap(order[idx + 1]);
    else if (dy > 30 && idx > 0) setSnap(order[idx - 1]);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const idx = order.indexOf(snap);
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSnap(order[(idx + 1) % order.length]);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (idx < order.length - 1) setSnap(order[idx + 1]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (idx > 0) setSnap(order[idx - 1]);
    }
  };

  const snapLabel: Record<Snap, string> = {
    collapsed: "ridotto",
    half: "a metà",
    full: "esteso",
  };

  return (
    <div
      className={clsx(
        "absolute inset-x-0 bottom-0 z-40 flex flex-col rounded-t-sheet border-t border-ink bg-paper shadow-sheet transition-[height] duration-300 ease-out",
        className
      )}
      style={{ height: heights[snap] }}
    >
      <div
        className="flex shrink-0 cursor-grab touch-none flex-col items-center pt-2.5 active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onKeyDown={onKeyDown}
        role="button"
        aria-expanded={snap !== "collapsed"}
        aria-label={`Pannello risultati: ${snapLabel[snap]} — Invio per cambiare, frecce su/giù per espandere o ridurre`}
        tabIndex={0}
      >
        <span className="h-1 w-10 rounded-full bg-ink/25" />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 pt-3">
        {children}
      </div>
    </div>
  );
}
