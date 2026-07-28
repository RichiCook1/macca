import { works } from "./collection";
import type { Work } from "./collection";

export interface TimelineEntry {
  decade: Work["decade"];
  workSlug: string;
  title: string;
  meta: string;
  provisional: boolean;
  flagship: boolean;
}

// Derived from the works array — density grows naturally across the decades.
export const timeline: TimelineEntry[] = works
  .slice()
  .sort((a, b) => a.year - b.year)
  .map((w) => ({
    decade: w.decade,
    workSlug: w.slug,
    title: w.title,
    meta: `${w.artist} · ${w.year}`,
    provisional: w.provisional,
    flagship: w.isFlagship,
  }));
