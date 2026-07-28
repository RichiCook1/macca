// All content types now derive from the single source of truth (collection.ts).
// Re-exported here so existing imports of "@/lib/types" keep working.
export type {
  Work,
  Artist,
  Location,
  Route,
  RouteStop,
  AccessClass,
  AccessClass as AccessState,
  MapConfidence,
  MapConfidence as LocationConfidence,
  DataConfidence,
  Category,
  AreaSlug,
  RawWork,
  RawLocation,
  RawRoute,
  RawFlagship,
  RawRights,
  RawVerification,
} from "./collection";

export interface MapPoint {
  x: number;
  y: number;
}
