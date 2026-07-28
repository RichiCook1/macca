"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AccessBadge } from "@/components/badges";
import type { AccessClass, Category } from "@/lib/collection";

type CameraPhase = "idle" | "requesting" | "granted" | "denied";

/**
 * Modalità AR — camera pass-through with the work's card in overlay.
 * Honesty rule: there is NO real image recognition or tracking here; the
 * contents are shown manually and the UI says so. The camera stream stays
 * on-device (never recorded, never uploaded).
 */
export function ArClient({
  slug,
  title,
  artist,
  year,
  hamletArea,
  category,
  accessState,
  accessRaw,
}: {
  slug: string;
  title: string;
  artist: string;
  year: number;
  hamletArea: string;
  category: Category;
  accessState: AccessClass;
  accessRaw: string;
}) {
  const [phase, setPhase] = useState<CameraPhase>("idle");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef(true);

  const startCamera = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setPhase("denied");
      return;
    }
    setPhase("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      if (!mountedRef.current) {
        // Permission resolved after the page was left — release immediately.
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      streamRef.current = stream;
      setPhase("granted");
    } catch {
      if (mountedRef.current) setPhase("denied");
    }
  }, []);

  // Attach the stream once the <video> is in the tree.
  useEffect(() => {
    if (phase !== "granted") return;
    const video = videoRef.current;
    const stream = streamRef.current;
    if (video && stream) {
      video.srcObject = stream;
      void video.play().catch(() => {});
    }
  }, [phase]);

  // Stop all tracks on unmount.
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, []);

  const live = phase === "granted" || phase === "denied";

  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-ink">
      {/* Top bar — minimal, always present */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center gap-3 bg-ink/55 px-4 py-2.5 text-paper backdrop-blur-sm">
        <Link
          href={`/opere/${slug}`}
          aria-label="Torna alla scheda dell'opera"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-paper/40 text-xl transition-colors hover:bg-paper/10 focus-ring"
        >
          <span aria-hidden>‹</span>
        </Link>
        <div className="min-w-0 flex-1 text-center">
          <span className="block truncate font-serif text-[17px] leading-tight">{title}</span>
          <span className="block font-mono text-[10px] uppercase tracking-overline text-paper/70">
            Modalità AR · Inquadra l&apos;opera
          </span>
        </div>
        <span
          aria-label="Contenuti in italiano"
          className="flex h-8 shrink-0 items-center rounded-full border border-paper/40 px-2.5 font-mono text-[11px]"
        >
          IT
        </span>
      </header>

      {live ? (
        <div className="relative flex-1">
          {/* Camera layer / demo backdrop */}
          {phase === "granted" ? (
            <video
              ref={videoRef}
              muted
              playsInline
              autoPlay
              aria-label="Anteprima dal vivo della fotocamera"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="hatch absolute inset-0" aria-hidden />
          )}

          {phase === "denied" && (
            <div className="absolute inset-x-0 top-20 z-10 flex justify-center px-4">
              <p className="rounded-full border border-ink/30 bg-paper/90 px-3.5 py-1.5 text-center font-mono text-[11px] uppercase tracking-overline text-ink-80">
                Fotocamera non disponibile — anteprima dimostrativa
              </p>
            </div>
          )}

          {/* Viewfinder frame — corner brackets, purely decorative */}
          <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="relative h-[52vmin] max-h-72 w-[52vmin] max-w-72 -translate-y-8">
              <span className="absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-paper/90" />
              <span className="absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-paper/90" />
              <span className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-paper/90" />
              <span className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-paper/90" />
            </div>
          </div>

          {/* Bottom info card */}
          <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5">
            <div className="mx-auto max-w-md rounded-2xl bg-ink/55 p-4 text-paper backdrop-blur-sm">
              <div className="font-mono text-[10px] uppercase tracking-overline text-paper/70">
                {hamletArea} · {category}
              </div>
              <h1 className="mt-1.5 font-serif text-2xl leading-[1.06]">{title}</h1>
              <p className="mt-1 text-[14px] text-paper/80">
                {artist} · {year}
              </p>
              <div className="mt-3">
                <AccessBadge state={accessState} raw={accessRaw} size="sm" />
              </div>
              {/* Honesty line — never claim real tracking */}
              <p className="mt-3 font-mono text-[10px] uppercase leading-relaxed tracking-overline text-paper/60">
                Riconoscimento dell&apos;opera in sviluppo — contenuti mostrati manualmente
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  disabled
                  aria-disabled
                  aria-label="Ascolta — audioguida in preparazione"
                  title="Audioguida in preparazione"
                  className="flex h-11 flex-1 items-center justify-center rounded-xl border border-dashed border-paper/40 text-[14px] text-paper/60"
                >
                  Ascolta
                </button>
                <Link
                  href={`/opere/${slug}`}
                  aria-label={`Apri la scheda di ${title}`}
                  className="flex h-11 flex-1 items-center justify-center rounded-xl border border-paper/70 text-[14px] transition-colors hover:bg-paper/10 focus-ring"
                >
                  Scheda
                </Link>
                <Link
                  href={`/esplora?opera=${slug}`}
                  aria-label="Apri la mappa"
                  className="flex h-11 flex-1 items-center justify-center rounded-xl border border-paper/70 text-[14px] transition-colors hover:bg-paper/10 focus-ring"
                >
                  Mappa
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Pre-permission screen — explains what happens before asking */
        <div className="flex flex-1 flex-col items-center justify-center px-6 pb-10 pt-24 text-center text-paper">
          <span className="font-mono text-[11px] uppercase tracking-overline text-paper/60">
            Modalità AR
          </span>
          <h1 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">
            Inquadra l&apos;opera
          </h1>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-paper/80">
            Attivando la fotocamera vedrai l&apos;ambiente intorno a te con la scheda
            dell&apos;opera in sovraimpressione. L&apos;immagine resta sul tuo dispositivo:
            non viene registrata né inviata.
          </p>
          <button
            type="button"
            onClick={startCamera}
            disabled={phase === "requesting"}
            className="mt-8 flex h-14 min-w-[240px] items-center justify-center rounded-2xl bg-terracotta px-8 text-lg text-paper transition-colors hover:bg-terracotta-dark focus-ring disabled:opacity-60"
          >
            {phase === "requesting" ? "Attivazione in corso…" : "Attiva la fotocamera"}
          </button>
          <p className="mt-5 max-w-sm font-mono text-[10px] uppercase leading-relaxed tracking-overline text-paper/50">
            Riconoscimento dell&apos;opera in sviluppo — contenuti mostrati manualmente
          </p>
        </div>
      )}
    </div>
  );
}
