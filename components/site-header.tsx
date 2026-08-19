"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { useLang } from "./language-provider";
import { useSaved } from "./use-saved";
import { LangSwitch } from "./lang-switch";
import { clsx } from "@/lib/clsx";

const nav = [
  { href: "/esplora", key: "nav.explore" as const },
  { href: "/collezione", key: "nav.collection" as const },
  { href: "/percorsi", key: "nav.routes" as const },
  { href: "/itinerario", key: "nav.itinerary" as const },
  { href: "/timeline", key: "nav.timeline" as const },
  { href: "/visita", key: "nav.visit" as const },
  { href: "/info", key: "nav.about" as const },
];

export function SiteHeader({
  transparent = false,
  overlay = false,
}: {
  transparent?: boolean;
  /** Sit over a dark photographic hero: light type, no bar, no bottom rule. */
  overlay?: boolean;
}) {
  const { t } = useLang();
  const pathname = usePathname();
  const { count } = useSaved();
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          setOpen(false);
          burgerRef.current?.focus();
        }
      }}
      className={clsx(
        "z-50 transition-colors",
        overlay
          ? "absolute inset-x-0 top-0 text-paper"
          : clsx(
              "sticky top-0 border-b border-ink/10 backdrop-blur",
              transparent ? "bg-paper/85" : "bg-paper"
            )
      )}
    >
      <div className="mx-auto flex h-[60px] max-w-[1400px] items-center justify-between gap-4 px-5 md:px-8">
        <Link
          href="/"
          className={clsx(
            "group flex items-baseline gap-1.5 font-serif text-2xl font-semibold tracking-wide focus-ring",
            overlay && "text-paper"
          )}
        >
          MACCA
          <span
            aria-hidden
            className="h-2 w-2 translate-y-[-1px] rounded-full border border-ink bg-terracotta transition-transform group-hover:scale-125"
          />
        </Link>

        {/* Map-label nav: mono small-caps, echoing the territory linework */}
        <nav className={clsx(
            "hidden items-center gap-6 font-mono text-[11px] uppercase tracking-overline lg:flex",
            overlay ? "text-paper/75" : "text-ink-80"
          )}>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "link-underline pb-0.5 transition-colors focus-ring",
                overlay ? "hover:text-paper" : "hover:text-ink",
                isActive(item.href) && (overlay ? "text-paper" : "text-terracotta")
              )}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 text-xs lg:flex">
          <Link href="/cerca" className={clsx("focus-ring", overlay ? "text-paper/75 hover:text-paper" : "text-ink-80 hover:text-ink")}>
            {t("util.search")}
          </Link>
          <LangSwitch />
          <Link href="/salvati" className={clsx("focus-ring", overlay ? "text-paper/75 hover:text-paper" : "text-ink-80 hover:text-ink")}>
            {t("util.saved")}
            {count > 0 && (
              <span className="ml-1 rounded-full bg-ink px-1.5 text-[10px] text-paper">{count}</span>
            )}
          </Link>
          <Link
            href="/esplora"
            className="inline-flex items-center gap-1.5 rounded-full bg-terracotta px-3.5 py-1.5 text-paper shadow-card transition-all duration-200 hover:bg-terracotta-dark hover:shadow-raised hover:-translate-y-px focus-ring"
          >
            <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-paper" />
            {t("cta.openMap")}
          </Link>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-3 lg:hidden">
          <LangSwitch />
          <button
            ref={burgerRef}
            type="button"
            aria-label={t("util.menu")}
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((v) => !v)}
            className={clsx(
              "flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-lg border focus-ring",
              overlay ? "border-paper/40" : "border-ink"
            )}
          >
            <span className={clsx("h-[1.5px] w-4", overlay ? "bg-paper" : "bg-ink")} />
            <span className={clsx("h-[1.5px] w-4", overlay ? "bg-paper" : "bg-ink")} />
            <span className={clsx("h-[1.5px] w-4", overlay ? "bg-paper" : "bg-ink")} />
          </button>
        </div>
      </div>

      {open && (
        <nav id="menu-mobile" className="border-t border-ink/80 bg-paper px-5 py-3 lg:hidden">
          <ul className="flex flex-col">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={clsx(
                    "block py-2.5 text-[15px] focus-ring",
                    isActive(item.href) ? "text-terracotta" : "text-ink"
                  )}
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
            <li className="mt-2 flex gap-3 border-t border-hairline pt-3 text-sm text-ink-80">
              <Link href="/cerca" onClick={() => setOpen(false)}>
                {t("util.search")}
              </Link>
              <Link href="/salvati" onClick={() => setOpen(false)}>
                {t("util.saved")}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
