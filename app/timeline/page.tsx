import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Overline, Chip } from "@/components/ui";
import { ProvisionalTag } from "@/components/badges";
import { timeline } from "@/lib/timeline";
import type { TimelineEntry } from "@/lib/timeline";
import { decades, decadeLabel } from "@/lib/constants";
import { clsx } from "@/lib/clsx";

// Density grows across the decades — the collection expands. The last column
// (2021–oggi) is the densest and is highlighted in terracotta.
const lastDecade = decades[decades.length - 1];

function entriesFor(decade: string) {
  return timeline.filter((e) => e.decade === decade);
}

function EntryCard({
  entry,
  highlighted,
}: {
  entry: TimelineEntry;
  highlighted?: boolean;
}) {
  const inner = (
    <div
      className={clsx(
        "rounded-lg border bg-paper px-3 py-2.5 transition-shadow",
        entry.provisional
          ? "border-dashed border-sun bg-sun-tint"
          : highlighted
            ? "border-terracotta bg-terracotta-tint shadow-card hover:shadow-raised"
            : entry.flagship
              ? "border-ink shadow-card ring-1 ring-terracotta/30 hover:shadow-raised"
              : "border-ink/80 shadow-card hover:shadow-raised",
        entry.workSlug && "focus-ring"
      )}
    >
      <div className="flex items-start gap-1.5">
        {entry.flagship && (
          <span
            aria-hidden
            className="mt-[3px] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta"
          />
        )}
        <div className="font-serif text-[15px] leading-snug">{entry.title}</div>
      </div>
      {entry.meta && (
        <div className="mt-0.5 font-mono text-[10px] text-ink-60">{entry.meta}</div>
      )}
      {entry.provisional && (
        <div className="mt-2">
          <ProvisionalTag />
        </div>
      )}
    </div>
  );

  if (entry.workSlug) {
    return (
      <Link href={`/opere/${entry.workSlug}`} className="block focus-ring rounded-lg">
        {inner}
      </Link>
    );
  }
  return inner;
}

/** Decade node-count dot row — visual cue of growing density. */
function DensityCue({ count, highlighted }: { count: number; highlighted?: boolean }) {
  return (
    <div className="flex items-center gap-1" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={clsx(
            "h-1.5 w-1.5 rounded-full border",
            highlighted ? "border-terracotta bg-terracotta" : "border-ink bg-ink"
          )}
        />
      ))}
    </div>
  );
}

export default function TimelinePage() {
  return (
    <>
      <SiteHeader />
      <main>
        {/* Header */}
        <section className="border-b border-ink/80">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-5 py-10 md:flex-row md:items-end md:justify-between md:px-8 md:py-12">
            <div>
              <Overline className="mb-3">Timeline · 1991–oggi</Overline>
              <h1 className="font-serif text-4xl leading-[1.04] md:text-5xl">
                Trent&apos;anni di commissioni
              </h1>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-60">
                Un paesaggio culturale che si espande. La densità cresce con il tempo.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 font-mono">
              <Chip>Luogo ▾</Chip>
              <Chip>Tipo ▾</Chip>
              <Chip>Artista ▾</Chip>
            </div>
          </div>
        </section>

        {/* ─── DESKTOP: decades as columns connected by a horizontal axis ─── */}
        <section className="hidden md:block">
          <div className="mx-auto max-w-[1400px] px-8 py-12">
            <div className="relative grid grid-cols-[1fr_1fr_1.3fr_1.6fr]">
              {/* horizontal axis line connecting the decades */}
              <div className="pointer-events-none absolute left-0 right-0 top-[46px] flex items-center">
                <span className="h-[2.5px] flex-1 bg-ink" />
                <span className="h-[2.5px] flex-1 bg-gradient-to-r from-ink to-terracotta" />
                <span className="h-2.5 w-2.5 -ml-1 rounded-full border-2 border-ink bg-terracotta" />
              </div>

              {decades.map((decade, di) => {
                const entries = entriesFor(decade);
                const highlighted = decade === lastDecade;
                return (
                  <div
                    key={decade}
                    className={clsx(
                      "relative pb-2",
                      di === 0 ? "pr-4" : "px-4",
                      di > 0 && "border-l border-dashed border-line"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <h2
                        className={clsx(
                          "font-serif text-xl",
                          highlighted ? "text-terracotta" : "text-ink"
                        )}
                      >
                        {decadeLabel[decade]}
                      </h2>
                    </div>
                    {/* axis node */}
                    <div className="mt-3 mb-1 flex items-center gap-2">
                      <span
                        className={clsx(
                          "h-3 w-3 rounded-full border-2",
                          highlighted
                            ? "border-ink bg-terracotta"
                            : "border-ink bg-paper"
                        )}
                      />
                      <DensityCue count={entries.length} highlighted={highlighted} />
                    </div>
                    <div className="mt-4 flex flex-col gap-3">
                      {entries.map((entry) => (
                        <EntryCard
                          key={entry.workSlug}
                          entry={entry}
                          highlighted={highlighted && !entry.provisional}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── MOBILE: vertical progressive timeline ─── */}
        <section className="md:hidden">
          <div className="mx-auto max-w-[1400px] px-5 py-8">
            <div className="relative border-l-2 border-ink pl-6">
              {decades.map((decade) => {
                const entries = entriesFor(decade);
                const highlighted = decade === lastDecade;
                return (
                  <div key={decade} className="relative mb-10 last:mb-0">
                    <span
                      className={clsx(
                        "absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-ink",
                        highlighted ? "bg-terracotta" : "bg-stone"
                      )}
                    />
                    <h2
                      className={clsx(
                        "font-serif text-xl",
                        highlighted ? "text-terracotta" : "text-ink"
                      )}
                    >
                      {decadeLabel[decade]}
                    </h2>
                    <div className="mt-1">
                      <DensityCue count={entries.length} highlighted={highlighted} />
                    </div>
                    <div className="mt-4 flex flex-col gap-3">
                      {entries.map((entry) => (
                        <EntryCard
                          key={entry.workSlug}
                          entry={entry}
                          highlighted={highlighted && !entry.provisional}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Closing note */}
        <section className="border-t border-ink/15">
          <div className="mx-auto max-w-[1400px] px-5 py-8 md:px-8">
            <p className="max-w-2xl font-serif text-lg leading-snug text-ink-80">
              Non una cronologia accademica, ma un paesaggio che si infittisce:
              ogni decennio aggiunge voci, luoghi e densità alla collezione.
            </p>
            <Link
              href="/collezione"
              className="mt-4 inline-block text-[13px] text-terracotta hover:underline focus-ring"
            >
              Esplora tutta la collezione →
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
