import type { WorkImage } from "@/lib/collection";
import { clsx } from "@/lib/clsx";

/**
 * Credited artwork image. Uses a plain <img> (works for both local /images and
 * remote URLs, and keeps static export simple). A credit line and "prototipo ·
 * diritti in verifica" note are shown unless the licence is explicitly open —
 * respecting the rights register.
 */
function isOpenLicense(license?: string) {
  if (!license) return false;
  return /cc|public domain|creative commons|cc0|by-sa|by-nc|open/i.test(license);
}

export function WorkPhoto({
  image,
  alt,
  className,
  showCredit = true,
  rounded,
}: {
  image: WorkImage;
  alt: string;
  className?: string;
  showCredit?: boolean;
  rounded?: boolean;
}) {
  return (
    <figure className={clsx("relative overflow-hidden", rounded && "rounded-lg", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        alt={image.caption ?? alt}
        loading="lazy"
        className="h-full w-full object-cover"
      />
      {showCredit && (image.credit || !isOpenLicense(image.license)) && (
        <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-ink/55 px-2.5 py-1 font-mono text-[9px] text-paper/90">
          <span className="truncate">{image.credit ?? "Fonte da verificare"}</span>
          {!isOpenLicense(image.license) && (
            <span className="shrink-0 rounded-full border border-paper/40 px-1.5 py-px text-[8px] uppercase tracking-overline">
              diritti in verifica
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
