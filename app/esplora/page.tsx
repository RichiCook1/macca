import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { ExploreClient } from "./explore-client";

export const metadata = { title: "Esplora la mappa — MACCA" };

// Core product screen. The map is persistent; results, selection and filters
// change around it. Desktop = split-screen; mobile = full-screen map + bottom
// sheet, sized to sit exactly above the app tab bar (--bnav).
// Suspense: ExploreClient reads ?opera= via useSearchParams for in-app
// deep links from artwork pages.
export default function ExplorePage() {
  return (
    <div
      className="flex flex-col"
      style={{ height: "calc(100dvh - var(--bnav, 0px))" }}
    >
      <SiteHeader />
      <div className="min-h-0 flex-1">
        <Suspense fallback={<div className="h-full w-full map-surface" />}>
          <ExploreClient />
        </Suspense>
      </div>
    </div>
  );
}
