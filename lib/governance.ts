// SERVER-ONLY access to the full seed: rights register, verification queue,
// sources and internal flagship build notes. Kept out of lib/collection.ts so
// none of this ships in client bundles (client components import collection.ts,
// which reads the slim macca.client.json emitted at build time).
import "server-only";
import seed from "@/src/data/macca.collection.json";
import type { RawFlagship, RawRights, RawVerification } from "./collection";

interface FullSeed {
  schema_version: string;
  generated_at: string;
  scope_note: string;
  sources: unknown[];
  flagship_content: RawFlagship[];
  asset_rights_register: RawRights[];
  verification_queue: RawVerification[];
}

const data = seed as unknown as FullSeed;

export const rightsRegister: RawRights[] = data.asset_rights_register;
export const verificationQueue: RawVerification[] = data.verification_queue;
export const flagshipContentFull: RawFlagship[] = data.flagship_content;

export const collectionMeta = {
  schemaVersion: data.schema_version,
  generatedAt: data.generated_at,
  scopeNote: data.scope_note,
  sources: data.sources,
};
