"use client";

import { useLang } from "./language-provider";
import { clsx } from "@/lib/clsx";

/** IT / EN switch — always visible, unambiguous (a11y / brief §3.7). */
export function LangSwitch({ className }: { className?: string }) {
  const { lang, setLang } = useLang();
  return (
    <div
      className={clsx(
        "inline-flex items-center rounded-full border border-ink text-[11px] font-medium",
        className
      )}
      role="group"
      aria-label="Lingua / Language"
    >
      <button
        type="button"
        onClick={() => setLang("it")}
        aria-pressed={lang === "it"}
        className={clsx(
          "rounded-full px-2.5 py-1 transition-colors focus-ring",
          lang === "it" ? "bg-ink text-paper" : "text-ink-80"
        )}
      >
        IT
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={clsx(
          "rounded-full px-2.5 py-1 transition-colors focus-ring",
          lang === "en" ? "bg-ink text-paper" : "text-ink-80"
        )}
      >
        EN
      </button>
    </div>
  );
}
