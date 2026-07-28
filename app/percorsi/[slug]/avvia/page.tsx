import { notFound } from "next/navigation";
import {
  routes,
  routeBySlug,
  workBySlug,
  artistBySlug,
} from "@/lib/collection";
import { routeIsNight } from "@/components/route-card";
import { mapsRouteUrl, workQuery } from "@/lib/maps";
import { ActiveRouteClient, type ActiveStop } from "./active-route-client";

export function generateStaticParams() {
  return routes.map((r) => ({ slug: r.slug }));
}

export default async function AvviaPercorsoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const route = routeBySlug(slug);
  if (!route) notFound();

  const stops: ActiveStop[] = route.stops.map((stop) => {
    const work = stop.workSlug ? workBySlug(stop.workSlug) : undefined;
    const artist = work ? artistBySlug(work.artistSlug) : undefined;
    return {
      key: stop.raw,
      title: stop.raw,
      artistName: artist ? artist.name : undefined,
      accessState: work?.accessState,
      accessRaw: work?.accessRaw,
      workSlug: work?.slug,
      point: work?.point,
    };
  });

  // Start "in progress" at the second stop (or the first if it's a single-stop route).
  const currentIndex = stops.length > 1 ? 1 : 0;

  const modeLabel = `${route.type} · ${route.duration} · ${route.stops.length} tappe`;

  const stopQueries = route.stops
    .map((s) => (s.workSlug ? workBySlug(s.workSlug) : undefined))
    .filter((w): w is NonNullable<typeof w> => Boolean(w))
    .map((w) => workQuery(w));
  const gmapsUrl = stopQueries.length >= 2 ? mapsRouteUrl(stopQueries) : undefined;

  return (
    <main className="bg-stone">
      <ActiveRouteClient
        routeTitle={route.title}
        modeLabel={modeLabel}
        routeSlug={route.slug}
        trace={route.trace}
        night={routeIsNight(route)}
        currentIndex={currentIndex}
        stops={stops}
        gmapsUrl={gmapsUrl}
      />
    </main>
  );
}
