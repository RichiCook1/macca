"use client";

import { clsx } from "@/lib/clsx";
import type { MapConfidence } from "@/lib/collection";

export type MarkerKind = MapConfidence | "route-stop";

interface MarkerProps {
  kind: MarkerKind;
  selected?: boolean;
  /** Cluster count or route-stop number. */
  n?: number;
  onClick?: () => void;
  label?: string;
  className?: string;
}

/**
 * The MACCA map marker family. Designed once, reused everywhere.
 * Honesty rule: the seed contains NO verified exact pins, so the family expresses
 * approximation and site-anchoring rather than false precision:
 *   site     → site / entrance anchor (square)
 *   address  → approximate, address-level geocode (hollow ring)
 *   cluster  → multiple works at one site (dashed circle + count)
 *   area     → area-level only, position being verified (soft dashed blob)
 *   external → external-source coordinate, pending confirmation (dashed blob)
 */
export function Marker({ kind, selected, n, onClick, label, className }: MarkerProps) {
  const interactive = !!onClick;
  const Tag = interactive ? "button" : "span";
  const halo = selected ? "shadow-[0_0_0_6px_rgba(192,87,58,0.18)] marker-pulse" : "";

  let inner: React.ReactNode = null;

  if (kind === "exact") {
    // Verified coordinate — the only state that renders a precise filled pin.
    inner = selected ? (
      <span className={clsx("relative flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-ink bg-terracotta", halo)}>
        <span className="h-2 w-2 rounded-full bg-paper" />
      </span>
    ) : (
      <span className="block h-[18px] w-[18px] rounded-full border-2 border-ink bg-terracotta" />
    );
  } else if (kind === "site") {
    inner = (
      <span
        className={clsx(
          "block rounded-[3px] border-2 border-ink bg-paper",
          selected ? "h-[22px] w-[22px]" : "h-[18px] w-[18px]",
          halo
        )}
      />
    );
  } else if (kind === "address") {
    // Approximate point — hollow ring signals "not field-verified".
    inner = (
      <span
        className={clsx(
          "block rounded-full border-2 border-terracotta bg-paper",
          selected ? "h-[18px] w-[18px]" : "h-[14px] w-[14px]",
          halo
        )}
      />
    );
  } else if (kind === "cluster") {
    inner = (
      <span
        className={clsx(
          "flex items-center justify-center rounded-full border-2 border-dashed border-ink bg-paper text-xs font-bold",
          selected ? "h-[32px] w-[32px]" : "h-[28px] w-[28px]",
          halo
        )}
      >
        {n ?? "•"}
      </span>
    );
  } else if (kind === "area" || kind === "external") {
    inner = (
      <span
        className={clsx(
          "block rounded-[40%] border-2 border-dashed",
          kind === "external" ? "border-sun bg-sun/10" : "border-ink-60 bg-terracotta/[0.06]",
          selected ? "h-[22px] w-[34px]" : "h-[18px] w-[30px]",
          halo
        )}
      />
    );
  } else if (kind === "route-stop") {
    inner = (
      <span
        className={clsx(
          "flex items-center justify-center rounded-full text-xs font-bold",
          selected
            ? "h-[26px] w-[26px] border-2 border-paper bg-terracotta text-paper shadow-[0_0_0_2px_#34322d]"
            : "h-[24px] w-[24px] border-2 border-paper bg-ink text-paper shadow-[0_0_0_2px_#34322d]"
        )}
      >
        {n}
      </span>
    );
  }

  return (
    <Tag
      onClick={onClick}
      aria-label={label}
      className={clsx(
        "block",
        interactive && "cursor-pointer focus-ring rounded-full p-2 -m-2 touch-manipulation",
        className
      )}
    >
      {inner}
    </Tag>
  );
}
