"use client";

import { useSaved } from "./use-saved";
import { useLang } from "./language-provider";
import { clsx } from "@/lib/clsx";

export function SaveButton({
  slug,
  kind = "work",
  variant = "pill",
  className,
}: {
  slug: string;
  kind?: "work" | "route";
  variant?: "pill" | "icon" | "full";
  className?: string;
}) {
  const { isWorkSaved, isRouteSaved, toggleWork, toggleRoute } = useSaved();
  const { t } = useLang();
  const saved = kind === "work" ? isWorkSaved(slug) : isRouteSaved(slug);
  const toggle = () => (kind === "work" ? toggleWork(slug) : toggleRoute(slug));

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={saved}
        aria-label={saved ? t("cta.saved") : t("cta.save")}
        className={clsx(
          "flex h-9 w-9 items-center justify-center rounded-full border border-ink bg-paper text-base transition-colors focus-ring",
          saved && "bg-terracotta text-paper",
          className
        )}
      >
        {saved ? "♥" : "♡"}
      </button>
    );
  }

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={saved}
        className={clsx(
          "inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-ink py-2.5 text-sm transition-colors focus-ring",
          saved ? "bg-ink text-paper" : "bg-paper hover:bg-ink/[0.04]",
          className
        )}
      >
        {saved ? "♥" : "♡"} {saved ? t("cta.saved") : t("cta.save")}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={saved}
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border border-ink/70 px-3 py-1.5 text-[13px] transition-colors focus-ring",
        saved && "border-ink bg-ink text-paper",
        className
      )}
    >
      {saved ? "♥" : "♡"} {saved ? t("cta.saved") : t("cta.save")}
    </button>
  );
}
