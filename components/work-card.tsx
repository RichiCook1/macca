import Link from "next/link";
import type { Work } from "@/lib/types";
import { FALLBACK } from "@/lib/collection";
import { NightTag, ProvisionalTag } from "./badges";
import { WorkPhoto } from "./work-image";
import { clsx } from "@/lib/clsx";

function confidenceDot(work: Work) {
  const c = work.mapConfidence;
  if (c === "exact")
    return <span className="h-2.5 w-2.5 rounded-full border border-ink bg-terracotta" />;
  if (c === "site")
    return <span className="h-2.5 w-2.5 rounded-[2px] border border-ink bg-paper" />;
  if (c === "address")
    return <span className="h-2.5 w-2.5 rounded-full border-2 border-terracotta bg-paper" />;
  return <span className="h-2 w-3 rounded-[40%] border border-dashed border-ink-60" />;
}

/** Card image — a real credited photo when provided, otherwise an honest
 *  "image archive in preparation" placeholder. Night works get the night tone. */
function CardImage({ work, h }: { work: Work; h: string }) {
  if (work.heroImage) {
    return (
      <div className={clsx("relative", h)}>
        <WorkPhoto image={work.heroImage} alt={work.title} className="zoom-media h-full w-full" showCredit={false} />
        {work.isFlagship && (
          <span className="absolute left-2 top-2 rounded-full border border-ink bg-paper/90 px-2 py-0.5 font-mono text-[8px] uppercase tracking-overline">
            In evidenza
          </span>
        )}
        {work.nightView && <NightTag className="absolute right-2 top-2" />}
      </div>
    );
  }
  if (work.nightView) {
    return (
      <div className={clsx("relative bg-night", h)}>
        <NightTag className="absolute right-2 top-2" />
        <span className="absolute bottom-2 left-2.5 font-mono text-[9px] text-night-tint/70">
          {FALLBACK.image}
        </span>
      </div>
    );
  }
  return (
    <div className={clsx("relative hatch", h)}>
      {work.isFlagship && (
        <span className="absolute left-2 top-2 rounded-full border border-ink bg-paper/90 px-2 py-0.5 font-mono text-[8px] uppercase tracking-overline">
          In evidenza
        </span>
      )}
      <span className="absolute bottom-2 left-2.5 font-mono text-[9px] text-ink-60">
        {FALLBACK.image}
      </span>
    </div>
  );
}

/** Collection / grid work card. */
export function WorkCard({ work, className }: { work: Work; className?: string }) {
  return (
    <Link
      href={`/opere/${work.slug}`}
      className={clsx(
        "group block overflow-hidden rounded-xl border bg-paper shadow-card transition-shadow hover:shadow-raised focus-ring",
        work.isFlagship ? "border-terracotta/50" : "border-ink/15",
        className
      )}
    >
      <CardImage work={work} h="h-44" />
      <div className="p-3.5">
        <div className="font-serif text-[17px] leading-snug"><span className="link-underline">{work.title}</span></div>
        <div className="mt-0.5 text-[13px] text-ink-60">
          {work.artist} · {work.year}
        </div>
        <div className="mt-2.5 flex items-center justify-between">
          <span className="font-mono text-[11px] text-ink-60">{work.hamletArea}</span>
          {work.provisional ? <ProvisionalTag /> : confidenceDot(work)}
        </div>
      </div>
    </Link>
  );
}

/** Map result / list row card (Explore + nearby panels).
 *  Renders as a Link by default; pass `onSelect` to render a button instead
 *  (selection behaviour, e.g. in the Explore result list). */
export function MapResultCard({
  work,
  active,
  onSelect,
}: {
  work: Work;
  active?: boolean;
  onSelect?: () => void;
}) {
  const rootClass = clsx(
    "flex w-full overflow-hidden rounded-xl border bg-paper text-left transition-colors focus-ring",
    active ? "border-terracotta bg-terracotta-tint" : "border-ink/20 hover:border-ink"
  );
  const body = (
    <>
      {work.heroImage ? (
        <div className="w-24 shrink-0 border-r border-ink/20">
          <WorkPhoto image={work.heroImage} alt={work.title} className="zoom-media h-full w-full" showCredit={false} />
        </div>
      ) : (
        <div
          className={clsx(
            "flex w-24 shrink-0 items-center justify-center border-r border-ink/20 text-center font-mono text-[8px] text-ink-60",
            work.nightView ? "bg-night text-night-tint/70" : "hatch"
          )}
        >
          {work.isFlagship ? "in evidenza" : "archivio"}
        </div>
      )}
      <div className="flex-1 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="font-serif text-[15px] leading-tight">{work.title}</div>
          {confidenceDot(work)}
        </div>
        <div className="text-[12px] text-ink-60">
          {work.artist} · {work.year} · {work.hamletArea}
        </div>
      </div>
    </>
  );
  if (onSelect) {
    return (
      <button type="button" onClick={onSelect} className={rootClass}>
        {body}
      </button>
    );
  }
  return (
    <Link href={`/opere/${work.slug}`} className={rootClass}>
      {body}
    </Link>
  );
}
