"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useLang } from "./language-provider";
import { useSaved } from "./use-saved";
import { clsx } from "@/lib/clsx";

// Field-mode screens ship their own bottom bar / chrome — no tab bar there.
const HIDDEN = [/^\/ar\//, /^\/qr\//, /\/avvia$/];

const ICONS = {
  map: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="10" r="3" />
      <path d="M12 21c4.5-4.7 7-8 7-11a7 7 0 1 0-14 0c0 3 2.5 6.3 7 11Z" />
    </svg>
  ),
  works: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="4" y="4" width="7" height="7" rx="1" />
      <rect x="13" y="4" width="7" height="7" rx="1" />
      <rect x="4" y="13" width="7" height="7" rx="1" />
      <rect x="13" y="13" width="7" height="7" rx="1" />
    </svg>
  ),
  routes: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M4 19c4-1 3-6 7-7s4-4 8-5" strokeDasharray="2.5 3" strokeLinecap="round" />
      <circle cx="4" cy="19" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="19" cy="7" r="1.8" fill="currentColor" stroke="none" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-4-4" strokeLinecap="round" />
    </svg>
  ),
  saved: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M12 20s-7-4.3-9-8.5C1.6 8.3 3.6 5 7 5c2 0 3.5 1 5 3 1.5-2 3-3 5-3 3.4 0 5.4 3.3 4 6.5-2 4.2-9 8.5-9 8.5Z" strokeLinejoin="round" />
    </svg>
  ),
};

/**
 * Mobile app tab bar — in-app navigation between the five core surfaces.
 * Fixed to the bottom with safe-area support; hidden on desktop and on
 * field-mode routes. Sets --bnav on <html> so page layouts (body padding,
 * the full-height Explore map) reserve exactly the right space.
 */
export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLang();
  const { count } = useSaved();

  const hidden = HIDDEN.some((re) => re.test(pathname));

  useEffect(() => {
    document.documentElement.dataset.bnav = hidden ? "off" : "on";
    return () => {
      document.documentElement.dataset.bnav = "off";
    };
  }, [hidden]);

  if (hidden) return null;

  const tabs = [
    { href: "/esplora", label: t("nav.explore"), icon: ICONS.map },
    { href: "/opere", label: t("nav.works"), icon: ICONS.works },
    { href: "/percorsi", label: t("nav.routes"), icon: ICONS.routes },
    { href: "/cerca", label: t("util.search"), icon: ICONS.search },
    { href: "/salvati", label: t("util.saved"), icon: ICONS.saved, badge: count },
  ];

  return (
    <nav
      aria-label="Navigazione principale"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-ink/80 bg-paper/95 backdrop-blur lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex h-[60px] max-w-md items-stretch justify-around">
        {tabs.map((tab) => {
          const active = pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "relative flex h-full min-w-[44px] flex-col items-center justify-center gap-0.5 focus-ring",
                  active ? "text-terracotta" : "text-ink-60"
                )}
              >
                <span className="relative">
                  {tab.icon}
                  {tab.badge ? (
                    <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta px-1 text-[9px] font-bold text-paper">
                      {tab.badge}
                    </span>
                  ) : null}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.08em]">{tab.label}</span>
                {active && (
                  <span aria-hidden className="absolute top-0 h-0.5 w-8 rounded-full bg-terracotta" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
