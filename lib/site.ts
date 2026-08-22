import ogImages from "@/src/data/macca.og.generated.json";

/**
 * Canonical origin for absolute URLs in social metadata. WhatsApp, iMessage and
 * friends will not resolve a relative og:image, so every share card needs this
 * to be right. Set NEXT_PUBLIC_SITE_URL once a custom domain exists; on Vercel
 * the deployment URL is used automatically for previews.
 */
export const SITE_URL = (() => {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return "https://macca-hazel.vercel.app";
})();

export const SITE_NAME = "MACCA";
export const SITE_TAGLINE = "Museo d'Arte Contemporanea a Cielo Aperto";

const og: Record<string, string> = ogImages as Record<string, string>;

/** The generated 1200x630 share card for a work, if one was built. */
export function ogImageForWork(workId?: string): string | undefined {
  return workId ? og[workId] : undefined;
}

/** Site-level fallback card — the flagship commission, else any card at all. */
export const DEFAULT_OG_IMAGE =
  og["macca-072"] ?? og["macca-045"] ?? Object.values(og)[0];

/** Trim a description to a length share cards actually display, cutting on a
 *  word boundary rather than mid-sentence. */
export function shareText(text: string, max = 200): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:—-]$/, "") + "…";
}

/** Build the openGraph/twitter block for a page, with an absolute image. */
export function socialImage(path?: string) {
  const image = path ?? DEFAULT_OG_IMAGE;
  if (!image) return undefined;
  return {
    url: image,
    width: 1200,
    height: 630,
  };
}
