import Link from "next/link";
import { notFound } from "next/navigation";
import { LangSwitch } from "@/components/lang-switch";
import {
  AccessBadge,
  ProvisionalTag,
  NightTag,
  FallbackNote,
} from "@/components/badges";
import {
  works,
  workBySlug,
  worksByArea,
  artistBySlug,
  locationForArea,
  FALLBACK,
} from "@/lib/collection";

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

export default async function QrQuickViewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = workBySlug(slug);
  if (!work) notFound();

  const artist = artistBySlug(work.artistSlug);
  const area = locationForArea(work.area);

  // Nearby count in the same area (excluding this work) — honest, no fake metres.
  const nearbyCount = worksByArea(work.area).filter((w) => w.slug !== work.slug).length;

  return (
    <div className="flex min-h-screen flex-col bg-stone">
      {/* Minimal top bar — no SiteHeader for speed on-site */}
      <header className="flex items-center justify-between border-b border-ink/80 bg-paper px-5 py-3">
        <span className="overline text-[12px] text-ink-60">
          MACCA · QR
        </span>
        <LangSwitch />
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 py-7">
        <div className="overline text-[12px]">
          {area?.name ?? work.hamletArea} · {work.category}
        </div>

        <h1 className="mt-3 font-serif text-4xl leading-[1.02] sm:text-5xl">
          {work.title}
        </h1>
        <p className="mt-3 text-lg text-ink-60">
          {artist?.name} · {work.year}
        </p>

        {/* Prominent access line */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <AccessBadge
            state={work.accessState}
            raw={work.accessRaw}
            className="px-4 py-2.5 text-[15px]"
          />
          {work.nightView && <NightTag />}
          {work.provisional && <ProvisionalTag />}
        </div>

        {/* No archival description yet — show the fallback, never invent text. */}
        <div className="mt-6">
          <FallbackNote>{FALLBACK.story}</FallbackNote>
        </div>

        <div className="flex-1" />

        {/* Big tap targets */}
        <div className="mt-8 flex flex-col gap-3">
          {/* No audio media exists in the seed — disabled, honest placeholder. */}
          <div
            aria-disabled
            className="flex h-14 items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-ink-40 text-[15px] text-ink-60"
          >
            <span className="text-base" aria-hidden>
              ▶
            </span>
            Audioguida in preparazione
          </div>
          <div className="flex gap-3">
            <Link
              href={`/opere/${work.slug}`}
              className="flex h-14 flex-1 items-center justify-center rounded-2xl border-2 border-ink bg-paper text-lg transition-colors hover:bg-ink/[0.04] focus-ring"
            >
              Leggi
            </Link>
            <Link
              href={`/esplora?opera=${work.slug}`}
              className="flex h-14 flex-1 items-center justify-center rounded-2xl border-2 border-ink bg-paper text-lg transition-colors hover:bg-ink/[0.04] focus-ring"
            >
              Mappa
            </Link>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/ar/${work.slug}`}
              className="flex h-14 flex-1 items-center justify-center rounded-2xl border-2 border-ink bg-paper text-lg transition-colors hover:bg-ink/[0.04] focus-ring"
            >
              Inquadra (AR)
            </Link>
          </div>
        </div>

        <div className="overline mt-6 text-[11px]">
          {nearbyCount > 0
            ? `Nelle vicinanze · ${nearbyCount} ${nearbyCount === 1 ? "opera" : "opere"} a ${area?.name ?? work.hamletArea}`
            : `Nelle vicinanze · ${area?.name ?? work.hamletArea}`}
        </div>
      </main>
    </div>
  );
}
