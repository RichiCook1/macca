import { notFound } from "next/navigation";
import { works, workBySlug } from "@/lib/collection";
import { ArClient } from "./ar-client";

export function generateStaticParams() {
  return works.map((w) => ({ slug: w.slug }));
}

/**
 * Modalità AR — full-screen, on-site companion view.
 * No SiteHeader/Footer: like /qr, this is opened standing in front of the work.
 * The camera work happens client-side; this wrapper only resolves the record.
 */
export default async function ArPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = workBySlug(slug);
  if (!work) notFound();

  return (
    <ArClient
      slug={work.slug}
      title={work.title}
      artist={work.artist}
      year={work.year}
      hamletArea={work.hamletArea}
      category={work.category}
      accessState={work.accessState}
      accessRaw={work.accessRaw}
    />
  );
}
