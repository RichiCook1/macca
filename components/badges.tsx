"use client";

import { accessMeta, confidenceMeta, dataConfidenceMeta } from "@/lib/constants";
import type { AccessClass, MapConfidence, DataConfidence } from "@/lib/collection";
import { useLang } from "./language-provider";
import { clsx } from "@/lib/clsx";

function StateGlyph({ color, shape }: { color: string; shape: "dot" | "square" | "pill" }) {
  if (shape === "square") {
    return (
      <span
        className="inline-block h-2.5 w-2.5 rounded-[2px] border border-ink"
        style={{ background: color }}
      />
    );
  }
  if (shape === "pill") {
    return (
      <span
        className="inline-block h-2 w-3 rounded-[40%] border-2"
        style={{ borderColor: color }}
      />
    );
  }
  return <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: color }} />;
}

/**
 * Access-state badge. Label + colour/shape token — never colour alone (a11y).
 * Localised via the language switch; the exact seed `access_type` string is
 * preserved in the title attribute for transparency.
 */
export function AccessBadge({
  state,
  raw,
  size = "md",
  className,
}: {
  state: AccessClass;
  raw?: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const { lang } = useLang();
  const m = accessMeta[state];
  return (
    <span
      className={clsx(
        "inline-flex w-fit items-center gap-2 rounded-full border border-ink/70 bg-paper",
        size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-[13px]",
        className
      )}
      title={raw}
    >
      <StateGlyph color={m.dot} shape={m.shape} />
      {lang === "en" ? m.labelEn : m.label}
    </span>
  );
}

/** Map-confidence label — the honesty rule made visible (no false exact pins). */
export function ConfidenceLabel({
  confidence,
  className,
}: {
  confidence: MapConfidence;
  className?: string;
}) {
  const { lang } = useLang();
  const m = confidenceMeta[confidence];
  const dashed = confidence === "area" || confidence === "external" || confidence === "cluster";
  return (
    <span
      className={clsx(
        "inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-[13px]",
        dashed ? "border-dashed border-ink-60 text-ink-60" : "border-ink/70 text-ink-80",
        className
      )}
    >
      <span
        className={clsx(
          "inline-block h-2.5 w-2.5",
          confidence === "site" ? "rounded-[2px] border border-ink bg-paper" : "",
          confidence === "address" ? "rounded-full border-2 border-terracotta bg-paper" : "",
          dashed ? "rounded-[40%] border border-dashed border-ink-60" : ""
        )}
      />
      {lang === "en" ? m.labelEn : m.label}
    </span>
  );
}

/** Subtle data-confidence indicator (High / Medium / Low). */
export function DataConfidenceTag({
  level,
  className,
}: {
  level: DataConfidence;
  className?: string;
}) {
  const m = dataConfidenceMeta[level];
  return (
    <span
      className={clsx("inline-flex w-fit items-center gap-1.5 font-mono text-[10px] text-ink-60", className)}
    >
      <span className="inline-block h-2 w-2 rounded-full" style={{ background: m.tone }} />
      {m.label}
    </span>
  );
}

/** Provisional / future-dated record flag (e.g. Breath 2026). */
export function ProvisionalTag({ className }: { className?: string }) {
  return (
    <span
      className={clsx(
        "inline-flex w-fit items-center rounded-full border border-dashed border-sun px-2.5 py-1 text-[11px] text-sun-ink",
        className
      )}
    >
      Scheda provvisoria · in verifica
    </span>
  );
}

/** Night-oriented work accent (real access_type signal, not nightlife branding). */
export function NightTag({ className }: { className?: string }) {
  return (
    <span
      className={clsx(
        "inline-flex w-fit items-center rounded-full bg-night px-2.5 py-1 text-[11px] text-night-tint",
        className
      )}
    >
      Opera notturna
    </span>
  );
}

/**
 * Editorial fallback line — used wherever the seed has no verified content.
 * Never invents data; states the verification status with quiet dignity.
 */
export function FallbackNote({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={clsx("font-mono text-[11px] uppercase tracking-overline text-ink-40", className)}>
      {children}
    </span>
  );
}
