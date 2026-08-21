"use client";

import { useEffect, useRef } from "react";
import { clsx } from "@/lib/clsx";

/**
 * Scroll reveal — content eases up as it enters the viewport.
 * Honest defaults: without JS the content is simply visible (the hidden state
 * is only armed after hydration), and prefers-reduced-motion shows everything
 * immediately. Reveals once, then disconnects.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  /** Stagger offset in ms (e.g. index * 60). */
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    let io: IntersectionObserver | null = null;

    // Only arm the hidden state while the document can actually render —
    // in a background tab IO callbacks don't fire, and content must never
    // be left invisible.
    const arm = () => {
      el.classList.add("reveal-armed");
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              el.classList.add("is-in");
              io?.disconnect();
            }
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      io.observe(el);
    };

    const onVis = () => {
      if (document.visibilityState === "visible") {
        document.removeEventListener("visibilitychange", onVis);
        arm();
      }
    };

    if (document.visibilityState === "visible") arm();
    else document.addEventListener("visibilitychange", onVis);

    return () => {
      document.removeEventListener("visibilitychange", onVis);
      io?.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={clsx("reveal", className)}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
