"use client";

import { useState } from "react";
import { clsx } from "@/lib/clsx";

/**
 * Share control. Uses the Web Share API where available, falls back to copying
 * the current URL. Isolated client component so the page stays a Server Component.
 */
export function ShareButton({
  title,
  variant = "full",
  className,
}: {
  title: string;
  variant?: "full" | "icon";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const onShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title: `${title} · MACCA`, url });
        return;
      } catch {
        // user dismissed — fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* no-op */
    }
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={onShare}
        aria-label="Condividi"
        className={clsx(
          "flex h-9 w-9 items-center justify-center rounded-full border border-ink bg-paper text-sm transition-colors hover:bg-ink/[0.04] focus-ring",
          className
        )}
      >
        {copied ? "✓" : "↗"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onShare}
      className={clsx(
        "inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-ink py-2.5 text-sm transition-colors hover:bg-ink/[0.04] focus-ring",
        className
      )}
    >
      {copied ? "✓ Link copiato" : "↗ Condividi"}
    </button>
  );
}
